import cx from 'classnames';
import {
  ButtonHTMLAttributes,
  KeyboardEvent,
  ReactElement,
  useState,
} from 'react';

import { handleAccessibleKeyPress } from '@utils/handleAccessibleKeyPress';

type ButtonProps = {
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  className,
  iconLeft = undefined,
  iconRight = undefined,
  type = 'button',
  ...props
}: ButtonProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleKeyPress = (e: KeyboardEvent<HTMLButtonElement>) => {
    const isKeyDown = e.type === 'keydown';
    handleAccessibleKeyPress(e, () => setIsActive(isKeyDown));
  };

  return (
    <button
      className={cx(
        'btn h-auto px-1 shadow-none',
        { 'btn-active': isActive },
        className,
      )}
      type={type}
      onKeyDown={handleKeyPress}
      onKeyUp={handleKeyPress}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
};

export default Button;
