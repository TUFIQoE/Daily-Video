# Longterm Backend


This documentation provides an introduction to the Longterm Backend project, which consists of several scripts designed to handle various tasks related to the management of video and data files for the platform. These tasks include uploading and downloading schedules, videos, and JSON files, as well as processing and analyzing user data and feedback.

The following scripts are available in the Longterm Backend:

1. `upload-schedule.py`: Uploads schedules (JSON files) and videos to the server.
1. `download-schedule.py`: Downloads schedules for all users from the server for backup and verification purposes.
1. `download-results.py`: Downloads results (feedback and results) for all users from the server.
1. `user_feedback.py`: Downloads user feedback from the server and saves it in CSV format.
1. `user_activity.py`: Downloads user activity data from the server and saves it in CSV format.
1. `download-plot-gyro-sequence.py`: Downloads results and feedback for a single user and plots accelerometer/gyroscope data.
1. `backup.py`: Backs up data from the server to a local directory using rsync and incremental JSON

## `./scripts/upload-schedule.py` 
For upload schedules (jsons) and videos to my.custom.server. Script generate and uploads md5sums of videos in the format `<video_file>.md5sum`.* 

```
usage: upload-schedule.py [-h] [--server [SERVER]] [--key [KEY]] [--token [TOKEN]] [video_path] [jsons_path]

positional arguments:
  video_path         location of video files (allowed hierarchical subdirs structure) (default: ./videos/)
  jsons_path         location of json files (flat structure, without subdirs) (default: ./)

optional arguments:
  -h, --help         show this help message and exit
  --server [SERVER]  [prod, dev, https://], predefined PRODuction, DEVelopment server, any sever (default: dev)
  --key [KEY]        location of ssh key for server eg.: media@my.custom.server, ignored for predefined settings server={prod|dev} (default: ~/.ssh/media@my.custom.server)
  --token [TOKEN]    TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev} (default: None)

Example of use: python ./scripts/upload-schedule.py --key ~/.ssh/media@my.custom.server --server=dev ./upload_schedule_v01/videos/ ./upload_schedule_v01
```

* ssh key for "media" user on the server is required, eg.: ~/.ssh/ contain media@my.custom.server private key for media user
* example uploads:
  * `cd upload-schedule-tests/`
    * repeat:
      * `cd user_XXX/`
      * `python ../../upload-schedule.py --server=prod`
  * Upload videos and JSONs using default settings (predefined development server):
    * `python upload-schedule.py`
  * Upload videos and JSONs to the predefined production server:
    * `python upload-schedule.py --server=prod`
  * Upload videos from a specific folder and JSONs from another folder to the predefined production server:
    * `python upload-schedule.py --server=prod --video_path=./custom_videos/ --jsons_path=./custom_jsons/`
  * Upload videos and JSONs to a custom server using a custom SSH key and a custom token for REST authorization:
    * `python upload-schedule.py --server=https://my.custom.server --key=./my_custom_key --token=abcdefgh0123456789abcdef0123456789abcdef`
  * Upload videos from a specific folder and JSONs from another folder to a custom server using a custom SSH key and a custom token for REST authorization:
    * `python upload-schedule.py --server=https://my.custom.server --key=./my_custom_key --token=abcdefgh0123456789abcdef0123456789abcdef --video_path=./custom_videos/ --jsons_path=./custom_jsons/`

Note: generate md5sum in shell: 
* for a single file: `md5sum filename.mp4 | awk '{print $1}' >filename.mp4.md5sum`
* for all files: `find . -type f | xargs -I {} sh -c 'md5sum {} | awk \'{print $1}\' >{}.md5sum'`


## `./scripts/download-schedule.py`
For downloading schedule for all users from my.custom.server. It is for backup/verification purpose .

