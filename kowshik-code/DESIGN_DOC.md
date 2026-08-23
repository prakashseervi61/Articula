# Design Document (DD)
## ARTICULA — AI-Assisted Knee Intelligence Platform

**Document Version:** 1.0.0  
**Status:** Draft for Review  
**Date:** August 22, 2026  
**System Architecture:** Web-Based Clinical Decision-Support Prototype (Tier 0)  

---

### 1. Information Architecture & Sitemap

ARTICULA is structured into seven distinct clinical views with clear global navigation, persistent disclaimers, and version tracking.

```
                               +-----------------------------+
                               |     Global Header Nav       |
                               |  - ARTICULA Logo & Version  |
                               |  - View Navigation Tabs     |
                               |  - Clinical Status Badge    |
                               +-----------------------------+
                                              |
      +-------------------+-------------------+-------------------+-------------------+
      |                   |                   |                   |                   |
+-----------+       +-----------+       +-----------+       +-----------+       +-----------+
|  Landing  |       |   How It  |       |  Patient  |       | Population|       |  Implant  |
| Overview  |       |   Works   |       | Workspace |       | Research  |       | Matching  |
|    (/)    |       | (/works)  |       |(/workspace|       |(/populatio|       | (/implant)|
+-----------+       +-----------+       +-----------+       +-----------+       +-----------+
                                              |                   |                   |
                                        +-----------+             +-------------------+
                                        |  Report   |                       |
                                        |   View    |                 +-----------+
                                        | (/report) |                 |  About &  |
                                        +-----------+                 | Positioning|
                                                                      |  (/about) |
                                                                      +-----------+
```

---

### 2. Visual Design System

The visual design system is strictly tailored for a high-trust, precision clinical medical application. It rejects generic marketing templates in favor of a clean, high-contrast diagnostic aesthetic.

#### 2.1 Color Palette
```css
:root {
  /* Primary Clinical Colors */
  --color-brand-primary: #0284c7;     /* Clinical Sapphire / Sky-600 */
  --color-brand-dark: #0f172a;        /* Deep Slate / Slate-900 */
  --color-brand-accent: #0d9488;      /* Medical Teal / Teal-600 */
  
  /* Background & Surfaces */
  --color-bg-app: #f8fafc;            /* Light Clinical Slate / Slate-50 */
  --color-bg-surface: #ffffff;        /* Pure White Card Background */
  --color-bg-subtle: #f1f5f9;         /* Slate-100 for table alternate rows */
  
  /* Neutral Borders & Dividers */
  --color-border: #e2e8f0;            /* Slate-200 */
  --color-border-hover: #cbd5e1;      /* Slate-300 */

  /* Text & Labels */
  --color-text-main: #0f172a;         /* High Contrast Charcoal */
  --color-text-muted: #64748b;        /* Slate-500 */
  --color-text-light: #94a3b8;        /* Slate-400 */

  /* Anatomical Segmentation Layer Overlays (With Alpha) */
  --color-mask-femur: rgba(6, 182, 212, 0.45);     /* Cyan-500 */
  --color-mask-tibia: rgba(16, 185, 129, 0.45);    /* Emerald-500 */
  --color-mask-meniscus: rgba(245, 158, 11, 0.55); /* Amber-500 */

  /* Status & Clinical Confidence Indicators */
  --color-status-pass: #10b981;       /* Emerald-500 (High Confidence / Accepted) */
  --color-status-warn: #f59e0b;       /* Amber-500 (Moderate Confidence / Edited) */
  --color-status-fail: #ef4444;       /* Red-500 (Low Quality Alert / Flagged) */
  --color-tier1-planned: #6366f1;     /* Indigo-500 (Tier 1 Preview Badge) */
}
```

#### 2.2 Typography Scale
- **Font Family:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif.
- **Display Headings:** 32px / Line Height: 38px / Weight: 700 (Page Hero / Overview Headlines)
- **H1 Headings:** 24px / Line Height: 30px / Weight: 600 (View Titles / Section Headers)
- **H2 Headings:** 18px / Line Height: 24px / Weight: 600 (Card Titles / Module Headers)
- **Body Regular:** 14px / Line Height: 20px / Weight: 400 (Standard Text & Data Lists)
- **Body Medium:** 14px / Line Height: 20px / Weight: 500 (Table Headers & Metric Labels)
- **Data Mono / Metrics:** `JetBrains Mono`, `ui-monospace`, monospace (Numerical mm values, confidence %, software hashes)

