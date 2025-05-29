from pyramid.view import view_config
from pyramid.response import Response
from pyramid.request import Request
from sqlalchemy.exc import IntegrityError
import json

from ..models.user import User
from ..models.meta import DBSession
from ..schemas.user import UserRegisterSchema

# @view_config(route_name='register', renderer='json', request_method='POST')
# def register_view(request: Request):
#     try:
#         data = request.json_body  # parse JSON POST body
        
#         # Validate data
#         schema = UserregisterSchema()
#         result = schema.load(data)
        
#         # Check if user exists
#         existing_user = DBSession.query(User).filter(
#             (User.username == result['username']) | (User.email == result['email'])
#         ).first()
#         if existing_user:
#             return Response(json.dumps({'error': 'Username or email already exists'}), status=400, content_type='application/json')
        
#         # Create user
#         user = User(
#             username=result['username'],
#             email=result['email'],
#             password=result['password']  # TODO: hash password before saving
#         )
#         DBSession.add(user)
#         DBSession.flush()  # to raise errors early
        
#         return {'message': 'User registered successfully'}
        
#     except Exception as e:

#         #Handle specific exceptions
#         # request.response.status = 400
#         # return {'error': str(e)}
        
#         #Default error handling
#         # return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json')

#         # Response explicitly in bytes
#         return Response(
#             body=json.dumps({'error': str(e)}).encode('utf-8'), # convert to bytes for Response body
#             status=400,
#             content_type='application/json',
#         )