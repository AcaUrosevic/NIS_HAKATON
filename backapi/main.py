import os
os.system("sleep 20")
from flask import Flask
from flask import jsonify
from flask_cors import CORS

from models import database
from models import Info, Event, Event

from sqlalchemy import and_, column, distinct, func, literal_column, null, select

from configuration import Configuration


application = Flask ( __name__ )
CORS(application)
application.config.from_object ( Configuration )

database.init_app ( application )

@application.route("/get_machines", defaults={'name': None}, methods=["GET"])
@application.route ( "/get_machines/<name>", methods = ["GET"] )
def create_pay_invoice (name):
    if name is None:
        clients = database.session.query( Info.well, Info.lokacija ).all()
    else:
        clients = database.session.query( Info.well, Info.lokacija ).filter( Info.well == name ).all()

    retval = []

    static_prediction = "Failure in 15 days"
    static_failure_type = "Mechanical Failure"

    for client in clients:
        name = client[0]
        max_date = database.session.query(func.max(Event.datetime)).filter( Event.well == name ).group_by( Event.well ).scalar()
        retval.append( {"adress" : client[1] , "name" : client[0] , "poslednji" : max_date , "prediction": static_prediction , "failure_type": static_failure_type} )
    return jsonify( retval )

if ( __name__ == "__main__" ):
    PORT = os.environ["PORT"] if ( "PORT" in os.environ ) else "5000"
    HOST = "0.0.0.0" if ( "PRODUCTION" in os.environ ) else "localhost"
    print( Configuration.SQLALCHEMY_DATABASE_URI )
    application.run ( debug = True, port = PORT, host = HOST )
