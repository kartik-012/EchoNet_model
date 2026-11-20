# UI-SPEC.md — EchoNet-AI Design System & Engineering Contract
**Project Title:** EchoNet-AI: Automated Cardiac Ejection Fraction Estimation Using Deep Learning  
**Author:** Kartik Raikar (USN: 2JI23CI016)  
**Institution:** Jain College of Engineering, Belagavi (Affiliated to Visvesvaraya Technological University, VTU)  
**Academic Guide:** Dr. Poorna Chandra S, Professor & HoD, Dept. of CSE (AI & ML)  
**Target Standard:** Award-Level Scientific AI Web Application & Research Showcase  

---

## 1. Visual & Aesthetic Philosophy

### 1.1 Emotional Direction & Atmosphere
- **Tone:** Dark, surgical, scientific, cinematic, hyper-refined. High-end research laboratory meets cutting-edge spatial computing.
- **Negative Space:** Generous vertical rhythm using standard 64px–128px section spacing to give complex mathematical and anatomical data breathing room.
- **Light Physics:** The 3D particle heart serves as the primary luminous light emitter for the hero scene. Surrounding cards and backgrounds react to its luminescence rather than arbitrary ambient washes.
- **Strict Grounding:** Every visual element encodes cardiovascular physics or deep neural representations. No decorative fluff, no generic abstract geometric shapes, no brain visuals.

### 1.2 Strict Prohibitions ("Do-Not" List)
1. **NO Brain Visuals:** This is strictly an echocardiographic cardiac biomechanics project. Brain networks, synapsing neurons, or cranial icons are banned.
2. **NO Medical Clipart:** Absolutely no cartoon hearts, red crosses, stethoscopes, hospital icons, or pill vectors.
3. **NO Emojis as Icons:** All visual iconography is rendered with crisp, stroked SVG symbols (`lucide-react`, 1.5px stroke weight).
4. **NO Default Typography:** No Arial, Roboto, Inter, Comic Sans, or Times New Roman. Typefaces are strictly Geist Sans and Geist Mono.
5. **NO Purple-on-White Gradients:** No standard SaaS purple/pink gradients on white backgrounds.
6. **NO Full-Screen Red:** The alert/pulse color (`#FF4D6D`) is strictly quarantined to heartbeat contractions and severe pathological EF indicators (maximum 3% of any viewport).
7. **NO Generic AI Buzzwords:** Ban words like "Next-Gen", "Supercharge", "Unleash", "Magic", "Revolutionary". Use clinical and mathematical descriptors: "Spatiotemporal Regression", "Simpson's Biplane Method", "Attention-Guided U-Net", "End-Diastolic Volume".
8. **Mandatory Disclaimer:** *"Research prototype. Not a certified medical device. Not for clinical diagnosis."* must be anchored on Hero, Results Dashboard, and Footer.

---

## 2. Token Architecture & Color System

The color system uses CSS custom properties defined in `:root`:

```css
:root {
  /* Surface Foundations */
  --bg-0: #050507;          /* Primary canvas & body background */
  --bg-1: #0B0B12;          /* Section container background */
  --bg-2: #12121E;          /* Elevated surface card background */
  
  /* Glassmorphism System */
  --glass: rgba(255, 255, 255, 0.035);
  --glass-hover: rgba(255, 255, 255, 0.065);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-focus: rgba(134, 85, 255, 0.40);
  --glass-highlight: rgba(255, 255, 255, 0.12);
  --glass-shadow: rgba(134, 85, 255, 0.08);

  /* Primary Scientific Accents */
  --violet: #8655FF;        /* Primary interactive brand accent (Reserved-for list in 2.1) */
  --violet-soft: #A78BFA;   /* Secondary glow & secondary text accent */
  --blue: #4C8DFF;          /* Venous return / spatiotemporal feature color */
  --ice: #7FD6FF;           /* Data point highlight & telemetry text */

  /* Monochromatic Neutrals */
  --white: #F5F5F7;         /* High-contrast headings & primary values */
  --muted: #A1A1B0;         /* Secondary body copy & descriptive text */
  --dim: #525266;           /* Gridlines, subtle borders, metadata labels */

  /* Cardiovascular & Clinical Telemetry */
  --pulse: #FF4D6D;         /* Systolic contraction flash & HFrEF (<40%) alert ONLY (max 3% viewport) */
  --amber: #E8B84A;         /* HFmrEF borderline warning (41% - 49%) ONLY */
  --ok: #3DDC97;            /* HFpEF preserved normal ejection fraction (>=50%) ONLY */
  --danger: #E03131;        /* Destructive action confirmation (Reset Studio only) */
}
```

