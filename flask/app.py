from flask import Flask
from flask_cors import CORS
import time

app = Flask(__name__)
# CORS(app)


@app.route('/')
def index():
    return Flask.render_template('index.html')


@app.route('/hello')
def hello():
    return {'result': "HELLO"}

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}