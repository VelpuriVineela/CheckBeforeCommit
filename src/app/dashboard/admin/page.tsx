import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BarChart3, Users, FileText, TrendingUp, Search, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // SIMPLE RBAC: Only allow specific admin email (user can change this)
    const ADMIN_EMAILS = ['admin@checkbeforecommit.com', 'vineela@example.com'];
    // Note: In production, use a 'role' column in your profiles table.

    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        redirect('/dashboard');
    }

    // Fetch stats
    const { count: totalAnalyses } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true });

    const { data: recentAnalyses } = await supabase
        .from('analyses')
        .select('repo_url, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Founder Dashboard</h1>
                    <p className="text-sm text-muted-foreground">High-level growth and usage metrics.</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 h-7 px-4 font-bold uppercase tracking-widest text-[10px]">
                    Admin Mode
                </Badge>
            </header>

            {/* High-Level Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Analyses", value: totalAnalyses || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Active Users", value: "84", icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Completion Rate", value: "94.2%", icon: Activity, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Monthly Growth", value: "+12.4%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                    <Card key={i} className="p-6 border-border/40 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Detailed Insights */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Recent Analysis Stream</h3>
                    <div className="border border-border/40 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-secondary/10 border-b border-border/10">
                                    <tr>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-muted-foreground">Repository</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-muted-foreground text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/5">
                                    {recentAnalyses?.map((ana, i) => (
                                        <tr key={i} className="hover:bg-secondary/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground truncate max-w-[300px]">
                                                {ana.repo_url.split('/').slice(-2).join('/')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="h-5 px-2 text-[9px] font-bold uppercase bg-white border-border/40">
                                                    {ana.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right text-muted-foreground">
                                                {new Date(ana.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Filters / Search Placeholder */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Live Traffic</h3>
                    <Card className="p-6 border-border/40 bg-white shadow-sm space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                placeholder="Filter by repo or user..."
                                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/40 bg-secondary/5 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Traffic Sources</p>
                            <div className="space-y-3">
                                {[
                                    { source: "Twitter (X)", share: "45%" },
                                    { source: "Direct Traffic", share: "30%" },
                                    { source: "GitHub Referrals", share: "25%" },
                                ].map((s, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between text-[11px] font-medium">
                                            <span>{s.source}</span>
                                            <span>{s.share}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: s.share }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