#### 2.3 Spacing & Layout Grid
- Base unit: 8px (4px, 8px, 16px, 24px, 32px, 48px, 64px).
- Container Widths: Max 1280px (Main views), Max 1440px (Clinical Workspace split panel).
- Elevation & Shadows: Flat to ultra-subtle borders (`1px solid #e2e8f0`), shadow `0 1px 3px 0 rgba(0, 0, 0, 0.05)` for crisp diagnostic panels.

---

### 3. Key Screen Wireframe Descriptions & UI States

#### View 1: Landing / Overview (`/`)
* **Layout:** Top Header → Clinical Disclaimer Banner → Hero Headline & Value Prop → Core Dual Capability Cards → 5-Stage Interactive Pipeline Flow → Software Version & Quick Access Panel.
* **Content Blocks:**
  * Dual Clinical Capability Highlight: (1) Medial Meniscus Quantitative Thickness & (2) TKA Femoral/Tibial Sizing.
  * Interactive Pipeline Visual: Clickable nodes (Upload → Quality Gate → Multi-Class Segmentation → Quantitative Extraction → Nearest Implant Match → Clinician Sign-off).
* **States:** Standard populated state with animated pipeline node triggers.

#### View 2: How It Works (`/how-it-works`)
* **Layout:** Two-column clinical methodology layout.
* **Content Blocks:**
  * DICOM Image Quality Protocol (SNR, Contrast Ratio, Artifact Detection).
  * Segmentation Zone Definitions (Anterior, Middle, Posterior Medial Meniscus; Femoral Condyles; Tibial Plateau).
  * Geometric Sizing Mathematics (Femoral Width, Tibial Width, AP Depth).
  * Nearest Implant Distance Algorithm Formula.

#### View 3: Patient / Case Workspace (`/workspace`)
* **Layout:** 3-Column Clinical Diagnostic Workbench:
  * **Left Column (Case Control & Quality):** Case Dropdown Selector, Image Upload Dropzone, Patient Metadata Card (Age, Sex, OA Grade), DICOM Quality Gate Card.
  * **Center Column (Interactive Image Viewer):** X-Ray / DICOM Viewer with Multi-Layer Segmentation Toggles (Femur, Tibia, Meniscus), Zoom/Pan controls, Opacity Sliders, Ruler Overlay.
  * **Right Column (Quantitative Results & Verification):**
    * Meniscus Thickness Card (Anterior, Middle, Posterior mm + Confidence Bar).
    * Bone Measurement Card (Femoral Condyle, Tibial Plateau, AP mm + Confidence Bar).
    * Clinician Decision Panel (Accept, Override Edit, Flag for Review).
    * Tier 1 Preview Panel ("Knee Health Fingerprint" disabled state with badge).
    * Audit Log Feed.
* **States:**
  * *Empty State:* Upload dropzone prompt with quick-select button for sample cases.
  * *Loading State:* Animated DICOM Quality Check shimmer & scanning line over the image viewer.
  * *Populated State:* Active segmentation mask overlay and rendered quantitative cards.
  * *Flagged/Low-Confidence State:* Amber warning alert if quality score < 85% or confidence < 80%.

#### View 4: Population / Research View (`/population`)
* **Purpose:** Module 0.7 Statistical Comparison Engine.
* **Layout:** Top Control Filter Bar → Population Curve Visualizer (Meniscus Thickness vs Age / OA Grade) → Cohort Summary Table → Tier 1 Radar Percentile Preview Widget.
* **Content Blocks:**
  * Chart 1: Medial Meniscus Thickness Distribution across OA Grades 0-4.
  * Chart 2: Age & Sex Stratified Meniscus Thickness Curves.
  * Selected Case Marker: Highlights current case position against population 25th, 50th, 75th percentiles.

#### View 5: Implant Sizing & Matching View (`/implant-matching`)
* **Layout:** Side-by-Side Sizing Matrix:
  * Left: Patient Measured Dimensions (Femoral Width, Tibial Width, AP Depths).
  * Right: Nearest Match Implant Card (Manufacturer, Model, Size, Fit Error Delta in mm).
  * Bottom: Comprehensive Implant Dimension Database Table with nearest match highlighted.
  * Tier 1 Preview: Disabled card for "Top-3 Ranked Implant Candidates".

