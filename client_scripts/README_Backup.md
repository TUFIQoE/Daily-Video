# Backup deployment


<u>Motivation</u>: data acquired from subjects, during Long-Term (3-years) study are priceless. It is good practice to have a good backup :-)    

The application `/scripts/backup.py` perform copy of all video data, schedules and results (jsons with all information gathered from the user).
Jsons with results are stored incrementally (eg. daily) Special feature of this script is to incremental backup of JSON files. 
Thus it can be run on daily basis, and it will save a lot of data since results_xxx.json are incrementally updated.

This instruction describe all steps required to deploy /scripts/backup.py on server.

## Requirements

* **backend-server**: Linux based server/desktop (eg. Ubuntu)
* **longterm-server**: ssh key to login on this server (the same as for upload-schedule.py)
* environment:
  * python 3.x
  * python modules: pandas, numpy, requests
* access to /etc/crontab or other tool for periodically call `backup.py` script
* sufficient disk space, per 1 month and 30 users you need ~1GB for media files and ~100MB for text files (results)


## Deployment

It its step by step deployment. No automation are provided.

0. Make sure **longterm-server** accepts ssh port from **longterm-backup**, if necessary open it:
    * firewall-cmd --permanent --zone=internal --add-source=ip-longterm-backup
    * firewall-cmd --reload
    * firewall-cmd --list-all-zones | less
1. Login to **backup-server**
2. create directory for script `mkdir longterm-backup`
3. copy files to longterm-backup dir: 
    * `cp -a your_location/scripts/* ~/longterm-backup/` 
    * alternatively: or `cd longterm-backup`, 
    `git clone --branch client https://your.repository.somewere/longterm-backend.git`,
    `mv longterm-backend/scripts/* ./`,
    `rm -rf longterm-backend` 
4. Install python and dependencies. This procedure depends on installed OS. Below procedures for Ubnutu LTS 2022: 
    * Python: `sudo apt install python3`
    * Pip for python modules: `sudo apt install python3-pip`
    * Python dependencies: `pip3 install pandas, numpy, requests`
5. SSH key. Copy ssh key to longter-server `cp media@your.custom.server .ssh/`, make sure access right are correct: `chmod og-rwx .ssh/media@your.custom.server` 
6. Add ssh fingerprint to longterm-server: `ssh-keyscan -H your.custom.server >> ~/.ssh/known_hosts`
7. Add crontab daily backup:
    * modify crontab_daily_longterm.sh, adjust all `BACKUP_***` environment
    * `sudo cp crontab_daily_longterm /etc/cron.daily/`
    * `sudo chown root:root /etc/cron.daily/crontab_daily_longterm`
    * `sudo chmod 755 /etc/cron.daily/crontab_daily_longterm`
    * `sudo systemctl restart cron.service`

Backup files and logs should appear in given (eg. /mnt/TUFIQoE_Long_Term) directory.