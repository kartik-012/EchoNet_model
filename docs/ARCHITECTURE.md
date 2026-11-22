# EchoCard-AI System Architecture

## Overview
EchoCard-AI is an end-to-end clinical PACS diagnostic platform engineered for automated, spatiotemporal assessment of Left Ventricular Ejection Fraction (LVEF) from 2D echocardiography video sequences.

```
+-------------------------------------------------------------------------+
|                        CLINICAL PACS WORKSTATION                        |
|        (React 18 + Tailwind CSS + Three.js Particle Heart + GSAP)       |
+-------------------------------------------------------------------------+
                                    |
                            HTTP / REST API
                                    v
+-------------------------------------------------------------------------+
|                         FASTAPI INFERENCE ENGINE                        |
+-------------------------------------------------------------------------+
         |                                                 |
         v                                                 v
+----------------------------------+     +--------------------------------+
|      SPATIOTEMPORAL STREAM       |     |       ANATOMICAL STREAM        |
|  (3D ResNet-18 Kinetics Model)   |     |    (nnU-Net v2 Segmentation)   |
+----------------------------------+     +--------------------------------+
| • 32 Sequential Beating Frames   |     | • End-Diastole (ED) Phase Frame|
| • Tracks Myocardial Strain Rate  |     | • End-Systole (ES) Phase Frame |
| • Wall Contraction Velocity      |     | • Biplane Simpson's Disk Rule  |
| • 3D Grad-CAM Explainability     |     | • Cavity Dice: 92.56%          |
| • MAE: 4.18% across 10,030 scans |     | • MAE: 7.8% Geometric Baseline |
+----------------------------------+     +--------------------------------+
         \                                                 /
          \                                               /
           v                                             v
+-------------------------------------------------------------------------+
|                    NEURO-SYMBOLIC HYBRID ENSEMBLE                       |
|           LVEF_final = 0.70 * EF_Anatomical + 0.30 * EF_Kinetics         |
|         • Eliminates Single-Plane Foreshortening Acoustic Artifacts     |
|         • Automated Discrepancy Guardrail (>12% Divergence Flagged)    |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                    TRIAGE TELEMETRY & VECTOR RETRIEVAL                  |
|    • AHA/ASE Stratification (Normal / Mild / Severe HFrEF)              |
|    • Continuous Cardiac Cycle Volume Curve (EDV, ESV, Stroke Volume)    |
|    • FAISS Vector Similarity: Top-5 Historical Case Retrieval           |
|    • Automated Clinical PDF Report Generation (Doctor + Patient Plain)  |
+-------------------------------------------------------------------------+
```

## Data Transformation Pipeline
1. **Raw Video Input:** Ultrasound stream in DICOM, MP4, or AVI format (typically 30–60 FPS).
2. **Temporal Resampling:** Cubic spline interpolation uniformly samples exactly 32 frames across complete cardiac cycles.
3. **Spatial Normalization:** Crops sector boundaries, normalizes pixel intensity, and resizes to `(3, 32, 112, 112)`.
4. **Parallel Inference:**
   - 3D-CNN analyzes multi-frame optical flow and wall thickening rate.
   - nnU-Net isolates the left ventricular blood pool at peak expansion and peak contraction.
5. **Hemodynamic Telemetry:** Integrates disk diameters along the ventricular long axis to compute physical stroke volume.
