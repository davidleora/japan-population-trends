import { useState } from 'react';

type PopulationData = {
  year: number;
  value: number;
};

const usePopulationData = () => {
  const [populationData, setPopulationData] = useState<Record<number, PopulationData[]>>({});

  const fetchPopulationData = async (prefCode: number, category: string) => {
    try {
      const response = await fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        {
          headers: {
            'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch population data');
      }

      const data = await response.json();

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
        default:
          categoryIndex = 0;
      }

      const populationCategoryData = data.result.data[categoryIndex].data;

      setPopulationData((prevData) => ({
        ...prevData,
        [prefCode]: populationCategoryData,
      }));
    } catch (err) {
      console.error('Error fetching population data:', err);
    }
  };

  return { populationData, fetchPopulationData };
};

export default usePopulationData;
