import os
from dotenv import load_dotenv

load_dotenv()


def build_database_uri():
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        return database_url

    mysql_host = os.environ.get('MYSQL_HOST', 'localhost')
    mysql_port = int(os.environ.get('MYSQL_PORT', 3306))
    mysql_user = os.environ.get('MYSQL_USER', 'root')
    mysql_password = os.environ.get('MYSQL_PASSWORD', '')
    mysql_database = os.environ.get('MYSQL_DATABASE', 'itew6_db')

    return (
        f'mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/'
        f'{mysql_database}?charset=utf8mb4'
    )


def build_engine_options(database_uri):
    if database_uri.startswith('sqlite'):
        return {}

    return {
        'pool_recycle': 3600,
        'pool_pre_ping': True,
    }

class Config:
    """Application configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'itew6_db')

    SQLALCHEMY_DATABASE_URI = build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = build_engine_options(SQLALCHEMY_DATABASE_URI)
    PORT = int(os.environ.get('PORT', 5000))
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    TESTING = False

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = False
    TESTING = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

