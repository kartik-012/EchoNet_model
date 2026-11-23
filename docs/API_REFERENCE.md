# EchoCard-AI REST API Reference

The EchoCard-AI backend is exposed via high-throughput FastAPI asynchronous endpoints.

## Base URL
`http://localhost:8000`

---

## 1. System Health & Telemetry
- **Endpoint:** `GET /api/health`
- **Description:** Verifies GPU availability, model weight status, input tensor shapes, and active clinical features.

### Response `200 OK`
```json
{
  "status": "ready",
  "system": "EchoCard-AI Diagnostic PACS",
  "model_file": "final_ef_model.pt",
  "model_exists": true,
  "device": "cuda",
  "architecture": "3D Spatiotemporal Convolutional Neural Network (R3D-18)",
  "input_tensor": "[1, 3, 32, 112, 112]",
  "dataset_origin": "Stanford Medicine EchoNet-Dynamic (10,030 cases)",
  "features_active": [
    "3D Grad-CAM Explainable AI Heatmaps",
    "Universal Ingestion: 2D/3D Videos & Still Images",
    "Left Ventricle Volumetric Telemetry (EDV/ESV/SV)",
    "FAISS Vector Case-Based Patient Retrieval",
    "Dual Doctor & Plain-Language Patient Reporting"
  ]
}
```

---

## 2. Echocardiogram Inference & Telemetry
- **Endpoint:** `POST /api/predict`
- **Content-Type:** `multipart/form-data`
- **Payload:** `file` (MP4, AVI, or DICOM ultrasound stream)

### Response `200 OK`
```json
{
  "ef": 54.2,
  "confidence": 94.6,
  "risk_category": "Normal",
  "edv": 128.4,
  "esv": 58.8,
  "stroke_volume": 69.6,
  "inference_time_ms": 118.2,
  "gradcam_frames": ["<base64_jpeg_0>", "..."],
  "similar_cases": [
    { "patient_id": "ST-0492", "ef": 55.1, "similarity": 0.96 }
  ]
}
```

<!-- REST API specifications validated -->
