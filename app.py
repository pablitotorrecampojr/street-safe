from ultralytics import YOLO
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
from datetime import datetime
import io
import base64
import re
import os
import logging

logging.basicConfig(
    filename="logs/conf/hazard_api.log",   # log file path
    level=logging.INFO,          # or DEBUG for more detail
    format="%(asctime)s - %(levelname)s - %(message)s"
)
# Load YOLOv8 custom-trained model
model = YOLO("weights/best.pt")

# Initialize Flask app
app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect_hazard():
    data = request.json
    logging.info(f"Incoming request JSON: {data}")

    image_b64 = data.get('image')

    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

    # generate image from base 64
    image_bytes = base64.b64decode(image_b64)
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    image.save(f"/logs/img/img_{timestamp}.jpg")

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)