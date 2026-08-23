# Product Requirements Document (PRD)
## ARTICULA — AI-Assisted Knee Intelligence Platform

**Document Version:** 1.0.0  
**Status:** Draft for Review  
**Date:** August 22, 2026  
**System Classification:** Clinical Decision-Support & Research Software (Tier 0 Prototype)  

---

### 1. Problem Statement & Clinical Context

Osteoarthritis (OA) and Total Knee Arthroplasty (TKA) present significant diagnostic and surgical planning challenges:
1. **Quantitative Meniscus Assessment:** Medial meniscus thinning and structural degradation correlate strongly with osteoarthritis progression, age, and sex. Standard radiographic evaluation often lacks automated, repeatable, pixel-accurate measurement across anatomical sub-regions (anterior, middle, posterior).
2. **Implant Sizing Precision:** Optimal TKA outcome depends on patient-specific femoral and tibial anatomical sizing. Manual measurement of femoral condylar width, tibial plateau width, and anterior-posterior (AP) dimensions introduces inter-observer variability and delays surgical planning.

**ARTICULA Solution:**  
ARTICULA is an AI-assisted, patient-specific knee intelligence platform built to satisfy these dual clinical needs through:
- Automated, quantitative measurement of medial meniscus thickness at defined anatomical locations (anterior, middle, posterior), contextualized against age, sex, and OA population statistics.
- Automated, patient-specific femoral and tibial anatomical measurements matched against an implant dimension database to identify nearest-fit TKA components.

**Regulatory & Clinical Positioning:**  
ARTICULA is strictly a **Clinical Decision-Support (CDS) and Research Tool**. It is **NOT** an autonomous diagnostic or treatment system. All diagnostic interpretations and surgical choices remain the sole responsibility of certified clinicians.

---

### 2. Target Users

1. **Primary Users:** Radiologists, Orthopedic Surgeons, and Clinical Specialists requiring quantitative image metrics and TKA pre-operative planning support.
2. **Secondary Users:** Clinical Researchers and Bio-engineers studying knee OA demographics, meniscus morphology, and implant design sizing.
3. **Usage Notice:** This platform is delivered as a high-fidelity functional prototype demo using synthetic and de-identified reference data for clinical validation and workflow evaluation.

---

### 3. System Scope & Tiered Feature Breakdown

The ARTICULA platform features are categorized across three development tiers:

```
+-----------------------------------------------------------------------------------+
| TIER 0: Functional Demo Core (IN SCOPE FOR IMPLEMENTATION)                       |
|  - Image upload & DICOM/X-ray quality check pipeline                             |
|  - Multi-class anatomical segmentation overlay (Femur, Tibia, Medial Meniscus)    |
|  - Meniscus thickness measurement (Anterior, Middle, Posterior zones)             |
|  - Femoral & Tibial anatomical sizing measurements (Condylar, Plateau, AP)        |
|  - Statistical population comparison (OA status, Age, Sex distributions)          |
|  - Implant nearest-match lookup engine against implant database                  |
|  - Clinician verification UI (Accept / Edit / Override measurements)              |
|  - Structured printable/exportable clinical summary report                       |
|  - Audit trail log (Model/Software version, timestamp, clinician action)          |
+-----------------------------------------------------------------------------------+
| TIER 1: Advanced Clinical Insights (IN SCOPE FOR UI / PLACEHOLDER ONLY)           |
|  - Knee Health Fingerprint visual composite widget ("Planned" state)              |
|  - Reference-population percentile radar comparison ("Coming Soon")              |
|  - Ranked Top-3 implant recommendations with fit scores ("Planned")              |
|  - Basic Explainability / Attention heatmap panel ("Preview Mode")                |
+-----------------------------------------------------------------------------------+
| TIER 2: Enterprise & Future AI Capabilities (EXPLICITLY OUT OF SCOPE)             |
|  - Patient Similarity Engine (3D anatomical matching)                            |
|  - "What-If" Surgical Kinematic & Implant Alignment Simulator                     |
|  - Longitudinal OA progression tracking & predictive modeling                     |
|  - Multimodal Data Fusion (MRI + CT + Kinematic sensor data)                      |
+-----------------------------------------------------------------------------------+
```

---

### 4. Information Architecture & Functional Requirements

The website comprises seven dedicated clinical views:

