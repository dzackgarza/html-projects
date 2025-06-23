import React from 'react';

// StarIcon remains for potential future use, e.g. if pinning becomes "starring"
export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// New Fork Icon (Git Branch style) - Note: This is defined but not used on the card anymore, a strip is used.
export const ForkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v1.652c.224.03.44.07.651.121C11.383 5.253 12 6.643 12 8.25c0 .995-.291 1.91-.776 2.625A4.47 4.47 0 0112 10.5c.383 0 .759.043 1.125.122C13.832 9.47 15 8.01 15 6.25c0-1.933.916-3.666 2.348-4.63C17.652 1.357 18 1.006 18 1a.75.75 0 01.75.75c0 .81-.448 1.488-1.112 1.969a.751.751 0 00-.286.623v1.31c.38.16.738.352 1.072.578a.75.75 0 11-.708 1.218A7.478 7.478 0 0015 6.25c0 .995.291 1.91.776 2.625A4.47 4.47 0 0115 10.5c-.383 0-.759-.043-1.125-.122a4.479 4.479 0 01-1.75 1.579 4.479 4.479 0 01-1.579 1.75C9.47 13.832 8.01 15 6.25 15c-1.933 0-3.666-.916-4.63-2.348C1.357 12.348 1.006 12 1 12a.75.75 0 01.75-.75c.81 0 1.488.448 1.969 1.112a.751.751 0 00.623.286h1.31a7.478 7.478 0 00.578-1.072.75.75 0 111.218.708 6.002 6.002 0 01-1.01 1.536c.009.02.022.039.036.058a4.5 4.5 0 011.086-4.914A4.479 4.479 0 0110.5 9c0-.383-.043-.759-.122-1.125A4.479 4.479 0 018.8 6.296a4.479 4.479 0 01-1.75-1.579A4.5 4.5 0 014.914 3.63 4.478 4.478 0 013.63 4.914C2.56 5.967 2.25 7.07 2.25 8.25c0 1.76.75 3.313 1.94 4.419a.75.75 0 11-1.04 1.082A8.991 8.991 0 000 12.75a1.5 1.5 0 001.5 1.5h.334A6.004 6.004 0 006.25 16.5c2.054 0 3.885-.972 5.065-2.522C12.033 13.596 12 12.98 12 12.375c0-1.76-.75-3.313-1.94-4.419a.75.75 0 111.04-1.082c.28.26.53.538.746.832a6.004 6.004 0 004.904-4.904c.294-.215.572-.466.832-.746a.75.75 0 011.082 1.04A6.002 6.002 0 0012.75 12c.074.885.289 1.726.626 2.493a5.986 5.986 0 002.508 2.508A5.986 5.986 0 0018.375 18c.991 0 1.91-.295 2.677-.785a.75.75 0 01.373 1.34c-.815.522-1.79.82-2.825.82C17.054 19.375 16 17.545 16 15.75c0-1.29.56-2.473 1.487-3.294a.75.75 0 111.126.978A4.48 4.48 0 0116.5 15.75c0 .984.624 1.875 1.5 2.25h.094a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75c0-.735.322-1.4.823-1.891A7.478 7.478 0 0019.5 9.75c0-1.29-.56-2.473-1.487-3.294A.75.75 0 0116.887 5.48a4.48 4.48 0 012.113-2.324A5.986 5.986 0 0018.375 3c-.991 0-1.91.295-2.677.785a.75.75 0 01-1.34-.373c.184-.694.272-1.411.272-2.137V3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);


export const CodeBracketIcon: React.FC<{ className?: string }> = ({ className }) => ( // General code icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L3.56 9.25l2.72 2.72a.75.75 0 01-1.06 1.06L1.94 9.78a.75.75 0 010-1.06l3.28-3.28a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l3.28 3.28a.75.75 0 010 1.06l-3.28 3.28a.75.75 0 01-1.06-1.06L16.44 9.25l-2.72-2.72a.75.75 0 010-1.06zM10.75 4.75a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => ( // Public
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
  <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.18l.823-.435a2.484 2.484 0 000-4.36L.664 4.176a1.65 1.65 0 012.332-2.332l.66.35c.483.255.993.438 1.514.549L5.645.24a1.65 1.65 0 013.158 0l.478 1.498a2.492 2.492 0 001.513-.55l.66-.35a1.65 1.65 0 012.332 2.332l-.823.435a2.484 2.484 0 000 4.36l.823.435a1.65 1.65 0 01-2.332 2.332l-.66-.35a2.492 2.492 0 00-1.513.55l-.478 1.498a1.65 1.65 0 01-3.158 0l-.478-1.498a2.484 2.484 0 00-1.514-.549l-.66.35a1.65 1.65 0 01-2.332-2.332l.823-.435zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
</svg>
);

