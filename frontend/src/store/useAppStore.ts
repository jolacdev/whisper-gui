import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { FileMetadata } from 'types/pywebview/pywebview-api';

type StoreState = {
  file: FileMetadata | null;
  model: null | string;
};

type StoreActions = {
  clearFile: () => void;
  setFile: (file: FileMetadata) => void;
};

type Store = StoreState & StoreActions;

const initialState: StoreState = {
  file: null,
  model: null,
};

const useAppStore = create<Store>()(
  devtools(
    (set) => {
      const store: Store = {
        ...initialState,

        // Actions
        clearFile: () => set({ file: null }, undefined, 'file/clear'),
        setFile: (file) => set({ file }, undefined, 'file/set'),
      };

      return store;
    },
    { store: 'appStore' },
  ),
);

export default useAppStore;
