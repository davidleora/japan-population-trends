import { render } from '@testing-library/react';
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
});
