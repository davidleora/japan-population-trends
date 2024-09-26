import React, { useState, useEffect } from 'react';
import './App.css';

import LoadingDots from './components/LoadingDots';
import PrefectureCheckboxList from './components/PrefectureCheckboxList';
import PopulationDataDisplay from './components/PopulationDataDisplay';
import ErrorBoundary from './components/ErrorBoundary';

import useFetchPrefectures from './hooks/useFetchPrefectures';
import usePopulationData from './hooks/usePopulationData';

const App: React.FC = () => {
  // 都道府県データとエラー情報を取得
  const { prefectures, error } = useFetchPrefectures();

  // 選択した都道府県のprefCodeを保持
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);

  // 人口データとデータ取得関数を取得
  const { populationData, fetchPopulationData, clearPopulationData } =
    usePopulationData();

  // 選択された人口カテゴリを保持
  const [populationCategory, setPopulationCategory] =
    useState<string>('総人口');

  // ローディング状態を管理
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 都道府県リストの表示・非表示を管理
  const [showPrefectureList, setShowPrefectureList] = useState<boolean>(true);

  useEffect(() => {
    // 都道府県データが取得できたらローディングを解除
    if (prefectures.length > 0) {
      setIsLoading(false);
    }
  }, [prefectures]);

  // 都道府県のチェックボックスが変更された時の処理
  const handleCheckboxChange = (prefCode: number) => {
    setSelectedPrefectures((prevSelected) => {
      if (prevSelected.includes(prefCode)) {
        // すでに選択されている場合は削除
        return prevSelected.filter((code) => code !== prefCode);
      } else {
        // 新しく選択された場合はデータを取得
        fetchPopulationData(prefCode, populationCategory);
        return [...prevSelected, prefCode];
      }
    });
  };

  // 人口カテゴリが変更された時の処理
  const handleCategoryChange = (category: string) => {
    setPopulationCategory(category);

    // 選択されている都道府県のデータを再取得
    selectedPrefectures.forEach((prefCode) => {
      fetchPopulationData(prefCode, category);
    });
  };

  // 全ての都道府県を選択する
  const handleSelectAll = () => {
    const allPrefCodes = prefectures.map((pref) => pref.prefCode);
    setSelectedPrefectures(allPrefCodes);

    // 全ての都道府県のデータを取得
    allPrefCodes.forEach((prefCode) => {
      fetchPopulationData(prefCode, populationCategory);
    });
  };

  // 選択をリセットする処理
  const handleReset = () => {
    setSelectedPrefectures([]);
    clearPopulationData();
  };

  // エラーが発生した場合の表示
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ErrorBoundary>
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
                className={
                  populationCategory === '生産年齢人口' ? 'active' : ''
                }
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
    </ErrorBoundary>
  );
};

export default App;
