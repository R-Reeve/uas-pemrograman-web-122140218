from marshmallow import Schema, fields

class TopicSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    content = fields.Str(required=True)
    username = fields.Str(required=True)
