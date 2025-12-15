import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import Button from '@components/Button';
import ProgressLoader from '@components/ProgressLoader';

import { useSyncedTranscription } from '../hooks/useSyncedTranscription';

const TranscriptionLoader = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'transcription' });

  const { cancelTranscription, progress, status, hasFinished } =
    useSyncedTranscription();

  return (
    <div className="flex flex-col items-center gap-4">
      <ProgressLoader value={progress} />
      <span className={cx({ 'animate-loading-dots': !hasFinished })}>
        {t(`status.${status}`)}
      </span>
      <Button className="btn-outline p-2 px-4" onClick={cancelTranscription}>
        {t('cancel')}
      </Button>
    </div>
  );
};

export default TranscriptionLoader;