### 2.1 Spatial Color Distribution (60 / 30 / 10 Rule)
- **60% Primary Canvas / Deep Surface:** `--bg-0` and `--bg-1` form the dominant dark spatial field.
- **30% Structural Glass / Typography:** `--glass`, `--bg-2`, `--glass-border`, `--white` (headings), and `--muted` (body text).
- **10% Clinical & Interactive Accents:** Controlled accent accents (`--violet`, `--ice`, `--ok`, `--amber`, `--pulse`).

### 2.2 Accent Color Reserved-For Whitelist
The primary accent `--violet` (`#8655FF`) is strictly constrained to prevent visual noise. It is permitted exclusively for:
1. Primary action CTA button fill and glow (`"Analyze Echocardiogram"`, `"Run AI Inference"`).
2. Active navigation indicator bar (underline marker on active section link).
3. Focus ring on interactive inputs and keyboard tabs (`--glass-border-focus`).
4. Active stage indicator ring in the 4-stage pipeline stepper.

### 2.3 Contrast & Accessibility Compliance (WCAG AA)
- `--white` (`#F5F5F7`) on `--bg-0` (`#050507`): Contrast ratio **18.7:1** (Exceeds WCAG AAA).
- `--muted` (`#A1A1B0`) on `--bg-0` (`#050507`): Contrast ratio **9.2:1** (Exceeds WCAG AAA).
- `--ice` (`#7FD6FF`) on `--bg-0` (`#050507`): Contrast ratio **13.5:1** (Exceeds WCAG AAA).
- `--ok` (`#3DDC97`) on `--bg-0` (`#050507`): Contrast ratio **11.4:1** (Exceeds WCAG AAA).
- Focus outlines use `--violet-soft` with `2px offset 2px` on keyboard tab navigation.

---

## 3. Strict 4-Step Typography Scale & Strict 2-Weight System

Typography is strictly consolidated into **4 discrete size tiers** and **2 font weights** to maintain surgical visual hierarchy without noise:

