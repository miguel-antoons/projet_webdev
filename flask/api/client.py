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
        # prepare the sql statement (which contains arguments in order to
        # avoid sql injection)
        sql_procedure = """
            SELECT ID_CLIENT, NOM_CLIENT, PRENOM_CLIENT, SOCIETE_CLIENT,
                ADRESSE_CLIENT, CAST(TELEPHONE_CLIENT AS CHAR)
            FROM clients
            ORDER BY NOM_CLIENT, PRENOM_CLIENT, SOCIETE_CLIENT, ID_CLIENT asc
            """

        # execute the statement
        cur.execute(sql_procedure)

        # fetch the result
        results = cur.fetchall()

        # turn the result into a list of dictionnaries
        for row in results:
            response.append({
                'id': row[0],
                'attribute1': f"{row[1]} {row[2]}, {row[3]}",
                'attribute2': row[4],
                'date': row[5]
            })

    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement_1 = """
            DELETE FROM clients
            WHERE ID_CLIENT = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement_1, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    elif request.method == 'POST':
        requete = request.json
        response = post_client(requete)

    elif request.method == 'PUT':
        requete = request.json
        response = put_client(requete)

    return json.dumps(response)


def post_client(data):
    print(data)
    arguments = (
        data["name"],
        data["firstname"],
        data["titre"]['value'],
        data["societe"],
        data["langue"]["value"],
        data["adress"],
        data["tva"],
        data["number"],
        data["email"],
    )

    # Creating a connection cursor
    cursor = mysql.connection.cursor()

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
            EMAIL_CLIENT
        )
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s) ''',
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

    # Saving the Actions performed on the DB
    mysql.connection.commit()

    # Closing the cursor
    cursor.close()

    return response


def put_client(data):

    arguments = (
        data["name"],
        data["firstname"],
        data["titre"]["value"],
        data["societe"],
        data["langue"]["value"],
        data["adress"],
        data["tva"],
        data["number"],
        data["email"],
        str(data["id"]),
    )

    # Creating a connection cursor
    cursor = mysql.connection.cursor()

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
            EMAIL_CLIENT = %s
        WHERE ID_CLIENT = %s
        """,
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

    # Saving the Actions performed on the DB
    mysql.connection.commit()

    # Closing the cursor
    cursor.close()

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
            EMAIL_CLIENT
        FROM clients where ID_CLIENT = %s
        """,
        (id))

    data = cursor.fetchall()

    return json.dumps(data)
