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
  clearStore: () => void;
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
    (set, _get, store) => {
      const appStore: Store = {
        ...initialState,

        // Actions
        clearStore: () => set(store.getInitialState()),

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

      return appStore;
    },
    { store: 'appStore' },
  ),
);

export default useAppStore;
