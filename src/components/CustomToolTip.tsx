import React, { useState, useEffect } from 'react';
import { TooltipProps } from 'recharts';
import './CustomTooltip.css'; // スタイルを調整するCSSファイルを用意

const ITEMS_PER_PAGE = 20; // 各ページに表示するアイテム数

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // payload が変わったら currentPage をリセット
  useEffect(() => {
    setCurrentPage(0);
  }, [payload]);

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // データを人口順にソート
  const sortedPayload = [...payload].sort((a, b) => {
    const aValue = a.value !== undefined ? a.value : 0;
    const bValue = b.value !== undefined ? b.value : 0;
    return bValue - aValue;
  });

  // ページングのデータ
  const totalPages = Math.ceil(sortedPayload.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageData = sortedPayload.slice(startIndex, endIndex);

  // ページングのコントロール
  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <div className="custom-tooltip">
      <p className="label">{`年: ${label}`}</p>
      <ul className="payload-list">
        {pageData.map((entry) => (
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
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} className="pagination-button">
            ◀
          </button>
          <span>{`${currentPage + 1} / ${totalPages}`}</span>
          <button onClick={handleNextPage} className="pagination-button">
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
