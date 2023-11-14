# -*- coding: utf-8 -*-
#
# Description:  Download results from longterm[-dev].yourdomain.io, plot gyro/acc/brithtness sequences:
#               - by user (external_id)
#               - data range
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      30.01.2022
# License:      MIT
# File:         download-plot-gyro-sequence.py
# Usage:
#               download-plot-gyro-sequence.py --key ~/.ssh/media@longterm.yourdomain.io
#               download-plot-gyro-sequence.py    # default location will be used
#               download-plot-gyro-sequence.py --mode=json --server=prod --user_time=Jan,Schedule_overwriting_test1,1234567,2021-12-20T00:00:00,2021-12-21T23:59:59
#               Note: --user_time=* is not allowed

import json

import requests
import argparse
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime

from longterm_modules.target_url_users import Target
from longterm_modules.external_id import process_user_time

target = Target()
sns.set_style("whitegrid")


def download_and_process_results(external_id: str, start_date: str, stop_date: str) -> None:
    """
    download all results from watch-results endpoint
    :param external_id: hash(name, surname, phone, salt)
    :param start_date: isoformat, 2000 if not provided
    :param stop_date: isoformat, 2999 if not provided
    """
    print('\nDownload results feedback:')
    feedback = request_results(external_id, start_date, stop_date, 'feedback-comments')

    print('\nDownload results results:')
    results = request_results(external_id, start_date, stop_date, 'watch-results')
    process_results(results, feedback)


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


def acc_stats(study_acc: dict) -> tuple:
    """
    calculate acc stats
    :param timestamps: list of timestamps
    :param acc_x: list of acc_x
    :param acc_y: list of acc_y
    :param acc_z: list of acc_z
    :return: tuple with stats
    """
    timestamps = study_acc['timestamp']
    if not timestamps:
        print('Warning: report does not contain acc data (!)')
        return 0, 0, 0, 0, 0, 0

    # calc minimum 3 seconds or 10% from timestamps
    min_timestamps_index_10p = int(len(timestamps) * 0.1)
    try:
        min_timestamps_index_3s = int(np.argmax(np.array(timestamps) > 3))
    except ValueError:
        min_timestamps_index_3s = min_timestamps_index_10p  # too short data
    min_timestamps_index = max(min_timestamps_index_10p, min_timestamps_index_3s)

    acc_x = study_acc['x'][min_timestamps_index:]
    acc_y = study_acc['y'][min_timestamps_index:]
    acc_z = study_acc['z'][min_timestamps_index:]

    x_med = np.median(acc_x)
    x_std = np.std(acc_x)
    y_med = np.median(acc_y)
    y_std = np.std(acc_y)
    z_med = np.median(acc_z)
    z_std = np.std(acc_z)
    return x_med, x_std, y_med, y_std, z_med, z_std


