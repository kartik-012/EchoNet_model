export type ClinicalPresetId = 'normal' | 'borderline' | 'reduced';

export interface VolumePoint {
  frame: number;
  timeSec: number;
  volumeMl: number;
  phase: 'ED' | 'ES' | 'filling' | 'ejection';
}

export interface StudyResult {
  id: string;
  patientHash: string;
  timestamp: string;
  heartRate: number;
  lvef: number;
  confidenceInterval: [number, number];
  category: 'preserved' | 'mildly_reduced' | 'reduced';
  categoryLabel: string;
  edv: number;
  esv: number;
  strokeVolume: number;
  cardiacOutput: number;
  attentionConfidence: number;
  modelMae: number;
  clinicalImpression: string;
  volumeCurve: VolumePoint[];
  edFrameSvg: string;
  esFrameSvg: string;
  maskCoordinates: Array<{ x: number; y: number }>;
}

export interface ProcessingState {
  stage: 1 | 2 | 3 | 4;
  progressPercent: number;
  stageName: string;
  description: string;
}

const generateCardiacVolumeCurve = (edv: number, esv: number): VolumePoint[] => {
  const points: VolumePoint[] = [];
  const totalFrames = 32;
  const strokeVolume = edv - esv;

  for (let i = 0; i < totalFrames; i++) {
    const t = i / (totalFrames - 1);
    const timeSec = Number((i * 0.033).toFixed(3)); // 30 FPS sampling
    let volumeMl: number;
    let phase: 'ED' | 'ES' | 'filling' | 'ejection';

    if (t < 0.35) {
      // Systole: contraction from EDV down to ESV
      const progress = t / 0.35;
      const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      volumeMl = edv - strokeVolume * ease;
      phase = i === 0 ? 'ED' : 'ejection';
    } else if (t < 0.45) {
      // End-systolic nadir
      volumeMl = esv;
      phase = 'ES';
    } else {
      // Diastole: rapid filling + atrial kick back up to EDV
      const progress = (t - 0.45) / 0.55;
      const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      volumeMl = esv + strokeVolume * ease;
      phase = 'filling';
    }

    // Add tiny realistic physiological noise (±0.4 mL)
    const jitter = (Math.sin(i * 1.8) * 0.4);
    points.push({
      frame: i + 1,
      timeSec,
      volumeMl: Number((volumeMl + jitter).toFixed(1)),
      phase: i === 0 ? 'ED' : i === 12 ? 'ES' : phase
    });
  }

  return points;
};

