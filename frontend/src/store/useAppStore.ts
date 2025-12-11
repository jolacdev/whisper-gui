import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { FileMetadata } from 'types/pywebview/pywebview-api';

export const APP_VIEWS = {
  SELECTION: 'SELECTION',
  TRANSCRIPTION: 'TRANSCRIPTION',
} as const;

export type AppView = keyof typeof APP_VIEWS;

type StoreState = {
  currentView: AppView;
  model: null | string;
  transcriptionFile: FileMetadata | null;
};

type StoreActions = {
  clearTranscriptionFile: () => void;
  setTranscriptionFile: (file: FileMetadata) => void;
  setView: (view: AppView) => void;
};

type Store = StoreState & StoreActions;

const initialState: StoreState = {
  currentView: APP_VIEWS.SELECTION,
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

        setView: (view) => set({ currentView: view }, undefined, 'view/set'),
      };

      return store;
    },
    { store: 'appStore' },
  ),
);

export default useAppStore;
