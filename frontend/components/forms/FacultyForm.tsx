"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

export default function FacultyForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState("");
    const [maxHours, setMaxHours] = useState("");
    const [shiftStart, setShiftStart] = useState("8");
    const [shiftEnd, setShiftEnd] = useState("16");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

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
                blocked_slots: []
            });

            if (error) throw error;

            alert(`Faculty Rules configured!`);
            onSuccess();
        } catch (err: any) {
            alert(err.message || "Failed to add faculty settings");
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto border border-slate-200 dark:border-slate-800 p-6 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Configure Global Faculty Rules</h3>
            <p className="text-xs text-slate-500 mb-4">You are currently setting the constraints for your own AI profile mapping.</p>

            <div className="space-y-2">
                <Label>Maximum Teach Load (Weekly Hours)</Label>
                <Input required type="number" min="1" max="40" placeholder="16" value={maxHours} onChange={e => setMaxHours(e.target.value)} />
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
        </form>
    );
}
