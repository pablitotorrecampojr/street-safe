import torch
import numpy as np
import cv2
from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
import re

# Load YOLOv5 model (once, at top of your file)
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

# Initialize Flask app
app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect_hazard():
    data = request.json
    image_b64 = data.get('image')

    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

    # Check and remove data URI scheme if present
    if image_b64.startswith("data:image"):
        print("Stripping data URI prefix from base64 string...")
        image_b64 = re.sub(r"^data:image\/[a-zA-Z]+;base64,", "", image_b64)

    try:
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image_np = np.array(image)
    except Exception as e:
        return jsonify({"error": f"Invalid image data: {str(e)}"}), 400

    # Debug: Check image shape
    print("Image shape:", image_np.shape)

    # Run detection
    results = model(image_np)

    # Debug: Check results
    print("Detection results:", results)

    detections = results.pandas().xyxy[0].to_dict(orient="records")

    # Debug: Check if detections are empty
    if not detections:
        print("No detections found.")
    else:
        print(f"Detections: {detections}")

    return jsonify({
        "detections": detections
    })

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
