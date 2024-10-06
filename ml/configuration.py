import os

DATABASE_USERNAME = os.environ["DATABASE_USERNAME"] if ( "DATABASE_USERNAME" in os.environ ) else "root"
DATABASE_PASSWORD = os.environ["DATABASE_PASSWORD"] if ( "DATABASE_PASSWORD" in os.environ ) else "root"
DATABASE_URL      = os.environ["DATABASE_URL"]      if ( "DATABASE_URL" in os.environ )      else "localhost:3306"
DATABASE_NAME     = os.environ["DATABASE_NAME"]     if ( "DATABASE_NAME" in os.environ )     else "mydb"

class Configuration:
    SQLALCHEMY_DATABASE_URI = f"mysql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_URL}/{DATABASE_NAME}"

