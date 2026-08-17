from fpdf import FPDF
import datetime

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, 'Smart Farm Assistant - Detailed ML & Dataset Report', 0, 1, 'C')
        self.set_font('Arial', 'I', 10)
        self.cell(0, 10, 'A detailed point-wise breakdown of the exact models and datasets used in this project.', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', 0, 0, 'C')

pdf = PDF()
pdf.alias_nb_pages()
pdf.add_page()
pdf.set_font('Arial', '', 11)

pdf.cell(0, 10, f"Date Generated: {datetime.date.today()}", 0, 1)
pdf.ln(5)

# Setup multiline variables
content = [
    ("1. Crop Recommendation Model", "B", 14),
    (" * Current Project Status: Fully Implemented (API Endpoint: /api/crop/predict)", "B", 11),
    (" - Purpose: Suggests the optimal crop to maximize yield for farmers.", "", 11),
    (" - Input Features Used in Frontend:", "I", 11),
    ("     - Soil Type, Nitrogen (N), Phosphorus (P), Potassium (K)", "", 11),
    ("     - Temperature, Humidity, Rainfall, pH levels", "", 11),
    (" - Output: Predicted crop name and calculation confidence percentage.", "", 11),
    (" - Associated Dataset Used in Admin Portal:", "I", 11),
    ("     - Name: 'Crop Recommendation Training Data'", "", 11),
    ("     - Format: Tabular (CSV)", "", 11),
    ("     - Size: 45 MB (~125,000 records)", "", 11),
    ("     - Accuracy: 94.2% (Active Status)", "", 11),
    (" - Algorithm Architecture: Modeled for Ensemble Learning (e.g., Random Forest Classifier).", "", 11),
    ("", "", 11),

    ("2. Rain & Weather Forecasting Model", "B", 14),
    (" * Current Project Status: Implemented (API Endpoint: /api/rain/predict)", "B", 11),
    (" - Purpose: Predicts probability of rain for a specific geographical location.", "", 11),
    (" - Input Features Used in Frontend:", "I", 11),
    ("     - User Location string input", "", 11),
    (" - Output: Rain probability percentage.", "", 11),
    (" - Associated Dataset Used in Admin Portal:", "I", 11),
    ("     - Name: 'Regional Weather Logs 2025'", "", 11),
    ("     - Format: JSON", "", 11),
    ("     - Size: 18 MB (8,760 hourly records)", "", 11),
    ("     - Accuracy: N/A (Archived Status)", "", 11),
    (" - Algorithm Architecture: Modeled for Time-series logic.", "", 11),
    ("", "", 11),

    ("3. Plant Leaf Disease Detection Model", "B", 14),
    (" * Current Project Status: UI Interactive (File Upload active, ML bridging pending)", "B", 11),
    (" - Purpose: Visually analyzes crop leaf photos to identify specific crop diseases.", "", 11),
    (" - Input Features Used in Frontend:", "I", 11),
    ("     - Drag-and-drop Image Upload (JPEG/PNG).", "", 11),
    (" - Associated Dataset Used in Admin Portal:", "I", 11),
    ("     - Name: 'Leaf Disease Image Collection V2'", "", 11),
    ("     - Format: Images (ZIP Archive)", "", 11),
    ("     - Size: 1.2 GB (15,420 annotated images)", "", 11),
    ("     - Accuracy: 91.8% (Active Status)", "", 11),
    (" - Algorithm Architecture: Convolutional Neural Network (CNN) image processing.", "", 11),
    ("", "", 11),

    ("4. Market Price Forecasting Model", "B", 14),
    (" * Current Project Status: UI Dashboard Implemented", "B", 11),
    (" - Purpose: Streams real-time commodity prices to inform selling windows.", "", 11),
    (" - Input Features Used in Frontend:", "I", 11),
    ("     - Real-time chart visualization.", "", 11),
    (" - Associated Dataset Used in Admin Portal:", "I", 11),
    ("     - Name: 'Market Prices Real-time Sync'", "", 11),
    ("     - Format: API Stream", "", 11),
    ("     - Size: Continuous (450,000+ records processed)", "", 11),
    ("     - Accuracy: 98.5% (Active Status)", "", 11),
    ("", "", 11),
]

for text, style, size in content:
    pdf.set_font('Arial', style, size)
    # Give a bit more spacing for readability
    pdf.multi_cell(0, 8, txt=text)

output_path = "C:/Users/MJSAIDHANUSH/OneDrive/Documents/project of antigravity main website sfa/Smart_Farm_Specific_Details.pdf"
pdf.output(output_path)
print(f"Generated Detailed PDF at: {output_path}")
