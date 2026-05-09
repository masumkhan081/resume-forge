'use client';

import { useEffect, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type AutosaveSaveResult =
  | { ok: true }
  | { ok: false; error?: string };

type UseAutosaveOptions<T> = {
  data: T;
  save: (value: T) => Promise<AutosaveSaveResult>;
  delayMs?: number;
};

export function useAutosave<T>({ data, save, delayMs = 1500 }: UseAutosaveOptions<T>) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const baseline = useRef<string>(JSON.stringify(data));
  const saveRef = useRef(save);
  saveRef.current = save;
  const dataRef = useRef(data);
  dataRef.current = data;

  const inFlight = useRef(false);
  const dirtyAfterFlight = useRef(false);

  async function runSave(target: T, snapshot: string) {
    if (inFlight.current) {
      dirtyAfterFlight.current = true;
      return;
    }
    inFlight.current = true;
    setStatus('saving');
    let succeeded = false;
    try {
      const result = await saveRef.current(target);
      if (result.ok) {
        succeeded = true;
        baseline.current = snapshot;
        setStatus('saved');
        setLastSavedAt(new Date());
        setErrorMessage('');
      } else {
        setStatus('error');
        setErrorMessage(result.error ?? 'Save failed.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Save failed.');
    } finally {
      inFlight.current = false;
      // Only chain another save if the previous one succeeded — otherwise
      // we'd hammer the server on persistent errors. The user can hit Retry,
      // or we'll auto-flush when 'online' fires or on the next data change.
      if (succeeded && dirtyAfterFlight.current) {
        dirtyAfterFlight.current = false;
        const latest = dataRef.current;
        const latestSnapshot = JSON.stringify(latest);
        if (latestSnapshot !== baseline.current) {
          void runSave(latest, latestSnapshot);
        }
      } else if (!succeeded) {
        dirtyAfterFlight.current = false;
      }
    }
  }

  // Debounced save on data change.
  useEffect(() => {
    const snapshot = JSON.stringify(data);
    if (snapshot === baseline.current) return;

    const timer = setTimeout(() => {
      void runSave(data, snapshot);
    }, delayMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, delayMs]);

  // Reconnect: when the browser comes back online and we still have unsaved
  // changes, try once. Subsequent failures still need a manual retry.
  useEffect(() => {
    function onOnline() {
      const latest = dataRef.current;
      const latestSnapshot = JSON.stringify(latest);
      if (latestSnapshot !== baseline.current) {
        void runSave(latest, latestSnapshot);
      }
    }
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warn before tab close if changes haven't been saved yet.
  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      const latestSnapshot = JSON.stringify(dataRef.current);
      if (latestSnapshot === baseline.current) return;
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  // Best-effort flush on unmount (route changes within the app).
  useEffect(() => {
    return () => {
      const latest = dataRef.current;
      const latestSnapshot = JSON.stringify(latest);
      if (latestSnapshot !== baseline.current) {
        // Fire-and-forget; the component is unmounting so we can't update state.
        void saveRef.current(latest).catch(() => {});
      }
    };
  }, []);

  function retry() {
    const snapshot = JSON.stringify(dataRef.current);
    void runSave(dataRef.current, snapshot);
  }

  return {
    status,
    errorMessage,
    lastSavedAt,
    retry,
  };
}
