import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Github, ExternalLink, Clock, Search, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default async function HistoryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: analyses } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Analysis History</h1>
                    <p className="text-sm text-muted-foreground">Manage and review your previous codebase explorations.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search repositories..." className="h-9 pl-9 text-xs" />
                    </div>
                </div>
            </header>

            {!analyses || analyses.length === 0 ? (
                <div className="py-24 text-center border border-dashed border-border/40 rounded-2xl bg-secondary/5">
                    <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-4 border border-border/10">
                        <History className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">No history yet</h3>
                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Start by analyzing your first repository from the dashboard.</p>
                </div>
            ) : (
                <div className="border border-border/40 rounded-xl overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F7F7F7] border-b border-[#1A1A1A]/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-[#1A1A1A]/70">Repository</th>
                                <th className="px-6 py-4 font-semibold text-[#1A1A1A]/70">Status</th>
                                <th className="px-6 py-4 font-semibold text-[#1A1A1A]/70 text-right">Analyzed On</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1A1A1A]/5">
                            {analyses.map((analysis) => {
                                const repoName = analysis.repo_url.split('/').pop() || analysis.repo_url;
                                const date = new Date(analysis.created_at).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                });

                                return (
                                    <tr key={analysis.id} className="group hover:bg-[#FFF5ED] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-[#1A1A1A]/10 flex items-center justify-center">
                                                    <Github className="w-4 h-4 text-[#1A1A1A]/40 group-hover:text-[#FF7D29] transition-colors" />
                                                </div>
                                                <span className="font-medium text-[#1A1A1A] group-hover:text-[#FF7D29] transition-colors">{repoName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={analysis.status === 'completed' ? 'secondary' : analysis.status === 'failed' ? 'destructive' : 'outline'} className="text-[10px] h-4 px-1.5 font-bold uppercase tracking-wider bg-[#F4F4F5] text-[#1A1A1A] border-none">
                                                {analysis.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right text-[#1A1A1A]/50 text-xs font-medium">
                                            {date}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/report/${analysis.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#FF7D29]/10 text-[#1A1A1A]/40 hover:text-[#FF7D29] transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
