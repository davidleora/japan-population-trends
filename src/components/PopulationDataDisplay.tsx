import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type PopulationData = {
  year: number;
  value: number;
};

type PopulationDataDisplayProps = {
  selectedPrefectures: number[];
  prefectures: { prefCode: number; prefName: string }[];
  populationData: Record<number, PopulationData[]>;
};

const mergePopulationData = (
  selectedPrefectures: number[],
  populationData: Record<number, PopulationData[]>
) => {
  const mergedData: Record<number, { year: number } & Record<number, number>> =
    {};
  selectedPrefectures.forEach((prefCode) => {
    const data = populationData[prefCode];
    if (data) {
      data.forEach((popData) => {
        if (!mergedData[popData.year]) {
          mergedData[popData.year] = { year: popData.year };
        }
        mergedData[popData.year][prefCode] = popData.value;
      });
    }
  });
  return Object.values(mergedData);
};

const PopulationDataDisplay: React.FC<PopulationDataDisplayProps> = ({
  selectedPrefectures,
  prefectures,
  populationData,
}) => {
  const mergedData = mergePopulationData(selectedPrefectures, populationData);
  return (
    <div>
      <h2>人口データ：</h2>
      {selectedPrefectures.length === 0 && <p>都道府県を選択してください。</p>}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedPrefectures.map((prefCode, index) => {
            const prefecture = prefectures.find(
              (pref) => pref.prefCode === prefCode
            );
            const color = `hsl(${index * 50}, 70%, 50%)`;
            return (
              <Line
                key={prefCode}
                type="monotone"
                dataKey={prefCode}
                stroke={color}
                activeDot={{ r: 8 }}
                name={prefecture?.prefName}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopulationDataDisplay;
