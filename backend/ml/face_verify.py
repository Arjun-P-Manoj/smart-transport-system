import cv2
import face_recognition
import pickle
import time
import numpy as np
import psycopg2
import sys

# ---------------- DB LOAD ----------------
conn = psycopg2.connect(
    dbname="smart_transport",
    user="arjunpmanoj",
    host="localhost"
)

cur = conn.cursor()

cur.execute("""
    SELECT users.name, face_database.embedding
    FROM face_database
    JOIN users ON users.user_id = face_database.user_id
""")

rows = cur.fetchall()

known_names = []
known_encodings = []

for name, embedding_blob in rows:
    known_names.append(name)
    known_encodings.append(np.array(embedding_blob))


cur.close()
conn.close()

# ✅ SAFETY CHECK
if len(known_encodings) == 0:
    print("[ERROR] No face data in database")
    sys.exit(1)

known_encodings = np.array(known_encodings)

# ---------------- CONFIG ----------------
TIME_LIMIT = 5
DISTANCE_THRESHOLD = 0.65   # ✅ FIXED
FRAME_SKIP = 5
# ---------------------------------------

print("[INFO] Starting face verification (finite time)...")

cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)

start_time = time.time()
authenticated = False
matched_name = None
frame_count = 0

while time.time() - start_time < TIME_LIMIT:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % FRAME_SKIP != 0:
        continue

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    small_frame = cv2.resize(rgb_frame, (0, 0), fx=0.25, fy=0.25)

    boxes = face_recognition.face_locations(small_frame)
    encodings = face_recognition.face_encodings(small_frame, boxes)

    # Ensure exactly ONE face
    if len(encodings) != 1:
        cv2.putText(
            frame,
            "Ensure only ONE face",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            2
        )
        cv2.imshow("Face Login", frame)
        cv2.waitKey(1)
        continue

    face_encoding = encodings[0]

    distances = face_recognition.face_distance(known_encodings, face_encoding)
    best_match_index = np.argmin(distances)
    min_distance = distances[best_match_index]

    if min_distance < DISTANCE_THRESHOLD:
        matched_name = known_names[best_match_index]
        authenticated = True
        break
    else:
        cv2.putText(
            frame,
            "Face not recognized",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            2
        )

    cv2.imshow("Face Login", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# ---------------- RESULT ----------------
if authenticated:
    print(f"[ACCESS GRANTED] Welcome {matched_name}")
else:
    print("[ACCESS DENIED] Verification failed or timed out")
