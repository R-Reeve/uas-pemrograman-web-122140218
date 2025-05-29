from pyramid.view import view_config
from pyramid.request import Request
from pyramid.response import Response
from sqlalchemy.exc import IntegrityError
from ..models.topic import Topic
from ..schemas.topic import TopicCreateSchema, TopicSchema
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound, HTTPForbidden
from ..security import is_authenticated
import logging

log = logging.getLogger(__name__)

@view_config(route_name='topics', request_method='POST', renderer='json')
def add_topic_view(request: Request):
    log.info("add_topic_view called")
    if not is_authenticated(request):
        raise HTTPForbidden("Authentication required to add a topic.")

    try:
        schema = TopicCreateSchema()
        validated_data = schema.load(request.json_body)
    except Exception as e:
        raise HTTPBadRequest(f"Invalid input: {e}")

    title = validated_data['title']
    content = validated_data['content']

    # Sementara ambil dari request body, sebaiknya nanti dari JWT
    user_data = request.json_body.get('user')
    if not user_data or not user_data.get('username'):
        raise HTTPBadRequest("Missing user information.")
    username = user_data['username']

    new_topic = Topic(title=title, content=content, username=username)
    request.dbsession.add(new_topic)
    request.dbsession.flush()
    return TopicSchema().dump(new_topic)

@view_config(route_name='topics', request_method='GET', renderer='json')
def list_topics_view(request: Request):
    log.info("list_topics_view called")
    topics = request.dbsession.query(Topic).all()
    return TopicSchema(many=True).dump(topics)
