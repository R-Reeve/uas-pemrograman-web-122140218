from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=5, max=50))
    email = fields.Email(required=True, validate=validate.Length(max=100))

class UserSignupSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=6))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))

class UserLoginSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True)

class UserUpdatePasswordSchema(Schema):
    current_password = fields.Str(required=True, load_only=True)
    new_password = fields.Str(required=True, validate=validate.Length(min=8), load_only=True)