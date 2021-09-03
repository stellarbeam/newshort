from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from cassandra.query import dict_factory
from cassandra import Unauthorized, Unavailable, AuthenticationFailed, OperationTimedOut, ReadTimeout
import json

class SessionManager(object):

    __instance = None
    secure_connect_bundle_path = 'secure-connect-preferences.zip'
    _session = None

    ping_query = "SELECT data_center FROM system.local"

    @staticmethod
    def get_instance():
        if SessionManager.__instance is None:
            SessionManager()
        return SessionManager.__instance

    def __init__(self):
        SessionManager.__instance = self

    def connect(self):
        if self._session is None:
            details_file = open('client-details.json', "r")
            data = json.load(details_file)
            
            client_id = data["client-id"]
            client_secret = data["client-secret"]

            details_file.close()

            astra_config = {
                'secure_connect_bundle': self.secure_connect_bundle_path
            }

            cluster = Cluster(cloud=astra_config, auth_provider=PlainTextAuthProvider(client_id, client_secret))
            self._session = cluster.connect()

            self._session.row_factory = dict_factory

            # have the driver return LocationUDT as a dict
            # cluster.register_user_type(self.keyspace, 'location_udt', dict)

            self.initialized = True

        return self._session

    def check_connection(self):
        try:
            result = self.connect().execute(self.ping_query)
            return True
        except (Unauthorized, Unavailable, AuthenticationFailed, OperationTimedOut, ReadTimeout) as e:
            return False

    def close(self):
        if self.initialized and self._session is not None:
            self._session.shutdown()
