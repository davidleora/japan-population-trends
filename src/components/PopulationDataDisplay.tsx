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
import { useMediaQuery } from 'react-responsive';

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
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  let chartHeight = 300;
  if (isTablet && !isMobile) {
    chartHeight = 400;
  } else if (!isTablet) {
    chartHeight = 500;
  }

  const mergedData = mergePopulationData(selectedPrefectures, populationData);

  return (
    <div>
      <h2>人口データ：</h2>
      {selectedPrefectures.length === 0 && <p>都道府県を選択してください。</p>}

      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={mergedData}
          margin={{ top: 15, right: 15, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            interval={0}
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: isMobile ? '12px' : isTablet ? '14px' : '16px' }}
          />
          <YAxis
            width={isMobile ? 30 : isTablet ? 50 : 60}
            tickFormatter={(value) => `${value / 1000}K`}
            tick={{
              fontSize: isMobile ? '9px' : isTablet ? '11px' : '13px',
            }}
          />
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