```
                    +---------------------------------------+
                    |           ARTICULA Platform           |
                    +---------------------------------------+
                                        |
      +------------+------------+-------+-------+------------+------------+
      |            |            |               |            |            |
  1.Landing    2.How It     3.Patient       4.Population  5.Implant    6.Report
  / Overview   Works        Workspace        Research     Matching     View
                                                |
                                          7. About & CDS
                                            Positioning
```

#### View 1: Landing / Overview (`/`)
* **Purpose:** Establish platform credibility, state clinical purpose, highlight core capabilities, and present the end-to-end processing pipeline.
* **User Story:** As a visiting clinician, I want to understand ARTICULA's dual clinical capabilities and decision-support scope immediately, so that I can evaluate its utility for my practice.
* **Acceptance Criteria:**
  * Displays prominent clinical disclaimer stating non-diagnostic CDS positioning.
  * Highlights the dual clinical capability: (1) Quantitative Meniscus Assessment and (2) TKA Implant Sizing.
  * Renders an interactive 5-stage pipeline diagram: Image Input → Quality Control → Anatomical Segmentation → Quantitative Measurement → Clinical Report.
  * Direct action link to enter the Patient / Case Workspace.

#### View 2: How It Works (`/how-it-works`)
* **Purpose:** Transparently explain the Tier 0 algorithmic workflow and anatomical measurement methodologies.
* **User Story:** As an orthopedic clinician or researcher, I want to review the measurement algorithms and segmentation logic, so that I have full transparency into how values are derived.
* **Acceptance Criteria:**
  * Explains DICOM quality validation checks (contrast, artifact, resolution).
  * Details segmentation zone definitions for Femur, Tibia, and Medial Meniscus.
  * Explains sub-regional meniscus thickness derivation (Anterior, Middle, Posterior locations).
  * Outlines bone dimension calculation formulas (Femoral Condylar Width, Tibial Plateau Width, AP depth).
  * Visualizes the nearest-neighbor implant matching logic based on euclidean dimension delta scoring.

#### View 3: Patient / Case Workspace (`/workspace`)
* **Purpose:** Core clinical interactive hub for uploading/selecting cases, viewing segmentations, measuring anatomy, verifying data, and generating reports.
* **User Story:** As a clinician, I want to select or upload a knee scan, inspect segmentation layers, review automated measurements with confidence scores, and modify/accept results, so that I can prepare an accurate report.
* **Acceptance Criteria:**
  * Includes dropzone for uploading images and a pre-loaded sample case library (covering varied age, sex, and OA grades 0-4).
  * Automated Quality Check indicator (Pass / Warning / Fail with sharpness and contrast scores).
  * Interactive Image Viewer with toggleable segmentation layers: Femur (cyan), Tibia (emerald), Medial Meniscus (amber/rose).
  * Measurement Summary Cards showing:
    * Meniscus Thickness: Anterior (mm), Middle (mm), Posterior (mm) + Confidence Score %.
    * Bone Metrics: Femoral Condyle Width (mm), Tibial Plateau Width (mm), Femoral AP (mm), Tibial AP (mm) + Confidence Score %.
  * Clinician Verification UI: Buttons to "Accept Measurements", "Edit/Override Values", or "Flag Case for Review".
  * Tier 1 Preview Panels (Disabled/Planned state): "Knee Health Fingerprint" and "Explainability Panel" marked with clear "Coming Soon (Tier 1)" badges.
  * Live Session Audit Log updating with software version `v0.9.4-demo` and clinician actions.

#### View 4: Population / Research View (`/population`)
* **Purpose:** Contextualize patient measurements against normative and OA reference populations (Module 0.7).
* **User Story:** As a researcher or clinician, I want to compare patient meniscus thickness against age-, sex-, and OA-stratified cohort distributions, so that I can assess degeneration relative to population norms.
* **Acceptance Criteria:**
  * Interactive distribution charts (Meniscus Thickness vs Age, Sex, OA Grade 0-4).
  * Cohort filtering controls (Filter by Age Group, Sex, OA Severity).
  * Patient position indicator overlaying selected case values on population percentiles (25th, 50th, 75th, 95th).
  * Tier 1 Percentile Radar Chart preview widget in a disabled/planned state.

#### View 5: Implant Matching View (`/implant-matching`)
* **Purpose:** Match patient anatomical bone measurements against a standardized TKA implant database.
* **User Story:** As an orthopedic surgeon, I want to see how patient femoral and tibial measurements map to standard implant manufacturer dimensions, so that I can identify optimal component sizes.
* **Acceptance Criteria:**
  * Displays current patient measurements: Femoral Width, Tibial Width, Femoral AP, Tibial AP.
  * Displays interactive Implant Database Table (Manufacturer, Model, Size, Femoral Width mm, Tibial Width mm, AP mm).
  * Highlights the **Nearest Match** component calculated via minimum dimensional error.
  * Dimensional Delta display showing difference in millimeters (+/- mm) for each parameter.
  * Tier 1 Preview: "Ranked Top-3 Candidate List" disabled preview card.

