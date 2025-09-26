from ultralytics import YOLO

# Load pretrained YOLOv8 model
model = YOLO("yolov8n.pt")

# Train using your dataset
results = model.train(
    data="data.yaml",  # path to data.yaml
    epochs=50,
    imgsz=640
)
