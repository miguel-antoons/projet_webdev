from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from flask_mysqldb import MySQL
import json

app = Flask(__name__)
# CORS(app)

app.secret_key = 'your secret key'

app.config['MYSQL_HOST'] = 'sql11.freemysqlhosting.net'
app.config['MYSQL_USER'] = 'sql11397267'
app.config['MYSQL_PASSWORD'] = '7tPK1krCUh'
app.config['MYSQL_DB'] = 'sql11397267'

mysql = MySQL(app)


@app.route('/')
def index():
    cur = mysql.connection.cursor()
    # cur.execute('''create table user (id MEDIUMINT NOT NULL AUTO_INCREMENT,nom 	varchar(12) NULL, prenom varchar(12) NULL, PRIMARY KEY(id) );''')

    # cur.execute('''create table hello (id INTEGER,nom varchar(12), prenom varchar(12), PRIMARY KEY(id) );''')

    #cur.execute('''INSERT INTO user VALUES (3,'Danlee', 'Maxime');''')

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
