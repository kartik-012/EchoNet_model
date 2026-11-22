# Clinical Diagnostic Guidelines & AHA/ASE Stratification

## Left Ventricular Ejection Fraction (LVEF) Reference Standards
EchoCard-AI aligns its diagnostic outputs strictly with the joint guidelines established by the **American Society of Echocardiography (ASE)** and the **European Association of Cardiovascular Imaging (EACVI)**.

| Ejection Fraction (EF) | Clinical Category | Risk Stratification | Immediate Clinical Action |
| :---: | :---: | :---: | :--- |
| **$\ge 50\%$** | **Normal** | Low Risk | Standard clinical observation |
| **$41\% - 49\%$** | **Mildly Reduced** | Intermediate Risk | Monitor for heart failure with mildly reduced EF (HFmrEF) |
| **$< 40\%$** | **Severely Reduced** | High Risk (HFrEF) | Urgent guideline-directed medical therapy (GDMT) / ICD eval |

---

## The Biplane Simpson's Method of Disks
In clinical echocardiography, manual tracing of the Left Ventricular endocardium approximates the 3D cavity volume by integrating a stack of cylindrical disks:

$$V = \frac{\pi}{4} \sum_{i=1}^{N} D_i^2 \cdot \Delta h$$

Where:
- $N = 20$ cylindrical cross-sections along the long axis (from base to apex).
- $D_i$ is the diameter of disk $i$ in orthogonal views.
- $\Delta h = \frac{L}{N}$ is the uniform disk thickness along long-axis length $L$.

### Volume & Ejection Fraction Formulation:
$$\text{Stroke Volume (SV)} = \text{EDV} - \text{ESV}$$

$$\text{Ejection Fraction (EF \%)} = \frac{\text{EDV} - \text{ESV}}{\text{EDV}} \times 100$$

Where:
- **EDV (End-Diastolic Volume):** Blood volume at maximum filling (normative: $67 - 155\text{ mL}$).
- **ESV (End-Systolic Volume):** Blood volume at maximum contraction (normative: $22 - 58\text{ mL}$).
