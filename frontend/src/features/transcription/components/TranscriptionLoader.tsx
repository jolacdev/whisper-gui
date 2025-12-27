import cx from 'classnames';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import Button from '@components/Button';
import ProgressLoader from '@components/ProgressLoader';
import useAppStore from '@store/useAppStore';
import { TranscriptionSegment } from 'types/pywebview/pywebview-api';

import { transcriptionLoaderVariants } from '../animation-variants';
import { useSyncedTranscription } from '../hooks/useSyncedTranscription';

type TranscriptionLoaderProps = {
  className?: string;
  onTranscriptionComplete: (segments: TranscriptionSegment[]) => void;
};

const TranscriptionLoader = ({
  className = undefined,
  onTranscriptionComplete,
}: TranscriptionLoaderProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'transcription' });
  const transcriptionFile = useAppStore((state) => state.transcriptionFile);

  const {
    actions: { cancelTranscription },
    state: { progress, status, transcriptionRemainingSeconds, hasFinished },
  } = useSyncedTranscription({ onTranscriptionComplete });

  // TODO: Invalid transcriptions (no audio) should provide feedback and return to file selection.
  // TODO: Check edge cases with cancel/abort where previous transcribed file is not correctly aborted.
  // TODO: ^^^ Check flags reset, timings to change the file, etc
  return (
    <motion.div
      animate="mount"
      className={cx('flex flex-col items-center gap-4', className)}
      exit="unmount"
      initial="initial"
      variants={transcriptionLoaderVariants}
    >
      {/* File Name Header */}
      {transcriptionFile && (
        <h2 className="text-center wrap-anywhere">{transcriptionFile.name}</h2>
      )}

      {/* Main Loader */}
      <ProgressLoader
        remainingSeconds={transcriptionRemainingSeconds ?? undefined}
        value={progress}
      />

      {/* Status */}
      <span className={cx({ 'animate-loading-dots': !hasFinished })}>
        {t(`status.${status}`)}
      </span>

      {/* Abort Button */}
      <Button
        className="btn-outline p-2 px-4"
        disabled={status === 'aborting'}
        onClick={cancelTranscription}
      >
        {t('cancel')}
      </Button>
    </motion.div>
  );
};

export default TranscriptionLoader;
