import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { AdminTables } from '@/components/admin/AdminTables';

const ALLOWED_ADMIN_EMAILS = [
    'founder1@email.com',
    'founder2@email.com',
    'admin@example.com' // Added for testing if needed
];

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Access Control
    if (!user) {
        redirect('/login');
    }

    if (!user.email || !ALLOWED_ADMIN_EMAILS.includes(user.email)) {
        redirect('/dashboard');
    }

    const adminClient = createAdminClient();

    // 2. Fetch Metrics
    // Total Users
    const { count: totalUsers } = await adminClient
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // Total Analyses
    const { count: totalAnalyses } = await adminClient
        .from('analyses')
        .select('*', { count: 'exact', head: true });

    // Success Rate
    const { count: successfulAnalyses } = await adminClient
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

    const successRate = totalAnalyses && totalAnalyses > 0
        ? ((successfulAnalyses || 0) / totalAnalyses * 100).toFixed(1)
        : 0;

    // Analyses last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: analysesLast7Days } = await adminClient
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', sevenDaysAgo.toISOString());

    // Analyses today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: analysesToday } = await adminClient
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', todayStart.toISOString());

    // 3. Fetch User Table Data (Simplified)
    // Fetch profiles and analyses counts for each
    const { data: profiles } = await adminClient
        .from('profiles')
        .select(`
      *,
      analyses (id)
    `)
        .limit(50);

    const userData = profiles?.map(p => ({
        id: p.id,
        email: p.email,
        fullName: p.full_name,
        signupDate: p.updated_at || 'N/A', // Fallback as created_at isn't in profiles
        totalAnalyses: p.analyses?.length || 0,
        lastActive: p.updated_at || 'N/A',
        plan: 'Free' // Placeholder for now
    })) || [];

    // 4. Fetch Recent Analyses
    const { data: recentAnalyses } = await adminClient
        .from('analyses')
        .select(`
      id,
      repo_url,
      status,
      created_at,
      user_id,
      profiles (email)
    `)
        .order('created_at', { ascending: false })
        .limit(20);

    const formattedAnalyses = recentAnalyses?.map(a => ({
        id: a.id,
        repoUrl: a.repo_url,
        userEmail: (a.profiles as any)?.email || 'Unknown',
        createdAt: a.created_at,
        status: a.status
    })) || [];

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">
                <header className="flex justify-between items-center border-b pb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground text-sm">Internal engineering control panel</p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-medium hover:underline">
                        Back to App
                    </Link>
                </header>

                {/* SECTION A — Overview Metrics */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <MetricCard title="Total Users" value={totalUsers || 0} />
                    <MetricCard title="Total Analyses" value={totalAnalyses || 0} />
                    <MetricCard title="Last 7 Days" value={analysesLast7Days || 0} />
                    <MetricCard title="Analyses Today" value={analysesToday || 0} />
                    <MetricCard title="Success Rate" value={`${successRate}%`} />
                </section>

                {/* Tables Section (Section B & C) */}
                <AdminTables users={userData} analyses={formattedAnalyses} />
            </div>
        </div>
    );
}

function MetricCard({ title, value }: { title: string, value: string | number }) {
    return (
        <Card className="rounded-xl border-gray-200 shadow-none bg-card/50">
            <CardHeader className="pb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}
