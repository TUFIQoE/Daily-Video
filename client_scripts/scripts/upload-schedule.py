# -*- coding: utf-8 -*-
#
# Description:  upload videos (rsync) and schedule-xxx.json (REST API) to longterm[-dev].yourdomain.io
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      07.11.2021
# License:      MIT
# File:         upload-schedule.py
#

import os
import sys
import json
import hashlib
import argparse
import requests

from longterm_modules import external_id as external_id_from_names
from longterm_modules.target_url_users import Target

target = Target()


def create_md5sum_from_media(video_path: str) -> None:
    """
    To each video.mp4 create video.mp4.md5sum file with plain md5sum txt:
    md5sum filename.mp4 | awk '{print $1}' >filename.mp4.md5sum
    :param video_path:
    """
    # iterate over file in directory
    for file in os.listdir(video_path):
        if file.endswith('md5sum'):
            continue
        file_path = os.path.join(video_path, file)
        if os.path.isfile(file_path):
            with open(file_path, 'rb') as video_file:
                md5 = hashlib.md5(video_file.read()).hexdigest()+'\n'
                with open(file_path + '.md5sum', 'wt') as md5sum_file:
                    md5sum_file.write(md5)


def upload_media(video_path: str) -> bool:
    """
    upload video files to media@longterm.yourdomain.io
    notice, ~/.ssh/media@longterm.yourdomain.io is required
    print ssh output if error (possible ssh key is in wrong location or server unavailable)
    :param video_path: path to video dir
    :return: False if ssh error
    """

    # -I: ignore timestamps, overwrite destination - eg. corrupted files
    # -e: manage ssh-key
    # -r: recursive (subdirectories)
    # -v: remove in the future
    video_path_endswith = os.path.join(os.path.abspath(video_path), '')  # ensure '/' at the and
    command = f'rsync -vIe "ssh -i {target.ssh_key}" '
    command += f' {video_path_endswith}* {target.media_user}@{target.server_url_without_protocol()}:media/videos/'

    # print(command)
    stream = os.popen(command)
    output = stream.read()
    print('=================   rsync output:   ===================')
    print(output)
    print('=======================================================')

    # skipping subdirectories
    subfolders = [f.path for f in os.scandir(video_path_endswith) if f.is_dir()]
    if subfolders:
        print('\n==============   subfolders skipping:   ===============')
        for subfolder in subfolders:
            for root, dirs, files in os.walk(subfolder):
                for file in files:
                    print(f'IGNORING: {os.path.join(root, file)} -->  subdirectories are not allowed!!!')
        print('=======================================================\n')
    # TODO: false if ssh error?
    return True


def upload_jsons(jsons_path: str) -> None:
    """
    :param jsons_path: path to dir with jsons
    Upload json[s] from current directory. Print message if parsing error.
    """
    print('Parsing and uploading jsons:')
    abs_location = os.path.abspath(jsons_path)
    for filename in os.listdir(abs_location):
        if filename.endswith('.json'):
            print(f'processing json: {filename}')
            with open(os.path.join(abs_location, filename), 'r') as json_filename:
                try:
                    schedule = json.load(json_filename)
                except json.decoder.JSONDecodeError:
                    print(f'Wrong JSON format in file {filename}')
                    continue

                schedule['external_id'] = external_id_processing(schedule)
                schedule.pop('name', None)
                schedule.pop('surname', None)
                schedule.pop('phone', None)
                data = {'schedule': schedule}
                try:
                    response = requests.post(f'{target.server_url}/api/users/update_schedule/',
                                             json=data,
                                             headers=target.headers)
                    if response.status_code == 404:
                        print('HTTP error 404\nConnection unavailable (VPN broken?) or wrong credentials\n\n')
                    elif response.status_code == 200:
                        print(f'Schedule uploaded --> hash: {schedule["external_id"]}\n\n')
                    else:
                        print(f'Schedule uploading error: {response.status_code}\n\n')
                except requests.exceptions.RequestException as e:
                    print(f'Schedule uploading, request error: {e}')


def external_id_processing(schedule: dict) -> str:
    """
    determine external_id, if provided as "external_id" return it, in other case calculate from name/surname/phone
    :param schedule: dictionary with json
    :return: external_id
    """
    if 'external_id' in schedule:
        external_id = schedule['external_id']
        if external_id:  # if not empty
            return external_id

    try:
        return external_id_from_names.hash(schedule['name'], schedule['surname'], schedule['phone'])
    except KeyError:
        print('Missing "name", "surname" or "phone" in json')
        return 'non_unique_hash_'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='upload-schedule.py',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     epilog='Example of use:\npython ./scripts/upload-schedule.py --key ~/.ssh/media@longterm.yourdomain.io  --server=dev ./upload_schedule_v01/videos/ ./upload_schedule_v01')
    parser.add_argument('--server', nargs='?', type=str, default='dev',
                        help='[prod, dev, https://], predefined PRODuction, DEVelopment server, any sever')
    parser.add_argument('--key', nargs='?', type=str, default='~/.ssh/media@longterm.yourdomain.io',
                        help='location of ssh key for server eg.: media@longterm.yourdomain.io, ignored for predefined settings server={prod|dev}')
    parser.add_argument('--token', nargs='?', type=str,
                        help='TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev}')
    parser.add_argument('video_path', nargs='?', type=str, default='./videos/',
                        help='location of video files (allowed hierarchical subdirs structure)')
    parser.add_argument('jsons_path', nargs='?', type=str, default='./',
                        help='location of json files (flat structure, without subdirs)')
    args = parser.parse_args()

    if args.server == 'prod':
        print('\n\nUPLOAD TO PRODUCTION SERVER [y/N]')
        if input() != 'y':
            print('ABORT!!!')
            sys.exit()
        target.predefined_prod()
    elif args.server == 'dev':
        target.predefined_dev()
    else:
        target.set_server_url(args.server)
        target.set_ssh_key(args.key)
        target.set_header_from_token(args.token)

    print(f'current config (you can change it with programs argument):\n\t'
          f'server: {target.server_url}\n\t'
          f'ssh key: {target.ssh_key}\n\tserver: {target.server_url}'
          f'token: {target.headers["Authorization"]}\n\t'
          f'\n\tjsons_path: {args.jsons_path}\n\tvideo_path: {args.video_path}\n')

    create_md5sum_from_media(args.video_path)
    upload_media(args.video_path)
    upload_jsons(args.jsons_path)
