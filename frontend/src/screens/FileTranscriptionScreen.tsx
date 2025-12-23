import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

import TranscriptionLoader from '@features/transcription/components/TranscriptionLoader';
import TranscriptionResult from '@features/transcription/components/TranscriptionResult';
import { TranscriptionSegment } from 'types/pywebview/pywebview-api';

const FileTranscriptionScreen = () => {
  // TODO: Check if should be moved to the store
  const [segments, setSegments] = useState<TranscriptionSegment[]>();

  return (
    // TODO: Check if relative/absolute+w-full can be removed without moving the layout
    <div className="relative">
      <AnimatePresence>
        {!segments && (
          // TODO: Add a short delay so 100% is visible briefly.
          <TranscriptionLoader
            className="absolute w-full"
            onTranscriptionComplete={setSegments}
          />
        )}
      </AnimatePresence>

      {segments && <TranscriptionResult segments={segments} />}
    </div>
  );
};

export default FileTranscriptionScreen;
