import cv2
import face_recognition
import numpy as np
import sys
import pickle
import time

# ---------------- CONFIG ----------------
MAX_SAMPLES = 5          # number of face samples
TIME_LIMIT = 6           # seconds (prevents infinite loop)
# ---------------------------------------

cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)

encodings = []
count = 0
start_time = time.time()

# ✅ LOGS → STDERR (important for subprocess)
print("[INFO] Capturing face for registration...", file=sys.stderr)

while count < MAX_SAMPLES and (time.time() - start_time) < TIME_LIMIT:
    ret, frame = cap.read()
    if not ret:
        continue

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb)
    faces = face_recognition.face_encodings(rgb, boxes)

    # Accept ONLY one face
    if len(faces) == 1:
        encodings.append(faces[0])
        count += 1
        print(f"[INFO] Sample {count}/{MAX_SAMPLES}", file=sys.stderr)

    # Show progress to user
    cv2.putText(
        frame,
        f"Samples: {count}/{MAX_SAMPLES}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.imshow("Face Registration", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

# ❌ No face captured within time
if len(encodings) == 0:
    sys.stdout.buffer.write(pickle.dumps(None))
    sys.exit(0)

# ✅ Average encoding for stability
final_encoding = np.mean(encodings, axis=0)

# ✅ ONLY binary data on stdout (VERY IMPORTANT)
sys.stdout.buffer.write(pickle.dumps(final_encoding))
