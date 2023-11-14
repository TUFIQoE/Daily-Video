# -*- coding: utf-8 -*-
#
# Description:  Download user feedback and save it in *.csv form
#               - by user_time
#               - by external_id
#               - by exel file
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      30.03.2022
# License:      MIT
# File:         user_feedback.py
# Usage:
#               user_feedback.py --server=dev
#               user_feedback.py    # default download all feedback from dev server
#               user_feedback.py --server=prod --user_time=Jan,Schedule_overwriting_test1,1234567,2021-12-20T00:00:00,2021-12-21T23:59:59

# copilot: https://github.com/github/copilot-docs/blob/main/docs/jetbrains/gettingstarted.md#getting-started-with-github-copilot-in-jetbrains


import json
import requests
import argparse
import pandas as pd

from longterm_modules.target_url_users import Target
from longterm_modules.external_id import process_user_time

target = Target()


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


def save_feedback_in_csv(filename: str, results: list) -> None:
    """
    save all results to csv
    :param filename: json file name
    :param results: acquired results in a form of list
    """

    # sort results by date
    results_sorted = sorted(results, key=lambda d: d['date'], reverse=True)
    res_date = [value['date'] for value in results_sorted]
    res_exiternal_id = [value['external_id'] for value in results_sorted]
    res_video = [value['video'] for value in results_sorted]
    res_comment = [value['comment'] for value in results_sorted]

    df = pd.DataFrame({'date': res_date, 'external_id': res_exiternal_id, 'video': res_video, 'comment': res_comment})
    df.to_csv(filename, index=False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog='user_feedback.py',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     epilog='Example of use:\npython ./scripts/user_feedback.py '                                            
                                            '--server=dev')
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
          f'ssh key: {target.ssh_key}\n\tserver: {target.server_url}',
          f'user_time: {args.user_time}\n\t',
          f'external_id_time: {args.external_id_time}\n\t',
          f'excel_time: {args.excel_time}\n\t')

    results = []
    for external_id, start_date, stop_date in process_user_time(args.user_time, args.external_id_time, args.excel_time):
        results += request_results(external_id, start_date, stop_date, 'feedback-comments')
    save_feedback_in_csv('user_feedback.csv', results)
