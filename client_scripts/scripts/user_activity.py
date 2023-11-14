# -*- coding: utf-8 -*-
#
# Description:  Sumarize user activity in csv file
#               - by user_time
#               - by external_id
#               - by exel file
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      17.04.2022
# License:      MIT
# File:         user_activity.py
# Usage:
#               user_activity.py --server=dev
#               user_activity.py    # default download all user activity from dev server
#               user_activity.py --server=prod --user_time=Jan,Schedule_overwriting_test1,1234567,2021-12-20T00:00:00,2021-12-21T23:59:59
# csv legend:
#               '-' no entry for this day
#               'ok' watch movie without speedup/slowdown
#               '<' watch movie with slowdown
#               '>' watch movie with speedup
#               additional info if screen down: arrow down or ??? if no accelerometer data
#               additional marks: 'x' no query, 'value' query with response

import os
import json
import requests
import argparse
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

from longterm_modules.target_url_users import Target
from longterm_modules.external_id import process_user_time

target = Target()


def process_user(external_id: str, start_date: str, stop_date: str, filename: str, sec_margin=3, report_days=30) -> None:
    """
    Process single user single_user_activity
    :param external_id: external_id
    :param start_date: filter all before
    :param stop_date: filter all after
    :param sec_margin: seconds margin
    :param report_days: report days
    :param filename: csv filename, append to csv file, create if necessary
    """
    results = request_results(external_id, start_date, stop_date, 'watch-results')

    # last 30 days
    activity_days = []
    for day in range(report_days):
        activity_days.append(datetime.today().date()-timedelta(days=report_days-day-1))

    single_user_activity = process_activity(results, external_id, activity_days, sec_margin)
    append_activity_to_csv(single_user_activity, filename)


def request_results(external_id: str, start_date: str, stop_date: str, endpoint: str) -> list:
    """
    Request for all schedules
    :param external_id: external_id
    :param start_date: filter all before
    :param stop_date: filter all after
    :param endpoint: endpoint (tested for feedback-comments and watch-results only)
    :return: schedules in list, empty if error
    """
    content = None
    url = f'{target.server_url}/api/{endpoint}?'
    if external_id:
        url += f'external_id={external_id}&'
    url += f'start_date={start_date}&stop_date={stop_date}'
    # print(f'DEBUG URL: {url}')
    try:
        response = requests.get(url, headers=target.headers)
        if response.status_code == 404:
            print('HTTP error 404\nConnection unavailable (VPN broken?) or wrong credentials\n\n')
        elif response.status_code == 200:
            # print('Success!!!: Schedule downloaded\n\n')
            content = response.content
        else:
            print(f'ERROR: Results downloading error: {response.status_code}\n\n')
    except requests.exceptions.RequestException as e:
        print(f'ERROR: Results downloading, request error: {e}')

    try:
        return json.loads(content)
    except NameError:
        return []
    except TypeError:
        print('ERROR: NO JSON file for processing')
        return []
    except json.JSONDecodeError:
        print('ERROR: JSONDecodeError')
        return []


def process_activity(results: list, external_id: str, activity_days: list, sec_margin: int) -> dict:
    """
    Process all activity. Return last 30 days activity.
    :param results: results in list (could be empty)
    :param external_id: external_id
    :param activity_days: list of days for register activity
    :param sec_margin: margin in seconds
    :return: activity in list
    """

    # single row with: no, external_id, activity from last 30 days
    activity = {}

    for day in activity_days:
        activity[day.isoformat()] = '-'  # no entry for this day

    for result in results:
        if result['external_id'] != external_id:
            print(f'ERROR: external_id {external_id} not found in results')
            continue

        try:
            playback_datetime = datetime.fromisoformat(result['result']['playback_started'])
            playback_datetime = playback_datetime.date()
        except KeyError:
            continue

        try:
            day_idx = activity_days.index(playback_datetime)
        except ValueError:
            continue

        day_status = status_report(result, sec_margin)
        z_status = status_orientation(result, -0.8)
        ans_status = status_answers(result)
        activity[activity_days[day_idx].isoformat()] = f'{day_status}{z_status}{ans_status}'

    activity['external_id'] = external_id
    return activity


def status_report(result: dict, sec_margin: float) -> str:
    """
    Return status report for single day
    :param result: single result
    :param sec_margin: delta in seconds
    :return: status report
    """
    try:
        playback_started = result['result']['playback_started']
        playback_ended = result['result']['playback_ended']
        video_duration = result['result']['video_duration']
    except KeyError:
        return '?'

    playback_started = datetime.fromisoformat(playback_started)
    playback_ended = datetime.fromisoformat(playback_ended)
    video_duration = video_duration/1000
    playback_duration = (playback_ended - playback_started).total_seconds()

    # print(f'DEBUG: real data:{playback_duration - video_duration:.2f}', end=' ')

    if playback_duration - video_duration > sec_margin:
        return f'+{playback_duration - video_duration:.0f}s'
    elif playback_duration - video_duration < -sec_margin:
        return f'{playback_duration - video_duration:.0f}s'
    else:
        return 'ok'


