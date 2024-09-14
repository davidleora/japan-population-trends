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

  const handleCheckboxChange = (prefCode: number) => {
    setSelectedPrefectures((prevSelected) => {
      if (prevSelected.includes(prefCode)) {
        return prevSelected.filter((code) => code !== prefCode);
      } else {
        fetchPopulationData(prefCode);
        return [...prevSelected, prefCode];
      }
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
      <PopulationDataDisplay
        selectedPrefectures={selectedPrefectures}
        prefectures={prefectures}
        populationData={populationData}
      />
    </div>
  );
};

export default App;