export const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => ( // Private
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M14.78 11.78a.75.75 0 01-1.06 0L10 8.06l-3.72 3.72a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06z" clipRule="evenodd" />
  </svg>
);

// New Thumbtack Pin Icon (Filled)
export const PinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.002 2.25a.75.75 0 01.75.75v.002l.002.002.002.002a.751.751 0 01.752.752l.002.002.002.002V6h2.25a.75.75 0 010 1.5h-2.25v6.52a2.502 2.502 0 002.48-2.274.75.75 0 011.492.158A3.997 3.997 0 0112.25 18H9a.75.75 0 010-1.5h1.25V7.5H8a.75.75 0 010-1.5h2.252V3.002a.75.75 0 01.75-.75z" clipRule="evenodd" transform="rotate(45 10 10)" />
    <path d="M8.583 3.51a1.536 1.536 0 012.834 0L12 2.25H8l.583 1.26zM11.979 16.74a1.536 1.536 0 01-2.833 0L8 18h4l-.021-1.26z" />
  </svg>
);

// New Thumbtack Pin Icon (Outline)
export const PinOffIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774ZM12 21v-8.25M15.75 15.75H18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v8.25m6-3.75h-3.75" /> {/* Simplified top part for outline */}
  </svg>
);


export const TagIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3.5 2A1.5 1.5 0 002 3.5V10a1.5 1.5 0 00.228.865l7.106 7.106a1.5 1.5 0 002.121 0l7.107-7.107a1.5 1.5 0 000-2.121L11.365.228A1.5 1.5 0 0010 2H3.5zM6 6a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

export const AdjustmentsHorizontalIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </svg>
);

// Icon for Markdown
export const BookOpenIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 8.75A.75.75 0 012.75 8h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 8.75zM2 12.75a.75.75 0 012.75-1.5h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM8.25 15.5a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V16.25a.75.75 0 01.75-.75z" clipRule="evenodd" />
    <path d="M3 2.75C3 1.784 3.784 1 4.75 1h10.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0115.25 19H4.75A1.75 1.75 0 013 17.25V2.75zm1.75-.25a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H4.75z" />
  </svg>
);

// Icon for TeX (Sigma symbol as a placeholder for formulas)
export const SigmaIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.5 2H3.5a.75.75 0 00-.75.75v2.5a.75.75 0 001.5 0V3.5h12.25L10 10l6.75 6.5H3.5V14a.75.75 0 00-1.5 0v2.5A.75.75 0 003.5 18h13a.75.75 0 00.53-1.28l-7-7a.75.75 0 000-1.061l7-7A.75.75 0 0016.5 2z" clipRule="evenodd" />
  </svg>
);

// Icon for Shell Scripts
export const TerminalIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2 5.25A3.25 3.25 0 015.25 2h9.5A3.25 3.25 0 0118 5.25v9.5A3.25 3.25 0 0114.75 18h-9.5A3.25 3.25 0 012 14.75v-9.5zm1.5.75v1.5h1.5v-1.5H3.5zm2.75-.75A.75.75 0 005.5 6v1.5h1.5V6A.75.75 0 006.25 5h.001zm2.5.75A.75.75 0 019.5 5h.001a.75.75 0 01.75.75v1.5H10.5V6A.75.75 0 009.5 5H9.5zm2.5.75A.75.75 0 0011.5 6v1.5h1.5V6a.75.75 0 00-.75-.75h-.001zM4.25 10.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 2.5a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    <path d="M5.75 14.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V15a.75.75 0 01.75-.75z" />
  </svg>
);

export const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const GearIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.393c-.83.069-1.171 1.025-.53 1.601l3.675 3.18-1.103 4.636c-.196.823.705 1.516 1.438 1.12L10 15.336l4.073 2.75c.732.396 1.633-.297 1.437-1.12l-1.102-4.636 3.675-3.18c.64-.577.3-1.532-.53-1.601l-4.753-.393L10.868 2.884zM12 9.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM6 9.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM9.5 7a.5.5 0 00-.5.5v2a.5.5 0 001 0v-2a.5.5 0 00-.5-.5zM9.5 12a.5.5 0 00-.5.5v2a.5.5 0 001 0v-2a.5.5 0 00-.5-.5z" clipRule="evenodd" />
  </svg>
);

export const ClipboardIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75A.75.75 0 0 1 9 4.56v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);


// Potentially add CppIcon, CSharpIcon, FileTextIcon here if needed later
// For C++/C# if simple text SVGs are preferred:
/*
export const CppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="18" fontFamily="monospace" fontSize="16" fill="currentColor">C++</text>
  </svg>
);
export const CSharpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="18" fontFamily="monospace" fontSize="16" fill="currentColor">C#</text>
  </svg>
);
*/