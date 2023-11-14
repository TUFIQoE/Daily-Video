# -*- coding: utf-8 -*-
#
# Description:  Download all videos and jsons from longterm[-dev].yourdomain.io
#               - verify content
#               - backup
#               - calc sha256sum
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      09.11.2021
# License:      MIT
# File:         download-schedule.py
# Note:         if video location is not provided, the default 'videos_from_server' is used
# Usage:
#               download-schedule.py --key ~/.ssh/media@longterm.yourdomain.io --mode=json --server=dev ./videos_from_server
#               download-schedule.py    # default location will be used
#               download-schedule.py --mode=json --server=prod --user_time=Jan,Schedule_overwriting_test1,1234567,2021-12-20T00:00:00,2021-12-21T23:59:59

import os
import sys
import json
import hashlib
import requests
import argparse
from datetime import datetime

from longterm_modules.target_url_users import Target
from longterm_modules.external_id import process_user_time

target = Target()


def download_videos(dest_location: str, ssh_key: str) -> None:
    """
    download videos from server to local filesystem
    :param dest_location: location on local filesystem, default is 'videos_from_server'
    :param ssh_key: path to ssh key to the server
    """
    command = f'rsync --delete -vre "ssh -i {ssh_key}"'
    command += f' -r {target.media_user}@{target.server_url_without_protocol()}:media/videos/ {dest_location}'
    print(command)
    stream = os.popen(command)
    output = stream.read()
    print('----------- rsync output: ----------------')
    print(output)


def calc_and_print_hashes(dest_location: str) -> None:
    """
    calculate and print hashes of video from the location dest_location
    :param dest_location: location on local filesystem
    """
    print('----------- video hashes: ----------------')

    abs_location = os.path.abspath(dest_location)
    for subdir, dirs, files in os.walk(abs_location):
        for file in files:
            abs_path = os.path.join(subdir, file)
            sub_path = abs_path.replace(os.path.abspath('.'), '.')
            sha256sum = calc_sha256sum(abs_path)
            print(f'{sha256sum}: {sub_path}')


def calc_sha256sum(file_location: str) -> str:
    """
    calc hash from given file
    :param file_location: abs location
    :return: hash
    """
    hash_sha256 = None
    with open(file_location, 'rb') as fp:
        # TODO: could be optimized for memory footprint (if file is large)
        binary_file = fp.read()
        hash_sha256 = hashlib.sha256(binary_file).hexdigest()
    return hash_sha256


def download_jsons(external_id: str, start_date: str, stop_date: str) -> None:
    """
    Download all jsons from server, and save it
    :param external_id: hash(name, surname, phone, salt)
    :param start_date: isoformat, 2000 if not provided
    :param stop_date: isoformat, 2999 if not provided
    """
    print('Download jsons:')
    schedules = request_schedules(external_id)
    for user in schedules:
        try:
            external_id_from_json = user['schedule']['external_id']
            print(f'\tprocessing external_id={external_id_from_json}')
            user = filter_schedule_time(user, start_date=start_date, stop_date=stop_date)
            filename = f'schedule_{external_id_from_json}.json'
            with open(filename, 'w', encoding='utf8') as json_file:
                json.dump(user['schedule'], json_file, indent=4, ensure_ascii=False)
        except (ValueError, KeyError):
            print(f'ERROR: User ID {user["id"]} has no data')


def request_schedules(external_id: str) -> dict:
    """
    Request for all schedules
    :param external_id: external_id
    :return: schedules in dict, empty if error
    """
    content = None
    user_id = ''
    if external_id:
        user_id = f'?external_id={external_id}'
    try:
        response = requests.get(f'{target.server_url}/api/users/schedules{user_id}', headers=target.headers)
        if response.status_code == 404:
            print('HTTP error 404\nConnection unavailable (VPN broken?) or wrong credentials\n\n')
        elif response.status_code == 200:
            # print('Success!!!: Schedule downloaded\n\n')
            content = response.content
        else:
            print(f'Schedule downloading error: {response.status_code}\n\n')
    except requests.exceptions.RequestException as e:
        print(f'Schedule uploading, request error: {e}')

    try:
        return json.loads(content)
    except NameError:
        return {}
    except TypeError:
        print('NO JSON file for processing')
        return {}
    except json.JSONDecodeError:
        print('JSONDecodeError')
        return {}


