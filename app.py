from flask import Flask
from session_manager import SessionManager

app = Flask(__name__)
db_session = None 

def print_version():
    global db_session
    row = db_session.execute("select release_version from system.local").one()

    if row:
        print("Astra DB verion:",row["release_version"])
    else:
        print("An error occurred.")

@app.route("/")
def hello_world():
    print_version()
    return "<p>Hello, World!</p>"

if __name__ == '__main__':
    db_session = SessionManager.get_instance().connect()
    print_version()
    app.run()
