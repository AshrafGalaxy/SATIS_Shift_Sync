"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Server, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

export default function FacultyForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState("");
    const [maxHours, setMaxHours] = useState("");
    const [shiftStart, setShiftStart] = useState("8");
    const [shiftEnd, setShiftEnd] = useState("16");
    const [classTeacher, setClassTeacher] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingFaculty, setExistingFaculty] = useState<any[]>([]);
    const supabase = createClient();

    const fetchFaculty = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from("faculty_settings").select("*").eq("profile_id", user.id).order("created_at", { ascending: false });
        if (data) setExistingFaculty(data);
    };

    useEffect(() => {
        fetchFaculty();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not logged in");

            const { data: profile } = await supabase.from("profiles").select("institution_id").eq("id", user.id).single();
            if (!profile?.institution_id) throw new Error("No institution found");

            // Compute shift array (e.g. 8 to 16 -> [8,9,10,11,12,13,14,15,16])
            const start = parseInt(shiftStart);
            const end = parseInt(shiftEnd);
            const shiftArray = [];
            for (let i = start; i <= end; i++) shiftArray.push(i);

            const { error } = await supabase.from("faculty_settings").insert({
                profile_id: user.id, // Primary Faculty link
                max_load_hrs: parseInt(maxHours),
                shift_hours: shiftArray,
                blocked_slots: [],
                class_teacher_for: classTeacher || null
            });

            if (error) throw error;

            alert(`Faculty Rules configured!`);
            setMaxHours("");
            setClassTeacher("");
            fetchFaculty();
            onSuccess();
        } catch (err: any) {
            alert(err.message || "Failed to add faculty settings");
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto border border-slate-200 dark:border-slate-800 p-6 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            {/* IN-APP USER GUIDE */}
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-lg flex gap-3 text-sm text-blue-800 dark:text-blue-200 mb-4">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                    <strong>Faculty Constraints Guide:</strong> Configure precise limits for teachers. Setting accurate max load hours prevents burnout. Using 'Class Teacher Priority' ensures a specific faculty is given priority for their assigned batch/division's critical subjects.
                </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Configure Faculty Rules</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Maximum Teach Load (Weekly Hrs)</Label>
                    <Input required type="number" min="1" max="40" placeholder="16" value={maxHours} onChange={e => setMaxHours(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Class Teacher For (Optional)</Label>
                    <Input placeholder="e.g. SY-CSDS-A" value={classTeacher} onChange={e => setClassTeacher(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Shift Start Time (24h)</Label>
                    <Input required type="number" min="7" max="18" placeholder="8" value={shiftStart} onChange={e => setShiftStart(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Shift End Time (24h)</Label>
                    <Input required type="number" min="8" max="20" placeholder="16" value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} />
                </div>
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Save Personal Constraints
            </Button>

            {existingFaculty.length > 0 && (
                <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <Server className="w-4 h-4 text-emerald-500" />
                        Live Database Records ({existingFaculty.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {existingFaculty.map((f, i) => (
                            <div key={i} className="flex flex-col bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-sm">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Rule Set {existingFaculty.length - i}</span>
                                <div className="flex gap-3 text-slate-500 text-xs mt-1">
                                    <span>Max Hrs: {f.max_load_hrs}</span>
                                    <span>Shift: {f.shift_hours?.[0]}:00 - {f.shift_hours?.[f.shift_hours.length - 1] + 1}:00</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </form>
    );
}
