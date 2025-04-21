from ultralytics import YOLO
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image, ImageDraw, ImageFont
import io
import base64
import re

# Load YOLOv8 custom-trained model
model = YOLO('/Users/fdc-pablito-nc-web/Documents/Torrexx/street-safe-python/runs/detect/train5/weights/best.pt')

# Initialize Flask app
app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect_hazard():
    data = request.json
    image_b64 = data.get('image')

    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

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
    results = model.predict(source=image_np, save=False, conf=0.1)

    detections = []
    draw = ImageDraw.Draw(image)

    if results and len(results[0].boxes) > 0:
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(float, box.xyxy[0])
            label = f"{model.names[cls_id]}: {conf:.2f}"
            detections.append({
                # uncomment the following lines if you want to include class_id and confidence in the response
                # "class_id": cls_id,
                # "confidence": conf,
                # "bbox": [x1, y1, x2, y2],
                "label": model.names[cls_id]
            })
            # Draw box and label
            draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
            draw.text((x1, y1 - 10), label, fill="red")

    # Convert drawn image back to base64
    output_buffer = io.BytesIO()
    image.save(output_buffer, format="PNG")
    output_b64 = base64.b64encode(output_buffer.getvalue()).decode('utf-8')

    return jsonify({
        "success": bool(detections),  # True if detections is not empty
        "detections": detections,
        "image_with_boxes": output_b64
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
