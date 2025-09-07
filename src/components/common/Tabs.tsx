import React from 'react';
import './Tabs.css';

type TabItem = { key: string; label: string };

type Props = {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  // Optional: color for the sliding indicator background
  indicatorColor?: string;
};

export default function Tabs({ items, activeKey, onChange, indicatorColor }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = React.useState<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 });

  const updateIndicator = React.useCallback(() => {
    const container = containerRef.current;
    const activeEl = tabRefs.current[activeKey];
    if (!container || !activeEl) return;
    const left = activeEl.offsetLeft;
    const top = activeEl.offsetTop;
    const width = activeEl.offsetWidth;
    const height = activeEl.offsetHeight;
    setIndicator({ left, top, width, height });
  }, [activeKey]);

  React.useEffect(() => {
    updateIndicator();
  }, [updateIndicator, items, activeKey]);

  React.useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateIndicator]);

  return (
    <div className="builder-tabs" ref={containerRef}>
      <div
        className="tab-indicator"
        style={{ transform: `translate(${indicator.left}px, ${indicator.top}px)`, width: indicator.width, height: indicator.height, background: indicatorColor || 'var(--primary)' }}
      />
      {items.map((t) => (
        <button
          key={t.key}
          ref={(el) => { tabRefs.current[t.key] = el; }}
          className={`tab ${activeKey === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
