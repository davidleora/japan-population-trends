import { renderHook, waitFor } from '@testing-library/react';
import useFetchPrefectures from '../useFetchPrefectures';
import { vi } from 'vitest';

describe('useFetchPrefectures', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('都道府県データを正しく取得する', async () => {
    const mockPrefectures = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: mockPrefectures }),
      } as Response)
    );

    const { result } = renderHook(() => useFetchPrefectures());

    await waitFor(() => {
      expect(result.current.prefectures).toEqual(mockPrefectures);
      expect(result.current.error).toBeNull();
    });
  });

  it('フェッチに失敗した場合、エラーが設定される', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Failed to fetch')));

    const { result } = renderHook(() => useFetchPrefectures());

    await waitFor(() => {
      expect(result.current.prefectures).toEqual([]);
      expect(result.current.error).toEqual('Failed to fetch');
    });
  });

  it('response.ok が false の場合、エラーが設定される', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      } as Response)
    );

    const { result } = renderHook(() => useFetchPrefectures());

    await waitFor(() => {
      expect(result.current.prefectures).toEqual([]);
      expect(result.current.error).toEqual('Failed to fetch prefectures');
    });
  });

  it('未知のエラーが発生した場合、"An unknown error occurred" が設定される', async () => {
    global.fetch = vi.fn(() => {
      throw 'Some unknown error';
    });

    const { result } = renderHook(() => useFetchPrefectures());

    await waitFor(() => {
      expect(result.current.prefectures).toEqual([]);
      expect(result.current.error).toEqual('An unknown error occurred');
    });
  });
});
