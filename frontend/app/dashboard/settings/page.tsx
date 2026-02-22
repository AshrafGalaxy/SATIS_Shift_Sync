"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Save, Loader2, Key, ShieldCheck } from "lucide-react";
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

            </div>
        </div>
    );
}
