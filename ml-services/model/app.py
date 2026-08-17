from flask import Flask, jsonify
import requests
import pickle

app = Flask(__name__)

# Load trained model
model = pickle.load(open("model/model.pkl", "rb"))

# Your API Key
API_KEY = "YOUR_OPENWEATHER_API_KEY"

@app.route("/")
def home():
    return "Smart Farm Assistant Running 🚜"

@app.route("/predict/<city>")
def predict(city):

    # Fetch live weather
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    data = response.json()

    try:
        temp = data['main']['temp']
        humidity = data['main']['humidity']

        # Dummy rainfall (you can improve later)
        rainfall = data.get('rain', {}).get('1h', 0)

        # ML Prediction
        prediction = model.predict([[temp, humidity, rainfall]])

        return jsonify({
            "city": city,
            "temperature": temp,
            "humidity": humidity,
            "rainfall": rainfall,
            "recommended_crop": prediction[0]
        })

    except:
        return jsonify({"error": "City not found or API issue"})