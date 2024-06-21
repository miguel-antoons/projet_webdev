import time

from flask import Blueprint, request, json, jsonify
from .database import connect


app_estimate = Blueprint('app_devis', __name__)


# API serves for all devis
@app_estimate.route('/api/estimates', methods=['GET', 'POST'])
def estimates():
    connector = connect()

    # API will return all the projects
    if request.method == 'GET':
        cur = connector.cursor()
        return json.dumps(get_estimates(cur, request.args.get('filter')))
    elif request.method == 'POST':
        return json.dumps(create_estimate(connector, request.json))


@app_estimate.route("/api/estimates/<est_id>", methods=['GET', 'DELETE', 'PUT'])
def estimates(est_id):
    connector = connect()

    if request.method == 'GET':
        return json.dumps(get_estimate(connector, est_id))
    elif request.method == 'DELETE':
        return json.dumps(delete_estimate(connector, est_id))
    elif request.method == 'PUT':
        return json.dumps(update_estimate(connector, est_id, request.json))


def get_estimates(cursor, filters):
    # prepare the sql statement (which contains arguments in order to
    # avoid sql injection)
    sql_procedure = """
        SELECT e.id_estimate, c.last_name, c.first_name, c.company, e.construction_site_name, e.creation_date
        FROM 
            estimates e
            join customers c on e.id_customer = c.id_customer
        WHERE e.creation_date >= to_date(%s, %s)
            and extract(year from e.creation_date) >= %s
            and extract(year from e.creation_date) <= %s
        ORDER BY e.creation_date desc
    """

    # complete arguments according to the filter
    if len(filters) > 4:
        arguments = (filters, "%a %b %e %Y %H:%i:%s", 1, 999999999, )
    elif len(filters) == 4:
        arguments = ("1999-01-01", "%Y-%m-%d", filters, filters, )
    else:
        arguments = ("1999-01-01", "%Y-%m-%d", 1, 999999999, )

    # execute the statement
    cursor.execute(sql_procedure, arguments)
    # fetch the result
    results = cursor.fetchall()

    response = []
    # turn the result into a list of dictionnaries
    for row in results:
        response.append({
            'id': row[0],
            'attribute1': f"{row[1]} {row[2]}, {row[3]}",
            'attribute2': row[4],
            'attribute3': row[5]
        })

    return response


def create_estimate(connector, data):
    # Creating a connection cursor
    cursor = connector.cursor()
    current_time = time.strftime("%Y-%m-%d %H:%M:%S")

    # Executing SQL Statements
    cursor.execute(
        """
        INSERT INTO estimates (id_customer, creation_date, last_modified, construction_site, price_choice,
            price_bias_percentage, price_bias_const, id_estimate_text, construction_site_name, comment)
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (data['id_customer'], current_time, current_time, data['last_modified'], data['construction_site'],
         data['price_choice'], data['price_bias_percentage'], data['price_bias_const'], data['id_estimate_text'],
         data['construction_site_name'], data['comment'])
    )

    # Saving the Actions performed on the DB
    connector.commit()
    # Closing the cursor
    return cursor.fetchall()


def get_estimate(cursor, est_id):
    # prepare the sql statement (which contains arguments in order
    # to avoid sql injection)
    sql_statement = """
        SELECT * FROM estimates
        WHERE id_estimate = %s
    """

    # execute the statement along with its arguments
    cursor.execute(sql_statement, est_id)
    # fetch the result
    return cursor.fetchall()


def delete_estimate(connector, est_id):
    # prepare the sql statement (which contains arguments in order
    # to avoid sql injection)
    sql_statement = """
        DELETE FROM estimates
        WHERE id_estimate = %s
    """

    cur = connector.cursor()
    # execute the statement along with its arguments
    cur.execute(sql_statement, est_id)
    # commit the changes to the database
    connector.commit()

    return cur.fetchall()


def update_estimate(connector, est_id, data):
    # Creating a connection cursor
    cursor = connector.cursor()
    current_time = time.strftime("%Y-%m-%d %H:%M:%S")

    # Executing SQL Statements
    cursor.execute(
        """
        UPDATE estimates
        SET id_customer = %s,
            last_modified = %s,
            construction_site = %s,
            price_choice = %s,
            price_bias_percentage = %s,
            price_bias_const = %s,
            id_estimate_text = %s,
            construction_site_name = %s,
            comment = %s
        WHERE id_estimate = %s
        """,
        (data['id_customer'], current_time, data['construction_site'], data['price_choice'],
         data['price_bias_percentage'], data['price_bias_const'], data['id_estimate_text'],
         data['construction_site_name'], data['comment'], est_id)
    )

    # Saving the Actions performed on the DB
    connector.commit()
    # Closing the cursor
    return cursor.fetchall()
