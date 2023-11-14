# -*- coding: utf-8 -*-
#
# Description:  Download results (JSONs) from longterm[-dev].yourdomain.io for analysis:
#               - by user (external_id)
#               - all users
#               - data range
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      16.12.2021
# License:      MIT
# File:         download-results.py
# Usage:
#               download-results.py    # default location will be used
#               download-results.py --mode=json --server=prod --user_time=Jan,Schedule_overwriting_test1,1234567,2021-12-20T00:00:00,2021-12-21T23:59:59
# Note:         results contain only one first feedback, this script correct it temporary, final solution should be however in server

import sys
import json
import requests
import argparse
from datetime import datetime, timezone

from longterm_modules.target_url_users import Target
from longterm_modules.external_id import process_user_time

target = Target()


def download_results(external_id: str, start_date: str, stop_date: str) -> None:
    """
    download all results from watch-results endpoint
    :param external_id: hash(name, surname, phone, salt)
    :param start_date: isoformat, 2000 if not provided
    :param stop_date: isoformat, 2999 if not provided
    """
    print('\nDownload results results:')
    results = request_results(external_id, start_date, stop_date, 'watch-results')

    # feedback is necessary to complete "results"
    print('\nDownload results feedback:')
    feedback = request_results(external_id, start_date, stop_date, 'feedback-comments')

    # temporary solution, correct feedback in results
    # TODO: remove in future
    results = correct_feedback_in_results(results, feedback)

    if not external_id:
        save_combined_results('results_all.json', results)
    save_splitted_results('results', results)


def download_feedback(external_id: str, start_date: str, stop_date: str) -> None:
    """
    download all results from feedback-comments
    :param external_id: hash(name, surname, phone, salt)
    :param start_date: isoformat, 2000 if not provided
    :param stop_date: isoformat, 2999 if not provided
    """
    print('\nDownload results feedback:')

    results = request_results(external_id, start_date, stop_date, 'feedback-comments')
    if not external_id:
        save_combined_results('results_feedback_all.json', results)
    save_splitted_results('results_feedback', results)


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


def filter_date(results: list, start_date: str, stop_date: str) -> list:
    """
    filter out items outside date range
    :param results: input list
    :param start_date: filter before this date
    :param stop_date: filter after this date
    :return: output list
    """
    for result in results[:]:
        try:
            # TODO check if falttening to UTC is correct
            date_from_json = datetime.fromisoformat(result['date']).astimezone(timezone.utc).replace(tzinfo=None)
            if date_from_json < datetime.fromisoformat(start_date) or date_from_json > datetime.fromisoformat(stop_date):
                results.remove(result)
        except KeyError:
            print('ERROR: Incorrect JSON format, KeyError when parsing ["date"]')
        except ValueError:
            print('ERROR: Incorrect JSON format, ValueError when converting ...fromisoformat(result["date"])')
        except TypeError:
            print('ERROR: Incorrect JSON format, TypeError when comparing (maybe compare offset-naive and offset-aware datetimes) ')
    return results


def correct_feedback_in_results(results: list, feedback: list) -> list:
    """
    Replace feedback from json with all feedbacks
    temporal solution, move it to the server
    :param results:
    :param feedback:
    :return: results with feedbacks
    """
    out_results = []
    for result in results:
        # print(f'date: {result["date"]} {result["external_id"]}')
        result['result']['user_feedback'] = []

        # TODO:
        # doubt.... do filename is unique for results?

        try:
            for entry in feedback:
                if entry['external_id'] == result['external_id']:
                    if entry['video'] == result['result']['video']:
                        result['result']['user_feedback'].append(entry)
        except KeyError:
            pass
        out_results.append(result)

    return out_results


def save_combined_results(filename: str, results: list) -> None:
    """
    save all results to single file
    :param filename: json file name
    :param results: acquired results in a form of list
    """
    if results:
        with open(filename, 'w', encoding='utf8') as json_file:
            json.dump(results, json_file, indent=4, ensure_ascii=False)


