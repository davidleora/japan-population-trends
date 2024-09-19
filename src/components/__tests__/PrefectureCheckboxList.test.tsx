import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import '@testing-library/jest-dom';
import PrefectureCheckboxList from '../PrefectureCheckboxList';

test('都道府県のチェックボックスが正しく表示される', () => {
  const prefectures = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
  ];

  render(
    <PrefectureCheckboxList
      prefectures={prefectures}
      selectedPrefectures={[]}
      onCheckboxChange={() => {}}
    />
  );

  const checkbox = screen.getByLabelText('北海道');
  expect(checkbox).toBeInTheDocument();
});
