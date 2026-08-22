"""Nexora Knee AI - Streamlit entry point."""
from pathlib import Path

import streamlit as st

import implant_sizer
import mri_viewer
import oa_grader
import stats_panel

st.set_page_config(page_title="Nexora Knee AI", page_icon="🦴", layout="wide")

with st.sidebar:
    st.title("🦴 Nexora Knee AI")
    st.caption("AI-assisted medial meniscus assessment & patient-specific knee implant sizing")
    st.divider()
    st.markdown(
        "**Modules**\n"
        "- OA grading (pretrained CNN)\n"
        "- MRI exploration + thickness proxy\n"
        "- Implant sizing engine\n"
        "- Cohort analytics"
    )
    st.divider()
    st.warning("Decision-support prototype. Not a medical device. "
               "Final decisions rest with clinicians.", icon="⚠️")
    st.caption(f"Workspace: {Path(__file__).resolve().parent.parent}")

st.title("Nexora Knee AI 🦴")
st.markdown(
    "One workspace for the problem statement: assess knee osteoarthritis from X-ray with deep learning, "
    "explore MRI volumes with localized measurements, and recommend implant sizes from real "
    "manufacturer dimension charts."
)

tab1, tab2, tab3, tab4 = st.tabs(
    ["🦴 OA Grader", "🧲 MRI Explorer", "🔧 Implant Sizer", "📊 Analytics"]
)

with tab1:
    oa_grader.render()
with tab2:
    mri_viewer.render()
with tab3:
    implant_sizer.render()
with tab4:
    stats_panel.render()
