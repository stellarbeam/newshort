from flask import Flask, request
from flask.json import jsonify
from session_manager import SessionManager
import json
import atexit
from news_api import fetch_news
from summarizer import generate_summary
from apscheduler.schedulers.background import BackgroundScheduler
import datetime

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
        # list_of_response = fetch_news(news_api_key, category)
        # for response in list_of_response:
        #     response["content"] = generate_summary(response["content"], 4)
        list_of_response = db_session.execute("SELECT * FROM articles where cateory = "+ category)
        return jsonify(list_of_response)
    else:
        return "Bad request", 400

def add_news():
    for category in all_categories:
        list_of_response = fetch_news(news_api_key, category)
        for response in list_of_response:
            response["content"] = generate_summary(response["content"], 4)
            query = f"INSERT INTO newshorts.articles ( url, title, content, published_date, category ) VALUES ( "+response["url"]+ ", "+response["title"]+ ","+response["content"]+ ","+response["date"]+ ","+response["category"]+ " )"
            res = db_session.execute(query)


def delete_news():
    yourdate = datetime.datetime.now()
    # requireddate = ""+ yourdate.year + "-"+ yourdate.month + "-"+yourdate.day + " "+yourdate.hour+":"+yourdate.minute+":"+yourdate.second
    query = f"DELETE FROM newshorts.articles WHERE DATEDIFF(hour, published_date,"+yourdate+") > 120"
    
    res = db_session.execute(query)

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
scheduler.add_job(func=add_news, trigger="interval", minutes=60)
scheduler.add_job(func=delete_news, trigger="interval", minutes=47)
scheduler.start()

init_news_api()
# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

if __name__ == '__main__':
    print_version()
    app.run()
