from flask import Flask, jsonify
import requests
import pickle

app = Flask(__name__)

# Load trained model
model = pickle.load(open("rain_model.pkl", "rb"))

# 🔑 Your API Key (replace with real one)
API_KEY = "YOUR_REAL_API_KEY"

@app.route('/predict-rain', methods=['GET'])
def predict_rain():
    city = "Vadodara"

    # 🌦️ Get live weather data
    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}"
    response = requests.get(url)
    data = response.json()

    # Extract features
    temp = data['current']['temp_c']
    humidity = data['current']['humidity']
    pressure = data['current']['pressure_mb']
    wind = data['current']['wind_kph']

    # ⚠️ Convert live data → model input
    # (since model expects 12 months, we simulate)
    features = [[temp]*12]

    # Prediction
    prediction = model.predict(features)

    return jsonify({
        "city": city,
        "predicted_annual_rainfall": float(prediction[0]),
        "live_weather": {
            "temperature": temp,
            "humidity": humidity,
            "pressure": pressure,
            "wind_speed": wind
        }
    })

if __name__ == '__main__':
    app.run(debug=True)