import cx from 'classnames';
import { DragEvent, useState } from 'react';

import SelectedFilePreview from '@features/fileSelector/components/SelectedFilePreview';
import { Upload } from '@icons/Upload';
import { formatSizeUnit } from '@utils/formatSizeUnit';
import { File } from 'types/pywebview/pywebview-api';

type DropzoneProps = {
  id: string;
  file?: File;
  onClick: (file: File | null) => void;
  onDelete: () => void;
};

const Dropzone = ({
  id,
  file = undefined,
  onClick,
  onDelete,
}: DropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = async () => {
    const selectedFile = await window.pywebview.api.open_file_dialog();
    onClick(selectedFile);
  };

  const handleDrag = (e: DragEvent<HTMLButtonElement>, dragging: boolean) => {
    e.preventDefault();
    setIsDragging(dragging);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        className={cx(
          'flex flex-col items-center justify-center gap-4',
          'bg-base-200 border-charcoal-500 w-full rounded-lg border-1 border-dashed p-6 wrap-break-word hover:cursor-pointer',
          {
            'border-leaf-200 bg-charcoal-800': isDragging,
          },
        )}
        id={id}
        onClick={handleClick}
        // NOTE: Prevent default is managed by PyWebView, so it is not really needed here.
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrag(e, false)}
      >
        <div className="pointer-events-none flex flex-col items-center gap-1">
          <Upload height="32px" width="32px" />
          <h3>Upload your file</h3>
        </div>
        <div className="pointer-events-none">
          <p className="mb-1 text-xs">
            Drag and drop a file, or click to select one.
          </p>
          <p className="text-xs">
            Supported formats: audio and video files only.
          </p>
        </div>
      </button>
      {file && (
        <SelectedFilePreview
          name={file.name}
          size={formatSizeUnit(file.size)}
          type={file.type}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default Dropzone;
