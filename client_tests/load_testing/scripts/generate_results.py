# -*- coding: utf-8 -*-
import json
import argparse
import requests
import random


from datetime import datetime
from datetime import date
from datetime import timedelta


def get_args():
    parser = argparse.ArgumentParser("Provide arguments")

    parser.add_argument("days", type=int, help="Number of days that results will be generated for")
    parser.add_argument("start_date", type=str, help="Results start date")
    parser.add_argument("user_name", type=str, help="User name")

    args = parser.parse_args()
    return args


def get_access_token(user_name):
    f = open("../sources/users.json")
    users = json.load(f)

    for index in range(len(users)):
        if users[index]["first_name"] == user_name:
            return users[index]["access_token"]


def get_results():
    f = open("../sources/exemplary_results.json")
    results = json.load(f)

    return results


def get_random_hour():
    hour = random.randint(10,23)
    minutes = random.randint(10, 59)
    seconds = random.randint(10, 59)

    time = f'T{hour}:{minutes}:{seconds}'
    return time


def main(access_token, start_date, days):
    pass


if __name__ == "__main__":
    args = get_args()
    access_token = get_access_token(args.user_name)
    result = get_results()
    url = "https://longterm.yourdomain.io/api/watch-results/"

    for x in range(args.days):
        _date = datetime.strptime(str(args.start_date) + get_random_hour(), "%Y-%m-%dT%H:%M:%S") + timedelta(days=x)

        data = {
            "date": _date.strftime("%Y-%m-%dT%H:%M:%S")+"+01:00",
            "result": json.dumps(result["result"], indent=4)
        }
        print(data["date"])


        r = requests.post(url, data, headers={
            "Authorization": f'Token {access_token}'
        })
        
        print(r.status_code)
