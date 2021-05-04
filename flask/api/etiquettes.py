from flask import Blueprint, request, json
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
        # get the filter to apply to the projects
        filter = request.args.get('filter')
        arguments = ()

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

        # complete arguments according to the filter
        if len(filter) > 4:
            arguments = (filter, "%a %b %e %Y %H:%i:%s", 1, 999999999, )
        elif len(filter) == 4:
            arguments = ("1999-01-01", "%Y-%m-%d", filter, filter, )
        else:
            arguments = ("1999-01-01", "%Y-%m-%d", 1, 999999999, )

        # execute the statement
        cur.execute(sql_procedure, arguments)

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

    elif request.method == 'POST':
        data = request.json
        arguments = (data[0], data[1], json.dumps(data[2]), )

        sql_procedure = """
            INSERT INTO etiquettes (ID_CLIENT, CHANTIER, CODE_JSON)
            VALUES (%s, %s, %s);
        """

        cur.execute(sql_procedure, arguments)
        connector.commit()

        sql_procedure = """
            SELECT LAST_INSERT_ID();
        """

        cur.execute(sql_procedure)
        mysql_result = cur.fetchall()

        response = {
            'projectID': mysql_result[0][0]
        }

    elif request.method == 'PUT':
        data = request.json
        arguments = (data[0], json.dumps(data[1]), data[2], )

        sql_procedure = """
            UPDATE etiquettes
            SET
                CHANTIER = %s,
                CODE_JSON =  %s
            WHERE ID_ETIQUETTE = %s
        """

        cur.execute(sql_procedure, arguments)
        connector.commit()

        response = cur.fetchall()

    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement = """
            DELETE FROM etiquettes
            WHERE ID_ETIQUETTE = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    cur.close()

    return json.dumps(response)


@app_etiquette.route('/api/etiquettes/<id>', methods=['GET'])
def etiquette(id):
    connector = mysql.connection
    arguments = (id, )
    cur = connector.cursor()

    sql_procedure = """
        SELECT ID_ETIQUETTE, E.ID_CLIENT, NOM_CLIENT, PRENOM_CLIENT,
            SOCIETE_CLIENT, CHANTIER, CODE_JSON
        FROM etiquettes as E
            JOIN clients as C on E.ID_CLIENT = C.ID_CLIENT
        WHERE ID_ETIQUETTE = %s
    """

    cur.execute(sql_procedure, arguments)

    result = cur.fetchone()

    response = {
        'projectID': result[0],
        'clientID': result[1],
        'clientInfo': f"{result[2]} {result[3]}, {result[4]}",
        'constructionSite': result[5],
        'projectData': result[6]
    }

    return json.dumps(response)
