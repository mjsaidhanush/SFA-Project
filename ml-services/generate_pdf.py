from fpdf import FPDF
import datetime

class PDF(FPDF):
    def header(self):
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Move to the right
        self.cell(80)
        # Title
        self.cell(30, 10, 'Smart Farm Assistant - ML Models & Datasets', 0, 0, 'C')
        # Line break
        self.ln(20)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Arial', 'I', 8)
        # Page number
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

# Instantiation of inherited class
pdf = PDF()
pdf.alias_nb_pages()
pdf.add_page()
pdf.set_font('Arial', '', 12)

# Date
pdf.cell(0, 10, f"Generated on: {datetime.date.today()}", 0, 1)
pdf.ln(10)

content = [
    ("1. Crop Recommendation Model", "B", 14),
    ("- Purpose: Predicts the most suitable crop to grow based on soil and weather parameters.", "", 12),
    ("- Input Features: Soil Type, Nitrogen, Phosphorus, Potassium content, Temperature, Humidity, Rainfall, pH.", "", 12),
    ("- Algorithm Strategy: Ensemble Learning (e.g., Random Forest Classifier, XGBoost).", "", 12),
    ("- Primary Dataset: 'Crop Recommendation Training Data'", "I", 12),
    ("  -> Format: Tabular (CSV)", "", 12),
    ("  -> Size: 45 MB (~125,000 records)", "", 12),
    ("  -> Source: Agricultural sensors and historical yield data.", "", 12),
    ("", "", 12),
    
    ("2. Plant Leaf Disease Detection Model", "B", 14),
    ("- Purpose: Analyzes images of crop leaves to identify potential diseases and suggest treatments.", "", 12),
    ("- Input Features: Image pixel values (RGB channels).", "", 12),
    ("- Algorithm Strategy: Convolutional Neural Network (CNN) - e.g., ResNet50, MobileNetV2.", "", 12),
    ("- Primary Dataset: 'Leaf Disease Image Collection V2'", "I", 12),
    ("  -> Format: Images (ZIP archive containing JPEGs/PNGs)", "", 12),
    ("  -> Size: 1.2 GB (15,420 annotated images)", "", 12),
    ("  -> Source: Agronomic research institutes and the PlantVillage dataset.", "", 12),
    ("", "", 12),
    
    ("3. Rain & Weather Prediction Model", "B", 14),
    ("- Purpose: Forecasts short-term and long-term rainfall probabilities to aid in irrigation planning.", "", 12),
    ("- Input Features: Historical temperature, pressure, humidity, wind speed.", "", 12),
    ("- Algorithm Strategy: Time-series Analysis (e.g., LSTM - Long Short Term Memory networks, ARIMA).", "", 12),
    ("- Primary Dataset: 'Regional Weather Logs 2025'", "I", 12),
    ("  -> Format: JSON", "", 12),
    ("  -> Size: 18 MB (8,760 hourly records)", "", 12),
    ("  -> Source: Meteorological APIs and local weather stations.", "", 12),
    ("", "", 12),
    
    ("4. Market Price Forecasting Model", "B", 14),
    ("- Purpose: Anticipates future crop market prices so farmers can optimize their selling windows.", "", 12),
    ("- Input Features: Commodity name, current price trends, season, geographical location.", "", 12),
    ("- Algorithm Strategy: Regression models and Recurrent Neural Networks.", "", 12),
    ("- Primary Dataset: 'Market Prices Real-time Sync'", "I", 12),
    ("  -> Format: API Stream (Continuous Data feed)", "", 12),
    ("  -> Size: Continuous (450,000+ records processed)", "", 12),
    ("  -> Source: Government commodity markets (e.g., e-NAM) and live market tickers.", "", 12),
    ("", "", 12),
]

for text, style, size in content:
    pdf.set_font('Arial', style, size)
    # Using multi_cell for wrapping text
    pdf.multi_cell(0, 8, txt=text)

pdf.output("Smart_Farm_ML_Models_Datasets.pdf")
