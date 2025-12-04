import { useEffect } from 'react';

import Dropzone from '@components/Dropzone';

import useSyncedTranscriptionFile from '../hooks/useSyncedTranscriptionFile';

const DropzoneFeat = () => {
  const { file, handleClearFile, handleDialogFileSelection } =
    useSyncedTranscriptionFile();

  useEffect(() => {
    console.log('Rendering DropzoneFeat');
  });

  // TODO: Check https://supabase.com/ui/docs/nextjs/dropzone
  // TODO: Remove console.logs, comments, etc.
  // TODO: Add copy to i18n.
  // TODO: Add component for uploaded files (icon_named = [MP3], name, size, remove button 'X')
  // TODO: Since event is controlled from python, handle disabled state by extension in frontend
  // TODO: Check the prevent.default()'s
  return (
    <Dropzone
      file={file ? file : undefined}
      id="file-dropzone"
      onClick={handleDialogFileSelection}
      onDelete={handleClearFile}
    />
  );
};

export default DropzoneFeat;
