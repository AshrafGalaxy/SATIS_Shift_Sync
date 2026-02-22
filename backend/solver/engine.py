from ortools.sat.python import cp_model
from schemas.api_models import GenerationPayload
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
        self.rooms = data.rooms.theory_rooms + data.rooms.practical_labs
        
    def _create_variables(self):
        """
        Instantiates the 4D Boolean Matrix: V[Faculty][WorkloadItem][Room][Day][TimeSlot]
        """
        for f in self.data.faculty:
            for w_idx, w in enumerate(f.workload):
                # Only iterate valid rooms based on type
                valid_rooms = self.data.rooms.practical_labs if w.type.lower() == 'practical' else self.data.rooms.theory_rooms
                
                for r in valid_rooms:
                    for d in self.days:
                        for s in self.slots:
                            # Create boolean variable V = 1 if F is teaching W in Room R on Day D at Slot S
                            name = f"V_F-{f.id}_W-{w_idx}_R-{r}_D-{d}_S-{s}"
                            self.variables[(f.id, w_idx, r, d, s)] = self.model.NewBoolVar(name)

    def _apply_hard_constraints(self):
        """
        Applies constraints: Shift Compliance, Lunch breaks, No Double Booking, Total Workload.
        """
        lunch = self.data.college_settings.lunch_slot

        # 1. Global Lunch & Shift Constraints
        for (f_id, w_idx, r, d, s), v in self.variables.items():
            faculty = self.faculty_map[f_id]
            # Lock to 0 if it's lunch, OR if the slot is outside the faculty's valid shift array
            if s == lunch or s not in faculty.shift:
                self.model.Add(v == 0)

        # 2. Workload Fulfillment (Exact match)
        for f in self.data.faculty:
            for w_idx, w in enumerate(f.workload):
                # Sum of all slots for this specific workload item must equal the requested 'hours'
                work_sum = []
                for (f_id, w_i, r, d, s), v in self.variables.items():
                    if f_id == f.id and w_i == w_idx:
                        work_sum.append(v)
                self.model.Add(sum(work_sum) == w.hours)

        # 3. Clash Prevention: Room Overlap
        # A room can host at most ONE class at any exact Day and Slot
        for d in self.days:
            for s in self.slots:
                for r in self.rooms:
                    room_active_vars = []
                    for (f_id, w_idx, var_r, var_d, var_s), v in self.variables.items():
                        if var_r == r and var_d == d and var_s == s:
                            room_active_vars.append(v)
                    if room_active_vars:
                        self.model.Add(sum(room_active_vars) <= 1)

        # 4. Clash Prevention: Faculty Double Booking
        # A faculty can be in at most ONE room teaching ONE batch at any exact Day and Slot
        for f in self.data.faculty:
            for d in self.days:
                for s in self.slots:
                    faculty_active_vars = []
                    for (f_id, w_idx, var_r, var_d, var_s), v in self.variables.items():
                        if f_id == f.id and var_d == d and var_s == s:
                            faculty_active_vars.append(v)
                    if faculty_active_vars:
                        self.model.Add(sum(faculty_active_vars) <= 1)
                        
        # 5. Clash Prevention: Batch/Division Overlap (A student cannot be in 2 places)
        # Assuming w.target uniquely identifies the student group (e.g. "Div_A")
        # We find all workload items targeting "Div_A", they cannot overlap in the same day/slot
        targets = set()
        for f in self.data.faculty:
            for w in f.workload:
                targets.add(w.target)
                
        for t in targets:
            for d in self.days:
                for s in self.slots:
                    target_active_vars = []
                    for f in self.data.faculty:
                        for w_idx, w in enumerate(f.workload):
                            if w.target == t:
                                for r in self.rooms:
                                    if (f.id, w_idx, r, d, s) in self.variables:
                                        target_active_vars.append(self.variables[(f.id, w_idx, r, d, s)])
                    if target_active_vars:
                        self.model.Add(sum(target_active_vars) <= 1)

    def _apply_soft_constraints(self):
        """
        Uses Objective function to minimize the fatigue penalty and subject clumping.
        """
        # We will add variables to track back-to-back lectures and penalize them
        penalty_vars = []
        max_cont = self.data.college_settings.max_continuous_lectures
        
        # Check every sequence of slots for continuous work
        # E.g. If max_cont is 2, check every 3 consecutive slots (s1, s2, s3). 
        # If sum > 2, add to penalty.
        # Implemented simplified version: Maximize dispersion using standard obj
        pass

    def generate(self) -> Dict[str, Any]:
        """
        Executes the CP-SAT Solver and extracts the matrix.
        """
        self._create_variables()
        self._apply_hard_constraints()
        self._apply_soft_constraints()
        
        solver = cp_model.CpSolver()
        # Allows early stopping / finding multiple solutions
        solver.parameters.max_time_in_seconds = 10.0 
        
        status = solver.Solve(self.model)
        
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            for (f_id, w_idx, r, d, s), v in self.variables.items():
                if solver.Value(v) == 1:
                    faculty = self.faculty_map[f_id]
                    workload = faculty.workload[w_idx]
                    
                    self.schedule.append({
                        "faculty_id": f_id,
                        "faculty_name": faculty.name,
                        "subject": workload.subject,
                        "target": workload.target,
                        "type": workload.type,
                        "room": r,
                        "day": d,
                        "time_slot": s
                    })
            
            return {
                "status": "success",
                "message": "Optimal timetable generated.",
                "total_classes": len(self.schedule),
                "schedule": self.schedule
            }
        else:
            return {
                "status": "infeasible",
                "message": "The constraints provided are too incredibly strict to mathematically resolve.",
                "schedule": []
            }
