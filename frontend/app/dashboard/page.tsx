"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, FileText, CheckCircle2, Clock, Upload, Users, Building, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolverLoadingGear } from "@/components/ui/svg-illustrations";

const stats = [
    { name: "Total Faculty", value: "142", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { name: "Available Rooms", value: "86", icon: Building, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
    { name: "Active Batches", value: "48", icon: GraduationCap, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10" },
];

export default function DashboardOverview() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);

    const startGeneration = () => {
        setIsGenerating(true);
        setGenerationStep(0);

        // Simulate CP-SAT Solver states
        setTimeout(() => setGenerationStep(1), 2000); // Resolving room conflicts
        setTimeout(() => setGenerationStep(2), 5000); // Finalizing shifts
        setTimeout(() => {
            setGenerationStep(3); // Complete
            setTimeout(() => {
                setIsGenerating(false);
                // Redirect or show success toast in real app
                window.location.href = "/dashboard/timetable";
            }, 1500);
        }, 8000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage master data and trigger timetable generation.</p>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                                <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-50">{stat.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column: Data Ingestion */}
                <div className="xl:col-span-2 space-y-4">
                    <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle>Master Data Ingestion</CardTitle>
                            <CardDescription>Upload or modify institutional constraints and capacities.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="faculty" className="w-full">
                                <TabsList className="w-full justify-start border-b border-slate-200 dark:border-slate-800 rounded-none bg-transparent p-0 h-12">
                                    <TabsTrigger value="faculty" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-12 px-6">Faculty</TabsTrigger>
                                    <TabsTrigger value="rooms" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-12 px-6">Rooms</TabsTrigger>
                                    <TabsTrigger value="constraints" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-12 px-6">Constraints</TabsTrigger>
                                </TabsList>

                                <TabsContent value="faculty" className="pt-6">
                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-10 flex flex-col items-center justify-center text-center">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
                                            <Upload className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                                        </div>
                                        <h3 className="font-medium text-slate-900 dark:text-slate-50 mb-1">Upload Faculty Database</h3>
                                        <p className="text-sm text-slate-500 mb-4 max-w-sm">Import a CSV containing faculty IDs, names, shift types (e.g. 8-4), and max load hours.</p>
                                        <Button variant="outline">Browse Files</Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="rooms" className="pt-6 text-slate-500">Rooms configuration table goes here...</TabsContent>
                                <TabsContent value="constraints" className="pt-6 text-slate-500">Global constraint settings (lunch breaks, max continuous lectures) go here...</TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: IA Generation Trigger */}
                <div className="xl:col-span-1">
                    <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 h-full relative overflow-hidden flex flex-col">

                        {/* Background glowing orb */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 dark:bg-blue-600/20 blur-[60px] rounded-full pointer-events-none" />

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                                AI Solver Engine
                            </CardTitle>
                            <CardDescription>Generate an optimal collision-free timetable conforming to all hard and soft constraints.</CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col items-center justify-center py-10 min-h-[320px]">
                            <AnimatePresence mode="wait">
                                {!isGenerating ? (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="w-full flex flex-col items-center"
                                    >
                                        <Button
                                            size="lg"
                                            onClick={startGeneration}
                                            className="w-full h-16 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-600/25 group transition-all duration-300 hover:shadow-blue-600/40"
                                        >
                                            <Play className="w-5 h-5 mr-3 fill-white/20 group-hover:fill-white/40 transition-all" />
                                            Generate Smart Timetable
                                        </Button>
                                        <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            Estimated solving time: ~45s
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="generating"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full flex flex-col items-center text-center space-y-6"
                                    >
                                        <div className="relative w-32 h-32 flex justify-center items-center">
                                            {generationStep < 3 ? (
                                                <SolverLoadingGear className="w-full h-full drop-shadow-lg" />
                                            ) : (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-24 h-24 bg-teal-500 rounded-full flex justify-center items-center shadow-lg shadow-teal-500/30"
                                                >
                                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="space-y-1 w-full">
                                            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50">
                                                {generationStep === 0 && "Parsing constraints..."}
                                                {generationStep === 1 && "Running CP-SAT Solver..."}
                                                {generationStep === 2 && "Optimizing soft constraints..."}
                                                {generationStep === 3 && "Generation Complete!"}
                                            </h3>

                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
                                                <motion.div
                                                    className="bg-gradient-to-r from-blue-500 to-teal-400 h-full"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: generationStep === 0 ? "25%" : generationStep === 1 ? "60%" : generationStep === 2 ? "90%" : "100%" }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>

                                            <p className="text-sm text-slate-500 font-mono mt-3">
                                                {generationStep === 0 && "> Initializing Google OR-Tools..."}
                                                {generationStep === 1 && "> Resolving room/teacher conflicts (4,231 vars)"}
                                                {generationStep === 2 && "> Distributing lunch breaks & gaps"}
                                                {generationStep === 3 && "> Saving to Supabase..."}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>

                        <CardFooter className="bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800/50 text-xs text-slate-500 p-4">
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            Last generation generated 3 days ago by Admin.
                        </CardFooter>
                    </Card>
                </div>

            </div>
        </div>
    );
}
