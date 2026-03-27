import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
df = pd.read_csv("../dataset/weather_observations.csv")

# Example: adjust based on your dataset columns
# Assume:
# temperature, humidity, rainfall, crop

X = df[['temperature', 'humidity', 'rainfall']]
y = df['crop']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save model
pickle.dump(model, open("model.pkl", "wb"))

print("✅ Model trained & saved!")