import subprocess
import sys
import os
import pickle

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.abspath(os.path.join(BASE_DIR, "../ml"))

def capture_face():
    result = subprocess.run(
        [sys.executable, "face_encode.py"],
        cwd=ML_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    if result.returncode != 0 or not result.stdout:
        return None
    return pickle.loads(result.stdout)

def verify_face():
    result = subprocess.run(
        [sys.executable, "face_verify.py"],
        cwd=ML_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    return result.stdout
