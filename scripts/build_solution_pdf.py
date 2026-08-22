"""Builds PS_Solution_Nexora_Knee_AI.pdf - the hackathon submission document."""
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "PS_Solution_Nexora_Knee_AI.pdf"

ACCENT = (13, 110, 253)      # blue
DARK = (33, 37, 41)
GRAY = (108, 117, 125)
LIGHT = (248, 249, 250)


def clean(s):
    return str(s).encode("latin-1", "replace").decode("latin-1")


class Doc(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(*GRAY)
            self.cell(0, 6, "Nexora Knee AI - PS Solution & Workflow", align="L")
            self.cell(0, 6, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
            self.ln(2)

    def footer(self):
        self.set_y(-14)
        self.set_draw_color(200, 200, 200)
        self.line(12, self.get_y(), 198, self.get_y())
        self.set_font("helvetica", "I", 7.5)
        self.set_text_color(*GRAY)
        self.multi_cell(0, 4,
            "Decision-support prototype - NOT a clinical device. Demo data: public datasets "
            "(Kaggle kneeOA severity; kneeMRI/MRNet). Model: mafda/knee_OA_dl_app (Xception ft, "
            "balanced acc ~71%). Implant dims: Zimmer NexGen published profiler.", align="C")


def H1(pdf, t):
    pdf.ln(2); pdf.set_font("helvetica", "B", 15); pdf.set_text_color(*ACCENT)
    pdf.cell(0, 8, clean(t), new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(*ACCENT); pdf.set_line_width(0.5)
    pdf.line(12, pdf.get_y(), 60, pdf.get_y()); pdf.ln(3)


def H2(pdf, t):
    pdf.ln(1.5); pdf.set_font("helvetica", "B", 11.5); pdf.set_text_color(*DARK)
    pdf.cell(0, 6, clean(t), new_x="LMARGIN", new_y="NEXT"); pdf.ln(1)


def P(pdf, t, bold=False):
    pdf.set_font("helvetica", "B" if bold else "", 10); pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 5, clean(t)); pdf.ln(0.5)


def BULLETS(pdf, items):
    pdf.set_font("helvetica", "", 10); pdf.set_text_color(*DARK)
    for it in items:
        pdf.set_x(16); pdf.multi_cell(178, 5, "- " + clean(it)); pdf.ln(0.3)
    pdf.ln(0.5)


def TABLE(pdf, headers, rows, widths):
    pdf.set_font("helvetica", "B", 8.5); pdf.set_fill_color(*ACCENT); pdf.set_text_color(255, 255, 255)
    for h, w in zip(headers, widths):
        pdf.cell(w, 6, clean(h), border=1, fill=True, align="C")
    pdf.ln()
    pdf.set_font("helvetica", "", 8.5); pdf.set_text_color(*DARK)
    fill = False
    for row in rows:
        if fill: pdf.set_fill_color(*LIGHT)
        hmax = 6
        for cellv, w in zip(row, widths):
            hmax = max(hmax, pdf.get_string_width(clean(cellv)) / (w - 3) * 4.2 + 3.5)
        y0 = pdf.get_y(); x0 = pdf.get_x(); hmax = min(hmax, 24)
        for i, (cellv, w) in enumerate(zip(row, widths)):
            pdf.set_xy(x0 + sum(widths[:i]), y0)
            pdf.multi_cell(w, hmax / 1.0, clean(cellv), border=1, fill=fill)
        pdf.set_xy(x0, y0 + hmax)
        fill = not fill
    pdf.ln(2)


def CODE(pdf, t):
    pdf.set_font("courier", "", 8.5); pdf.set_fill_color(245, 245, 245); pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 4.4, clean(t), fill=True); pdf.ln(1.5)


pdf = Doc("P", "mm", "A4")
pdf.set_auto_page_break(True, margin=20)
pdf.set_margins(12, 12, 12)
pdf.add_page()

# ---------------- COVER ----------------
pdf.ln(30)
pdf.set_font("helvetica", "B", 26); pdf.set_text_color(*ACCENT)
pdf.cell(0, 12, "Nexora Knee AI", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", "", 13); pdf.set_text_color(*DARK)
pdf.cell(0, 8, "AI-Assisted Medial Meniscus Assessment & Patient-Specific", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 8, "Knee Implant Sizing - PS Solution Document", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(6)
pdf.set_font("helvetica", "", 10.5); pdf.set_text_color(*GRAY)
for line in ["6-Hour Hackathon Prototype | CPU-only | Pretrained Deep Learning + Rule-Based Geometry",
             "Stack: Python 3.11 - TensorFlow-CPU 2.15 - Streamlit - Plotly",
             "Status: environment ready, pretrained model downloaded, inference verified on real data"]:
    pdf.cell(0, 6, line, align="C", new_x="LMARGIN", new_y="NEXT")

# ---------------- 1. PROBLEM STATEMENT ----------------
pdf.add_page()
H1(pdf, "1. Problem Statement Summary")
P(pdf, "Build an intelligent imaging system with two modules plus a visualization interface:")
BULLETS(pdf, [
    "Module 1 - Meniscus Assessment: segment femur, tibia and medial meniscus; measure meniscus "
    "thickness (mm) at predefined locations; correlate findings with osteoarthritis (OA) status, age and sex.",
    "Module 2 - Implant Sizing: segment femur and tibia; extract mediolateral (ML) and anteroposterior (AP) "
    "dimensions; match against an implant sizing database; recommend patient-specific component sizes.",
    "Visualization UI: interactive overlays of anatomy, measurements and recommendations.",
    "Positioning: decision-SUPPORT tool assisting clinicians - never autonomous diagnosis."])

H2(pdf, "1.1 Key Technical Reality Check")
BULLETS(pdf, [
    "Meniscus is NOT visible on plain X-ray -> Module 1 requires MRI; OA KL-grading uses X-ray.",
    "Training segmentation networks needs GPU-days -> infeasible in-hackathon; solved via pretrained models + rule-based geometry (Option A).",
    "Public knee X-ray datasets carry KL grades but no masks -> thickness is demonstrated as a calibrated joint-space proxy on MRI ROIs."])

# ---------------- 2. SOLUTION OVERVIEW ----------------
H1(pdf, "2. Proposed Solution - Nexora Knee AI")
P(pdf, "A four-tab Streamlit decision-support application that runs entirely on CPU:")
BULLETS(pdf, [
    "Tab 1 OA GRADER (real deep learning): fine-tuned Xception CNN grades uploaded knee X-rays into KL "
    "grades 0-4 (Healthy..Severe) with confidence bars and Grad-CAM explainability heatmap.",
    "Tab 2 MRI EXPLORER (proxy thickness demo): loads 3D knee MRI volumes (.pck), slice navigation, "
    "ROI overlay from dataset metadata, ACL-status badges, and pixel->mm joint-space width measurement "
    "as the stand-in for meniscus thickness assessment workflow.",
    "Tab 3 IMPLANT SIZER (rule-based engine): takes femoral/tibial ML+AP dimensions (manually entered or "
    "estimated) and matches them against REAL published Zimmer NexGen component dimensions (femoral A-H, "
    "tibial 1-10) using nearest-fit ranking with overhang warnings.",
    "Tab 4 DATA ANALYTICS: dataset composition, KL grade distributions, ACL-label balance - demonstrates "
    "the population-level correlation capability of Module 1."])
CODE(pdf, """X-ray upload ──> Xception-ft (224x224x3) ──> KL grade 0-4 + probs + Grad-CAM
MRI volume  ──> slice nav + ROI overlay (metadata) ──> JSW proxy (px->mm)
Dimensions  ──> nearest-match vs NexGen chart (fem A-H / tib 1-10) ──> ranked sizes""")

# ---------------- 3. REQUIREMENT MAP ----------------
H1(pdf, "3. PS Requirement -> Implementation Map")
TABLE(pdf,
      ["PS Requirement", "Implementation", "Maturity"],
      [["Segment femur / tibia / meniscus", "Metadata-driven ROI localization on MRI volumes; documented path to U-Net (roadmap)", "Proxy"],
       ["Meniscus thickness (mm)", "Calibrated joint-space width measurement on MRI slices (px -> mm)", "Proxy demo"],
       ["Correlate with OA status", "Pretrained Xception KL-grading (real inference) + cohort analytics", "Real AI"],
       ["Femoral/tibial ML & AP dims", "Measurement inputs + ROI-derived estimates", "Working"],
       ["Implant sizing database", "Real Zimmer NexGen published dimensions (fem A-H, tib 1-10)", "Real data"],
       ["Size recommendation", "Euclidean nearest-match ranking + overhang warning", "Working"],
       ["Visualization UI", "Streamlit overlays: heatmaps, ROI boxes, ranked tables, charts", "Working"]],
      [62, 106, 26])

# ---------------- 4. ARCHITECTURE ----------------
H1(pdf, "4. Repository Architecture")
CODE(pdf, """D:/Nexora-26/
|-- medtech_ps.pdf                 problem statement (input)
|-- requirements.txt               pinned deps (Python 3.11 venv at .venv/)
|-- PS_Solution_Nexora_Knee_AI.pdf this document
|-- models/model_Xception_ft.hdf5  pretrained weights (251MB, verified loading)
|-- data/
|   |-- knee-osteoarthritis-severity/  9,786 X-rays, KL 0-4, train/val/test
|   |-- vol01..vol08/*.pck         917 knee MRI volumes (32x320x320 uint16)
|   `-- metadata.csv               examId, aclDiagnosis(0/1/2), ROI x/y/z/w/h/d
|-- projects/knee_OA_dl_app/       reference repo (mafda, cloned)
|-- app/
|   |-- main.py                    Streamlit entry, sidebar + tabs
|   |-- oa_grader.py               Tab1: inference + Grad-CAM
|   |-- mri_viewer.py              Tab2: volume viewer + ROI + JSW proxy
|   |-- implant_sizer.py           Tab3: sizing engine
|   |-- stats_panel.py             Tab4: analytics
|   `-- implant_sizes.json         NexGen dimension tables
`-- scripts/smoke_test.py          verified: Healthy 60% on true KL=0 sample""")

# ---------------- 5. TIMELINE ----------------
H1(pdf, "5. Six-Hour Execution Timeline (riskiest-first)")
TABLE(pdf,
      ["Time", "Phase", "Deliverable / Exit criteria"],
      [["H0-1", "Setup + risk kill", "[DONE] venv py3.11, TF-CPU 2.15, deps; [DONE] model downloaded; [DONE] smoke test: KL=0 image -> 'Healthy 60%'"],
       ["H1-2.5", "Tab 1 OA Grader", "Upload -> grade card + confidence bars + Grad-CAM; sample-image picker"],
       ["H2.5-4", "Tab 2 MRI Explorer", "Volume dropdown, slice slider, ROI rectangle, ACL badge, JSW mm readout"],
       ["H4-5", "Tab 3 Implant Sizer", "Sliders -> ranked NexGen matches + overhang flag; JSON size tables"],
       ["H5-5.5", "Tab 4 + polish", "KL/ACL distribution plots; branding; README"],
       ["H5.5-6", "Dry run + buffer", "Full judge walkthrough rehearsed; fallbacks armed"]],
      [18, 42, 134])

# ---------------- 6. RISKS ----------------
H1(pdf, "6. Risk Register & Fallbacks")
TABLE(pdf,
      ["Risk", "Mitigation / Fallback"],
      [["TF cannot load legacy HDF5", "[Killed] TF 2.15 + keras 2.15 pinned; load verified"],
       ["Model download blocked", "[Killed] gdown succeeded (251MB @ ~5MB/s)"],
       ["Python 3.14 has no TF wheels", "[Killed] uv-managed Python 3.11.15 venv"],
       ["Grad-CAM layer name mismatch", "Resolve layer by type (last GlobalAveragePooling2D input)"],
       ["Live inference fails during demo", "Switch Tab1 to precomputed-results mode (screenshots cached)"],
       ["matplotlib colormap API change", "Use matplotlib.colormaps['jet'] instead of cm.get_cmap"]],
      [70, 124])

# ---------------- 7. DEMO SCRIPT ----------------
H1(pdf, "7. Five-Minute Judge Demo Script")
BULLETS(pdf, [
    "(0:00) Frame the pain point: meniscal wear assessment and implant sizing today rely on visual inspection "
    "and templating - slow, subjective, experience-dependent.",
    "(0:45) Tab 1 LIVE: upload two contrasting X-rays (grade 0 vs grade 4 from test set) - instant KL grade + confidence + Grad-CAM showing WHERE the model looks (center vs joint edges).",
    "(2:00) Tab 2: browse a real 3D MRI volume, show ROI box, read out joint-space width in mm; mention metadata carries ACL status enabling population correlation.",
    "(3:00) Tab 3: slide femoral AP/ML dims -> live ranked implant recommendation with overhang warning - 'this is the Module-2 decision-support story'.",
    "(4:00) Tab 4 analytics + honest scope slide: what is real AI today, what is proxy, and the GPU-enabled roadmap (nnU-Net on OAI-ZIB/SKM-TEA for true meniscus segmentation).",
    "(4:40) Close: 'clinician stays in command - we compress minutes of manual assessment to seconds.'"])

# ---------------- 8. ROADMAP ----------------
H1(pdf, "8. Post-Hackathon Roadmap (GPU-enabled)")
BULLETS(pdf, [
    "Train nnU-Net on OAI-ZIB (507 knee MRIs with bone/cartilage/meniscus masks) for true segmentation.",
    "Replace JSW proxy with genuine meniscus thickness maps at predefined zones (distance-transform on mask).",
    "Statistical correlation module: thickness vs KL grade / age / sex across cohorts.",
    "Auto-extract femoral/tibial ML+AP from segmentation instead of manual input; DICOM/PACS ingestion.",
    "Vendor-neutral sizing: extend implant DB beyond NexGen (Persona, Attune published charts)."])

pdf.output(str(OUT))
print(f"OK wrote {OUT} ({OUT.stat().st_size/1024:.0f} KB)")
