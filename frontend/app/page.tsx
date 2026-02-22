import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroAbstractSVG } from "@/components/ui/svg-illustrations";
import { ArrowRight, Calendar, Users, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-teal-500/30 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400">
              ShiftSync
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          {/* Background glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-blue-500/20 dark:bg-blue-600/20 blur-[100px] rounded-full -z-10" />
          <div className="absolute top-32 right-0 w-[400px] h-[400px] bg-purple-500/20 dark:bg-purple-600/20 blur-[120px] rounded-full -z-10" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6 ring-1 ring-inset ring-blue-600/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Intelligent Scheduling Engine
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
                Master time, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  effortlessly.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
                ShiftSync uses advanced CP-SAT solvers to orchestrate complex institutional timetables, resolve conflicts, and manage resources in real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl shadow-slate-900/10">
                    Enter the Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                    See how it works
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  Role-Based Security
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-500" />
                  Smart Substitution
                </div>
              </div>
            </div>

            {/* Right: Abstract SVG */}
            <div className="relative w-full aspect-square max-w-[600px] mx-auto lg:ml-auto">
              <HeroAbstractSVG className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
