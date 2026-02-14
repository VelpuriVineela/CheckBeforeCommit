import OpenAI from 'openai';
import { z } from "zod";

// ------------------------------------------------------------------
// FINAL SCHEMA: Decision-Grade Codebase Context (11 Sections)
// ------------------------------------------------------------------

const AnalysisSchema = z.object({
    // 1. Repo Snapshot (Orientation)
    repoSnapshot: z.object({
        description: z.string(),
        primaryStack: z.string(),
        architectureType: z.enum(['Feature-based', 'Layered', 'Monolithic', 'Microservices', 'Hybrid', 'Unstructured']),
        codebaseSize: z.enum(['Small', 'Medium', 'Large', 'Massive']),
        activitySignal: z.enum(['Actively Maintained', 'Low Activity', 'Stagnant', 'Deprecated']),
    }),

    // 2. Executive Technical Verdict (High-Leverage)
    executiveVerdict: z.object({
        maturityStage: z.enum(['Prototype', 'Structured Early-Stage', 'Growing', 'Production-Grade']),
        maintainabilityScore: z.number().min(1).max(10), // 1-10
        maintenanceContext: z.string(), // "Why? e.g. High consistency but weak typing"
        modularityStrength: z.enum(['Weak', 'Moderate', 'Strong']),
        couplingRisk: z.enum(['Low', 'Medium', 'High']),
        couplingContext: z.string(), // "Why? e.g. Tightly coupled to global state"
        refactorSafety: z.enum(['Low', 'Moderate', 'High']),
        refactorContext: z.string(), // "Why? e.g. No tests covers core logic"
        productionReadiness: z.enum(['Experimental', 'Early-stage', 'Stable', 'Production-Hardened']),
        adoptionRecommendation: z.enum(['Safe to adopt', 'Adopt with caution', 'Refactor before adopting', 'Not recommended for production']),
    }),

    // 3. Architectural Health Analysis
    architecturalHealth: z.object({
        architectureIdentity: z.string(), // Explicit label: "Feature-based modular frontend..."
        pattern: z.string(), // e.g. "Clear styled components but mixed logic"
        boundaryStrength: z.string(), // e.g. "UI tightly coupled to services"
        cohesion: z.string(), // e.g. "Clear separation of concerns"
        consistency: z.string(), // e.g. "Folder naming consistency is high"
    }),

    // 4. Dependency & Coupling Map
    dependencyAnalysis: z.object({
        centralNodes: z.array(z.string()), // Vital files that everyone imports
        topConsumers: z.array(z.string()), // Files that import the most
        circularRisk: z.string(), // "Low" or specific cycle description
    }),

    // 5. Change Blast Radius & Refactor Risk
    blastRadius: z.object({
        highBlastRadiusAreas: z.array(z.string()), // e.g. ["Core state management", "API Layer"]
        safeZones: z.array(z.string()), // e.g. ["UI Components", "Utils"]
        refactorConfidence: z.string(), // e.g. "Strong test protection around core logic"
    }),

    // 6. Maintainability & Technical Debt Signals
    maintainability: z.object({
        centralization: z.string(), // e.g. "State mutation logic centralized in single reducer"
        abstractionQuality: z.string(),
        dependencySprawl: z.string(),
        technicalDebtIndicators: z.array(z.string()), // e.g. ["Hardcoded config", "Duplicate logic"]
    }),

    // 7. Execution Flow & System Boundaries
    executionFlow: z.object({
        entryPoint: z.string(),
        corePath: z.string(),
        sideEffectZones: z.string(),
        stateMutationPattern: z.string(),
        apiBoundary: z.string(),
    }),

    // 8. Test & Safety Profile
    testingProfile: z.object({
        unitCoverage: z.string(), // qualitative or quantitative estimate
        integrationDepth: z.string(),
        e2ePresence: z.string(),
        mockingStrategy: z.string(),
        refactorSafetyRating: z.enum(['Low', 'Moderate', 'High']),
    }),

    // 9. Operational & Scalability Signals
    scalability: z.object({
        deploymentMaturity: z.string(),
        configHygiene: z.string(),
        scalingBottlenecks: z.string(),
        caching: z.string(),
    }),

    // 10. Onboarding Friction Index
    onboarding: z.object({
        setupComplexity: z.enum(['Low', 'Moderate', 'High']),
        documentationClarity: z.enum(['Poor', 'Average', 'Excellent']),
        estimatedOnboardingTime: z.string(), // e.g. "2-3 days for senior engineer"
        keyFilesToRead: z.array(z.string()),
        areasToAvoid: z.array(z.string()),
    }),

    // 11. Strategic Improvement Priorities
    improvements: z.array(z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['High', 'Medium', 'Low']),
    })),

    // 12. Final Technical Recommendation
    finalRecommendation: z.object({
        goodFor: z.array(z.string()),
        riskyFor: z.array(z.string()),
        recommendedApproach: z.string(),
    }),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

