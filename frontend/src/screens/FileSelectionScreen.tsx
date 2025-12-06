import TranscriptionFileSelector from '@features/fileSelector/components/TranscriptionFileSelector';
import TranscribeButton from '@features/transcription/components/TranscribeButton';

const FileSelectionScreen = () => (
  <div className="flex flex-col gap-4">
    <div className="flex justify-end">
      <TranscribeButton />
    </div>
    <TranscriptionFileSelector />
  </div>
);

export default FileSelectionScreen;
