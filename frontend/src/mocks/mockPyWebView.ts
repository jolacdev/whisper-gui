import { PyWebViewApi } from '../types/pywebview/pywebview-api';
import { PyWebViewState } from '../types/pywebview/pywebview-state';

const mockState: PyWebViewState = {
  addEventListener: () => {},
  dispatchEvent: () => true,
  removeEventListener: () => {},
};

const mockApi: PyWebViewApi = {};

export const createPyWebViewMock = () => {
  window.pywebview = {
    api: mockApi,
    state: mockState,
  };
};
