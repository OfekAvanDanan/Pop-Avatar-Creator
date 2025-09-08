import React from 'react';
import './Button.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  block?: boolean;
};

export default function Button({ variant = 'primary', block, className, children, ...rest }: Props) {
  const cls = [
    'btn',
    variant ? `btn-${variant}` : undefined,
    block ? 'btn-block' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

