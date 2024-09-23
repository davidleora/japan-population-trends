import { useState, useEffect } from 'react';
import { Prefecture } from '../types';

const useFetchPrefectures = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const response = await fetch(
          'https://opendata.resas-portal.go.jp/api/v1/prefectures',
          {
            headers: {
              'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
            },
          }
        );

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
    };

    fetchPrefectures();
  }, []);

  return { prefectures, error };
};

export default useFetchPrefectures;
