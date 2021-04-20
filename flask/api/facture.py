from flask import Blueprint, request, json, jsonify
from .database import mysql


app_facture = Blueprint('app_facture', __name__)


@app_facture.route('/api/facture', methods=['GET', 'POST', 'PUT', 'DELETE'])
def facture():
    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the elements
    if request.method == 'GET':
        # get the filter to apply to the elements
        filter = request.args.get('filter')
        arguments = ()

        # prepare the sql statement (which contains arguments in order to
        # avoid sql injection)
        sql_procedure = """
            SELECT F.ID_FACTURE, C.NOM_CLIENT, C.PRENOM_CLIENT,
                C.SOCIETE_CLIENT,
                date_format(F.DATE_ECHEANCE, '%%e-%%c-%%Y'),
                date_format(F.DATE_FACTURE, '%%D %%M %%Y')
            FROM factures as F
                join clients as C on F.ID_CLIENT = C.ID_CLIENT
            WHERE F.DATE_FACTURE >= str_to_date(%s, %s)
                and extract(year from F.DATE_FACTURE) >= %s
                and extract(year from F.DATE_FACTURE) <= %s
            ORDER BY F.DATE_FACTURE desc"""

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

    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement = """
            DELETE FROM factures
            WHERE ID_FACTURE = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    cur.close()

    return json.dumps(response)


@app_facture.route("/api/facture/get_clients", methods=['GET'])
def clients():
    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM clients")
    data = cursor.fetchall()

    tableau_client = {}
    for i in data:
        tableau_client[i[0]] = [i[1:]]
    print(tableau_client)
    return jsonify(tableau_client)
