
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { marked } from 'marked';
import { GitHubRepository, SortOption, FilterState, GroupKey, GroupedRepositories, SortableRepoKeys, LanguageColorMapping, InsightProgress, ProgressCallback } from './types';
import { fetchUserRepositories } from './services/githubService';
import { fetchRepositoryInsights } from './services/geminiService';
import { getColorClassForLanguage, fuzzyMatch } from './utils';
import { RepositoryCard } from './components/RepositoryCard';
import ControlsPanel from './components/ControlsPanel';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { PinIcon as PinnedSectionIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, XCircleIcon, ClipboardIcon, CheckIcon } from './constants';

const LS_PREFIX = 'githubRepoExplorer_v3_';
const LS_KEYS = {
  USERNAME: `${LS_PREFIX}username`,
  SORT_OPTION: `${LS_PREFIX}sortOption`,
  FILTER_STATE: `${LS_PREFIX}filterState`,
  GROUP_OPTION: `${LS_PREFIX}groupOption`,
  PINNED_IDS: `${LS_PREFIX}pinnedRepoIds`,
  CONTROLS_PANEL_OPEN: `${LS_PREFIX}controlsPanelOpen`,
  SEARCH_TERM: `${LS_PREFIX}searchTerm`,
};

const App: React.FC = () => {
  const [username, setUsername] = useState<string>(() => localStorage.getItem(LS_KEYS.USERNAME) || 'dzackgarza');
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);

  const [pinnedRepoIds, setPinnedRepoIds] = useState<number[]>(() => {
    const saved = localStorage.getItem(LS_KEYS.PINNED_IDS);
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState<string>(() => localStorage.getItem(LS_KEYS.SEARCH_TERM) || '');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [displayedPinnedRepos, setDisplayedPinnedRepos] = useState<GitHubRepository[]>([]);
  const [displayedUnpinnedRepos, setDisplayedUnpinnedRepos] = useState<GitHubRepository[]>([]);
  const [groupedUnpinnedRepos, setGroupedUnpinnedRepos] = useState<GroupedRepositories | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<SortOption>(() => {
    const saved = localStorage.getItem(LS_KEYS.SORT_OPTION);
    return saved ? JSON.parse(saved) : { key: 'pushed_at', direction: 'desc' };
  });

  const [filterState, setFilterState] = useState<FilterState>(() => {
    const saved = localStorage.getItem(LS_KEYS.FILTER_STATE);
    const defaultFilterState: FilterState = {
        language: '',
        type: 'all',
        visibility: 'all',
        isWritingOnly: false,
        showArchived: false
    };
    if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultFilterState, ...parsed };
    }
    return defaultFilterState;
  });

  const [groupOption, setGroupOption] = useState<GroupKey>(() => {
    const saved = localStorage.getItem(LS_KEYS.GROUP_OPTION) as GroupKey;
    return saved || 'none';
  });
  const [isControlsPanelOpen, setIsControlsPanelOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(LS_KEYS.CONTROLS_PANEL_OPEN);
    return saved ? JSON.parse(saved) : false;
  });

  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  // State for AI Insights Modal
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState<boolean>(false);
  const [selectedRepoForInsights, setSelectedRepoForInsights] = useState<GitHubRepository | null>(null);
  const [insightsContent, setInsightsContent] = useState<string>('');
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [insightsProgressStage, setInsightsProgressStage] = useState<InsightProgress | null>(null);
  const [insightsProgressMessage, setInsightsProgressMessage] = useState<string | null>(null);


  useEffect(() => { localStorage.setItem(LS_KEYS.USERNAME, username); }, [username]);
  useEffect(() => { localStorage.setItem(LS_KEYS.SORT_OPTION, JSON.stringify(sortOption)); }, [sortOption]);
  useEffect(() => { localStorage.setItem(LS_KEYS.FILTER_STATE, JSON.stringify(filterState)); }, [filterState]);
  useEffect(() => { localStorage.setItem(LS_KEYS.GROUP_OPTION, groupOption); }, [groupOption]);
  useEffect(() => { localStorage.setItem(LS_KEYS.PINNED_IDS, JSON.stringify(pinnedRepoIds)); }, [pinnedRepoIds]);
  useEffect(() => { localStorage.setItem(LS_KEYS.CONTROLS_PANEL_OPEN, JSON.stringify(isControlsPanelOpen));}, [isControlsPanelOpen]);
  useEffect(() => { localStorage.setItem(LS_KEYS.SEARCH_TERM, searchTerm);}, [searchTerm]);

  const getEffectiveLanguage = (repo: GitHubRepository): string => {
    return repo.primary_language_from_detail || repo.language || "Markdown";
  };

  const handleFetchRepositories = useCallback(async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      setRepositories([]);
      setAvailableLanguages([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRepos = await fetchUserRepositories(username);
      setRepositories(fetchedRepos);

      const languages = Array.from(new Set(
        fetchedRepos.map(repo => getEffectiveLanguage(repo))
          .filter(lang => typeof lang === 'string' && lang.trim() !== '')
      )).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())) as string[];
      setAvailableLanguages(languages);

      if (fetchedRepos.length === 0 && username.trim()) {
        setError(`No repositories found for user '${username}'.`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setRepositories([]);
      setAvailableLanguages([]);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username.trim()) {
        handleFetchRepositories();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTogglePin = (repoId: number) => {
    setPinnedRepoIds(prevPinned =>
      prevPinned.includes(repoId)
        ? prevPinned.filter(id => id !== repoId)
        : [...prevPinned, repoId]
    );
  };

  const handleProgressUpdate: ProgressCallback = (stage, message) => {
    setInsightsProgressStage(stage);
    setInsightsProgressMessage(message);
    if (stage === InsightProgress.ERROR) {
        setInsightsError(message); // Also set the main error if it's a progress error
    }
  };

  const handleShowInsights = async (repo: GitHubRepository) => {
    setSelectedRepoForInsights(repo);
    setIsInsightsModalOpen(true);
    setInsightsLoading(true);
    setInsightsError(null);
    setInsightsContent('');
    setIsCopied(false);
    setInsightsProgressStage(InsightProgress.IDLE);
    setInsightsProgressMessage("Preparing AI analysis...");


    try {
      const insightsString = await fetchRepositoryInsights(
        {
          owner: repo.owner.login,
          repoName: repo.name,
          description: repo.description,
          language: getEffectiveLanguage(repo),
          topics: repo.topics
        },
        handleProgressUpdate 
      );
      
      setInsightsContent(insightsString);
      if (insightsProgressStage !== InsightProgress.ERROR) { // Don't clear error if progress reported one
          setInsightsError(null); 
      }

    } catch (error: any) {
      // This catch is a fallback, errors should ideally be reported via ProgressCallback
      const errorMsg = `An unexpected error occurred while initiating AI insights. ${error.message || 'Unknown error'}`;
      console.error(errorMsg, error);
      setInsightsError(errorMsg); 
      setInsightsContent(
        `## AI Insights Unavailable\n\nAn unexpected client-side error occurred: ${errorMsg}`
      );
      setInsightsProgressStage(InsightProgress.ERROR);
      setInsightsProgressMessage(errorMsg);
    } finally {
      setInsightsLoading(false);
      // Don't reset progress stage here, let COMPLETED or ERROR persist until modal close
    }
  };

  const handleCopyInsights = async () => {
    if (!insightsContent) return;
    try {
      await navigator.clipboard.writeText(insightsContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy insights:', err);
      setInsightsError("Failed to copy insights to clipboard.");
    }
  };

  const handleCloseInsightsModal = () => {
    setIsInsightsModalOpen(false);
    setSelectedRepoForInsights(null);
    setInsightsLoading(false);
    setInsightsError(null);
    setInsightsContent('');
    setIsCopied(false);
    setInsightsProgressStage(null);
    setInsightsProgressMessage(null);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey ||
          event.key.length > 1 && event.key !== 'Backspace' && event.key !== 'Delete'
         ) {
        if (event.key !== ' ' && event.key.length > 1) return;
      }

      if (searchInputRef.current) {
        if (event.key.length === 1) {
             if (document.activeElement !== searchInputRef.current) {
                searchInputRef.current.focus();
             }
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);


  useEffect(() => {
    let processedRepos = repositories;
    if (searchTerm.trim()) {
        processedRepos = repositories.filter(repo =>
            fuzzyMatch(searchTerm, repo.name) ||
            (repo.description && fuzzyMatch(searchTerm, repo.description)) ||
            (repo.topics && repo.topics.some(topic => fuzzyMatch(searchTerm, topic)))
        );
    }

    const pinned = pinnedRepoIds
      .map(id => processedRepos.find(repo => repo.id === id))
      .filter(Boolean) as GitHubRepository[];
    pinned.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    setDisplayedPinnedRepos(pinned);

    let unpinned = processedRepos.filter(repo => !pinnedRepoIds.includes(repo.id));

    if (!filterState.showArchived) {
        unpinned = unpinned.filter(repo => !repo.archived);
    }

    if (filterState.isWritingOnly) {
        unpinned = unpinned.filter(repo => {
            const lang = getEffectiveLanguage(repo).toLowerCase();
            return lang === 'markdown' || lang === 'tex';
        });
    } else {
        if (filterState.language) {
          unpinned = unpinned.filter(repo => getEffectiveLanguage(repo) === filterState.language);
        }
    }

    if (filterState.type === 'forks') {
      unpinned = unpinned.filter(repo => repo.fork);
    } else if (filterState.type === 'sources') {
      unpinned = unpinned.filter(repo => !repo.fork);
    }
    if (filterState.visibility === 'public') {
      unpinned = unpinned.filter(repo => !repo.private);
    } else if (filterState.visibility === 'private') {
      unpinned = unpinned.filter(repo => repo.private);
    }

    if (sortOption.key) {
      unpinned.sort((a, b) => {
        let valA = a[sortOption.key as SortableRepoKeys] as any;
        let valB = b[sortOption.key as SortableRepoKeys] as any;

        if (sortOption.key === 'updated_at' || sortOption.key === 'pushed_at' || sortOption.key === 'created_at') {
          valA = new Date(valA as string).getTime();
          valB = new Date(valB as string).getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOption.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortOption.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setDisplayedUnpinnedRepos(unpinned);

    if (groupOption === 'none' || unpinned.length === 0) {
        setGroupedUnpinnedRepos(null);
    } else {
        const grouped: GroupedRepositories = {};
        unpinned.forEach(repo => {
            let groupValue: string;
            if (groupOption === 'language') {
                groupValue = getEffectiveLanguage(repo) || 'Unspecified';
            } else if (groupOption === 'visibility') {
                groupValue = repo.private ? 'Private' : 'Public';
            } else {
                groupValue = 'All';
            }

            if (!grouped[groupValue]) {
                grouped[groupValue] = [];
            }
            grouped[groupValue].push(repo);
        });

        const sortedGrouped: GroupedRepositories = {};
        Object.keys(grouped).sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase())).forEach(key => {
            sortedGrouped[key] = grouped[key];
        });
        setGroupedUnpinnedRepos(sortedGrouped);
    }

  }, [repositories, filterState, sortOption, groupOption, pinnedRepoIds, searchTerm]);

  const renderRepoGrid = (repos: GitHubRepository[], sectionId: string) => (
    <div id={sectionId} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2.5">
      {repos.map(repo => {
        const langForDisplay = getEffectiveLanguage(repo);
        const combinedColorClass = getColorClassForLanguage(langForDisplay);
        const colorParts = combinedColorClass.split(' ');
        const borderColorClass = colorParts.find(c => c.startsWith('border-')) || 'border-slate-400';
        const textColorClass = colorParts.find(c => c.startsWith('text-')) || 'text-slate-400';

        return (
          <RepositoryCard
            key={repo.id}
            repository={repo}
            isPinned={pinnedRepoIds.includes(repo.id)}
            onPinToggle={handleTogglePin}
            borderColorClass={borderColorClass}
            textColorClass={textColorClass}
            displayLanguage={langForDisplay}
            onShowInsights={handleShowInsights}
          />
        );
      })}
    </div>
  );


  let htmlToRenderInModal = "";
  if (insightsContent && !insightsLoading && !insightsError) {
      let markdownToParse = insightsContent;
      // Check if the content is already a placeholder report or error that might not need fence stripping
      if (!markdownToParse.startsWith("## AI Insights for") || !markdownToParse.includes("AI Analysis Unavailable")) {
        const fenceRegex = /^```(\w*\s*)?\n?([\s\S]*?)\n?```$/s;
        const match = insightsContent.match(fenceRegex);

        if (match && typeof match[2] === 'string') { 
            markdownToParse = match[2].trim();
        }
      }
      htmlToRenderInModal = marked.parse(markdownToParse) as string;
  }


  return (
    <div className="min-h-screen bg-slate-800 text-slate-300 relative">
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center">
        <div className="relative flex items-center">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-100">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Fuzzy search repos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 sm:w-96 pl-10 pr-20 sm:pr-24 py-2.5 text-sm bg-sky-600 text-white border-2 border-sky-400 rounded-full shadow-2xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none placeholder-sky-200 transition-all"
            aria-label="Search repositories"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-12 sm:right-14 top-1/2 -translate-y-1/2 text-sky-200 hover:text-white p-0.5"
              aria-label="Clear search"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsControlsPanelOpen(prev => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-md transition-all"
            aria-label={isControlsPanelOpen ? "Close controls panel" : "Open controls panel"}
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isControlsPanelOpen && (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setIsControlsPanelOpen(false);
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="controls-panel-title"
        >
          <ControlsPanel
            username={username}
            onUsernameChange={setUsername}
            onFetchSubmit={() => {
              handleFetchRepositories();
            }}
            isLoading={isLoading}
            sortOption={sortOption}
            onSortChange={setSortOption}
            filterState={filterState}
            onFilterChange={setFilterState}
            groupOption={groupOption}
            onGroupChange={setGroupOption}
            availableLanguages={availableLanguages}
            onClosePanel={() => setIsControlsPanelOpen(false)}
          />
        </div>
      )}

      {isInsightsModalOpen && selectedRepoForInsights && (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleCloseInsightsModal();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="insights-modal-title"
        >
            <div className="bg-slate-700 p-4 sm:p-6 rounded-lg shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-600">
                <div className="flex justify-between items-center mb-3 sm:mb-4 shrink-0">
                    <h3 id="insights-modal-title" className="text-lg sm:text-xl font-semibold text-sky-400 truncate mr-2" title={selectedRepoForInsights.name}>
                        AI Insights: {selectedRepoForInsights.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleCopyInsights}
                            title={isCopied ? "Copied!" : "Copy insights to clipboard"}
                            aria-label={isCopied ? "Insights copied" : "Copy insights to clipboard"}
                            className="p-1.5 rounded-full text-slate-400 hover:text-sky-400 hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors duration-150"
                            disabled={insightsLoading || !insightsContent || !!insightsError}
                        >
                            {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleCloseInsightsModal}
                            className="text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-600"
                            aria-label="Close AI insights"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="text-slate-300 min-h-[150px] flex-grow overflow-y-auto custom-scrollbar-thin pr-1 sm:pr-2">
                    {insightsLoading ? (
                        <div className="flex flex-col justify-center items-center h-full text-center">
                            <LoadingSpinner />
                            <p className="mt-2 text-xs text-slate-400 max-w-xs break-words">
                                {insightsProgressMessage || "The AI is analyzing the repository... This might take a moment."}
                            </p>
                        </div>
                    ) : insightsError && insightsProgressStage === InsightProgress.ERROR ? ( // Only show ErrorMessage if progress indicates error
                        <ErrorMessage message={insightsError} />
                    ) : insightsContent ? ( 
                        <div
                            className="markdown-content"
                            dangerouslySetInnerHTML={{ __html: htmlToRenderInModal }}
                        />
                    ) : (
                        <p className="text-center text-slate-400">No insights available or generated.</p>
                    )}
                </div>
            </div>
        </div>
      )}

      <main className="container mx-auto max-w-7xl p-2 sm:p-3 pt-6 pb-24">
        <ErrorMessage message={error || ""} />

        {isLoading && <LoadingSpinner />}

        {!isLoading && !error && displayedPinnedRepos.length === 0 && displayedUnpinnedRepos.length === 0 && repositories.length > 0 && (
          <div className="text-center py-8 bg-slate-700 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-slate-200">No Repositories Match Filters</h2>
            <p className="text-slate-400 text-sm">Try adjusting your filter or search options, or check the username.</p>
          </div>
        )}

        {!isLoading && displayedPinnedRepos.length > 0 && (
          <section className="mb-6" aria-labelledby="pinned-repos-heading">
            <h2 id="pinned-repos-heading" className="text-lg font-semibold text-sky-400 mb-2.5 pb-1.5 border-b border-sky-700 flex items-center">
              <PinnedSectionIcon className="w-4 h-4 mr-2 text-sky-500" />
              Pinned ({displayedPinnedRepos.length})
            </h2>
            {renderRepoGrid(displayedPinnedRepos, "pinned-repositories-grid")}
          </section>
        )}

        {!isLoading && groupedUnpinnedRepos ? (
          Object.entries(groupedUnpinnedRepos).map(([groupName, reposInGroup]) => (
            <section key={groupName} className="mb-6" aria-labelledby={`group-heading-${groupName.replace(/\s+/g, '-')}`}>
              <h2 id={`group-heading-${groupName.replace(/\s+/g, '-')}`} className="text-md font-semibold text-slate-300 mb-2.5 pb-1.5 border-b border-slate-600">
                {groupName} ({reposInGroup.length})
              </h2>
              {renderRepoGrid(reposInGroup, `group-grid-${groupName.replace(/\s+/g, '-')}`)}
            </section>
          ))
        ) : !isLoading && displayedUnpinnedRepos.length > 0 ? (
           <section aria-labelledby="all-repos-heading">
            {displayedPinnedRepos.length > 0 && (
                <h2 id="all-repos-heading" className="text-lg font-semibold text-slate-200 mb-2.5 pb-1.5 border-b border-slate-600">
                    Other Repositories ({displayedUnpinnedRepos.length})
                </h2>
            )}
            {renderRepoGrid(displayedUnpinnedRepos, "unpinned-repositories-grid")}
           </section>
        ) : null}

        {!isLoading && !error && repositories.length === 0 && !username.trim() && (
             <div className="text-center py-8 bg-slate-700 rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold text-slate-200">Enter a GitHub Username</h2>
                <p className="text-slate-400 text-sm">Start by typing a username above and clicking "Fetch Repositories".</p>
            </div>
        )}
      </main>
      <footer className="text-center py-5 text-xs text-slate-500 border-t border-slate-700 mt-8">
        <p>&copy; {new Date().getFullYear()} GitHub Repo Explorer. Powered by React, TailwindCSS, Octokit & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
