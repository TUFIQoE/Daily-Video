# -*- coding: utf-8 -*-
#
# Description:  Backup videos and JSON
#               - rsync all videos
#               - incremental backup results_xxx.json, schedule_xxx.json and results_feedback_xxx.json
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      07.07.2022
# License:      MIT
# File:         backup.py
# Usage:
#               backup.py --server=prod, --key ~/.ssh/media@longterm.yourdomain.io, --dest_location=./longterm_backup/
# Note:         destination location must exist (in case "/longterm_backup/")


import io
import os
import glob
import shutil
import argparse
import importlib
import subprocess
from contextlib import redirect_stdout
from datetime import datetime
from longterm_modules.target_url_users import Target

target = Target()
download_schedule = importlib.import_module('download-schedule')
download_results = importlib.import_module('download-results')


def backup_video(dest_location: str, ssh_key: str) -> None:
    """
    backup videos from server to local filesystem
    :param dest_location: location on local filesystem, default is 'longterm_backup'
    :param ssh_key: path to ssh key to the server
    """
    media_subfolder = 'media_files'
    media_path = os.path.join(dest_location, media_subfolder)
    create_subfolder_if_not_exists(dest_location, media_subfolder)

    command = f'rsync --delete -vre "ssh -i {ssh_key}"'
    command += f' -r {target.media_user}@{target.server_url}:media/videos/ {media_path}'
    execute_command_and_print_stdout(command)

    if datetime.now().day == 1:
        # rename media_files folder to media_files_datatime
        current_datatime = datetime.now().strftime("%Y%m%d%H%M")
        os.rename(media_path, os.path.join(dest_location, f'media_files_{current_datatime}'))


def backup_jsons(dest_location: str, server: str, ssh_key: str) -> None:
    """
    backup json from server to local filesystem
    :param dest_location: location on local filesystem, default is 'longterm_backup'
    :param server: prod/dev server
    :param ssh_key: path to ssh key to the server
    """
    text_fubfolder = 'text_files'
    prev_folder = 'jsons_prev'
    create_subfolder_if_not_exists(dest_location, text_fubfolder)
    create_subfolder_if_not_exists(os.path.join(dest_location, text_fubfolder), prev_folder)

    current_datatime = datetime.now().strftime("%Y%m%d%H%M")
    current_subfolder = f'jsons_{current_datatime}'
    create_subfolder_if_not_exists(os.path.join(dest_location, text_fubfolder), current_subfolder)

    # download schedule
    arguments = [f'--server={server}', f'--key={ssh_key}', '--mode=json']
    download_schedule.main(arguments)

    # download results
    arguments = [f'--server={server}', f'--key={ssh_key}', '--mode=feedback+results']
    download_results.main(arguments)

    # move to curret_datatime folder
    files_to_move = glob.glob('*.json')
    for file_to_move in files_to_move:
        shutil.move(file_to_move, os.path.join(dest_location, text_fubfolder, current_subfolder, file_to_move))

    # diff and zip current_datatime folder with tmp folder
    old_path = os.path.join(dest_location, text_fubfolder, prev_folder)
    current_path = os.path.join(dest_location, text_fubfolder, current_subfolder)
    diff_file = os.path.join(dest_location, text_fubfolder, f'jsons_{current_datatime}.diff')
    command = f'diff -rN {old_path} {current_path} > {diff_file}'
    execute_command_and_print_stdout(command)

    command = f'gzip -f {diff_file}'
    execute_command_and_print_stdout(command)

    # delete content of json_prev folder
    files_to_remove = glob.glob(os.path.join(dest_location, text_fubfolder, prev_folder, '*'))
    for file_to_remove in files_to_remove:
        os.remove(file_to_remove)

    # move content of current_datatime folder to json_prev folder
    files_to_move = glob.glob(os.path.join(dest_location, text_fubfolder, current_subfolder, '*'))
    for file_to_move in files_to_move:
        os.rename(file_to_move,
                  os.path.join(dest_location, text_fubfolder, prev_folder, os.path.basename(file_to_move)))

    if datetime.now().day == 1:
        command = f'tar -cvzf {current_path}_all.tgz {old_path}'
        execute_command_and_print_stdout(command)

    # remove current_datatime folder
    os.rmdir(os.path.join(dest_location, text_fubfolder, current_subfolder))


def create_subfolder_if_not_exists(dest_location: str, subfolder_name: str) -> None:
    """
    create subfolder if not exists
    :param dest_location: location on local filesystem
    :param subfolder_name: name of subfolder
    """
    abs_location = os.path.abspath(dest_location)
    subfolder_path = os.path.join(abs_location, subfolder_name)
    if not os.path.exists(subfolder_path):
        os.makedirs(subfolder_path)


def execute_command_and_print_stdout(command: str) -> None:
    """
    execute command and log output
    :param command: command to execute
    """
    print(f'\n----------- command {command}: ----------------')
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)
    output = process.communicate()
    print(f'stdout output:\n{output[0]}\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='backup.py',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     epilog='Example of use:\npython ./scripts/backup.py --server=prod, --key ~/.ssh/media@longterm.yourdomain.io, --dest_location=./longterm_backup')
    parser.add_argument('--key', nargs='?', type=str, default='~/.ssh/media@longterm.yourdomain.io',
                        help='location of ssh key for media@longterm.yourdomain.io')
    parser.add_argument('--server', nargs='?', type=str, default='dev',
                        help='[dev, prod], developers or production server')
    parser.add_argument('--dest_location', nargs='?', type=str, default='./longterm_backup/',
                        help='destination of backup')

    args = parser.parse_args()

    # TODO: remove in production
    print(f'current config (you can change it with programs argument):\n\t'
          f'key: {args.key}\n\tserver: {args.server}\n\tdest_location: {args.dest_location}\n')

    if args.server == 'prod':
        target.using_prod()
    else:
        target.using_dev()

    # create args.dest_location if not exists
    create_subfolder_if_not_exists('', args.dest_location)

    log_filename = 'backup_log.txt'
    try:
        with open(os.path.join(args.dest_location, log_filename), 'at') as log_file:
            log_file.write(f'\n\n############# Backup: {datetime.now().strftime("%Y-%m-%d %H:%M")} ############# \n\n')
            f = io.StringIO()
            with redirect_stdout(f):
                backup_video(args.dest_location, args.key)
                backup_jsons(args.dest_location, args.server, args.key)
            log_file.write(f'{f.getvalue()}\n')
    except Exception as e:
        print(f'Exception: {e}')
