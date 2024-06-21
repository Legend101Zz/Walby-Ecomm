from flask import Flask, session, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
import redis
import uuid
from datetime import datetime

app = Flask(__name__)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'session:'
app.config['SESSION_REDIS'] = redis.from_url('redis://localhost:6379')

# Initialize extensions
db = SQLAlchemy(app)
Session(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

# Search history model
class SearchHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    search_query = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Likes model
class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Comments model
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    comment_text = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Purchases model
class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

db.create_all()

# User registration route
@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400
    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

# User login route
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        session['user_id'] = user.id
        session['session_id'] = str(uuid.uuid4())
        return jsonify({'message': 'Logged in successfully', 'session_id': session['session_id']}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Route to record search history
@app.route('/search', methods=['POST'])
def search():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not authenticated'}), 401

    search_query = request.json.get('search_query')
    search_history = SearchHistory(user_id=user_id, search_query=search_query)
    db.session.add(search_history)
    db.session.commit()
    return jsonify({'message': 'Search history recorded successfully'}), 200

# Route to record likes
@app.route('/like', methods=['POST'])
def like():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not authenticated'}), 401

    product_id = request.json.get('product_id')
    like = Like(user_id=user_id, product_id=product_id)
    db.session.add(like)
    db.session.commit()
    return jsonify({'message': 'Like recorded successfully'}), 200

# Route to record comments
@app.route('/comment', methods=['POST'])
def comment():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not authenticated'}), 401

    product_id = request.json.get('product_id')
    comment_text = request.json.get('comment_text')
    comment = Comment(user_id=user_id, product_id=product_id, comment_text=comment_text)
    db.session.add(comment)
    db.session.commit()
    return jsonify({'message': 'Comment recorded successfully'}), 200

# Route to record purchases
@app.route('/purchase', methods=['POST'])
def purchase():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not authenticated'}), 401

    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity')
    purchase = Purchase(user_id=user_id, product_id=product_id, quantity=quantity)
    db.session.add(purchase)
    db.session.commit()
    return jsonify({'message': 'Purchase recorded successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)