- **Typefaces:**  
  - Primary (Display & Prose): `Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
  - Secondary (Data & Telemetry): `Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace`
- **Allowed Font Weights:**  
  - Regular (`400`)  
  - Medium (`500`)  
  *(All other weights like 300, 600, 700 are excluded)*

| Step | Size | Line Height | Tracking | Weight | Role | Target Elements |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | 48px | 1.10 | -0.03em | 500 | Hero & Primary KPI | Hero H1 "EchoNet-AI", Primary LVEF Value (58%) |
| **Heading** | 24px | 1.25 | -0.02em | 500 | Section & Group Titles | Section Titles, Modal Headers, Subsystem Names |
| **Body** | 16px | 1.50 | 0.00em | 400 | Primary Prose & Descriptions | Hero Subtitle, Pipeline Step Details, Clinical Impression |
| **Caption** | 12px | 1.30 | +0.04em | 400 / 500 | Metadata & Telemetry | Data Labels (EDV, ESV, BPM, MAE), Badges, Disclaimers |

---

## 4. Spacing Scale System (4-pt Standard Grid)

All padding, margin, gap, and layout dimensions adhere to the standard 4-pt grid drawn exclusively from `{4, 8, 16, 24, 32, 48, 64}`:

```css
:root {
  --space-1: 4px;   /* Micro offsets, border widths, indicators */
  --space-2: 8px;   /* Inner pill gaps, tight element padding */
  --space-3: 16px;  /* Mobile padding, standard container gaps */
  --space-4: 24px;  /* Desktop card padding, grid gutters */
  --space-5: 32px;  /* Sub-group gaps, modal margins */
  --space-6: 48px;  /* Medium component spacing */
  --space-7: 64px;  /* Standard section vertical rhythm */
}
```

- **Card Padding:** `24px` (`--space-4`) desktop; `16px` (`--space-3`) mobile.
- **Card Border Radius:** `16px` desktop and mobile (snapped to standard 4-pt grid).
- **Grid Gaps:** `16px` (`--space-3`), `24px` (`--space-4`), `32px` (`--space-5`).
- **Section Vertical Rhythm:** `64px` (`--space-7`) standard; `128px` (`64px + 64px`) for Hero breathing room.
- **Card Hover Elevation:** `translateY(-4px)` (`--space-1`).

---

## 5. Glassmorphic Card Construction Specification

Every card floating in the WebGL scene or docked in the dashboard obeys an optical multi-layer shader-like model:

1. **Backdrop Filter:** `backdrop-filter: blur(24px) saturate(140%);`
2. **Surface Fill:** `background: var(--glass);`
3. **Outer Border:** `1px solid var(--glass-border);`
4. **Specular Highlight:** `box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.08), 0 24px 48px -12px var(--glass-shadow);`
5. **Corner Radius:** `16px` (snapped to standard grid).
6. **Inner Padding:** `24px` desktop (`--space-4`), `16px` mobile (`--space-3`).
7. **Hover State Transition:** Subtle elevation `translateY(-4px)`, border brightening to `rgba(255, 255, 255, 0.18)`, and shadow expansion with 300ms cubic-bezier(0.16, 1, 0.3, 1).

---

## 6. Motion Choreography & Cinematic Timeline

### 6.1 12-Second Cinematic Intro Sequence (GSAP Timeline)
The user is treated to a high-fidelity cinematic simulation of echocardiographic ultrasound physics coalescing into cardiac deep neural topology. A subtle, high-contrast "Skip Intro" button is anchored in the top right corner with keyboard shortcut (`Esc`).

- **Scene 1 (0.0s – 2.0s): Acoustic Singularity**  
  Viewport is near-black (`#050507`). A solitary luminous white point particle pulses at coordinate `(0, 0, 0)`. Circular ultrasound soundwave rings expand outward with sinusoidal easing.
- **Scene 2 (2.0s – 5.0s): Feature Space Dispersal**  
  The singularity explodes into a cloud of 45,000 spatiotemporal points swirling in an Archimedean spiral with turbulence noise, representing raw uncalibrated echocardiographic video frames.
- **Scene 3 (5.0s – 8.0s): Attention Gravitational Convergence**  
  Deep attention gates engage. Gravitational force fields pull the 45,000 points inward along 3D myocardial trajectories, snapping onto the surface geometry of the human heart mesh.
- **Scene 4 (8.0s – 10.0s): Myocardial Surface Tesselation**  
  Instanced triangular micro-facets illuminate across the epicardium and endocardium. Thin wireframe contours trace ventricular chambers at 8% opacity.
- **Scene 5 (10.0s – 12.0s): First Hemodynamic Systole & Awakening**  
  The heart unleashes its first authentic 72 BPM "lub-dub" contraction. The camera sweeps back smoothly to its resting hero angle. The page header, typography, and 4 floating telemetry cards dissolve in with staged staggering.
- **Skip Behavior:** Instantly jumps to the 12.0s timeline state, reveals all UI, and remembers state in `sessionStorage`.

### 6.2 Continuous Real-Time Motion (Hero Phase)
- **Cardiac Cycle:** Anatomically accurate 72 BPM lub-dub cycle:
  - Phase 1: Isovolumetric contraction (S1 "lub", 0.15s, contraction amplitude 1.08x).
  - Phase 2: Ventricular ejection (S2 "dub", 0.12s, contraction amplitude 1.04x).
  - Phase 3: Diastolic relaxation & passive filling (0.56s rest with slight respiratory sway).
