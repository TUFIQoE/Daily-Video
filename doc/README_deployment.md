# deployment from scrach 

Deployment of LongTerm server, by hand, no Kubernetes or other automation.

Note: in this instruction the **longterm.yourdomain.io** domain is used. You have to change it in your own.

# Server

You can use any physical or virtual server with Linux. Installation is for Rocky 8 Linux (OpenSource Enterprise Linux 100% compatible with RedHat Enterprise Linux). Requirements:
- CPU: 2 cores
- RAM: 8GB+ (you will struggle after several month of operation for 30+ active users if less)
- SDD: 20GB for system, 128GB+ for data (depends on how much space you need for videos, by design the old ones are not deleted, consider it for 2-3 years of operation, one video per day, and a few version of each video - different compression ratio)
- NET: public IP, domain

# Server preparation:
- Rocky 8 Linux, 
  - default, Server configuration
  - EN language
  - configure correct time zone (it is important because schedules are **local** time dependent)
  - stron root password (after installation, login by ssh key is recommended)
  - select small sdd for boot disk and root /, larger as /home
  - you can encrypt data, but it is not required, server will not store any personal/sensitive user data (users are identified by id)
  - open ssh if necessary (depends on OS), usually: `systemctl start sshd`, `systemctl enable sshd`
  - upgrade your system: 
    - `dnf check-update`
    - `dnf upgrade`
    - reboot
  - install necessary packages:
    - `dnf install epel-release`
    - `dnf -y install python39 vim supervisor postgresql postgresql-server python3-pip make git nginx`    
  - create _longterm_ and _media_ users:
    - `adduser --create-home longterm`
    - `passwd longterm` <- set strong password
    - `usermod -aG wheel longterm` <- allows sudo 
    - setup ssh key for easy login:
      - `ssh-keygen -t rsa -f longterm@longterm.yourdomain.io`
      - `ssh-copy-id -i ~/.ssh/longterm@longterm.yourdomain.io.pub longterm@longterm.yourdomain.io`
    - `chmod og+x /home/longterm`
    - `adduser --create-home media`
    - `passwd media` <- set strong password
    - `sudo su media`
    - `cd`
    - `mkdir -p media/videos`
    - `chmod -R 711 media`
    - `chmod og+x /home/media`
    - on your workstation (client), generate ssh key for upload content and schedules to the server:
      - `ssh-keygen -t rsa -f media@longterm.yourdomain.io`   # without password
      - `ssh-copy-id -i ~/.ssh/media@longterm.yourdomain.io.pub media@longterm.yourdomain.io`  # or copy manually *.pub to ~./ssh/authorized_keys, notice correct permission to .ssh and .ssh/authorized_keys
      - verify loging: `ssh media@longterm.yourdomain.io -i ~/.ssh/media@longterm.yourdomain.io`
      - store on your workstation `media@longterm.yourdomain.io` for further purpose
    - forbid password root login:
      - `vim /etc/ssh/sshd_config` <- PermitRootLogin no #disabled
      - systemctl restart sshd
  - `sudo hostnamectl set-hostname longterm.yourdomain.io` make sure, your hostname is correct
  - `systemctl start chronyd`
  - `systemctl enable chronyd`
  - firewall: longterm server need the following port opened: 22 (ssh) for uploading/downloading media file, 80 (http) for administration and REST - it is redirected to https, 443 (https) for administration and REST.
    - `firewall-cmd --zone=public --permanent --add-service=ssh` # usually not necessary explicit, already opened by OpenSSH service, 
    - `firewall-cmd --zone=public --permanent --add-service=http` # required for certbot initialization
    - `firewall-cmd --zone=public --permanent --add-service=https` # probably opened during nginx initialization

# module and environment configuration
## postgresql-server
- `postgresql-setup --initdb`
- `systemctl start postgresql`
- `systemctl enable postgresql`
- create user and table for longterm:
  - `sudo -i -u postgres`
  - `psql`
  ```sql
  alter user postgres password '--password--';
  create user longterm with createdb;
  alter user longterm password '--password--';
  create database longterm owner longterm;
  ```
- /var/lib/pgsql/data/pg_hba.conf:
  ```
  # TYPE  DATABASE        USER            ADDRESS                 METHOD

  # "local" is for Unix domain socket connections only
  local   all             postgres                                     peer
  # IPv4 local connections:
  host    all             all             127.0.0.1/32           md5
  # IPv6 local connections:
  host    all             all             ::1/128                 md5
  host    all             all             0.0.0.0/0               md5
  # Allow replication connections from localhost, by a user with the
  # replication privilege.
  local   replication     all                                     peer
  host    replication     all             127.0.0.1/32            ident
  host    replication     all             ::1/128                 ident
  ```


