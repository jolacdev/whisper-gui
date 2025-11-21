import cx from 'classnames';
import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  title: string;
  className?: string;
};

const Card = ({ children, className = '', title }: CardProps) => (
  <div
    className={cx('bg-charcoal-900 rounded-lg p-6 wrap-break-word', className)}
  >
    <h3 className="text-charcoal-50 mb-6 text-3xl font-semibold">{title}</h3>
    {children}
  </div>
);

export default Card;
