# -*- coding: utf-8 -*-
#
# Description:  urls, user names, headers, etc...
# Author:       Jaroslaw Bulat (kwant@agh.edu.pl, kwanty@gmail.com)
# Created:      09.11.2021
# License:      MIT
# File:         target_url_users.py

import os


class Target:
    media_user = 'media'
    server_url = None
    headers = None
    ssh_key = None

    def predefined_dev(self):
        self.server_url = 'https://longterm-dev.yourdomain.io'
        self.ssh_key = f'~/.ssh/media@{self.server_url}'
        self.headers = {'Authorization': f'Token {os.getenv("TOKEN_DEV", "fake_token_123abc_development")}', }  # token for API

    def predefined_prod(self):
        self.server_url = 'https://longterm.yourdomain.io'
        self.ssh_key = f'~/.ssh/media@{self.server_url}'
        self.headers = {'Authorization': f'Token {os.getenv("TOKEN_PROD", "fake_token_123abc_production")}', }  # token for API

    def set_header_from_token(self, token: str) -> None:
        """
        create header from token
        """
        self.headers = {'Authorization': f'Token {token}', }

    def set_server_url(self, server_url: str) -> None:
        """
        set server url
        """
        self.server_url = server_url.removesuffix('/')

    def set_ssh_key(self, ssh_key: str) -> None:
        """
        set ssh key
        """
        self.ssh_key = ssh_key

    def server_url_without_protocol(self) -> str:
        """
        :return: server url without protocols,
        """
        return self.server_url.replace('https://', '').replace('http://', '').removesuffix('/')
