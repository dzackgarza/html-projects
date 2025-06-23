
import { Octokit } from '@octokit/core';
import { GitHubRepository } from '../types';



// Get GitHub API token from environment variable
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

if (!GITHUB_API_TOKEN) {
  console.warn('[githubService] GitHub API token not found in environment variables. Some features may not work properly.');
}

const octokit = new Octokit({ auth: GITHUB_API_TOKEN });

export const fetchUserRepositories = async (username: string): Promise<GitHubRepository[]> => {
  if (!username.trim()) {
    return []; // Return empty if username is empty
  }
  let initialRepos: GitHubRepository[] = [];
  try {
    // Using Octokit for consistency, though fetch was also fine for this public endpoint.
    const response = await octokit.request('GET /users/{username}/repos', {
        username: username,
        per_page: 100,
        sort: 'updated',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    initialRepos = response.data as unknown as GitHubRepository[]; // Cast needed as Octokit types are broad

  } catch (error: any) {
    let errorMessage = `Failed to fetch repositories for '${username}'.`;
    if (error.status === 404) {
      errorMessage = `User '${username}' not found.`;
    } else if (error.status === 403) {
      const rateLimitReset = error.response?.headers?.['x-ratelimit-reset'];
      errorMessage = 'API rate limit exceeded for initial fetch.';
      if (rateLimitReset) {
        errorMessage += ` Try again after ${new Date(Number(rateLimitReset) * 1000).toLocaleTimeString()}.`;
      }
    } else if (error.message) {
        errorMessage += ` Details: ${error.message}`;
    }
    console.error(`[githubService] ${errorMessage}`, error);
    throw new Error(errorMessage);
  }

  if (initialRepos.length > 0) {
    const detailedReposPromises = initialRepos.map(async (repo) => {
      try {
        const { data: languagesDetail } = await octokit.request('GET /repos/{owner}/{repo}/languages', {
          owner: repo.owner.login,
          repo: repo.name,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

        repo.languages_detail = languagesDetail as { [language: string]: number };
        
        if (repo.languages_detail && Object.keys(repo.languages_detail).length > 0) {
          repo.primary_language_from_detail = Object.keys(repo.languages_detail).reduce((a, b) => 
            (repo.languages_detail as { [language: string]: number })[a] > (repo.languages_detail as { [language: string]: number })[b] ? a : b
          );
        } else {
          repo.primary_language_from_detail = repo.language || undefined; 
        }
        return repo;
      } catch (langError: any) {
        let errorMessage = `Failed to fetch detailed languages for ${repo.full_name}.`;
         if (langError.status === 401) {
            errorMessage += ' (Bad credentials - check your API token for language fetching)';
        } else if (langError.status === 403) {
            errorMessage += ' (Rate limit exceeded or forbidden for language fetching)';
        } else if (langError.message) {
            errorMessage += ` Error: ${langError.message}`;
        }
        console.warn(`[githubService] ${errorMessage}`);
        repo.primary_language_from_detail = repo.language || undefined; 
        return repo; 
      }
    });

    try {
      const reposWithDetails = await Promise.all(detailedReposPromises);
      return reposWithDetails;
    } catch (e) {
        console.error("[githubService] Error processing detailed language fetches with Promise.all: ", e);
        return initialRepos.map(repo => ({...repo, primary_language_from_detail: repo.language || undefined }));
    }
  } else {
    return initialRepos.map(repo => ({
      ...repo,
      primary_language_from_detail: repo.language || undefined 
    }));
  }
};


export interface RepoTreeItem {
  name: string;
  path: string;
  type: 'file' | 'dir'; // Simplified types
}

export async function fetchRepoTree(owner: string, repoName: string, dirPath: string = ''): Promise<RepoTreeItem[]> {
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo: repoName,
      path: dirPath,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (Array.isArray(data)) {
      return data.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type as 'file' | 'dir',
      }));
    }
    console.warn(`[githubService] Path '${dirPath}' in '${owner}/${repoName}' did not return an array of items. It might be a file or an unexpected API response. Returning empty list.`);
    return [];
  } catch (error: any) {
    let errorMessage = `Failed to fetch directory structure for '${owner}/${repoName}${dirPath ? `/${dirPath}` : ''}'.`;
    if (error.status) { // Octokit error with status
      switch (error.status) {
        case 404:
          errorMessage = `Directory or repository not found: '${owner}/${repoName}${dirPath ? `/${dirPath}` : ''}'.`;
          break;
        case 403:
          const rateLimitReset = error.response?.headers?.['x-ratelimit-reset'];
          errorMessage = `API rate limit exceeded or access forbidden for '${owner}/${repoName}${dirPath ? `/${dirPath}` : ''}'.`;
          if (rateLimitReset) {
            errorMessage += ` Try again after ${new Date(Number(rateLimitReset) * 1000).toLocaleTimeString()}.`;
          }
          break;
        case 401:
          errorMessage = `Unauthorized. Check GitHub API token permissions for '${owner}/${repoName}${dirPath ? `/${dirPath}` : ''}'.`;
          break;
        default:
          errorMessage += ` GitHub API returned status ${error.status}.`;
          if (error.message && !errorMessage.includes(error.message)) {
            errorMessage += ` Details: ${error.message}`;
          }
      }
    } else if (error.message && !errorMessage.includes(error.message)) { // Generic error
        errorMessage += ` Details: ${error.message}`;
    }

    console.error(`[githubService] Error in fetchRepoTree: ${errorMessage}. Original error:`, error);
    throw new Error(errorMessage);
  }
}

