"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, MapPin, Clock, Search, Send, UserX, AlertTriangle, CheckCircle2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const todayClasses = [
    { id: "c1", time: "09:00 AM - 10:00 AM", subject: "Data Structures", room: "CS Lab 1", division: "A / Batch 1", type: "lab" },
    { id: "c2", time: "11:00 AM - 12:00 PM", subject: "Compilers", room: "Room 102", division: "C", type: "theory" },
    { id: "c3", time: "02:00 PM - 03:00 PM", subject: "Algorithms", room: "Seminar Hall", division: "A", type: "theory" },
];

export default function FacultyDashboard() {
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [isAbsentModalOpen, setIsAbsentModalOpen] = useState(false);
    const [isSearchingSub, setIsSearchingSub] = useState(false);
    const [substitutes, setSubstitutes] = useState<any[]>([]);
    const [requestSent, setRequestSent] = useState(false);

    const handleMarkAbsent = (classItem: any) => {
        setSelectedClass(classItem);
        setIsAbsentModalOpen(true);
        setRequestSent(false);
        setSubstitutes([]);
    };

    const findSubstitutes = () => {
        setIsSearchingSub(true);
        // Simulate backend search API delay
        setTimeout(() => {
            setSubstitutes([
                { id: "f1", name: "Prof. Alan Turing", dept: "Computer Science", load: "12/16 hrs", matchScore: 98 },
                { id: "f2", name: "Dr. Grace Hopper", dept: "Computer Science", load: "14/16 hrs", matchScore: 85 },
                { id: "f3", name: "Prof. John von Neumann", dept: "Mathematics", load: "8/12 hrs", matchScore: 72 },
            ]);
            setIsSearchingSub(false);
        }, 1500);
    };

    const sendRequest = (subId: string) => {
        // Simulate sending in-app request
        setRequestSent(true);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">

            {/* Header Profile */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">

                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="flex items-center gap-5 relative z-10">
                    <Avatar className="w-20 h-20 border-4 border-white dark:border-slate-950 shadow-md">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl font-bold">DS</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Dr. Smith</h1>
                        <p className="text-slate-500 dark:text-slate-400">Department of Computer Science</p>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Shift: 08:00 AM - 04:00 PM</Badge>
                            <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900">14 / 16 Weekly Hrs</Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <Button variant="outline" className="flex-1 md:flex-none">Download Timetable</Button>
                    <Button className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-600 border-red-200 shadow-none dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border-red-900/50">
                        Request Leave
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Left Col: Today's Schedule */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Today's Schedule
                    </h2>

                    <div className="space-y-3">
                        {todayClasses.map((c) => (
                            <Card key={c.id} className="border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.type === 'lab' ? 'bg-teal-500' : 'bg-blue-500'}`} />
                                <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex gap-6 items-center w-full sm:w-auto">
                                        <div className="text-center w-24 shrink-0">
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{c.time.split(" - ")[0]}</p>
                                            <p className="text-xs text-slate-500">{c.time.split(" - ")[1]}</p>
                                        </div>

                                        <div className="flex-1 border-l border-slate-100 dark:border-slate-800 pl-6 space-y-1 py-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4.5 ${c.type === 'lab' ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900'}`}>
                                                    {c.type.toUpperCase()}
                                                </Badge>
                                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Div {c.division}</span>
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{c.subject}</h3>
                                            <div className="text-sm text-slate-500 flex items-center gap-1.5 pt-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {c.room}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-auto flex justify-end">
                                        <Button
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                                            onClick={() => handleMarkAbsent(c)}
                                        >
                                            <UserX className="w-4 h-4 mr-2" />
                                            Mark Absent
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Col: Notifications & Quick Actions */}
                <div className="space-y-4">
                    <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                Pending Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-3 rounded-lg border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-500/5 text-sm">
                                <p className="font-medium text-slate-900 dark:text-slate-50 mb-1">Substitution Request</p>
                                <p className="text-slate-600 dark:text-slate-400 text-xs mb-3">Prof. Alan requested substitution for "Compilers" on Thursday 10:00 AM.</p>
                                <div className="flex gap-2">
                                    <Button size="sm" className="h-7 text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 w-full">Accept</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs w-full">Decline</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Substitution Modal UI */}
            <Dialog open={isAbsentModalOpen} onOpenChange={setIsAbsentModalOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserX className="w-5 h-5 text-red-500" />
                            Mark Absent & Find Substitute
                        </DialogTitle>
                        <DialogDescription>
                            {selectedClass && `You are marking yourself absent for ${selectedClass.subject} (${selectedClass.time}). The system will find available faculty.`}
                        </DialogDescription>
                    </DialogHeader>

                    {!requestSent ? (
                        <div className="space-y-4 py-2">
                            {substitutes.length === 0 ? (
                                <div className="flex justify-center py-6">
                                    <Button
                                        onClick={findSubstitutes}
                                        disabled={isSearchingSub}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-md"
                                    >
                                        {isSearchingSub ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                <Search className="w-5 h-5" />
                                            </motion.div>
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4 mr-2" />
                                                Search Available Substitutes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Matched Faculty</p>
                                    <AnimatePresence>
                                        {substitutes.map((sub, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={sub.id}
                                                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10 border border-slate-200 dark:border-slate-700">
                                                        <AvatarFallback>{sub.name.charAt(6)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-50">{sub.name}</p>
                                                        <p className="text-[10px] text-slate-500">Current Load: {sub.load}</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" onClick={() => sendRequest(sub.id)} className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm">
                                                    <Send className="w-3 h-3 mr-1.5" />
                                                    Request
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="py-10 flex flex-col items-center justify-center text-center space-y-3"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Request Sent Successfully</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
                                The selected faculty will receive an in-app notification to accept or decline the substitution.
                            </p>
                        </motion.div>
                    )}

                </DialogContent>
            </Dialog>

        </div>
    );
}
