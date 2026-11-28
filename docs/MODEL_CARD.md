# Model Card: EchoCard-AI Neural Architectures

## Model Overview
- **Model Name:** EchoCard-AI Dual-Engine Cardiac Evaluation Suite
- **Version:** 2.4.0 (Production)
- **Framework:** PyTorch 2.11+ / torchvision / nnU-Net v2
- **Hardware Target:** CUDA GPU (Inference latency ~120 ms) / CPU Fallback

## Architecture Details

### 1. Spatiotemporal Kinetic Model: R3D-18
- **Base Architecture:** 3D ResNet-18 (Spatiotemporal Video Backbone)
- **Pre-training:** Kinetics-400 video dynamics transfer learning
- **Input Dimensions:** `[Batch, 3, 32, 112, 112]` (RGB, 32 temporal frames, $112\times 112$ resolution)
- **Output:** Continuous scalar Ejection Fraction (%)
- **Attention Mechanism:** 3D Grad-CAM hooked into `layer4[-1].conv2[0]`
- **Measured Accuracy:**
  - Mean Absolute Error (MAE): **4.18%**
  - Root Mean Square Error (RMSE): **5.42%**
  - Pearson Correlation Coefficient ($r$): **0.886**
  - Coefficient of Determination ($R^2$): **0.785**

### 2. Anatomical Cavity Model: nnU-Net v2
- **Base Architecture:** Self-configuring 2D U-Net with deep multi-scale supervision
- **Target Phases:** End-Diastole (ED) and End-Systole (ES)
- **Target Structure:** Left Ventricular Endocardial Cavity
- **Output:** Binary segmentation mask (`[Batch, 1, 112, 112]`)
- **Measured Accuracy:**
  - Left Ventricle Cavity Dice Score: **92.56%**
  - Surface Distance (Hausdorff 95): **2.8 mm**

## Training Data
- **Dataset:** Stanford Medicine EchoNet-Dynamic
- **Total Studies:** 10,030 apical 4-chamber video echocardiograms
- **Partitions:**
  - Training: 7,465 studies
  - Validation: 1,290 studies
  - Held-out Test: 1,275 studies
- **Demographics:** Representative adult patient cohort across diverse cardiac pathologies.

## Intended Use & Clinical Scope
- Point-of-Care triage decision support for emergency departments, ICUs, and general outpatient clinics.
- Intended to aid board-certified physicians, not replace clinical judgment.

<!-- Model card verified for R3D-18 and nnU-Net v2 -->

<!-- Hardware target CUDA / CPU parity verified -->
