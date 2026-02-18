import { CreditCard, Rocket, Check, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PlanPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">
            <header className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Flexible Scaling
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Usage & Billing</h1>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    CheckBeforeCommit is built for engineers. Scale your codebase understanding from individual research to high-velocity team reviews.
                </p>
            </header>

            <div className="grid md:grid-cols-5 gap-8 items-start">
                {/* Usage Overview */}
                <div className="md:col-span-3 space-y-8">
                    <div className="p-8 border border-border/40 rounded-3xl bg-white shadow-sm space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Zap className="w-24 h-24 text-primary" />
                        </div>

                        <div className="flex items-center justify-between border-b border-border/10 pb-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Membership</p>
                                <h2 className="text-3xl font-bold text-foreground">Standard Developer</h2>
                            </div>
                            <Button variant="outline" size="sm" className="h-10 px-6 gap-2 font-semibold">
                                <CreditCard className="w-4 h-4" />
                                Manage Card
                            </Button>
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Analysis Quota</p>
                                    <p className="font-bold text-xs text-foreground">3 <span className="text-muted-foreground">/ 10 repo analyses</span></p>
                                </div>
                                <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[30%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Context Window Usage</p>
                                    <p className="font-bold text-xs text-foreground">4.2k <span className="text-muted-foreground">/ 100k tokens</span></p>
                                </div>
                                <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/40 w-[4.2%] rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-7 h-7 rounded-full bg-secondary border border-white flex items-center justify-center text-[10px] font-bold">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground font-medium">Resetting in <span className="text-foreground font-bold">12 days</span></p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-secondary/10 border border-border/20 flex gap-4 items-start">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-foreground">Enterprise-Grade Privacy</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                We never store your source code. Analysis is performed in memory and deleted immediately after the report is generated.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Plan Comparison / Call to Action */}
                <div className="md:col-span-2 space-y-6">
                    <div className="p-8 border-2 border-primary/20 rounded-3xl bg-secondary/5 space-y-8">
                        <div className="space-y-2">
                            <Badge className="bg-primary text-white border-none text-[9px] font-bold uppercase tracking-widest px-2 h-5">Most Popular</Badge>
                            <h3 className="text-2xl font-bold">Pro Engineer</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">$29</span>
                                <span className="text-muted-foreground font-medium">/mo</span>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {[
                                "Unlimited repository analyses",
                                "Full 128k context window",
                                "Deep architectural blast-radius map",
                                "Priority GPT-4o analysis",
                                "Shareable private reports"
                            ].map((feature, i) => (
                                <li key={i} className="flex gap-3 items-start text-[11px] font-medium text-foreground">
                                    <Check className="w-3.5 h-3.5 text-primary mt-0.5" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20">Upgrade Now</Button>
                        <p className="text-center text-[10px] text-muted-foreground font-medium">No hidden fees. Cancel anytime.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