#### View 6: Structured Report View (`/report`)
* **Layout:** Clean, print-formatted A4 clinical report document with printable styling (`@media print`).
* **Content Blocks:**
  * Facility Header & Patient Demographic Block.
  * DICOM Image Thumbnail with Segmentation Overlay.
  * Quantitative Measurement Data Table with confidence percentages.
  * Population Percentile Context.
  * Recommended Nearest Implant Size & Dimensional Delta.
  * Clinician Sign-off Block (Status, Clinician Name, Timestamp).
  * Persistent Non-Diagnostic Clinical Decision Support Disclaimer.

#### View 7: About & Clinical Positioning (`/about`)
* **Layout:** Structured text & specification document.
* **Content Blocks:**
  * Intended Use Statement & Non-Diagnostic Regulatory Boundary.
  * Algorithm & Model Version Log (`ARTICULA Engine v0.9.4-demo`, `UNet-Knee Segmentation v2.1`).
  * Synthetic Dataset Specification & Retrospective Validation Metrics.
  * System Non-Goals & Ethical AI Safeguards.

---

### 4. Component Inventory

| Component Name | File Path / Location | Purpose | Key Props & Features |
| :--- | :--- | :--- | :--- |
| `Header` | `components/Header.jsx` | Global navigation & brand title | Active route, model version indicator, clinical badge |
| `DisclaimerBanner` | `components/DisclaimerBanner.jsx` | Persistent CDS disclaimer | Non-diagnostic positioning text, dismissable/sticky |
| `CaseSelector` | `components/CaseSelector.jsx` | Select pre-loaded sample cases | Case list dropdown, age, sex, OA grade filters |
| `ImageUpload` | `components/ImageUpload.jsx` | DICOM/X-ray upload dropzone | Drag & drop file trigger, synthetic file validator |
| `QualityCheckCard` | `components/QualityCheckCard.jsx` | Quality gate result display | Sharpness, contrast, SNR score bars, Pass/Fail status |
| `SegmentationViewer` | `components/SegmentationViewer.jsx` | Interactive canvas viewer | Layer toggles (Femur, Tibia, Meniscus), opacity slider, zoom |
| `MeasurementCard` | `components/MeasurementCard.jsx` | Anatomical measurement display | Parameter name, value in mm, confidence bar %, reference range |
| `ConfidenceBadge` | `components/ConfidenceBadge.jsx` | Visual confidence indicator | High (Green >=85%), Med (Amber 70-84%), Low (Red <70%) |
| `ClinicianVerification` | `components/ClinicianVerification.jsx`| Accept / Edit / Override UI | Status toggle, edit numerical inputs, append audit note |
| `PopulationChart` | `components/PopulationChart.jsx` | Statistical curve visualizer | Recharts line/area plot, cohort filter, case percentile pin |
| `ImplantMatchCard` | `components/ImplantMatchCard.jsx` | Nearest implant recommendation | Manufacturer, model, size, dimensional fit error (+/- mm) |
| `ImplantTable` | `components/ImplantTable.jsx` | Complete implant catalog | Searchable table of implant sizes with matching highlights |
| `Tier1PreviewCard` | `components/Tier1PreviewCard.jsx` | Disabled placeholder for Tier 1 | "Coming Soon (Tier 1)" badge, descriptive future capability text |
| `AuditLog` | `components/AuditLog.jsx` | Real-time session event log | Timestamps, action descriptions, software version hash |
| `Footer` | `components/Footer.jsx` | Application footer | Copyright, disclaimer, system version, GitHub link |

---

### 5. Frontend Data Models (JavaScript / TypeScript Schema)

