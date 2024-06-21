import time

from flask import Blueprint, request, json
from .database import connect


app_client = Blueprint('app_client', __name__)


@app_client.route('/api/client', methods=['GET', 'POST', 'PUT', 'DELETE'])
def client():
    connector = connect()
    cur = connector.cursor()

    if request.method == 'GET':
        return json.dumps(get_clients(cur))
    elif request.method == 'POST':
        return json.dumps(post_client(connector, request.json))


@app_client.route("/api/client/<cust_id>", methods=['GET', 'DELETE', 'PUT'])
def client(cust_id):
    conn = connect()
    cursor = conn.cursor()

    if request.method == 'GET':
        return json.dumps(get_client(cursor, cust_id))
    elif request.method == 'DELETE':
        return json.dumps(delete_client(conn, request.json))
    elif request.method == 'PUT':
        return json.dumps(put_client(conn, request.json, cust_id))


def get_clients(cursor):
    response = []
    # prepare the sql statement (which contains arguments in order to
    # avoid sql injection)
    sql_procedure = """
        SELECT id_customer, last_name, first_name, company, primary_address, phone
        FROM customers
        ORDER BY last_name, first_name, company, id_customer
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
            'attribute3': row[5]
        })

    return response


def post_client(connector, data):
    last_name = data["last_name"]
    first_name = data["first_name"]
    company = data["company"]
    client_title = data["client_title"]
    language = data["language"]
    primary_address = data["primary_address"]
    secondary_address = data["secondary_address"]
    btw_tva_number = data["btw_tva_number"]
    phone = data["phone"]
    phone2 = data["phone2"]
    email = data["email"]
    current_time = time.strftime('%Y-%m-%d %H:%M:%S')

    # Creating a connection cursor
    cursor = connector.cursor()
    # Executing SQL Statements
    cursor.execute(
        """
        INSERT INTO customers (last_name, first_name, company, client_title, language, primary_address,
            secondary_address, btw_tva_number, phone, phone2, email, creation_date, last_modified)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (last_name, first_name, company, client_title, language, primary_address, secondary_address, btw_tva_number,
         phone, phone2, email, current_time, current_time)
    )

    # Saving the Actions performed on the DB
    connector.commit()

    return 'Customer has been added successfully'


def get_client(cursor, cust_id):
    cursor.execute("""
        SELECT * 
        FROM customers
        WHERE id_customer = %s
    """, cust_id)

    return cursor.fetchall()


def delete_client(connector, cust_id):
    cur = connector.cursor()
    # prepare the sql statement (which contains arguments in order
    # to avoid sql injection)
    sql_statement_1 = """
        DELETE FROM customers
        WHERE id_customer = %s
    """

    # execute the statement along with its arguments
    cur.execute(sql_statement_1, cust_id)
    # commit the changes to the database
    connector.commit()

    return cur.fetchall()


def put_client(connector, data, cust_id):
    last_name = data["last_name"]
    first_name = data["first_name"]
    company = data["company"]
    client_title = data["client_title"]
    language = data["language"]
    primary_address = data["primary_address"]
    secondary_address = data["secondary_address"]
    btw_tva_number = data["btw_tva_number"]
    phone = data["phone"]
    phone2 = data["phone2"]
    email = data["email"]
    current_time = time.strftime('%Y-%m-%d %H:%M:%S')

    cursor = connector.cursor()
    # Executing SQL Statements
    cursor.execute(
        """
        UPDATE customers
        SET
            last_name = %s,
            first_name = %s,
            company = %s,
            client_title = %s,
            language = %s,
            primary_address = %s,
            secondary_address = %s,
            btw_tva_number = %s,
            phone = %s,
            phone2 = %s,
            email = %s,
            last_modified = %s
        WHERE id_customer = %s
        """,
        (last_name, first_name, company, client_title, language, primary_address, secondary_address, btw_tva_number,
         phone, phone2, email, current_time, cust_id)
    )

    # Saving the Actions performed on the DB
    connector.commit()
    # Closing the cursor
    cursor.close()

    return "Customer has been updated successfully"
