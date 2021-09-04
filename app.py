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

all_categories = [
    "Business",
    "Entertainment",
    "India",
    "LifeStyle",
    "Politics",
    "ScienceAndTechnology",
    "Sports",
    "World" 
]

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

    

    if category in all_categories:
        list_of_response = fetch_news(news_api_key, category)
        for response in list_of_response:
            response["content"] = generate_summary(response["content"], 4)
        return jsonify(list_of_response)
    else:
        return "Bad request", 400

@app.route("/get_prefs")
def get_prefs():
    userid = request.args["userid"]

    res = db_session.execute(f"SELECT categories FROM user_prefs WHERE userid = '{userid}'").one()
    
    if res is not None:
        categories = list(res["categories"])
        return jsonify(categories)
    else:
        return "Bad request", 400

@app.route("/set_prefs", methods = ["POST"] )
def set_prefs():
    userid = request.json["userid"]
    categories = request.json["categories"] # as list

    if type(categories) != list or len(categories) == 0 or type(userid) != str:
        return "Bad Request", 400

    for category in categories:
        if type(category) != str or category not in all_categories:
            return "Bad Request", 400

    categories_str = "{ '" + "', '".join(categories) + "' }"
    query = f"INSERT INTO user_prefs ( userid, categories ) VALUES ( '{userid}', {categories_str} )"
    
    # print(query)
    
    res = db_session.execute(query)
    
    # print(res)

    return "OK"

db_session = SessionManager.get_instance().connect()
scheduler = BackgroundScheduler()
scheduler.add_job(func=get_news, trigger="interval", seconds=60*60)
scheduler.start()

init_news_api()
# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

if __name__ == '__main__':
    print_version()
    app.run()
