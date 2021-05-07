import pytest
import mysql.connector
from mysql.connector import Error
from os import environ


@pytest.fixture(scope='module')
def connexion():
    connextor = None

    try:
        connector = mysql.connector.connect(
            host=environ.get('DB_HOST'),
            database=environ.get('DB'),
            user=environ.get('DB_USER'),
            password=environ.get('DB_PASSWORD')
        )

        if connector.is_connected():
            yield connector

    except Error as e:
        print(e)

    if connector is not None and connector.is_connected:
        connector.close()


@pytest.fixture
def cursor(connexion):
    cursor = connexion.cursor()
    yield cursor
    connexion.rollback()
