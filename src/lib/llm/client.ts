import OpenAI from 'openai';
import { z } from "zod";

// ------------------------------------------------------------------
// FINAL SCHEMA: Decision-Grade Codebase Context (11 Sections)
// ------------------------------------------------------------------


// Helpers for robust validation
function createLooseEnumSchema<T extends string>(values: readonly T[], fallback: T) {
    return z.preprocess((val) => {
        if (typeof val === 'string') {
            const match = values.find(v => v.toLowerCase() === val.toLowerCase());
            if (match) return match;
        }
        return fallback;
    }, z.enum(values as [T, ...T[]]));
}

const flexibleStringSchema = z.union([
    z.string(),
    z.array(z.string()).transform(arr => arr.join(". ")),
    z.number().transform(n => String(n)),
    z.null().transform(() => "Not specified"),
    z.undefined().transform(() => "Not specified"),
]);

const scoreSchema = z.preprocess((val) => {
    const n = Number(val);
    if (isNaN(n)) return 5;
    if (n > 10) return Math.round(n / 10); // Handle 0-100 scale
    return Math.max(1, Math.min(10, Math.round(n))); // Clamp 1-10
}, z.number().min(1).max(10));

const AnalysisSchema = z.object({
    // 1. Repo Snapshot (Orientation)
    repoSnapshot: z.object({
        description: flexibleStringSchema,
        primaryStack: flexibleStringSchema,
        architectureType: createLooseEnumSchema(['Feature-based', 'Layered', 'Monolithic', 'Microservices', 'Hybrid', 'Unstructured'], 'Unstructured'),
        codebaseSize: createLooseEnumSchema(['Small', 'Medium', 'Large', 'Massive'], 'Medium'),
        activitySignal: createLooseEnumSchema(['Actively Maintained', 'Low Activity', 'Stagnant', 'Deprecated'], 'Low Activity'),
    }),

    // 2. Executive Technical Verdict (High-Leverage)
    executiveVerdict: z.object({
        maturityStage: createLooseEnumSchema(['Prototype', 'Structured Early-Stage', 'Growing', 'Production-Grade'], 'Prototype'),
        maintainabilityScore: scoreSchema,
        maintenanceContext: flexibleStringSchema,
        modularityStrength: createLooseEnumSchema(['Weak', 'Moderate', 'Strong'], 'Moderate'),
        couplingRisk: createLooseEnumSchema(['Low', 'Medium', 'High'], 'Medium'),
        couplingContext: flexibleStringSchema,
        refactorSafety: createLooseEnumSchema(['Low', 'Moderate', 'High'], 'Low'),
        refactorContext: flexibleStringSchema,
        productionReadiness: createLooseEnumSchema(['Experimental', 'Early-stage', 'Stable', 'Production-Hardened'], 'Experimental'),
        adoptionRecommendation: createLooseEnumSchema(['Safe to adopt', 'Adopt with caution', 'Refactor before adopting', 'Not recommended for production'], 'Adopt with caution'),
    }),

    // 3. Architectural Health Analysis
    architecturalHealth: z.object({
        architectureIdentity: flexibleStringSchema,
        pattern: flexibleStringSchema,
        boundaryStrength: flexibleStringSchema,
        cohesion: flexibleStringSchema,
        consistency: flexibleStringSchema,
    }),

    // 4. Dependency & Coupling Map
    dependencyAnalysis: z.object({
        centralNodes: z.array(z.string()).default([]),
        topConsumers: z.array(z.string()).default([]),
        circularRisk: flexibleStringSchema,
    }),

    // 5. Change Blast Radius & Refactor Risk
    blastRadius: z.object({
        highBlastRadiusAreas: z.array(z.string()).default([]),
        safeZones: z.array(z.string()).default([]),
        refactorConfidence: flexibleStringSchema,
    }),

    // 6. Maintainability & Technical Debt Signals
    maintainability: z.object({
        centralization: flexibleStringSchema,
        abstractionQuality: flexibleStringSchema,
        dependencySprawl: flexibleStringSchema,
        technicalDebtIndicators: z.array(z.string()).default([]),
    }),

    // 7. Execution Flow & System Boundaries
    executionFlow: z.object({
        entryPoint: flexibleStringSchema,
        corePath: flexibleStringSchema,
        sideEffectZones: flexibleStringSchema,
        stateMutationPattern: flexibleStringSchema,
        apiBoundary: flexibleStringSchema,
    }),

    // 8. Test & Safety Profile
    testingProfile: z.object({
        unitCoverage: flexibleStringSchema,
        integrationDepth: flexibleStringSchema,
        e2ePresence: flexibleStringSchema,
        mockingStrategy: flexibleStringSchema,
        refactorSafetyRating: createLooseEnumSchema(['Low', 'Moderate', 'High'], 'Low'),
    }),

    // 9. Operational & Scalability Signals
    scalability: z.object({
        deploymentMaturity: flexibleStringSchema,
        configHygiene: flexibleStringSchema,
        scalingBottlenecks: flexibleStringSchema,
        caching: flexibleStringSchema,
    }),

    // 10. Onboarding Friction Index
    onboarding: z.object({
        setupComplexity: createLooseEnumSchema(['Low', 'Moderate', 'High'], 'High'),
        documentationClarity: createLooseEnumSchema(['Poor', 'Average', 'Excellent'], 'Poor'),
        estimatedOnboardingTime: flexibleStringSchema,
        keyFilesToRead: z.array(z.string()).default([]),
        areasToAvoid: z.array(z.string()).default([]),
    }),

    // 11. Strategic Improvement Priorities
    improvements: z.array(z.object({
        title: flexibleStringSchema,
        description: flexibleStringSchema,
        priority: createLooseEnumSchema(['High', 'Medium', 'Low'], 'Medium'),
    })).default([]),

    // 12. Final Technical Recommendation
    finalRecommendation: z.object({
        goodFor: z.array(z.string()).default([]),
        riskyFor: z.array(z.string()).default([]),
        recommendedApproach: flexibleStringSchema,
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
You are a Principal Software Architect performing a "Decision-Grade" technical audit.

Codebase Context:
- Repository Name: ${repoData.name}
- Owner: ${repoData.owner}
- Primary Language: ${repoData.language}
- File Structure: ${JSON.stringify(repoData.tree || [], null, 2)}
- Description: ${repoData.description || "No description provided."}

GOAL:
Provide a brutal, honest, technically dense assessment of engineering quality, risks, and health.

CRITICAL RULES:
1. NO PLATITUDES: Say "Strict TypeScript in API layers reduces runtime regression risk" not "TypeScript adds type safety"
2. SPECIFIC EVIDENCE: Back every claim with file paths or patterns from the file list
3. CHANGE-CENTRIC: Focus on "Change Blast Radius" and "Refactor Risk"
4. DECISION-FIRST: Lead to clear "Adopt", "Refactor", or "Avoid" decision
5. TONE: Professional, concise, unsentimental

STRICT OUTPUT REQUIREMENTS:

⚠️ CRITICAL VALIDATION RULES:
- maintainabilityScore: MUST be integer 1-10 (do NOT use 0-100 scale, do NOT exceed 10)
- sideEffectZones: MUST be a single string describing zones (NOT an array)
- All enum fields: MUST match EXACT case-sensitive values listed below
- Return ONLY raw JSON (no \`\`\`json markdown fencing)

Return a JSON object matching this EXACT structure:

{
  "repoSnapshot": {
    "description": "single descriptive string",
    "primaryStack": "comma-separated string",
    "architectureType": "Feature-based", // ONLY: "Feature-based" | "Layered" | "Monolithic" | "Microservices" | "Hybrid" | "Unstructured"
    "codebaseSize": "Medium", // ONLY: "Small" | "Medium" | "Large" | "Massive"
    "activitySignal": "Actively Maintained" // ONLY: "Actively Maintained" | "Low Activity" | "Stagnant" | "Deprecated"
  },
  "executiveVerdict": {
    "maturityStage": "Structured Early-Stage", // ONLY: "Prototype" | "Structured Early-Stage" | "Growing" | "Production-Grade"
    "maintainabilityScore": 7, // ⚠️ INTEGER 1-10 ONLY (NOT 0-100, NOT >10)
    "maintenanceContext": "descriptive string",
    "modularityStrength": "Moderate", // ONLY: "Weak" | "Moderate" | "Strong"
    "couplingRisk": "Medium", // ONLY: "Low" | "Medium" | "High"
    "couplingContext": "descriptive string",
    "refactorSafety": "Moderate", // ONLY: "Low" | "Moderate" | "High"
    "refactorContext": "descriptive string",
    "productionReadiness": "Early-stage", // ONLY: "Experimental" | "Early-stage" | "Stable" | "Production-Hardened"
    "adoptionRecommendation": "Adopt with caution" // ONLY: "Safe to adopt" | "Adopt with caution" | "Refactor before adopting" | "Not recommended for production"
  },
  "architecturalHealth": {
    "architectureIdentity": "string",
    "pattern": "string",
    "boundaryStrength": "string",
    "cohesion": "string",
    "consistency": "string"
  },
  "dependencyAnalysis": {
    "centralNodes": ["array of strings"],
    "topConsumers": ["array of strings"],
    "circularRisk": "string"
  },
  "blastRadius": {
    "highBlastRadiusAreas": ["array of strings"],
    "safeZones": ["array of strings"],
    "refactorConfidence": "string"
  },
  "maintainability": {
    "centralization": "string",
    "abstractionQuality": "string",
    "dependencySprawl": "string",
    "technicalDebtIndicators": ["array of strings"]
  },
  "executionFlow": {
    "entryPoint": "string",
    "corePath": "string",
    "sideEffectZones": "Database writes in auth module, API calls in analysis layer", // ⚠️ MUST BE STRING NOT ARRAY
    "stateMutationPattern": "string",
    "apiBoundary": "string"
  },
  "testingProfile": {
    "unitCoverage": "string",
    "integrationDepth": "string",
    "e2ePresence": "string",
    "mockingStrategy": "string",
    "refactorSafetyRating": "Low" // ONLY: "Low" | "Moderate" | "High"
  },
  "scalability": {
    "deploymentMaturity": "string",
    "configHygiene": "string",
    "scalingBottlenecks": "string",
    "caching": "string"
  },
  "onboarding": {
    "setupComplexity": "Low", // ONLY: "Low" | "Moderate" | "High"
    "documentationClarity": "Poor", // ONLY: "Poor" | "Average" | "Excellent"
    "estimatedOnboardingTime": "string",
    "keyFilesToRead": ["array of strings"],
    "areasToAvoid": ["array of strings"]
  },
  "improvements": [
    {
      "title": "string",
      "description": "string",
      "priority": "High" // ONLY: "High" | "Medium" | "Low"
    }
  ],
  "finalRecommendation": {
    "goodFor": ["array of strings"],
    "riskyFor": ["array of strings"],
    "recommendedApproach": "string"
  }
}

⚠️ FINAL VALIDATION BEFORE RETURNING:
1. Check maintainabilityScore is 1-10 integer
2. Check ALL enum values match EXACTLY
3. Check sideEffectZones is string, not array
4. Remove any markdown code fences
5. Ensure valid JSON syntax
`;

    const response = await openai.chat.completions.create({
        model: model,
        messages: [
            {
                role: "system",
                content: `You are a Principal Software Architect. You provide dense, evidence-based technical audits.

CRITICAL OUTPUT RULES:
1. You MUST return ONLY valid JSON - no markdown, no code fences, no explanations.
2. ALL numeric scores MUST be integers between 1 and 10 inclusive.
3. ALL enum fields MUST use EXACT case-sensitive strings as defined.
4. ALL string fields MUST return a single string - NEVER an array.
5. If uncertain, use fallback values rather than invalid data.

NUMERIC CONSTRAINTS:
- maintainabilityScore: integer from 1-10 (NOT 0-100, NOT >10)

EXACT ENUM VALUES (case-sensitive):
- architectureType: "Feature-based" | "Layered" | "Monolithic" | "Microservices" | "Hybrid" | "Unstructured"
- codebaseSize: "Small" | "Medium" | "Large" | "Massive"
- activitySignal: "Actively Maintained" | "Low Activity" | "Stagnant" | "Deprecated"
- maturityStage: "Prototype" | "Structured Early-Stage" | "Growing" | "Production-Grade"
- modularityStrength: "Weak" | "Moderate" | "Strong"
- couplingRisk: "Low" | "Medium" | "High"
- refactorSafety: "Low" | "Moderate" | "High"
- productionReadiness: "Experimental" | "Early-stage" | "Stable" | "Production-Hardened"
- adoptionRecommendation: "Safe to adopt" | "Adopt with caution" | "Refactor before adopting" | "Not recommended for production"
- refactorSafetyRating: "Low" | "Moderate" | "High"
- setupComplexity: "Low" | "Moderate" | "High"
- documentationClarity: "Poor" | "Average" | "Excellent"
- priority: "High" | "Medium" | "Low"

STRING FIELDS (NEVER arrays):
- sideEffectZones: return a SINGLE descriptive string, not an array
- All other non-array fields: return strings, not arrays or numbers

VALIDATION CHECKLIST before returning:
✓ All scores are 1-10 integers
✓ All enums match exactly (case-sensitive)
✓ sideEffectZones is a string, not array
✓ No markdown formatting
✓ Valid JSON structure`
            },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from LLM");

    const parsed = JSON.parse(content);
    return AnalysisSchema.parse(parsed);
}
