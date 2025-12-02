import {
  File,
  PyWebViewApi,
  TranscriptionSegment,
} from 'types/pywebview/pywebview-api';
import { PyWebViewState } from 'types/pywebview/pywebview-state';

const mockState: PyWebViewState = {
  addEventListener: () => {},
  dispatchEvent: () => true,
  removeEventListener: () => {},
};

const mockApi: PyWebViewApi = {
  open_file_dialog: (): Promise<File | null> =>
    Promise.resolve({
      absolutePath: '/test/sample.mp3',
      name: 'sample.mp3',
      size: 1024,
      type: 'audio/mp3',
    }),
  run_transcription: (
    _file_path: string,
    _model_name: string,
  ): Promise<TranscriptionSegment[]> => {
    const segments: TranscriptionSegment[] = [
      {
        id: 1,
        end: 7.44,
        start: 0,
        text: 'Text 1',
      },
      {
        id: 2,
        end: 14.16,
        start: 7.44,
        text: 'Text 2',
      },
      {
        id: 3,
        end: 22.46,
        start: 17.37,
        text: 'Text 3',
      },
    ];

    return Promise.resolve(segments);
  },
};

export const createPyWebViewMock = () => {
  window.pywebview = {
    api: mockApi,
    state: mockState,
  };
};
