from datetime import datetime

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

if __name__ == '__main__':
    app.run(debug=True)