def status_orientation(result: dict, z_treshold: float) -> str:
    """
    Detect screen-down mobile phone orientation
    returns special character or empty string
    :param result: json with results
    :param z_treshold: z-axis treshold below which is considered down, eg -0.8
    :return: UTF8 "arrow down", "?" or empty string
    """

    timestamp_absolute = [datetime.fromisoformat(data).timestamp()
                          for data in result['result']['accelerometer_data']['timestamp']]
    if not timestamp_absolute:
        return ' ???'

    timestamps = [stamp - timestamp_absolute[0] for stamp in timestamp_absolute]
    min_timestamps_index_10p = int(len(timestamps) * 0.1)
    try:
        min_timestamps_index_3s = int(np.argmax(np.array(timestamps) > 3))
    except ValueError:
        min_timestamps_index_3s = min_timestamps_index_10p  # too short data
    min_timestamps_index = max(min_timestamps_index_10p, min_timestamps_index_3s)

    acc_z = result['result']['accelerometer_data']['z']
    acc_z = acc_z[min_timestamps_index:]
    z_std = np.std(acc_z)
    z_med = np.median(acc_z)

    if z_med < z_treshold:
        return ' \u2193'
    else:
        return ''


def status_answers(result: dict) -> str:
    """
    Return status of responses (answers)
    - empty string if there was no query
    - "x" if there was query and no response
    - "value" if there was query and response
    :param result: single result
    :return: status answers
    """

    try:
        responses = result['result']['reply_form']['content']
    except KeyError:
        # no query, no answers
        return ''

    for response in responses:
        if response['type'] == 'MOS' and response['optional_id'] == 'q2':
            try:
                return f' {response["answer"]["value"]}'
            except KeyError:
                return ' x'
    return ''


def append_activity_to_csv(activity: dict, filename: str) -> None:
    """
    Append activity to csv file
    :param activity: activity from one user
    :param filename: csv filename, append to csv file, create if necessary
    """

    # append activity to csv filename
    if os.path.isfile(filename):
        df = pd.read_csv(filename)
        activity['no'] = df['no'].to_list()[-1]+1   # add no to last row
        df = pd.concat([df, pd.DataFrame([activity])], ignore_index=True)
        df.to_csv(filename, index=False)
    else:
        activity['no'] = 1
        df = pd.DataFrame(activity, index=[0])
        cols = df.columns.to_list()
        sorted_cols = ['no', 'external_id']  # move no/dat/external_id to front
        sorted_cols.extend(sorted(cols[:-2]))
        df.to_csv(filename, index=False, columns=sorted_cols)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog='user_activity.py',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     epilog='Example of use:\npython ./scripts/user_activity.py '
                                            '--server=dev -excel_time=users_prod_all_2022_04.xlsx'
                                            '\n\nThis activity requires list of users. It doesnt "for all users"')
    parser.add_argument('--server', nargs='?', type=str, default='dev',
                        help='[prod, dev, https://], predefined PRODuction, DEVelopment server, any sever ')
    parser.add_argument('--token', nargs='?', type=str,
                        help='TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev}')
    parser.add_argument('--sec_margin', nargs='?', type=int, default=3,
                        help='+-seconds margin for watching video related to video duration')
    parser.add_argument('--report_days', nargs='?', type=int, default=30,
                        help='number of days to process')
    parser.add_argument('--user_time', nargs='?', type=str, default='',
                        help='{" "; "name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]"}'
                             ' download JSONs for specific usr with optional start/stop date,'
                             ' this activity requires list of users. It doesnt "for all users')
    parser.add_argument('--external_id_time', nargs='?', type=str, default='',
                        help='{" ", "342afb0bd765221057bd4ff24736ff228fc2848ae338f3d7e77f67f3e34f2568[,2021-01-01T00:00,2022-01-01T23:59]"}'
                             ' download JSONs for single users with optional start/stop date')
    parser.add_argument('--excel_time', nargs='?', type=str, default='',
                        help='{" ", "./users.xlsx"}'
                             ' download JSONs for users listed in excel file with start/stop date,'
                             ' all formats supported by Pandas, details on wiki')
    args = parser.parse_args()

    if args.server == 'prod':
        target.predefined_prod()
    elif args.server == 'dev':
        target.predefined_dev()
    else:
        target.set_server_url(args.server)
        target.set_header_from_token(args.token)

    print(f'current config (you can change it with programs argument):\n\t'
          f'server: {target.server_url}\n\t'
          f'token: {target.headers["Authorization"]}\n\t'
          f'sec_margin: {args.sec_margin}\n\t',
          f'report_days: {args.report_days}\n\t',
          f'user_time: {args.user_time}\n\t',
          f'external_id_time: {args.external_id_time}\n\t',
          f'excel_time: {args.excel_time}\n\t')

    target_file = 'user_activity.csv'

    # remove target_file if exists
    if os.path.exists(target_file):
        os.remove(target_file)

    for external_id, start_date, stop_date in process_user_time(args.user_time, args.external_id_time, args.excel_time):
        if external_id:
            print(f'processing user {external_id}')
            process_user(external_id, start_date, stop_date, target_file, args.sec_margin, args.report_days)
        else:
            print('ERROR: external_id is empty')
