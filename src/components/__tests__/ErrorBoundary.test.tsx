import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import { vi } from 'vitest';

// エラーを発生させるダミーコンポーネント
const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // テスト時のエラーログを無視
  });

  afterEach(() => {
    vi.restoreAllMocks(); // テスト終了後にモックを元に戻す
  });

  it('エラーが発生した場合にフォールバックUIを表示する', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    // フォールバックUIが表示されていることを確認
    expect(screen.getByText('何か問題が発生しました。')).toBeInTheDocument();
  });

  it('エラーが発生していない場合に子コンポーネントをレンダリングする', () => {
    render(
      <ErrorBoundary>
        <div>正常なコンポーネント</div>
      </ErrorBoundary>
    );

    // 子コンポーネントが正常にレンダリングされていることを確認
    expect(screen.getByText('正常なコンポーネント')).toBeInTheDocument();
  });
});