```typescript
// Case Object Structure
export interface KneeCase {
  id: string;                         // e.g. "CASE-2026-084"
  patientAlias: string;               // Synthetic patient identifier "Synth-Pt-84"
  age: number;                        // e.g. 62
  sex: 'Male' | 'Female';
  oaGrade: 0 | 1 | 2 | 3 | 4;         // Kellgren-Lawrence Grade
  scanDate: string;                   // "2026-08-15"
  imageUrl: string;                   // Path to clean X-ray image
  quality: {
    status: 'Pass' | 'Warning' | 'Fail';
    score: number;                    // Overall score % (e.g. 94)
    contrastRatio: number;
    sharpnessIndex: number;
  };
  segmentationMasks: {
    femurUrl: string;
    tibiaUrl: string;
    meniscusUrl: string;
  };
  measurements: {
    meniscus: {
      anteriorMm: number;             // e.g. 4.2
      middleMm: number;               // e.g. 3.8
      posteriorMm: number;            // e.g. 3.1
      confidence: number;             // e.g. 96
    };
    bone: {
      femoralCondyleWidthMm: number;  // e.g. 74.5
      tibialPlateauWidthMm: number;   // e.g. 71.2
      femoralApMm: number;            // e.g. 60.8
      tibialApMm: number;             // e.g. 48.3
      confidence: number;             // e.g. 94
    };
  };
  implantMatch: {
    manufacturer: string;            // e.g. "Stryker"
    model: string;                   // e.g. "Triathlon"
    femoralSize: string;             // e.g. "Size 5"
    tibialSize: string;              // e.g. "Size 4"
    fitErrorMm: number;              // e.g. 0.4 mm
  };
  verification: {
    status: 'Pending' | 'Accepted' | 'Edited' | 'Flagged';
    verifiedBy?: string;             // e.g. "Dr. R. Vance, MD"
    timestamp?: string;              // ISO timestamp
    notes?: string;
  };
}

// Implant Database Record Structure
export interface ImplantRecord {
  id: string;
  manufacturer: string;
  model: string;
  femoralSize: string;
  tibialSize: string;
  femoralWidthMm: number;
  tibialWidthMm: number;
  femoralApMm: number;
  tibialApMm: number;
}
```

---

### 6. Interaction & State Flow (Patient / Case Workspace)

```
[1. User Selects / Uploads Case] 
              │
              ▼
[2. DICOM Quality Gate Check (Progress Shimmer & Validation)]
              │
              ├───────► If Fail: Display Warning Banner & Allow Overriding
              ▼
[3. Multi-Class Segmentation Canvas Render]
   (User can toggle Femur / Tibia / Meniscus masks & adjust opacity)
              │
              ▼
[4. Quantitative Measurement & Confidence Rendering]
   (Displays Anterior/Middle/Posterior thickness & Bone Sizing)
              │
              ▼
[5. Clinician Verification Step]
   (Clinician clicks "Accept Measurements" or "Edit Values")
              │
              ▼
[6. Real-Time Audit Log Entry Appended & Report Generation Triggered]
```

---

### 7. Technical Approach & Implementation Stack

- **Framework:** React 18 + Vite (High-speed development & bundling).
- **Styling & CSS:** Vanilla CSS + TailwindCSS utility classes for consistent medical theme tokens.
- **Icons:** Lucide-React (Precise line icons for rulers, scans, anatomical layers, checkmarks).
- **Charts & Data Viz:** Recharts (SVG line/area plots for population distributions).
- **Synthetic Data Engine:** A curated synthetic case dataset (`src/data/syntheticCases.js`) containing 6 diverse sample cases (OA Grade 0 through 4, varied ages/sexes) and 12 standard TKA implant model sizes (`src/data/implantDatabase.js`).
- **Client-Side Simulation:** Real-time canvas overlay rendering for segmentation masks, dynamic measurement calculations, and interactive report generator with PDF/Print layout styling.

---

### 8. Explicit Tier Breakdown & Feature Scoping Confirmation

- **Tier 0 (Fully Built & Operational):**
  - All 7 core views built and fully navigable.
  - Image quality check simulation with instant metrics.
  - Segmentation canvas viewer with layer toggles.
  - Quantitative meniscus and bone measurements with confidence bars.
  - Population comparison charts (Module 0.7).
  - Nearest-match implant database lookup.
  - Clinician Accept / Edit verification flow.
  - Printable structured report and live session audit log.

- **Tier 1 (UI / Placeholder Scope Only):**
  - Workspace: "Knee Health Fingerprint Widget" (Rendered in disabled/planned state with "Tier 1 — Planned" badge).
  - Workspace: "Explainability Panel (Grad-CAM)" (Rendered in disabled preview state).
  - Population View: "Percentile Radar Chart" (Disabled preview card).
  - Implant View: "Top-3 Ranked Implant Candidate Matrix" (Disabled preview card).

- **Tier 2 (Strictly Excluded):**
  - No 3D kinematic simulator, no patient similarity engine, no longitudinal tracking, no multimodal fusion.