// ------------------------------------------------------------------
// MOCK DATA: Gold Standard (Decision-Grade)
// ------------------------------------------------------------------

export const MOCK_ANALYSIS: AnalysisResult = {
    repoSnapshot: {
        description: "A Next.js 14 application orchestrating GitHub analysis via LLMs using Server Actions. It uses Supabase for auth/db and OpenAI for intelligence, but lacks background job processing.",
        primaryStack: "TypeScript, Next.js 14, Supabase, Tailwind CSS",
        architectureType: "Feature-based",
        codebaseSize: "Medium",
        activitySignal: "Actively Maintained",
    },
    executiveVerdict: {
        maturityStage: "Structured Early-Stage",
        maintainabilityScore: 8,
        maintenanceContext: "High consistency in separation of concerns (UI vs Logic), but lacks automated testing safety net.",
        modularityStrength: "Moderate",
        couplingRisk: "Medium",
        couplingContext: "Auth logic is scattered across middleware and components; UI is loosely coupled.",
        refactorSafety: "Moderate",
        refactorContext: "Refactor risk moderate due to weak test coverage around orchestration logic.",
        productionReadiness: "Early-stage",
        adoptionRecommendation: "Adopt with caution",
    },
    architecturalHealth: {
        architectureIdentity: "Feature-based modular frontend with centralized server orchestration in Server Actions.",
        pattern: "Feature-based modules in `src/app` with shared logic in `src/lib`. Clear separation.",
        boundaryStrength: "Strong. UI components are isolated from data fetching logic (Server Actions).",
        cohesion: "High. `src/lib/llm` encapsulates all AI logic; `src/components` handles only presentation.",
        consistency: "Uniform file naming and folder structure. Strict usage of functional components.",
    },
    dependencyAnalysis: {
        centralNodes: ["src/lib/llm/client.ts", "src/lib/utils.ts", "src/lib/supabase/server.ts"],
        topConsumers: ["src/app/analyze/actions.ts", "src/components/AnalysisReport.tsx"],
        circularRisk: "Low. No cycle detection needed for current scale.",
    },
    blastRadius: {
        highBlastRadiusAreas: [
            "src/lib/llm/client.ts (Schema definitions affect global data flow)",
            "src/app/analyze/actions.ts (Core orchestration logic)",
        ],
        safeZones: [
            "src/components/ui/* (Isolated Shadcn UI components)",
            "src/app/(marketing)/* (Static landing pages)",
        ],
        refactorConfidence: "Moderate. Strong type safety via Zod, but lack of automated tests means manual verification is required.",
    },
    maintainability: {
        centralization: "API logic centralized in Server Actions, avoiding client-side spaghetti.",
        abstractionQuality: "High. LLM interaction abstracts away provider complexity.",
        dependencySprawl: "Low. Core dependencies are standard (Next, React, Lucide, Zod).",
        technicalDebtIndicators: [
            "No background job queue for long-running analyses (Vercel timeout risk)",
            "Hardcoded error messages in some UI components",
        ],
    },
    executionFlow: {
        entryPoint: "`src/app/page.tsx` (Home) -> `src/app/analyze/actions.ts` (Action)",
        corePath: "User submits Repo -> Server Action fetches GitHub data -> LLM analyzes -> Result streamed/saved.",
        sideEffectZones: "Supabase Database writes occur only on successful analysis completion.",
        stateMutationPattern: "URL-driven state for shareability; minimal client-side global state.",
        apiBoundary: "Strict definition in `src/lib/llm/client.ts`. Zod schemas enforce contract.",
    },
    testingProfile: {
        unitCoverage: "Low (0%). No Jest/Vitest setup detected.",
        integrationDepth: "None. Testing relies on manual 'Click Testing'.",
        e2ePresence: "None.",
        mockingStrategy: "Manual mocking of generic data in `client.ts` for dev mode.",
        refactorSafetyRating: "Low",
    },
    scalability: {
        deploymentMaturity: "Vercel-optimized. Easy to deploy.",
        configHygiene: "Good. Environment variables strictly typed and separated.",
        scalingBottlenecks: "Serverless function timeouts (60s limit) for large repos.",
        caching: "Aggressive Next.js caching on static assets; no API response caching detected.",
    },
    onboarding: {
        setupComplexity: "Low",
        documentationClarity: "Average",
        estimatedOnboardingTime: "1 day",
        keyFilesToRead: [
            "src/app/analyze/actions.ts (The Brain)",
            "src/lib/llm/client.ts (The Data Contract)",
            "src/components/AnalysisReport.tsx (The View)",
        ],
        areasToAvoid: [
            "src/lib/supabase/middleware.ts (Fragile auth logic)",
        ],
    },
    improvements: [
        {
            title: "Implement Background Queues",
            description: "Move analysis to Inngest or similar to bypass Vercel 60s timeout.",
            priority: "High",
        },
        {
            title: "Add Unit Tests for Parsers",
            description: "Add Vitest to test Zod schema validation against various LLM outputs.",
            priority: "Medium",
        },
        {
            title: "Centralize Error Handling",
            description: "Create a global error boundary and toaster system for API failures.",
            priority: "Low",
        },
    ],
    finalRecommendation: {
        goodFor: ["Internal tooling", "Developer productivity apps", "Hackathons"],
        riskyFor: ["Mission-critical enterprise workflows without better error handling"],
        recommendedApproach: "Adopt as a reference implementation for LLM orchestration. Refactor into an async worker pattern for production use.",
    },
};

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "https://check-before-commit.vercel.app",
        "X-Title": "CheckBeforeCommit",
    }
});

