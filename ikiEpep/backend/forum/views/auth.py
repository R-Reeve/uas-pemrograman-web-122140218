# backend/forum/views/auth.py

import transaction
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPBadRequest, HTTPUnauthorized
from sqlalchemy.exc import IntegrityError
from marshmallow import ValidationError
from ..models.user import User
from ..models import DBSession  # Import DBSession from models
from ..schemas.user import UserRegisterSchema
import jwt
from pyramid.request import Request


JWT_SECRET = "d4rkn355"

@view_config(route_name='register', renderer='json', request_method='POST')
def register_view(request: Request):
    print("Register view has been called!")
    try:
        req_body = request.json_body
        print(f"Request body: {req_body}")
        password = req_body.get('password')
        confirm_password = req_body.get('confirmPassword')
        print(f"Password check: {password == confirm_password}")

        if password != confirm_password:
            print("Password mismatch error")
            request.response.status = 400
            return {'error': 'Passwords do not match'}

        print("Starting schema validation...")
        try:
            schema = UserRegisterSchema()
            data = schema.load({'username': req_body.get('username'), 'email': req_body.get('email'), 'password': password})
            print(f"Schema validation successful: {data}")
        except ValidationError as e:
            print(f"Schema validation error: {e.messages}")
            request.response.status = 400
            return {'error': 'Validation failed', 'details': e.messages}

        print("Creating user object...")
        user = User(username=data['username'], email=data['email'])
        print(f"User object created: {user.username}")
        
        print("Setting password hash...")
        user.password_hash = data['password']
        print("Password hash set successfully")
        
        print("Attempting to save user to database...")
        try:
            # FIXED: Proper session management
            with transaction.manager:
                DBSession.add(user)
                # Flush to assign ID and ensure it's written
                DBSession.flush()
                print("User added to session and flushed")
                # The transaction manager will automatically commit when exiting the context
            
            print("Transaction committed successfully")
            print(f"User ID after commit: {user.id}")
            
            # Verify the user was actually saved
            verification_user = DBSession.query(User).filter(User.username == user.username).first()
            print(f"Verification query - User exists: {verification_user is not None}")
            
            request.response.status = 201
            return {'message': f'Akun {user.username} berhasil dibuat!', 'success': True}
            
        except IntegrityError as e:
            print(f"IntegrityError: {str(e)}")
            request.response.status = 400
            return {'error': 'Username atau email sudah terdaftar'}

    except Exception as e:
        print(f"Registration error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        request.response.status = 400
        return {'error': 'Invalid registration data', 'details': str(e)}

@view_config(route_name='debug_users', request_method='GET', renderer='json')
def debug_users_view(request: Request):
    """Debug endpoint to see all users in database"""
    try:
        # FIXED: Refresh session to get latest data
        DBSession.expire_all()
        users = DBSession.query(User).all()
        user_list = []
        for user in users:
            user_list.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'password_hash_length': len(user.password_hash) if user.password_hash else 0,
                'password_hash_preview': user.password_hash[:20] + '...' if user.password_hash else None
            })
        return {
            'total_users': len(users),
            'users': user_list
        }
    except Exception as e:
        print(f"Debug error: {str(e)}")
        import traceback
        print(f"Debug traceback: {traceback.format_exc()}")
        return {'error': str(e)}

@view_config(route_name='login', request_method='POST', renderer='json')
def login_view(request: Request):
    print("Login view has been called!")
    try:
        username = request.json_body.get('username')
        password = request.json_body.get('password')
        print(f"Login attempt for username: {username}")
    except Exception as e:
        print(f"Error parsing request body: {str(e)}")
        request.response.status = 400
        return {'error': 'Please provide username and password in the request body.'}

    if not username or not password:
        print("Missing username or password")
        request.response.status = 400
        return {'error': 'Username and password are required.'}

    try:
        # FIXED: Refresh session to ensure we get the latest data from database
        print("Refreshing database session...")
        DBSession.expire_all()
        
        # First, let's see all users in the database
        all_users = DBSession.query(User).all()
        print(f"Total users in database: {len(all_users)}")
        for u in all_users:
            print(f"User in DB: {u.username} (id: {u.id})")
        
        # Now try to find the specific user
        print(f"Querying database for user with username: '{username}'")
        user = DBSession.query(User).filter(User.username == username).first()
        print(f"User found: {user is not None}")
        
        if user:
            print(f"Found user: {user.username}, email: {user.email}")
            print(f"User password_hash exists: {user.password_hash is not None}")
            print(f"Password_hash length: {len(user.password_hash) if user.password_hash else 0}")
        
        if not user:
            print("User not found")
            request.response.status = 401
            return {'error': 'Invalid credentials.'}

        # Verify the password using the check_password method
        print("Checking password...")
        if not user.check_password(password):
            print("Password check failed")
            request.response.status = 401
            return {'error': 'Invalid credentials.'}

        print("Password check successful, generating JWT...")
        # Generate JWT
        payload = {'username': user.username}
        token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
        
        print(f"Login successful for user: {username}")
        return {'token': token, 'message': f'Login successful for {user.username}', 'success': True}
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        request.response.status = 500
        return {'error': 'Internal server error during login'}

# Additional helper endpoint for debugging
@view_config(route_name='test_db', request_method='GET', renderer='json')
def test_db_view(request: Request):
    """Test database connection and operations"""
    try:
        print("Testing database connection...")
        
        # Test basic query
        user_count = DBSession.query(User).count()
        print(f"User count: {user_count}")
        
        # Test if we can create and immediately query
        test_username = f"test_user_{user_count + 1}"
        
        # Check if test user already exists
        existing = DBSession.query(User).filter(User.username == test_username).first()
        if existing:
            print(f"Test user {test_username} already exists")
            return {'status': 'success', 'user_count': user_count, 'message': 'Test user already exists'}
        
        # Create test user
        test_user = User(username=test_username, email=f"{test_username}@test.com")
        test_user.password_hash = "test_password"
        
        with transaction.manager:
            DBSession.add(test_user)
            DBSession.flush()
            print(f"Test user created with ID: {test_user.id}")
        
        # Immediately try to find it
        DBSession.expire_all()
        found_user = DBSession.query(User).filter(User.username == test_username).first()
        
        return {
            'status': 'success',
            'user_count': user_count,
            'test_user_created': test_user.id is not None,
            'test_user_found': found_user is not None,
            'message': 'Database test completed'
        }
        
    except Exception as e:
        print(f"Database test error: {str(e)}")
        import traceback
        print(f"Test traceback: {traceback.format_exc()}")
        return {'status': 'error', 'error': str(e)}