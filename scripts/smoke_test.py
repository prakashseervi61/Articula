"""Smoke test: load pretrained Xception model and predict one sample image."""
from pathlib import Path

import numpy as np
import tensorflow as tf

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "model_Xception_ft.hdf5"
DATA_ROOT = ROOT / "data" / "knee-osteoarthritis-severity"

CLASS_NAMES = ["Healthy", "Doubtful", "Minimal", "Moderate", "Severe"]


def find_sample():
    for grade_dir in sorted(DATA_ROOT.glob("test/*")):
        images = list(grade_dir.glob("*.png"))
        if images:
            return images[0], grade_dir.name
    raise FileNotFoundError("No sample image found under data/")


def main():
    print(f"[1] Loading model: {MODEL_PATH}")
    model = tf.keras.models.load_model(str(MODEL_PATH))
    print(f"    OK  input_shape={model.input_shape} outputs={model.output_shape}")

    sample_path, true_grade = find_sample()
    print(f"[2] Sample: {sample_path} (true KL={true_grade})")

    img = tf.keras.preprocessing.image.load_img(str(sample_path), target_size=(224, 224))
    arr = tf.keras.preprocessing.image.img_to_array(img)
    arr = np.expand_dims(arr, axis=0).astype(np.float32)
    arr = tf.keras.applications.xception.preprocess_input(arr)

    print("[3] Predicting...")
    probs = model.predict(arr, verbose=0)[0] * 100
    top = int(np.argmax(probs))
    for name, p in zip(CLASS_NAMES, probs):
        print(f"    {name:<10} {p:5.1f}%")
    print(f"[4] RESULT: {CLASS_NAMES[top]} ({probs[top]:.1f}%) | expected grade {true_grade}")


if __name__ == "__main__":
    main()
