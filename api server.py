from flask import Flask, jsonify, request
import requests
import pickle

app = Flask(__name__)

# Load trained model
try:
    model = pickle.load(open("rain_model.pkl", "rb"))
except Exception as e:
    print("Warning: Could not load rain model. Running in simulation fallback mode.", e)
    model = None

# 🔑 OpenWeatherMap API Key (working key used in app.py / main.py)
API_KEY = "67fbc660a76d6f900ba528b6a419186a"

@app.route('/predict-rain', methods=['GET'])
def predict_rain():
    city = request.args.get('city', 'Vadodara')

    # 🌦️ Get live weather data using OpenWeatherMap
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    
    try:
        response = requests.get(url)
        data = response.json()

        if 'main' not in data:
            return jsonify({
                "error": data.get("message", "API error"),
                "full_response": data
            }), 400

        # Extract features and map OpenWeatherMap structure to expected fields
        temp = data['main']['temp']
        humidity = data['main']['humidity']
        pressure = data['main']['pressure']
        wind = data.get('wind', {}).get('speed', 0) * 3.6  # Convert wind speed from m/s to km/h

        # ⚠️ Convert live data → model input (simulating 12 months using current temp)
        if model is not None:
            features = [[temp]*12]
            prediction = model.predict(features)
            predicted_annual_rainfall = float(prediction[0])
        else:
            # Fallback simulation if model.pkl wasn't loaded
            predicted_annual_rainfall = 1200.0

        return jsonify({
            "city": city,
            "predicted_annual_rainfall": predicted_annual_rainfall,
            "live_weather": {
                "temperature": temp,
                "humidity": humidity,
                "pressure": pressure,
                "wind_speed": wind
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)