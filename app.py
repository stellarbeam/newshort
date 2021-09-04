from flask import Flask, request
from session_manager import SessionManager
import requests as http
import json
from news_api import fetch_news

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
    # query = request.args["q"]

    jsondata = fetch_news(news_api_key, ["business","sports"])

    return jsondata

if __name__ == '__main__':
    db_session = SessionManager.get_instance().connect()
    init_news_api()
    print_version()
    app.run()
