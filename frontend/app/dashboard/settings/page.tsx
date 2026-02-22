"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Save, Loader2, Key, ShieldCheck, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [institutionId, setInstitutionId] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [isSavingName, setIsSavingName] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || "");
                const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
                if (profile) {
                    setName(profile.full_name || "");
                    setInstitutionId(profile.institution_id || "Not Configured Yet");
                }
            }
            setIsMounted(true);
        };
        fetchUserData();
    }, [supabase]);

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingName(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not logged in");

            const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
            if (error) throw error;

            alert("Admin Name updated successfully!");
        } catch (err: any) {
            alert(err.message || "Failed to update profile.");
        }
        setIsSavingName(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
        setIsSavingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;

            alert("Security password updated successfully!");
            setNewPassword("");
        } catch (err: any) {
            alert(err.message || "Failed to update password.");
        }
        setIsSavingPassword(false);
    };

    if (!isMounted) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                    Admin Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage your account security and visual identity within ShiftSync.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Profile Card */}
                <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-800/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            General Profile
                        </CardTitle>
                        <CardDescription>Update your display name and view system bindings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateName} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Account Email (Read Only)</Label>
                                <Input disabled value={email} className="bg-slate-100 dark:bg-slate-900 border-none text-slate-500" />
                            </div>
                            <div className="space-y-2">
                                <Label>Institution / College ID (Read Only)</Label>
                                <Input disabled value={institutionId} className="bg-slate-100 dark:bg-slate-900 border-none text-slate-500 font-mono text-xs" />
                            </div>
                            <div className="space-y-2 pt-2">
                                <Label>Display Name</Label>
                                <Input
                                    required
                                    placeholder="Prof. John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <Button disabled={isSavingName} type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                                {isSavingName ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Profile
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security Card */}
                <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-orange-200 dark:hover:border-orange-800/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-orange-500" />
                            Security Configuration
                        </CardTitle>
                        <CardDescription>Safely rotate your admin authentication credentials.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-3 rounded-lg text-xs text-orange-800 dark:text-orange-200">
                                <strong>Warning:</strong> Updating your password will immediately terminate all other active ShiftSync sessions linked to your email.
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label>New Password</Label>
                                <Input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <Button disabled={isSavingPassword || newPassword.length === 0} type="submit" variant="outline" className="w-full mt-4 border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-900/40 dark:hover:bg-orange-900/20 dark:hover:text-orange-300">
                                {isSavingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Integration Card */}
                <Card className="md:col-span-2 border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-800/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-500" />
                            Google Calendar API Integration
                        </CardTitle>
                        <CardDescription>Connect ShiftSync to your Google Workspace to automatically push timetables to Google Calendar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 p-4 rounded-lg text-sm text-purple-800 dark:text-purple-200">
                                <h4 className="font-semibold mb-2">Setup Required (Developer Mode)</h4>
                                <p className="mb-2">Before you can use this feature, you must configure a Google Cloud Project with the Calendar API enabled to allow Supabase to proxy events.</p>
                                <ol className="list-decimal pl-5 space-y-1 text-xs text-purple-700 dark:text-purple-300">
                                    <li>Go to Google Cloud Console and create a new project.</li>
                                    <li>Enable the <strong>Google Calendar API</strong>.</li>
                                    <li>Create OAuth Web Credentials with Redirect URI pointing to your Supabase Auth Callback.</li>
                                    <li>Add the Client ID and Secret to your Supabase Dashboard under Authentication &gt; Providers &gt; Google.</li>
                                    <li>Add <code className="bg-purple-100 dark:bg-purple-900/40 px-1 rounded">https://www.googleapis.com/auth/calendar.events</code> to the Scopes in Supabase.</li>
                                </ol>
                            </div>

                            <Button variant="outline" className="w-full md:w-auto border-purple-200 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-900/40 dark:hover:bg-purple-900/20 dark:hover:text-purple-300" onClick={async () => {
                                const { error } = await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        scopes: 'https://www.googleapis.com/auth/calendar.events',
                                        redirectTo: `${window.location.origin}/auth/callback`
                                    }
                                });
                                if (error) alert("Failed to connect: " + error.message);
                            }}>
                                <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                Connect Google Workspace for Calendar Sync
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
