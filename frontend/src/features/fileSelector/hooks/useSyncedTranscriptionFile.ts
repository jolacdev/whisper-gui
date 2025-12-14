import { useEffect } from 'react';

import usePyWebViewState from '@hooks/usePyWebViewState';
import useAppStore from '@store/useAppStore';
import { FileMetadata } from 'types/pywebview/pywebview-api';

const useSyncedTranscriptionFile = () => {
  const file = useAppStore((state) => state.transcriptionFile);
  const setFile = useAppStore((state) => state.setTranscriptionFile);
  const clearFile = useAppStore((state) => state.clearTranscriptionFile);

  // This hook listens for changes to the specified key in the Python state.
  const [transcriptionFile, setTranscriptionFile] =
    usePyWebViewState<'transcriptionFile'>({
      initialValue: window.pywebview.state.transcriptionFile ?? null,
      key: 'transcriptionFile',
    });

  // Syncs Python state updates to the store.
  useEffect(() => {
    if (!transcriptionFile) {
      // Clear store if Python state is null.
      clearFile();
      return;
    }

    if (transcriptionFile.absolutePath === file?.absolutePath) {
      // Avoid setting the store if the file is the same.
      return;
    }

    setFile({ ...transcriptionFile });
  }, [transcriptionFile, clearFile, file, setFile]);

  // Handles dialog file selection, which updates Python state, triggering the useEffect to update the store.
  const handleDialogFileSelection = (newFile: FileMetadata | null) => {
    if (!newFile) {
      return;
    }

    // Avoid updating the Python state if the selected file is the same.
    if (transcriptionFile?.absolutePath === newFile.absolutePath) {
      return;
    }

    setTranscriptionFile(newFile);
  };

  // Automatically triggers change event to update the store via useEffect.
  const handleClearFile = () => {
    setTranscriptionFile(null);
  };

  return { file, handleClearFile, handleDialogFileSelection };
};

export default useSyncedTranscriptionFile;