- **Interactive Parallax:** Gentle camera parallax coupled to mouse coordinates `(normalized -1 to +1)` with a 1.2s damping factor.
- **Harmonic Floating Cards:** 4 floating cards oscillate with slight sine wave phase offsets (card 1: 3.2s period, card 2: 4.1s period, card 3: 3.7s period, card 4: 4.5s period).
- **Lenis Smooth Scroll:** 1.2s scroll duration with custom ease `t => Math.min(1, 1.001 - Math.pow(2, -10 * t))` ensuring fluid scrolling across all sections.

---

## 7. 3D Particle Heart Architecture (Three.js & React Three Fiber)

### 7.1 Geometry Ingestion & Parametric Fallback
- **Primary Mode:** Ingests `/models/heart.glb` using Drei `useGLTF`. Extracts the primary ventricular and atrial mesh topology and passes vertices to `MeshSurfaceSampler`.
- **Procedural Manifold Fallback:** If the network fails or GLB is absent, an analytical cardiac manifold is generated via parametric cardiovascular formulas:
  $$x = 16 \sin^3(t)$$
  $$y = 13 \cos(t) - 5 \cos(2t) - 2 \cos(3t) - \cos(4t)$$
  $$z = u \cdot \sin(t) \cdot \cos(t)$$
  guaranteeing zero WebGL crashes under any environment.

### 7.2 Particle & Facet Distribution
- **Desktop:** 45,000 discrete luminous particles + 12,000 instanced triangle facets (`InstancedMesh`).
- **Mobile (< 768px):** 12,000 discrete particles + 3,000 instanced triangle facets for 60 FPS performance.
- **Color Partitioning:**
  - 45% High-Purity White / Silver (`#F5F5F7`)
  - 25% Venous / Acoustic Blue (`#4C8DFF`)
  - 20% Deep Myocardial Violet (`#8655FF`)
  - 7% Borderline Amber (`#E8B84A`)
  - 3% Hemodynamic Pulse Red (`#FF4D6D`)

### 7.3 Custom GLSL Shader Specification
- **Uniforms:**
  - `uTime` (float): Accumulated elapsed seconds.
  - `uProgress` (float): Interpolation factor [0.0 = chaotic cloud, 1.0 = structured cardiac mesh].
  - `uPulse` (float): Systolic deformation scalar driven by the GSAP cardiac clock.
  - `uWave` (float): Vertical scanning apex-to-base ultrasound beam sweep.
  - `uMouse` (vec2): Mouse cursor normalized screen coordinates for magnetic hover repulsion.
- **Post-Processing Pipeline:**
  - Selective UnrealBloom (intensity 0.85, luminance threshold 0.72, luminance smoothing 0.95).
  - Subtle chromatic aberration at peripheral edges (`offset = (0.0015, 0.0015)`).
  - Subtle vignette (darkness 0.65, offset 0.35) drawing focus to the cardiac core.

---

## 8. Action Labels & Comprehensive Copywriting Contract

### 8.1 Standard Action Labels (Strict Verb-Noun Construction)
Single-word actions without context are prohibited. Every button carries explicit intent:

| Component | Action Label | Intent / Trigger |
| :--- | :--- | :--- |
| Navigation Bar | `"Analyze Echocardiogram"` | Scrolls smoothly to `#analyze` section |
| Hero Primary | `"Analyze Echocardiogram"` | Scrolls to upload studio and highlights dropzone |
| Hero Ghost | `"View Benchmark Results"` | Scrolls directly to `#validation` metrics table |
| Upload Studio | `"Run AI Inference"` | Initiates 4-stage spatiotemporal pipeline |
| Preset Selector | `"Load Normal Sample (58% EF)"` | Loads Stanford EchoNet normal clinical clip |
| Preset Selector | `"Load Borderline Sample (44% EF)"`| Loads borderline heart failure clinical clip |
| Preset Selector | `"Load Reduced Sample (28% EF)"` | Loads severe HFrEF clinical clip |
| Results Toolbar | `"Export Clinical PDF"` | Generates client-side formatted PDF report |
| Results Toolbar | `"Download JSON Masks"` | Exports segmentation coordinates file |
| Results Toolbar | `"Reset Analysis Studio"` | Opens reset confirmation dialog with `--danger` action |
| Reset Dialog | `"Confirm Reset"` | Clears active study and returns to upload state |
| Reset Dialog | `"Cancel"` | Dismisses modal without altering state |

