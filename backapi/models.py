from importlib import metadata
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Date, DateTime, Integer, LargeBinary, String, Table, Text

database = SQLAlchemy ( )


class Event(database.Model):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True)
    datetime = Column(Date, nullable=False)
    well = Column(String(45), nullable=False)
    esp_type = Column(String(45), nullable=False)
    label = Column(String(45), nullable=False)


class Info(database.Model):
    __tablename__ = 'info'

    id = Column(Integer, primary_key=True)
    well = Column(String(45))
    lokacija = Column(String(45))


class Ml(database.Model):
    __tablename__ = 'ml'

    id = Column(Integer, primary_key=True)
    datetime = Column(DateTime)
    model = Column(LargeBinary)


class Telemetryd(database.Model):
    __tablename__ = 'telemetry'

    id = Column(Integer, primary_key=True)
    well = Column(Text)
    measure_date = Column(DateTime)
    napon_ab = Column(Text)
    napon_bc = Column(Text)
    napon_ca = Column(Text)
    elektricna_struja_fazaa = Column(Text)
    elektricna_struja_fazab = Column(Text)
    elektricna_struja_fazac = Column(Text)
    koeficijent_kapaciteta = Column(Text)
    frekvencija = Column(Text)
    radno_opterecenje = Column(Text)
    aktivna_snaga = Column(Text)
    pritisak_na_prijemu_pumpe = Column(Text)
    temperatura_motora = Column(Text)
    temperatura_u_busotini = Column(Text)