```
usage: download-schedule.py [-h] [--server [SERVER]] [--key [KEY]] [--token [TOKEN]] [--mode [MODE]] [--user_time [USER_TIME]] [--external_id_time [EXTERNAL_ID_TIME]] [--excel_time [EXCEL_TIME]]
[--video_path [VIDEO_PATH]]

optional arguments:
-h, --help            show this help message and exit
--server [SERVER]     [prod, dev, https://], predefined PRODuction, DEVelopment server, any sever (default: dev)
--key [KEY]           location of ssh key for media@my.custom.server (default: ~/.ssh/media@my.custom.server)
--token [TOKEN]       TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev} (default: None)
--mode [MODE]         {video, json, video+json}, download videos or/and jsons (default: video+json)
--user_time [USER_TIME]
{" ", "name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for all users or specific one with optional start/stop date (default: )
--external_id_time [EXTERNAL_ID_TIME]
{" ", "342afb0bd765221057bd4ff24736ff228fc2848ae438f3d7e77f67f3e34f2568[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for single users with optional start/stop date (default: )
--excel_time [EXCEL_TIME]
{" ", "./users.xlsx"} download JSONs for users listed in excel file with start/stop date, all formats supported by Pandas, details on wiki (default: )
--video_path [VIDEO_PATH]
destination of video files uploaded from downloaded (default: ./video_from_server/)

Example of use: python ./scripts/download-schedule.py --key ~/.ssh/media@my.custom.server --server=dev --mode=video+json ./videos_from_server
```

* make sure ~/.ssh/ contain media@my.custom.server private key for media user
* example downloads:
  * `cd XXXXX/`
  * `python download-schedule.py`
* download only JSONs:
  * `python download-schedule.py --mode=json`
* download all users, all results from the production server:
  * `python download-schedule.py --server=prod`
* download all users and results between 2021-12-30T00:00:00 and 2022-01-31T23:59:59:
  * `python download-schedule.py --mode=json --server=prod --user_time=,,,2021-12-30T00:00:00,2022-01-31T23:59:59`
* download only user: name=Long_001, surname=Stress_test, phone=1234567 and results between 2021-12-30T00:00:00 and 2022-01-31T23:59:59:
  * `python download-schedule.py --mode=json --server=prod --user_time=Long_001,Stress_test,1234567,2021-12-30T00:00:00,2022-01-31T23:59:59`
* Download videos and JSONs from a custom server using a custom SSH key and a custom token for REST authorization:
  * `python download-schedule.py --server=https://my.custom.server --key=./my_custom_key --token=abcdefgh0123456789abcdef0123456789abcdef`

You expect **ALL** videos and jsons downloaded to current directory.


## `./scripts/download-results.py`
For downloading results (feedback and results) for all users from my.custom.server. 
It is main script for result downloading. Only jsons no video.

```
(data_science)
usage: download-results.py [-h] [--server [SERVER]] [--token [TOKEN]] [--mode [MODE]] [--user_time [USER_TIME]] [--external_id_time [EXTERNAL_ID_TIME]] [--excel_time [EXCEL_TIME]]

optional arguments:
-h, --help            show this help message and exit
--server [SERVER]     [prod, dev, https://], predefined PRODuction, DEVelopment server, any sever (default: dev)
--token [TOKEN]       TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev} (default: None)
--mode [MODE]         {feedback,results,feedback+results}, download data related with study, save it in json format (default: feedback+results)
--user_time [USER_TIME]
{" "; "name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for all users or specific one with optional start/stop date (default: )
--external_id_time [EXTERNAL_ID_TIME]
{" ", "342afb0bd765221057bd4ff24736ff228fc2848ae438f3d7e77f67f3e34f2568[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for single users with optional start/stop date (default: )
--excel_time [EXCEL_TIME]
{" ", "./users.xlsx"} download JSONs for users listed in excel file with start/stop date, all formats supported by Pandas, details on wiki (default: )

Example of use: python ./scripts/download-results.py --server=dev
```

* example downloads, all feedbacks and results:
  * `python download-results.py`
* download only JSONs from results (all users):
  * `python download-results.py --mode=results`
* download all users, all results from the production server:
  * `python download-results.py --server=prod`
* download all users and results between 2021-12-30T00:00:00 and 2022-01-31T23:59:59:
  * `python download-results.py --server=prod --user_time=,,,2021-12-30T00:00:00,2022-01-31T23:59:59`
* download only user: name=Long_001, surname=Stress_test, phone=1234567 and results between 2021-12-30T00:00:00 and 2022-01-31T23:59:59:
  * `python download-results.py --server=prod --user_time=Long_001,Stress_test,1234567,2021-12-30T00:00:00,2022-01-31T23:59:59`
* download all data from a custom server using custom token for REST authorization:
  * `python download-results.py --server=https://my.custom.server --key=./my_custom_key --token=abcdefgh0123456789abcdef0123456789abcdef`


