import { useState } from 'react';

// 人口データの型定義
type PopulationData = {
  year: number;
  value: number;
};

const usePopulationData = () => {
  // 各都道府県の人口データを保持するステート
  const [populationData, setPopulationData] = useState<
    Record<number, PopulationData[]>
  >({});

  // 人口データを取得する関数
  const fetchPopulationData = async (prefCode: number, category: string) => {
    try {
      // APIから人口データを取得
      const response = await fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        {
          headers: {
            'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
          },
        }
      );

      // レスポンスがエラーの場合はエラーをスロー
      if (!response.ok) {
        // ステータスコードに基づいて詳細なエラーメッセージを設定
        throw new Error('Failed to fetch population data');
      }

      // レスポンスをJSON形式でパース
      const data = await response.json();

      // カテゴリに応じて対応するインデックスを選択
      let categoryIndex: number;
      switch (category) {
        case '年少人口':
          categoryIndex = 1;
          break;
        case '生産年齢人口':
          categoryIndex = 2;
          break;
        case '老年人口':
          categoryIndex = 3;
          break;
        default: // デフォルトは「総人口」を示す
          categoryIndex = 0;
      }

      // 指定したカテゴリの人口データを取得
      const populationCategoryData = data.result.data[categoryIndex].data;

      // ステートを更新して、取得した人口データを保存
      setPopulationData((prevData) => ({
        ...prevData,
        [prefCode]: populationCategoryData,
      }));
    } catch (err) {
      // エラーメッセージをコンソールに出力
      console.error('Error fetching population data:', err);
    }
  };

  // 人口データをクリアする関数
  const clearPopulationData = () => {
    setPopulationData({});
  };

  return { populationData, fetchPopulationData, clearPopulationData };
};

export default usePopulationData;
