"use client";

import { useState } from "react";
import { Filter, Download, Plus, Map, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

const TIMES = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"];
const ROOMS = [
    { id: "L1", name: "CS Lab 1", type: "lab", capacity: 40 },
    { id: "L2", name: "CS Lab 2", type: "lab", capacity: 40 },
    { id: "R101", name: "Room 101", type: "theory", capacity: 60 },
    { id: "R102", name: "Room 102", type: "theory", capacity: 60 },
    { id: "R201", name: "Room 201", type: "theory", capacity: 80 },
    { id: "R202", name: "Room 202", type: "theory", capacity: 80 },
    { id: "S1", name: "Seminar Hall", type: "theory", capacity: 150 }
];

// Helper to generate a deterministic pseudo-random occupancy status
const getStatus = (roomId: string, timeIndex: number) => {
    if (timeIndex === 4) return "lunch"; // 12 PM is lunch
    const val = (roomId.charCodeAt(0) + roomId.charCodeAt(1) + timeIndex * 7) % 10;
    if (val < 4) return "free";
    if (val < 9) return "occupied";
    return "maintenance";
};

export default function ResourceHeatmapView() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRooms = ROOMS.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Currently tracking 7 resources across 2 wings.</p>
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
                                                {time}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {filteredRooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900 dark:text-slate-100">{room.name}</div>
                                                <div className="text-xs text-slate-500">Cap: {room.capacity} • {room.type}</div>
                                            </td>

                                            {TIMES.map((time, i) => {
                                                const status = getStatus(room.id, i);
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
                                                                <span className="text-[10px] font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
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
                        {filteredRooms.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No rooms found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
