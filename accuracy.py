from ultralytics import YOLO

if __name__ == "__main__":
    # Load your trained model
    model = YOLO("best.pt")   # make sure best.pt is in the same folder as accuracy.py

    # Path to your dataset config (update the path if needed)
    data_yaml = r"D:\Pest Detection project\pest_dataset2\data.yaml"

    # Run validation
    metrics = model.val(data=data_yaml, imgsz=640)

    # Print key results
    print("\n📊 Model Accuracy Report")
    print(f"Precision: {metrics.box.p.mean():.2f}")
    print(f"Recall:    {metrics.box.r.mean():.2f}")
    print(f"mAP@0.5:   {metrics.box.map50.mean():.2f}")
    print(f"mAP@0.5:0.95: {metrics.box.map.mean():.2f}")


