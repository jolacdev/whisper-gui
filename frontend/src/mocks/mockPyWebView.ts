import {
  File,
  PyWebViewApi,
  TranscriptionSegment,
} from 'types/pywebview/pywebview-api';
import { PyWebViewState } from 'types/pywebview/pywebview-state';

const eventTarget = new EventTarget();

const mockState: PyWebViewState = {
  addEventListener(type, callback, options) {
    eventTarget.addEventListener(type, callback as EventListener, options);
  },
  dispatchEvent(event) {
    return eventTarget.dispatchEvent(event);
  },
  removeEventListener(type, callback, options) {
    eventTarget.removeEventListener(type, callback as EventListener, options);
  },
};

const mockApi: PyWebViewApi = {
  open_file_dialog: (): Promise<File | null> => {
    const mockFile: File = {
      name: 'The.Lord.of.the.Rings.The.Fellowship.of.the.Ring.2001.Extended.1080p.BluRay.DTS.x264-UltraHD.Remastered.avi',
      size: 1887436,
      type: 'video',
      absolutePath:
        '/home/User/The.Lord.of.the.Rings.The.Fellowship.of.the.Ring.2001.Extended.1080p.BluRay.DTS.x264-UltraHD.Remastered.avi',
    };

    mockState.dispatchEvent(
      new CustomEvent('change', {
        detail: { key: 'file', value: mockFile },
      }),
    );

    mockState.file = mockFile;
    return Promise.resolve(mockFile);
  },
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
