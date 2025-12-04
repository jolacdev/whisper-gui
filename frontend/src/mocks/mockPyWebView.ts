import {
  File,
  PyWebViewApi,
  TranscriptionSegment,
} from 'types/pywebview/pywebview-api';
import { PyWebViewState } from 'types/pywebview/pywebview-state';

const eventTarget = new EventTarget();

const mockState: PyWebViewState & { [key: string]: unknown } = {
  // @ts-expect-error Workaround for standalone
  addEventListener: (...args) => eventTarget.addEventListener(...args),
  dispatchEvent: (...args) => eventTarget.dispatchEvent(...args),
  // @ts-expect-error Workaround for standalone
  removeEventListener: (...args) => eventTarget.removeEventListener(...args),
};

const mockApi: PyWebViewApi = {
  open_file_dialog: (): Promise<File | null> => {
    const mockFile: File = {
      absolutePath: '/test/sample.mp3',
      name: 'sample fdsdshj jksdhjfkhewjkd hsjk hjkdshf jkds dhjsfhjkdhjk wehjkehkjfwekjhfwehkjfwedhhkj whejk hewjkhjkwehjkewhjkfewhjkfewhjkfwehkjfewhkj kj fhjkewhjewkjhkewfhjkfewhjkwef.mp3',
      size: 1887436,
      type: 'asdsfdsf',
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
