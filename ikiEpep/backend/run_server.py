# backend/run_server.py
from pyramid.paster import get_app
from waitress import serve

if __name__ == '__main__':
    import os
    ini_path = os.path.join(os.path.dirname(__file__), 'development.ini')
    app = get_app(ini_path, 'main')
    serve(app, host='0.0.0.0', port=6543)