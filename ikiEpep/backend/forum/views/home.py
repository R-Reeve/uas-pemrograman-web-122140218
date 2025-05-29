from pyramid.view import view_config
from pyramid.response import Response
from pyramid.request import Request
from sqlalchemy.exc import IntegrityError

import json

@view_config(route_name='home', renderer='json')
def home_view(request):
    return {"message": "Welcome to the backend API!"}