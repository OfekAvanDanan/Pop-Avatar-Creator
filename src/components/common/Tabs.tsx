import React from 'react';
import './Tabs.css';

type TabItem = { key: string; label: string };

type Props = {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function Tabs({ items, activeKey, onChange }: Props) {
  return (
    <div className="builder-tabs">
      {items.map((t) => (
        <button key={t.key} className={`tab ${activeKey === t.key ? 'active' : ''}`} onClick={() => onChange(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

