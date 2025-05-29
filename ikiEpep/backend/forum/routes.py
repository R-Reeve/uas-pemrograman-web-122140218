# backend/forum/routes.py
import logging
log = logging.getLogger(__name__)

def includeme(config):
    log.info("Adding routes")
    config.add_route('home', '/')
    config.add_route('login', '/login')
    config.add_route('register', '/register')
    config.add_route('logout', '/logout')
    config.add_route('topics', '/topics')
    config.add_route('topic_detail', '/topics/{id}')
    config.add_route('debug_users', '/debug/users')
    config.add_route('test_db', '/debug/test-db')
    log.info("Routes added")
