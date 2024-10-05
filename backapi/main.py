import os
os.system("sleep 20")
from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request

from models import database
from models import Info, Event, Telemetryd

from sqlalchemy import and_, column, distinct, func, literal_column, null, select

from configuration import Configuration


application = Flask ( __name__ )
CORS(application)
application.config.from_object ( Configuration )

database.init_app ( application )

@application.route("/get_machines", defaults={'name': None}, methods=["GET"])
@application.route ( "/get_machines/<name>", methods = ["GET"] )
def get_machines (name):
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

@application.route("/add_measurement", methods=["POST"])
def post_telemetry( ):
    obj = request.get_json()
    #print (obj['aa'])
    new_id = database.session.query(func.max(Telemetryd.id)).scalar() + 1
    print(id)
    try:
        new_tele = Telemetryd(
            id = new_id,
            well = obj['well'],
            measure_date = obj['measure_date'],
            napon_ab = obj['napon_ab'],
            napon_bc = obj['napon_bc'],
            napon_ca = obj['napon_ca'],
            elektricna_struja_fazaa = obj['struja_a'],
            elektricna_struja_fazab = obj['struja_b'],
            elektricna_struja_fazac = obj['struja_c'],
            koeficijent_kapaciteta = obj['koef_kap'],
            frekvencija = obj['frekvencija'],
            radno_opterecenje = obj['radno_opterecenje'],
            aktivna_snaga = obj['aktivna_snaga'],
            pritisak_na_prijemu_pumpe = obj['pritisak'],
            temperatura_motora = obj['temp_motora'],
            temperatura_u_busotini = obj['temp_busotina']
        )
        database.session.add(new_tele)
        database.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400
    return b"Ok"


if ( __name__ == "__main__" ):
    PORT = os.environ["PORT"] if ( "PORT" in os.environ ) else "5000"
    HOST = "0.0.0.0" if ( "PRODUCTION" in os.environ ) else "localhost"
    print( Configuration.SQLALCHEMY_DATABASE_URI )
    application.run ( debug = True, port = PORT, host = HOST )
