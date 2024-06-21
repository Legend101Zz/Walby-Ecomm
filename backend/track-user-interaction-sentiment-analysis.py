from datetime import datetime
from transformers import pipeline

# Interaction model
class Interaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    session_id = db.Column(db.String(120), nullable=False)
    action = db.Column(db.String(80), nullable=False)
    product_id = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

db.create_all()

# Track user interaction
@app.route('/interact', methods=['POST'])
def interact():
    if 'user_id' not in session or 'session_id' not in session:
        return jsonify({'message': 'User not authenticated'}), 401

    action = request.json.get('action')
    product_id = request.json.get('product_id')
    user_id = session['user_id']
    session_id = session['session_id']

    interaction = Interaction(user_id=user_id, session_id=session_id, action=action, product_id=product_id)
    db.session.add(interaction)
    db.session.commit()

    return jsonify({'message': 'Interaction recorded successfully'}), 200

# Initialize sentiment analysis model
sentiment_model = pipeline('sentiment-analysis')

# Analyze user sentiment
@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    text = request.json.get('text')
    result = sentiment_model(text)[0]
    sentiment = result['label']
    score = result['score']

    # Store sentiment analysis result (you can also associate it with a specific interaction)
    return jsonify({'sentiment': sentiment, 'score': score}), 200

if __name__ == '__main__':
    app.run(debug=True)