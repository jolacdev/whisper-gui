import { useTranslation } from 'react-i18next';

import Dropzone from '@components/Dropzone/Dropzone';
import { TRANSCRIPTION_FILE_SELECTOR_DROPZONE_ID } from '@constants';

import useSyncedTranscriptionFile from '../hooks/useSyncedTranscriptionFile';

const TranscriptionFileSelector = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'fileSelector' });

  const { file, handleClearFile, handleDialogFileSelection } =
    useSyncedTranscriptionFile();

  return (
    <Dropzone
      content={{
        description: t('description'),
        title: t('title'),
      }}
      file={file ? file : undefined}
      id={TRANSCRIPTION_FILE_SELECTOR_DROPZONE_ID}
      onClick={handleDialogFileSelection}
      onDelete={handleClearFile}
    />
  );
};

export default TranscriptionFileSelector;
