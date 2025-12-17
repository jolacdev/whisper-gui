import { AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import TranscriptionLoader from '@features/transcription/components/TranscriptionLoader';
import TranscriptionResult from '@features/transcription/components/TranscriptionResult';
import useAppStore, { APP_VIEWS } from '@store/useAppStore';
import { TranscriptionSegment } from 'types/pywebview/pywebview-api';

const FileTranscriptionScreen = () => {
  const file = useAppStore((state) => state.transcriptionFile);
  const setView = useAppStore((state) => state.setView);

  // TODO: Check if should be moved to the store
  const [segments, setSegments] = useState<TranscriptionSegment[]>();

  const processingRef = useRef(false);

  useEffect(() => {
    const handleRunTranscription = async (
      path: string,
      model: string = 'base',
    ) => {
      // Prevent multiple calls
      if (processingRef.current) {
        return;
      }

      processingRef.current = true;

      try {
        const transcribedSegments =
          await window.pywebview.api.run_transcription(path, model);
        setSegments(transcribedSegments);
      } catch (_error) {
        // TODO: Show alert error.
        setView(APP_VIEWS.SELECTION);
      } finally {
        processingRef.current = false;
      }
    };

    if (segments) {
      return;
    }

    if (!file?.absolutePath) {
      setView(APP_VIEWS.SELECTION);
      return;
    }

    handleRunTranscription(file.absolutePath);
  }, [file, segments, setView]);

  return (
    // TODO: Check if relative/absolute+w-full can be removed without moving the layout
    <div className="relative">
      <AnimatePresence>
        {!segments && (
          // TODO: Add a short delay so 100% is visible briefly.
          <TranscriptionLoader className="absolute w-full" />
        )}
      </AnimatePresence>

      {segments && <TranscriptionResult segments={segments} />}
    </div>
  );
};

export default FileTranscriptionScreen;
