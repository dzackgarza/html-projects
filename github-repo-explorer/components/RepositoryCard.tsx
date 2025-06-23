import React from 'react';
import { GitHubRepository } from '../types';
import { LockClosedIcon, PinIcon, PinOffIcon, TagIcon, GearIcon, SparklesIcon } from '../constants'; 
import { LanguageIcon } from './LanguageIcon'; 

interface RepositoryCardProps {
  repository: GitHubRepository;
  isPinned: boolean;
  onPinToggle: (repoId: number) => void;
  borderColorClass: string; 
  textColorClass: string;
  displayLanguage: string | null | undefined; 
  onShowInsights: (repo: GitHubRepository) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ 
  repository, 
  isPinned, 
  onPinToggle, 
  borderColorClass, 
  textColorClass, 
  displayLanguage,
  onShowInsights
}) => {
  const lastUpdated = new Date(repository.pushed_at || repository.updated_at).toLocaleDateString('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPinToggle(repository.id);
  };

  const handleInsightsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShowInsights(repository);
  };

  const currentDisplayLanguage = displayLanguage || 'Markdown'; // Default to Markdown if null/undefined

  // Emphasis for Markdown and TeX repositories (now they share a color)
  let cardBgClass = 'bg-slate-700';
  const langLower = currentDisplayLanguage.toLowerCase();
  if (langLower === 'markdown' || langLower === 'tex') {
    cardBgClass = 'bg-slate-600'; // Slightly different background for emphasis
  }


  return (
    <div 
      className={`relative ${cardBgClass} shadow-lg rounded-md p-2 flex flex-col justify-between h-full border-l-4 hover:shadow-xl transition-all duration-150 ease-in-out ${borderColorClass}`}
    >
      {repository.private && (
        <div className="absolute top-0 right-0 h-full w-1 bg-red-500/40 rounded-r-md pointer-events-none" title="Private Repository"></div>
      )}
      {repository.fork && (
        <div 
            className="absolute bottom-0 left-0 h-1 w-full bg-sky-600/60 rounded-b-md pointer-events-none" 
            title="Forked Repository"
        ></div>
      )}
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-semibold text-sky-400 hover:text-sky-300 break-words leading-tight mr-0.5" title={repository.name}>
            <a href={repository.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {repository.name}
            </a>
          </h3>
          <div className="flex items-center space-x-1 shrink-0 ml-1"> {/* Reduced space-x-1.5 to space-x-1 */}
            {repository.private && ( 
              <span title="Private repository">
                <LockClosedIcon className="w-3.5 h-3.5 text-red-400" />
              </span>
            )}
            <button
              onClick={handleInsightsClick}
              title="AI Insights"
              aria-label="Get AI insights for this repository"
              className="p-0.5 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <SparklesIcon className="w-4 h-4" />
            </button>
            <a
              href={`${repository.html_url}/settings`}
              target="_blank"
              rel="noopener noreferrer"
              title="Repository settings"
              aria-label="Repository settings"
              onClick={(e) => e.stopPropagation()} // Prevent card click through
              className="p-0.5 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <GearIcon className="w-4 h-4" />
            </a>
            <button
              onClick={handlePinClick}
              title={isPinned ? 'Unpin repository' : 'Pin repository'}
              aria-label={isPinned ? 'Unpin repository' : 'Pin repository'}
              className="p-0.5 rounded hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {isPinned ? <PinIcon className="w-4 h-4 text-sky-500" /> : <PinOffIcon className="w-4 h-4 text-slate-500 hover:text-slate-300" />}
            </button>
          </div>
        </div>
        
        <p className="italic text-slate-400 text-xs mb-1.5 leading-snug h-8 overflow-hidden" title={repository.description || ''}>
          {repository.description ? 
            (repository.description.length > 55 ? repository.description.substring(0, 55) + '...' : repository.description) : 
            <span className="text-slate-500">No description.</span>
          }
        </p>

        {currentDisplayLanguage && ( // Always show language, default is Markdown
          <div className="mb-1.5 flex items-center">
            <LanguageIcon language={currentDisplayLanguage} className={`w-3 h-3 mr-1`} iconColorClass={textColorClass}/>
            <span className={`text-[10px] font-medium ${textColorClass}`}>
              {currentDisplayLanguage}
            </span>
          </div>
        )}
        
        {repository.topics && repository.topics.length > 0 && (
          <div className="mb-1.5 h-8 overflow-y-auto custom-scrollbar-thin">
             <div className="flex flex-wrap gap-x-0.5 gap-y-0.5">
                {repository.topics.map(topic => (
                <span key={topic} className="text-[10px] bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded-full inline-flex items-center">
                   <TagIcon className="w-2 h-2 mr-0.5 text-slate-400"/> {topic}
                </span>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-1.5 border-t border-slate-600">
        <p className="text-[10px] text-slate-500">
          Pushed: {lastUpdated}
        </p>
      </div>
    </div>
  );
};
