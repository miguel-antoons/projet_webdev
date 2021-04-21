from flask import Blueprint, request, json
from .database import mysql


app_suivi = Blueprint('app_suivi', __name__)
