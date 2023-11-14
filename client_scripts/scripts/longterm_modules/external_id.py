# -*- coding: utf-8 -*-
#
# Description:  has for user anonymization, external_id = hash(name, surname, phone)
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      16.12.2021
# License:      MIT
# File:         external_id.py
# Note:         hash is salted

import hashlib
import pandas as pd
from datetime import datetime


def hash(name: str, surname: str, phone: str) -> str:
    """
    generate "external_id", sha256 truncated to 16 digits
    :param name: user name (from json)
    :param surname: user surname (from json)
    :param phone: user phone (from json)
    :return: hash
    """
    salt = 'your-salt-here'

    txt = f'{name}{surname}{phone}{salt}'.encode('UTF-8')
    return hashlib.sha256(txt).hexdigest()


def process_user_time(user_time: str, external_id_time: str, excel_time: str):
    """
    Process user id and time range. Priority: excel_time, external_id_time, user_time
    :param user_time: string in format: {name,surname,phone[,start_datatime, stop_datatime]
    :param external_id_time: string in format: {external_id[,start_datatime, stop_datatime]
    :param excel_time: path to excel with external_id, start_datatime, stop_datatime
    :return: [[external_id, start_date, stop_date or ,,,2000...,2999 if not provided], [....], ...]
    TODO: once more analyze this function promise myself (Kwant) to write unit tests !!!!
    """

    if excel_time:
        return process_excel_time(excel_time)

    external_id = None
    start_date, stop_date = user_time_all_time()
    if external_id_time:
        external_id_time_list = external_id_time.replace(' ', '').split(',')
        if len(external_id_time_list) >= 1 and len(external_id_time_list) <= 3:
            external_id = external_id_time_list[0]
            start_date, stop_date = process_user_time_list(external_id_time_list[1:])
        else:
            print(f'Incorrect external_id format "{external_id_time}", downloading all results from all users')
        print(f'EXTERNAL_ID_TIME: {external_id_time} -> {external_id}, {start_date}, {stop_date}')
        return [(external_id, start_date, stop_date)]

    if user_time:
        user_time_list = user_time.replace(' ', '').split(',')
        if len(user_time_list) == 5:
            if user_time_list[0] and user_time_list[1] and user_time_list[2]:
                external_id = hash(user_time_list[0], user_time_list[1], user_time_list[2])
            else:
                external_id = None
            start_date, stop_date = process_user_time_list(user_time_list[3:])
        elif len(user_time_list) < 3 or len(user_time_list) > 5:
            print(f'Incorrect user_time format "{user_time}", name/surname/phone not provided, downloading ALL results')
        elif len(user_time_list) < 5:
            if user_time_list[0] and user_time_list[1] and user_time_list[2]:
                print(f'Missing start_date or stop_date: {user_time}, downloading all results from user')
                external_id = hash(user_time_list[0], user_time_list[1], user_time_list[2])
            else:
                print(f'Missing name or name or surname, download for all users')
                print(f'USER_TIME: {user_time_list} -> {external_id}, {start_date}, {stop_date}')
    else:
        print(f'Incorrect user_time format "{user_time}", downloading all results from all users')

    return [(external_id, start_date, stop_date)]


def process_user_time_list(user_time_list: list) -> tuple:
    """
    Process user time to start_data and stop date
    :param user_time_list: list of dates (could be empty)
    :return: start_date, end_date
    """
    start_date, stop_date = user_time_all_time()
    try:
        _ = datetime.fromisoformat(user_time_list[0])
        start_date = datetime.fromisoformat(user_time_list[0]).isoformat()
    except ValueError:
        print(f'Incorrect start_time format {user_time_list[0]}, use ISO8601, downloading all results from user')
    except IndexError:
        print(f'start_time not found, use start_time=2000-01-01T00:00:00 instead')

    try:
        _ = datetime.fromisoformat(user_time_list[1])
        stop_date = datetime.fromisoformat(user_time_list[1]).isoformat()
    except ValueError:
        print(f'Incorrect stop_time format {user_time_list[1]}, use ISO8601, downloading all results from user')
    except IndexError:
        print(f'stop_time not found, use stop_time=2999-12-31T23:59:59 instead')

    return start_date, stop_date


def user_time_all_time() -> tuple:
    """
    Standardize start_date stop_date to ALL
    :return: start_date, end_date
    """
    start_date = '2000-01-01T00:00:00'
    end_date = '2999-12-31T23:59:59'
    return start_date, end_date


def process_excel_time(excel_file_name: str) -> list:
    """
    Process excel file to external_id and time range.
    Ignore inactive user (stop_time < now)
    :param excel_file_name: file path
    :return: [[external_id, start_date, stop_date], [external_id, start_date, stop_date], ....]
    """
    # check if file exist
    try:
        excel_file = open(excel_file_name, 'rb')
    except FileNotFoundError:
        print(f'Excel file "{excel_file_name}" not found, download nothing.')
        return []

    # check if excel file is correct
    try:
        excel = pd.read_excel(excel_file)
    except BaseException as error:
        print(f'During reading file: "{excel_file_name}" an exception occurred: {error}')
        return []

    # check if excel consist of columns: 'external_id', 'start_date', 'stop_date'
    if 'external_id' not in excel.columns:
        print(f'Excel file does not contains "external_id" column')
        return []
    if 'start_date' not in excel.columns:
        print(f'Excel file does not contains "start_date" column')
        return []
    if 'stop_date' not in excel.columns:
        print(f'Excel file does not contains "stop_date" column')
        return []

    # parse list:
    filtered_list = []
    for _, row in excel.iterrows():
        external_id = str(row["external_id"])
        start_date = str(row["start_date"])
        stop_date = str(row["stop_date"])
        start_date = datetime.fromisoformat(start_date).isoformat()
        stop_date = datetime.fromisoformat(stop_date).isoformat()

        print(f'{external_id:8.8}..: {start_date:19.19} -- {stop_date:19.19}: ', end='')

        try:
            if datetime.fromisoformat(start_date) > datetime.now():
                print(f' skipping - start_date "{start_date}" from future')
                continue
        except ValueError:
            print(f' skipping (error) - start_date "{start_date}" is not valid - not ISO format')
            continue

        try:
            if datetime.fromisoformat(stop_date) < datetime.now():
                print(f' skipping - stop_date "{stop_date}" from the past, INACTIVE USER')
                continue
        except ValueError:
            print(f' skipping (error) - stop_date "{stop_date}" is not valid - not ISO format')
            continue
        print(' OK')
        filtered_list.append([external_id, start_date, stop_date])

    # summarize list
    print('\n\nFinal user list:\n------------------------------------------------------')
    for ext_id, start, stop in filtered_list:
        print(f'{ext_id:8.8}..: {start:19.19} -- {stop:19.19}')
    print('------------------------------------------------------\n\n')

    return filtered_list
