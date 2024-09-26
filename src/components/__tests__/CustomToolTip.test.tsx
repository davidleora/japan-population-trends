import { render, screen, act } from '@testing-library/react';
import CustomToolTip from '../CustomToolTip';
import { TooltipProps } from 'recharts';
import { vi } from 'vitest';

vi.useFakeTimers(); // タイマーをモック

describe('CustomToolTip', () => {
  const defaultProps: TooltipProps<number, string> = {
    active: false,
    payload: [],
    label: '',
  };

  afterEach(() => {
    vi.clearAllTimers(); // タイマーをクリア
  });

  it('activeがfalseの場合、nullをレンダリングする', () => {
    render(<CustomToolTip {...defaultProps} />);
    expect(screen.queryByText(/年:/)).toBeNull();
  });

  it('payloadが空の場合、nullをレンダリングする', () => {
    render(<CustomToolTip {...defaultProps} active={true} />);
    expect(screen.queryByText(/年:/)).toBeNull();
  });

  it('activeがtrueでpayloadがある場合、ツールチップをレンダリングする', () => {
    const payload = [
      {
        dataKey: '1',
        name: '東京都',
        value: 1000,
        color: '#ff0000',
      },
      {
        dataKey: '2',
        name: '大阪府',
        value: 800,
        color: '#00ff00',
      },
    ];

    render(<CustomToolTip active={true} payload={payload} label="2020" />);

    expect(screen.getByText('年: 2020')).toBeInTheDocument();
    expect(screen.getByText('東京都')).toBeInTheDocument();
    expect(screen.getByText('大阪府')).toBeInTheDocument();
  });

  it('データが人口順にソートされて表示される', () => {
    const payload = [
      {
        dataKey: '1',
        name: '大阪府',
        value: 800,
        color: '#00ff00',
      },
      {
        dataKey: '2',
        name: '東京都',
        value: 1000,
        color: '#ff0000',
      },
    ];

    render(<CustomToolTip active={true} payload={payload} label="2020" />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);

    // ソート順を確認（東京都が先に表示されるはず）
    expect(items[0]).toHaveTextContent('東京都');
    expect(items[1]).toHaveTextContent('大阪府');
  });
});
