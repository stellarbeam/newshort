from flask import Flask, request
from session_manager import SessionManager
import requests as http
import json

app = Flask(__name__)
db_session = None 
news_api_key = None

def print_version():
    global db_session
    row = db_session.execute("select release_version from system.local").one()

    if row:
        print("Astra DB verion:",row["release_version"])
    else:
        print("An error occurred.")

def init_news_api():
    global news_api_key
    details_file = open('client-details.json', "r")
    data = json.load(details_file)
    
    news_api_key = data["news-api-key"]

@app.route("/")
def hello_world():
    print_version()
    return "<p>Hello, World!</p>"

@app.route("/news")
def get_news():
    query = request.args["q"]

    url = ('https://newsapi.org/v2/everything?'
       f'q={query}&'
       'from=2021-09-03&'
       'sortBy=popularity&'
       f'apiKey={news_api_key}')

    # print(url)

    response = http.get(url)

    return response.json()

if __name__ == '__main__':
    db_session = SessionManager.get_instance().connect()
    init_news_api()
    print_version()
    app.run()
