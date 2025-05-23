from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from .auth import login_view, register_view, logout_view

def main(global_config, **settings):
    config = Configurator(settings=settings)

    config.include('pyramid_jinja2')
    config.include('views.routes')
    config.include('pyramid_tm')

    config.set_authentication_policy(AuthTktAuthenticationPolicy('seekrit'))
    config.set_authorization_policy(ACLAuthorizationPolicy())

    config.scan()

    return config.make_wsgi_app()
