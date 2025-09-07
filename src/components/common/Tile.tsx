import React from 'react';
import './Tile.css';

type Props = {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function Tile({ selected, onClick, children }: Props) {
  return (
    <button className={`tile ${selected ? 'selected' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

