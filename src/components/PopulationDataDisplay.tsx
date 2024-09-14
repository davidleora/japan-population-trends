import React from 'react';

type PopulationData = {
  year: number;
  value: number;
};

type PopulationDataDisplayProps = {
  selectedPrefectures: number[];
  prefectures: { prefCode: number; prefName: string }[];
  populationData: Record<number, PopulationData[]>;
};

const PopulationDataDisplay: React.FC<PopulationDataDisplayProps> = ({
  selectedPrefectures,
  prefectures,
  populationData,
}) => {
  return (
    <div>
      <h2>人口データ：</h2>
      {selectedPrefectures.map((prefCode) => (
        <div key={prefCode}>
          <h3>{prefectures.find((pref) => pref.prefCode === prefCode)?.prefName}</h3>
          <ul>
            {populationData[prefCode]?.map((pop) => (
              <li key={pop.year}>
                {pop.year}: {pop.value}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PopulationDataDisplay;
