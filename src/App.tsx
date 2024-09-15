import React, { useState } from 'react';
import './App.css';
import PrefectureCheckboxList from './components/PrefectureCheckboxList';
import PopulationDataDisplay from './components/PopulationDataDisplay';
import useFetchPrefectures from './hooks/useFetchPrefectures';
import usePopulationData from './hooks/usePopulationData';

const App: React.FC = () => {
  const { prefectures, error } = useFetchPrefectures();
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const { populationData, fetchPopulationData } = usePopulationData();
  const [populationCategory, setPopulationCategory] =
    useState<string>('総人口');

  const handleCheckboxChange = (prefCode: number) => {
    setSelectedPrefectures((prevSelected) => {
      if (prevSelected.includes(prefCode)) {
        return prevSelected.filter((code) => code !== prefCode);
      } else {
        fetchPopulationData(prefCode, populationCategory);
        return [...prevSelected, prefCode];
      }
    });
  };

  const handleCategoryChange = (category: string) => {
    setPopulationCategory(category);

    selectedPrefectures.forEach((prefCode) => {
      fetchPopulationData(prefCode, category);
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>都道府県一覧</h1>
      <PrefectureCheckboxList
        prefectures={prefectures}
        selectedPrefectures={selectedPrefectures}
        onCheckboxChange={handleCheckboxChange}
      />

      {/* カテゴリを選択するUIをボタンで表示 */}
      <div className="category-buttons">
        <button
          className={populationCategory === '総人口' ? 'active' : ''}
          onClick={() => handleCategoryChange('総人口')}
        >
          総人口
        </button>
        <button
          className={populationCategory === '年少人口' ? 'active' : ''}
          onClick={() => handleCategoryChange('年少人口')}
        >
          年少人口
        </button>
        <button
          className={populationCategory === '生産年齢人口' ? 'active' : ''}
          onClick={() => handleCategoryChange('生産年齢人口')}
        >
          生産年齢人口
        </button>
        <button
          className={populationCategory === '老年人口' ? 'active' : ''}
          onClick={() => handleCategoryChange('老年人口')}
        >
          老年人口
        </button>
      </div>

      <PopulationDataDisplay
        selectedPrefectures={selectedPrefectures}
        prefectures={prefectures}
        populationData={populationData}
      />
    </div>
  );
};

export default App;
