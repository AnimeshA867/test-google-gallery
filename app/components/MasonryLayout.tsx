"use client";

import { ReactNode, useEffect, useRef, useState, useCallback } from "react";

interface MasonryLayoutProps {
  children: ReactNode[];
  gap?: number;
  minItemWidth?: number;
  className?: string;
}

export function MasonryLayout({
  children,
  gap = 24,
  minItemWidth = 280,
  className = "",
}: MasonryLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);
  const [mounted, setMounted] = useState(false);

  const calculateColumns = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const newColumns = Math.max(
      1,
      Math.floor((containerWidth + gap) / (minItemWidth + gap))
    );

    setColumns(newColumns);
  }, [gap, minItemWidth]);

  useEffect(() => {
    setMounted(true);
    calculateColumns();

    const resizeObserver = new ResizeObserver(calculateColumns);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [calculateColumns]);

  // Organize children into columns
  const organizeIntoColumns = () => {
    const columnArrays: ReactNode[][] = Array.from(
      { length: columns },
      () => []
    );

    children.forEach((child, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(child);
    });

    return columnArrays;
  };

  if (!mounted) {
    // Show a simple grid while calculating
    return (
      <div
        ref={containerRef}
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
      >
        {children}
      </div>
    );
  }

  const columnArrays = organizeIntoColumns();

  return (
    <div
      ref={containerRef}
      className={`flex gap-${Math.floor(gap / 4)} ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {columnArrays.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-1 flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {column.map((child, childIndex) => (
            <div key={`${columnIndex}-${childIndex}`}>{child}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
