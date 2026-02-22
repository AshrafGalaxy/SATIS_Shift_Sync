from pydantic import BaseModel, Field, validator
from typing import List, Optional

# --- Shared Enumerations / Logic ---

class SubjectType(str):
    THEORY = "Theory"
    PRACTICAL = "Practical"

# --- College Global Settings ---

class CollegeSettings(BaseModel):
    days_active: List[str] = Field(..., description="e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']")
    time_slots: List[int] = Field(..., description="Array of integer hours e.g. [8, 9, 10... 17]")
    lunch_slot: int = Field(13, description="The integer hour designated for global lunch break")
    max_continuous_lectures: int = Field(2, description="Penalty applied if a faculty teaches more than this consecutively")

# --- Infrastructure Setup ---

class RoomsConfig(BaseModel):
    theory_rooms: List[str] = Field(..., description="Array of room IDs capable of hosting theory lectures")
    practical_labs: List[str] = Field(..., description="Array of room IDs capable of hosting practical batches")

# --- Faculty & Workload Mapping ---

class WorkloadItem(BaseModel):
    type: str = Field(..., description="'Theory' or 'Practical'")
    subject: str = Field(..., description="Subject code e.g. 'CS301'")
    target: str = Field(..., description="The Division or Batch target e.g. 'Div_A' or 'Batch_A1'")
    hours: int = Field(..., gt=0, description="Exact number of weekly hours required for this mapping")

class FacultyConfig(BaseModel):
    id: str
    name: str
    shift: List[int] = Field(..., description="Array of valid integer hours this faculty is allowed to work")
    class_teacher_for: Optional[str] = Field(None, description="Division ID if this faculty is a class teacher")
    workload: List[WorkloadItem] = Field(default_factory=list)

    @property
    def total_target_load(self) -> int:
        return sum(item.hours for item in self.workload)

# --- Master Payload ---

class GenerationPayload(BaseModel):
    college_settings: CollegeSettings
    rooms: RoomsConfig
    faculty: List[FacultyConfig]
