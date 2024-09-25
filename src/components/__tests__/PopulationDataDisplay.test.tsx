import { render, screen } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import { useMediaQuery } from 'react-responsive';
import PopulationDataDisplay from '../PopulationDataDisplay';
import '@testing-library/jest-dom';

// ResizeObserverのモックを追加
beforeAll(() => {
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual<any>('recharts');
  return {
    // 他の Recharts コンポーネントを展開
    ...OriginalRecharts,
    // 必要なコンポーネントをすべてモック
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    LineChart: ({ children }: any) => <div>{children}</div>,
    Line: ({ dataKey }: any) => <div data-testid={`line-${dataKey}`} />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
  };
});

vi.mock('react-responsive', () => ({
  ...vi.importActual<any>('react-responsive'),
  useMediaQuery: vi.fn(),
}));

describe('PopulationDataDisplay', () => {
  it('renders without crashing', () => {
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

    const mockSelectedPrefectures = [1, 2];

    // コンポーネントをレンダリングします
    const { container } = render(
      <PopulationDataDisplay
        selectedPrefectures={mockSelectedPrefectures}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    expect(container).toBeInTheDocument();
  });

  it('renders correctly on mobile devices', () => {
    (useMediaQuery as Mock).mockReturnValueOnce(true);

    const mockPrefectures = [{ prefCode: 1, prefName: '北海道' }];

    const mockPopulationData = {
      1: [
        { year: 2000, value: 5000000 },
        { year: 2005, value: 5500000 },
      ],
    };

    const { container } = render(
      <PopulationDataDisplay
        selectedPrefectures={[1]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    expect(container).toBeInTheDocument();
  });

  it('renders correct number of lines in the chart', async () => {
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

    render(
      <PopulationDataDisplay
        selectedPrefectures={[1, 2]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    const lines = screen.getAllByTestId(/line-/);
    expect(lines.length).toBe(2);
  });
});
