from fastapi import APIRouter, HTTPException
from schemas.api_models import GenerationPayload
from services.validator import validate_input_payload
from solver.engine import TimetableEngine
from typing import Dict, Any

router = APIRouter(prefix="/api/v1", tags=["timetable"])

@router.post("/generate")
async def generate_timetable(payload: GenerationPayload) -> Dict[str, Any]:
    """
    1. Validates the Hybrid JSON Input.
    2. Runs the CP-SAT Engine.
    3. Returns the perfectly mapped JSON Grid.
    """
    
    # Pre-Generation Validation Step
    is_valid, errors = validate_input_payload(payload)
    if not is_valid:
        raise HTTPException(status_code=400, detail={"validation_errors": errors})
        
    try:
        # Engine Execution Step
        engine = TimetableEngine(data=payload)
        
        # The generator does the Variable Mapping -> Constraints -> Execution in one go
        result = engine.generate()
        
        if result["status"] == "infeasible":
            raise HTTPException(
                status_code=422, 
                detail="The provided constraints are too strict. The solver could not find a mathematically viable timetable."
            )
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/substitute-search")
async def find_substitute(time_index: int, day: str, payload: GenerationPayload) -> Dict[str, Any]:
    """
    Intelligent Substitution Search Algorithm.
    Filters out any faculty who:
    1. Does not have a shift encompassing 'time_index'.
    2. Is already scheduled for another class at [day, time_index].
    (Mocked for now depending on persistent output DB logic)
    """
    available_subs = []
    
    # Filter 1: Shift validation
    valid_shift_faculty = [f for f in payload.faculty if time_index in f.shift]
    
    # Filter 2: Free-slot validation
    # Real logic queries the DB where `time_slot == time_index AND day == day`.
    # Returning the valid list dynamically.
    for f in valid_shift_faculty:
        available_subs.append({
            "faculty_id": f.id,
            "name": f.name,
            "current_load": f.total_target_load,
            "status": "Available & On Shift"
        })
        
    return {
        "query": {"day": day, "time": time_index},
        "available_substitutes": available_subs
    }
