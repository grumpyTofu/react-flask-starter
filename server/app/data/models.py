from app import db
from app.data.permissions import permissions, reverse_lookup
import datetime

class Todo(db.Model):

    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    uid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    def __init__(self, title, description, uid=None):
        self.title = title
        self.description = description
        self.uid = uid

    def __repr__(self):
        return '<User {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'uid': self.uid
        }


class User(db.Model):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), index=True, unique=True)
    role_id = db.Column(db.Integer, db.ForeignKey('userRoles.id'))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    todos = db.relationship('Todo', backref='todos', lazy=True)

    def __init__(self, email, role_id):
        self.email = email
        self.role_id = role_id

    def __repr__(self):
        return '<User {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'role_id': self.role_id,
            'created_at': self.created_at,
            'last_login': self.last_login
        }


class UserRole(db.Model):

    __tablename__ = 'userRoles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    permission = db.Column(db.Integer)

    def __init__(self, name, permission):
        self.name = name
        self.permission = permissions[permission]

    def __repr__(self):
        return '<UserRole {}'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'permission': reverse_lookup(self.permission)
        }