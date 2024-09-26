import React from 'react';
import { Prefecture } from '../types';
import { regions } from '../constants/regions';

interface PrefectureCheckboxListProps {
  prefectures: Prefecture[];
  selectedPrefectures: number[];
  onCheckboxChange: (prefCode: number) => void;
}

/**
 * 都道府県のチェックボックスリストを表示するコンポーネント
 */
const PrefectureCheckboxList: React.FC<PrefectureCheckboxListProps> = ({
  prefectures,
  selectedPrefectures,
  onCheckboxChange,
}) => {
  // 都道府県データが存在しない場合の処理
  if (!prefectures || prefectures.length === 0) {
    return <div>都道府県データが利用できません</div>;
  }

  return (
    <div
      className="prefecture-checkbox-list"
      data-testid="prefecture-checkbox-list"
    >
      {regions.map((region) => {
        // 各地域に属する都道府県をフィルタリング
        const regionPrefectures = prefectures.filter((prefecture) =>
          region.prefectures.includes(prefecture.prefCode)
        );

        // 該当する都道府県がない場合は表示しない
        if (regionPrefectures.length === 0) {
          return null;
        }

        return (
          <div key={region.name} className="region">
            <h2 className="region-name">{region.name}</h2>
            <ul className="prefecture-list">
              {regionPrefectures.map((prefecture) => (
                <li key={prefecture.prefCode} className="prefecture-item">
                  <label htmlFor={`pref-${prefecture.prefCode}`}>
                    <input
                      type="checkbox"
                      id={`pref-${prefecture.prefCode}`}
                      checked={selectedPrefectures.includes(
                        prefecture.prefCode
                      )}
                      onChange={() => onCheckboxChange(prefecture.prefCode)}
                    />
                    {prefecture.prefName}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default PrefectureCheckboxList;
