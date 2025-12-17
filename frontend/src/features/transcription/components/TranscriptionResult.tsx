import Button from '@components/Button';
import usePyWebViewState from '@hooks/usePyWebViewState';
import useAppStore from '@store/useAppStore';
import { TranscriptionSegment } from 'types/pywebview/pywebview-api';

type TranscriptionResultProps = {
  segments: TranscriptionSegment[];
};

const TranscriptionResult = ({
  segments: _segments,
}: TranscriptionResultProps) => {
  const clearStore = useAppStore((state) => state.clearStore);
  const [_, setTranscriptionFile] = usePyWebViewState<'transcriptionFile'>({
    key: 'transcriptionFile',
  });

  // TODO: Demo example
  const handleTest = () => {
    clearStore();
    // NOTE: Additional cleanup needed since it is synced with the pywebview state
    setTranscriptionFile(null);
  };

  return (
    <div>
      <Button className="btn-secondary p-2 px-4" onClick={handleTest}>
        Reset
      </Button>
    </div>
  );
};

export default TranscriptionResult;
