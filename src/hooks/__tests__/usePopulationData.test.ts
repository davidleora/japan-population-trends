import { renderHook, act } from '@testing-library/react';
import usePopulationData from '../usePopulationData';
import { vi } from 'vitest';

describe('usePopulationData', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('人口データを正しく取得する', async () => {
    const mockPopulationData = [
      { year: 2000, value: 50000000 },
      { year: 2005, value: 55000000 },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: {
              data: [
                { label: '層ん人口', data: mockPopulationData },
                { label: '年少人口', data: [] },
                { label: '生産年齢人口', data: [] },
                { label: '老年人口', data: [] },
              ],
            },
          }),
      } as Response)
    );

    const { result } = renderHook(() => usePopulationData());

    await act(async () => {
      await result.current.fetchPopulationData(1, '総人口');
    });

    expect(result.current.populationData[1]).toEqual(mockPopulationData);
  });

  it('年少人口データを正しく取得する', async () => {
    const mockPopulationData = [
      { year: 2000, value: 1000000 },
      { year: 2005, value: 1200000 },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: {
              data: [
                { label: '総人口', data: [] },
                { label: '年少人口', data: mockPopulationData },
                { label: '生産年齢人口', data: [] },
                { label: '老年人口', data: [] },
              ],
            },
          }),
      } as Response)
    );

    const { result } = renderHook(() => usePopulationData());

    await act(async () => {
      await result.current.fetchPopulationData(1, '年少人口');
    });

    expect(result.current.populationData[1]).toEqual(mockPopulationData);
  });

  it('生産年齢人口データを正しく取得する', async () => {
    const mockPopulationData = [
      { year: 2000, value: 2000000 },
      { year: 2005, value: 2200000 },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: {
              data: [
                { label: '総人口', data: [] },
                { label: '年少人口', data: [] },
                { label: '生産年齢人口', data: mockPopulationData },
                { label: '老年人口', data: [] },
              ],
            },
          }),
      } as Response)
    );

    const { result } = renderHook(() => usePopulationData());

    await act(async () => {
      await result.current.fetchPopulationData(1, '生産年齢人口');
    });

    expect(result.current.populationData[1]).toEqual(mockPopulationData);
  });

  it('老年人口データを正しく取得する', async () => {
    const mockPopulationData = [
      { year: 2000, value: 800000 },
      { year: 2005, value: 900000 },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: {
              data: [
                { label: '総人口', data: [] },
                { label: '年少人口', data: [] },
                { label: '生産年齢人口', data: [] },
                { label: '老年人口', data: mockPopulationData },
              ],
            },
          }),
      } as Response)
    );

    const { result } = renderHook(() => usePopulationData());

    await act(async () => {
      await result.current.fetchPopulationData(1, '老年人口');
    });

    expect(result.current.populationData[1]).toEqual(mockPopulationData);
  });

  it('人口データをクリアする', async () => {
    const mockPopulationData = [
      { year: 2000, value: 5000000 },
      { year: 2005, value: 5500000 },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: {
              data: [
                { label: '総人口', data: mockPopulationData },
                { label: '年少人口', data: [] },
                { label: '生産年齢人口', data: [] },
                { label: '老年人口', data: [] },
              ],
            },
          }),
      } as Response)
    );

    const { result } = renderHook(() => usePopulationData());

    await act(async () => {
      await result.current.fetchPopulationData(1, '総人口');
    });

    expect(result.current.populationData[1]).toEqual(mockPopulationData);

    act(() => {
      result.current.clearPopulationData();
    });

    expect(result.current.populationData).toEqual({});
  });

  it('APIエラー時に適切な処理が行われる', async () => {
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      } as Response)
    );

    const { result } = renderHook(() => usePopulationData());

    await act(async () => {
      await result.current.fetchPopulationData(1, '総人口');
    });

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error fetching population data:',
      expect.any(Error)
    );
    consoleErrorMock.mockRestore();
  });
});
