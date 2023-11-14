import json
import hashlib
import requests

def get_users():
    users_file = open("../sources/users.json")
    users = json.load(users_file)
    return users


def login(external_id):
    url = "https://longterm-doc.yourdomain.io/api/users/token/login/"
    r = requests.post(url, {
        "external_id": external_id
    })
    return r.text


def generate_external_id(first_name, last_name, phone_number):
    salt = 'your-token-salt'

    txt = f'{first_name}{last_name}{phone_number}{salt}'.encode('UTF-8')
    return hashlib.sha256(txt).hexdigest()



def main():
    users = get_users()
    for index, user in enumerate(users):
        external_id = generate_external_id(user["first_name"], user["last_name"], user["phone_number"])
        print(external_id)
        print(login(external_id))


if __name__ == "__main__":
    main()
