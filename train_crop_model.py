import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import os

# File paths
csv_path = r"c:\Users\MJSAIDHANUSH\Downloads\preprocessed2 (1).csv"
model_path = r"c:\Users\MJSAIDHANUSH\OneDrive\Documents\project of antigravity main website sfa\crop_model.pkl"
le_state_path = r"c:\Users\MJSAIDHANUSH\OneDrive\Documents\project of antigravity main website sfa\le_state.pkl"
le_district_path = r"c:\Users\MJSAIDHANUSH\OneDrive\Documents\project of antigravity main website sfa\le_district.pkl"
le_season_path = r"c:\Users\MJSAIDHANUSH\OneDrive\Documents\project of antigravity main website sfa\le_season.pkl"
le_crop_path = r"c:\Users\MJSAIDHANUSH\OneDrive\Documents\project of antigravity main website sfa\le_crop.pkl"

def train_model():
    print(f"Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)

    # The columns are Unnamed: 0, State_Name, District_Name, Season, Crop
    # Let's clean the columns (strip whitespace)
    df.columns = df.columns.str.strip()
    
    # Keep relevant columns
    df = df[['State_Name', 'District_Name', 'Season', 'Crop']]
    
    # Strip whitespace from the string values just in case
    for col in df.columns:
        df[col] = df[col].astype(str).str.strip()
    
    # Drop rows with NaN
    df = df.dropna()

    # Encoders
    le_state = LabelEncoder()
    le_district = LabelEncoder()
    le_season = LabelEncoder()
    le_crop = LabelEncoder()

    df['State_Encoded'] = le_state.fit_transform(df['State_Name'])
    df['District_Encoded'] = le_district.fit_transform(df['District_Name'])
    df['Season_Encoded'] = le_season.fit_transform(df['Season'])
    df['Crop_Encoded'] = le_crop.fit_transform(df['Crop'])

    X = df[['State_Encoded', 'District_Encoded', 'Season_Encoded']]
    y = df['Crop_Encoded']

    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=50, max_depth=15, random_state=42, n_jobs=-1)
    model.fit(X, y)

    print("Saving model and encoders...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    with open(le_state_path, 'wb') as f:
        pickle.dump(le_state, f)
    with open(le_district_path, 'wb') as f:
        pickle.dump(le_district, f)
    with open(le_season_path, 'wb') as f:
        pickle.dump(le_season, f)
    with open(le_crop_path, 'wb') as f:
        pickle.dump(le_crop, f)

    print("Model training complete!")

if __name__ == "__main__":
    train_model()
