import React, { useEffect, useRef } from 'react';
import { TooltipProps } from 'recharts';
import './CustomTooltip.css';

const SCROLL_SPEED = 1; // ピクセル/インターバル
const SCROLL_INTERVAL = 50; // ミリ秒

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  const scrollingRef = useRef<HTMLUListElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // ツールチップが表示されたときにスクロールを開始
    if (active && payload && payload.length > 0) {
      const scrollContainer = scrollContainerRef.current;
      const scrollingList = scrollingRef.current;
      if (scrollContainer && scrollingList) {
        const totalScrollHeight =
          scrollingList.scrollHeight - scrollContainer.clientHeight;
        if (totalScrollHeight > 0) {
          scrollIntervalRef.current = setInterval(() => {
            if (scrollContainer.scrollTop < totalScrollHeight) {
              scrollContainer.scrollTop += SCROLL_SPEED;
            } else {
              scrollContainer.scrollTop = 0; // スクロールが終わったらリセット
            }
          }, SCROLL_INTERVAL);
        }
      }
    }

    // クリーンアップ関数：ツールチップが非表示になったときにスクロールを停止
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [active, payload]);

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // データを人口順にソート
  const sortedPayload = [...payload].sort((a, b) => {
    const aValue = a.value !== undefined ? a.value : 0;
    const bValue = b.value !== undefined ? b.value : 0;
    return bValue - aValue;
  });

  return (
    <div className="custom-tooltip">
      <p className="label">{`年: ${label}`}</p>
      <div className="scrolling-container" ref={scrollContainerRef}>
        <ul className="payload-list" ref={scrollingRef}>
          {sortedPayload.map((entry) => (
            <li key={entry.dataKey} className="payload-item">
              <span
                className="payload-color"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="payload-name">{entry.name}</span>:{' '}
              <span className="payload-value">
                {entry.value?.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomTooltip;
