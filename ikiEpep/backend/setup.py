from setuptools import setup, find_packages

setup(
    name='forum',
    version='0.0',
    description='A Final Fantasy forum backend',
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
    ],
    author='',
    author_email='',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'alembic',
        'plaster-pastedeploy',
        'pyramid',
        'pyramid-jinja2',
        'pyramid-debugtoolbar',
        'waitress',
        'SQLAlchemy',
        'psycopg2-binary', # Atau driver database PostgreSQL lainnya
        'pyramid-tm',
        'pyramid-sqlalchemy',
    ],
    entry_points={
        'paste.app_factory': [
            'main = forum:main',
        ],
    },
)