from flask import Flask, request
from flask.json import jsonify
from session_manager import SessionManager
import json
import atexit
from news_api import fetch_news
from summarizer import generate_summary
from apscheduler.schedulers.background import BackgroundScheduler

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
    category = request.args["cat"]

    categories = [
        "Business",
        "Entertainment",
        "India",
        "LifeStyle",
        "Politics",
        "ScienceAndTechnology",
        "Sports",
        "World" 
    ]

    if category in categories:
        list_of_response = fetch_news(news_api_key, category)
        for response in list_of_response:
            response["content"] = generate_summary(response["content"], 4)
        return jsonify(list_of_response)
    else:
        return "Bad request", 400

if __name__ == '__main__':
    db_session = SessionManager.get_instance().connect()
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=get_news, trigger="interval", seconds=60*60)
    scheduler.start()

    # Shut down the scheduler when exiting the app
    init_news_api()
    print_version()
    app.run()
    atexit.register(lambda: scheduler.shutdown())
