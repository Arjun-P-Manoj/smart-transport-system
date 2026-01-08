import cv2

print("🔍 Trying to open camera...")

cap = None

# Try common camera indexes (MacBooks often use 1)
for index in [0, 1, 2]:
    temp_cap = cv2.VideoCapture(index)
    if temp_cap.isOpened():
        cap = temp_cap
        print(f"✅ Camera opened on index {index}")
        break
    temp_cap.release()

if cap is None:
    print("❌ No camera found. Check macOS permissions.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame")
        break

    cv2.imshow("Camera Test (press q to quit)", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("👋 Camera closed")