def save_splitted_results(filename_prefix: str, results: list) -> None:
    """
    split results against external_id, and save to separate files
    :param filename_prefix: prefix for file name with json
    :param results: acquired results in a form of list
    """
    results_grouped = {}
    for result in results:
        try:
            external_id_from_json = result['external_id']
        except (ValueError, KeyError):
            print(f'ERROR: JSON parsing error (ValueError or KeyError)')
            continue
        try:
            results_grouped[external_id_from_json].append(result)
        except KeyError:
            results_grouped[external_id_from_json] = [result]

    for key, value in results_grouped.items():
        # TODO: sorting by isoformat string is ok?
        sorted_value = sorted(value, key=lambda d: d['date'])
        if key:
            filename = f'{filename_prefix}_{key}.json'
            print(f'processing external_id: {key}')
            with open(filename, 'w', encoding='utf8') as json_file:
                json.dump(sorted_value, json_file, indent=4, ensure_ascii=False)


def get_all_ids_from_server():
    """
    Return all ids from server
    :return: list of ids
    """
    url = f'{target.server_url}/api/users/'

    response = requests.get(url, headers=target.headers)
    if response.status_code != 200:
        print(f'ERROR: Users downloading error: {response.status_code}\n\n')
        sys.exit(1)

    try:
        content = json.loads(response.content)
    except NameError:
        sys.exit(1)
    except TypeError:
        print('ERROR: NO JSON file for processing')
        sys.exit(1)
    except json.JSONDecodeError:
        print('ERROR: JSONDecodeError')
        sys.exit(1)

    results = []
    for entry in content:
        try:
            results.append(entry['external_id'])
        except KeyError:
            pass

    return results


def main(*args):
    """
    Main function
    pass arguments from command line to call it from shell or from other script (backup.py)
    :param args: arguments from command line
    """

    parser = argparse.ArgumentParser(prog='download-results.py',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     epilog='Example of use:\npython ./scripts/download-results.py '
                                            '--server=dev')
    parser.add_argument('--server', nargs='?', type=str, default='dev',
                        help='[prod, dev, https://], predefined PRODuction, DEVelopment server, any sever ')
    parser.add_argument('--token', nargs='?', type=str,
                        help='TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev}')
    parser.add_argument('--mode', nargs='?', type=str, default='feedback+results',
                        help='{feedback,results,feedback+results}, download data related with study, save it in json format')
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
    arguments = parser.parse_args(args[0])

    if arguments.server == 'prod':
        target.predefined_prod()
    elif arguments.server == 'dev':
        target.predefined_dev()
    else:
        target.set_server_url(arguments.server)
        target.set_header_from_token(arguments.token)

    print(f'current config (you can change it with programs argument):\n\t'
          f'server: {target.server_url}\n\t'
          f'token: {target.headers["Authorization"]}\n\t'
          f'mode: {arguments.mode}\n\t',
          f'user_time: {arguments.user_time}\n\t',
          f'external_id_time: {arguments.external_id_time}\n\t',
          f'excel_time: {arguments.excel_time}\n\t')

    ids_start_stop_list = process_user_time(arguments.user_time, arguments.external_id_time, arguments.excel_time)

    if not ids_start_stop_list:
        print('ERROR: no external_id to download')
        sys.exit(1)

    # external_id == None
    if not ids_start_stop_list[0][0]:
        external_ids = get_all_ids_from_server()
        start_date = ids_start_stop_list[0][1]
        stop_date = ids_start_stop_list[0][2]
        ids_start_stop_list = []
        for external_id in external_ids:
            ids_start_stop_list.append((external_id, start_date, stop_date))

    for external_id, start_date, stop_date in ids_start_stop_list:
        if 'feedback' in arguments.mode:
            download_feedback(external_id, start_date, stop_date)

        if 'results' in arguments.mode:
            download_results(external_id, start_date, stop_date)


if __name__ == "__main__":
    main(sys.argv[1:])