def filter_schedule_time(user: dict, start_date: str, stop_date: str) -> dict:
    """
    Filter schedule by given time
    :param user: dictionary with schedule
    :param start_date: from this date
    :param stop_date: to this date
    :return: filtered schedule
    """
    for schedule in user['schedule']['schedule'][:]:
        try:
            if datetime.fromisoformat(schedule['start']) < datetime.fromisoformat(start_date):
                user['schedule']['schedule'].remove(schedule)
                continue
            if datetime.fromisoformat(schedule['end']) > datetime.fromisoformat(stop_date):
                user['schedule']['schedule'].remove(schedule)
        except TypeError:
            print(f'Missing or incorrect date format: {schedule["end"]}')
        except KeyError:
            print('Incorrect JSON format, KeyError when parsing schedule["stop"] or schedule["start"]')
    return user


def main(*args):
    """
    Main function
    pass arguments from command line to call it from shell or from other script (backup.py)
    :param args: arguments from command line
    """

    parser = argparse.ArgumentParser(prog='download-schedule.py',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     epilog='Example of use:\npython ./scripts/download-schedule.py '
                                            '--key ~/.ssh/media@longterm.yourdomain.io --server=dev --mode=video+json '
                                            './videos_from_server')
    parser.add_argument('--server', nargs='?', type=str, default='dev',
                        help='[prod, dev, https://], predefined PRODuction, DEVelopment server, any sever ')
    parser.add_argument('--key', nargs='?', type=str, default='~/.ssh/media@longterm.yourdomain.io',
                        help='location of ssh key for media@longterm.yourdomain.io')
    parser.add_argument('--token', nargs='?', type=str,
                        help='TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev}')
    parser.add_argument('--mode', nargs='?', type=str, default='video+json',
                        help='{video, json, video+json}, download videos or/and jsons')
    parser.add_argument('--user_time', nargs='?', type=str, default='',
                        help='{" ", "name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]"}'
                             ' download JSONs for all users or specific one with optional start/stop date')
    parser.add_argument('--external_id_time', nargs='?', type=str, default='',
                        help='{" ", "342afb0bd--fake--fake--ff24736ff228fc2848ae338f3d7e77f67f3e34f2568[,2021-01-01T00:00,2022-01-01T23:59]"}'
                             ' download JSONs for single users with optional start/stop date')
    parser.add_argument('--excel_time', nargs='?', type=str, default='',
                        help='{" ", "./users.xlsx"}'
                             ' download JSONs for users listed in excel file with start/stop date,'
                             ' all formats supported by Pandas, details on wiki')
    parser.add_argument('--video_path', nargs='?', type=str, default='./video_from_server/',
                        help='destination of video files uploaded from downloaded')

    args = parser.parse_args(args[0])

    if args.server == 'prod':
        target.predefined_prod()
    elif args.server == 'dev':
        target.predefined_dev()
    else:
        target.set_server_url(args.server)
        target.set_ssh_key(args.key)
        target.set_header_from_token(args.token)

    print(f'current config (you can change it with programs argument):\n\t'
          f'server: {target.server_url}\n\t'
          f'token: {target.headers["Authorization"]}\n\t'
          f'ssh key: {target.ssh_key}\n\tserver: {target.server_url}',
          f'mode: {args.mode}\n\t',
          f'user_time: {args.user_time}\n\t',
          f'external_id_time: {args.external_id_time}\n\t',
          f'excel_time: {args.excel_time}\n\t',
          f'video_path: {args.video_path}\n')

    if 'video' in args.mode:
        download_videos(args.video_path, args.key)
        calc_and_print_hashes(args.video_path)

    if 'json' in args.mode:
        for external_id, start_date, stop_date in process_user_time(args.user_time, args.external_id_time, args.excel_time):
            print(f'{external_id}\n {start_date}, {stop_date}\n\n')
            download_jsons(external_id, start_date, stop_date)


if __name__ == '__main__':
    main(sys.argv[1:])
