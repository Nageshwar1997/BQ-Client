import { useState, useRef, useEffect, useLayoutEffect } from 'react';

interface DynamicInputProps {
  value: string;
  onSubmit: (value: string) => void;
  defaultText?: string;

  placeholder?: string;
  fontSize?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

export function DynamicInput({
  value,
  onSubmit,
  defaultText = '',
  placeholder = 'Enter experience name...',
  fontSize = 18,
  minWidth = 80,
  maxWidth = 388,
  className = '',
}: DynamicInputProps) {
  const [focused, setFocused] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(value);
  const [measuredWidth, setMeasuredWidth] = useState<number>(minWidth);

  const inputRef = useRef<HTMLInputElement>(null);
  const rulerRef = useRef<HTMLSpanElement>(null);

  const displayText = draft || placeholder;

  // Measure actual text width using a hidden ruler span (useLayoutEffect avoids flicker)
  useLayoutEffect(() => {
    if (rulerRef.current) {
      const w = rulerRef.current.scrollWidth;
      // +16 for px-2 padding (8px each side)
      setMeasuredWidth(Math.min(Math.max(w + 16, minWidth), maxWidth));
    }
  }, [displayText, fontSize, minWidth, maxWidth]);

  const dynamicVars = {
    '--di-min-w': `${minWidth}px`,
    '--di-max-w': `${maxWidth}px`,
    '--di-w': `${measuredWidth}px`,
    '--di-font-size': `${fontSize}px`,
  } as React.CSSProperties;

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const submit = () => {
    const nextValue = draft.trim() === '' ? defaultText : draft;
    setDraft(nextValue);
    onSubmit(nextValue);
    setFocused(false);
  };

  return (
    <div
      className={`font-metropolis relative inline-flex w-(--di-w) max-w-(--di-max-w) min-w-(--di-min-w) items-center ${className}`}
      style={dynamicVars}
    >
      {/* Hidden ruler to measure real text width */}
      <span
        ref={rulerRef}
        aria-hidden
        className="font-metropolis pointer-events-none invisible absolute font-bold whitespace-pre"
        style={{ fontSize }}
      >
        {displayText}
      </span>
      {focused ? (
        <input
          ref={inputRef}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          className={`border-neutral-gray-400 box-border block w-full max-w-full cursor-text overflow-hidden rounded-sm border bg-white px-2 py-1 text-(length:--di-font-size) font-bold whitespace-nowrap outline-none [transition:width_100ms_cubic-bezier(0.4,0,0.2,1),background_140ms_ease,border-color_100ms_ease] ${draft ? 'text-neutral-gray-900' : 'text-neutral-gray-400'}`}
          placeholder={placeholder}
        />
      ) : (
        <div
          role="textbox"
          tabIndex={0}
          onClick={() => setFocused(true)}
          onFocus={() => setFocused(true)}
          className={`hover:bg-neutral-gray-150 box-border flex w-full max-w-full cursor-text items-center overflow-hidden rounded-sm border border-transparent px-2 py-1 text-(length:--di-font-size) font-bold whitespace-nowrap outline-none select-none [transition:width_100ms_cubic-bezier(0.4,0,0.2,1),background_140ms_ease,border-color_100ms_ease] ${draft ? 'text-neutral-gray-900' : 'text-neutral-gray-400'}`}
        >
          <span className="block whitespace-nowrap">{displayText}</span>
        </div>
      )}
    </div>
  );
}
