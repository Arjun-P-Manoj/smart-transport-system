import pickle

with open("encodings.pkl", "rb") as f:
    data = pickle.load(f)

print("Total encodings:", len(data["encodings"]))
print("Names list:", data["names"])
