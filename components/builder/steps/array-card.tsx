import type { ReactNode } from 'react';

export function ArrayCard({
  children,
  onRemove,
  dragHandle,
}: {
  children: ReactNode;
  onRemove: () => void;
  dragHandle?: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>{dragHandle ?? null}</div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700"
        >
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}

export function AddItemButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800"
    >
      {children}
    </button>
  );
}
