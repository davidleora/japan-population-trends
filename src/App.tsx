import React, { useEffect, useState } from 'react';
import './App.css';

type Prefecture = {
  prefCode: number;
  prefName: string;
};

type PopulationData = {
  year: number;
  value: number;
};

const App: React.FC = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<Record<number, PopulationData[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const response = await fetch('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
          headers: {
            'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch prefectures');
        }
        
        const data = await response.json();
        setPrefectures(data.result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }

    fetchPrefectures();
  }, []);

  const handleCheckboxChange = (prefCode: number) => {
    setSelectedPrefectures((prevSelected) => {
      if (prevSelected.includes(prefCode)){
        return prevSelected.filter((code) => code !== prefCode);
      } else {
        fetchPopulationData(prefCode);
        return [...prevSelected, prefCode];
      }
    });
  };

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
      if(!response.ok) {
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

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>都道府県一覧</h1>
      <ul>
        {prefectures.map((prefecture) => (
          <li key={prefecture.prefCode}>
            <input type="checkbox" id={`pref-${prefecture.prefCode}`} checked={selectedPrefectures.includes(prefecture.prefCode) || false} onChange={() => handleCheckboxChange(prefecture.prefCode)}/>
            <label htmlFor={`pref-${prefecture.prefCode}`}>{prefecture.prefName}</label>
          </li>
        ))}
      </ul>
      <div>
        <h2>人口データ：</h2>
        {selectedPrefectures.map((prefCode) => (
          <div key={prefCode}>
            <h3>{prefectures.find((pref) => pref.prefCode === prefCode)?.prefName}</h3>
            <ul>
              {populationData[prefCode]?.map((pop) => (
                <li key={pop.year}>{pop.year}: {pop.value}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;