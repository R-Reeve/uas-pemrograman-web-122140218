from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
from sqlalchemy.exc import DBAPIError
from forum.models import User
from sqlalchemy.orm import Session

@view_config(route_name='register', renderer='json')
def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        dbsession: Session = request.dbsession
        if session.query(User).filter_by(username=username).first():
            return {'error': 'Username already exists'}

        user = User(username=username)
        user.set_password(password)
        session.add(user)
        return HTTPFound(location=request.route_url('login'))

    return {}

@view_config(route_name='login', renderer='forum:templates/login.html')
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        session: Session = request.dbsession
        user = session.query(User).filter_by(username=username).first()

        if user and user.check_password(password):
            headers = remember(request, user.id)
            return HTTPFound(location='/', headers=headers)
        else:
            return {'error': 'Invalid username or password'}

    return {}

from pyramid.security import forget
@view_config(route_name='logout')
def logout_view(request):
    headers = forget(request)
    return HTTPFound(location=request.route_url('login'), headers=headers)
