export interface Region {
  name: string;
  prefectures: number[];
}

export const regions: Region[] = [
  {
    name: '北海道',
    prefectures: [1],
  },
  {
    name: '東北',
    prefectures: [2, 3, 4, 5, 6, 7],
  },
  {
    name: '関東',
    prefectures: [8, 9, 10, 11, 12, 13, 14],
  },
  {
    name: '中部',
    prefectures: [15, 16, 17, 18, 19, 20, 21, 22, 23],
  },
  {
    name: '近畿',
    prefectures: [24, 25, 26, 27, 28, 29, 30],
  },
  {
    name: '中国',
    prefectures: [31, 32, 33, 34, 35],
  },
  {
    name: '四国',
    prefectures: [36, 37, 38, 39],
  },
  {
    name: '九州',
    prefectures: [40, 41, 42, 43, 44, 45, 46, 47],
  },
];
