import cx from 'classnames';
import { DragEvent, ReactElement, useState } from 'react';

import { Upload } from '@icons/Upload';
import { formatSizeUnit } from '@utils/formatSizeUnit';
import { File } from 'types/pywebview/pywebview-api';

import SelectedFilePreview from './SelectedFilePreview';

export type DropzoneContent = {
  description: string;
  title: string;
  icon?: ReactElement;
};

type DropzoneProps = {
  id: string;
  content: DropzoneContent;
  file?: File;
  onClick: (file: File | null) => void;
  onDelete: () => void;
};

// TODO: Check Dropzone/Upload from: Ant, Supabase, UI Hanzo, Dice UI.
const Dropzone = ({
  id,
  content: { description, icon = <Upload />, title },
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

  const isFileSelected = !!file;

  return (
    <section className="flex flex-col gap-4">
      <button
        className={cx(
          'bg-base-200 border-charcoal-500 rounded-lg border border-dashed p-6',
          'hover:border-leaf-200 hover:cursor-pointer',
          'transition-colors ease-in-out',
          {
            'border-leaf-200 bg-charcoal-800': isDragging,
          },
        )}
        id={id}
        onClick={handleClick}
        // NOTE: Prevent default is managed by PyWebView, so it is not really needed here.
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, true)} // TODO: Check if debounce is needed
        onDrop={(e) => handleDrag(e, false)}
      >
        <div
          className={cx('flex flex-col items-center gap-1', {
            'pointer-events-none': isDragging,
          })}
        >
          {icon}
          <h3>{title}</h3>
          <p className="text-xs">{description}</p>
        </div>
      </button>

      {isFileSelected && (
        <SelectedFilePreview
          name={file.name}
          size={formatSizeUnit(file.size)}
          type={file.type}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};

export default Dropzone;
