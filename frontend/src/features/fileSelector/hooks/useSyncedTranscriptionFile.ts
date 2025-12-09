import { useEffect } from 'react';

import usePyWebViewState from '@hooks/usePyWebViewState';
import useAppStore from '@store/useAppStore';
import { FileMetadata } from 'types/pywebview/pywebview-api';

const useSyncedTranscriptionFile = () => {
  const file = useAppStore((state) => state.file);
  const setFile = useAppStore((state) => state.setFile);
  const clearFile = useAppStore((state) => state.clearFile);

  // This hook listens for changes to the specified key in the Python state.
  const pyWebViewFile = usePyWebViewState<'transcriptionFile'>({
    initialValue: null,
    key: 'transcriptionFile',
  });

  // Syncs Python state updates to the store.
  useEffect(() => {
    if (!pyWebViewFile) {
      // Clear store if Python state is null.
      clearFile();
      return;
    }

    if (pyWebViewFile.absolutePath === file?.absolutePath) {
      // Avoid setting the store if the file is the same.
      return;
    }

    setFile({ ...pyWebViewFile });
  }, [pyWebViewFile, clearFile, file, setFile]);

  // Handles dialog file selection, which updates Python state, triggering the useEffect to update the store.
  const handleDialogFileSelection = (newFile: FileMetadata | null) => {
    if (!newFile) {
      return;
    }

    // Avoid updating the Python state if the selected file is the same.
    const currentPyWebViewFile = window.pywebview.state.transcriptionFile;
    if (currentPyWebViewFile?.absolutePath === newFile.absolutePath) {
      return;
    }

    window.pywebview.state.transcriptionFile = newFile;
  };

  // Automatically triggers change event to update the store via useEffect.
  const handleClearFile = () => {
    window.pywebview.state.transcriptionFile = null;
  };

  return { file, handleClearFile, handleDialogFileSelection };
};

export default useSyncedTranscriptionFile;
