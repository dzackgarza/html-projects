import { LanguageColorMapping } from './types';

// Constants for language colors, moved from App.tsx
export const languageColorClasses: LanguageColorMapping = {
  'markdown': 'border-emerald-500 text-emerald-500',
  'tex': 'border-emerald-500 text-emerald-500',
  'javascript': 'border-yellow-400 text-yellow-400',
  'python': 'border-blue-400 text-blue-400',
  'typescript': 'border-sky-400 text-sky-400',
  'shell': 'border-lime-400 text-lime-400',
  'ruby': 'border-red-500 text-red-500',
  'php': 'border-indigo-500 text-indigo-500',
  'lua': 'border-purple-400 text-purple-400',
  'perl': 'border-cyan-500 text-cyan-500',
  'java': 'border-orange-500 text-orange-500',
  'c#': 'border-violet-500 text-violet-500',
  'c++': 'border-pink-500 text-pink-500',
  'c': 'border-sky-600 text-sky-600',
  'go': 'border-teal-400 text-teal-400',
  'rust': 'border-amber-600 text-amber-600',
  'swift': 'border-orange-400 text-orange-400',
  'kotlin': 'border-purple-600 text-purple-600',
  'assembly': 'border-neutral-500 text-neutral-500',
  'asm': 'border-neutral-500 text-neutral-500',
  'html': 'border-rose-500 text-rose-500',
  'css': 'border-purple-500 text-purple-500',
  'haskell': 'border-fuchsia-500 text-fuchsia-500',
  'clojure': 'border-lime-500 text-lime-500',
  'scala': 'border-red-600 text-red-600',
  'elm': 'border-teal-500 text-teal-500',
  'f#': 'border-sky-700 text-sky-700',
  'ocaml': 'border-amber-400 text-amber-400',
  'jupyter notebook': 'border-orange-600 text-orange-600',
  'r': 'border-blue-600 text-blue-600',
  'julia': 'border-green-600 text-green-600',
  'dockerfile': 'border-sky-800 text-sky-800',
  'makefile': 'border-yellow-600 text-yellow-600',
  'cmake': 'border-red-700 text-red-700',
  'powershell': 'border-blue-700 text-blue-700',
  'vim script': 'border-green-500 text-green-500',
  'cython': 'border-teal-600 text-teal-600',
  'gap': 'border-indigo-600 text-indigo-600',
  'objective-c': 'border-slate-500 text-slate-500',
  'other': 'border-slate-400 text-slate-400',
};

export const genericColorPaletteBorders = [
  'border-pink-400', 'border-purple-400', 'border-indigo-400',
  'border-sky-400', 'border-teal-400', 'border-emerald-400',
  'border-lime-400', 'border-amber-400', 'border-orange-400',
  'border-rose-400', 'border-fuchsia-400', 'border-violet-400',
  'border-cyan-400', 'border-yellow-300',
];
export const genericColorPaletteText = [
  'text-pink-400', 'text-purple-400', 'text-indigo-400',
  'text-sky-400', 'text-teal-400', 'text-emerald-400',
  'text-lime-400', 'text-amber-400', 'text-orange-400',
  'text-rose-400', 'text-fuchsia-400', 'text-violet-400',
  'text-cyan-400', 'text-yellow-300',
];

export const sortedLanguageColorKeys = Object.keys(languageColorClasses)
  .sort((a, b) => b.length - a.length);

export const getColorClassForLanguage = (lang: string | null | undefined): string => {
  let langStrOriginal = typeof lang === 'string' ? lang.trim() : '';

  if (!langStrOriginal) {
    langStrOriginal = 'Markdown'; 
  }
  const langLower = langStrOriginal.toLowerCase();

  if (languageColorClasses[langLower]) {
    return languageColorClasses[langLower];
  }

  for (const key of sortedLanguageColorKeys) {
    if (key === 'other' || key === 'markdown') continue;
    if (langLower.includes(key)) {
      return languageColorClasses[key];
    }
  }

  let hash = 0;
  for (let i = 0; i < langStrOriginal.length; i++) {
    hash = langStrOriginal.charCodeAt(i) + ((hash << 5) - hash);
  }
  const genericIndex = Math.abs(hash) % genericColorPaletteBorders.length;
  return `${genericColorPaletteBorders[genericIndex]} ${genericColorPaletteText[genericIndex]}`;
};

// Simple fuzzy match: all characters in pattern must appear in text in order
export const fuzzyMatch = (pattern: string, text: string): boolean => {
    if (!pattern) return true;
    if (!text) return false;
    pattern = pattern.toLowerCase();
    text = text.toLowerCase();
    let patternIndex = 0;
    let textIndex = 0;
    while (patternIndex < pattern.length && textIndex < text.length) {
        if (pattern[patternIndex] === text[textIndex]) {
            patternIndex++;
        }
        textIndex++;
    }
    return patternIndex === pattern.length;
};
