import { useTranslation } from 'react-i18next';

import Button from '@components/Button';
import { SpeechToText } from '@icons/SpeechToText';
import useAppStore, { APP_VIEWS } from '@store/useAppStore';

const TranscribeButton = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'actions' });

  const file = useAppStore((state) => state.transcriptionFile);
  const setView = useAppStore((state) => state.setView);

  const handleRunTranscription = () => {
    if (!file || !file.absolutePath) {
      return;
    }

    setView(APP_VIEWS.TRANSCRIPTION);
  };

  return (
    <Button
      className="btn-primary p-2"
      disabled={!file}
      iconLeft={<SpeechToText />}
      onClick={file ? handleRunTranscription : undefined}
    >
      {t('transcribe')}
    </Button>
  );
};

export default TranscribeButton;
