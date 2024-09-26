import { render, screen } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import { useMediaQuery } from 'react-responsive';
import { getChartHeight } from '../PopulationDataDisplay';
import PopulationDataDisplay from '../PopulationDataDisplay';
import * as Recharts from 'recharts';
import * as ReactResponsive from 'react-responsive';
import '@testing-library/jest-dom';
import React from 'react';

// Rechartsコンポーネントをモック
vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual<typeof Recharts>('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Line: ({ dataKey }: { dataKey: string | number }) => (
      <div data-testid={`line-${dataKey}`} />
    ),
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
  };
});

// react-responsiveのモック
vi.mock('react-responsive', () => ({
  ...vi.importActual<typeof ReactResponsive>('react-responsive'),
  useMediaQuery: vi.fn(),
}));

describe('getChartHeight', () => {
  it('モバイルの場合は500を返す', () => {
    expect(getChartHeight(true, true)).toBe(500);
  });

  it('タブレットの場合は700を返す', () => {
    expect(getChartHeight(false, true)).toBe(700);
  });

  it('デスクトップの場合は900を返す', () => {
    expect(getChartHeight(false, false)).toBe(900);
  });
});

describe('PopulationDataDisplay', () => {
  const mockPrefectures = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
  ];

  const mockPopulationData = {
    1: [
      { year: 2000, value: 5000000 },
      { year: 2005, value: 5500000 },
    ],
    2: [
      { year: 2000, value: 1500000 },
      { year: 2005, value: 1400000 },
    ],
  };

  beforeEach(() => {
    // デフォルトでデスクトップ表示としてモック
    (useMediaQuery as Mock).mockReturnValue(false);
  });

  it('コンポーネントが正常にレンダリングされる', () => {
    const mockSelectedPrefectures = [1, 2];

    const { container } = render(
      <PopulationDataDisplay
        selectedPrefectures={mockSelectedPrefectures}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    expect(container).toBeInTheDocument();
  });

  it('モバイルデバイスで正しくレンダリングされる', () => {
    (useMediaQuery as Mock).mockReturnValueOnce(true); // モバイル表示

    const { container } = render(
      <PopulationDataDisplay
        selectedPrefectures={[1]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    expect(container).toBeInTheDocument();
  });

  it('選択された都道府県に応じて正しいライン数がレンダリングされる', async () => {
    render(
      <PopulationDataDisplay
        selectedPrefectures={[1, 2]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    const lines = screen.getAllByTestId(/line-/);
    expect(lines.length).toBe(2); // 2つの都道府県に対応するラインがレンダリングされている
  });

  it('選択された都道府県の凡例が正しく表示される', () => {
    render(
      <PopulationDataDisplay
        selectedPrefectures={[1, 2]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    const legendItems = screen.getAllByTestId('legend-item');
    expect(legendItems.length).toBe(2);

    expect(legendItems[0]).toHaveTextContent('北海道');
    expect(legendItems[1]).toHaveTextContent('青森県');
  });

  it('都道府県が選択されていない場合にメッセージが表示される', () => {
    render(
      <PopulationDataDisplay
        selectedPrefectures={[]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    expect(screen.getByText('都道府県を選択してください')).toBeInTheDocument();
  });

  it('選択された都道府県に人口データが存在しない場合、グラフがレンダリングされない', () => {
    const mockPrefectures = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ];

    const mockPopulationData = {
      // 人口データが空
      1: [],
      2: [],
    };

    render(
      <PopulationDataDisplay
        selectedPrefectures={[1, 2]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    expect(
      screen.getByText('選択された都道府県の人口データがありません')
    ).toBeInTheDocument();

    const lines = screen.queryAllByTestId(/line-/);
    expect(lines.length).toBe(0);
  });

  it('存在しない都道府県が選択された場合、Lineコンポーネントがレンダリングされない', () => {
    const mockPrefectures = [
      { prefCode: 1, prefName: '北海道' },
      // prefCode 999 の都道府県データは存在しない
    ];

    const mockPopulationData = {
      1: [
        { year: 2000, value: 5000000 },
        { year: 2005, value: 5500000 },
      ],
      999: [
        { year: 2000, value: 1000000 },
        { year: 2005, value: 1100000 },
      ],
    };

    render(
      <PopulationDataDisplay
        selectedPrefectures={[1, 999]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    const lines = screen.getAllByTestId(/line-/);
    expect(lines.length).toBe(1);

    expect(screen.queryByTestId('line-999')).not.toBeInTheDocument();

    const legendItems = screen.getAllByTestId('legend-item');
    expect(legendItems.length).toBe(1);
    expect(legendItems[0]).toHaveTextContent('北海道');
  });
});
