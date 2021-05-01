from app import db
from app.data.permissions import permissions, reverse_lookup
import datetime
from flask_login import UserMixin
from app import login_manager


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


@login_manager.user_loader
def get_user(id: int):
  return User.query.get(id)

class User(db.Model, UserMixin):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=True)
    email = db.Column(db.String(80), index=True, unique=True)
    gid = db.Column(db.String(80), nullable=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    todos = db.relationship('Todo', backref='todos', lazy=True)

    def __init__(self, email, role_id, gid=None, name=None):
        self.email = email
        self.role_id = role_id
        self.gid = gid
        self.name = name

    def __repr__(self):
        return '<User {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role_id': self.role_id,
            'gid': self.gid,
            'created_at': self.created_at,
            'last_login': self.last_login,
            'todos': [todo.serialize() for todo in self.todos]
        }


class Role(db.Model):

    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    permission = db.Column(db.Integer)

    def __init__(self, name, permission):
        self.name = name
        self.permission = permissions[permission]

    def __repr__(self):
        return '<Role {}'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'permission': reverse_lookup(self.permission)
        }