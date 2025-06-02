# security.py
from pyramid.response import Response
from pyramid.request import Request
from pyramid.httpexceptions import HTTPFound, HTTPUnauthorized
import jwt

JWT_SECRET = "hidup jokowi"

def cors_tween_factory(handler, registry):
    def cors_tween(request):
        if request.method == 'OPTIONS':
            response = Response(status=200)
        else:
            response = handler(request)
        response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization',
        })
        return response
    return cors_tween

def is_authenticated(request):
    auth = request.headers.get('Authorization')
    if not auth:
        return False
    try:
        scheme, token = auth.split(' ', 1)
        if scheme.lower() != 'bearer':
            return False
        jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return True
    except Exception:
        return False

def prevent_logged_in_user_tween_factory(handler, registry):
    def tween(request):
        # get the matched route object (or None)
        route = getattr(request, 'matched_route', None)
        # extract its name
        route_name = getattr(route, 'name', None)

        # if this is the login or signup route and user is already logged in…
        if route_name in ('login', 'signup') and is_authenticated(request):
            return HTTPFound(location=request.route_url('home'))

        return handler(request)
    return tween

def get_user_id_from_jwt(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPUnauthorized("Missing or invalid Authorization header")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")  # Ensure this field matches your JWT payload
        if not user_id:
            raise HTTPUnauthorized("Invalid token payload: user_id missing")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPUnauthorized("Token expired")
    except jwt.InvalidTokenError:
        raise HTTPUnauthorized("Invalid token")