You expect **ALL** jsons downloaded to current directory in the convention:
* results_feedback_all.json: all feedback combined
* results_feedback_{external_id}.json: json for specific user, sorted by time
* results_all.json: all results combined
* results_{external_id}.json: json for specific user, sorted by time

NOTE: the `user_feedback` in results_...json is processed locally by download-results.py script due to BUG in server endpoint.


## `./scripts/user_feedback.py`
For downloading user feedback from my.custom.server and saving it in csv format.

```
usage: user_feedback.py [-h] [--server [SERVER]] [--token [TOKEN]] [--user_time [USER_TIME]] [--external_id_time [EXTERNAL_ID_TIME]] [--excel_time [EXCEL_TIME]]

optional arguments:
  -h, --help            show this help message and exit
  --server [SERVER]     [prod, dev, https://], predefined PRODuction, DEVelopment server, any sever (default: dev)
  --token [TOKEN]       TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev} (default: None)
  --user_time [USER_TIME]
                        {" "; "name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for all users or specific one with optional start/stop date (default: )
  --external_id_time [EXTERNAL_ID_TIME]
                        {" ", "342afb0bd765221057bd4ff24736ff228fc2848ae438f3d7e77f67f3e34f2568[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for single users with optional start/stop date
                        (default: )
  --excel_time [EXCEL_TIME]
                        {" ", "./users.xlsx"} download JSONs for users listed in excel file with start/stop date, all formats supported by Pandas, details on wiki (default: )

Example of use: python ./scripts/user_feedback.py --server=dev
```

* example downloads, all feedbacks:
  * `python ./scripts/user_feedback.py`
* download all users, all feedbacks from the production server:
  * `python ./scripts/user_feedback.py --server=prod`
* download all users and feedbacks between 2021-12-30T00:00:00 and 2022-01-31T23:59:59:
  * `python ./scripts/user_feedback.py --server=prod --user_time=,,,2021-12-30T00:00:00,2022-01-31T23:59:59`
* download only user: name=Long_001, surname=Stress_test, phone=1234567 and results between 2021-12-30T00:00:00 and 2022-01-31T23:59:59:
  * `python ./scripts/user_feedback.py --server=prod --user_time=Long_001,Stress_test,1234567,2021-12-30T00:00:00,2022-01-31T23:59:59`
* download only user: 342afb0bd765221057bd4ff24736ff228fc2848ae438f3d7e77f67f3e34f2568
  * `python ./scripts/user_feedback.py --server=prod --external_id_time=342afb0bd765221057bd4ff24736ff228fc2848ae438f3d7e77f67f3e34f2568`
* download users from excel file:
  * `python ./scripts/user_feedback.py --server=prod --excel_time=./users.xlsx`
 

You expect user_feedback.csv in this directory.

## `./scripts/user_activity.py`
For downloading user activity from my.custom.server and saving it in csv format. Expects user_activity.csv in this directory. Does not work for wildcards `--user_time=,,,,,`.

```
usage: user_activity.py [-h] [--server [SERVER]] [--token [TOKEN]] [--sec_margin [SEC_MARGIN]] [--report_days [REPORT_DAYS]] [--user_time [USER_TIME]] [--external_id_time [EXTERNAL_ID_TIME]]
                        [--excel_time [EXCEL_TIME]]

optional arguments:
  -h, --help            show this help message and exit
  --server [SERVER]     [prod, dev, https://], predefined PRODuction, DEVelopment server, any sever (default: dev)
  --token [TOKEN]       TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev} (default: None)
  --sec_margin [SEC_MARGIN]
                        +-seconds margin for watching video related to video duration (default: 3)
  --report_days [REPORT_DAYS]
                        number of days to process (default: 30)
  --user_time [USER_TIME]
                        {" "; "name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for specific usr with optional start/stop date, this activity requires list of users. It doesnt
                        "for all users (default: )
  --external_id_time [EXTERNAL_ID_TIME]
                        {" ", "342afb0bd765221057bd4ff24736ff228fc2848ae438f3d7e77f67f3e34f2568[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for single users with optional start/stop date
                        (default: )
  --excel_time [EXCEL_TIME]
                        {" ", "./users.xlsx"} download JSONs for users listed in excel file with start/stop date, all formats supported by Pandas, details on wiki (default: )

Example of use: python ./scripts/user_activity.py --server=dev -excel_time=users_prod_all_2022_04.xlsx This activity requires list of users. It doesnt "for all users"
```

