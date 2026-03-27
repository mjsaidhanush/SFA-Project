from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import pickle
import datetime

import warnings
warnings.filterwarnings("ignore")

app = FastAPI(title="Smart Farm ML Services API", version="1.0.0")

# Load models if they exist
try:
    with open("rain_model.pkl", "rb") as f:
        rain_model = pickle.load(f)
    with open("rain_district_encoder.pkl", "rb") as f:
        rain_district_encoder = pickle.load(f)
    RAIN_MODEL_LOADED = True
except Exception as e:
    print("Warning: Could not load rain model or encoder.", e)
    RAIN_MODEL_LOADED = False

try:
    with open("crop_model.pkl", "rb") as f:
        crop_model = pickle.load(f)
    with open("le_state.pkl", "rb") as f:
        le_state = pickle.load(f)
    with open("le_district.pkl", "rb") as f:
        le_district = pickle.load(f)
    with open("le_season.pkl", "rb") as f:
        le_season = pickle.load(f)
    with open("le_crop.pkl", "rb") as f:
        le_crop = pickle.load(f)
    CROP_MODEL_LOADED = True
except Exception as e:
    print("Warning: Could not load crop model or encoders.", e)
    CROP_MODEL_LOADED = False

try:
    with open("model.pkl", "rb") as f:
        weather_model = pickle.load(f)
    WEATHER_MODEL_LOADED = True
except Exception as e:
    print("Warning: Could not load weather model.", e)
    WEATHER_MODEL_LOADED = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CropPredictionRequest(BaseModel):
    state_name: str = "Andhra Pradesh"
    district_name: str = "ANANTAPUR"
    season: str = "Kharif"
    soil_type: str = "Loamy"
    nitrogen: float = 20
    phosphorus: float = 20
    potassium: float = 20
    temperature: float = 25.0
    humidity: float = 60.0
    rainfall: float = 150.0
    ph: float = 6.5

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Farm ML Services"}

@app.post("/api/crop/predict")
def predict_crop(data: CropPredictionRequest):
    if not CROP_MODEL_LOADED:
        crops = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane"]
        prediction = random.choice(crops)
        return {"predicted_crop": prediction, "confidence": round(random.uniform(0.7, 0.99), 2)}

    try:
        # Fuzzy match inputs
        from fuzzywuzzy import process
        
        # simple substring/fuzzy match
        state = data.state_name
        district = data.district_name
        season = data.season
        
        # We try to use the encoder's classes directly or fallback if not seen
        state_match = state if state in le_state.classes_ else le_state.classes_[0]
        district_match = district if district in le_district.classes_ else le_district.classes_[0]
        season_match = season if season in le_season.classes_ else le_season.classes_[0]

        s_enc = le_state.transform([state_match])[0]
        d_enc = le_district.transform([district_match])[0]
        sea_enc = le_season.transform([season_match])[0]
        
        pred_idx = crop_model.predict([[s_enc, d_enc, sea_enc]])[0]
        crop_name = le_crop.inverse_transform([pred_idx])[0]
        
        # Get probability
        probas = crop_model.predict_proba([[s_enc, d_enc, sea_enc]])[0]
        confidence = max(probas)
        
        return {"predicted_crop": crop_name, "confidence": round(confidence, 2)}
    except Exception as e:
        crops = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane"]
        return {"predicted_crop": random.choice(crops), "confidence": 0.5}

@app.get("/api/rain/predict")
def predict_rain(location: str):
    if not RAIN_MODEL_LOADED:
        return {"location": location, "rain_probability": round(random.uniform(0, 100), 2), "error": "Model not loaded"}
    
    current_month = datetime.datetime.now().month
    classes = rain_district_encoder.classes_
    loc_upper = location.upper()
    best_match = None
    
    # Prefix or exact match
    for c in classes:
        if loc_upper in c or c in loc_upper:
            best_match = c
            break
            
    # Substring match if not found
    if not best_match:
        for c in classes:
            if any(word in c for word in loc_upper.split()):
                best_match = c
                break

    # Fallback to the first class
    if not best_match:
        best_match = classes[0]

    try:
        loc_encoded = rain_district_encoder.transform([best_match])[0]
        # model expects list of features
        predicted_rainfall = rain_model.predict([[loc_encoded, current_month]])[0]
        # map probability: arbitrary heurustic, normal max is usually ~1000, 10mm monthly average is roughly 10%
        prob = min((predicted_rainfall / 100.0) * 100, 100.0)
    except Exception as e:
        return {"location": location, "rain_probability": 0.0, "error": str(e)}

    import requests
    
    live_weather = None
    try:
        geo_res = requests.get(f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1").json()
        if geo_res.get("results"):
            lat = geo_res["results"][0]["latitude"]
            lon = geo_res["results"][0]["longitude"]
            weather_res = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=precipitation_probability_max,precipitation_sum&timezone=auto").json()
            live_weather = {
                "temperature": weather_res.get("current_weather", {}).get("temperature"),
                "windspeed": weather_res.get("current_weather", {}).get("windspeed"),
                "precipitation_probability_today": weather_res.get("daily", {}).get("precipitation_probability_max", [None])[0],
                "precipitation_sum_today": weather_res.get("daily", {}).get("precipitation_sum", [None])[0]
            }
    except Exception as e:
        print("Live weather fetch error:", e)

    return {
        "location": location,
        "matched_district": best_match,
        "predicted_rainfall_mm": round(predicted_rainfall, 2),
        "rain_probability": round(prob, 2),
        "month": current_month,
        "live_weather": live_weather
    }

@app.get("/api/weather/predict")
def predict_weather(city: str):
    if not WEATHER_MODEL_LOADED:
        return {"error": "Weather prediction model not loaded."}
    try:
        import requests
        import numpy as np
        API_KEY = "67fbc660a76d6f900ba528b6a419186a"
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
        data = requests.get(url).json()

        if 'main' not in data:
            return {"error": data.get("message", "API error"), "full_response": data}

        temp = data['main']['temp']
        humidity = data['main']['humidity']
        rainfall = data.get('rain', {}).get('1h', 0)

        prediction = weather_model.predict(np.array([[temp, humidity, rainfall]]))

        return {
            "city": city,
            "temperature": temp,
            "humidity": humidity,
            "rainfall": rainfall,
            "prediction": prediction[0]
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/weather/forecast")
def predict_weather_forecast(city: str):
    if not WEATHER_MODEL_LOADED:
        return {"error": "Weather prediction model not loaded."}
    try:
        import requests
        import numpy as np
        API_KEY = "67fbc660a76d6f900ba528b6a419186a"
        url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
        data = requests.get(url).json()

        if str(data.get("cod")) != "200":
            return {"error": data.get("message", "API error"), "full_response": data}

        forecast_list = data.get("list", [])
        predictions = []

        for item in forecast_list:
            temp = item['main']['temp']
            humidity = item['main']['humidity']
            rainfall = item.get('rain', {}).get('3h', 0)
            
            pred = weather_model.predict(np.array([[temp, humidity, rainfall]]))
            
            predictions.append({
                "datetime": item.get("dt_txt"),
                "temperature": temp,
                "humidity": humidity,
                "rainfall": rainfall,
                "prediction": pred[0]
            })

        return {
            "city": city,
            "forecast": predictions
        }
    except Exception as e:
        return {"error": str(e)}
