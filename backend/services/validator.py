from schemas.api_models import GenerationPayload, FacultyConfig
from typing import List, Tuple

def validate_input_payload(payload: GenerationPayload) -> Tuple[bool, List[str]]:
    """
    Runs pre-generation math checks before the OR-Tools solver runs.
    Returns (is_valid, list_of_error_messages).
    """
    errors = []

    # 1. Total Workload vs Shift Capacity
    valid_hours = len(payload.college_settings.time_slots) * len(payload.college_settings.days_active)
    total_requested_theory_hours = 0
    total_requested_practical_hours = 0

    for faculty in payload.faculty:
        load = sum(w.hours for w in faculty.workload)
        shift_size_per_day = len(faculty.shift)
        # Minus 1 for lunch slot if the lunch slot is inside their shift
        if payload.college_settings.lunch_slot in faculty.shift:
            shift_size_per_day -= 1
            
        max_possible_weekly_hrs = shift_size_per_day * len(payload.college_settings.days_active)

        if load > max_possible_weekly_hrs:
            errors.append(
                f"Validation Failed: {faculty.name} ({faculty.id}) has a target workload of {load} hours, "
                f"but their shift constraints only allow a maximum of {max_possible_weekly_hrs} hours per week."
            )
            
        for w in faculty.workload:
            if w.type.lower() == "theory":
                total_requested_theory_hours += w.hours
            else:
                total_requested_practical_hours += w.hours

    # 2. Infrastructure Global Availability Check
    total_available_theory_slots = len(payload.rooms.theory_rooms) * valid_hours
    if payload.college_settings.lunch_slot in payload.college_settings.time_slots:
        total_available_theory_slots -= len(payload.rooms.theory_rooms) * len(payload.college_settings.days_active)

    if total_requested_theory_hours > total_available_theory_slots:
         errors.append(
            f"Validation Failed: You require {total_requested_theory_hours} simultaneous Theory hours across the week, "
            f"but you only have {len(payload.rooms.theory_rooms)} classrooms available (Capacity: {total_available_theory_slots} hrs)."
        )

    return len(errors) == 0, errors