## supervisor
- /etc/supervisord.d/longterm.ini
  ```[program:longterm]
  directory=/home/longterm/longterm-backend
  command=/home/longterm/venv/bin/gunicorn --workers 2 --bind 127.0.0.1:8000 longterm.wsgi        
  autostart=true 
  autorestart=true 
  stderr_logfile=/home/longterm/logs/longterm.out.log            
  stdout_logfile=/home/longterm/logs/longterm.err.log             
  user=longterm
  group=longterm
  environment=LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8,POSTGRES_DB=longterm,POSTGRES_USER=longterm,POSTGRES_PASSWORD=---password---,DJANGO_SECRET_KEY="--long--secret--key--",DJANGO_SETTINGS_MODULE=longterm.settings.production
  ```
- setup POSTGRES_PASSWORD and generate DJANGO_SECRET_KEY
- do not star yet (!)


## virtual env 
- login to _longterm_ user
- `sudo pip3 install virtualenv`
- `python3.9 -m venv venv`
- `source venv/bin/activate`
- `pip install pip-tools`
- add at the and of ~/.bashrc
  ```source ~/venv/bin/activate
  export POSTGRES_DB=longterm
  export POSTGRES_USER=longterm
  export POSTGRES_PASSWORD='---password---'
  export DJANGO_SETTINGS_MODULE=--long--secret--key--
  export DJANGO_SECRET_KEY="4j&zfx4f2+vo2u^22aq*yiyqu@vvg*^s_ge_tzct$e-3o(+&i7"
  ```
## **Longterm** application
- log-out and login again to _longterm_ user
- `mkdir logs`
- `python3.9 -m pip install --upgrade pip`
- `cd`
- `git clone -b develop https://gitlab.yourdomain.io/longterm-backend.git` or unpack archive
- `cd longterm-backend`
- `pip3 install -r requirements/prod.txt`
- `python manage.py migrate`
- `python manage.py collectstatic`
- `python manage.py createsuperuser` will create `admin` user for web application
   - setup strong password for admin user

## Certbot
Nginx is used as a web server and ssl reverse proxy. The following instruction is for _letsencrypt_, you can however, use any ssl provider.
- `sudo mkdir -p /var/www/letsencrypt`
- `sudo pip3 install --upgrade pip`
- `sudo pip3 install certbot`
- `sudo pip3 install certbot-nginx`
- `sudo /usr/local/bin/certbot certonly --standalone --agree-tos --email <your-email> -d longterm.yourdomain.io`
- /etc/cron.daily/letsencrypt-certbot
  ```
  #!/bin/bash
  # renew certificatey with certbot

  /usr/local/bin/certbot --nginx -d longterm.yourdomain.io --force-renewal --deploy-hook "systemctl reload nginx"
  ```
- `sudo chmod 755 /etc/cron.daily/letsencrypt-certbot`
- `sudo systemctl restart crond`

## Nginx
- `sudo vim /etc/nginx/conf.d/longterm.conf`
  ```
  upstream longterm {
    server localhost:8000;
  }

  server {
    listen 80;
    server_name longterm.yourdomain.io;
    return 301 https://$server_name$request_uri;
  }

  server {
    listen 443 ssl;
    server_name longterm.yourdomain.io;

    access_log /var/log/nginx/longterm.access.log;
    error_log /var/log/nginx/longterm.error.log;

    ssl_certificate /etc/letsencrypt/live/longterm.yourdomain.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/longterm.yourdomain.io/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/longterm.yourdomain.io/fullchain.pem;

    location /static/ {
      alias /home/longterm/public/;
    }

    location /builds/ {
      alias /home/longterm/apk_builds/;
    }

    location /media/videos/ {
      alias /home/media/media/videos/;
    }

    location /.well-known/acme-challenge/ {
      root /var/www/letsencrypt/;
    }

    location / {
      proxy_pass http://127.0.0.1:8000;
      proxy_set_header X-Forwarded-Host $server_name;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```
- `sudo setsebool -P httpd_can_network_connect 1`
- `sudo chcon -Rt httpd_sys_content_t  /home/longterm/public`
- `sudo chcon -Rt httpd_sys_content_t  /home/media/media`
- `sudo systemctl start nginx`
- `sudo systemctl enable nginx`

## start longterm application
- `systemctl start supervisord`
- `systemctl enable supervisord`

## API token
- open https://longterm.yourdomain.io/admin
- login as `admin` (password created in the section "Longterm application")
- go to the https://longterm.yourdomain.io/admin/accounts/customuser/add/
- create user API with strong password
- API key (token) will be automatically created, go to https://longterm.yourdomain.io/admin/authtoken/tokenproxy/ for API Token
- it looks like: `76cbd8---FAKE-FAKE---0d54e7bfe01d90df53a817`  <--- do not use this FAKE API Token
- save it, it is necessary for upload/download schedule/results
