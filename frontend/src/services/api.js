/**
 * EchoCard-AI Diagnostic Intelligence Platform - API Client
 * Interfaces directly with FastAPI backend running on port 8000.
 */

const API_BASE = "http://localhost:8000/api"

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error("Health check failed")
  return await res.json()
}

export async function fetchSampleVideos() {
  const res = await fetch(`${API_BASE}/samples`)
  if (!res.ok) throw new Error("Could not fetch sample videos")
  return await res.json()
}

export async function runPredictionOnFile(file) {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || "Clinical inference pipeline error")
  }
  return data
}

export async function runPredictionOnSample(filename) {
  const res = await fetch(`${API_BASE}/predict_sample?filename=${encodeURIComponent(filename)}`, {
    method: "POST"
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || `Failed to analyze sample ${filename}`)
  }
  return data
}
