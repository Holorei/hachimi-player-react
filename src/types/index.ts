// 歌曲数据接口
export interface Song {
  bvid: string;
  author: string;
  originalTitle: string;
  videoTitle: string;
  Duration: string;  // 持续时间（秒）
}

// 播放模式枚举
export enum PlayMode {
  SEQUENTIAL = 'sequential',  // 顺序播放
  RANDOM = 'random',          // 随机播放
  LOOP = 'loop'               // 单曲循环
}

// 主题枚举
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
} 