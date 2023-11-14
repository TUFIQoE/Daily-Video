# -*- coding: utf-8 -*-
#
# Description:  generate 50+ users for 30+ days each
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      24.10.2021
# License:      TBD
# File:         generate.py
#
# NOTE:         execute in-place
#

import json
from datetime import datetime, timedelta


def long_json(name: str, days_per_user: int, starting_datetime: datetime) -> dict:
    """
    generate fake long json
    :param name: user name
    :param days_per_user: number of days per json
    :param starting_datetime: starting date
    :return: dict with json
    """

    schedule = {'name': name,
                'surname': 'Stress_test',
                'phone': '1234567',
                'language': 'PL',
                'external_id': '',
                'comments': '',
                'schedule': []}

    experiment_day = starting_datetime.replace(microsecond=0)
    for day in range(days_per_user):
        service = {
            'service': [
                {
                    'service_name': 'A',
                    'video': f'subset1/Very_long_video_name_with_multiply_quality_settings_v{day}_jan.avi'
                },
                {
                    'service_name': 'B',
                    'video': f'subset1/Very_long_video_name_with_multiply_quality_settings_v{day}_go.avi'
                },
                {
                    'service_name': 'C',
                    'video': f'subset1/Very_long_video_name_with_multiply_quality_settings_v{day}_C.avi'
                }
            ],
            'start': experiment_day.replace(hour=0, second=0, minute=0).isoformat(),
            'end': experiment_day.replace(hour=23, second=59, minute=59).isoformat(),
            'reply_form': [
                {
                    'name': 'q1',
                    'type': 'MOS_5',
                    'text': 'oceń jakość wideo'
                },
                {
                    'name': 'q2',
                    'type:': 'Checkbox_multi',
                    'text:': 'zaznacz co chcesz',
                    'question_1': 'text 1',
                    'question_2': 'text 2',
                    'question_3': 'text 3',
                    'question_4': 'text 4'
                },
                {
                    'name': 'q3',
                    'type': 'LONG_TEST',
                    'text1': '1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    'text2': '2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    'text3': '3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    'text4': '4 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    'text5': '5 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                },

            ]
        }
        schedule['schedule'].append(service)
        experiment_day += timedelta(days=1)

    return schedule


def long_term_simulation(users: int = 55, days_per_user: int = 35, delay_next_user: int = 5) -> None:
    """
    Generate bunch of testing jsons for server stressing
    :param users: number of users/jsons
    :param days_per_user: number of days per user
    :param delay_next_user: how may days delay between start experiment of next user
    """
    experiment_day = datetime.now().replace(microsecond=0)
    print(f'generating JSON for user:')
    for user_no in range(users):
        username = f'Long_{user_no:03d}'
        username_filename = f'schedule_{username}.json'
        print(f'{username_filename}')
        schedule = long_json(username, days_per_user, experiment_day)

        with open(username_filename, 'w', encoding='utf8') as fw:
            json.dump(schedule, fw, indent=4, ensure_ascii=False)
        experiment_day += timedelta(days=delay_next_user)


if __name__ == '__main__':
    long_term_simulation(users=51, days_per_user=32, delay_next_user=7)
