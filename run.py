from ultralytics import YOLO
import cv2
import os

# Load model
model = YOLO(r"D:\Pest Detection project\best.pt")

# Input image
source = r"D:\Pest Detection project\test2.png"

# Run prediction
results = model.predict(
    source=source,
    save=True,
    conf=0.4
)

# Get the directory where results were saved
save_dir = results[0].save_dir  # this is a Path object (folder path)

# Get filename from the original image path
filename = os.path.basename(results[0].path)  

# Build full output path
output_path = os.path.join(save_dir, filename)

# Read and display the saved image
img = cv2.imread(str(output_path))
cv2.imshow("Detection Result", img)
cv2.waitKey(0)
cv2.destroyAllWindows()

print(f"\n✅ Detection complete! Check saved result at: {output_path}")
