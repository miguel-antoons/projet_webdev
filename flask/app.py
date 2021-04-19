from flask import Flask, render_template, jsonify, request, redirect, url_for,\
    session, request
from flask_mysqldb import MySQL
import json
import time


app = Flask(__name__)
# CORS(app)

app.secret_key = 'your secret key'

# Configuration Miguel
app.config['MYSQL_USER'] = 'dev_user'
app.config['MYSQL_PASSWORD'] = 'Dev_User123'
app.config['MYSQL_DB'] = 'projet_webdev'

app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = 'Deb-Web1234'
# app.config['MYSQL_DB'] = 'projet-dev'
mysql = MySQL(app)


@app.route('/')
def index():
    cur = mysql.connection.cursor()
    """cur.execute('''create table user (
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        nom 	varchar(12) NULL,
        prenom varchar(12) NULL,
        PRIMARY KEY(id) );''')"""

    """ cur.execute('''create table hello(
        id INTEGER,nom varchar(12),
        prenom varchar(12),
        PRIMARY KEY(id) );''') """

    # cur.execute('''INSERT INTO user VALUES (3,'Danlee', 'Maxime');''')

    cur.execute('''SELECT * from user''')
    results = cur.fetchall()
    print(results)

    for user in results:
        list_user = {
            'ID': user[0],
            'Nom': user[1],
            'Prenom': user[2],
        }

    return json.dumps(list_user)


@app.route('/api/client/enregistrement', methods=['POST'])
def post():
    print('hello')
    record = json.loads(request.data)
    return record


# API serves for all devis
@app.route('/api/devis', methods=['GET', 'POST', 'PUT', 'DELETE'])
def devis():
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
            SELECT D.ID_DEVIS, C.NOM_CLIENT, C.PRENOM_CLIENT, C.SOCIETE_CLIENT,
                D.CHANTIER, date_format(D.DATE_DEVIS, '%%D %%M %%Y')
            FROM devis as D
                join clients as C on D.ID_CLIENT = C.ID_CLIENT
            WHERE D.DATE_DEVIS >= str_to_date(%s, %s)
                and extract(year from D.DATE_DEVIS) >= %s
                and extract(year from D.DATE_DEVIS) <= %s
            ORDER BY D.DATE_DEVIS desc"""

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

    # API fires when the user wants to delete a project
    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement = """
            DELETE FROM devis
            WHERE ID_DEVIS = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    cur.close()

    return json.dumps(response)


@app.route('/api/articles', methods=['GET', 'POST', 'PUT', 'DELETE'])
def articles():
    connector = mysql.connection
    cur = connector.cursor()
    response = []

    # API will return all the elements
    if request.method == 'GET':
        # prepare the sql statement (which contains arguments in order to
        # avoid sql injection)
        sql_procedure = """
            SELECT ID_ARTICLE, LIBELLE_FR, LIBELLE_NL, CATEGORIE
            FROM articles
            ORDER BY LIBELLE_FR, ID_ARTICLE asc"""

        # execute the statement
        cur.execute(sql_procedure)

        # fetch the result
        results = cur.fetchall()

        # turn the result into a list of dictionnaries
        for row in results:
            response.append({
                'id': row[0],
                'attribute1': row[1],
                'attribute2': row[2],
                'date': row[3]
            })

    # API fires when the user wants to delete a project
    elif request.method == 'DELETE':
        # get the id of the projects that has to be deleted
        id_to_delete = (int(request.args.get('id')), )

        # prepare the sql statement (which contains arguments in order
        # to avoid sql injection)
        sql_statement = """
            DELETE FROM articles
            WHERE ID_ARTICLE = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    cur.close()

    return json.dumps(response)


@app.route('/api/facture', methods=['GET', 'POST', 'PUT', 'DELETE'])
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


@app.route('/api/client', methods=['GET', 'POST', 'PUT', 'DELETE'])
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
        cur.execute(sql_statement_2, id_to_delete)
        cur.execute(sql_statement_3, id_to_delete)
        cur.execute(sql_statement_4, id_to_delete)
        cur.execute(sql_statement_5, id_to_delete)
        cur.execute(sql_statement_1, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    cur.close()
    print(response)

    return json.dumps(response)


@app.route('/api/etiquettes', methods=['GET', 'POST', 'PUT', 'DELETE'])
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


@app.route('/api/rgie', methods=['GET', 'POST', 'PUT', 'DELETE'])
def rgie():
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
            SELECT R.ID_LISTE_ARTICLE_RGIE, C.NOM_CLIENT, C.PRENOM_CLIENT,
                C.SOCIETE_CLIENT, R.CHANTIER,
                date_format(R.DATE, '%%D %%M %%Y')
            FROM rgie as R
                join clients as C on R.ID_CLIENT = C.ID_CLIENT
            WHERE R.DATE >= str_to_date(%s, %s)
                and extract(year from R.DATE) >= %s
                and extract(year from R.DATE) <= %s
            ORDER BY R.DATE desc"""

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
            DELETE FROM rgie
            WHERE ID_LISTE_ARTICLE_RGIE = %s
        """

        # execute the statement along with its arguments
        cur.execute(sql_statement, id_to_delete)

        # commit the changes to the database
        connector.commit()

        response = cur.fetchall()

    cur.close()

    return json.dumps(response)


if __name__ == '__main__':
    app.run(debug=True)
