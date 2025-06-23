
import React from 'react';
import { CodeBracketIcon, BookOpenIcon, SigmaIcon, TerminalIcon } from '../constants'; // Reusing CodeBracketIcon as a generic fallback

// Basic SVGs for some common languages - these are very simplified
const JSIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.153 18.578L13.56 22.399 9.006 18.619 8.995 5.562H18.148V18.578H18.153ZM20.148 3.562H6.995V20.812L13.551 26.219 20.153 20.852 20.148 3.562Z M10.995 16.509H16.148V14.656H10.995V16.509Z M10.995 12.593H16.148V10.739H10.995V12.593Z M10.995 8.677H16.148V6.824H10.995V8.677Z"/></svg>
);
const PythonIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19.143 6.008c-.19.26-.45.429-.738.508l-3.23.89c-.58.16-.968.7-.968 1.309v1.781c0 .02-.02.02-.02.04h-2.399c-.04 0-.06-.02-.06-.06V8.691c0-.609-.389-1.149-.968-1.309L6.591 6.516c-.288-.079-.548-.248-.738-.508S5.565 5.34 5.565 5.02c0-.58.42-.999.969-.999h.889c.199 0 .389.06.548.18L9.752 5.5c.02.02.04.02.06 0l1.249-.89c.14-.1.32-.16.5-.16h.89c.56 0 .969.42.969.989 0 .32-.129.629-.299.869l-1.78 2.38c-.02.02-.02.04 0 .06l1.249.889c.14.1.32.16.5.16h.889c.58 0 .969-.42.969-.989 0-.32-.121-.629-.291-.869l-1.78-2.38c-.02-.02-.02-.04 0 .06L17.2 5.5c.02.02.04 0 .06 0l1.249-.89c.16-.12.349-.18.548-.18h.889c.548 0 .968.42.968.999.009.32-.121.629-.309.869M12 11.411H6.712c-.288-.079-.548-.248-.738-.508s-.288-.58-.288-.889c0-.58.42-.989.969-.989h.889c.199 0 .389.06.548.18l1.781 1.28c.02.02.04 0 .06 0l1.249-.89c.14-.1.32-.16.5-.16h.889c.58 0 .969.42.969.989 0 .32-.121-.629-.291-.869l-1.781-2.38c-.02-.02-.02-.04 0 .06l1.249.89c.14.1.32.16.5.16h5.288c.288.079.548.248.738.508s.288.58.288.889c0 .58-.42.989-.969-.989h-.889c-.199 0-.389-.06-.548-.18l-1.781-1.28c-.02-.02-.04 0-.06 0l-1.249.89c-.14-.1-.32-.16-.5-.16h-.889c-.58 0-.969-.42-.969-.989 0-.32.121-.629.291-.869l1.781-2.38c.02.02.02.04 0 .06L12.019 7.7c-.02-.02-.04 0-.06 0l-1.249-.89c-.16-.12-.349-.18-.548-.18H9.273c-.548 0-.968.42-.968.999 0 .32.121.629.309.869l1.781 2.38c.02.02.02.04 0 .06l-1.249.89c-.14.1-.32.16-.5.16H6.712V11.411Z M17.288 12.589h-5.287c.287.079.548.248.738.508s.287.58.287.889c0 .58-.42.989-.968.989h-.889c-.199 0-.389-.06-.548-.18l-1.781-1.28c-.02-.02-.04 0-.06 0l-1.249.89c-.14.1-.32.16-.5.16h-.889c-.58 0-.968-.42-.968-.989 0-.32.121-.629.291-.869L8.4 10.229c.02-.02.02-.04 0-.06l-1.249-.889c-.14-.1-.32-.16-.5-.16H5.762v6.287c.19-.26.45-.429.738-.508l3.23-.89c.58-.16.969-.7.969-1.309v-1.781c0-.02.02-.02.02-.04h2.399c.04 0 .06.02.06.06v1.781c0 .609.389 1.149.969 1.309l3.23.89c.287.079.548.248.738.508s.287.58.287.889c0 .58-.42.989-.969.989h-.889c-.199 0-.389-.06-.548-.18l-1.781-1.28c-.02-.02-.04 0-.06 0l-1.249.89c-.14.1-.32.16-.5.16h-.889c-.58 0-.969-.42-.969-.989 0-.32.121-.629.291-.869l1.781-2.38c.02-.02.02-.04 0 .06l-1.249-.889c-.14-.1-.32-.16-.5-.16H12v-2.28h5.288Z"/></svg>
);
const HTMLIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M4 3h16l-1.5 16.5L12 21l-6.5-1.5L4 3zm12.5 3.5h-10l.5 3h9l-.5 3h-8l.5 3h7l-.5 3.5-3 .75-3-.75-.25-2.5h-2l.5 5.25L12 19l4.5-1.25L17.5 6.5z"/></svg>
);
const CSSIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M4 3h16l-1.5 16.5L12 21l-6.5-1.5L4 3zm12.85 3.5H12v2.5h3.9l-.3 3.4H12v2.5h3.1l-.3 3.45-3.1.85v-2.6l1.7-.45.15-1.7H12V9.5H8.35l-.2-2.5h8.7z"/></svg>
);
const JavaIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11.999 1.04q.479 0 .8.21.33.21.459.61v.23q-.32-.42-.77-.62-.439-.21-.929-.21-.95 0-1.61.47-.66.47-.97 1.3-.11.29-.16.6-.05.3-.05.61 0 .8.27 1.48.27.68.74 1.22.48.54 1.15 1.01.67.47 1.49 1.01.81.53 1.63 1.25.83.72 1.58 1.7.75.98 1.29 2.27.54 1.29.54 2.82 0 1.63-.59 2.99-.59 1.35-1.68 2.28-1.08.92-2.56 1.39-1.48.46-3.21.46-1.56 0-2.9-.34-1.34-.33-2.38-.92-.2-.11-.32-.3-.12-.2-.12-.41v-.18q.45.54 1.06.82.61.28 1.35.28.98 0 1.66-.44.67-.44.97-1.21.1-.25.14-.52.04-.27.04-.54 0-.73-.26-1.37-.26-.64-.73-1.19-.47-.55-1.13-1.02-.66-.47-1.47-1.01-.8-.53-1.61-1.25-.81-.72-1.56-1.7-.75-.98-1.29-2.27-.54-1.29-.54-2.82 0-1.55.57-2.92.57-1.37 1.62-2.32 1.05-.95 2.47-1.44 1.42-.49 3.05-.49m-.11 1.76q-1.14 0-2.02.32-.87.32-1.48.91-.6.59-.92 1.41-.32.83-.32 1.83 0 1.02.33 1.93.34.91.95 1.73.61.82 1.46 1.55.85.73 1.84 1.55.99.82 1.82 1.72.84.91 1.42 2.02.58 1.11.58 2.5 0 1.18-.39 2.14-.39.97-1.07 1.62-.69.66-1.6.96-.92.31-1.95.31-1.06 0-1.92-.35-.86-.36-1.4-.95-.16-.16-.24-.38-.07-.22-.07-.46v-.1q.42.44.92.65.5.21 1.07.21.9 0 1.5-.4.6-.4.86-1.09.09-.23.12-.49.03-.26.03-.51 0-.66-.23-1.26-.23-.6-.68-1.14-.45-.54-1.08-.99-.63-.45-1.41-.98-.78-.53-1.55-1.23-.77-.7-1.47-1.65-.7-.95-1.18-2.14-.48-1.19-.48-2.69 0-1.1.37-2.02.37-.92 1.03-1.61.66-.7 1.56-.99.9-.3 1.95-.3Z"/></svg>
);
const TSIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg viewBox="0 0 128 128" fill="currentColor" className={className}><path d="M113.444 0H14.556A14.556 14.556 0 000 14.556v98.888A14.556 14.556 0 0014.556 128h98.888A14.556 14.556 0 00128 113.444V14.556A14.556 14.556 0 00113.444 0zM89.695 68.618c0 3.86-1.01 6.804-3.03 8.834-2.02 2.02-4.965 3.03-8.834 3.03H60.29v17.305H43.036V30.222h24.79c3.87 0 6.815 1.01 8.835 3.03s3.03 4.965 3.03 8.834v26.532zm-17.25-22.36h-7.54v18.197h7.54c1.802 0 3.052-.403 3.75-.989.87-.585.87-1.658.87-3.218V50.15c0-1.56-.29-2.633-.87-3.218-.7-.586-1.95-.99-3.75-.99z"/></svg>
);


