import cx from 'classnames';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import Button from '@components/Button';
import ProgressLoader from '@components/ProgressLoader';

import { transcriptionLoaderVariants } from '../animation-variants';
import { useSyncedTranscription } from '../hooks/useSyncedTranscription';

type TranscriptionLoaderProps = {
  className?: string;
};

const TranscriptionLoader = ({
  className = undefined,
}: TranscriptionLoaderProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'transcription' });

  const {
    actions: { cancelTranscription },
    state: { progress, status, hasFinished, isAbortRequested },
  } = useSyncedTranscription();

  return (
    <motion.div
      animate="mount"
      className={cx('flex flex-col items-center gap-4', className)}
      exit="unmount"
      initial="initial"
      variants={transcriptionLoaderVariants}
    >
      <ProgressLoader value={progress} />
      <span className={cx({ 'animate-loading-dots': !hasFinished })}>
        {t(`status.${status}`)}
      </span>
      <Button
        className="btn-outline p-2 px-4"
        disabled={!!isAbortRequested}
        onClick={cancelTranscription}
      >
        {t('cancel')}
      </Button>
    </motion.div>
  );
};

export default TranscriptionLoader;
