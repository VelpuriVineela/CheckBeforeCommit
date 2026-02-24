'use server';

import { getRepoData } from "@/lib/github/client";
import { analyzeRepo } from "@/lib/llm/client";
import { createClient } from "@/lib/supabase/server";

/**
 * 1. createAnalysis
 * Initializes a new analysis record in the database.
 * Must happen before any compute-heavy logic.
 */
export async function createAnalysis(repoUrl: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required to create an analysis record.");
    }

    // Initialize the record with 'pending' status
    const { data, error } = await supabase
        .from("analyses")
        .insert({
            user_id: user.id,
            repo_url: repoUrl,
            status: 'pending'
        })
        .select('id')
        .single();

    if (error) {
        console.error("Failed to initialize analysis record:", error);
        throw new Error(`Database error: ${error.message}`);
    }

    return { id: data.id };
}

/**
 * 2. runAnalysis
 * Performs the actual GitHub fetch and LLM analysis.
 * Updates the existing record's status and results.
 */
export async function runAnalysis(analysisId: string, repoUrl: string) {
    const supabase = await createClient();

    // Check if the record exists and belongs to the user (RLS will handle this, but let's be explicit)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    try {
        // 1. Mark as 'running'
        await supabase
            .from("analyses")
            .update({ status: 'running' })
            .eq('id', analysisId)
            .eq('user_id', user.id);

        // 2. Parse URL for GitHub API
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            throw new Error("Invalid GitHub URL format.");
        }
        const [, owner, repo] = match;

        // 3. Fetch Data from GitHub
        const repoData = await getRepoData(owner, repo);

        // 4. Run LLM Analysis
        const analysisResult = await analyzeRepo(repoData);

        // 5. Finalize as 'completed'
        const summary = analysisResult.onboarding.coreDomainSummary || analysisResult.repoSnapshot.description.substring(0, 150) + '...';
        const { data, error } = await supabase
            .from("analyses")
            .update({
                status: 'completed',
                result: analysisResult,
                summary: summary,
                updated_at: new Date().toISOString()
            })
            .eq('id', analysisId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data: data.result };
    } catch (err: any) {
        console.error(`Analysis ${analysisId} failed:`, err);

        // 6. Record failure in the same record
        await supabase
            .from("analyses")
            .update({
                status: 'failed',
                error_message: err.message || "An unexpected error occurred during analysis.",
                updated_at: new Date().toISOString()
            })
            .eq('id', analysisId)
            .eq('user_id', user.id);

        return { success: false, error: err.message };
    }
}

/**
 * 3. deleteAnalysis
 * Deletes an analysis record.
 * Must belong to the user.
 */
export async function deleteAnalysis(analysisId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required to delete an analysis.");
    }

    const { error } = await supabase
        .from("analyses")
        .delete()
        .eq('id', analysisId)
        .eq('user_id', user.id);

    if (error) {
        console.error("Failed to delete analysis record:", error);
        throw new Error(`Database error: ${error.message}`);
    }

    return { success: true };
}
