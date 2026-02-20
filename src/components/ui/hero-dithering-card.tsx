'use client';

import { ArrowRight } from "lucide-react"
import { useState, Suspense, lazy } from "react"

const Dithering = lazy(() =>
    import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)

export function CTASection({ children }: { children?: React.ReactNode }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <section className="w-full flex justify-center items-center px-4 md:px-6">
            <div
                className="w-full max-w-[1100px] relative mx-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative overflow-hidden rounded-3xl md:rounded-[48px] border border-[#1A1A1A]/5 bg-white shadow-sm py-16 lg:py-20 px-4 md:px-6 lg:px-[60px] flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left duration-500 gap-8 lg:gap-12">
                    <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-25 mix-blend-multiply">
                            <Dithering
                                colorBack="#00000000" // Transparent
                                colorFront="#FF7D29"  // Using CheckBeforeCommit primary orange
                                shape="warp"
                                type="4x4"
                                speed={isHovered ? 0.6 : 0.2}
                                className="size-full"
                                minPixelRatio={1}
                            />
                        </div>
                    </Suspense>

                    <div className="relative z-10 w-full max-w-2xl flex flex-col items-center lg:items-start">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF7D29]/10 bg-[#FF7D29]/5 px-4 py-1.5 text-sm font-medium text-[#FF7D29] backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7D29] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7D29]"></span>
                            </span>
                            Architectural Analysis
                        </div>

                        {/* Headline */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-6 leading-tight text-balance">
                            Understand any codebase in <span className="bg-gradient-to-r from-[#E65A00] to-[#FF8C38] bg-clip-text text-transparent">minutes.</span>
                        </h1>

                        {/* Description */}
                        <p className="text-[#1A1A1A]/60 text-base md:text-lg mb-0 leading-relaxed max-w-xl">
                            Skip the manual code-crawling. Get instant clarity on system architecture,
                            complexity hot-spots, and integration risks.
                        </p>
                    </div>

                    <div className="relative z-10 w-full sm:w-auto mt-6 lg:mt-0">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}