const MAX_FILE_LINES = 200;
const MAX_FILE_CHARS = 10000; // Approx 10KB, generous for 200 lines

export async function fetchFileContent(owner: string, repoName: string, filePath: string): Promise<string> {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo: repoName,
      path: filePath,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    const data = response.data as any;

    if (data.type !== 'file' || typeof data.content !== 'string' || data.encoding !== 'base64') {
      const warningMsg = `Path '${filePath}' in '${owner}/${repoName}' is not a file, has no content, or is not base64 encoded.`;
      console.warn(`[githubService] ${warningMsg}`);
      throw new Error(warningMsg);
    }

    let content: string;
    try {
      const binaryString = atob(data.content);
      const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
      content = new TextDecoder().decode(bytes);
    } catch (decodeError: any) {
      const errorMsg = `Error decoding file content for '${filePath}' in '${owner}/${repoName}': ${decodeError.message}`;
      console.error(`[githubService] ${errorMsg}`, decodeError);
      throw new Error(errorMsg);
    }
    
    const lines = content.split('\n');
    if (lines.length > MAX_FILE_LINES) {
      content = lines.slice(0, MAX_FILE_LINES).join('\n') + `\n\n[Content truncated at ${MAX_FILE_LINES} lines]`;
    }
    if (content.length > MAX_FILE_CHARS) {
      content = content.substring(0, MAX_FILE_CHARS) + `\n\n[Content truncated at ${MAX_FILE_CHARS} characters]`;
    }

    return content;
  } catch (error: any) {
    // If it's an error we threw above (like not a file, decode error), rethrow it.
    if (error.message.includes(`Path '${filePath}' in '${owner}/${repoName}' is not a file`) || 
        error.message.includes(`Error decoding file content for '${filePath}'`)) {
        throw error; 
    }

    let errorMessage = `Failed to fetch file content for '${owner}/${repoName}/${filePath}'.`;
    if (error.status) { 
      switch (error.status) {
        case 404:
          errorMessage = `File not found: '${owner}/${repoName}/${filePath}'.`;
          break;
        case 403:
          const rateLimitReset = error.response?.headers?.['x-ratelimit-reset'];
          errorMessage = `API rate limit exceeded or access forbidden for file '${owner}/${repoName}/${filePath}'.`;
          if (rateLimitReset) {
            errorMessage += ` Try again after ${new Date(Number(rateLimitReset) * 1000).toLocaleTimeString()}.`;
          }
          break;
        case 401:
            errorMessage = `Unauthorized. Check GitHub API token permissions for file '${owner}/${repoName}/${filePath}'.`;
            break;
        default:
          errorMessage += ` GitHub API returned status ${error.status}.`;
          if (error.message && !errorMessage.includes(error.message)) {
            errorMessage += ` Details: ${error.message}`;
          }
      }
    } else if (error.message && !errorMessage.includes(error.message)) {
        errorMessage += ` Details: ${error.message}`;
    }
    console.error(`[githubService] Error in fetchFileContent: ${errorMessage}. Original error:`, error);
    throw new Error(errorMessage);
  }
}
