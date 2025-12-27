import { useEffect, useRef } from 'react';

import {
  TRANSCRIPTION_PROGRESS_MAX_VALUE,
  TRANSCRIPTION_PROGRESS_MIN_VALUE,
} from '@constants';
import usePyWebViewState from '@hooks/usePyWebViewState';
import useAppStore, { APP_VIEWS } from '@store/useAppStore';
import { TranscriptionSegment } from 'types/pywebview/pywebview-api';

type TranscriptionStatus =
  | 'aborting'
  | 'completed'
  | 'initializing'
  | 'transcribing';

const transcriptionStatusMap: Record<number, TranscriptionStatus> = {
  [TRANSCRIPTION_PROGRESS_MAX_VALUE]: 'completed',
  [TRANSCRIPTION_PROGRESS_MIN_VALUE]: 'initializing',
};

// TODO: Add 'aborting' status.
const getTranscriptionStatus = (
  isAbortRequested: boolean,
  progress: number,
): TranscriptionStatus => {
  if (isAbortRequested) {
    return 'aborting';
  }

  if (progress in transcriptionStatusMap) {
    return transcriptionStatusMap[progress];
  }

  return 'transcribing';
};

type UseSyncedTranscriptionProps = {
  onTranscriptionComplete: (segments: TranscriptionSegment[]) => void;
};

export const useSyncedTranscription = ({
  onTranscriptionComplete,
}: UseSyncedTranscriptionProps) => {
  const file = useAppStore((state) => state.transcriptionFile);
  const setView = useAppStore((state) => state.setView);

  const [transcriptionProgress] = usePyWebViewState<'transcriptionProgress'>({
    initialValue: null,
    key: 'transcriptionProgress',
  });
  const [isAbortRequested, setIsAbortRequested] =
    usePyWebViewState<'isAbortRequested'>({
      initialValue: false,
      key: 'isAbortRequested',
    });
  const [transcriptionRemainingSeconds] =
    usePyWebViewState<'transcriptionRemainingSeconds'>({
      initialValue: null,
      key: 'transcriptionRemainingSeconds',
    });

  const isTranscribingRef = useRef(false);

  useEffect(() => {
    // TODO: Should have useCallback?
    const runTranscription = async (path: string, model: string = 'base') => {
      // Check if there is already a transcription in progress.
      if (isTranscribingRef.current) {
        return;
      }

      isTranscribingRef.current = true;

      try {
        // Run transcription.
        const segments = await window.pywebview.api.run_transcription(
          path,
          model,
        );

        // TODO: Handle alerts, etc when Python returns no segments `[]`
        // TODO: Check if cancel should be handled in another way, e.g. `None`

        // Check if abort was requested during the async operation using the global state.
        // NOTE: To avoid stale values, it is read directly from the pywebview state.
        if (window.pywebview.state.isAbortRequested) {
          setView(APP_VIEWS.SELECTION);
          return;
        }

        // Call callback on transcription complete.
        onTranscriptionComplete(segments);
      } catch (_error) {
        // TODO: Show alert error.
        setView(APP_VIEWS.SELECTION);
      } finally {
        isTranscribingRef.current = false;
      }
    };

    // If no file is selected, go back to selection view.
    if (!file?.absolutePath) {
      setView(APP_VIEWS.SELECTION);
      return;
    }

    // Reset abort state before starting a new transcription.
    setIsAbortRequested(false);

    runTranscription(file.absolutePath);
  }, [file, onTranscriptionComplete, setIsAbortRequested, setView]);

  const cancelTranscription = () => {
    if (!isAbortRequested) {
      setIsAbortRequested(true);
    }
  };

  const currentProgress = transcriptionProgress ?? 0;
  const hasFinished = currentProgress === TRANSCRIPTION_PROGRESS_MAX_VALUE;
  const status = getTranscriptionStatus(!!isAbortRequested, currentProgress);

  return {
    actions: {
      cancelTranscription,
    },
    state: {
      progress: currentProgress,
      status,
      transcriptionRemainingSeconds,
      hasFinished,
    },
  };
};
