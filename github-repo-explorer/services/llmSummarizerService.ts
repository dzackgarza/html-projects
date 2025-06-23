
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { RepoContext, FinalReportJson, InsightProgress, ProgressCallback } from '../types'; 
import { fetchFileContent, fetchRepoTree, RepoTreeItem } from './githubService';
import { parseJsonFromLlmResponse } from './llmResponseParser';

// Design Goal: Target 6-8 turns for deeper analysis, balancing semantic depth with prompt economy.
const MAX_CONVERSATION_TURNS = 4; 
const MAX_FILES_PER_REQUEST = 2;
const MAX_DIRECTORIES_PER_REQUEST = 1;

class LlmConversationManager {
  private apiKey: string;
  private repoContext: RepoContext;
  private ai: GoogleGenAI;
  private chat: Chat;
  private conversationHistory: Array<{ role: 'user' | 'model', parts: [{ text: string }] }>;
  private onProgress: ProgressCallback;

  constructor(apiKey: string, repoContext: RepoContext, onProgress: ProgressCallback) {
    this.apiKey = apiKey;
    this.repoContext = repoContext;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    this.conversationHistory = [];
    this.onProgress = onProgress;

    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      config: { 
        systemInstruction: this.getBaseSystemInstruction(),
        maxOutputTokens: 8192, 
      }
    });
  }

  private async sendMessageToGemini(prompt: string, expectJson: boolean = false): Promise<string> {
    this.conversationHistory.push({ role: 'user', parts: [{ text: prompt }] });
    try {
      this.onProgress(InsightProgress.AI_QUERYING, "Sending request to AI. Waiting for response...");
      const response: GenerateContentResponse = await this.chat.sendMessage({
        message: prompt,
        config: expectJson ? { responseMimeType: "application/json" } : undefined
      });
      const responseText = response.text || '';
      this.conversationHistory.push({ role: 'model', parts: [{ text: responseText }] });
      this.onProgress(InsightProgress.AI_QUERYING, "AI response received.");
      return responseText;
    } catch (error: any) {
      console.error("[LlmConversationManager] Error sending message to Gemini:", error);
      this.onProgress(InsightProgress.ERROR, `AI communication failed: ${error.message}`);
      throw new Error(`AI communication failed: ${error.message}`);
    }
  }

  private getBaseSystemInstruction(): string {
    return `
You are an expert GitHub repository analysis assistant (A2). Your goal is to deeply understand a software project by strategically requesting information from A1 (the application) and then generate a comprehensive analysis.

Interaction Protocol:
1. A1 has access to all repository data (metadata, file/directory structures, file contents).
2. You are stateless. A1 will provide conversation history summaries to help you maintain context.
3. In each turn (except the last), you can:
    a. Request content for up to ${MAX_FILES_PER_REQUEST} specific files: Respond ONLY with JSON like: {"request_files": ["path/to/file1.ext", "path/to/file2.ext"]}
    b. Request listing for ${MAX_DIRECTORIES_PER_REQUEST} specific directory: Respond ONLY with JSON like: {"request_directory": "path/to/directory/"}
    c. Indicate you have enough data for the final analysis: Respond ONLY with JSON like: {"ready_for_final_report": true}
4. A1 will fetch and provide the requested data in the next turn.
5. Be strategic. Choose files/directories that offer maximum insight. Do not re-request data previously provided. Your analysis should build iteratively.
6. After a few turns (around ${MAX_CONVERSATION_TURNS -1}), A1 will ask you for the final analysis. The format for this final analysis (JSON) will be specified by A1 at that time.
`;
  }

  private buildInitialPrompt(rootTreeListing: string): string {
    this.onProgress(InsightProgress.AI_PROMPT_PREP, "Building initial prompt for AI...");
    return `
Initial Repository Information:
*   Name: ${this.repoContext.repoName}
*   Description: ${this.repoContext.description || 'N/A'}
*   Primary Language: ${this.repoContext.language || 'N/A'}
*   Topics: ${this.repoContext.topics?.join(', ') || 'N/A'}
*   Root Directory Structure:
${rootTreeListing || 'No directory structure available or repository is empty.'}

Based on this, what 2-3 specific files or 1 subdirectory (full paths) would you like to examine first to understand its core purpose and structure?
Respond ONLY with JSON e.g., {"request_files": ["src/main.js"], "request_directory": null} or {"request_files": [], "request_directory": "src/utils/"}.
If you think you have enough for a preliminary summary already (unlikely at this stage but possible for very small repos), respond with {"ready_for_final_report": true}.
`;
  }

  private buildIntermediatePrompt(newDataSnippets: string, turn: number): string {
    this.onProgress(InsightProgress.AI_PROMPT_PREP, `Preparing prompt for AI turn ${turn}...`);
    return `
Turn ${turn}/${MAX_CONVERSATION_TURNS -1}. Our goal is to iteratively build understanding.
Recap of conversation so far:
${this.summarizeHistory(this.conversationHistory.length -1 )}

Here's the data you previously requested:
${newDataSnippets || "No new data was fetched in the last turn, or you didn't request any."}

What specific information (files or directory listing) do you need next to deepen your understanding of the project's [current_phase_focus e.g., 'core functionality', 'value proposition', 'architecture']?
Use JSON: {"request_files": [...]} or {"request_directory": "..."}.
If you are ready to generate the final report, respond with JSON: {"ready_for_final_report": true}.
`;
  }

  private buildFinalReportPrompt(lastDataSnippets: string): string {
    this.onProgress(InsightProgress.GENERATING_REPORT, "Preparing final report request for AI...");
    return `
Final turn. Based on our entire conversation and all data provided.
Conversation recap:
${this.summarizeHistory()}

Last data provided:
${lastDataSnippets || "No additional data provided in the last turn."}

Please now generate the comprehensive insights for ${this.repoContext.repoName} in JSON format.
The JSON object MUST follow this exact structure:
{
  "projectName": "${this.repoContext.repoName}",
  "summary": "A concise and engaging summary (2-4 sentences) of what this project likely does or aims to achieve, drawing from all available information.",
  "score": /* An integer score between 70-95, e.g., 85 */,
  "scoreRationale": "A brief, encouraging explanation for your score (1-2 sentences).",
  "highlightedFeature": {
    "name": "Feature Name (e.g., 'Modular Plugin System' or 'Efficient Data Serialization')",
    "description": "Describe the standout technical feature, clever implementation detail, or unique aspect based on ALL data provided (1-2 sentences)."
  },
  "feedbackItems": [
    { "type": "technical", "point": "Consider exploring [specific technology/pattern] for [module/feature] to potentially improve [aspect like performance/maintainability].", "emoji": "⚙️" },
    { "type": "creative", "point": "A neat addition could be [specific idea], leveraging the existing [project part].", "emoji": "💡" },
    { "type": "suggestion", "point": "Refining the documentation for [specific area] could enhance developer experience.", "emoji": "📚" }
  ]
}
Respond ONLY with this JSON structure. Do not add any explanatory text before or after the JSON.
Do not use markdown formatting within the JSON string values.
`;
  }
  
  private summarizeHistory(maxItems: number = 4): string {
    if (this.conversationHistory.length === 0) return "No history yet.";
    const relevantHistory = this.conversationHistory.slice(-maxItems);
    return relevantHistory.map(entry => {
        const prefix = entry.role === 'user' ? 'A1 (App)' : 'A2 (AI)';
        let text = entry.parts[0].text;
        if (entry.role === 'user' && text.includes("Initial Repository Information:")) {
            text = "A1 (App): Provided initial repo data and asked for file selection.";
        } else if (entry.role === 'user' && text.includes("buildFinalReportPrompt")) { 
            text = "A1 (App): Requested final JSON report.";
        } else if (entry.role === 'model' && text.startsWith("{") && text.endsWith("}")) {
            text = "A2 (AI): Responded with structured JSON (data request or report).";
        } else if (text.length > 200) { 
            text = text.substring(0, 197) + "... (summary)"; 
        }
        return `${prefix}: ${text}`;
    }).join('\n');
  }

  private parseGeminiDataRequest(responseText: string): { files?: string[], directory?: string, ready_for_final_report?: boolean } | null {
    const parsed = parseJsonFromLlmResponse<{ request_files?: string[], request_directory?: string, ready_for_final_report?: boolean }>(responseText);
    
    if (!parsed) {
        console.warn("[LlmConversationManager] AI response was not the expected JSON for data request after parsing:", responseText);
        this.onProgress(InsightProgress.AI_PROCESSING_REQUEST, "AI response format unexpected. Proceeding cautiously.");
        return null;
    }

    const result: { files?: string[], directory?: string, ready_for_final_report?: boolean } = {};
    if (parsed.request_files && Array.isArray(parsed.request_files) && parsed.request_files.every((i:any) => typeof i === 'string')) {
      result.files = parsed.request_files.slice(0, MAX_FILES_PER_REQUEST);
    }
    if (parsed.request_directory && typeof parsed.request_directory === 'string') {
      result.directory = parsed.request_directory;
    }
    if (parsed.ready_for_final_report === true) {
      result.ready_for_final_report = true;
    }
    
    return Object.keys(result).length > 0 ? result : null;
  }

  private transformJsonToMarkdown(data: FinalReportJson): string {
    this.onProgress(InsightProgress.FINALIZING, "Transforming final AI report to display format...");
    let markdown = `## AI Insights for ${data.projectName}\n\n`;
    markdown += `### 📝 Project Summary\n${data.summary}\n\n`;
    markdown += `### 🌟 Potential & "Coolness" Score\n`;
    markdown += `**Score:** ${data.score}/100 ✨\n`;
    if (data.scoreRationale) {
        markdown += `*Rationale: ${data.scoreRationale}*\n`;
    }
    markdown += `\n`;

    markdown += `### ✨ Highlighted Feature/Aspect\n`;
    markdown += `**Highlight:** ${data.highlightedFeature.name}\n`;
    markdown += `${data.highlightedFeature.description}\n\n`;
    
    markdown += `### 💡 Creative & Technical Feedback / Next Steps\n`;
    if (data.feedbackItems && data.feedbackItems.length > 0) {
      data.feedbackItems.forEach(item => {
        markdown += `*   ${item.emoji} **(${item.type})**: ${item.point}\n`;
      });
    } else {
      markdown += "*   No specific feedback items provided.\n";
    }
    return markdown;
  }

  public async conductConversation(): Promise<string> {
    this.onProgress(InsightProgress.INITIALIZING, `Starting AI conversation for ${this.repoContext.repoName}...`);
    console.log(`[LlmConversationManager] Starting AI conversation for ${this.repoContext.repoName}...`);

    let rootTreeItems: RepoTreeItem[];
    try {
      this.onProgress(InsightProgress.FETCHING_STRUCTURE, `Fetching root directory for ${this.repoContext.repoName}...`);
      console.log(`[LlmConversationManager] Fetching root directory for ${this.repoContext.repoName}...`);
      rootTreeItems = await fetchRepoTree(this.repoContext.owner, this.repoContext.repoName);
      this.onProgress(InsightProgress.FETCHING_STRUCTURE, `Root directory fetched for ${this.repoContext.repoName}.`);
      console.log(`[LlmConversationManager] Root directory fetched for ${this.repoContext.repoName}.`);
    } catch (e: any) {
      console.error(`[LlmConversationManager] Failed to fetch root directory: ${e.message}`);
      this.onProgress(InsightProgress.ERROR, `Failed to fetch root directory: ${e.message}`);
      throw new Error(`Failed to fetch root directory: ${e.message}`);
    }
    
    let currentPrompt = this.buildInitialPrompt(rootTreeItems.map(item => `- ${item.path} (${item.type})`).join('\n'));
    let newDataSnippetsForNextPrompt = ""; 

    for (let turn = 0; turn < MAX_CONVERSATION_TURNS; turn++) {
      this.onProgress(InsightProgress.AI_QUERYING, `AI Turn ${turn + 1}/${MAX_CONVERSATION_TURNS}: Querying AI for ${this.repoContext.repoName}...`);
      console.log(`[LlmConversationManager] AI Turn ${turn + 1}/${MAX_CONVERSATION_TURNS}: Querying AI for ${this.repoContext.repoName}...`);
      
      const isFinalReportTurnRequest = (turn === MAX_CONVERSATION_TURNS - 1); 
      const expectJsonInResponse = true; 

      const aiResponseText = await this.sendMessageToGemini(currentPrompt, expectJsonInResponse); 

      if (isFinalReportTurnRequest) {
        this.onProgress(InsightProgress.GENERATING_REPORT, "Final report requested. Processing AI response...");
        console.log(`[LlmConversationManager] Final report requested by A1. AI Response received for ${this.repoContext.repoName}. Transforming...`);
        const jsonData = parseJsonFromLlmResponse<FinalReportJson>(aiResponseText);
        if (!jsonData || !jsonData.projectName || !jsonData.summary || typeof jsonData.score !== 'number' || !jsonData.highlightedFeature || !jsonData.feedbackItems) {
            console.error("[LlmConversationManager] Error parsing/validating final JSON report (A1-initiated). jsonData:", jsonData, "Raw response:", aiResponseText.substring(0,500));
            this.onProgress(InsightProgress.ERROR, "Failed to process final AI report: Invalid or incomplete JSON.");
            throw new Error(`Failed to process final AI report (A1-initiated): Invalid or incomplete JSON response from AI.`);
        }
        const markdownReport = this.transformJsonToMarkdown(jsonData);
        this.onProgress(InsightProgress.FINALIZING, "Insights transformed and finalized.");
        console.log(`[LlmConversationManager] Insights transformed and finalized (A1-initiated) for ${this.repoContext.repoName}.`);
        return markdownReport;
      }

      this.onProgress(InsightProgress.AI_PROCESSING_REQUEST, `AI Turn ${turn + 1}: Analyzing AI response...`);
      console.log(`[LlmConversationManager] AI Turn ${turn + 1}/${MAX_CONVERSATION_TURNS}: Analyzing AI response for ${this.repoContext.repoName}...`);
      const dataRequest = this.parseGeminiDataRequest(aiResponseText);
      newDataSnippetsForNextPrompt = ""; 

      if (dataRequest?.ready_for_final_report) {
        this.onProgress(InsightProgress.GENERATING_REPORT, `AI indicates readiness for final report (Turn ${turn + 1}). Requesting now...`);
        console.log(`[LlmConversationManager] AI indicates readiness for final report (Turn ${turn + 1}) for ${this.repoContext.repoName}. Requesting now...`);
        currentPrompt = this.buildFinalReportPrompt(""); 
        const finalJsonText = await this.sendMessageToGemini(currentPrompt, true);
        this.onProgress(InsightProgress.GENERATING_REPORT, "Raw JSON report received from AI. Transforming...");
        console.log(`[LlmConversationManager] Raw JSON report received from AI (A2-initiated early) for ${this.repoContext.repoName}. Transforming...`);
        
        const jsonData = parseJsonFromLlmResponse<FinalReportJson>(finalJsonText);
        if (!jsonData || !jsonData.projectName || !jsonData.summary || typeof jsonData.score !== 'number' || !jsonData.highlightedFeature || !jsonData.feedbackItems) {
            console.error("[LlmConversationManager] Error parsing/validating early final JSON report (A2-initiated). jsonData:", jsonData, "Raw:", finalJsonText.substring(0,500));
            this.onProgress(InsightProgress.ERROR, "Failed to process early final AI report: Invalid JSON.");
            throw new Error(`Failed to process early final AI report (A2-initiated): Invalid or incomplete JSON.`);
        }
        const markdownReport = this.transformJsonToMarkdown(jsonData);
        this.onProgress(InsightProgress.FINALIZING, "Insights transformed and finalized (AI-initiated early).");
        console.log(`[LlmConversationManager] Insights transformed and finalized (A2-initiated early) for ${this.repoContext.repoName}.`);
        return markdownReport;
      }
      
      let filesFetchedThisTurn = 0;
      if (dataRequest?.files && dataRequest.files.length > 0) {
        const snippets: string[] = [];
        for (const filePath of dataRequest.files) {
          if (filesFetchedThisTurn >= MAX_FILES_PER_REQUEST) break;
          this.onProgress(InsightProgress.FETCHING_FILES, `AI requested file: ${filePath}. Fetching...`);
          console.log(`[LlmConversationManager] AI requested file: ${filePath} for ${this.repoContext.repoName}. Fetching...`);
          try {
            const content = await fetchFileContent(this.repoContext.owner, this.repoContext.repoName, filePath);
            snippets.push(`Content of ${filePath}:\n\`\`\`\n${content}\n\`\`\`\n`);
            this.onProgress(InsightProgress.FETCHING_FILES, `Fetched content for ${filePath}.`);
          } catch (fileError: any) {
            const errorMsgForLlm = `Could not fetch file ${filePath}: ${fileError.message}`;
            snippets.push(`Content of ${filePath}:\n\`\`\`\n[${errorMsgForLlm}]\n\`\`\`\n`); // Inform AI
            this.onProgress(InsightProgress.ERROR, `Failed to fetch file ${filePath}: ${fileError.message}`);
            console.warn(`[LlmConversationManager] Error fetching file ${filePath}: ${fileError.message}`);
          }
          filesFetchedThisTurn++;
        }
        newDataSnippetsForNextPrompt += snippets.join('\n');
      }

      if (dataRequest?.directory) {
        this.onProgress(InsightProgress.FETCHING_FILES, `AI requested directory: ${dataRequest.directory}. Fetching...`);
        console.log(`[LlmConversationManager] AI requested directory: ${dataRequest.directory} for ${this.repoContext.repoName}. Fetching...`);
        try {
          const subTreeItems = await fetchRepoTree(this.repoContext.owner, this.repoContext.repoName, dataRequest.directory);
          const subTreeListing = subTreeItems.map(item => `- ${item.path} (${item.type})`).join('\n');
          newDataSnippetsForNextPrompt += `Directory listing for ${dataRequest.directory}:\n${subTreeListing || 'Directory is empty or not found.'}\n`;
          this.onProgress(InsightProgress.FETCHING_FILES, `Fetched listing for directory ${dataRequest.directory}.`);
        } catch (e: any) {
          newDataSnippetsForNextPrompt += `Could not fetch directory ${dataRequest.directory}: ${e.message}\n`;
          this.onProgress(InsightProgress.ERROR, `Failed to fetch directory ${dataRequest.directory}: ${e.message}`);
          console.warn(`[LlmConversationManager] Failed to fetch ${dataRequest.directory} for ${this.repoContext.repoName}. Error: ${e.message}`);
        }
      }
      
      if (!dataRequest?.files?.length && !dataRequest?.directory && !dataRequest?.ready_for_final_report) { 
         const aiResponsePreview = aiResponseText.substring(0,200) + (aiResponseText.length > 200 ? "..." : "");
         newDataSnippetsForNextPrompt = `AI did not request specific file/directory data this turn, nor did it signal readiness for the report. Its last response was: ${aiResponsePreview}`;
         this.onProgress(InsightProgress.ANALYZING_CONTENT, `AI response was not a data request. Response: ${aiResponsePreview}`);
         console.warn(`[LlmConversationManager] AI response was not a valid data request or signal for ${this.repoContext.repoName}. Response: ${aiResponsePreview}`);
      }

      if (newDataSnippetsForNextPrompt.length > 0) {
        this.onProgress(InsightProgress.ANALYZING_CONTENT, "Aggregated new data. Preparing for next AI turn...");
      }
      
      if ((turn + 1) === (MAX_CONVERSATION_TURNS - 1) ) { 
        currentPrompt = this.buildFinalReportPrompt(newDataSnippetsForNextPrompt);
      } else { 
        currentPrompt = this.buildIntermediatePrompt(newDataSnippetsForNextPrompt, turn + 2); 
      }
    }

    console.error(`[LlmConversationManager] Max conversation turns (${MAX_CONVERSATION_TURNS}) reached for ${this.repoContext.repoName} without generating a final report.`);
    this.onProgress(InsightProgress.ERROR, "Max conversation turns reached. AI did not produce a final report.");
    throw new Error("Max conversation turns reached. AI did not produce a final report as expected.");
  }
}

export async function generateLlmInsights(
  apiKey: string,
  repoContext: RepoContext,
  _repoTree_DEPRECATED: RepoTreeItem[],
  onProgress: ProgressCallback 
): Promise<string> {
  
  const manager = new LlmConversationManager(apiKey, repoContext, onProgress);
  try {
    const insights = await manager.conductConversation();
    return insights;
  } catch (error: any) {
    console.error(`[generateLlmInsights] Error during conversation for ${repoContext.repoName}: ${error.message}`);
    // onProgress callback for error should have been called within LlmConversationManager or by geminiService facade
    throw error; 
  }
}
