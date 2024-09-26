import React from 'react';
import './LoadingDots.css';

/**
 * ローディング中に表示されるアニメーションコンポーネント
 */
const LoadingDots: React.FC = () => {
  return (
    <div className="loading-container" data-testid="loading-container">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default LoadingDots;
