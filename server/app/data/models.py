from app import db
import enum

class Todo(db.Model):

    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    description = db.Column(db.Text)
    created_at = db.Column(db.Datetime)
    updated_at = db.Column(db.Datetime)
    updated_by_id = db.Column(db.Integer, db.Foreignkey('users.id'))

    def __init__(self, email, role_id):
        self.email = email
        self.role_id = role_id

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'updated_by_id': self.updated_by_id
        }


class User(db.Model):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), index=True, unique=True, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('userRoles.id'), nullable=False)
    created_at = db.Column(db.DateTime, index=False, unique=False, nullable=False)
    last_login = db.Column(db.DateTime, index=False, unique=False, nullable=True)

    def __init__(self, email, role_id):
        self.email = email
        self.role_id = role_id

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'role_id': self.role_id,
            'created_at': self.created_at,
            'last_login': self.last_login
        }


class Permissions(enum.Enum):
    user = 1
    super_user = 2
    admin = 3


class UserRole(db.Model):

    __tablename__ = 'userRoles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    permission = db.Column(db.Enum(Permissions))

    def __init__(self, name, permission):
        self.name = name
        self.permission = permission

    def __repr__(self):
        return '<UserRole {}'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'permission': self.permission
        }