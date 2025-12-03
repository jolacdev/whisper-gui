import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { File } from 'types/pywebview/pywebview-api';

type StoreState = {
  file: File | null;
  model: null | string;
};

type StoreActions = {
  clearFile: () => void;
  setFile: (file: File) => void;
};

type Store = StoreState & StoreActions;

const initialState: StoreState = {
  file: null,
  model: null,
};

const useAppStore = create<Store>()(
  devtools((set) => {
    const store: Store = {
      ...initialState,

      // Actions
      clearFile: () => set({ file: null }),
      setFile: (file) => set({ file }),
    };

    return store;
  }),
);

export default useAppStore;
