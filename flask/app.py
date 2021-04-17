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
            SELECT D.ID, C.nom, C.prenom, C.societe, D.chantier,
                date_format(D.date, '%%D %%M %%Y')
            FROM DEVIS as D
                join CLIENTS as C on D.id_client = C.ID
            WHERE D.date >= str_to_date(%s, %s)
                and extract(year from D.date) >= %s
                and extract(year from D.date) <= %s
            ORDER BY D.date desc"""

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
            DELETE FROM DEVIS
            WHERE ID = %s
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
        # get the filter to apply to the elements
        filter = request.args.get('filter')
        arguments = ()

        # prepare the sql statement (which contains arguments in order to
        # avoid sql injection)
        sql_procedure = """
            SELECT ID, nameFR, nameNL, date_format(date, '%%D %%M %%Y')
            FROM ARTICLES
            WHERE date >= str_to_date(%s, %s)
                and extract(year from date) >= %s
                and extract(year from date) <= %s
            ORDER BY nameFR asc"""

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
                'attribute1': row[1],
                'attribute2': row[2],
                'date': row[3]
            })

    cur.close()
    print(response)

    return json.dumps(response)


if __name__ == '__main__':
    app.run(debug=True)