interface LanguageIconProps {
  language: string | null;
  className?: string;
  iconColorClass?: string; // e.g. "text-blue-400"
}

const languageColorPaletteForBadge = [ // For letter badges, ensure good contrast with white text
  'bg-pink-600', 'bg-purple-600', 'bg-indigo-600', 
  'bg-sky-600', 'bg-teal-600', 'bg-emerald-600', 
  'bg-lime-600', 'bg-amber-600', 'bg-orange-600',
  'bg-rose-600', 'bg-slate-600', 'bg-gray-600',
];

// Simple hash function to get a color from the palette for letter badge background
const getBackgroundColorForLanguageBadge = (lang: string): string => {
  let hash = 0;
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash);
  }
  return languageColorPaletteForBadge[Math.abs(hash) % languageColorPaletteForBadge.length];
};


export const LanguageIcon: React.FC<LanguageIconProps> = ({ language, className = "w-3.5 h-3.5", iconColorClass }) => {
  const langLower = language?.toLowerCase() || '';
  const langOriginal = language || 'Unknown';

  // If iconColorClass is provided, use it, otherwise keep currentColor for SVGs that might have their own colors or for letter badge text.
  const effectiveClassName = `${className} ${iconColorClass || ''} inline-block align-middle`;

  if (langLower === 'javascript' || langLower === 'js') return <JSIcon className={effectiveClassName} />;
  if (langLower === 'python') return <PythonIcon className={effectiveClassName} />;
  if (langLower === 'html') return <HTMLIcon className={effectiveClassName} />;
  if (langLower === 'css') return <CSSIcon className={effectiveClassName} />;
  if (langLower === 'java') return <JavaIcon className={effectiveClassName} />;
  if (langLower === 'typescript' || langLower === 'ts') return <TSIcon className={effectiveClassName} />;
  if (langLower === 'markdown' || langLower === 'md') return <BookOpenIcon className={effectiveClassName} />;
  if (langLower === 'tex' || langLower === 'latex') return <SigmaIcon className={effectiveClassName} />;
  if (langLower === 'shell' || langLower === 'bash' || langLower === 'sh') return <TerminalIcon className={effectiveClassName} />;
  // Add other specific icons here if needed, passing effectiveClassName
  // e.g., if (langLower === 'c++') return <CppIcon className={effectiveClassName} />;

  // Fallback to letter badge
  if (language) {
    let badgeText = '';
    if (langLower === 'c++') badgeText = 'C++';
    else if (langLower === 'c#') badgeText = 'C#';
    else if (langOriginal === 'Other') badgeText = 'Oth';
    else badgeText = langOriginal.substring(0, 1).toUpperCase();
    
    // For letter badge, background color logic
    let badgeBgColor = getBackgroundColorForLanguageBadge(langOriginal);
    // If iconColorClass is a text color, attempt to make a corresponding background for consistency
    if (iconColorClass && iconColorClass.startsWith('text-')) {
        const baseColorName = iconColorClass.substring(5); // e.g., "blue-400"
        // Try to form a darker background variant, e.g., bg-blue-600
        const potentialBg = `bg-${baseColorName.replace('-400', '-600').replace('-300', '-500').replace('-500', '-700')}`;
        // This is heuristic, actual Tailwind class existence isn't checked here
        badgeBgColor = potentialBg; 
    }


    return (
      <span 
        className={`${badgeBgColor} ${className} inline-flex items-center justify-center rounded-sm text-white text-[9px] font-semibold align-middle leading-none p-px`}
        title={langOriginal}
        style={{ fontSize: badgeText.length > 1 ? '8px' : '9px', padding: badgeText.length > 1 ? '1px 2px' : '1px'}} // Adjust padding/font for multi-char text
      >
        {badgeText}
      </span>
    );
  }

  return <CodeBracketIcon className={effectiveClassName} />; // Default/fallback
};
