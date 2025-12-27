import { CSSProperties } from 'react';

import Button from '@components/Button';
import useAppStore from '@store/useAppStore';
import { TranscriptionSegment } from 'types/pywebview/pywebview-api';

type TranscriptionResultProps = {
  segments: TranscriptionSegment[];
};

const TranscriptionResult = ({ segments }: TranscriptionResultProps) => {
  const clearStore = useAppStore((state) => state.clearStore);

  // TODO: Demo example
  const handleTest = () => {
    clearStore();
    // NOTE: Additional cleanup needed since it is synced with the pywebview state
    // setTranscriptionFile(null);
  };

  return (
    <div className="absolute flex w-full flex-col gap-2">
      <Button className="btn-secondary p-2 px-4" onClick={handleTest}>
        Reset
      </Button>
      {segments.map((segment, index) => (
        <div
          key={segment.id}
          className="animate-fade-in-left bg-base-300 rounded-lg p-4 text-white opacity-0"
          style={{ '--index': index } as CSSProperties}
        >
          {/* TODO: Replace with pill/tag */}
          <span className="badge text-xs">[{segment.start}]</span>
          <span className="text-sm">{segment.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TranscriptionResult;
