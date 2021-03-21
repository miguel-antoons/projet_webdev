from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from flask_mysqldb import MySQL
import json
import time

app = Flask(__name__)
# CORS(app)



@app.route('/')
def hello():
    return 'Salut merwane'






if __name__ == '__main__':
    app.run(debug=True)