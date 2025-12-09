import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@components/Button';
import { SpeechToText } from '@icons/SpeechToText';
import useAppStore from '@store/useAppStore';

const TranscribeButton = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'actions' });

  const file = useAppStore((state) => state.transcriptionFile);

  // TODO: Temporary local state for transcribing status.
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleRunTranscription = async (path: string) => {
    setIsTranscribing(true);
    // TODO: Temporarily hardcoded model.
    const segments = await window.pywebview.api.run_transcription(path, 'base');
    console.log({ segments }); // TODO: Remove and handle segments.
    setIsTranscribing(false);
  };

  return (
    <Button
      className="btn-primary p-2"
      disabled={!file || isTranscribing}
      iconLeft={<SpeechToText />}
      onClick={
        file ? () => handleRunTranscription(file.absolutePath) : undefined
      }
    >
      {t('transcribe')}
    </Button>
  );
};

export default TranscribeButton;
