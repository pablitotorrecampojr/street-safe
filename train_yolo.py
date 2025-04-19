from ultralytics import YOLO

# Load the base YOLOv8n model (or replace with yolov8s/m/l/x if you want a bigger model)
model = YOLO('yolov8n.pt')

# Train the model using your custom dataset
model.train(
    data='./datasets/road_hazards/data.yaml',  # Adjust path if needed
    epochs=50,
    imgsz=640
)
