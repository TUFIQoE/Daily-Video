# -*- coding: utf-8 -*-
#
# Description:  create real schedule with videos
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      28.12.2021
# License:      TBD
# File:         generate.py
#
# NOTE:         execute in-place
#

import json
import os
import shutil
import sys
from datetime import datetime, timedelta
from os import path, makedirs, remove
from sys import exit

try:
    import gdown
except ModuleNotFoundError:
    print('install gdown:\npip install gdown\n\tor\nconda install -c conda-forge gdown')
    exit()


trailer_1_200 = 'trailer1_200k.mp4'
trailer_1_400 = 'trailer1_400k.mp4'
trailer_1_800 = 'trailer1_800k.mp4'
dir_simple = 'schedule_simple'
dir_services = 'schedule_services'


def already_exist_directories() -> bool:
    """
    check if directory exists
    :return: True if exist
    """
    return path.isdir(dir_simple) or path.isdir(dir_services)


def create_directories() -> None:
    """
    Create directories
    """
    makedirs(dir_simple, exist_ok=True)
    makedirs(path.join(dir_simple, 'videos'), exist_ok=True)
    makedirs(dir_services, exist_ok=True)
    makedirs(path.join(dir_services, 'videos'), exist_ok=True)


def download_videos() -> None:
    """
    Download videos from gdrive
    """
    gdown.download('https://drive.google.com/uc?id=?????????????????', trailer_1_200, quiet=False)
    gdown.download('https://drive.google.com/uc?id=?????????????????', trailer_1_400, quiet=False)
    gdown.download('https://drive.google.com/uc?id=?????????????????', trailer_1_800, quiet=False)

    for file_name in [trailer_1_200, trailer_1_400, trailer_1_800]:
        shutil.copy(file_name, path.join(dir_simple, 'videos'))
        shutil.move(file_name, path.join(dir_services, 'videos'))


def generate_json_simple(personal_data: list):
    """
    generate simple json (no services), 3 days from now, different videos
    :param personal_data: [name, surname, phone]
    """
    experiment_day = datetime.now().replace(microsecond=0)
    schedule = {'name': personal_data[0],
                'surname': personal_data[1],
                'phone': personal_data[2],
                'language': 'PL',
                'external_id': '',
                'comments': '',
                'schedule': []}

    for base_filename in [trailer_1_200, trailer_1_400, trailer_1_800]:
        prefix_day = experiment_day.isoformat().replace(':', '_')
        target_filename = f'{prefix_day}_{base_filename}'
        shutil.move(path.join(dir_simple, 'videos', base_filename), path.join(dir_simple, 'videos', target_filename))
        service = {
            'service': [
                {
                    'service_name': '',
                    'video': target_filename
                },
            ],
            'start': experiment_day.replace(hour=0, second=0, minute=0).isoformat(),
            'end': experiment_day.replace(hour=23, second=59, minute=59).isoformat()
        }
        schedule['schedule'].append(service)
        experiment_day += timedelta(days=1)

    json_filename = path.join(dir_simple, f'schedule_{personal_data[0]}_{personal_data[1]}.json')
    with open(json_filename, 'w', encoding='utf8') as fw:
        json.dump(schedule, fw, indent=4, ensure_ascii=False)

    print('run:\npython ../scripts/upload-schedule.py --server=prod ./schedule_simple/videos/ ./schedule_simple/\n')


def generate_json_services(personal_data: list):
    """
    generate json with services, 3 days from now, different videos
    :param personal_data: [name, surname, phone]
    """
    experiment_day = datetime.now().replace(microsecond=0)
    schedule = {'name': personal_data[0],
                'surname': personal_data[1],
                'phone': personal_data[2],
                'language': 'PL',
                'external_id': '',
                'comments': '',
                'schedule': []}

    trailers_filename = [trailer_1_200, trailer_1_400, trailer_1_800]
    for day in range(1, 6):
        schedule_item = {
            'service': [],
            'start': experiment_day.replace(hour=0, second=0, minute=0).isoformat(),
            'end': experiment_day.replace(hour=23, second=59, minute=59).isoformat()
        }

        for service_name, base_filename in zip(['A', 'B', 'C'], trailers_filename):
            target_filename = f'{experiment_day.isoformat().replace(":", "_")}_SERVICE-{service_name}_{base_filename}'
            shutil.copy(path.join(dir_services, 'videos', base_filename), path.join(dir_services, 'videos', target_filename))
            schedule_item['service'].append({
                'service_name': service_name,
                'video': target_filename
            })

        schedule['schedule'].append(schedule_item)
        experiment_day += timedelta(days=1)

    for filename in trailers_filename:
        remove(path.join(dir_services, 'videos', filename))

    json_filename = path.join(dir_services, f'schedule_{personal_data[0]}_{personal_data[1]}.json')
    with open(json_filename, 'w', encoding='utf8') as fw:
        json.dump(schedule, fw, indent=4, ensure_ascii=False)

    print('run:\npython ../scripts/upload-schedule.py --server=prod ./schedule_services/videos/ ./schedule_services/\n')


if __name__ == '__main__':
    if already_exist_directories():
        print('Directory with content already exists\nREMOVE before use')
        sys.exit()
    create_directories()
    download_videos()

    # [name, surname, phone]
    simple = ['simple', 'surname', '123456']
    service = ['service', 'surname', '+48 123456']
    generate_json_simple(simple)
    generate_json_services(service)
