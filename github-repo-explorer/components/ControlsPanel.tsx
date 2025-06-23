
import React from 'react';
import { SortOption, FilterState, GroupKey, SortableRepoKeys } from '../types';
import { ChevronDownIcon } from '../constants';

interface ControlsPanelProps {
  username: string;
  onUsernameChange: (username: string) => void;
  onFetchSubmit: () => void;
  isLoading: boolean;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  groupOption: GroupKey;
  onGroupChange: (groupKey: GroupKey) => void;
  availableLanguages: string[];
  onClosePanel: () => void;
}

const ControlSelectWrapper: React.FC<{label: string; children: React.ReactNode; className?: string}> = ({ label, children, className }) => (
  <div className={`relative ${className}`}>
    <label className="block text-xs font-medium text-slate-400 mb-0.5">{label}</label>
    {children}
  </div>
);

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  username,
  onUsernameChange,
  onFetchSubmit,
  isLoading,
  sortOption,
  onSortChange,
  filterState,
  onFilterChange,
  groupOption,
  onGroupChange,
  availableLanguages,
  onClosePanel,
}) => {
  const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({ ...sortOption, key: e.target.value as SortableRepoKeys });
  };

  const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({ ...sortOption, direction: e.target.value as 'asc' | 'desc' });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        onFilterChange({ ...filterState, [name]: checked });
    } else {
        onFilterChange({ ...filterState, [name]: value });
    }
  };
  
  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onGroupChange(e.target.value as GroupKey);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetchSubmit();
  };

  const selectClassName = "block w-full pl-2 pr-7 py-1 text-xs border-slate-500 bg-slate-700 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 rounded-md shadow-sm appearance-none disabled:opacity-50 disabled:cursor-not-allowed";
  const iconWrapperClassName = "pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-400";
  const checkboxClassName = "h-3.5 w-3.5 rounded border-slate-500 bg-slate-700 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800 disabled:opacity-50";


  return (
    // Removed fixed positioning, panel will be centered by parent overlay
    <div 
        className="bg-slate-800/95 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-slate-600 w-72 sm:w-80 max-h-[90vh] overflow-y-auto"
        id="controls-panel-title" // For aria-labelledby from the modal wrapper
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-sky-400">Filter & Sort</h3>
        <button
          onClick={onClosePanel}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-700"
          aria-label="Close controls panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-1.5 items-center mb-3.5">
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="GitHub User"
            aria-label="GitHub Username"
            className="flex-grow p-1.5 text-xs border border-slate-500 bg-slate-700 text-slate-200 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-600 hover:bg-sky-500 text-white font-medium py-1.5 px-2.5 text-xs rounded-md shadow hover:shadow-md transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Wait...' : 'Fetch'}
          </button>
      </form>
      
      <div className="border-t border-slate-700 pt-3.5">
        <div className="grid grid-cols-2 gap-y-3 mb-3.5">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isWritingOnly"
              checked={filterState.isWritingOnly}
              onChange={handleFilterChange}
              className={checkboxClassName}
            />
            <span className="text-xs text-slate-300 select-none">Writing Only</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="showArchived"
              checked={filterState.showArchived}
              onChange={handleFilterChange}
              className={checkboxClassName}
            />
            <span className="text-xs text-slate-300 select-none">Show Archived</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ControlSelectWrapper label="Sort by" className="min-w-[100px]">
                <div className="relative">
                    <select
                        name="sortKey"
                        value={sortOption.key}
                        onChange={handleSortKeyChange}
                        className={selectClassName}
                        aria-label="Sort by field"
                    >
                        <option value="pushed_at">Pushed</option>
                        <option value="updated_at">Updated</option>
                        <option value="created_at">Created</option>
                        <option value="name">Name</option>
                    </select>
                    <div className={iconWrapperClassName}><ChevronDownIcon className="w-3 h-3" /></div>
                </div>
            </ControlSelectWrapper>

            <ControlSelectWrapper label="Direction" className="min-w-[80px]">
                <div className="relative">
                    <select
                        name="sortDirection"
                        value={sortOption.direction}
                        onChange={handleSortDirectionChange}
                        className={selectClassName}
                        aria-label="Sort direction"
                    >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                    </select>
                    <div className={iconWrapperClassName}><ChevronDownIcon className="w-3 h-3" /></div>
                </div>
            </ControlSelectWrapper>

            <ControlSelectWrapper label="Language" className="min-w-[110px]">
                <div className="relative">
                    <select
                        name="language"
                        value={filterState.isWritingOnly ? '' : filterState.language} // Clear language if writing only
                        onChange={handleFilterChange}
                        className={selectClassName}
                        aria-label="Filter by language"
                        disabled={filterState.isWritingOnly}
                    >
                        <option value="">{filterState.isWritingOnly ? 'N/A (MD/TeX)' : 'All Langs'}</option>
                        {!filterState.isWritingOnly && availableLanguages.map(lang => (
                           <option key={lang} value={lang}>{lang.length > 15 ? lang.substring(0,12) + '...' : lang}</option>
                        ))}
                    </select>
                    <div className={iconWrapperClassName}><ChevronDownIcon className="w-3 h-3" /></div>
                </div>
            </ControlSelectWrapper>

            <ControlSelectWrapper label="Type" className="min-w-[90px]">
                <div className="relative">
                    <select
                        name="type"
                        value={filterState.type}
                        onChange={handleFilterChange}
                        className={selectClassName}
                        aria-label="Filter by repository type"
                    >
                        <option value="all">All Types</option>
                        <option value="sources">Sources</option>
                        <option value="forks">Forks</option>
                    </select>
                    <div className={iconWrapperClassName}><ChevronDownIcon className="w-3 h-3" /></div>
                </div>
            </ControlSelectWrapper>
            
            <ControlSelectWrapper label="Visibility" className="min-w-[90px]">
                <div className="relative">
                    <select
                        name="visibility"
                        value={filterState.visibility}
                        onChange={handleFilterChange}
                        className={selectClassName}
                        aria-label="Filter by repository visibility"
                    >
                        <option value="all">All Vis.</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <div className={iconWrapperClassName}><ChevronDownIcon className="w-3 h-3" /></div>
                </div>
            </ControlSelectWrapper>

            <ControlSelectWrapper label="Group by" className="min-w-[100px]">
                <div className="relative">
                    <select
                        name="groupOption"
                        value={groupOption}
                        onChange={handleGroupChange}
                        className={selectClassName}
                        aria-label="Group repositories by"
                    >
                        <option value="none">No Group</option>
                        <option value="language">Language</option>
                        <option value="visibility">Visibility</option>
                    </select>
                    <div className={iconWrapperClassName}><ChevronDownIcon className="w-3 h-3" /></div>
                </div>
            </ControlSelectWrapper>
          </div>
        </div>
    </div>
  );
};

export default ControlsPanel;
