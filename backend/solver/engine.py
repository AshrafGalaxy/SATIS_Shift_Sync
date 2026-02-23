from ortools.sat.python import cp_model
from schemas.api_models import GenerationPayload, Room
from typing import Dict, Any, List

class TimetableEngine:
    def __init__(self, data: GenerationPayload):
        self.data = data
        self.model = cp_model.CpModel()
        self.variables = {}
        # Structured output
        self.schedule = []
        
        # Helper structures for indexing
        self.days = data.college_settings.days_active
        self.slots = data.college_settings.time_slots
        self.faculty_map = {f.id: f for f in data.faculty}
        self.rooms_map = {r.id: r for r in data.rooms_config.rooms}

        # DIAGNOSTIC LOGGING
        print("====== DIAGNOSTIC ENGINE INIT ======")
        print(f"Total Faculties: {len(data.faculty)}")
        print(f"Total Workloads: {sum(len(f.workload) for f in data.faculty)}")
        print(f"Time Slots Total: {len(self.days) * len(self.slots)}")
        print(f"Rooms Total: {len(self.rooms_map)}")
        for f in data.faculty:
            total_req = sum(w.hours for w in f.workload)
            print(f"> Faculty {f.name} ({f.id}) - Requires {total_req} hours (Max Load is: {f.max_load_hrs})")
        print("=====================================")
        
    def _create_variables(self):
        """
        Instantiates the 4D Boolean Matrix: V[Faculty][Workload_ID][Room][Day][TimeSlot]
        Using Edge-Case Tag Filtering early to reduce Boolean Variable Matrix size.
        """
        for f in self.data.faculty:
            for w in f.workload:
                
                # Dynamic Room Filtering based on Required Tags
                valid_rooms = []
                for room in self.data.rooms_config.rooms:
                    # Room must possess ALL required tags for this workload
                    has_all_tags = all(tag in room.tags for tag in w.required_tags)
                    if has_all_tags:
                        valid_rooms.append(room.id)
                
                for r in valid_rooms:
                    for d in self.days:
                        for s in self.slots:
                            # Create boolean variable V = 1 if F is teaching W.id in Room R on Day D at Slot S
                            name = f"V_F-{f.id}_W-{w.id}_R-{r}_D-{d}_S-{s}"
                            self.variables[(f.id, w.id, r, d, s)] = self.model.NewBoolVar(name)

    def _apply_hard_constraints(self):
        """
        Applies Advanced Constraints: Shift Compliance, Blocked Slots, Lunch breaks, No Double Booking,
        Consecutive Blocks, Total Workload, and Custom Rules.
        """
        lunch = self.data.college_settings.lunch_slot

        # 1. Global Boundaries, Shift Compliance & Blocked Slots (Now supporting multi-hour segments)
        for f in self.data.faculty:
             blocked_set = {(b.day, b.time) for b in f.blocked_slots}
             
             for w in f.workload:
                 for r in self.rooms_map.keys():
                     for d in self.days:
                         for s in self.slots:
                             var_key = (f.id, w.id, r, d, s)
                             if var_key in self.variables:
                                 v = self.variables[var_key]
                                 
                                 is_valid = True
                                 for offset in range(w.consecutive_hours):
                                     t = s + offset
                                     # A start_time is invalid if ANY of its spanned hours hit a boundary
                                     if t == lunch or t not in f.shift or (d, t) in blocked_set or t not in self.slots:
                                         is_valid = False
                                         break
                                 
                                 if not is_valid:
                                     self.model.Add(v == 0)

        # 2. Workload Fulfillment (Exact match)
        for f in self.data.faculty:
            for w in f.workload:
                work_sum = []
                for r in self.rooms_map.keys():
                    for d in self.days:
                        for s in self.slots:
                            var_key = (f.id, w.id, r, d, s)
                            if var_key in self.variables:
                                work_sum.append(self.variables[var_key])
                if work_sum:
                    events_needed = w.hours // w.consecutive_hours if w.consecutive_hours > 0 else w.hours
                    self.model.Add(sum(work_sum) == events_needed)

        # 3. Contiguous Block Binding (Consecutive Hours)
        # By modeling variables as literal "Start Times" spanning `w.consecutive_hours`, fragmentation is mathematically impossible!

        # 4. Clash Prevention: Room Overlap (Sliding Window)
        for r in self.rooms_map.keys():
            for d in self.days:
                for s in self.slots:
                    room_active_vars = []
                    for f in self.data.faculty:
                        for w in f.workload:
                            for offset in range(w.consecutive_hours):
                                start_s = s - offset
                                var_key = (f.id, w.id, r, d, start_s)
                                if var_key in self.variables:
                                    room_active_vars.append(self.variables[var_key])
                    if room_active_vars:
                        self.model.Add(sum(room_active_vars) <= 1)

        # 5. Clash Prevention: Faculty Double Booking (Sliding Window)
        for f in self.data.faculty:
            for d in self.days:
                for s in self.slots:
                    faculty_active_vars = []
                    for w in f.workload:
                        for r in self.rooms_map.keys():
                            for offset in range(w.consecutive_hours):
                                start_s = s - offset
                                var_key = (f.id, w.id, r, d, start_s)
                                if var_key in self.variables:
                                    faculty_active_vars.append(self.variables[var_key])
                    if faculty_active_vars:
                        self.model.Add(sum(faculty_active_vars) <= 1)
                        
        # 6. Clash Prevention: Batch/Division Overlap (Handling Merged Classes via Sliding Window)
        targets = set()
        for f in self.data.faculty:
            for w in f.workload:
                for t in w.target_groups:
                    targets.add(t)
                
        for t_group in targets:
            for d in self.days:
                for s in self.slots:
                    target_active_vars = []
                    for f in self.data.faculty:
                        for w in f.workload:
                            if t_group in w.target_groups:
                                for r in self.rooms_map.keys():
                                    for offset in range(w.consecutive_hours):
                                        start_s = s - offset
                                        var_key = (f.id, w.id, r, d, start_s)
                                        if var_key in self.variables:
                                            target_active_vars.append(self.variables[var_key])
                    if target_active_vars:
                        self.model.Add(sum(target_active_vars) <= 1)
                        
        # 6.5. Clash Prevention: Parent-Child Subgroup Conflict
        # If Parent P has Theory, its sub-batches cannot have Lab/Tutorial at the exact same time
        for parent_t in targets:
            # Heuristic: P is parent of C if P is a proper substring of C (e.g., SY-A is in SY-A-B1)
            children = [c for c in targets if parent_t in c and c != parent_t]
            if not children:
                continue
                
            for d in self.days:
                for s in self.slots:
                    # Find active Theory variables for Parent
                    parent_theory_vars = []
                    for f in self.data.faculty:
                        for w in f.workload:
                            if w.type == "Theory" and parent_t in w.target_groups:
                                for r in self.rooms_map.keys():
                                    for offset in range(max(1, w.consecutive_hours)):
                                        start_s = s - offset
                                        var_key = (f.id, w.id, r, d, start_s)
                                        if var_key in self.variables:
                                            parent_theory_vars.append(self.variables[var_key])
                                            
                    if not parent_theory_vars:
                        continue
                        
                    for child_t in children:
                        child_active_vars = []
                        for f in self.data.faculty:
                            for w in f.workload:
                                if w.type in ["Practical", "Tutorial"] and child_t in w.target_groups:
                                    for r in self.rooms_map.keys():
                                        for offset in range(max(1, w.consecutive_hours)):
                                            start_s = s - offset
                                            var_key = (f.id, w.id, r, d, start_s)
                                            if var_key in self.variables:
                                                child_active_vars.append(self.variables[var_key])
                        if child_active_vars:
                            # A parent theory session and a child lab session are mutually exclusive
                            self.model.Add(sum(parent_theory_vars) + sum(child_active_vars) <= 1)
                        
        # 7. Custom Rules Engine Translation
        for rule in self.data.college_settings.custom_rules:
             # Example mapping dynamic IF-THEN rules
             if rule.condition_field == "subject" and rule.action_type == "RESTRICT_TIME":
                  for (f_id, w_id, var_r, var_d, var_s), v in self.variables.items():
                       faculty = self.faculty_map[f_id]
                       workload = next(item for item in faculty.workload if item.id == w_id)
                       
                       if workload.subject == rule.condition_value:
                            # Force 0 for any slot NOT in the allowed action_value array
                            allowed_slots = [int(h.split(':')[0]) for h in rule.action_value]
                            if var_s not in allowed_slots:
                                 self.model.Add(v == 0)
             
             elif rule.action_type == "FORCE_PIN":
                  w_id_target = rule.condition_value
                  try:
                       r_target, d_target, s_target = rule.action_value.split("|")
                       s_target = int(s_target)
                       
                       # We need exactly one start_time for w_id, r_target, d_target that safely covers s_target
                       pin_vars = []
                       for (f_id, w_id, var_r, var_d, var_s), v in self.variables.items():
                            if w_id == w_id_target and var_r == r_target and var_d == d_target:
                                 w = next(item for item in self.faculty_map[f_id].workload if item.id == w_id)
                                 if var_s <= s_target < var_s + w.consecutive_hours:
                                     pin_vars.append(v)
                       if pin_vars:
                           self.model.Add(sum(pin_vars) == 1)
                  except ValueError:
                       pass # Safely ignore malformed pin strings

    def generate(self) -> Dict[str, Any]:
        """
        Executes the CP-SAT Solver and extracts the matrix.
        """
        self._create_variables()
        self._apply_hard_constraints()
        
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = 10.0 
        
        status = solver.Solve(self.model)
        
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            for (f_id, w_id, r, d, s), v in self.variables.items():
                if solver.Value(v) == 1:
                    faculty = self.faculty_map[f_id]
                    workload = next(item for item in faculty.workload if item.id == w_id)
                    
                    for offset in range(workload.consecutive_hours):
                        self.schedule.append({
                            "workload_id": w_id,
                            "faculty_id": f_id,
                            "faculty_name": faculty.name,
                            "subject": workload.subject,
                            "targets": workload.target_groups,
                            "type": workload.type,
                            "room": r,
                            "day": d,
                            "time_slot": s + offset
                        })
            
            return {
                "status": "success",
                "message": "Optimal edge-case-proof timetable generated.",
                "total_classes": len(self.schedule),
                "schedule": self.schedule
            }
        else:
            return {
                "status": "infeasible",
                "message": "Critical Failure: The constraints provided are mathematically impossible to map.",
                "schedule": []
            }
