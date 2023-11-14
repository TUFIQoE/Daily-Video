import json
from datetime import datetime, timedelta
import os
import glob


def write_json(new_data, filename, where):
    with open(filename,'r+') as file:
        # First we load existing data into a dict.
        file_data = json.load(file)
        # Join new_data with file_data inside emp_details
        file_data[where].append(new_data)
        # Sets file's current position at offset.
        file.seek(0)
        # convert back to json.
        json.dump(file_data, file, indent = 4)


# creates reply form of the type MOS
def mos_descr(mos_id, mos_pl, mos_eng, mos_nor):
    mos = {
        "optional_id": mos_id,
        "type": "MOS",
        "buttons": [
            {
                "value": 5,
                "button_text": [
                    {
                        "language": "pol",
                        "text": "5. Wspaniała"
                    },
                    {
                        "language": "eng",
                        "text": "5. Excellent"
                    },
                    {
                        "language": "nor",
                        "text": "5. Lorem ipsum"
                    }
                ]
            },
            {
                "value": 4,
                "button_text": [
                    {
                        "language": "pol",
                        "text": "4. Dobra"
                    },
                    {
                        "language": "eng",
                        "text": "4. Good"
                    },
                    {
                        "language": "nor",
                        "text": "4. Lorem ipsum"
                    }
                ]
            },
            {
                "value": 3,
                "button_text": [
                    {
                        "language": "pol",
                        "text": "3. Umiarkowana"
                    },
                    {
                        "language": "eng",
                        "text": "3. Fair"
                    },
                    {
                        "language": "nor",
                        "text": "3. Lorem ipsum"
                    }
                ]
            },
            {
                "value": 2,
                "button_text": [
                    {
                        "language": "pol",
                        "text": "2. Słaba"
                    },
                    {
                        "language": "eng",
                        "text": "2. Poor"
                    },
                    {
                        "language": "nor",
                        "text": "2. Lorem ipsum"
                    }
                ]
            },
            {
                "value": 1,
                "button_text": [
                    {
                        "language": "pol",
                        "text": "1. Zła"
                    },
                    {
                        "language": "eng",
                        "text": "1. Bad"
                    },
                    {
                        "language": "nor",
                        "text": "1. Lorem ipsum"
                    }
                ]
            }
        ],
        "description": [
            {
                "language": "eng",
                "text": mos_eng
            },
            {
                "language": "pol",
                "text": mos_pl
            },
            {
                "language": "nor",
                "text": mos_nor
            }
        ]
    }
    return mos


# creates reply form of the type question yes/no
def yn_descr(yn_id, yn_pl, yn_eng, yn_nor, true="true".strip(""), false="false".strip("")):
    yn = {
        "optional_id": yn_id,
        "type": "MOS",
        "buttons": [
            {
                "value": true,
                "button_text": [
                    {
                        "language": "pol",
                        "text": "Tak"
                    },
                    {
                        "language": "eng",
                        "text": "Yes"
                    },
                    {
                        "language": "nor",
                        "text": "Ja"
                    }
                ]
            },
            {
                "value": false,
                "button_text": [
                    {
                        "language": "pol",
                        "text": "Nie"
                    },
                    {
                        "language": "eng",
                        "text": "No"
                    },
                    {
                        "language": "nor",
                        "text": "Nein"
                    }
                ]
            }
        ],
        "description": [
            {
                "language": "eng",
                "text": yn_eng
            },
            {
                "language": "pol",
                "text": yn_pl
            },
            {
                "language": "nor",
                "text": yn_nor
            }
        ]
    }
    return yn


# creates reply form of the type open question
def txt_descr(txt_id, txt_pl, txt_eng, txt_nor):
    txt = {
                    "optional_id": txt_id,
                    "type": "TEXT",
                    "description": [
                        {
                            "language": "eng",
                            "text": txt_eng
                        },
                        {
                            "language": "pol",
                            "text": txt_pl
                        },
                        {
                            "language": "nor",
                            "text": txt_nor
                        }
                    ]
                }
    return txt


# creates reply form of external link for the questionnaire
def qual_descr(qual_id):
    qual = {
                    "optional_id": qual_id,
                    "type": "QUALTRICS",
                    "qualtrics_url": "https://survey.qualtrics.com/jfe/form/SV_9GfoihavJJR5R7U?Client=ATT&Client=Sprint",
                    "description": [
                        {
                            "language": "eng",
                            "text": "Additional questions on WWW page"
                        },
                        {
                            "language": "pol",
                            "text": "Dodatkowe pytania na stronie WWW"
                        },
                        {
                            "language": "nor",
                            "text": "Lorem ipsum"
                        }
                    ]
                }
    return qual


def next_dates(date_start, n_days):
    my_date = (date_start + timedelta(days=n_days)).strftime('%Y-%m-%d')
    return my_date


today = datetime.today()
# set starting day in a relation to today's date
first_date = today + timedelta(days=10)
dates = []

videos = []

# in case you have many services, use this + have separate video folders for each service:
many_services = 0

