from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as timetable_router

app = FastAPI(
    title="ShiftSync SATIS API",
    description="Intelligent CP-SAT Backend for Timetable Generation",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(timetable_router)

@app.get("/")
def read_root():
    return {
        "engine": "ShiftSync Core", 
        "status": "Online",
        "solver": "Google OR-Tools CP-SAT"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
