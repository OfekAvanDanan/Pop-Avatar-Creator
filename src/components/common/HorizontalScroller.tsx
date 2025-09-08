import React from 'react';

type Props = {
  children: React.ReactNode[] | React.ReactNode;
  initial?: number; // default 6
  step?: number; // default 2
  className?: string;
  style?: React.CSSProperties;
};

export default function HorizontalScroller({ children, initial = 6, step = 2, className, style }: Props) {
  const childArray = React.Children.toArray(children);
  const [visible, setVisible] = React.useState(Math.min(initial, childArray.length));
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setVisible(Math.min(initial, childArray.length));
  }, [childArray.length, initial]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 48) {
        setVisible((v) => Math.min(childArray.length, v + step));
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [childArray.length, step]);

  return (
    <div ref={containerRef} className={["hscroll", className].filter(Boolean).join(" ")} style={style}>
      {childArray.slice(0, visible).map((c) => c)}
    </div>
  );
}

