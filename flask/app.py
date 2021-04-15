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


@app.route('/hello')
def hello():
    return {'result': "HELLO"}


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/api/client/enregistrement', methods=['POST'])
def post():
    print('hello')
    record = json.loads(request.data)
    return record


# API pour les devis
@app.route('/api/devis', methods=['GET', 'POST', 'PUT'])
def devis():
    cur = mysql.connection.cursor()
    response = []

    # API qui sert pour récupérer tous les projets de devis
    if request.method == 'GET':
        filter = request.args.get('filter')
        arguments = ()

        sql_procedure = """
            SELECT D.ID, C.nom, C.prenom, C.societe, D.chantier,
                date_format(D.date, '%%D %%M %%Y')
            FROM DEVIS as D
                join CLIENTS as C on D.id_client = C.ID
            WHERE D.date >= str_to_date(%s, %s)
                and extract(year from D.date) >= %s
                and extract(year from D.date) <= %s
            ORDER BY D.date desc"""

        if len(filter) > 4:
            arguments = (filter, "%a %b %e %Y %H:%i:%s", 1, 999999999, )
        elif len(filter) == 4:
            arguments = ("1999-01-01", "%Y-%m-%d", filter, filter, )
        else:
            arguments = ("1999-01-01", "%Y-%m-%d", 1, 999999999, )

        cur.execute(sql_procedure, arguments)

        results = cur.fetchall()

        for row in results:
            response.append({
                'id': row[0],
                'name': f"{row[1]} {row[2]}, {row[3]}",
                'chantier': row[4],
                'date': row[5]
            })

    return json.dumps(response)


if __name__ == '__main__':
    app.run(debug=True)
