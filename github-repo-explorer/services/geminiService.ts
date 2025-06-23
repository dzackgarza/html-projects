
import { RepoContext, InsightProgress, ProgressCallback } from '../types';
import { generateLlmInsights } from './llmSummarizerService';

function generatePlaceholderReport(repoContext: RepoContext, failureReason?: string): string {
  let report = `## AI Insights for ${repoContext.repoName}\n\n`;
  report += `### ⚠️ AI Analysis Unavailable\n\n`;
  
  if (failureReason) {
    report += `We encountered an issue while generating detailed AI insights for this repository: **${failureReason}**\n\n`;
  } else {
    report += `We were unable to generate detailed AI insights for this repository at this time.\n\n`;
  }
  
  report += `Please check back later or try again. In the meantime, here's some basic information:\n\n`;
  report += `*   **Repository**: ${repoContext.repoName}\n`;
  report += `*   **Owner**: ${repoContext.owner}\n`;
  if (repoContext.description) {
    report += `*   **Description**: ${repoContext.description}\n`;
  }
  if (repoContext.language) {
    report += `*   **Primary Language**: ${repoContext.language}\n`;
  }
  if (repoContext.topics && repoContext.topics.length > 0) {
    report += `*   **Topics**: ${repoContext.topics.join(', ')}\n`;
  }
  report += `\nWe apologize for the inconvenience.\n`;
  return report;
}

export async function fetchRepositoryInsights(
  repoContext: RepoContext,
  onProgress: ProgressCallback
): Promise<string> {
  onProgress(InsightProgress.INITIALIZING, "Initializing AI analysis session...");
  console.log('[geminiService] Attempting to fetch insights for:', repoContext.repoName);

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    const errorMsg = "Gemini API key is not configured.";
    console.error(`[geminiService] ${errorMsg}`);
    onProgress(InsightProgress.ERROR, errorMsg);
    return generatePlaceholderReport(repoContext, errorMsg);
  }
  
  onProgress(InsightProgress.INITIALIZING, "AI session prerequisites met. Starting analysis...");
  console.log('[geminiService] API key found. Handing over to conversational manager for:', repoContext.repoName);

  try {
    const insightsText = await generateLlmInsights(
      apiKey,
      repoContext,
      [], // Pass empty array for _repoTree_DEPRECATED
      onProgress 
    );

    console.log('[geminiService] Successfully received full insights for:', repoContext.repoName);
    onProgress(InsightProgress.COMPLETED, "Insights generated successfully!");
    return insightsText;

  } catch (error: any) {
    console.error(`[geminiService] Error during conversational insight generation for ${repoContext.repoName}:`, error);
    const errorMessage = error.message || `An unexpected error occurred while generating insights.`;
    onProgress(InsightProgress.ERROR, `Error: ${errorMessage}`);
    return generatePlaceholderReport(repoContext, errorMessage);
  }
}
