import { CreditCard, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlanPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-24 space-y-12">
            <header className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Your Subscription Plan</h1>
                <p className="text-muted-foreground">Manage your billing and choose the plan that fits your engineering needs.</p>
            </header>

            <div className="p-8 border border-[#1A1A1A]/5 rounded-2xl bg-white shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/5 pb-8">
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40">Current Plan</p>
                        <h2 className="text-2xl font-bold text-[#1A1A1A]">Free Usage</h2>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 border-[#1A1A1A]/10 hover:bg-[#F7F7F7]">
                        <CreditCard className="w-4 h-4" />
                        Manage Billing
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-xl border border-[#1A1A1A]/5 bg-[#F7F7F7] space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">Analysis Quota</p>
                        <p className="font-semibold text-sm text-[#1A1A1A]">3 / 10 used this month</p>
                        <div className="w-full h-1 bg-[#1A1A1A]/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FF7D29] w-[30%]" />
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1A1A1A]/5 bg-[#F7F7F7] space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">Tokens Used</p>
                        <p className="font-semibold text-sm text-[#1A1A1A]">4.2k tokens consumed</p>
                        <div className="w-full h-1 bg-[#1A1A1A]/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FF7D29]/40 w-[10%]" />
                        </div>
                    </div>
                </div>
            </div>

            <section className="text-center pt-8">
                <Button size="lg" className="px-12 font-semibold">Upgrade to Pro</Button>
                <p className="text-xs text-muted-foreground mt-4 italic">Billed once per month. Cancel anytime.</p>
            </section>
        </div>
    );
}
