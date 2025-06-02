# views/user.py
import json
import jwt
from datetime import datetime, timedelta

from ..views import imagekit
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound, HTTPNoContent, HTTPUnauthorized
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from marshmallow import ValidationError

from ..models.meta import DBSession
from ..models.user import User
from ..models.topic import Topic
from ..schemas.user import UserSignupSchema, UserLoginSchema, UserUpdatePasswordSchema, UserSchema
from ..security import is_authenticated, JWT_SECRET, get_user_id_from_jwt


def create_jwt_token(user_id):
    exp = datetime.now() + timedelta(hours=1)
    payload = {'user_id': user_id, 'exp': exp}
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token if isinstance(token, str) else token.decode('utf-8')


@view_config(route_name='signup', renderer='json', request_method='POST')
def signup_view(request):
    if is_authenticated(request):
        return HTTPFound(location=request.route_url('home'))

    try:
        data = request.json_body
        attrs = UserSignupSchema().load(data)
        if DBSession.query(User).filter(
            (User.username == attrs['username']) |
            (User.email == attrs['email'])
        ).first():
            raise IntegrityError(None, None, None)
        
        
        user = User(
            username=attrs['username'],
            email=attrs['email'],
            password=User.hash_password(attrs['password'])
        )
        DBSession.add(user)
        DBSession.flush()
        return {'message': 'User registered'}
    except IntegrityError:
        return Response(
            body=json.dumps({'error': 'User already exists'}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    except ValidationError as ve:
        return Response(
            body=json.dumps({'error': ve.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )


@view_config(route_name='login', renderer='json', request_method='POST')
def login_view(request):
    if is_authenticated(request):
        return HTTPFound(location=request.route_url('home'))

    try:
        data = request.json_body
        creds = UserLoginSchema().load(data)
        user = DBSession.query(User).filter_by(email=creds['email']).first()
        if user and user.verify_password(creds['password']):
            token = create_jwt_token(user.id)
            return {
                'token': token,
                'username' : user.username
                }

        return Response(
            body=json.dumps({'error': 'Invalid email or password'}),
            status=401,
            content_type='application/json',
            charset='utf-8'
        )
    except ValidationError as ve:
        return Response(
            body=json.dumps({'error': ve.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    

# NEW

@view_config(route_name='get_user_profile', renderer='json', request_method='GET')
def get_user_profile(request):
    print("DEBUG: get_user_profile view hit!") # <--- ADD THIS
    user_id = get_user_id_from_jwt(request)
    if not user_id:
        print("DEBUG: User not authenticated for profile fetch.") # <--- ADD THIS
        return HTTPUnauthorized(json_body={'error': 'Authentication required'})

    user = DBSession.query(User).get(user_id)
    if not user:
        print(f"DEBUG: User with ID {user_id} not found in DB during profile fetch.") # <--- ADD THIS
        return HTTPUnauthorized(json_body={'error': 'User not found'})

    print(f"DEBUG: User profile for {user.username} fetched successfully.") # <--- ADD THIS
    return UserSchema().dump(user)



@view_config(route_name='update_user_profile', renderer='json', request_method='PUT')
def update_user_profile(request):
    user_id = get_user_id_from_jwt(request)
    if not user_id:
        return HTTPUnauthorized(json_body={'error': 'Authentication required'})

    user = DBSession.query(User).get(user_id)
    if not user:
        return HTTPUnauthorized(json_body={'error': 'User not found'})

    try:
        data = request.json_body
        # Use partial=True to allow updating only a subset of fields
        updated_data = UserSchema(partial=True).load(data)

        # Check for duplicate username or email if they are being updated
        if 'username' in updated_data and updated_data['username'] != user.username:
            if DBSession.query(User).filter(User.username == updated_data['username']).first():
                return Response(
                    body=json.dumps({'errors': {'username': ['Username already taken.']}}),
                    status=409, # 409 Conflict indicates a duplicate resource
                    content_type='application/json'
                )
        if 'email' in updated_data and updated_data['email'] != user.email:
            if DBSession.query(User).filter(User.email == updated_data['email']).first():
                return Response(
                    body=json.dumps({'errors': {'email': ['Email already taken.']}}),
                    status=409,
                    content_type='application/json'
                )

        # Apply updates to the user object
        for key, value in updated_data.items():
            setattr(user, key, value)
        
        DBSession.flush() # Commit changes to the database
        return UserSchema().dump(user)

    except ValidationError as err:
        return Response(
            body=json.dumps({'errors': err.messages}),
            status=400, # 400 Bad Request for validation errors
            content_type='application/json',
            charset='utf-8'
        )
    except SQLAlchemyError as e:
        DBSession.rollback() # Rollback on database error
        print(f"Database error during user profile update: {e}")
        return Response(
            body=json.dumps({'error': 'A database error occurred while updating your profile.'}),
            status=500, # 500 Internal Server Error for DB issues
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        print(f"General error during user profile update: {e}")
        return Response(
            body=json.dumps({'error': 'An unexpected error occurred while updating your profile.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )


@view_config(route_name='update_user_password', renderer='json', request_method='PUT')
def update_user_password(request):
    user_id = get_user_id_from_jwt(request)
    if not user_id:
        return HTTPUnauthorized(json_body={'error': 'Authentication required'})

    user = DBSession.query(User).get(user_id)
    if not user:
        return HTTPUnauthorized(json_body={'error': 'User not found'})

    try:
        data = request.json_body
        attrs = UserUpdatePasswordSchema().load(data)
        # Verify current password using the method in your User model
        if not user.verify_password(attrs['current_password']):
            return Response(
                body=json.dumps({'errors': {'current_password': ['Invalid current password.']}}),
                status=401, # 401 Unauthorized for incorrect credentials
                content_type='application/json',
                charset='utf-8'
            )
        
        # Hash and update new password
        user.password = User.hash_password(attrs['new_password'])
        DBSession.flush()
        return {'message': 'Password updated successfully.'}

    except ValidationError as err:
        return Response(
            body=json.dumps({'errors': err.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    except SQLAlchemyError as e:
        DBSession.rollback()
        print(f"Database error during password update: {e}")
        return Response(
            body=json.dumps({'error': 'A database error occurred while updating your password.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        print(f"General error during password update: {e}")
        return Response(
            body=json.dumps({'error': 'An unexpected error occurred while updating your password.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )



@view_config(route_name='delete_account', renderer='json', request_method='DELETE')
def delete_account(request):
    user_id = get_user_id_from_jwt(request)
    if not user_id:
        return HTTPUnauthorized(json_body={'error': 'Authentication required'})

    user = DBSession.query(User).get(user_id)
    if not user:
        return HTTPUnauthorized(json_body={'error': 'User not found'})

    try:
        topics_to_delete = DBSession.query(Topic).filter(Topic.seller == user.username).all()
        for topic in topics_to_delete:
            if topic.imagekit_file_id:
                try:
                    imagekit.delete_file(topic.imagekit_file_id)
                    print(f"ImageKit image {topic.imagekit_file_id} deleted for topic {topic.id}.")
                except Exception as ik_err:
                    print(f"WARNING: Failed to delete ImageKit image {topic.imagekit_file_id} during account deletion: {ik_err}")
            DBSession.delete(topic) # Delete the topic record from your DB
        DBSession.flush() # Flush topic deletions before user deletion to avoid foreign key issues

        DBSession.delete(user) # Delete the user record itself
        DBSession.flush()
        return HTTPNoContent() # 204 No Content for successful deletion

    except SQLAlchemyError as e:
        DBSession.rollback() # Rollback on database error
        return Response(
            body=json.dumps({'error': 'A database error occurred while deleting your account.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        return Response(
            body=json.dumps({'error': 'An unexpected error occurred while deleting your account.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )