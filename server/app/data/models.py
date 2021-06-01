from app import db
from app.data.permissions import permissions, reverse_lookup
from sqlalchemy_serializer import SerializerMixin
import datetime


class Todo(db.Model, SerializerMixin):

    __tablename__ = 'todos'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    uid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user = db.relationship('User', backref='user', uselist=False, lazy=True, viewonly=True)

    default_fields = ['id', 'title', 'description', 'created_at', 'updated_at']

    def serialize(self, fields=None):
        return self.to_dict(only=fields if fields else self.default_fields)

    def __init__(self, title, description, uid=None):
        self.title = title
        self.description = description
        self.uid = uid

    def __repr__(self):
        return '<Todo {}>'.format(self.id)

class User(db.Model, SerializerMixin):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=True)
    email = db.Column(db.String(80), index=True, unique=True)
    gid = db.Column(db.String(80), nullable=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    role = db.relationship('Role', backref='role', uselist=False, lazy=True, viewonly=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    todos = db.relationship('Todo', backref='todos', lazy=True)

    default_fields = ['id', 'name', 'email', 'role_id', 'todos.id']

    def serialize(self, fields=None):
        return self.to_dict(only=fields if fields else self.default_fields)

    def __init__(self, email, role_id, gid=None, name=None):
        self.email = email
        self.role_id = role_id
        self.gid = gid
        self.name = name

    def __repr__(self):
        return '<User {}>'.format(self.id)

class Role(db.Model, SerializerMixin):

    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    permission = db.Column(db.Integer)

    default_fields = ['id', 'name', 'permission']

    def serialize(self, fields=None):
        data = self.to_dict(only=fields if fields else self.default_fields)
        if 'permission' in data.keys():
            data['permission'] = reverse_lookup(data['permission'])
        return data

    def __init__(self, name, permission):
        self.name = name
        self.permission = permissions[permission]

    def __repr__(self):
        return '<Role {}'.format(self.id)