from ultralytics import YOLO
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
import re
import os
import gdown

# Google Drive model download setup
MODEL_PATH = 'street-safe-python/best.pt'
GDRIVE_FILE_ID = '1K73vo398C6xZHM_bCQUNjhhhobZHUyq9'

def download_model_if_needed():
    if not os.path.exists(MODEL_PATH):
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        url = f'https://drive.google.com/uc?id={GDRIVE_FILE_ID}'
        print("Downloading model from Google Drive...")
        gdown.download(url, MODEL_PATH, quiet=False)
        print("Model downloaded.")

# Download the model if not already present
download_model_if_needed()

# Load YOLOv8 custom-trained model
model = YOLO(MODEL_PATH)

# Initialize Flask app
app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect_hazard():
    data = request.json
    image_b64 = data.get('image')

    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

    # Strip base64 prefix if it exists
    if image_b64.startswith("data:image"):
        print("Stripping data URI prefix from base64 string...")
        image_b64 = re.sub(r"^data:image\/[a-zA-Z]+;base64,", "", image_b64)

    try:
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((640, 640)) 
        image_np = np.array(image)
    except Exception as e:
        return jsonify({"error": f"Invalid image data: {str(e)}"}), 400

    # Run YOLOv8 detection
    results = model.predict(source=image_np, save=False, conf=0.1)

    detections = []
    if results and len(results[0].boxes) > 0:
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(float, box.xyxy[0])
            detections.append({
                "class_id": cls_id,
                "confidence": conf,
                "bbox": [x1, y1, x2, y2],
                "label": model.names[cls_id]
            })
    else:
        print("No detections found.")

    return jsonify({"detections": detections})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)