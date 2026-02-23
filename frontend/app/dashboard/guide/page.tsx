"use client";

import { BookOpen, Key, AlertTriangle, TableProperties, Workflow, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function GuidePage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    Constraints & Requirements Guide
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                    A comprehensive technical overview of how the ShiftSync AI Solver operates, required naming conventions, and constraints currently enforced.
                </p>
            </div>

            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Critical Requirements for Sub-Batches
                    </CardTitle>
                    <CardDescription className="text-red-600/80 dark:text-red-400/80 font-medium">
                        You MUST follow strict naming conventions to prevent Labs and Theory classes from clashing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-800 dark:text-slate-200">
                    <p>
                        The AI Solver uses a <strong>Substring Mapping Heuristic</strong> to link Batches (Practical/Tutorial) to their Parent Divisions (Theory). If a Parent Division is scheduled for a Theory class, the solver will physically block all of its child batches from being scheduled for Labs at that exact same time.
                    </p>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-red-100 dark:border-red-900/50">
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 font-bold mt-0.5">✕</span>
                                <div>
                                    <strong className="block text-red-700 dark:text-red-400">Incorrect Naming</strong>
                                    Parent: <code>SY-CSDS-A</code> <br />
                                    Child: <code>B1</code> <br />
                                    <em>(The solver does not know B1 belongs to SY-CSDS-A and they will clash.)</em>
                                </div>
                            </li>
                            <li className="flex items-start gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                                <div>
                                    <strong className="block text-emerald-700 dark:text-emerald-400">Correct Naming</strong>
                                    Parent: <code>SY-CSDS-A</code> <br />
                                    Child: <code>SY-CSDS-A-B1</code> or <code>SY-CSDS-A (B1)</code> <br />
                                    <em>(Because "SY-CSDS-A" is inside the child's text, the solver locks them together mathematically.)</em>
                                </div>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TableProperties className="w-5 h-5 text-blue-600" />
                        CSV Upload Standards
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-600 dark:text-slate-300">
                    <p>When mass-importing data via CSV on the Overview page, your Excel files must adhere to strict formatting rules:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Arrays & Lists:</strong> Any field that accepts multiple items (like <code>required_tags</code> for Rooms or <code>target_groups</code> for Workloads) must be separated by the pipe character <code>|</code>. (Example: <code>SY-CSDS-A|SY-CSDS-B</code> for a merged class).</li>
                        <li><strong>Tags:</strong> Ensure room tags exactly match the required tags in a faculty workload. A classroom cannot host an event unless it holds 100% of the tags requested.</li>
                        <li><strong>Empty Fields:</strong> Leave empty cells blank. The ingestion engine will automatically convert them to empty arrays or default values.</li>
                    </ul>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-8 mb-4 border-b pb-2 flex items-center gap-2">
                <Workflow className="w-6 h-6 text-purple-600" />
                Active Solver Constraints
            </h2>

            <Accordion type="single" collapsible className="w-full bg-white dark:bg-slate-950 rounded-lg border shadow-sm">

                <AccordionItem value="item-1">
                    <AccordionTrigger className="px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Lab Continuity (Consecutive Hours)
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/20">
                        <p>If a Workload is assigned <strong>Consecutive Hours {'>'} 1</strong> (e.g., a 2-hour Practical Lab):</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>It mathematically cannot be fragmented. It will be scheduled as a single, unbroken block of time.</li>
                            <li>The block strictly stays inside the exact same <strong>Room</strong> with the exact same <strong>Teacher</strong>.</li>
                            <li>The solver checks for boundary collisions: A 2-hour lab cannot start 1 hour before lunch, or 1 hour before the college day ends.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Shift & Shift-Block Boundaries
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/20">
                        <p>Faculty members are strictly bound by their defined shifts:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Global Lunch:</strong> No classes will ever be scheduled during the college-wide lunch slot.</li>
                            <li><strong>Faculty Shifts:</strong> A professor will only be scheduled within the array of timeslots defined in their setup.</li>
                            <li><strong>Blocked Slots:</strong> Visiting or part-time faculty can declare specific days and times as "Unavailable". Those are mathematically zeroed out and cannot be touched by the solver.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger className="px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Room & Faculty Double Booking Rules
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/20">
                        <p>The system utilizes a <strong>Sliding Window Offset Algorithm</strong> to prevent physical collisions:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>A specific Faculty member can only be in one place at one time.</li>
                            <li>A Room can only host a single event at any given time.</li>
                            <li>If a Room is hosting a 3-hour lab from 8:00 AM to 11:00 AM, the solver projects a shadow over 9:00 AM and 10:00 AM, barring any other events from being mapped there.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger className="px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Workload Hours Fulfillment
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/20">
                        <p>The total weekly hours demanded by a Workload must be fulfilled perfectly:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>If a faculty requires 4 hours of Theory, the solver assigns exactly 4 one-hour blocks across the week.</li>
                            <li>If a faculty requires 4 hours of Practical, and the Practical is a 2-hour continuous block, the solver translates this division intelligently and assigns exactly 2 two-hour blocks.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5 border-b-0">
                    <AccordionTrigger className="px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-2 font-semibold">
                            <Key className="w-5 h-5 text-emerald-500" />
                            Custom Rules & Pinned Classes
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/20">
                        <p>The OR-Tools python layer intercepts dynamic modifications applied by the Frontend:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>FORCE_PIN:</strong> When you lock an event in the UI, the frontend injects a dynamic constraint that mathematically bolts that specific Class, Faculty, Batch, and Room to exactly that Time and Day, randomizing everything else around it during a Shuffle.</li>
                            <li><strong>RESTRICT_TIME:</strong> Extensible backend rules map capabilities to restrict certain subjects (e.g., Mathematics) to only Morning or Afternoon slots automatically.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
}
