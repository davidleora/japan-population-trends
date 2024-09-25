import { render, screen } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import { useMediaQuery } from 'react-responsive';
import PopulationDataDisplay from '../PopulationDataDisplay';
import * as Recharts from 'recharts';
import * as ReactResponsive from 'react-responsive';
import '@testing-library/jest-dom';

beforeAll(() => {
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual<typeof Recharts>('recharts');
  return {
    ...OriginalRecharts,
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
  ...vi.importActual<typeof ReactResponsive>('react-responsive'),
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

  it('renders correct legend items for selected prefectures', () => {
    const mockPrefectures = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ];

    const mockPopulationData = {
      1: [{ year: 2000, value: 5000000 }],
      2: [{ year: 2000, value: 1500000 }],
    };

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

  it('displays a message when no prefectures are selected', () => {
    const mockPrefectures = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ];

    const mockPopulationData = {
      1: [{ year: 2000, value: 5000000 }],
      2: [{ year: 2000, value: 1500000 }],
    };

    render(
      <PopulationDataDisplay
        selectedPrefectures={[]}
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    expect(screen.getByText('都道府県を選択してください')).toBeInTheDocument();
  });
});
