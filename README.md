# EchoCard-AI Developer Dashboard

Developer-facing dashboard for testing an existing EchoNet EF PyTorch model.

## Architecture
React/Vite frontend -> FastAPI backend -> PyTorch model

## Quick start

### 1. Put your model here
Copy:
`final_ef_model.pt`
to:
`backend/model/final_ef_model.pt`

### 2. Backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite.

## Important
The dashboard's UI and API are ready, but `backend/inference.py` contains a clearly marked adapter section because the exact architecture/checkpoint format of your `final_ef_model.pt` is project-specific. Replace that adapter with the same model construction + preprocessing code used by your existing `predict_ef.py`.

The dashboard already supports:
- video upload
- prediction response
- inference time
- model/device metadata
- evaluation metrics endpoint
- prediction history in the browser
- developer error reporting
