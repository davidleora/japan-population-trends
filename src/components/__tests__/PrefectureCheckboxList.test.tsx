import { render, screen, fireEvent } from '@testing-library/react';
import { Prefecture } from '../../types';
import { vi } from 'vitest';
import PrefectureCheckboxList from '../PrefectureCheckboxList';

test('prefecturesが空の場合、エラーメッセージが表示される', () => {
  render(
    <PrefectureCheckboxList
      prefectures={[]}
      selectedPrefectures={[]}
      onCheckboxChange={() => {}}
    />
  );

  expect(
    screen.getByText('都道府県データが利用できません')
  ).toBeInTheDocument();
});

test('コンポーネントがレンダリングされることを確認', () => {
  const mockPrefectures: Prefecture[] = [{ prefCode: 1, prefName: '北海道' }];

  render(
    <PrefectureCheckboxList
      prefectures={mockPrefectures}
      selectedPrefectures={[]}
      onCheckboxChange={() => {}}
    />
  );

  const element = screen.getByTestId('prefecture-checkbox-list');
  expect(element).toBeInTheDocument();
});

test('都道府県のチェックボックスが正しくレンダリングされる', () => {
  const mockPrefectures: Prefecture[] = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
  ];

  render(
    <PrefectureCheckboxList
      prefectures={mockPrefectures}
      selectedPrefectures={[]}
      onCheckboxChange={() => {}}
    />
  );

  mockPrefectures.forEach((prefecture) => {
    const checkbox = screen.getByLabelText(prefecture.prefName);
    expect(checkbox).toBeInTheDocument();
  });
});

test('選択された都道府県のチェックボックスがチェックされている', () => {
  const mockPrefectures: Prefecture[] = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
  ];

  const selectedPrefectures = [1];

  render(
    <PrefectureCheckboxList
      prefectures={mockPrefectures}
      selectedPrefectures={selectedPrefectures}
      onCheckboxChange={() => {}}
    />
  );

  const hokkaidoCheckbox = screen.getByLabelText('北海道') as HTMLInputElement;
  expect(hokkaidoCheckbox.checked).toBe(true);

  const aomoriCheckbox = screen.getByLabelText('青森県') as HTMLInputElement;
  expect(aomoriCheckbox.checked).toBe(false);
});

test('チェックボックスをクリックすると onCheckboxChange が呼び出される', () => {
  const mockPrefectures: Prefecture[] = [{ prefCode: 1, prefName: '北海道' }];

  const onCheckboxChangeMock = vi.fn();

  render(
    <PrefectureCheckboxList
      prefectures={mockPrefectures}
      selectedPrefectures={[]}
      onCheckboxChange={onCheckboxChangeMock}
    />
  );

  const checkbox = screen.getByLabelText('北海道');
  fireEvent.click(checkbox);

  expect(onCheckboxChangeMock).toHaveBeenCalledWith(1);
});

it('地域ごとに都道府県がレンダリングされる', () => {
  render(
    <PrefectureCheckboxList
      prefectures={[
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 13, prefName: '東京都' },
      ]}
      selectedPrefectures={[]}
      onCheckboxChange={() => {}}
    />
  );

  const hokkaidoRegion = screen.getByRole('heading', { name: '北海道' });
  expect(hokkaidoRegion).toBeInTheDocument();

  const hokkaidoPrefecture = screen
    .getAllByText('北海道')
    .find((el) => el.closest('label'));
  expect(hokkaidoPrefecture).toBeInTheDocument();
});
