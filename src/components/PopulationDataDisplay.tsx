import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMediaQuery } from 'react-responsive';
import { regions } from '../constants/regions';

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
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  let chartHeight = 500;
  if (isTablet && !isMobile) {
    chartHeight = 700;
  } else if (!isTablet) {
    chartHeight = 900;
  }

  const prefectureOrder: number[] = regions.flatMap(
    (region) => region.prefectures
  );

  const sortedSelectedPrefectures = selectedPrefectures.slice().sort((a, b) => {
    return prefectureOrder.indexOf(a) - prefectureOrder.indexOf(b);
  });

  const mergePopulationData = (
    sortedSelectedPrefectures: number[],
    populationData: Record<number, PopulationData[]>
  ) => {
    const mergedData: Record<
      number,
      { year: number } & Record<number, number>
    > = {};
    sortedSelectedPrefectures.forEach((prefCode) => {
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
    return Object.values(mergedData).sort((a, b) => a.year - b.year);
  };

  const mergedData = mergePopulationData(
    sortedSelectedPrefectures,
    populationData
  );

  return (
    <div>
      <h2>人口データ：</h2>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={mergedData}
          margin={{ top: 15, right: 15, left: 10, bottom: 20 }}
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
          {sortedSelectedPrefectures.map((prefCode, index) => {
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

      <div className="custom-legend">
        {sortedSelectedPrefectures.map((prefCode, index) => {
          const prefecture = prefectures.find(
            (pref) => pref.prefCode === prefCode
          );
          const color = `hsl(${index * 50}, 70%, 50%)`;
          return (
            <div key={prefCode} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: color }}
              ></span>
              <span className="legend-name">{prefecture?.prefName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopulationDataDisplay;
