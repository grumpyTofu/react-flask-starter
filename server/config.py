from os import environ, path, urandom
import datetime
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))


class Config:
    """Base config."""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GOOGLE_CLIENT_ID = environ.get("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = environ.get("GOOGLE_CLIENT_SECRET")
    GOOGLE_CLIENT_SECRET_FILE = environ.get("GOOGLE_CLIENT_SECRET_FILE")
    GOOGLE_DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )
    SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    SECRET_KEY = '67681706705814926988217450263467825103115742778348395787050591504601043143932'
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=1)

class ProdConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = environ.get('PROD_DATABASE_URI')


class DevConfig(Config):
    FLASK_ENV = 'development'
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = environ.get('DEV_DATABASE_URI')
    OAUTHLIB_INSECURE_TRANSPORT = '1'