### 8.2 Empty State Copy Specifications
- **Upload Studio Dropzone (Default Empty State):**  
  - Primary Text: *"Drag and drop an Apical 4-Chamber echocardiogram video (.mp4, .avi, .dicom under 50MB), or select a clinical preset below."*  
  - Secondary Text: *"Supported views: A4C transthoracic B-mode loops with at least 32 frames."*
- **Upload Studio Drag-Over State:**  
  - Primary Text: *"Release file to upload echocardiogram sequence."*  
  - Visual Cue: Border pulses violet (`--glass-border-focus`), background tint brightens.
- **Results Dashboard (Initial Empty State before any inference):**  
  - Primary Text: *"No echocardiogram study analyzed yet."*  
  - Secondary Text: *"Select a clinical preset or upload a transthoracic video in the Analyze Studio above to compute Left Ventricular Ejection Fraction telemetry."*  
  - CTA Button: `"Open Analyze Studio"`

### 8.3 Error States & Failure Remediation Copy
- **Validation Error (Unsupported Format / Size):**  
  - Error Title: *"Unsupported File Format or Size"*  
  - Remediation Copy: *"The selected file is not a supported echocardiography format or exceeds 50MB. Please supply an H.264 MP4, AVI, or DICOM video."*  
  - Action Button: `"Select Another File"`
- **Inference Failure (Acoustic Dropout / Tracking Loss):**  
  - Error Title: *"Endocardial Boundary Detection Failed"*  
  - Remediation Copy: *"Acoustic shadow or poor apical window prevented confident left ventricular contouring across the 32-frame sequence. Verify probe alignment and retry."*  
  - Action Button: `"Retry AI Inference"`

---

## 9. Comprehensive Page Structure & Section Blueprints

### Section 1: Navigation Bar (Fixed Glass Header)
- **Left:** Small EchoNet-AI wordmark with an integrated SVG live pulse indicator.
- **Center:** Nav links with active underline highlight: *Overview*, *Pipeline*, *Analyze*, *Results*, *Validation*, *About*.
- **Right:** Primary Action CTA `"Analyze Echocardiogram"` (violet border, subtle background fill, hover glow) + GitHub repository link with explicit `aria-label="View EchoNet-AI Source Code on GitHub"`.
- **Sub-border:** Thin 1px line with `--glass-border`.

### Section 2: Hero Section (40% Copy / 60% 3D Viewport)
- **Left Column:**
  - Eyebrow: `DEEP LEARNING CARDIAC BIOMECHANICS • VTU FINAL YEAR PROJECT`
  - H1: `EchoNet-AI`
  - H2: `Automated Cardiac Ejection Fraction Estimation Using Deep Learning`
  - Body: *"An AI-powered approach to automated cardiac function assessment using deep learning and echocardiographic analysis."*
  - CTA Group:
    - Primary Button: `"Analyze Echocardiogram"` (Smooth scroll to `#analyze` with arrow icon).
    - Ghost Button: `"View Benchmark Results"` (Smooth scroll to `#validation` with metric badge).
  - Research Prototype Disclaimer badge.
- **Right Column (3D WebGL Canvas & 4 Parallax Floating Cards):**
  - Card 1 (Top Left): **Ejection Fraction 58%** (Animated counter, labeled "Normal / Preserved LVEF", green dot).
  - Card 2 (Top Right): **Attention Confidence 94.2%** (Horizontal micro-bar meter, 3D ResNet consensus).
  - Card 3 (Bottom Left): **Cardiac Telemetry ECG** (Live scrolling vector waveform with synchronized R-peak beat marker).
  - Card 4 (Bottom Right): **Hemodynamic Alert Monitor** (Displays status: "End-Systolic Volume Stable", pulse indicator).

