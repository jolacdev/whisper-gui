import { useEffect, useState } from 'react';

import TranscriptionLoader from '@features/transcription/components/TranscriptionLoader';
import useAppStore, { APP_VIEWS } from '@store/useAppStore';
import { TranscriptionSegment } from 'types/pywebview/pywebview-api';

const FileTranscriptionScreen = () => {
  const file = useAppStore((state) => state.transcriptionFile);
  const setView = useAppStore((state) => state.setView);

  // TODO: Move to the store
  const [segments, setSegments] = useState<TranscriptionSegment[]>();

  // TODO: Remove
  useEffect(() => {
    console.log({ segments });
  }, [segments]);

  useEffect(() => {
    const handleRunTranscription = async (
      path: string,
      model: string = 'base',
    ) => {
      try {
        const transcribedSegments =
          await window.pywebview.api.run_transcription(path, model);

        setSegments(transcribedSegments);
      } catch (_error) {
        // TODO: Show alert error.
        setView(APP_VIEWS.SELECTION);
      }
    };

    if (!file?.absolutePath) {
      setView(APP_VIEWS.SELECTION);
      return;
    }

    handleRunTranscription(file.absolutePath);
  }, [file, setView]);

  return <TranscriptionLoader />;
};

export default FileTranscriptionScreen;
