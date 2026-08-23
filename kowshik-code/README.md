# ARTICULA — AI-Assisted Orthopedic Knee Intelligence Platform

[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![AI Model](https://img.shields.io/badge/AI_Model-Fine--tuned_Xception_CNN-FF6F00.svg?style=for-the-badge&logo=tensorflow)](https://tensorflow.org/)

> **ARTICULA** is an AI-assisted clinical decision support system designed for orthopedic surgeons and radiologists. It unifies **Kellgren-Lawrence (KL) radiograph severity grading**, **Grad-CAM model explainability heatmaps**, **3D sagittal MRI joint-space width (JSW) measurements**, and **patient-specific Total Knee Arthroplasty (TKA) implant sizing** into one seamless clinical workflow.

---

## 🌟 Core Features & Clinical Modules

### 1. 🎯 Knee Radiograph KL Severity Grading
* **Deep Learning Architecture**: Powered by a fine-tuned **Xception CNN** trained on **9,786 clinical knee radiographs** (`data/knee-osteoarthritis-severity`).
* **Classification Output**: Grades Kellgren-Lawrence severity across 5 categories: `KL 0 - Healthy`, `KL 1 - Doubtful`, `KL 2 - Minimal`, `KL 3 - Moderate`, and `KL 4 - Severe`.
* **Visual Confidence Distribution**: Displays green confidence pill badges (`↑ 76% confidence`) and horizontal **Recharts vertical bar charts** highlighting the top predicted class.

### 2. 🔍 Transparent Grad-CAM Model Explainability
* **Sanity Check for Clinicians**: Eliminates black-box AI by rendering 800×800 Lanczos-smoothed **Grad-CAM activation heatmaps**.
* **Anatomical Validation**: Warm red regions highlight exact pixel drivers—focusing near the joint center for healthy/doubtful cases and illuminating marginal osteophyte lipping for moderate/severe cases.

### 3. 🧲 Sagittal Knee MRI Explorer & JSW Proxy
* **3D Volume Dataset**: Indexes 917 3D sagittal knee MRI exams (`.pck` files, $32 \times 320 \times 320$) from `data/` and `metadata.csv`.
* **Interactive Navigation**: Slice depth stack slider ($0\text{--}31$) and adjustable voxel spatial spacing ($0.20\text{--}1.50 \text{ mm/voxel}$).
* **Calibrated Measurement**: Calculates the exact joint-space width in millimeters ($\text{Gap}_{\text{mm}} = \text{Gap}_{\text{px}} \times \text{Spacing}$) with a red condyle ROI bounding box and green gap overlay line.

### 4. ⚙️ Patient-Specific TKA Implant Sizing Engine
* **Clinical Component Catalog**: Matches patient Femoral and Tibial A/P & M/L dimensions against published **Zimmer NexGen** Total Knee Arthroplasty specifications.
* **Fit Recommendation**: Uses Euclidean distance ranking to suggest optimal component sizes (Femoral A–H, Tibial 1–10) while flagging Medial/Lateral (M/L) overhang risks.

### 5. 📄 Structured Clinical Report Generator
* **Export Ready**: Generates a standardized clinical report (Form Section 13) summarizing patient demographics, KL severity grade, meniscus thickness, implant sizing recommendations, and clinician sign-off blocks.

---

## ⚡ Quick Start Guide (Local Setup)

### Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/prakashseervi61/Articula.git
cd Articula/kowshik-code
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open your browser at **`http://localhost:3000/`** (or `http://localhost:5173/`).

### 3. Build for Production
```bash
npm run build
```

> **Note**: The application is **100% self-contained and standalone**. All dataset samples, MRI slice volumes, and mathematical output matrices are pre-bundled for 0-second latency during presentations.

---

## 📁 Repository Structure (`kowshik-code`)

```
kowshik-code/
├── public/assets/
│   ├── gradcam/          # Grad-CAM heatmap overlays (KL 0-4)
│   ├── mri/              # Authentic MRI sagittal slice PNGs (Exam IDs 329637, 390116, etc.)
│   └── samples/          # Dataset radiograph images (KL 0-4)
├── src/
│   ├── components/
│   │   ├── Header.jsx                # Top navigation bar
│   │   ├── Footer.jsx                # Platform navigation & system specs
│   │   ├── SeverityPredictionCard.jsx # Recharts confidence bar chart component
│   │   ├── SegmentationViewer.jsx    # SVG X-Ray viewport canvas
│   │   ├── GradCamPanel.jsx          # Model explainability heatmap panel
│   │   └── Abbr.jsx                  # Clinical abbreviation tooltips
│   ├── data/
│   │   ├── syntheticCases.js         # Linked patient case profiles
│   │   └── mriDataset.js             # Extracted MRI dataset & JSW slice gaps
│   ├── views/
│   │   ├── LandingView.jsx           # Platform Overview hero
│   │   ├── WorkspaceView.jsx         # Clinical diagnostic workbench
│   │   ├── MRIExplorerView.jsx       # 3D Sagittal MRI viewer & JSW proxy
│   │   ├── ImplantMatchingView.jsx   # Zimmer NexGen TKA implant sizer
│   │   ├── ReportView.jsx            # Structured clinical report generator
│   │   └── AboutView.jsx             # Clinical Decision Support governance
│   ├── App.jsx                       # React Router configuration
│   └── main.jsx                      # Application entry point
├── package.json
├── vite.config.js
└── README.md
```

