import { useCallback, useRef, useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors } from '@/styles/theme';
import { ChartCard } from './chart-card';
import type { CanvasLayoutItem, WidgetConfig } from '@/types';

interface CanvasGridProps {
  layout: CanvasLayoutItem[];
  widgets: WidgetConfig[];
  onLayoutChange: (layout: CanvasLayoutItem[]) => void;
  onRemoveWidget: (widgetId: string) => void;
  highlightWidgetId?: string;
}

const GridWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;

  /* Override react-grid-layout defaults */
  .react-grid-item {
    transition: all 200ms ease;
  }

  .react-grid-item.react-grid-placeholder {
    background: rgb(var(--app-dd-primary-rgb, 255 58 0) / 0.08);
    border: 2px dashed var(--app-dd-primary);
    border-radius: ${Theme.usage.borderRadius.xLarge};
    opacity: 1;
  }

  .react-grid-item > .react-resizable-handle {
    width: 16px;
    height: 16px;

    &::after {
      width: 8px;
      height: 8px;
      border-right: 2px solid rgb(var(--app-muted-fg-rgb) / 0.3);
      border-bottom: 2px solid rgb(var(--app-muted-fg-rgb) / 0.3);
      right: 4px;
      bottom: 4px;
    }
  }
`;

function toGridLayout(items: CanvasLayoutItem[]): GridLayout.Layout[] {
  return items.map((item) => ({
    i: item.widgetId,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: 3,
    minH: 2,
  }));
}

function fromGridLayout(layout: GridLayout.Layout[]): CanvasLayoutItem[] {
  return layout.map((item) => ({
    widgetId: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  }));
}

export function CanvasGrid({ layout, widgets, onLayoutChange, onRemoveWidget, highlightWidgetId }: CanvasGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLayoutChange = useCallback(
    (newLayout: GridLayout.Layout[]) => {
      onLayoutChange(fromGridLayout(newLayout));
    },
    [onLayoutChange],
  );

  const widgetMap = new Map(widgets.map((w) => [w.id, w]));

  return (
    <GridWrapper ref={containerRef}>
      <GridLayout
        className="layout"
        layout={toGridLayout(layout)}
        cols={12}
        rowHeight={80}
        width={width}
        margin={[16, 16]}
        compactType="vertical"
        draggableHandle=".drag-handle"
        onLayoutChange={handleLayoutChange}
        isResizable
        isDraggable
      >
        {layout.map((item) => {
          const widget = widgetMap.get(item.widgetId);
          if (!widget) return <div key={item.widgetId} />;
          return (
            <div key={item.widgetId}>
              <ChartCard widget={widget} onRemove={onRemoveWidget} highlight={widget.id === highlightWidgetId} />
            </div>
          );
        })}
      </GridLayout>
    </GridWrapper>
  );
}
