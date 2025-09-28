import keyring
import requests

SERVICE_NAME = "FMCS_FACTORIOUSERAUTH"

def save_token(username: str,token: str):
    keyring.set_password(SERVICE_NAME, username, token)
    print("Token saved.")

def load_token(username):
    token = keyring.get_password(SERVICE_NAME, username)
    if token:
        print("Token loaded:", token)
    else:
        print("No token found.")
    return token

def delete_token(username):
    keyring.delete_password(SERVICE_NAME, username)
    print("Token deleted.")
    
    
def login(username: str, password: str):
    """retrieves a token by logging in user via factorio web api
    
    Keyword arguments:\n
        username: username/email of account
        password: password of account
    Return: returns the retrieved token\n
    """
    url = "https://auth.factorio.com/api-login"
    data = {
        "username": username,
        "password": password,
        "require_game_ownership": True,
    }
    response = requests.post(url, data=data)
    
    if response.status_code == 200:
        return response.json()[0]
    return response.json()