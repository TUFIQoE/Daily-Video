# -*- coding: utf-8 -*-
#
# Description:  generate scenario with overwriting case, take care about correct date
#               - results: schedule_XXX_00.json, schedule_XXX_01.json, schedule_join.txt
#               - json_00/...XXX_00.json starts **two days ago**
#               - json_01/...XXX_01.json overrides **today** and next days
#               - schedule_join.txt expected merged result
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      24.10.2021
# License:      GPL
# File:         generate.py
#
# NOTE:         USE:
#               - python generate.py;
#               - python ../scripts/upload-schedule.py --server=prod ./json_00/ ./json_00/
#               - python ../scripts/upload-schedule.py --server=prod ./json_01/ ./json_01/
#               - python ../scripts/download-schedule.py --server=prod --mode=json
#               - compare schedule_join.txt with schedule_14ce124bc651222db95d2beb15e11bdc4bff1e5da439ae2be3ff0bda66b8149f.json

import json
from datetime import datetime, timedelta
from os import path, makedirs


def process_schedule_00():
    """
    process templates/schedule_XXX_00.json -> schedule_XXX_00.json with updated date
    """
    print('\nprocessing schedule_00')
    experiment_day = datetime.now().replace(microsecond=0)
    # start experiment virtually two days ago
    experiment_day -= timedelta(days=2)
    template_filename = 'schedule_XXX_00.json'
    json_00 = 'json_00'
    makedirs(json_00)
    with open(path.join('templates', template_filename), 'r') as json_in:
        schedule = json.load(json_in)
        for service in schedule['schedule']:
            print(f"{service['start']}  ==>  ", end='')
            service['start'] = experiment_day.replace(hour=0, second=0, minute=0).isoformat()
            service['end'] = experiment_day.replace(hour=23, second=59, minute=59).isoformat()
            print(service['start'])
            experiment_day += timedelta(days=1)

            with open(path.join(json_00, template_filename), 'w', encoding='utf8') as json_out:
                json.dump(schedule, json_out, indent=4, ensure_ascii=False)


def process_schedule_01():
    """
    process templates/schedule_XXX_01.json -> schedule_XXX_01.json with updated date
    """
    print('\nprocessing schedule_01')
    experiment_day = datetime.now().replace(microsecond=0)
    template_filename = 'schedule_XXX_01.json'
    json_01 = 'json_01'
    with open(path.join('templates', template_filename), 'r') as json_in:
        schedule = json.load(json_in)

        service = schedule['schedule'][0]
        print(f"{service['start']}  ==>  ", end='')
        service['start'] = experiment_day.replace(hour=0, second=0, minute=0).isoformat()
        service['end'] = experiment_day.replace(hour=23, second=59, minute=59).isoformat()
        print(service['start'])
        experiment_day += timedelta(days=1)

        service = schedule['schedule'][1]
        print(f"{service['start']}  ==>  ", end='')
        service['start'] = experiment_day.replace(hour=0, second=0, minute=0).isoformat()
        service['end'] = experiment_day.replace(hour=23, second=59, minute=59).isoformat()
        print(service['start'])
        experiment_day += timedelta(days=1)

        service = schedule['schedule'][2]
        print(f"{service['start']}  ==>  ", end='')
        service['start'] = experiment_day.replace(hour=0, second=0, minute=0).isoformat()
        service['end'] = experiment_day.replace(hour=23, second=59, minute=59).isoformat()
        print(service['start'])
        experiment_day += timedelta(days=2)

        service = schedule['schedule'][3]
        print(f"{service['start']}  ==>  ", end='')
        service['start'] = experiment_day.replace(hour=0, second=0, minute=0).isoformat()
        service['end'] = experiment_day.replace(hour=23, second=59, minute=59).isoformat()
        print(service['start'])

        makedirs(json_01)
        with open(path.join(json_01, template_filename), 'w', encoding='utf8') as json_out:
            json.dump(schedule, json_out, indent=4, ensure_ascii=False)


def process_schedule():
    """
    process templates/schedule.json -> schedule_json.txt with updated date
    """
    print('\nprocessing schedule')
    experiment_day = datetime.now().replace(microsecond=0)
    # start experiment virtually two days ago
    experiment_day -= timedelta(days=2)
    template_filename = 'schedule.json'
    with open(path.join('templates', template_filename), 'r') as json_in:
        schedule = json.load(json_in)
        for service in schedule['schedule']:
            print(f"{service['start']}  ==>  ", end='')
            service['start'] = experiment_day.replace(hour=0, second=0, minute=0).isoformat()
            service['end'] = experiment_day.replace(hour=23, second=59, minute=59).isoformat()
            print(service['start'])
            experiment_day += timedelta(days=1)

            with open('schedule_json.txt', 'w', encoding='utf8') as json_out:
                json.dump(schedule, json_out, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    process_schedule_00()
    process_schedule_01()
    process_schedule()
