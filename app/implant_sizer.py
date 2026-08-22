"""Tab 3 - Implant Sizer: rule-based matching against real NexGen dimensions."""
import json
from pathlib import Path

import pandas as pd
import streamlit as st

SIZES_JSON = Path(__file__).resolve().parent / "implant_sizes.json"


@st.cache_data
def load_charts():
    with open(SIZES_JSON) as f:
        return json.load(f)


def rank(df, ap_col, ml_col, ap_in, ml_in):
    d = df.copy()
    d["dist_mm"] = ((d[ap_col] - ap_in) ** 2 + (d[ml_col] - ml_in) ** 2) ** 0.5
    return d.sort_values("dist_mm").reset_index(drop=True)


def fit_note(comp_ml, bone_ml, tol=2.0):
    if comp_ml > bone_ml + tol:
        return "⚠️ Overhang risk: component wider than bone"
    if comp_ml < bone_ml - tol:
        return "ℹ️ Under-covering: consider next size up"
    return "✅ Good M/L fit"


def render():
    st.subheader("🔧 Patient-Specific Implant Sizing Engine")
    st.caption(
        "Module 2: patient femoral/tibial M/L and A/P dimensions are matched against REAL published "
        "Zimmer NexGen component dimensions (CR/CRA femoral A-H, pegged & stemmed tibial 1-10) "
        "using nearest-fit ranking. In production these measurements come automatically from "
        "bone segmentation; here they are clinician-entered for the prototype."
    )

    charts = load_charts()
    fem = pd.DataFrame(charts["femoral_cr_cra_standard"])
    tib = pd.DataFrame(charts["tibial_pegged_stemmed"])

    st.markdown("#### Patient anatomy (mm)")
    fa, fm, ta, tm = st.columns(4)
    fem_ap = fa.slider("Femoral A/P", 45.0, 90.0, 63.0, 0.5)
    fem_ml = fm.slider("Femoral M/L", 38.0, 80.0, 53.5, 0.5)
    tib_ml = ta.slider("Tibial M/L", 52.0, 95.0, 66.0, 0.5)
    tib_ap = tm.slider("Tibial A/P", 36.0, 60.0, 46.0, 0.5)

    fr = rank(fem, "ap", "ml", fem_ap, fem_ml)
    tr = rank(tib, "ap", "ml", tib_ap, tib_ml)

    st.markdown("#### Recommended components")
    c1, c2 = st.columns(2)

    with c1:
        st.markdown("**Femoral component (NexGen CR/CRA)**")
        best_f = fr.iloc[0]
        st.success(f"Size **{best_f['size']}**  ·  A/P {best_f['ap']}mm  ·  M/L {best_f['ml']}mm  ·  Δ {best_f['dist_mm']:.1f}mm")
        st.caption(fit_note(best_f["ml"], fem_ml))
        with st.expander("All femoral sizes (ranked)"):
            st.dataframe(fr.rename(columns={"dist_mm": "Δ mm"}), use_container_width=True, hide_index=True)

    with c2:
        st.markdown("**Tibial component (pegged/stemmed articular surface)**")
        best_t = tr.iloc[0]
        st.success(f"Size **{best_t['size']}**  ·  M/L {best_t['ml']}mm  ·  A/P {best_t['ap']}mm  ·  Δ {best_t['dist_mm']:.1f}mm")
        st.caption(fit_note(best_t["ml"], tib_ml))
        with st.expander("All tibial sizes (ranked)"):
            st.dataframe(tr.rename(columns={"dist_mm": "Δ mm"}), use_container_width=True, hide_index=True)

    with st.expander("📐 Full sizing database"):
        a, b = st.columns(2)
        a.markdown("**Femoral A-H**")
        a.dataframe(fem, hide_index=True, use_container_width=True)
        b.markdown("**Tibial 1-10**")
        b.dataframe(tib, hide_index=True, use_container_width=True)
        st.caption(charts["source"] + " · dimensions in mm")

    st.info(
        "Decision-support only: final selection remains with the surgeon (soft-tissue balance, "
        "flexion-extension gaps and rotation govern the intra-operative choice).",
        icon="⚕️",
    )
