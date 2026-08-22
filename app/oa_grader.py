"""Tab 1 - OA Grader: pretrained Xception KL grading + Grad-CAM explainability."""
from pathlib import Path

import matplotlib
import numpy as np
import plotly.graph_objects as go
import streamlit as st
import tensorflow as tf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "model_Xception_ft.hdf5"
DATA_ROOT = ROOT / "data" / "knee-osteoarthritis-severity"

CLASS_NAMES = ["Healthy", "Doubtful", "Minimal", "Moderate", "Severe"]
GRADE_DESC = {
    "Healthy": "KL 0 - Normal joint, no radiographic OA features.",
    "Doubtful": "KL 1 - Doubtful narrowing, possible osteophytic lipping.",
    "Minimal": "KL 2 - Definite osteophytes, possible joint space narrowing.",
    "Moderate": "KL 3 - Multiple osteophytes, definite narrowing, sclerosis.",
    "Severe": "KL 4 - Large osteophytes, marked narrowing, severe sclerosis, definite deformity.",
}


@st.cache_resource(show_spinner="Loading Xception model (~10s, once)...")
def load_model():
    return tf.keras.models.load_model(str(MODEL_PATH))


def preprocess(pil_img):
    img = pil_img.convert("RGB").resize((224, 224))
    arr = tf.keras.preprocessing.image.img_to_array(img)
    arr = np.expand_dims(arr, axis=0).astype(np.float32)
    return arr, tf.keras.applications.xception.preprocess_input(arr.copy())


def make_gradcam_heatmap(model, img_array):
    gap_layer = next(
        (l for l in reversed(model.layers) if isinstance(l, tf.keras.layers.GlobalAveragePooling2D)),
        None,
    )
    if gap_layer is None:
        return None
    grad_model = tf.keras.models.Model(
        model.inputs, [model.get_layer(gap_layer.name).input, model.output]
    )
    with tf.GradientTape() as tape:
        conv_out, preds = grad_model(img_array)
        pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]
    grads = tape.gradient(class_channel, conv_out)
    pooled = tf.reduce_mean(grads, axis=(0, 1, 2))
    heat = conv_out[0] @ tf.expand_dims(pooled, -1)
    heat = tf.squeeze(heat)
    heat = tf.maximum(heat, 0) / (tf.math.reduce_max(heat) + 1e-8)
    return heat.numpy()


def gradcam_overlay(base_img, heatmap, alpha=0.45):
    hm = Image.fromarray(np.uint8(255 * heatmap)).resize((224, 224))
    jet = matplotlib.colormaps["jet"]
    colored = jet(np.asarray(hm))[:, :, :3] * 255.0
    base = np.asarray(base_img.convert("RGB").resize((224, 224)), dtype=np.float32)
    blended = np.clip(colored * alpha + base * (1 - alpha), 0, 255).astype(np.uint8)
    return Image.fromarray(blended)


def confidence_bars(probs):
    fig = go.Figure(go.Bar(
        x=[float(p) for p in probs], y=CLASS_NAMES, orientation="h",
        marker_color=["#0d6efd" if i == int(np.argmax(probs)) else "#adb5bd" for i in range(5)],
        text=[f"{p:.1f}%" for p in probs], textposition="outside",
    ))
    fig.update_layout(height=260, margin=dict(l=0, r=30, t=10, b=10),
                      xaxis_title="Confidence (%)", xaxis_range=[0, 115])
    return fig


def sample_images():
    out = {}
    if DATA_ROOT.exists():
        for gdir in sorted(DATA_ROOT.glob("test/*")):
            imgs = list(gdir.glob("*.png"))
            if imgs:
                out[int(gdir.name)] = imgs[0]
    return out


def render():
    st.subheader("🦴 OA Severity Grading - Pretrained Deep Learning")
    st.caption(
        "Fine-tuned Xception CNN (mafda/knee_OA_dl_app, trained on this dataset family) classifies "
        "knee X-rays into Kellgren-Lawrence grades 0-4. Runs fully on CPU in <1s."
    )

    model = load_model()
    c_up, c_sample = st.columns([3, 2])
    uploaded = c_up.file_uploader("Upload knee X-ray", type=["png", "jpg", "jpeg"])

    picked = None
    samples = sample_images()
    if samples:
        opts = {f"Grade {g} sample ({p.name})": p for g, p in sorted(samples.items())}
        sel = c_sample.selectbox("...or try a built-in test sample", ["-"] + list(opts.keys()))
        if sel != "-":
            picked = opts[sel]

    src = uploaded or picked
    if src is None:
        st.info("Upload an X-ray or pick a built-in sample to run inference.")
        return

    pil = Image.open(str(src)) if isinstance(src, (str, Path)) else Image.open(src)

    left, right = st.columns(2)
    with left:
        st.markdown("**Input**")
        st.image(pil, use_container_width=True)

    raw, batch = preprocess(pil)
    with st.spinner("Running inference..."):
        probs = model.predict(batch, verbose=0)[0] * 100.0

    top = int(np.argmax(probs))
    with right:
        st.markdown("**Prediction**")
        st.metric("Severity Grade", f"KL {top} - {CLASS_NAMES[top]}", f"{probs[top]:.1f}% confidence")
        st.caption(GRADE_DESC[CLASS_NAMES[top]])
        st.plotly_chart(confidence_bars(probs), use_container_width=True)

    with st.expander("🔍 Explainability - where does the model look? (Grad-CAM)", expanded=True):
        heat = make_gradcam_heatmap(model, batch)
        if heat is not None:
            ov = gradcam_overlay(Image.fromarray(raw[0].astype(np.uint8)), heat)
            gc1, gc2 = st.columns(2)
            gc1.image(ov, caption="Grad-CAM overlay", use_container_width=True)
            gc2.markdown(
                "- Warm regions = pixels driving the decision.\n"
                "- Healthy/Doubtful focus near the joint centre; Moderate/Severe light up the "
                "marginal edges (osteophytes).\n"
                "- Gives clinicians a sanity check instead of a black box."
            )
        else:
            st.warning("GAP layer not found in model - Grad-CAM unavailable.")
