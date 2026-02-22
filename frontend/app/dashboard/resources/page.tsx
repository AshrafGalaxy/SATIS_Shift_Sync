"use client";

import { useState, useEffect } from "react";
import { Filter, Download, Plus, Map, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

const TIMES = [8, 9, 10, 11, 12, 13, 14, 15, 16];

const mapMilitaryTo12Hour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h.toString().padStart(2, '0')}:00 ${period}`;
};

export default function ResourceHeatmapView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [rooms, setRooms] = useState<any[]>([]);
    const [matrices, setMatrices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState("Mon");

    const supabase = createClient();

    useEffect(() => {
        const fetchHeatmapData = async () => {
            setIsLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Not logged in");

                const { data: profile } = await supabase.from("profiles").select("institution_id").eq("id", user.id).single();
                if (!profile?.institution_id) throw new Error("No institution");

                // Fetch physical rooms
                const { data: dbRooms } = await supabase.from("rooms").select("*").eq("institution_id", profile.institution_id);
                setRooms(dbRooms || []);

                // Fetch live schedule
                const { data: latestTimetable } = await supabase
                    .from("generated_timetables")
                    .select("matrix_data")
                    .eq("institution_id", profile.institution_id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();

                if (latestTimetable?.matrix_data?.schedule) {
                    setMatrices(latestTimetable.matrix_data.schedule);
                }
            } catch (err) {
                console.warn("Heatmap fetch warning:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHeatmapData();
    }, []);

    const getStatus = (roomId: string, timeIndex: number) => {
        if (timeIndex === 13) return "lunch";

        // Find if any class is scheduled in this room at this specific time AND selected day
        const isOccupied = matrices.some(m => m.room === roomId && m.slot === timeIndex && m.day === selectedDay);
        return isOccupied ? "occupied" : "free";
    };

    const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Resource Heatmap</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Live view of room vacancies and occupancies.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search rooms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 shrink-0">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <select
                        className="pl-3 pr-8 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 appearance-none h-9 shadow-sm"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        {["Mon", "Tue", "Wed", "Thu", "Fri"].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Left Stats/Legend Panel */}
                <div className="md:col-span-1 space-y-4">
                    <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Status Legend</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                                    <span className="text-slate-700 dark:text-slate-300">Available</span>
                                </div>
                                <span className="font-semibold">32%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-slate-700 dark:text-slate-300">Occupied</span>
                                </div>
                                <span className="font-semibold">64%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-400" />
                                    <span className="text-slate-700 dark:text-slate-300">Maintenance</span>
                                </div>
                                <span className="font-semibold">4%</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-blue-50/50 dark:bg-blue-900/10">
                        <CardContent className="p-4 flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                                <Map className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">Campus Overview</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Currently tracking {rooms.length} physical resources across campus.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Heatmap Grid */}
                <div className="md:col-span-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Resource</th>
                                        {TIMES.map(time => (
                                            <th key={time} className="px-2 py-3 font-medium text-slate-500 dark:text-slate-400 text-center w-24">
                                                {mapMilitaryTo12Hour(time)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={10} className="py-20 text-center text-slate-500">
                                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 opacity-50 text-blue-600" />
                                                Loading Live Infrastructure Matrix...
                                            </td>
                                        </tr>
                                    ) : filteredRooms.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="py-20 text-center text-slate-500">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Map className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">No Data Available</h3>
                                                <p className="text-sm mt-1">Please ensure you have generated a timetable or added physical rooms.</p>
                                            </td>
                                        </tr>
                                    ) : filteredRooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900 dark:text-slate-100">{room.name}</div>
                                                <div className="text-xs text-slate-500">Cap: {room.capacity} • {room.type || "theory"}</div>
                                            </td>

                                            {TIMES.map((time) => {
                                                const status = getStatus(room.name, time);
                                                return (
                                                    <td key={time} className="px-2 py-3 text-center">
                                                        {status === "lunch" ? (
                                                            <div className="w-full h-8 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 italic">
                                                                Break
                                                            </div>
                                                        ) : (
                                                            <div className={`w-full h-8 rounded border flex items-center justify-center transition-all cursor-pointer hover:ring-2 hover:ring-offset-1 dark:hover:ring-offset-slate-950 ${status === 'free'
                                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:ring-emerald-500'
                                                                : status === 'occupied'
                                                                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 hover:ring-blue-500'
                                                                    : 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-400 hover:ring-orange-500'

                                                                }`}>
                                                                <span className="text-[10px] font-semibold tracking-wider uppercase transition-opacity">
                                                                    {status.slice(0, 4)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredRooms.length === 0 && !isLoading && (
                            <div className="p-8 text-center text-slate-500">
                                No rooms found matching &quot;{searchTerm}&quot;
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
