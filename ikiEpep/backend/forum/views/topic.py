# backend/ecommerce/views/topic.py
import json
from ..models.user import User
from pyramid.view import view_config
from pyramid.response import Response
from ..models.meta import DBSession
from ..models.topic import Topic
from ..schemas.topic import TopicSchema
from marshmallow import ValidationError
from pyramid.httpexceptions import HTTPUnauthorized, HTTPForbidden, HTTPNotFound, HTTPNoContent
from ..security import get_user_id_from_jwt
from sqlalchemy import cast, String
from sqlalchemy.exc import SQLAlchemyError

@view_config(route_name='create_topic', renderer='json', request_method='POST')
def create_topic(request):
    try:
        # Debug: Check if the request data is received correctly
        print("Received data:", request.json_body)

        # Parse and validate the data with Marshmallow
        data = request.json_body
        topic_data = TopicSchema().load(data)  # Deserialize and validate data
        
        user_id = get_user_id_from_jwt(request)
        user = DBSession.query(User).get(user_id)
        if not user:
            return HTTPUnauthorized(json_body={'error': 'User not authenticated'})
        
        topic_data['seller'] = user.username
        # Create a new topic object and save to DB
        topic = Topic(**topic_data)
        DBSession.add(topic)
        DBSession.flush()  # Save topic and get its ID
        print(f"Topic {topic.name} added successfully with ID {topic.id}")

        # Return the serialized topic data
        return TopicSchema().dump(topic)
    except ValidationError as err:
        # If validation fails, print the errors and return them to the frontend
        print("Validation error:", err.messages)
        return Response(
            body=json.dumps({'errors': err.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        # General exception handling
        print("Error:", str(e))
        return Response(
            body=json.dumps({'error': 'An error occurred while adding the topic.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )



@view_config(route_name='get_topics', renderer='json', request_method='GET')
def topics_api_view(request):
    topics = DBSession.query(Topic).all()

    # Serialize topic objects into dictionaries
    result = []
    for p in topics:
        result.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'originalPrice': p.original_price,
            'image': p.image_url or '/api/placeholder/300/200',
            'rating': p.rating,
            'sold': p.sold,
            'seller' : p.seller,
            'stock' : p.stock
        })

    return result



def get_topic_by_id(request, topic_id):
    topic = request.dbsession.query(Topic).filter(Topic.id == int(topic_id)).first()
    if topic:
        return topic.to_dict()
    return None



@view_config(route_name='get_topic_detail', renderer='json', request_method='GET')
def topic_detail_api_view(request):
    topic_id = request.matchdict.get('topic_id')

    topic = DBSession.query(Topic).filter(Topic.id == int(topic_id)).first()

    if not topic:
        request.response.status = 404
        return {"error": "Topic not found"}

    return {
        'id': topic.id,
        'name': topic.name,
        'price': topic.price,
        'originalPrice': topic.original_price,
        'image': topic.image_url or '/api/placeholder/300/200',
        'rating': topic.rating,
        'sold': topic.sold,
        'seller': topic.seller,
        'description': topic.description,
        'stock': topic.stock
    }


@view_config(route_name='get_seller_topics', renderer='json', request_method='GET')
def get_seller_topics(request):
    user_id = get_user_id_from_jwt(request)
    if not user_id:
        return HTTPUnauthorized(json_body={"error": "Unauthorized"})

    user = DBSession.query(User).get(user_id)
    if not user:
        return HTTPUnauthorized(json_body={"error": "User not found"})

    username = user.username
    print(f"DEBUG: User ID from token: {user_id}")
    print(f"DEBUG: Username from DB: '{username}' (len={len(username)})")

    # Query topics by seller username exactly
    topics = DBSession.query(Topic).filter(Topic.seller == username).all()

    print(f"DEBUG: Number of topics found: {len(topics)}")
    for p in topics:
        print(f"DEBUG: Topic ID={p.id}, Seller='{p.seller}', Name='{p.name}'")

    result = []
    for p in topics:
        result.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'image': p.image_url or '/api/placeholder/300/200',
            'rating': p.rating,
            'sold': p.sold,
            'seller': p.seller,
            'stock': p.stock
        })

    return result


# NEW


@view_config(route_name='edit_topic', renderer='json', request_method='PUT')
def edit_topic(request):
    topic_id = request.matchdict.get('topic_id')
    try:
        user_id = get_user_id_from_jwt(request)
        if not user_id:
            return HTTPUnauthorized(json_body={'error': 'Authentication required'})

        user = DBSession.query(User).get(user_id)
        if not user:
            return HTTPUnauthorized(json_body={'error': 'User not found'})

        topic = DBSession.query(Topic).filter(Topic.id == int(topic_id)).first()
        if not topic:
            return HTTPNotFound(json_body={'error': 'Topic not found'})

        if topic.seller != user.username:
            return HTTPForbidden(json_body={'error': 'You are not authorized to edit this topic'})

        data = request.json_body
        topic_data = TopicSchema().load(data, partial=True)

        for key, value in topic_data.items():
            setattr(topic, key, value)

        DBSession.flush() # Commit changes to the database
        return TopicSchema().dump(topic)

    except ValidationError as err:
        return Response(
            body=json.dumps({'errors': err.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    except SQLAlchemyError as e:
        DBSession.rollback() # Rollback in case of DB error
        return Response(
            body=json.dumps({'error': 'A database error occurred while updating the topic.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        return Response(
            body=json.dumps({'error': 'An unexpected error occurred while updating the topic.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )


# NEW

@view_config(route_name='delete_topic', renderer='json', request_method='DELETE')
def delete_topic(request):
    topic_id = request.matchdict.get('topic_id')
    print(f"DEBUG: DELETE request received for topic ID: {topic_id}") # ADD THIS

    try:
        # ... (your existing auth logic) ...

        # Check the parsed topic_id type and value
        try:
            int_topic_id = int(topic_id)
            print(f"DEBUG: Parsed topic_id as integer: {int_topic_id}") # ADD THIS
        except ValueError:
            print(f"ERROR: topic_id '{topic_id}' is not a valid integer.")
            return Response(
                body=json.dumps({'error': 'Invalid topic ID format.'}),
                status=400,
                content_type='application/json',
                charset='utf-8'
            )

        # 2. Fetch the existing topic
        topic = DBSession.query(Topic).filter(Topic.id == int_topic_id).first() # Use int_topic_id
        if not topic:
            print(f"DEBUG: Topic with ID {int_topic_id} not found in DB.") # ADD THIS
            return HTTPNotFound(json_body={'error': 'Topic not found'}) # Ensure json_body is set

        # ... (rest of your logic) ... used for successful DELETE requests where no content is returned.
        return HTTPNoContent()

    except SQLAlchemyError as e:
        DBSession.rollback() # Rollback in case of DB error
        print(f"Database error during topic deletion: {e}")
        return Response(
            body=json.dumps({'error': 'A database error occurred while deleting the topic.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        print(f"General error during topic deletion: {e}")
        return Response(
            body=json.dumps({'error': 'An unexpected error occurred while deleting the topic.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )