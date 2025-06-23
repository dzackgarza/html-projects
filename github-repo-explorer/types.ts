
export interface GitHubRepositoryOwner {
  login: string;
  avatar_url: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubRepositoryOwner;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  stargazers_count: number; 
  watchers_count: number;
  language: string | null; // Primary language from initial fetch
  forks_count: number; 
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
    node_id: string;
  } | null;
  visibility: 'public' | 'private' | 'internal'; // GitHub's actual field
  topics?: string[];
  archived: boolean; // Added for archived status
  languages_detail?: { [language: string]: number }; // Detailed language breakdown (bytes per language)
  primary_language_from_detail?: string; // Primary language determined from languages_detail
}

export type SortableRepoKeys = 'name' | 'updated_at' | 'pushed_at' | 'created_at';

export interface SortOption {
  key: SortableRepoKeys;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  language: string; 
  type: 'all' | 'forks' | 'sources';
  visibility: 'all' | 'public' | 'private';
  isWritingOnly: boolean;
  showArchived: boolean; // Added to control visibility of archived repos
}

export type GroupKey = 'language' | 'visibility' | 'none';

export interface GroupedRepositories {
  [groupName: string]: GitHubRepository[];
}

// For language color mapping
export interface LanguageColorMapping {
  [language: string]: string;
}

// Moved from geminiService.ts
export interface RepoContext {
  owner: string;
  repoName: string;
  description: string | null;
  language: string | null;
  topics?: string[];
}

export interface FeedbackItem {
  type: 'technical' | 'creative' | 'suggestion' | 'general';
  point: string;
  emoji: string;
}

export interface FinalReportJson {
  projectName: string;
  summary: string;
  score: number;
  scoreRationale?: string; // Optional rationale for the score
  highlightedFeature: {
    name: string;
    description: string;
  };
  feedbackItems: FeedbackItem[];
}

// Enum for AI Insight Progress Stages
export enum InsightProgress {
  IDLE = "IDLE", // Initial state before any action
  INITIALIZING = "INITIALIZING", // Initial setup, API key checks
  FETCHING_STRUCTURE = "FETCHING_STRUCTURE", // Getting repo tree
  AI_PROMPT_PREP = "AI_PROMPT_PREP", // Preparing prompt for AI
  AI_QUERYING = "AI_QUERYING", // Waiting for AI response
  AI_PROCESSING_REQUEST = "AI_PROCESSING_REQUEST", // AI asked for data
  FETCHING_FILES = "FETCHING_FILES", // Getting specific file contents or dir listings
  ANALYZING_CONTENT = "ANALYZING_CONTENT", // Abstract stage for when AI is "thinking" after getting data
  GENERATING_REPORT = "GENERATING_REPORT", // AI is composing the final report
  FINALIZING = "FINALIZING", // Processing final response from AI
  COMPLETED = "COMPLETED", // Successfully finished
  ERROR = "ERROR", // An error occurred
}

// Callback type for progress updates
export type ProgressCallback = (stage: InsightProgress, message: string) => void;
