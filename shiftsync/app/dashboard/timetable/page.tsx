"use client";

import { useState } from "react";
import { Filter, Download, Plus, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

// Dummy data representing generated slots
const mockSlots = [
    { day: "Monday", time: "08:00 AM", subject: "Data Structures", faculty: "Dr. Smith", room: "Lab 1", division: "A", type: "lab" },
    { day: "Monday", time: "09:00 AM", subject: "Data Structures", faculty: "Dr. Smith", room: "Lab 1", division: "A", type: "lab" },
    { day: "Monday", time: "10:00 AM", subject: "Operating Systems", faculty: "Prof. Johnson", room: "Room 102", division: "A", type: "theory" },
    { day: "Tuesday", time: "11:00 AM", subject: "Computer Networks", faculty: "Dr. Alan", room: "Room 204", division: "B", type: "theory" },
    { day: "Wednesday", time: "01:00 PM", subject: "AI", faculty: "Dr. Turing", room: "Room 305", division: "C", type: "theory" },
];

export default function MasterTimetableView() {
    const [activeFilter, setActiveFilter] = useState("All Divisions");

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col pt-2 animate-in fade-in duration-500">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Master Timetable</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and resolve remaining conflicts across all divisions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <select
                            className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 appearance-none h-9"
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                        >
                            <option>All Divisions</option>
                            <option>Division A</option>
                            <option>Division B</option>
                            <option>Division C</option>
                        </select>
                    </div>
                    <Button variant="outline" size="sm" className="h-9">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Fullscreen Focus
                    </Button>
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm relative">
                <div className="min-w-[1000px] h-full inline-block">
                    {/* Header Row (Times) */}
                    <div className="flex sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-24 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 sticky left-0 z-30 flex items-center justify-center font-medium text-xs text-slate-500">
                            Day / Time
                        </div>
                        {TIMES.map((time) => (
                            <div key={time} className="flex-1 min-w-[140px] border-r border-slate-200 dark:border-slate-800 p-3 text-center font-semibold text-xs text-slate-700 dark:text-slate-300">
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Body Rows (Days) */}
                    <div className="flex flex-col">
                        {DAYS.map((day) => (
                            <div key={day} className="flex border-b border-slate-100 dark:border-slate-800/50 group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                {/* Fixed Left Column (Day Name) */}
                                <div className="w-24 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sticky left-0 z-10 flex items-center justify-center font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:bg-slate-50 dark:group-hover:bg-slate-900/80 transition-colors shadow-[1px_0_5px_rgba(0,0,0,0.02)]">
                                    <span className="-rotate-90 md:rotate-0 tracking-widest md:tracking-normal uppercase md:capitalize text-xs md:text-sm">
                                        {day}
                                    </span>
                                </div>

                                {/* Slots Wrapper */}
                                <div className="flex flex-1 relative">
                                    {TIMES.map((time) => {
                                        const slot = mockSlots.find(s => s.day === day && s.time === time);
                                        const isLunch = time === "12:00 PM";

                                        if (isLunch) {
                                            return (
                                                <div key={time} className="flex-1 min-w-[140px] border-r border-slate-100 dark:border-slate-800/50 p-2 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-medium italic">
                                                    <span>Lunch Break</span>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={time} className="flex-1 min-w-[140px] border-r border-slate-100 dark:border-slate-800/50 p-1.5 relative group/slot">
                                                {slot ? (
                                                    <div className={`h-full w-full rounded-md p-2 flex flex-col justify-between border cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${slot.type === 'lab'
                                                            ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20 hover:border-teal-300 dark:hover:border-teal-500/40'
                                                            : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40'
                                                        }`}>
                                                        <div>
                                                            <div className="flex justify-between items-start mb-1">
                                                                <Badge variant="outline" className={`text-[9px] px-1 py-0 h-4 border-none ${slot.type === 'lab' ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'}`}>
                                                                    Div {slot.division}
                                                                </Badge>
                                                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">{slot.room}</span>
                                                            </div>
                                                            <p className={`text-xs font-bold truncate ${slot.type === 'lab' ? 'text-teal-900 dark:text-teal-100' : 'text-blue-900 dark:text-blue-100'}`}>
                                                                {slot.subject}
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-1">
                                                            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                                                                {/* Faculty Avatar Mock */}
                                                            </div>
                                                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium truncate">
                                                                {slot.faculty}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full w-full rounded-md border border-dashed border-slate-200 dark:border-slate-800 opacity-0 group-hover/slot:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                        <Plus className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
