import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { AnalysisReport } from '@/components/AnalysisReport';
import { AnalysisRunner } from '@/components/AnalysisRunner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ShareButton } from '@/components/ShareButton';

interface ReportPageProps {
    params: {
        id: string;
    };
}

export default async function ReportPage({ params: paramsPromise }: ReportPageProps) {
    const params = await paramsPromise;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch analysis
    const { data: analysis, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !analysis) {
        notFound();
    }

    const isCompleted = analysis.status === 'completed';
    const result = analysis.result; // note: renamed result_json to result in new schema

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navbar user={user} />

            <div className="border-b border-border/40 bg-secondary/5">
                <div className="max-w-[1600px] mx-auto px-6 py-3 flex justify-between items-center">
                    <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        {user ? 'Back to Dashboard' : 'Back to Home'}
                    </Link>
                    <ShareButton />
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto px-6 py-12">
                {isCompleted && result ? (
                    <AnalysisReport data={result} repoUrl={analysis.repo_url} />
                ) : (
                    <AnalysisRunner
                        analysisId={analysis.id}
                        repoUrl={analysis.repo_url}
                        initialStatus={analysis.status}
                    />
                )}
            </main>
        </div>
    );
}
