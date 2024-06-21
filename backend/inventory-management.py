import numpy as np
import faiss
from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# In-memory storage for real-time inventory data
inventory_db = []
historical_sales = {
    'product_id': [1, 2, 3, 1, 2, 3, 1, 2, 3],
    'sales': [100, 150, 200, 110, 160, 210, 120, 170, 220],
    'day': [1, 1, 1, 2, 2, 2, 3, 3, 3]
}

# Vector database setup
product_vectors = {}
vector_dimension = 128
index = faiss.IndexFlatL2(vector_dimension)

def add_vectors_to_index(vectors):
    vector_array = np.array(list(vectors.values()))
    index.add(vector_array)

@app.route('/update_inventory', methods=['POST'])
def update_inventory():
    data = request.json
    inventory_db.append(data)

    # Update FAISS index
    product_vectors[data['product_id']] = np.array(data['vector']).astype('float32')
    add_vectors_to_index(product_vectors)

    return jsonify({'message': 'Inventory updated successfully'}), 200

@app.route('/retrieve_products', methods=['POST'])
def retrieve_products_endpoint():
    query_vector = np.array(request.json.get('query_vector')).astype('float32')
    k = request.json.get('k', 5)
    product_ids = retrieve_products(query_vector, k)
    return jsonify({'product_ids': product_ids}), 200

def retrieve_products(query_vector, k=5):
    distances, indices = index.search(np.array([query_vector]), k)
    product_ids = [list(product_vectors.keys())[i] for i in indices[0]]
    return product_ids

def fetch_warehouse_data():
    return [
        {'product_id': 1, 'stock': 100, 'location': 'warehouse', 'vector': np.random.rand(vector_dimension).astype('float32')},
        {'product_id': 2, 'stock': 200, 'location': 'warehouse', 'vector': np.random.rand(vector_dimension).astype('float32')}
    ]

def fetch_store_data():
    return [
        {'product_id': 1, 'stock': 50, 'location': 'store', 'vector': np.random.rand(vector_dimension).astype('float32')},
        {'product_id': 3, 'stock': 30, 'location': 'store', 'vector': np.random.rand(vector_dimension).astype('float32')}
    ]

def fetch_distribution_center_data():
    return [
        {'product_id': 2, 'stock': 150, 'location': 'distribution_center', 'vector': np.random.rand(vector_dimension).astype('float32')},
        {'product_id': 3, 'stock': 70, 'location': 'distribution_center', 'vector': np.random.rand(vector_dimension).astype('float32')}
    ]

def aggregate_inventory_data():
    warehouse_data = fetch_warehouse_data()
    store_data = fetch_store_data()
    distribution_center_data = fetch_distribution_center_data()
    all_data = warehouse_data + store_data + distribution_center_data

    for record in all_data:
        product_vectors[record['product_id']] = record['vector']

    return all_data

def predict_demand(product_id):
    product_sales = [sales for pid, sales in zip(historical_sales['product_id'], historical_sales['sales']) if pid == product_id]
    days = list(range(1, len(product_sales) + 1))

    model = LinearRegression()
    model.fit(np.array(days).reshape(-1, 1), np.array(product_sales))

    next_day = np.array([[len(days) + 1]])
    predicted_sales = model.predict(next_day)
    return predicted_sales[0]

def manage_stock_levels(aggregated_data):
    for record in aggregated_data:
        predicted_sales = predict_demand(record['product_id'])
        optimal_stock_level = predicted_sales * 1.2
        print(f"Product {record['product_id']} - Optimal Stock Level: {optimal_stock_level}")

if __name__ == '__main__':
    aggregated_data = aggregate_inventory_data()
    add_vectors_to_index(product_vectors)
    manage_stock_levels(aggregated_data)
    app.run(debug=True)

import requests

def simulate_real_time_updates():
    new_data = {
        'product_id': 4,
        'stock': 120,
        'location': 'new_store',
        'vector': np.random.rand(128).tolist()
    }
    response = requests.post('http://localhost:5000/update_inventory', json=new_data)
    print(response.json())

simulate_real_time_updates()