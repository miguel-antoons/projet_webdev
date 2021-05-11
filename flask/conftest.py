import pytest
import mysql.connector
from mysql.connector import Error
import configparser
import json


@pytest.fixture(scope='module')
def connexion():
    connector = None
    mysql_config = None
    mysql_config_path = './mysql.ini'

    try:
        mysql_config = configparser.ConfigParser()
        mysql_config.read('flask/mysql.ini')

    except Exception as e:
        print(e)

    try:
        connector = mysql.connector.connect(
            host=mysql_config['mysql']['host'],
            database=mysql_config['mysql']['db'],
            user=mysql_config['mysql']['user'],
            password=mysql_config['mysql']['password'],
            auth_plugin='mysql_native_password'
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


@pytest.fixture
def insert_client(cursor):
    sql_statement = """
        INSERT INTO clients (
            NOM_CLIENT, PRENOM_CLIENT, TITRE_CLIENT, SOCIETE_CLIENT,
            LANGUE_CLIENT, ADRESSE_CLIENT, NUMERO_TVA_CLIENT, TELEPHONE_CLIENT,
            EMAIL_CLIENT
        )
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    arguments = (
        'Dupont',
        'Jean',
        'Mr',
        'test_societe',
        'Fr',
        'test_street 000, 0000 test_city',
        '010101010101',
        '050505050505',
        'jeandupont@example.com',
    )

    cursor.execute(sql_statement, arguments)

    sql_procedure = """
        SELECT LAST_INSERT_ID();
    """

    cursor.execute(sql_procedure)

    client_id = cursor.fetchall()

    yield client_id[0][0]


@pytest.fixture
def create_new_etiquette(cursor, insert_client):
    sql_statement = """
        INSERT INTO etiquettes (ID_CLIENT, CHANTIER, CODE_JSON)
        VALUES (%s, %s, %s);
    """

    arguments = (
        insert_client,
        'test_chantier',
        json.dumps(
            [
                [
                    {
                        'tempBackground': '',
                        'color': 'black',
                        'bold': False,
                        'colspan': 1,
                        'value': '',
                        'circuitNumber': {
                            'color': 'black',
                            'bold': False,
                            'value': ''
                        }
                    }
                ]
            ]
        ),
    )

    cursor.execute(sql_statement, arguments)

    sql_statement = """
        SELECT LAST_INSERT_ID();
    """

    cursor.execute(sql_statement)

    project_id = cursor.fetchall()

    return project_id[0][0], insert_client
