from flask import Flask, jsonify
import requests
import pickle
import numpy as np

app = Flask(__name__)

# Load model
model = pickle.load(open("model.pkl", "rb"))

# API key
API_KEY = "67fbc660a76d6f900ba528b6a419186a"


from flask import render_template

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict/<city>")
def predict(city):
    try:
        # ✅ city used INSIDE function
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
        data = requests.get(url).json()

        print("API DATA:", data)

        # ✅ check API response
        if 'main' not in data:
            return jsonify({
                "error": data.get("message", "API error"),
                "full_response": data
            })

        temp = data['main']['temp']
        humidity = data['main']['humidity']
        rainfall = data.get('rain', {}).get('1h', 0)

        prediction = model.predict(np.array([[temp, humidity, rainfall]]))

        return jsonify({
            "city": city,
            "temperature": temp,
            "humidity": humidity,
            "rainfall": rainfall,
            "prediction": prediction[0]
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)})


import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
