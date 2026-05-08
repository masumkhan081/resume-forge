'use client';

import { KeyboardEvent, useState } from 'react';
import { X } from 'lucide-react';

export function ChipInput({
  label,
  placeholder,
  values,
  onChange,
  limit = 12,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (next: string[]) => void;
  limit?: number;
}) {
  const [draft, setDraft] = useState('');

  function addChip() {
    const value = draft.trim();
    if (!value || values.includes(value) || values.length >= limit) return;
    onChange([...values, value]);
    setDraft('');
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addChip();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-xs text-slate-400">{values.length}/{limit}</span>
      </div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map((item) => (
            <span key={item} className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
              {item}
              <button type="button" onClick={() => onChange(values.filter((value) => value !== item))} className="text-brand-700">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={addChip}
          placeholder={placeholder}
          className="h-11 w-full rounded-full border border-white bg-white px-4 text-sm placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
