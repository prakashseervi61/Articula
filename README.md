# 🦴 Nexora Knee AI

AI-assisted **medial meniscus assessment** and **patient-specific knee implant sizing** workspace — a 6-hour hackathon prototype built on pretrained models only (no GPU training).

> ⚠️ Decision-support prototype. Not a medical device. Final decisions rest with clinicians.

## Quickstart

```bash
# Python 3.11 venv at .venv
uv pip install -p .venv -r requirements.txt

.venv/Scripts/python.exe -m streamlit run app/main.py --server.headless true --server.port 8501
```

Open http://localhost:8501.

## The 4 tabs → Problem-statement mapping

| Tab | PS requirement | How it works |
|---|---|---|
| 🦴 **OA Grader** | OA severity analysis from X-ray | Fine-tuned **Xception** (mafda/knee_OA_dl_app) classifies Kellgren–Lawrence grades 0–4 on CPU (<1 s), with confidence bars + **Grad-CAM** explainability |
| 🧲 **MRI Explorer** | Meniscus thickness / localized measurement | Slice browser over 32×320×320 knee MRI volumes with annotated ROI boxes, ACL-status badges, and a **joint-space-width proxy** measured inside the clinician ROI |
| 🔧 **Implant Sizer** | Patient-specific implant sizing | Nearest-fit ranking of patient femoral/tibial M/L & A/P dimensions against **real published Zimmer NexGen** component charts (femoral A–H, tibial 1–10) with overhang/under-covering warnings |
| 📊 **Analytics** | Cohort correlation story | KL-grade distribution across 9,786 X-rays + ACL status across 917 MRI exams — all computed live from local data |

## Architecture

```
X-ray ──► Xception (224×224, xception.preprocess_input) ──► KL grade 0-4 ──► Grad-CAM overlay
MRI  ──► volume viewer (ROI boxes, ACL labels) ──► JSW proxy (px × mm/voxel)
Patient dims ──► Euclidean nearest-match vs NexGen charts ──► ranked sizes + fit notes
```

## Data & model (local)

- `models/model_Xception_ft.hdf5` — pretrained weights (251 MB), verified: true-KL samples graded correctly.
- `data/knee-osteoarthritis-severity/{train,val,test,auto_test}/{0..4}/*.png` — 9,786 KL-graded X-rays.
- `data/vol01..vol08/*.pck` + `data/metadata.csv` — knee MRI volumes with ROI boxes + `aclDiagnosis` labels.

## Verification

```bash
.venv/Scripts/python.exe scripts/smoke_test.py   # loads model, grades one known sample
```

Browser-verified end-to-end: Grade-4 sample → "KL 4 – Severe @ 98%", Grad-CAM renders; MRI case card + JSW proxy OK; sizer returns Δ0 mm exact matches; analytics charts populate from disk.

## Honest scope & roadmap

- Meniscus **thickness** here is an ROI-based joint-space-width proxy demo; true cartilage thickness needs segmentation (nnU-Net/TotalSegmentator) — next step on GPU.
- Implant inputs are clinician-entered sliders; production flow derives them automatically from bone segmentation.
- Balanced accuracy ~71% (pretrained model, held-out data) — fine-tuning head layers on more data is the accuracy path.

## Submission doc

`PS_Solution_Nexora_Knee_AI.pdf` — requirement→implementation map, architecture, timeline, risks, judge demo script.
