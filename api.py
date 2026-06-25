from flask import Flask, render_template, request, jsonify, url_for
from flask_cors import CORS
import os
import logging

LOG = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Flask app
app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# Uploads and detections folders inside static/
UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")
DETECTIONS_FOLDER = os.path.join(BASE_DIR, "static", "detections")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DETECTIONS_FOLDER, exist_ok=True)

# Try to load ultralytics YOLO model if available
try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except Exception:
    ULTRALYTICS_AVAILABLE = False
    LOG.warning("ultralytics not installed or failed to import. Model won't run until installed.")

model = None
MODEL_PATH = os.path.join(BASE_DIR, "best.pt")  # default location

if ULTRALYTICS_AVAILABLE:
    try:
        if os.path.exists(MODEL_PATH):
            model = YOLO(MODEL_PATH)
            LOG.info(f"Loaded model from {MODEL_PATH}")
        else:
            LOG.warning(f"Model file not found at {MODEL_PATH}. Place best.pt in project root.")
    except Exception as e:
        LOG.exception("Failed to initialize YOLO model: %s", e)
        model = None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/detect", methods=["POST"])
def detect():
    files = request.files.getlist("images")
    if not files:
        return jsonify({"error": "No image uploaded"}), 400

    results_out = []
    for file in files:
        filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)

        if model is None:
            LOG.error("Model not loaded - cannot run inference.")
            return jsonify({
                "error": "Model not loaded on server. Check server logs and ensure best.pt is present and ultralytics is installed."
            }), 500

        try:
            # Run prediction and save annotated image(s)
            predict_results = model.predict(
                source=save_path,
                save=True,
                project=DETECTIONS_FOLDER,
                name="results",
                exist_ok=True
            )
            r = predict_results[0]

            # Annotated image path
            detected_image_path = str(r.path)
            rel_path = os.path.relpath(detected_image_path, start=os.path.join(BASE_DIR, "static")).replace("\\", "/")
            detected_url = url_for("static", filename=rel_path, _external=True)

            # Extract bounding boxes
            boxes_out = []
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                boxes_out.append({
                    "x": x1,
                    "y": y1,
                    "width": x2 - x1,
                    "height": y2 - y1,
                    "label": r.names[int(box.cls[0])],
                    "confidence": round(float(box.conf[0]) * 100, 2),
                    "color": "#ef4444"
                })

            results_out.append({
                "filename": filename,
                "detected_image": detected_url,
                "boxes": boxes_out
            })

        except Exception as e:
            LOG.exception("Inference failed for %s", save_path)
            return jsonify({"error": "Inference failed", "detail": str(e)}), 500

    return jsonify({"message": "Detection completed successfully!", "results": results_out}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