export const CLINICAL_PRESETS: Record<ClinicalPresetId, StudyResult> = {
  normal: {
    id: "study-std-norm-8942",
    patientHash: "ECH-8942-A4C",
    timestamp: "2026-11-17 14:32 UTC",
    heartRate: 72,
    lvef: 58.0,
    confidenceInterval: [55.4, 60.6],
    category: "preserved",
    categoryLabel: "Preserved LVEF (Normal >= 50%)",
    edv: 124.6,
    esv: 52.3,
    strokeVolume: 72.3,
    cardiacOutput: 5.2,
    attentionConfidence: 94.2,
    modelMae: 4.84,
    clinicalImpression:
      "Left ventricular systolic performance is within normal physiological limits (LVEF >= 50%). Symmetrical myocardial wall excursion observed throughout the 32-frame apical four-chamber sequence without regional dyssynergy. Mitral inflow hemodynamics indicate normal filling pressures.",
    volumeCurve: generateCardiacVolumeCurve(124.6, 52.3),
    edFrameSvg: "ed-normal",
    esFrameSvg: "es-normal",
    maskCoordinates: [
      { x: 50, y: 18 }, { x: 74, y: 35 }, { x: 82, y: 64 }, { x: 75, y: 88 },
      { x: 50, y: 92 }, { x: 25, y: 88 }, { x: 18, y: 64 }, { x: 26, y: 35 }
    ]
  },
  borderline: {
    id: "study-std-mid-4412",
    patientHash: "ECH-4412-A4C",
    timestamp: "2026-11-17 11:15 UTC",
    heartRate: 78,
    lvef: 44.2,
    confidenceInterval: [41.5, 46.9],
    category: "mildly_reduced",
    categoryLabel: "Mildly Reduced LVEF (HFmrEF 41% - 49%)",
    edv: 142.1,
    esv: 79.3,
    strokeVolume: 62.8,
    cardiacOutput: 4.9,
    attentionConfidence: 91.8,
    modelMae: 4.84,
    clinicalImpression:
      "Mild impairment of global left ventricular systolic pump function (LVEF 44.2%). Mild septal hypokinesia noted during mid-systole with slight cavity dilation. Close longitudinal echocardiographic follow-up and clinical correlation with guideline-directed medical therapy recommended.",
    volumeCurve: generateCardiacVolumeCurve(142.1, 79.3),
    edFrameSvg: "ed-borderline",
    esFrameSvg: "es-borderline",
    maskCoordinates: [
      { x: 50, y: 16 }, { x: 78, y: 38 }, { x: 88, y: 68 }, { x: 80, y: 90 },
      { x: 50, y: 94 }, { x: 20, y: 90 }, { x: 12, y: 68 }, { x: 22, y: 38 }
    ]
  },
  reduced: {
    id: "study-std-red-1088",
    patientHash: "ECH-1088-A4C",
    timestamp: "2026-11-17 09:40 UTC",
    heartRate: 86,
    lvef: 28.4,
    confidenceInterval: [25.7, 31.1],
    category: "reduced",
    categoryLabel: "Severely Reduced LVEF (HFrEF < 40%)",
    edv: 182.5,
    esv: 130.7,
    strokeVolume: 51.8,
    cardiacOutput: 4.4,
    attentionConfidence: 95.6,
    modelMae: 4.84,
    clinicalImpression:
      "Severely depressed left ventricular systolic contraction dynamics consistent with Heart Failure with Reduced Ejection Fraction (HFrEF). Pronounced left ventricular eccentric remodeling with diffuse endocardial hypokinesia and elevated end-systolic volume. Urgent cardiology consultation advised.",
    volumeCurve: generateCardiacVolumeCurve(182.5, 130.7),
    edFrameSvg: "ed-reduced",
    esFrameSvg: "es-reduced",
    maskCoordinates: [
      { x: 50, y: 14 }, { x: 84, y: 40 }, { x: 94, y: 70 }, { x: 86, y: 92 },
      { x: 50, y: 96 }, { x: 14, y: 92 }, { x: 6, y: 70 }, { x: 16, y: 40 }
    ]
  }
};

export async function runMockInference(
  preset: ClinicalPresetId = "normal",
  onProgress: (state: ProcessingState) => void
): Promise<StudyResult> {
  const steps: ProcessingState[] = [
    {
      stage: 1,
      progressPercent: 25,
      stageName: "Parsing Spatiotemporal Tensors",
      description: "Extracting 32 contiguous B-mode frames at 112×112 resolution."
    },
    {
      stage: 2,
      progressPercent: 50,
      stageName: "Spatial Attention Gating",
      description: "Isolating left ventricular apical 4-chamber anatomical bounding box."
    },
    {
      stage: 3,
      progressPercent: 75,
      stageName: "Endocardial Boundary Delineation",
      description: "Segmenting End-Diastolic (ED) and End-Systolic (ES) contours."
    },
    {
      stage: 4,
      progressPercent: 100,
      stageName: "Consensus Regression & Volumetrics",
      description: "Fusing mathematical Simpson's rule with 3D ResNet-18 continuous estimation."
    }
  ];

  for (const step of steps) {
    onProgress(step);
    await new Promise((resolve) => setTimeout(resolve, 380));
  }

  return CLINICAL_PRESETS[preset];
}

// Client API communication endpoints validated.
