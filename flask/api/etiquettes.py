from flask import Blueprint, request, json, Response
from .database import mysql


app_etiquette = Blueprint('app_etiquette', __name__)


@app_etiquette.route(
    '/api/etiquettes',
    methods=['GET', 'POST', 'PUT', 'DELETE']
)
def etiquettes():
    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the projects
    if request.method == 'GET':
        response = get_all_etiquettes(request.args.get('filter'), cur)

    # API will create a new row for the new project in the database
    elif request.method == 'POST':
        response = create_new_etiquette(request.json, cur)

    # method to update a project
    elif request.method == 'PUT':
        # get the data from the post and put inside a tuple
        response = update_etiquette(request.json, cur)

    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        response = delete_etiquette(
            int(request.args.get('id')),
            cur
        )

    connector.commit()
    cur.close()

    return Response(json.dumps(response), mimetype='application/json')


# api to get a particular row of the database (aka one project)
@app_etiquette.route('/api/etiquettes/<id>', methods=['GET'])
def etiquette(id):
    connector = mysql.connection
    return Response(
        json.dumps(get_etiquette_by_id(id, connector.cursor())),
        mimetype='application/json'
    )


def get_etiquette_by_id(id, cursor):
    arguments = (id, )

    # prepare the sql procedure to get one and only one row
    sql_procedure = """
        SELECT ID_ETIQUETTE, E.ID_CLIENT, NOM_CLIENT, PRENOM_CLIENT,
            SOCIETE_CLIENT, CHANTIER, CODE_JSON
        FROM etiquettes as E
            JOIN clients as C on E.ID_CLIENT = C.ID_CLIENT
        WHERE ID_ETIQUETTE = %s
    """

    cursor.execute(sql_procedure, arguments)

    # get the one result form the sql procedure
    result = cursor.fetchone()

    # prepare the response
    response = {
        'projectID': result[0],
        'clientID': result[1],
        'clientInfo': f"{result[2]} {result[3]}, {result[4]}",
        'constructionSite': result[5],
        'projectData': result[6]
    }

    cursor.close()

    return response


def get_all_etiquettes(filter, cursor):
    response = []       # contains the final results from the database
    arguments = ()      # contains the arguments for the sql procedure

    # prepare the sql statement (which contains arguments in order to
    # avoid sql injection)
    sql_procedure = """
        SELECT E.ID_ETIQUETTE, C.NOM_CLIENT, C.PRENOM_CLIENT,
            C.SOCIETE_CLIENT,
            E.CHANTIER, date_format(E.DATE_ETIQUETTE, '%%D %%M %%Y')
        FROM etiquettes as E
            join clients as C on E.ID_CLIENT = C.ID_CLIENT
        WHERE E.DATE_ETIQUETTE >= str_to_date(%s, %s)
            and extract(year from E.DATE_ETIQUETTE) >= %s
            and extract(year from E.DATE_ETIQUETTE) <= %s
        ORDER BY E.DATE_ETIQUETTE desc"""

    arguments = set_arguments(filter)

    # execute the statement
    cursor.execute(sql_procedure, arguments)

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


def set_arguments(filter):
    # complete arguments according to the filter
    if len(filter) > 4:
        return (filter, "%a %b %e %Y %H:%i:%s", 1, 999999999, )
    elif len(filter) == 4:
        return ("1999-01-01", "%Y-%m-%d", filter, filter, )
    else:
        return ("1999-01-01", "%Y-%m-%d", 1, 999999999, )


def create_new_etiquette(data, cursor):
    response = []
    arguments = (data[0], data[1], json.dumps(data[2]), )

    # sql procedure to create a new row
    sql_procedure = """
        INSERT INTO etiquettes (ID_CLIENT, CHANTIER, CODE_JSON)
        VALUES (%s, %s, %s);
    """

    cursor.execute(sql_procedure, arguments)

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


def update_etiquette(data, cursor):
    arguments = (data[0], json.dumps(data[1]), data[2], )

    # sql procedure to update the row
    sql_procedure = """
        UPDATE etiquettes
        SET
            CHANTIER = %s,
            CODE_JSON =  %s
        WHERE ID_ETIQUETTE = %s
    """

    cursor.execute(sql_procedure, arguments)

    return ["successfully updated project"]


def delete_etiquette(id_to_delete, cursor):
    arguments = (id_to_delete, )

    # prepare the sql statement (which contains arguments in order
    # to avoid sql injection)
    sql_statement = """
        DELETE FROM etiquettes
        WHERE ID_ETIQUETTE = %s
    """

    # execute the statement along with its arguments
    cursor.execute(sql_statement, arguments)

    return cursor.fetchall()