def process_results(results: list, feedback: list) -> None:
    """
    process results (draw plots of gyro...)
    :param results: acquired results in a form of list
    :param feedback: user feedback
    """
    for result in results:
        print(f'date: {result["date"]} {result["external_id"]}')
        try:
            study_date = result['date']
            study_video = result['result']['video']
            study_playback = {
                'timestamp': result['result']['playback_data']['timestamp'],
                'brightness': result['result']['playback_data']['brightness'],
                'full_screen_status': result['result']['playback_data']['fullscreen_status']
            }

            datestamp = [datetime.fromisoformat(data).timestamp() for data in result['result']['gyroscope_data']['timestamp']]
            datestamp_diff = [stamp-datestamp[0] for stamp in datestamp]
            study_gyro = {
                'timestamp': datestamp_diff,
                'x': result['result']['gyroscope_data']['x'],
                'y': result['result']['gyroscope_data']['y'],
                'z': result['result']['gyroscope_data']['z']
            }

            datestamp = [datetime.fromisoformat(data).timestamp() for data in result['result']['accelerometer_data']['timestamp']]
            datestamp_diff = [stamp-datestamp[0] for stamp in datestamp]
            study_acc = {
                'timestamp': datestamp_diff,
                'x': result['result']['accelerometer_data']['x'],
                'y': result['result']['accelerometer_data']['y'],
                'z': result['result']['accelerometer_data']['z']
            }
            study_user_feedback = result['result']['user_feedback']
        except KeyError:
            print('SKIPPING - old data format or missing data')
            continue

        x_med, x_std, y_med, y_std, z_med, z_std = acc_stats(study_acc)
        print(f'\n x_med: {x_med:.3f} x_std: {x_std:.3f}\n y_med: {y_med:.3f} y_std: {y_std:.3f}\n z_med: {z_med:.3f} z_std: {z_std:.3f}')

        plt.figure(figsize=(10, 10))
        plt.suptitle(f'feedback: study data: {study_date}:\n'
                     f'{feedback_parser(feedback, study_video)}')

        ax1 = plt.subplot(211)
        ax1.plot(study_gyro['timestamp'], study_gyro['x'], 'r')
        ax1.plot(study_gyro['timestamp'], study_gyro['y'], 'g')
        ax1.plot(study_gyro['timestamp'], study_gyro['z'], 'b')
        ax1.legend(['x', 'y', 'z'], loc='upper right')
        plt.gca().set_ylim([-2.5, 2.5])
        plt.title(f'gyroscopic data: "gyroscope_data"')

        ax2 = plt.subplot(212, sharex=ax1)
        ax2.plot(study_acc['timestamp'], study_acc['x'], 'r')
        ax2.plot(study_acc['timestamp'], study_acc['y'], 'g')
        ax2.plot(study_acc['timestamp'], study_acc['z'], 'b')
        ax2.legend(['x', 'y', 'z'], loc='upper right')
        plt.gca().set_ylim([-1.2, 1.2])
        plt.gcf().autofmt_xdate()
        plt.title(f'accelerometer data: "accelerometer_data"')
        plt.xlabel('[s]')

        # plt.figure(figsize=(10, 5))
        # plt.plot(study_playback['timestamp'], study_playback['brightness'])
        # plt.gcf().autofmt_xdate()
        plt.show()


def feedback_parser(feedback: list, study_video: str) -> str:
    """
    search for feedback str in a list by date
    :param feedback: list of feedback
    :param study_video: video name (id)
    :return:
    """
    return_feedbacks = []
    for feed in feedback:
        try:
            feedback_video = feed['video']
        except KeyError:
            print('Missing "video" key in feedback, SKIPPING')
            continue
        if study_video == feedback_video:
            return_feedbacks.append({
                'comment': feed['comment'],
                'date': feed['date']
            })

    return_str_feedbacks = ''
    for feed_str in return_feedbacks:
        return_str_feedbacks += f'{feed_str["date"]}: {feed_str["comment"]}\n'
    return return_str_feedbacks


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog='download-plot-gyro-sequence.py',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     epilog='Example of use:\npython ./scripts/download-results.py '
                                            '--key ~/.ssh/media-dev@longterm-dev.yourdomain.io '
                                            '--server=dev --user_time=name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]'
                                            '\n\nThis activity doesnt work for wildcard user_time=",,,,"')
    parser.add_argument('--server', nargs='?', type=str, default='dev',
                        help='[prod, dev, https://], predefined PRODuction, DEVelopment server, any sever ')
    parser.add_argument('--token', nargs='?', type=str,
                        help='TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev}')
    parser.add_argument('--user_time', nargs='?', type=str, default='',
                        help='{" "; "name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]"}'
                             ' download JSONs for all users or specific one with optional start/stop date')
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
          f'user_time: {args.user_time}\n\t',
          f'external_id_time: {args.external_id_time}\n\t',
          f'excel_time: {args.excel_time}\n\t')

    for external_id, start_date, stop_date in process_user_time(args.user_time, args.external_id_time, args.excel_time):
        if external_id:
            download_and_process_results(external_id, start_date, stop_date)
        else:
            print('\nThis analysis is for a single user. Sequence analysis for all user is not supported\n')