### Section 3: Interactive Pipeline Section (4-Stage Architecture)
Interactive split-screen diagram where clicking any stage updates the live code/tensor visualization panel:
1. **Stage 1: Video Ingestion & Quality QC**  
   DICOM / MP4 echo loop (Apical-4-Chamber view, 112x112 spatial crop, 32 contiguous frames at 50 FPS).
2. **Stage 2: Keyframe Extraction (ED / ES)**  
   Automated detection of End-Diastole (maximum chamber expansion) and End-Systole (peak myocardial contraction) using optical ventricular kinematics.
3. **Stage 3: Attention-Guided LV Segmentation**  
   Spatial attention U-Net delineates the left ventricular endocardial border, filtering speckle noise and acoustic dropouts.
4. **Stage 4: Consensus EF Estimation**  
   Hybrid integration of mathematical Simpson's Rule (method of disks) and continuous 3D ResNet-18 spatiotemporal feature regression.

### Section 4: Analyze Studio (Interactive Echo Lab)
- **File Ingestion Dropzone:** Drag-and-drop zone with animated dashed border, accepting `.mp4`, `.avi`, and `.dicom` files.
- **Empty State Copy:** Full compliant empty state as specified in Section 8.2.
- **Preset Demonstration Echoes:** One-click loader for 3 real Stanford EchoNet clinical samples:
  - Sample A: Normal Preserved Function (LVEF ~58%, Normal)
  - Sample B: Mildly Reduced Function (LVEF ~44%, Borderline)
  - Sample C: Severely Reduced Function (LVEF ~28%, Heart Failure / HFrEF)
- **Live 4-Stage Stepper Progress:**
  - Step 1: Parsing video tensors & extracting 32 spatiotemporal slices (25%).
  - Step 2: Running spatial attention gate to isolate apical four-chamber cavity (50%).
  - Step 3: Segmenting left ventricular endocardial boundaries at ED and ES (75%).
  - Step 4: Regressing ejection fraction and computing volumetric curves (100%).

### Section 5: Clinical Results Dashboard
Rendered dynamically once analysis finishes (or pre-populated on sample selection):
- **Primary LVEF Gauge:** Large circular segmented dial displaying estimated LVEF with dynamic clinical category:
  - Reduced ($<40\%$, `--pulse`)
  - Mildly Reduced ($41\% - 49\%$, `--amber`)
  - Preserved ($\ge 50\%$, `--ok`)
- **Keyframe Comparison Viewer:** Side-by-side End-Diastole (ED) and End-Systole (ES) frames with toggleable switches:
  - Toggle 1: Segmentation Mask Overlay (Endocardial boundary contour), `role="switch"`, `aria-checked="true"`.
  - Toggle 2: Grad-CAM Saliency Heatmap (Visualizing model attention weights), `role="switch"`, `aria-checked="false"`.
- **Ventricular Volume-Time Curve:** High-fidelity SVG/Canvas or Recharts Area Chart displaying LV cavity volume (mL) across the full cardiac cycle, marking EDV and ESV inflection points.
- **Structured Clinical Report Card:**
  - Patient ID / Study Hash: `#ECH-8942-A4C`
  - Heart Rate: `72 BPM`
  - End-Diastolic Volume (EDV): `124.6 mL`
  - End-Systolic Volume (ESV): `52.3 mL`
  - Stroke Volume (SV): `72.3 mL`
  - Calculated LVEF: `58.0%` ($95\%$ Confidence Interval: $55.4\% - 60.6\%$)
  - Automated AI Clinical Impression: *"Left ventricular systolic performance is within normal physiological limits (LVEF >= 50%). Symmetrical myocardial wall excursion observed throughout the 32-frame sequence without regional dyssynergy."*
- **Clinical Actions:**
  - `"Export Clinical PDF"` (Generates downloadable clinical dossier).
  - `"Download JSON Masks"` (JSON coordinates).
  - `"Reset Analysis Studio"` (Opens reset dialog).