videosA = []
videosB = []
videosC = []

# here put 1: many services; 0: only one service
tags = []
# here put 0: no reply form, 1: reply form
reply = []
# example of questions - you can pick your own text, in three languages
q1 = mos_descr("q1", "Proszę ocenić jakość filmu", "What was the quality?", "lorem")
q2 = yn_descr("q2", "Czy obejrzałeś film do końca?", "Did you watch?", "lorem")
q3 = yn_descr("q3", "Czy widziałeś już kiedyś ten zwiastun?", "Did you like it?", "lorem")
q6 = yn_descr("q3", "Czy poszedłbyś na ten film do kina?", "Did you like it?", "lorem")
q4 = txt_descr("q4", "Jeśli masz jakieś dodatkowe komentarze o filmie, wpisz je tutaj", "whyy?", "lorem")
q5 = qual_descr("q5")
# create reply modules (can differ by length and type of the question)
reply_list1 = [q1]
reply_list2 = [q1, q2, q6, q4]
reply_list3 = [q1, q2, q3]
# specify which reply module should be presented each day
list_of_reply_list = []

# specify path with your testers schedules and videos you want to upload now
# HERE you modify file paths - the file with the schedules and the file with videos
schedule_file = "./schedules_tests_only"
video_file = "./schedules_tests_only/videos"

if many_services == 0:
    os.chdir(video_file)
    my_files = glob.glob('*.mp4')
    videos_number = len(my_files)
    print(videos_number)
    for i in range(0, videos_number):
        dates.append(next_dates(first_date, i))
        # if you want to have different tags or reply forms each day, you need to delete this and do it manually
        tags.append(0)
        # HERE you modify if you have reply forms
        reply.append(1)
        list_of_reply_list.append(reply_list2)
    os.chdir(video_file)
    # to keep videos in correct order name them in a way indicating which postion they should be in (e.g. 01_vid.mp4, 02_vido.mp4 etc.)
    all_videos = sorted(glob.glob('*.mp4'))
    for file in all_videos:
        videos.append(file)
    # in case of multiple services:
elif many_services == 1:
    print(many_services)
    os.chdir("{}/videos_A".format(schedule_file))
    my_files = glob.glob('*.mp4')
    videosA_number = len(my_files)
    print(videosA_number)
    for i in range(0, videosA_number):
        dates.append(next_dates(first_date, i))
        # if you want to have different tags or reply forms each day, you need to delete this and do it manually
        tags.append(1)
        reply.append(0)
        list_of_reply_list.append(reply_list1)
    os.chdir("{}/videos_A".format(schedule_file))
    all_videos = sorted(glob.glob('*.mp4'))
    for file in all_videos:
        videosA.append(file)
    os.chdir("{}/videos_B".format(schedule_file))
    # to keep videos in correct order name them in a way indicating which postion they should be in
    all_videos = sorted(glob.glob('*.mp4'))
    for file in all_videos:
        videosB.append(file)
    os.chdir("{}/videos_C".format(schedule_file))
    # to keep videos in correct order name them in a way indicating which postion they should be in
    all_videos = sorted(glob.glob('*.mp4'))
    for file in all_videos:
        videosC.append(file)

print(dates)
print(videos)
print(videosA)

# if you want to keep previous data put here: 0, if you want to clear previous schedule: 1
clear_schedule = 1
os.chdir(schedule_file)
for file in glob.glob("*.json"):
    if clear_schedule == 1:
        with open(file, "r") as jsonFile:
            data = json.load(jsonFile)
        data["schedule"] = []
        with open(file, "w") as jsonFile:
            json.dump(data, jsonFile, indent=4)

    for d in range(len(dates)):
        date_s = "{}T00:00:00".format(dates[d])
        date_e = "{}T23:59:59".format(dates[d])
        if reply[d] == 0:
            if tags[d] == 0:
                y = {"start": date_s,
                    "end": date_e,
                    "service": [{
                    "service_name": "",
                    "video": videos[d]}]
                    }

                write_json(y, file, "schedule")
            elif tags[d] == 1:
                y = {"start": date_s,
                    "end": date_e,
                    "service": [{
                    "service_name": "A",
                    "video": videosA[d]},
                    {"service_name": "B",
                    "video": videosB[d]},
                    {"service_name": "C",
                    "video": videosC[d]}]
                }

                write_json(y, file, "schedule")
        elif reply[d] == 1:
            if tags[d] == 0:
                y = {"start": date_s,
                    "end": date_e,
                    "service": [{
                    "service_name": "",
                    "video": videos[d]}],
                    "reply_form": list_of_reply_list[d]
                     }

                write_json(y, file, "schedule")
            elif tags[d] == 1:
                y = {"start": date_s,
                    "end": date_e,
                    "service": [{
                    "service_name": "A",
                    "video": videosA[d]},
                    {"service_name": "B",
                    "video": videosB[d]},
                    {"service_name": "C",
                    "video": videosC[d]}],
                     "reply_form": list_of_reply_list[d]
                     }


                write_json(y, file, "schedule")
