import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { vi, MockedFunction } from 'vitest';

const mockFetchPopulationData = vi.fn();
const mockClearPopulationData = vi.fn();

vi.mock('../hooks/useFetchPrefectures');
vi.mock('../hooks/usePopulationData');

import useFetchPrefecturesOriginal from '../hooks/useFetchPrefectures';
import usePopulationDataOriginal from '../hooks/usePopulationData';

const useFetchPrefectures = useFetchPrefecturesOriginal as MockedFunction<
  typeof useFetchPrefecturesOriginal
>;
const usePopulationData = usePopulationDataOriginal as MockedFunction<
  typeof usePopulationDataOriginal
>;

describe('App コンポーネントのテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useFetchPrefectures.mockReturnValue({
      prefectures: [],
      error: null,
    });

    usePopulationData.mockReturnValue({
      populationData: {},
      fetchPopulationData: mockFetchPopulationData,
      clearPopulationData: mockClearPopulationData,
    });
  });

  test('App コンポーネントがレンダリングされる', () => {
    render(<App />);
    const headerElement = screen.getByText(/都道府県別の総人口推移グラフ/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('都道府県リストが正しく表示される', () => {
    useFetchPrefectures.mockReturnValue({
      prefectures: [
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 2, prefName: '青森県' },
      ],
      error: null,
    });

    render(<App />);
    const prefecture1 = screen.getByLabelText('北海道');
    const prefecture2 = screen.getByLabelText('青森県');

    expect(prefecture1).toBeInTheDocument();
    expect(prefecture2).toBeInTheDocument();
  });

  test('全てを選択ボタンをクリックすると、全ての都道府県が選択される', () => {
    useFetchPrefectures.mockReturnValue({
      prefectures: [
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 2, prefName: '青森県' },
      ],
      error: null,
    });

    render(<App />);

    const selectAllButton = screen.getByText('全てを選択');
    fireEvent.click(selectAllButton);

    expect(screen.getByLabelText('北海道')).toBeChecked();
    expect(screen.getByLabelText('青森県')).toBeChecked();
  });

  test('都道府県のチェックボックスを選択すると、人口データが取得される', () => {
    useFetchPrefectures.mockReturnValue({
      prefectures: [{ prefCode: 1, prefName: '北海道' }],
      error: null,
    });

    render(<App />);

    const checkbox = screen.getByLabelText('北海道');
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(mockFetchPopulationData).toHaveBeenCalledWith(1, '総人口');
  });

  test('都道府県のチェックボックスを解除すると、選択から外れる', () => {
    useFetchPrefectures.mockReturnValue({
      prefectures: [{ prefCode: 1, prefName: '北海道' }],
      error: null,
    });

    render(<App />);

    const checkbox = screen.getByLabelText('北海道');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('人口カテゴリを変更すると、選択済みの都道府県のデータが再取得される', () => {
    useFetchPrefectures.mockReturnValue({
      prefectures: [{ prefCode: 1, prefName: '北海道' }],
      error: null,
    });

    render(<App />);

    const checkbox = screen.getByLabelText('北海道');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const categoryButton = screen.getByText('年少人口');
    fireEvent.click(categoryButton);

    expect(mockFetchPopulationData).toHaveBeenCalledWith(1, '年少人口');
  });

  test('リセットボタンを押すと、選択された都道府県が解除され、データがクリアされる', () => {
    useFetchPrefectures.mockReturnValue({
      prefectures: [{ prefCode: 1, prefName: '北海道' }],
      error: null,
    });

    render(<App />);

    const checkbox = screen.getByLabelText('北海道');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const resetButton = screen.getByText('リセット');
    fireEvent.click(resetButton);

    expect(checkbox).not.toBeChecked();
    expect(mockClearPopulationData).toHaveBeenCalled();
  });

  test('エラーが発生した場合にエラーメッセージが表示される', () => {
    useFetchPrefectures.mockReturnValue({
      prefectures: [],
      error: 'データの取得に失敗しました',
    });

    render(<App />);

    const errorMessage = screen.getByText(/Error: データの取得に失敗しました/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
