from flask import Flask, request, jsonify
from PIL import Image
import io
import base64

app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect_hazard():
    data = request.json
    image_b64 = data.get('image')

    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

    # Decode Base64 string to bytes
    image_bytes = base64.b64decode(image_b64)
    image = Image.open(io.BytesIO(image_bytes))

    # Your detection logic here
    hazard_type = "pothole"  # dummy result
    confidence = 0.93        # dummy confidence

    return jsonify({
        "hazard": hazard_type,
        "confidence": confidence
    })
