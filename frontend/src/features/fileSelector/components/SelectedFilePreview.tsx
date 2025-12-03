import { ReactElement } from 'react';

import Button from '@components/Button';
import { AudioFile } from '@icons/AudioFile';
import { Delete } from '@icons/Delete';
import { Draft } from '@icons/Draft';
import { VideoFile } from '@icons/VideoFile';

type MediaType = 'audio' | 'video';

type FilePreviewProps = {
  name: string;
  size: string;
  type: string;
  onDelete: () => void;
};

const iconMap: Record<MediaType, ReactElement> = {
  audio: <AudioFile />,
  video: <VideoFile />,
};

const isMediaType = (value: string): value is MediaType =>
  value === 'audio' || value === 'video';

const SelectedFilePreview = ({
  name,
  onDelete,
  size,
  type,
}: FilePreviewProps) => {
  const icon: ReactElement = isMediaType(type) ? iconMap[type] : <Draft />;

  return (
    <article className="bg-base-200 flex justify-between rounded-lg p-4">
      <figure className="flex min-w-0 items-center gap-4">
        <div>{icon}</div>
        <figcaption
          className="tooltip mr-6 flex min-w-0 flex-col gap-1"
          data-tip={name}
        >
          <span aria-label={name} className="truncate text-white">
            {name}
          </span>
          {/* TODO: Add aria-label i18n support. */}
          <span aria-label={`File size: ${size}`} className="text-xs">
            {size}
          </span>
        </figcaption>
      </figure>

      <Button
        // TODO: Add aria-label i18n support.
        aria-label={`Delete file ${name}`}
        className="btn-ghost"
        iconLeft={<Delete />}
        onClick={onDelete}
      />
    </article>
  );
};

export default SelectedFilePreview;
