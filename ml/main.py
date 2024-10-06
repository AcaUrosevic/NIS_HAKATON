import atexit
import os

import joblib
os.system("sleep 20")
from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request

from apscheduler.schedulers.background import BackgroundScheduler
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score, roc_curve, f1_score, precision_recall_fscore_support
import matplotlib.pyplot as plt
import seaborn as sns
import tensorflow as tf
from tensorflow import keras
from sklearn.cluster import KMeans
from imblearn.over_sampling import RandomOverSampler
from imblearn.under_sampling import RandomUnderSampler
from sklearn.utils.class_weight import compute_class_weight

from configuration import Configuration
from models import database
from models import Info, Event, Telemetryd, Predikcije


application = Flask ( 'ml' )
CORS(application)
application.config.from_object ( Configuration )

max_id = 3299072

failiures = pd.read_csv('./data/event.csv')
telemetry = pd.read_csv('./data/tele.csv')
ml_model = joblib.load('model.pkl')

database.init_app ( application )

def predict_failure_for_well(well_id, telemetry_df, failures_df, model, scaler):
    # Filtriraj podatke za prosleđeni well_id
    
    telemetry_data = telemetry_df[telemetry_df['well'] == well_id].copy()  # Kreiraj kopiju DataFrame-a
    failure_data = failures_df[failures_df['well'] == well_id]

    # Proveri da li postoje podaci za dati bunar
    if telemetry_data.empty:
        print(f"Nema podataka za bunar: {well_id}")
        return

    # Proveri da li postoji događaj otkaza
    if failure_data.empty:
        print(f"Nema zabeleženih otkaza za bunar: {well_id}")
        return

    # Obrada podataka
    #Zelim objasnjenje zasto ovo radimo?
    
    telemetry_data.ffill(inplace=True)
    telemetry_data.bfill(inplace=True)

    # Koristite .loc[] za izbegavanje upozorenja
    telemetry_data['measure_date'] = pd.to_datetime(telemetry_data['measure_date'], errors='coerce')

    # Provera da li su sve vrednosti uspešno konvertovane
    if telemetry_data['measure_date'].isnull().any():
        print("Neki podaci u koloni 'measure_date' nisu pravilno konvertovani u datetime.")
        return

    # Kreiraj novu kolonu 'date' na osnovu 'measure_date'
    telemetry_data['date'] = telemetry_data['measure_date'].dt.date

    # Izračunaj dnevne prosek merenja
    daily_avg = telemetry_data.groupby(['well', 'date']).mean().reset_index()

    # Spoji sa podacima o otkazima
    data = pd.merge(daily_avg, failure_data, left_on='well', right_on='well', how='left')
    data.dropna(subset=['date_time', 'label'], inplace=True)

    # Konvertovanje u datetime format
    data['measure_date'] = pd.to_datetime(data['measure_date'])
    data['date_time'] = pd.to_datetime(data['date_time'])
    data['days_to_failure'] = (data['date_time'] - data['measure_date']).dt.days

    # Izbacivanje ne relevantnih kolona
    X = data.drop(['days_to_failure', 'measure_date', 'date_time', 'well', 'date', 'label', 'esp_type'], axis=1)
    
    # Ako su potrebne dummies, uradi to
    X = pd.get_dummies(X, drop_first=True)

    # Skaliranje
    X_scaled = scaler.transform(X)

    # Predikcija
    y_pred = model.predict(X_scaled)

    # Kreiranje DataFrame-a sa predikcijama
    failure_type_mapping = {
        0: 'Mehanička primesa',
        1: 'Hidratacija',
        2: 'Nehermetičan tubing',
        3: 'Nema otkaza'
    }

    predicted_days = int(y_pred.flatten()[0])  # Uzimamo prvi rezultat
    failure_type_index = int(np.round(predicted_days / 10))  # Pretpostavljamo da koristimo klastere
    failure_type = failure_type_mapping.get(failure_type_index, 'Nepoznato')

    # Izračunavanje datuma otkaza
    prediction_date = data['measure_date'].iloc[-1] + pd.Timedelta(days=predicted_days)

    print(f"Očekuje se otkaz za bunar '{well_id}' za {predicted_days} dana ({failure_type}) na datum {prediction_date.date()}.")
    return { "predicted_days": predicted_days, "failure_type": failure_type_index }


scaler = StandardScaler()
def scale_it():
    telemetry_df2 = telemetry.sample(frac=0.3)

    telemetry_df2.ffill(inplace = True)
    telemetry_df2.bfill(inplace = True)

    telemetry_df2['measure_date'] = pd.to_datetime(telemetry_df2['measure_date'])
    telemetry_df2['date'] = telemetry_df2['measure_date'].dt.date

    daily_avg = telemetry_df2.groupby(['well', 'date']).mean().reset_index()
    daily_avg.to_csv('daily_avg_measurements.csv', index=False)

    data = pd.merge(daily_avg, failiures, left_on='well', right_on='well', how='left')

    data.dropna(subset=['date_time', 'label'], inplace=True)

    data = pd.merge(daily_avg, failiures, left_on='well', right_on='well', how='left')
    data['measure_date'] = pd.to_datetime(data['measure_date'])
    data['date_time'] = pd.to_datetime(data['date_time'])
    data['days_to_failure'] = (data['date_time'] - data['measure_date']).dt.days

    # odabir relevantnih kolona
    X = data.drop(['days_to_failure', 'measure_date', 'date_time', 'well', 'date', 'label', 'esp_type'], axis=1)
    y = data['days_to_failure']

    X = pd.get_dummies(X, drop_first=True)
    data.dropna(subset=['date_time', 'label'], inplace=True)
    dummy_tele = data.copy()
    dummy_tele['measure_date'] = pd.to_datetime(dummy_tele['measure_date'])
    dummy_tele['date_time'] = pd.to_datetime(dummy_tele['date_time'])
    dummy_tele['days_to_failure'] = (dummy_tele['date_time'] - dummy_tele['measure_date']).dt.days
    X = dummy_tele.drop(['days_to_failure', 'measure_date', 'date_time', 'well', 'date', 'label', 'esp_type'], axis=1)
    y = dummy_tele['days_to_failure']

    X = pd.get_dummies(X, drop_first=True)
    # odabir relevantnih kolona
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    X = pd.get_dummies(X, drop_first=True)

def update_predictions():
    with application.app_context():
        print('Updating predictions')
        wells = database.session.query( Info.well ).distinct().all()
        for well_id in wells:
            try:
                print( well_id[0] )
                rezultat = predict_failure_for_well(well_id[0], telemetry, failiures, ml_model,scaler)
                objekat = database.session.query( Predikcije ).filter_by( well = well_id[0] ).first()
                objekat.days = rezultat['predicted_days']
                objekat.decision = rezultat['failure_type']
                database.session.add(objekat)
                database.session.commit()
            except Exception as e:
                print(f"Greška pri predikciji za bunar '{well_id}': {str(e)}")


scheduler = BackgroundScheduler()
scheduler.add_job(func=update_predictions, trigger="interval", seconds=5)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

if ( __name__ == "__main__" ):
    scale_it()
    PORT = os.environ["PORT"] if ( "PORT" in os.environ ) else "5000"
    HOST = "0.0.0.0" if ( "PRODUCTION" in os.environ ) else "localhost"
    print( Configuration.SQLALCHEMY_DATABASE_URI )
    application.run ( debug = True, port = PORT, host = HOST )
