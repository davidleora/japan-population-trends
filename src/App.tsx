import React, { useState, useEffect } from 'react';
import './App.css';
import LoadingDots from './components/LoadingDots';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (prefectures.length > 0) {
      setIsLoading(false);
    }
  }, [prefectures]);

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

  const handleSelectAll = () => {
    const allPrefCodes = prefectures.map((pref) => pref.prefCode);
    setSelectedPrefectures(allPrefCodes);
  };

  const handleReset = () => {
    setSelectedPrefectures([]);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <header>
        <h1>都道府県別の総人口推移グラフ</h1>
      </header>
      <h1>都道府県一覧</h1>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <>
          <div className="selection-buttons">
            <p>
              都道府県を選択してください（複数選択可）：
              {selectedPrefectures.length > 0
                ? `選択中 ${selectedPrefectures.length} 件`
                : '未選択'}
            </p>
            <button onClick={handleSelectAll}>全てを選択</button>
            <button onClick={handleReset}>リセット</button>
          </div>

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

          <footer>
            <p>©️ 2024 Japan Population Trends. All rights reserved.</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
