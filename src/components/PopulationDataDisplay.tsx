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

/**
 * チャートの高さをデバイスの種類に応じて決定する関数
 */
export const getChartHeight = (isMobile: boolean, isTablet: boolean) => {
  if (isTablet && !isMobile) {
    return 700;
  } else if (!isTablet) {
    return 900;
  } else {
    return 500;
  }
};

/**
 * 選択された都道府県の人口データをグラフで表示するコンポーネント
 */
const PopulationDataDisplay: React.FC<PopulationDataDisplayProps> = ({
  selectedPrefectures,
  prefectures,
  populationData,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  const chartHeight = getChartHeight(isMobile, isTablet);

  // 都道府県が選択されていない場合の表示
  if (selectedPrefectures.length === 0) {
    return <p>都道府県を選択してください</p>;
  }

  const prefectureOrder: number[] = regions.flatMap(
    (region) => region.prefectures
  );

  // 選択された都道府県を地域順にソート
  const sortedSelectedPrefectures = selectedPrefectures.slice().sort((a, b) => {
    return prefectureOrder.indexOf(a) - prefectureOrder.indexOf(b);
  });

  /**
   * 人口データを年ごとにマージする関数
   */
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
      // データが存在しない場合は何もしない
    });
    return Object.values(mergedData).sort((a, b) => a.year - b.year);
  };

  const mergedData = mergePopulationData(
    sortedSelectedPrefectures,
    populationData
  );

  // マージ後のデータが存在しない場合の処理
  if (mergedData.length === 0) {
    return <p>選択された都道府県の人口データがありません</p>;
  }
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

            // 都道府県データが存在しない場合はスキップ
            if (!prefecture) {
              return null;
            }

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

          // 都道府県データが存在しない場合はスキップ
          if (!prefecture) {
            return null;
          }

          const color = `hsl(${index * 50}, 70%, 50%)`;
          return (
            <div
              key={prefCode}
              className="legend-item"
              data-testid="legend-item"
            >
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
