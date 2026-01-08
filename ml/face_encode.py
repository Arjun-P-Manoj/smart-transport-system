import cv2
import face_recognition
import numpy as np
import sys
import pickle

MAX_SAMPLES = 5

cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)

encodings = []
count = 0

# ✅ LOGS → STDERR
print("[INFO] Capturing face for registration...", file=sys.stderr)

while count < MAX_SAMPLES:
    ret, frame = cap.read()
    if not ret:
        continue

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb)
    faces = face_recognition.face_encodings(rgb, boxes)

    if len(faces) == 1:
        encodings.append(faces[0])
        count += 1
        print(f"[INFO] Sample {count}/{MAX_SAMPLES}", file=sys.stderr)

    cv2.imshow("Face Registration", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

# ❌ No face captured → send None
if len(encodings) == 0:
    sys.stdout.buffer.write(pickle.dumps(None))
    sys.exit(0)

# ✅ Average encoding for stability
final_encoding = np.mean(encodings, axis=0)

# ✅ ONLY binary data on stdout
sys.stdout.buffer.write(pickle.dumps(final_encoding))
