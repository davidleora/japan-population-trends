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
  const { populationData, fetchPopulationData, clearPopulationData } =
    usePopulationData();
  const [populationCategory, setPopulationCategory] =
    useState<string>('総人口');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPrefectureList, setShowPrefectureList] = useState<boolean>(true);

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
    allPrefCodes.forEach((prefCode) => {
      fetchPopulationData(prefCode, populationCategory);
    });
  };

  const handleReset = () => {
    setSelectedPrefectures([]);
    clearPopulationData();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <header>
        <h1>都道府県別の総人口推移グラフ</h1>
      </header>

      <p>
        このウェブサイトでは、日本の都道府県ごとの人口推移をグラフで表示します。
        以下のリストから都道府県を選択してください。
      </p>

      <h2
        className="prefecture-list-title"
        onClick={() => setShowPrefectureList(!showPrefectureList)}
        role="button"
        aria-expanded={showPrefectureList}
      >
        都道府県一覧 {showPrefectureList ? '▲' : '▼'}
      </h2>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <>
          {showPrefectureList && (
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
            </>
          )}

          <h2>人口カテゴリの選択</h2>
          <p>表示したい人口のカテゴリを選んでください。</p>

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

          <h2>選択した都道府県の人口推移グラフ</h2>

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