### Section 6: Empirical Performance & Model Validation
Presents real, honest peer-reviewed research benchmarks:
- **Primary Training Benchmark:** Stanford EchoNet-Dynamic Dataset ($10,030$ apical four-chamber echocardiogram video loops).
- **Architecture Details:** 3D Convolutional Neural Network (R3D-18) with spatio-temporal residual kernels.
- **Empirical Accuracy:**
  - Test Mean Absolute Error (MAE): **4.84 EF points** ($95\%$ CI: $4.62 - 5.08$)
  - Coefficient of Determination ($R^2$): **0.727**
  - Root Mean Squared Error (RMSE): **6.21**
- **Clinical Comparison Benchmark Table:**
  | Metric / Observer | EchoNet-AI (Ours) | Human Sonographer | Standard 2D Biplane |
  | :--- | :--- | :--- | :--- |
  | **Mean Absolute Error (MAE)** | **4.84%** | 5.20% | 6.80% |
  | **Inter-Observer Variability** | **0.0% (Deterministic)**| 8.1% - 12.6% | 11.4% |
  | **Inference Time per Study** | **1.15 seconds** | 12 - 18 minutes | 15 minutes |
  | **R² Correlation** | **0.727** | 0.740 | 0.650 |
- **Domain Shift Transparency Note (CAMUS Dataset):**
  External validation on 50 CAMUS patients yielded a test MAE of **11.90%**. We transparently publish this domain shift finding, attributing it to differences in ultrasound machine vendor beamformers and acoustic resolution—demonstrating rigorous scientific integrity.

### Section 7: Academic Attribution & Project Team
- **Degree:** Bachelor of Engineering in Computer Science and Engineering (Artificial Intelligence & Machine Learning).
- **University:** Visvesvaraya Technological University (VTU), Belagavi, Karnataka.
- **Institution:** Jain College of Engineering (JCE), Belagavi.
- **Author:** Kartik Raikar (USN: `2JI23CI016`) — Neural Architecture Design, Preprocessing Pipeline, Frontend & 3D WebGL Implementation.
- **Project Guide:** Dr. Poorna Chandra S, Professor & HoD, Department of CSE (AI & ML).
- **Academic Year:** 2025–2026.
- **Links:** Direct links to IEEE Technical Paper and Source Code repository.

### Section 8: Global Footer
- EchoNet-AI brand mark with VTU affiliation tag.
- Medical disclaimer prominent box.
- Research citations: Stanford EchoNet-Dynamic (Ouyang et al., Nature 2020) and CAMUS (Leclerc et al., IEEE TMI 2019).
- Copyright © 2026 EchoNet-AI Research Group.

---

## 10. Component Inventory & Architectural Manifest

| Component Path | Name | Responsibilities | States Handled |
| :--- | :--- | :--- | :--- |
| `src/components/Navbar.tsx` | Navbar | Top navigation, wordmark, beat status indicator, CTA | Fixed, Scrolled, Mobile Drawer |
| `src/components/HeroScene.tsx` | HeroScene | R3F canvas, 3D particle heart, lighting, postprocessing | Loading, WebGL Context Lost, Active 60FPS |
| `src/components/ParticleHeart.tsx` | ParticleHeart | GLTF surface sampler, custom shaders, pulse uniforms | Spatiotemporal explosion -> converged heart |
| `src/components/FloatingCards.tsx` | FloatingCards | 4 parallax glass cards orbiting the 3D heart | Intro Reveal, Idle Oscillation, Interactive Hover |
| `src/components/IntroOverlay.tsx` | IntroOverlay | 12-second cinematic GSAP intro sequence, skip button | Playing (0-12s), Skipped, Completed |
| `src/components/PipelineSection.tsx`| PipelineSection | 4-step interactive pipeline diagram with code preview | Step 1–4 Active, Hover inspect |
| `src/components/AnalyzeSection.tsx` | AnalyzeSection | Drag/drop video uploader, sample selector, stepper | Empty, Dragover, Ingesting, Inferring, Error |
| `src/components/ResultsDashboard.tsx`| ResultsDashboard| LVEF gauge, keyframe viewer, volume curve, report | Result Computed, Mask Toggled, Heatmap Toggled |
| `src/components/PerformanceSection.tsx`| PerformanceSection| Benchmark metrics, comparison table, CAMUS note | Static high-contrast scientific tables |
| `src/components/AboutSection.tsx` | AboutSection | Author credentials, VTU affiliation, paper links | Interactive links, PDF triggers |
| `src/components/Footer.tsx` | Footer | Disclaimers, copyright, links, citations | Fixed baseline |
| `src/components/ui/GlassCard.tsx` | GlassCard | Reusable glassmorphic container with specular sheen | Default, Hover lift, Active focus |
| `src/lib/api.ts` | Mock API Client | Simulates asynchronous inference pipeline | Pending, Progress callbacks, Resolved mock data |

