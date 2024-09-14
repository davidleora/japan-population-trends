import { useState } from 'react';

type PopulationData = {
  year: number;
  value: number;
};

const usePopulationData = () => {
  const [populationData, setPopulationData] = useState<Record<number, PopulationData[]>>({});

  const fetchPopulationData = async (prefCode: number) => {
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
      setPopulationData((prevData) => ({
        ...prevData,
        [prefCode]: data.result.data[0].data,
      }));
    } catch (err) {
      console.error('Error fetching population data:', err);
    }
  };

  return { populationData, fetchPopulationData };
};

export default usePopulationData;
