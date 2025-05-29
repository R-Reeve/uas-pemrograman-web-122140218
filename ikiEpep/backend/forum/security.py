# backend/forum/security.py
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
import jwt

JWT_SECRET = "d4rkn355"

def cors_tween_factory(handler, registry):
    def cors_tween(request):
        if request.method == 'OPTIONS':
            response = Response(status=200)
        else:
            response = handler(request)
        response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        })
        return response
    return cors_tween

def is_authenticated(request):
    """Return True if the Authorization: Bearer <token> header is valid."""
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
    """
    Pyramid tween that intercepts requests to 'login' or 'register'
    and redirects to 'home' if already authenticated.
    """
    def tween(request):
        # get the matched route object (or None)
        route = getattr(request, 'matched_route', None)
        # extract its name
        route_name = getattr(route, 'name', None)

        # if this is the login or register route and user is already logged in…
        if route_name in ('login', 'register') and is_authenticated(request):
            return HTTPFound(location=request.route_url('home'))

        return handler(request)
    return tween