from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json

def get_db_session():
  
    details_file = open('client-details.json',)
    data = json.load(details_file)
    
    client_id = data["client-id"]
    client_secret = data["client-secret"]

    details_file.close()

    cloud_config= {
        'secure_connect_bundle': 'secure-connect-preferences.zip'
    }

    auth_provider = PlainTextAuthProvider(client_id, client_secret)
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
    session = cluster.connect()

    return session    

if __name__ == '__main__':
    session = get_db_session()
    
    row = session.execute("select release_version from system.local").one()

    if row:
        print(row[0])
    else:
        print("An error occurred.")