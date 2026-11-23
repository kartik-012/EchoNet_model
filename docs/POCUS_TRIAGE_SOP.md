# Point-of-Care Ultrasound (POCUS) Emergency Triage Protocol

## Purpose
This Standard Operating Procedure (SOP) outlines the rapid deployment and diagnostic checklist for attending physicians using EchoCard-AI in the Emergency Department (ED) and Intensive Care Unit (ICU).

## Clinical Triage Steps

```
[Patient Presenting with Acute Dyspnea / Hypotension]
                       │
                       ▼
         [Step 1: POCUS Probe Acquisition]
     • Apical 4-Chamber (A4C) standard view
     • Minimize probe tilt and foreshortening
                       │
                       ▼
         [Step 2: Stream Ingestion to PACS]
     • Export DICOM / MP4 to EchoCard-AI workstation
     • System performs 32-frame spline normalization
                       │
                       ▼
         [Step 3: Automated Dual-Engine Analysis]
     • 3D ResNet-18 calculates contraction kinetics
     • nnU-Net verifies anatomical cavity boundaries
     • 3D Grad-CAM verifies focus on myocardium
                       │
                       ▼
        [Step 4: Clinical Review & Action]
     ┌─────────────────┬─────────────────┬─────────────────┐
     │  EF >= 50%      │  EF 41% - 49%   │  EF < 40%       │
     │  [NORMAL]       │  [BORDERLINE]   │  [ACUTE HFrEF]  │
     │  Investigate    │  Admit for      │  Immediate      │
     │  pulmonary /    │  telemetry &    │  inotropes /    │
     │  septic cause   │  cardio workup  │  diuretics      │
     └─────────────────┴─────────────────┴─────────────────┘
```

## Safety Guardrails
1. **Model Discrepancy Flag:** If the kinetic model and anatomical model differ by $>12\%$, the workstation triggers an amber warning recommending manual tracing.
2. **Poor Acoustic Window:** In cases of severe subcostal or obesity artifacts, rely on multi-view consensus rather than single-view automated results.

<!-- POCUS emergency triage workflow review completed -->
