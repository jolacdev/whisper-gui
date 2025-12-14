import {
  TRANSCRIPTION_PROGRESS_MAX_VALUE,
  TRANSCRIPTION_PROGRESS_MIN_VALUE,
} from '@constants';
import usePyWebViewState from '@hooks/usePyWebViewState';
import useAppStore, { APP_VIEWS } from '@store/useAppStore';

type TranscriptionStatus = 'completed' | 'initializing' | 'transcribing';

const transcriptionStatusMap: Record<number, TranscriptionStatus> = {
  [TRANSCRIPTION_PROGRESS_MAX_VALUE]: 'completed',
  [TRANSCRIPTION_PROGRESS_MIN_VALUE]: 'initializing',
};

const getTranscriptionStatus = (progress: number): TranscriptionStatus => {
  if (progress in transcriptionStatusMap) {
    return transcriptionStatusMap[progress];
  }

  return 'transcribing';
};

export const useSyncedTranscription = () => {
  const setView = useAppStore((state) => state.setView);

  const [transcriptionProgress] = usePyWebViewState<'transcriptionProgress'>({
    initialValue: null,
    key: 'transcriptionProgress',
  });

  const [isTranscriptionAborted, setIsTranscriptionAborted] =
    usePyWebViewState<'transcriptionAbort'>({
      key: 'transcriptionAbort',
    });

  const cancelTranscription = () => {
    if (!isTranscriptionAborted) {
      setIsTranscriptionAborted(true);
    }

    setView(APP_VIEWS.SELECTION);
  };

  const currentProgress = transcriptionProgress ?? 0;
  const hasFinished = currentProgress === TRANSCRIPTION_PROGRESS_MAX_VALUE;
  const status = getTranscriptionStatus(currentProgress);

  return {
    cancelTranscription,
    progress: currentProgress,
    status,
    hasFinished,
  };
};
