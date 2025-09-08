import React from 'react';
import './ColumnPager.css';

type Props = {
  children: React.ReactNode[] | React.ReactNode;
  columnsVisible?: number; // default 3
  gap?: number; // px, default 12 (match CSS)
  className?: string;
  style?: React.CSSProperties;
};

export default function ColumnPager({ children, columnsVisible = 3, gap = 12, className, style }: Props) {
  const items = React.Children.toArray(children);
  // group into columns of 2 rows
  const columns: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    columns.push([items[i], items[i + 1]]);
  }

  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const firstColRef = React.useRef<HTMLDivElement | null>(null);
  const [page, setPage] = React.useState(0);

  const colFullWidth = React.useCallback(() => {
    const el = firstColRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return rect.width + gap; // approximate including gap between columns
  }, [gap]);

  // One dot per visible window (3 columns => 6 items)
  const pageCount = Math.ceil(columns.length / columnsVisible);

  // Update active page on scroll
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const step = colFullWidth() || 1;
      // Determine the current column index, then map to page by window size
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      // If we're effectively at the end, force last dot active
      if (track.scrollLeft >= maxScroll - 2) {
        setPage(Math.max(0, pageCount - 1));
        return;
      }
      const colIdx = Math.round(track.scrollLeft / step);
      const idx = Math.min(Math.max(Math.floor(colIdx / columnsVisible), 0), Math.max(0, pageCount - 1));
      setPage(idx);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [colFullWidth, columnsVisible, pageCount]);

  // Wheel handler to move exactly one column per gesture
  const wheelAccum = React.useRef(0);
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const primary = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wheelAccum.current += primary;
    const threshold = 30;
    const track = trackRef.current;
    if (!track) return;
    if (Math.abs(wheelAccum.current) > threshold) {
      e.preventDefault();
      const step = colFullWidth() || 1;
      const dir = wheelAccum.current > 0 ? 1 : -1;
      track.scrollBy({ left: dir * step, behavior: 'smooth' });
      wheelAccum.current = 0;
    }
  };

  const goPage = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const step = colFullWidth() || 1;
    const startCol = Math.min(idx * columnsVisible, Math.max(0, columns.length - columnsVisible));
    track.scrollTo({ left: startCol * step, behavior: 'smooth' });
  };

  return (
    <div className={["cpager", className].filter(Boolean).join(" ")} style={style}>
      <div className="cpager-track" ref={trackRef} onWheel={onWheel}>
        {columns.map((col, i) => (
          <div key={i} className="cpager-col" ref={i === 0 ? firstColRef : undefined}>
            {col.map((node, j) => (
              <div key={j} className="cpager-cell">
                {node}
              </div>
            ))}
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        <div className="cpager-dots">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              className={"cpager-dot" + (i === page ? " active" : "")}
              onClick={() => goPage(i)}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
