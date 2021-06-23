from flask import Blueprint, request, jsonify, json
from .database import mysql


app_client = Blueprint('app_client', __name__)


@app_client.route('/api/client', methods=['GET', 'POST', 'PUT', 'DELETE'])
def client():
    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the elements
    if request.method == 'GET':
        response = get_clients(cur)

    elif request.method == 'DELETE':
        response = delete_client(int(request.args.get('id')), cur)

    elif request.method == 'POST':
        response = post_client(request.json, cur)

    elif request.method == 'PUT':
        response = put_client(request.json, cur)

    connector.commit()
    cur.close()

    return json.dumps(response)


def delete_client(client_id, cursor):
    # prepare the sql statement (which contains arguments in order
    # to avoid sql injection)
    sql_statement_1 = """
        DELETE FROM clients
        WHERE ID_CLIENT = %s
    """

    sql_statement_2 = """
        DELETE FROM devis
        WHERE ID_CLIENT = %s
    """

    sql_statement_3 = """
        DELETE FROM factures
        WHERE ID_CLIENT = %s
    """

    sql_statement_4 = """
        DELETE FROM rgie
        WHERE ID_CLIENT = %s
    """

    sql_statement_5 = """
        DELETE FROM etiquettes
        WHERE ID_CLIENT = %s
    """

    # execute the statement along with its arguments
    cursor.execute(sql_statement_2, (client_id, ))
    cursor.execute(sql_statement_3, (client_id, ))
    cursor.execute(sql_statement_4, (client_id, ))
    cursor.execute(sql_statement_5, (client_id, ))
    cursor.execute(sql_statement_1, (client_id, ))

    return cursor.fetchall()


def get_clients(cursor):
    # prepare the sql statement (which contains arguments in order to
    # avoid sql injection)
    response = []

    sql_procedure = """
        SELECT ID_CLIENT, NOM_CLIENT, PRENOM_CLIENT, SOCIETE_CLIENT,
            ADRESSE_CLIENT, CAST(TELEPHONE_CLIENT AS CHAR)
        FROM clients
        ORDER BY NOM_CLIENT, PRENOM_CLIENT, SOCIETE_CLIENT, ID_CLIENT asc
        """

    # execute the statement
    cursor.execute(sql_procedure)

    # fetch the result
    results = cursor.fetchall()

    # turn the result into a list of dictionnaries
    for row in results:
        response.append({
            'id': row[0],
            'attribute1': f"{row[1]} {row[2]}, {row[3]}",
            'attribute2': row[4],
            'date': row[5]
        })

    return response


def post_client(data, cursor):
    arguments = (
        data["name"],
        data["firstname"],
        data["titre"]["value"],
        data["societe"],
        data["langue"]["value"],
        data["address1"],
        data["tva"],
        data["phoneNumber"],
        data["email"],
        data["address2"],
        data["architect"],
    )

    # Executing SQL Statements
    cursor.execute(
        '''INSERT INTO clients (
            NOM_CLIENT,
            PRENOM_CLIENT,
            TITRE_CLIENT,
            SOCIETE_CLIENT,
            LANGUE_CLIENT,
            ADRESSE_CLIENT,
            NUMERO_TVA_CLIENT,
            TELEPHONE_CLIENT,
            EMAIL_CLIENT,
            ADRESSE_CLIENT_SECONDAIRE,
            NOM_ARCHITECT
        )
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ''',
        arguments
    )

    # get the id of the newly created row
    sql_procedure = """
        SELECT LAST_INSERT_ID();
    """

    cursor.execute(sql_procedure)
    mysql_result = cursor.fetchall()

    # set the response to the id of the newly created row
    response = {
        'projectID': mysql_result[0][0]
    }

    return response


def put_client(data, cursor):
    arguments = (
        data["name"],
        data["firstname"],
        data["titre"]["value"],
        data["societe"],
        data["langue"]["value"],
        data["address1"],
        data["tva"],
        data["phoneNumber"],
        data["email"],
        data["address2"],
        data["architect"],
        data["clientID"],
    )

    # Executing SQL Statements
    cursor.execute(
        """
        UPDATE clients SET
            NOM_CLIENT = %s,
            PRENOM_CLIENT = %s,
            TITRE_CLIENT = %s,
            SOCIETE_CLIENT = %s,
            LANGUE_CLIENT = %s,
            ADRESSE_CLIENT = %s,
            NUMERO_TVA_CLIENT = %s,
            TELEPHONE_CLIENT = %s,
            EMAIL_CLIENT = %s,
            ADRESSE_CLIENT_SECONDAIRE = %s,
            NOM_ARCHITECT = %s
        WHERE ID_CLIENT = %s
        """,
        arguments
    )

    # get the id of the newly created row
    sql_procedure = """
        SELECT ID_CLIENT
        FROM clients
        WHERE
            NOM_CLIENT = %s
            and PRENOM_CLIENT = %s
            and TITRE_CLIENT = %s
            and SOCIETE_CLIENT = %s
            and LANGUE_CLIENT = %s
            and ADRESSE_CLIENT = %s
            and NUMERO_TVA_CLIENT = %s
            and TELEPHONE_CLIENT = %s
            and EMAIL_CLIENT = %s
            and ADRESSE_CLIENT_SECONDAIRE = %s
            and NOM_ARCHITECT = %s
            and ID_CLIENT = %s
    """

    cursor.execute(sql_procedure, arguments)
    mysql_result = cursor.fetchall()

    # set the response to the id of the newly created row
    response = {
        'projectID': mysql_result[0][0]
    }

    return response


@app_client.route("/api/client/<id>", methods=['GET'])
def client_id(id):
    cursor = mysql.connection.cursor()

    cursor.execute(
        """
        SELECT
            ID_CLIENT,
            NOM_CLIENT,
            PRENOM_CLIENT,
            TITRE_CLIENT,
            SOCIETE_CLIENT,
            LANGUE_CLIENT,
            ADRESSE_CLIENT,
            NUMERO_TVA_CLIENT,
            TELEPHONE_CLIENT,
            EMAIL_CLIENT,
            ADRESSE_CLIENT_SECONDAIRE,
            NOM_ARCHITECT
        FROM clients where ID_CLIENT = %s
        """,
        (id, ))

    return json.dumps(cursor.fetchall())
