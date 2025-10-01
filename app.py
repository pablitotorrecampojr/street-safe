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

os.makedirs("logs/conf", exist_ok=True)
os.makedirs("logs/detect", exist_ok=True)
os.makedirs("logs/img", exist_ok=True)
logging.basicConfig(
    filename="logs/conf/hazard_api.log",   
    level=logging.INFO,         
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Load YOLOv8 custom-trained model
model = YOLO('model/best.pt')

# Initialize Flask app
app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Hazard Detection API!"})

@app.route('/detect', methods=['POST'])
def detect_hazard():
    data = request.json
    image_b64 = data.get('image')

    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

    # generate image from base 64
    image_bytes = base64.b64decode(image_b64)
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    image.save(f"logs/img/img_{timestamp}.jpg")

    if image_b64.startswith("data:image"):
        image_b64 = re.sub(r"^data:image\/[a-zA-Z]+;base64,", "", image_b64)

    try:
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((640, 640))
        image_np = np.array(image)
    except Exception as e:
        return jsonify({"error": f"Invalid image data: {str(e)}"}), 400

    # Run YOLOv8 detection
    results = model.predict(source=image_np, save=False, conf=0.2)

    annotated_frame = results[0].plot()
    annotated_image = Image.fromarray(annotated_frame)
    annotated_image.save(f"logs/detect/img_{timestamp}.jpg")

    buffered = io.BytesIO()
    annotated_image.save(buffered, format="JPEG")
    annotated_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    detections = {}
    detections_str = ""
    if results and len(results[0].boxes) > 0:
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = model.names[cls_id]

            if label not in detections or conf > detections[label]:
                detections[label] = round(conf, 2)

    detections_str = ", ".join([f"{label}: {conf}" for label, conf in detections.items()])

    return jsonify({
        "success": True,
        "detections": detections_str,
        "annotated_image": annotated_b64
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
