import { useState, useEffect } from 'react';
import { Prefecture } from '../types';

const useFetchPrefectures = () => {
  // 都道府県データを保持
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  // エラー情報を保持
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        // APIから都道府県データを取得
        const response = await fetch(
          'https://opendata.resas-portal.go.jp/api/v1/prefectures',
          {
            headers: {
              'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
            },
          }
        );

        // レスポンスがエラーの場合はエラーをスロー
        if (!response.ok) {
          // ステータスコードに基づいて詳細なエラーメッセージを設定
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
