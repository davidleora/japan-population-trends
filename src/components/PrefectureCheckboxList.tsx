import React from 'react';
import { Prefecture } from '../types';
import { regions } from '../constants/regions';

interface PrefectureCheckboxListProps {
  prefectures: Prefecture[];
  selectedPrefectures: number[];
  onCheckboxChange: (prefCode: number) => void;
}

const PrefectureCheckboxList: React.FC<PrefectureCheckboxListProps> = ({
  prefectures,
  selectedPrefectures,
  onCheckboxChange,
}) => {
  return (
    <div className="prefecture-checkbox-list">
      {regions.map((region) => {
        const regionPrefectures = prefectures.filter((prefecture) =>
          region.prefectures.includes(prefecture.prefCode)
        );

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
