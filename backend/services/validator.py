from schemas.api_models import GenerationPayload
from typing import List, Tuple

def validate_input_payload(payload: GenerationPayload) -> Tuple[bool, List[str]]:
    """
    Runs pre-generation math checks before the OR-Tools solver runs.
    Returns (is_valid, list_of_error_messages).
    """
    errors = []

    # 1. Gather all unique capabilities in the entire college
    available_room_tags = set()
    total_physical_room_count = len(payload.rooms_config.rooms)
    for r in payload.rooms_config.rooms:
        for tag in r.tags:
            available_room_tags.add(tag)

    valid_hours = len(payload.college_settings.time_slots) * len(payload.college_settings.days_active)
    
    # 2. Shift vs. Load Check (Considering Visiting Faculty Blocked Slots)
    for faculty in payload.faculty:
        load = sum(w.hours for w in faculty.workload)
        
        # Base shift size (num days * daily shift hours)
        shift_size_per_day = len(faculty.shift)
        
        # Minus 1 for daily lunch slot if it falls inside their shift
        if payload.college_settings.lunch_slot in faculty.shift:
            shift_size_per_day -= 1
            
        max_possible_weekly_hrs = (shift_size_per_day * len(payload.college_settings.days_active)) - len(faculty.blocked_slots)

        # Faculty Contract checking
        if load > faculty.max_load_hrs:
            errors.append(
                f"Validation Failed: {faculty.name} ({faculty.id}) has a target workload of {load} hours, "
                f"which exceeds their maximum contractual limit of {faculty.max_load_hrs} hours."
            )
            
        # Physical Temporal Impossibility checking
        if faculty.max_load_hrs > max_possible_weekly_hrs:
            errors.append(
                 f"Validation Failed: {faculty.name} ({faculty.id}) has a Max Load of {faculty.max_load_hrs} hrs, "
                 f"but after removing Lunch and {len(faculty.blocked_slots)} Blocked Slots, they are only physically present for {max_possible_weekly_hrs} hrs."
            )

        # 3. Tag Matching Check
        for w in faculty.workload:
            for tag in w.required_tags:
                if tag not in available_room_tags:
                     errors.append(
                        f"Validation Failed: {faculty.name} is scheduled to teach {w.subject} which requires the tag '{tag}'. "
                        f"There is no room in the infrastructure master data possessing this capability."
                     )
                     
    # 4. Capacity Check (Pigeonhole Principle)
    total_requested_class_hours = sum(
        w.hours
        for faculty in payload.faculty
        for w in faculty.workload
    )
    
    total_available_room_hours = total_physical_room_count * valid_hours
    if payload.college_settings.lunch_slot in payload.college_settings.time_slots:
        total_available_room_hours -= total_physical_room_count * len(payload.college_settings.days_active)

    if total_requested_class_hours > total_available_room_hours:
        errors.append(
             f"Validation Failed: The total college workload requires {total_requested_class_hours} simultaneous hours, "
             f"but the {total_physical_room_count} available rooms can only support {total_available_room_hours} total hours."
        )

    return len(errors) == 0, errors
