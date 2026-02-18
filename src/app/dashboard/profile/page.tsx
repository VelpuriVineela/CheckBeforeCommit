import { User, Mail, Shield, Smartphone, Key, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-20 space-y-16">
            <header className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground text-sm font-medium">Manage your identity and security across CheckBeforeCommit.</p>
            </header>

            <section className="space-y-12">
                {/* Personal Information */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60">
                        <User className="w-3.5 h-3.5" />
                        <span>Identity</span>
                    </div>
                    <div className="grid gap-8 p-6 rounded-2xl border border-border/40 bg-white shadow-sm">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Full Name</label>
                            <Input placeholder="Not provided" defaultValue={user.user_metadata?.full_name} className="h-10 border-border/40 focus:border-primary/40 transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Verified Email Address</label>
                            <div className="relative">
                                <Input value={user.email} readOnly className="h-10 bg-secondary/20 border-border/20 cursor-not-allowed pr-10" />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            </div>
                            <p className="text-[10px] text-muted-foreground/50 italic">Your email is managed via your authentication provider.</p>
                        </div>
                        <Button className="w-fit h-10 px-8 font-semibold bg-primary hover:bg-primary/90 transition-all">
                            Update Profile
                        </Button>
                    </div>
                </div>

                {/* Security */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Security & Access</span>
                    </div>
                    <div className="grid gap-4">
                        <div className="flex items-center justify-between p-5 rounded-2xl border border-border/40 bg-white shadow-sm group hover:border-primary/20 transition-all">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-foreground">Password Update</p>
                                    <p className="text-[11px] text-muted-foreground">Receive a secure link to reset your credentials.</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-9 px-4 font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">
                                Send Reset Link
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-5 rounded-2xl border border-border/40 bg-white shadow-sm group hover:border-primary/20 transition-all opacity-60">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-foreground">Multi-Factor Auth</p>
                                    <p className="text-[11px] text-muted-foreground">Enhance account security with SMS or App verification.</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="h-6 px-2 text-[9px] font-bold uppercase border-blue-200 text-blue-600 bg-blue-50/50">
                                Coming Soon
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
