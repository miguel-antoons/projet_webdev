from flask import Blueprint, request, json
from .database import mysql


app_parametrage = Blueprint('app_parametrage', __name__)
