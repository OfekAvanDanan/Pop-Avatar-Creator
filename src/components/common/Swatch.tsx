import React from 'react';
import './Swatch.css';

type Props = {
  color: string;
  selected?: boolean;
  onClick: () => void;
};

export default function Swatch({ color, selected, onClick }: Props) {
  return (
    <button
      className={`swatch ${selected ? 'selected' : ''}`}
      style={{ background: color }}
      onClick={onClick}
      aria-label={`Color ${color}`}
    />
  );
}

