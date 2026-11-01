from pathlib import Path
import json

METRICS_FILE = Path(__file__).resolve().parent / "metrics.json"

def get_metrics():
    if not METRICS_FILE.exists():
        return {
            "available": False,
            "message": "No evaluation metrics file found. Add backend/metrics.json with your measured test results."
        }
    return {"available": True, **json.loads(METRICS_FILE.read_text())}
