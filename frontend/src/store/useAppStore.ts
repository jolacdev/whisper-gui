import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { FileMetadata } from 'types/pywebview/pywebview-api';

type StoreState = {
  model: null | string;
  transcriptionFile: FileMetadata | null;
};

type StoreActions = {
  clearTranscriptionFile: () => void;
  setTranscriptionFile: (file: FileMetadata) => void;
};

type Store = StoreState & StoreActions;

const initialState: StoreState = {
  model: null,
  transcriptionFile: null,
};

const useAppStore = create<Store>()(
  devtools(
    (set) => {
      const store: Store = {
        ...initialState,

        // Actions
        clearTranscriptionFile: () =>
          set(
            { transcriptionFile: null },
            undefined,
            'transcriptionFile/clear',
          ),
        setTranscriptionFile: (file) =>
          set({ transcriptionFile: file }, undefined, 'transcriptionFile/set'),
      };

      return store;
    },
    { store: 'appStore' },
  ),
);

export default useAppStore;