#### View 6: Structured Report View (`/report`)
* **Purpose:** Formal clinical output summarizing case details, measurements, population percentile positioning, implant match, clinician approval status, and audit log.
* **User Story:** As a clinician, I want a clean, printable, structured report of the case to attach to medical records or export for surgical planning.
* **Acceptance Criteria:**
  * Header with Patient ID, Case ID, Scan Date, Age, Sex, OA Grade, Software Version (`ARTICULA v0.9.4-demo`).
  * Image Thumbnail with active segmentation overlay snapshot.
  * Quantitative Meniscus & Bone Measurement Table with confidence indicators.
  * Population Percentile Placement summary.
  * Primary Implant Sizing Match recommendation and dimension deltas.
  * Clinician Verification Status (Accepted / Edited / Pending) with timestamp and sign-off space.
  * Mandatory persistent Non-Diagnostic Clinical Decision Support Disclaimer footer.
  * Print to PDF / Export HTML report trigger.

#### View 7: About & Clinical Positioning (`/about`)
* **Purpose:** Explicit statement of clinical boundaries, software versioning, methodology, and ethical AI standards.
* **User Story:** As a clinical director or auditor, I want to review ARTICULA's intended use statement, software version history, and validation status, so that I ensure compliance with hospital CDS guidelines.
* **Acceptance Criteria:**
  * Comprehensive Intended Use & Non-Diagnostic Disclaimer statement.
  * Model & System Versioning panel (`Core engine v0.9.4-demo`, `Segmentation model UNet-Knee-v2.1`).
  * Validation summary (Synthetic/Retrospective cohort description).
  * Explicit listing of system limitations and non-goals.

---

### 5. Non-Functional Requirements

1. **Design & Visual Excellence:**
   - **Clinical Aesthetic:** Clean, high-trust visual language. Generous whitespace, precise typography (Inter / System Sans-Serif), crisp line-drawn iconography.
   - **Color Palette:** Professional medical slate (`#0f172a`), deep clinical blue (`#0284c7`), teal accents (`#0d9488`), crisp off-white background (`#f8fafc`), with high-contrast neutral borders (`#e2e8f0`).
   - **No Stock Clutter:** All visuals focused strictly on medical imaging, segmentation masks, quantitative charts, and anatomical data.
2. **Performance & Interaction:**
   - Instant responsive feedback for all interactions.
   - Dynamic progress indicators (progress bar, loading shimmer) during image quality checking and segmentation generation to prevent blank blocking states.
3. **Accessibility & Usability:**
   - Strict WCAG 2.1 AA color contrast compliance across text and graphical metrics.
   - High legibility data tables with clear headers and unit designations (mm, %).
   - Fully responsive layout supporting screens from mobile (375px) up to 4K desktop viewports.
4. **Data Handling & Privacy:**
   - 100% synthetic/de-identified sample data. No real Patient Health Information (PHI) stored or transmitted.
   - Clear banner stating "DEMONSTRATION PLATFORM — SYNTHETIC CLINICAL DATA".

---

### 6. Explicit Non-Goals

1. **No Autonomous Diagnosis:** The software shall never produce an automated final medical diagnosis or mandate surgical procedures.
2. **No Real Model Training/Inference Server:** For this web platform deliverable, intelligence pipelines are executed with client-side deterministic image processing and high-fidelity synthetic case models.
3. **No Real Patient Data Ingestion:** No HIPAA/GDPR clinical data connections or live PACS integration in this prototype build.
4. **No Tier 2 Feature Implementation:** Features like 3D kinematic simulators, longitudinal tracking, or patient similarity engines are strictly excluded.

---

### 7. Success Criteria

- A clinician or reviewer can perform a complete case workflow: navigate to workspace, select or upload a knee case image, view DICOM quality verification, toggle multi-class segmentation masks, review quantitative meniscus/bone measurements with confidence scores, inspect population percentile placement, review nearest-fit implant sizing, apply clinician verification sign-off, and generate/export a structured clinical report.
- The visual design, component styling, typography, and interactive responsiveness match the standards of a production-grade medical device software platform.