export async function analyzeRepo(repoData: any) {
    const model = "openai/gpt-4o-mini"; // High performance / low cost for structured output

    const prompt = `
    You are a Principal Software Architect. Your job is to perform a "Decision-Grade" technical audit of a codebase for a senior engineering team.
    
    Codebase Context:
    - Repository Name: ${repoData.name}
    - Owner: ${repoData.owner}
    - Primary Language: ${repoData.language}
    - File Structure: ${JSON.stringify(repoData.tree || [], null, 2)}
    - Description: ${repoData.description || "No description provided."}

    GOAL:
    Provide a brutal, honest, and technically dense assessment.Do not summarize the code.Evaluate its engineering quality, risks, and health.

    CRITICAL RULES:
    1. NO PLATITUDES: Never say "Usage of TypeScript adds type safety." We know.Say "Strict TypeScript usage in API layers reduces runtime regression risk."
    2. SPECIFIC EVIDENCE: Back every claim with a file path or pattern found in the file list.
    3. CHANGE - CENTRIC: Focus on "Change Blast Radius" and "Refactor Risk".An engineer reading this wants to know "If I touch X, does Y break?".
    4. DECISION - FIRST: Your output must lead to a clear "Adopt", "Refactor", or "Avoid" decision.
    5. TONE: Professional, concise, unsentimental. 

    STRICT OUTPUT FORMAT:
    You MUST return a JSON object that perfectly matches the following Zod schema structure(do not include markdown fencing, just raw JSON):

    {
        "repoSnapshot": { "description": string, "primaryStack": string, "architectureType": "Feature-based" | "Layered" | "Monolithic" | "Microservices" | "Hybrid" | "Unstructured", "codebaseSize": "Small" | "Medium" | "Large" | "Massive", "activitySignal": "Actively Maintained" | "Low Activity" | "Stagnant" | "Deprecated" },
        "executiveVerdict": {
            "maturityStage": "Prototype" | "Structured Early-Stage" | "Growing" | "Production-Grade",
                "maintainabilityScore": number,
                    "maintenanceContext": string,
                        "modularityStrength": "Weak" | "Moderate" | "Strong",
                            "couplingRisk": "Low" | "Medium" | "High",
                                "couplingContext": string,
                                    "refactorSafety": "Low" | "Moderate" | "High",
                                        "refactorContext": string,
                                            "productionReadiness": "Experimental" | "Early-stage" | "Stable" | "Production-Hardened",
                                                "adoptionRecommendation": "Safe to adopt" | "Adopt with caution" | "Refactor before adopting" | "Not recommended for production"
        },
        "architecturalHealth": {
            "architectureIdentity": string,
                "pattern": string,
                    "boundaryStrength": string,
                        "cohesion": string,
                            "consistency": string
        },
        "dependencyAnalysis": {
            "centralNodes": string[],
                "topConsumers": string[],
                    "circularRisk": string
        },
        "blastRadius": { "highBlastRadiusAreas": string[], "safeZones": string[], "refactorConfidence": string },
        "maintainability": { "centralization": string, "abstractionQuality": string, "dependencySprawl": string, "technicalDebtIndicators": string[] },
        "executionFlow": { "entryPoint": string, "corePath": string, "sideEffectZones": string, "stateMutationPattern": string, "apiBoundary": string },
        "testingProfile": { "unitCoverage": string, "integrationDepth": string, "e2ePresence": string, "mockingStrategy": string, "refactorSafetyRating": "Low" | "Moderate" | "High" },
        "scalability": { "deploymentMaturity": string, "configHygiene": string, "scalingBottlenecks": string, "caching": string },
        "onboarding": { "setupComplexity": "Low" | "Moderate" | "High", "documentationClarity": "Poor" | "Average" | "Excellent", "estimatedOnboardingTime": string, "keyFilesToRead": string[], "areasToAvoid": string[] },
        "improvements": [{ "title": string, "description": string, "priority": "High" | "Medium" | "Low" }],
            "finalRecommendation": { "goodFor": string[], "riskyFor": string[], "recommendedApproach": string }
    }
    `;

    const response = await openai.chat.completions.create({
        model: model,
        messages: [
            { role: "system", content: "You are a Principal Software Architect. Provide dense, evidence-based technical audits." },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from LLM");

    const parsed = JSON.parse(content);
    return AnalysisSchema.parse(parsed);
}