csv legend:
- '-' no entry for this day
- 'ok' watch movie without speedup/slowdown
- '<' watch movie with slowdown
- '>' watch movie with speedup

* example downloads, activity from last 30 days (default) for users from users_prod_all_2022_04.xlsx file, margin of seconds is set to 3 (default):
  * `python ./scripts/user_activity.py --server=prod --excel_time=users_prod_all_2022_04.xlsx`
* example with different numbers of reported days and modified margin of seconds:
  * `python scripts/user_activity.py --report_days=180 --sec_margin=100 --server=prod --excel_time=users_prod_all_2022_04.xlsx`


## `./scripts/download-plot-gyro-sequence.py`
Download results (feedback and results) for SINGLE users my.custom.server and plot accelerometer/gyroscope results.
Does not save any files. Only draw plots. Close current figure to see next one (sequential processing).

Description above figures include study date and feedback[S]. Feedbacks are matched by video name. For a single study, multiply feedbacks are possible.

```
usage: download-plot-gyro-sequence.py [-h] [--server [SERVER]] [--token [TOKEN]] [--user_time [USER_TIME]] [--external_id_time [EXTERNAL_ID_TIME]] [--excel_time [EXCEL_TIME]]

optional arguments:
  -h, --help            show this help message and exit
  --server [SERVER]     [prod, dev, https://], predefined PRODuction, DEVelopment server, any sever (default: dev)
  --token [TOKEN]       TOKEN for REST authorization: usually 40 hex digit, ignored for predefined settings server={prod|dev} (default: None)
  --user_time [USER_TIME]
                        {" "; "name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for all users or specific one with optional start/stop date (default: )
  --external_id_time [EXTERNAL_ID_TIME]
                        {" ", "342afb0bd765221057bd4ff24736ff228fc2848ae438f3d7e77f67f3e34f2568[,2021-01-01T00:00,2022-01-01T23:59]"} download JSONs for single users with optional start/stop date
                        (default: )
  --excel_time [EXCEL_TIME]
                        {" ", "./users.xlsx"} download JSONs for users listed in excel file with start/stop date, all formats supported by Pandas, details on wiki (default: )

Example of use: python ./scripts/download-results.py --key ~/.ssh/media-dev@dev-my.custom.server --server=dev --user_time=name,surname,phone[,2021-01-01T00:00,2022-01-01T23:59] This activity
doesnt work for wildcard user_time=",,,,"
```

* download user results/feedback and results from dev server between 2021-12-30T00:00:00 and 2022-01-31T23:59:59 and plot accelerometer/gyroscope results
  * `python scripts/download-plot-gyro-sequence.py --server=dev --user_time=Name,surname,006006006,2021-12-30T00:00:00,2022-01-31T23:59:59`


## `./scripts/compress_videos.py`

This script compresses videos to the specified VMAF value. Place the videos you wish to compress in the `files_to_compress` folder, using the following naming convention: `DesiredVmaf_filename.mp4` (for example, `60_avatar.mp4`). The output video will be saved in the `created_files` folder, along with a JSON file containing the calculated VMAF for each scene and the source video.


## `./scripts/prepare_schedule.py`
This script is for preparing schedules. It allows for massive schedule creation for multiple users.


## `./scripts/preprocess.R`

The script processes `*.json` files (obtained by running `./scripts/download-results.py`) and generates `*.csv` files with the results. This serves as an example of data processing and is not an integral component of the pipeline.


# Note:
Script requires following credentials: `Token` for REST API and `ssh key` for video upload/download (only for activity required video coping). Token and ssh key is generated during server configuration (see deployment instruction). You can provide that information in two ways:

**preconfigured**:
in the file `scripts/longterm_modules/target_url_users.py` there are two python methods called `predefined_dev(...)` and `predefined_prod(...)` in which you can store token string and url to the ssh key.
Then you can use it with `--server=dev` or `--server=prod`switch eg.: `python ./scripts/upload-schedule.py --server=dev ...`

**direct**: with script parameter you can change all parameters with switches: `server`, `token`, and `key` eg.:
```shell
python scripts/upload-schedule.py --token="666b38da30021bae590d54e7bfee1d90df53a811" --server="dev-my.custom.server" --key="/home/user/.ssh/media@dev-my.custom.server" ./dev_server_schedule/videos ./dev_server_schedule/

```
