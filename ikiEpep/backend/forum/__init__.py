from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import DBSession
import logging
from .models import Base
from .models import user, topic

log = logging.getLogger(__name__)

def main(global_config, **settings):
    log.info("Starting application")
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)

    config = Configurator(settings=settings)

    # Make sure this line is present and not commented out
    config.add_tween('forum.security.cors_tween_factory')
    config.add_tween('forum.security.prevent_logged_in_user_tween_factory')

    config.include('pyramid_tm')
    config.include('forum.routes')

    config.scan('forum.views')

    log.info("Application initialized")
    return config.make_wsgi_app()