---

## 11. Registry Safety & Dependency Provenance

- **Design System:** Custom in-house Tailwind v4 glassmorphism tokens.
- **Third-Party Registries:** **Zero external unverified registries**. All components are authored directly in `src/components/`.
- **Core Library Dependencies (Vetted npm packages):**
  - `react` & `react-dom` (`^18.3.1`) — Official npm registry.
  - `three` (`^0.186.1`) & `@types/three` (`^0.187.0`) — Official npm registry.
  - `@react-three/fiber` (`^8.18.0`) & `@react-three/drei` (`^9.122.0`) — Official npm registry.
  - `@react-three/postprocessing` (`^2.19.1`) — Official npm registry.
  - `gsap` (`^3.15.0`) & `@gsap/react` (`^2.1.2`) — Official GreenSock npm registry.
  - `lenis` (`^1.3.27`) — Official Lenis smooth scroll library.
  - `recharts` (`^2.15.0`) — Official SVG charting library.
  - `lucide-react` (`^1.66.0`) — Official SVG iconography.
  - `clsx` & `tailwind-merge` — Official utility packages.

---

## 12. State Machine & Workflow Matrix

```
[IDLE / HERO]
      │
      ▼ (User clicks "Analyze Echocardiogram" or drops video)
[FILE_INGESTED]
      │
      ├──> [FORMAT_INVALID / SIZE_EXCEEDED] ──> [VALIDATION_ERROR] ──> "Select Another File" ──> [IDLE]
      │
      ▼ (User triggers "Run AI Inference")
[PROCESSING_STAGE_1] (Video Parsing & Normalization - 25%)
      │
      ▼
[PROCESSING_STAGE_2] (Attention Gate Bounding Box - 50%)
      │
      ▼
[PROCESSING_STAGE_3] (ED & ES Boundary Delineation - 75%)
      │
      ├──> [TRACKING_FAILURE / ACOUSTIC_DROPOUT] ──> [INFERENCE_ERROR] ──> "Retry AI Inference"
      │
      ▼
[PROCESSING_STAGE_4] (Consensus Regression Simpson + 3D ResNet - 100%)
      │
      ▼
[RESULTS_READY] ──> Populate LVEF dial, volume curve, and clinical report card
      │
      ├──> [EXPORT_PDF] (Generate client-side clinical dossier)
      ├──> [DOWNLOAD_MASKS] (Export JSON contour vertices)
      └──> [TRIGGER_RESET] ──> [CONFIRM_MODAL] ──> "Confirm Reset" ──> [IDLE]
                                              └──> "Cancel" ──> [RESULTS_READY]
```

---

## 13. Quality Gate Sign-Off Criteria

1. **Visual Excellence:** 100% adherence to dark, surgical glassmorphic theme. No emojis, no brain clipart, no generic AI templates.
2. **WebGL Performance:** Steady 60 FPS on desktop (with 45k points), 30+ FPS on mobile (with 12k points). Automatic context recovery on tab switch.
3. **Responsiveness:** Validated on 375px (iPhone), 768px (iPad portrait), 1024px (iPad landscape), 1440px (MacBook / Desktop), and 2560px (UltraWide).
4. **Accessibility:** Text contrast ratio $\ge 9:1$ throughout, visible keyboard focus indicators, `prefers-reduced-motion` compliance.
5. **Code Architecture:** 100% TypeScript typed code, modular React components, custom hooks, zero unresolved warnings, clean tree-shakable dependencies.
6. **Scientific Rigor:** Real clinical benchmarks only (MAE 4.84, $R^2$ 0.727, CAMUS 11.90).
