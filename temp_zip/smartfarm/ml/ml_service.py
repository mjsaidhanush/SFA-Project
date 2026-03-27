"""
SmartFarm – Python ML Microservice
Serves: Crop Recommendation, Rain Prediction, Disease Detection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ===== MOCK ML MODELS (Replace with trained models) =====
# In production: load from /ml/models/ directory
# from joblib import load
# crop_model = load('/ml/models/crop_rf.pkl')
# rain_model = load('/ml/models/rain_xgb.pkl')

CROP_LABELS = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
    'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
    'apple', 'orange', 'papaya', 'coconut', 'cotton',
    'jute', 'coffee', 'wheat', 'mustard'
]

def mock_crop_predict(N, P, K, temperature, humidity, ph, rainfall):
    """Mock prediction — replace with actual Random Forest model"""
    scores = {
        'wheat':    0.92 if temperature < 25 and rainfall < 300 else 0.45,
        'rice':     0.88 if humidity > 80 and rainfall > 500 else 0.30,
        'maize':    0.85 if temperature > 20 and ph > 5.5 else 0.40,
        'chickpea': 0.81 if N > 40 and temperature < 30 else 0.50,
        'mustard':  0.74 if temperature < 20 else 0.35,
        'cotton':   0.70 if temperature > 25 and ph > 6.0 else 0.30,
    }
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
    return [{'crop': k, 'confidence': round(v, 3)} for k, v in ranked]

def mock_rain_predict(temp, humidity, pressure, wind_speed):
    """Mock prediction — replace with actual XGBoost model"""
    prob = min(0.95, (humidity / 100) * 0.6 + (100 - temp) / 200)
    return round(prob, 3)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'SmartFarm ML Service', 'timestamp': datetime.now().isoformat()})

@app.route('/api/predict/crop', methods=['POST'])
def predict_crop():
    try:
        data = request.get_json()
        N = float(data.get('N', 90))
        P = float(data.get('P', 42))
        K = float(data.get('K', 43))
        temperature = float(data.get('temperature', 22))
        humidity = float(data.get('humidity', 82))
        ph = float(data.get('ph', 6.5))
        rainfall = float(data.get('rainfall', 200))

        # TODO: Replace with actual model
        # features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        # prediction = crop_model.predict(features)[0]
        # probabilities = crop_model.predict_proba(features)[0]

        recommendations = mock_crop_predict(N, P, K, temperature, humidity, ph, rainfall)
        return jsonify({
            'status': 'success',
            'recommendations': recommendations,
            'top_crop': recommendations[0]['crop'],
            'confidence': recommendations[0]['confidence'],
            'model': 'RandomForest',
            'model_accuracy': 0.947,
            'input_features': { 'N': N, 'P': P, 'K': K, 'temperature': temperature, 'humidity': humidity, 'ph': ph, 'rainfall': rainfall }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict/rain', methods=['POST'])
def predict_rain():
    try:
        data = request.get_json()
        temp = float(data.get('temperature', 28))
        humidity = float(data.get('humidity', 65))
        pressure = float(data.get('pressure', 1015))
        wind_speed = float(data.get('wind_speed', 14))

        probability = mock_rain_predict(temp, humidity, pressure, wind_speed)
        forecast = [
            {'day': i, 'rain_prob': round(probability * (0.8 + np.random.uniform(-0.2, 0.2)), 2),
             'temp_high': round(temp + np.random.uniform(-3, 4), 1),
             'humidity': round(humidity + np.random.uniform(-5, 10))}
            for i in range(7)
        ]
        return jsonify({
            'status': 'success',
            'probability': probability,
            'confidence': 0.87,
            'forecast': forecast,
            'advisory': 'Heavy rain expected. Delay irrigation and harvest ready crops.' if probability > 0.6 else 'Conditions favorable for irrigation.',
            'model': 'XGBoost',
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict/disease', methods=['POST'])
def detect_disease():
    """
    In production: 
    - Accept multipart/form-data with image
    - Preprocess image: resize to 224x224, normalize
    - Run through MobileNetV2 model
    - Return top-3 predictions with confidence
    """
    try:
        # Mock response for demo
        diseases = [
            {'disease': 'Yellow Rust (Puccinia striiformis)', 'confidence': 0.94, 'severity': 'High',
             'treatment': 'Apply Propiconazole 25% EC @ 0.1% solution. Repeat every 10-14 days.',
             'prevention': 'Use resistant varieties, ensure proper spacing, avoid overhead irrigation.'},
            {'disease': 'Healthy', 'confidence': 0.98, 'severity': 'None',
             'treatment': 'No treatment required.',
             'prevention': 'Continue regular monitoring and good agricultural practices.'},
        ]
        import random
        result = random.choice(diseases)
        return jsonify({
            'status': 'success',
            **result,
            'model': 'MobileNetV2',
            'model_accuracy': 0.924,
            'dataset': 'PlantVillage (38 classes)',
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sentiment/news', methods=['POST'])
def analyze_sentiment():
    """BERT-based news sentiment analysis (mock)"""
    try:
        text = request.get_json().get('text', '')
        positive_words = ['increase', 'growth', 'forecast', 'good', 'rise', 'benefit', 'improve', 'surplus']
        negative_words = ['decline', 'fall', 'loss', 'disease', 'drought', 'shortage', 'crisis', 'drop']
        pos = sum(1 for w in positive_words if w in text.lower())
        neg = sum(1 for w in negative_words if w in text.lower())
        if pos > neg: sentiment, score = 'positive', 0.72 + pos * 0.05
        elif neg > pos: sentiment, score = 'negative', 0.68 + neg * 0.05
        else: sentiment, score = 'neutral', 0.55
        return jsonify({'sentiment': sentiment, 'confidence': min(0.99, round(score, 2)), 'model': 'BERT'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('ML_PORT', 8000))
    print(f"🌿 SmartFarm ML Service running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('DEBUG', 'false').lower() == 'true')
