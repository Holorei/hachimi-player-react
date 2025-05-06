import { useState, useEffect, useRef, useCallback } from 'react';
import { Song, PlayMode } from '../types';

// 从localStorage获取存储的播放模式设置
const getSavedPlayMode = (): PlayMode => {
  try {
    const savedPlayMode = localStorage.getItem('playMode');
    console.log('getSavedPlayMode - 读取播放模式设置:', savedPlayMode);
    
    if (savedPlayMode && Object.values(PlayMode).includes(savedPlayMode as PlayMode)) {
      return savedPlayMode as PlayMode;
    }
  } catch (error) {
    console.error('获取存储的播放模式失败:', error);
  }
  return PlayMode.SEQUENTIAL; // 默认值
};

// 从localStorage获取存储的自动播放设置
const getSavedAutoPlay = (): boolean => {
  try {
    const savedAutoPlay = localStorage.getItem('autoPlay');
    console.log('getSavedAutoPlay - 读取自动播放设置:', savedAutoPlay);
    
    if (savedAutoPlay !== null) {
      return savedAutoPlay === 'true';
    }
  } catch (error) {
    console.error('获取存储的自动播放设置失败:', error);
  }
  return true; // 默认值
};

export const usePlayer = (allSongs: Song[], filteredSongs: Song[]) => {
  // 使用获取到的存储值初始化状态
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(getSavedAutoPlay());
  const [playMode, setPlayMode] = useState<PlayMode>(getSavedPlayMode());
  
  // 跟踪初始化状态
  const isInitialized = useRef(false);
  
  // 添加一个key来强制刷新iframe
  const [iframeKey, setIframeKey] = useState(0);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playTimerRef = useRef<number | null>(null);
  const originalIndexRef = useRef<number>(-1); // 跟踪原始歌曲在完整列表中的索引
  const manualPlayRef = useRef<boolean>(false); // 标记是否是手动点击播放的

  // 清理定时器
  const clearPlayTimer = useCallback(() => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      clearPlayTimer();
    };
  }, [clearPlayTimer]);

  // 播放模式或自动播放设置变更时，重置定时器
  useEffect(() => {
    if (currentSong && autoPlay) {
      // 重新设置当前歌曲的定时器
      clearPlayTimer();
      const duration = parseInt(currentSong.duration) || 240;
      const timeoutDuration = (duration + 5) * 1000;
      
      playTimerRef.current = window.setTimeout(() => {
        console.log("自动播放定时器触发");
        handlePlayNext();
      }, timeoutDuration);
    } else if (!autoPlay) {
      clearPlayTimer();
    }
  }, [playMode, autoPlay, currentSong]);

  // 保存播放设置到localStorage (只有在值变化时保存)
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    
    try {
      // 保存当前的播放模式
      localStorage.setItem('playMode', playMode);
      
      // 读取回来验证是否保存成功
      const savedValue = localStorage.getItem('playMode');
      console.log('保存播放模式并验证:', { playMode, saved: savedValue });
    } catch (error) {
      console.error('保存播放模式失败:', error);
    }
  }, [playMode]);
  
  // 单独处理自动播放设置的保存
  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }
    
    try {
      // 保存当前的自动播放设置
      localStorage.setItem('autoPlay', String(autoPlay));
      
      // 读取回来验证是否保存成功
      const savedValue = localStorage.getItem('autoPlay');
      console.log('保存自动播放设置并验证:', { autoPlay, saved: savedValue });
    } catch (error) {
      console.error('保存自动播放设置失败:', error);
    }
  }, [autoPlay]);

  // 保存当前播放歌曲信息
  useEffect(() => {
    if (currentSong) {
      try {
        localStorage.setItem('lastPlayedSong', currentSong.bvid);
        console.log('保存当前播放歌曲:', currentSong.originalTitle);
      } catch (error) {
        console.error('保存当前播放歌曲失败:', error);
      }
    }
  }, [currentSong]);

  // 刷新iframe的函数
  const refreshIframe = useCallback(() => {
    console.log('刷新iframe，设置新的key值');
    setIframeKey(prev => prev + 1);
  }, []);

  // 播放歌曲
  const playSong = useCallback((song: Song) => {
    try {
      clearPlayTimer();
      
      setLoading(true);
      setError(null);
      
      // 标记为手动播放
      manualPlayRef.current = true;
      
      // 如果是同一首歌，刷新iframe
      if (currentSong && currentSong.bvid === song.bvid) {
        console.log('播放同一首歌曲，刷新iframe');
        refreshIframe();
      }
      
      setCurrentSong(song);
      
      // 找到并保存原始索引，用于顺序播放
      const songIndex = allSongs.findIndex(s => s.bvid === song.bvid);
      if (songIndex !== -1) {
        originalIndexRef.current = songIndex;
      }
      
      // 设置自动播放定时器
      if (autoPlay) {
        const duration = parseInt(song.duration) || 240;
        const timeoutDuration = (duration + 5) * 1000;
        console.log(`设置自动播放定时器：${timeoutDuration / 1000}秒后播放下一首`);
        
        playTimerRef.current = window.setTimeout(() => {
          console.log("定时器触发，准备播放下一首");
          // 重置手动播放标记
          manualPlayRef.current = false;
          handlePlayNext();
        }, timeoutDuration);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("播放失败:", error);
      setError('无法加载视频，请稍后再试。');
      setLoading(false);
    }
  }, [allSongs, autoPlay, clearPlayTimer, currentSong, refreshIframe]);

  // 获取下一首歌曲逻辑
  const getNextSong = useCallback((): Song | null => {
    if (!currentSong) return null;
    
    // 对于单曲循环，返回当前歌曲
    if (playMode === PlayMode.LOOP) {
      console.log('单曲循环模式，返回当前歌曲');
      return currentSong;
    }
    
    // 对于随机播放，从过滤后的歌曲中随机选择
    if (playMode === PlayMode.RANDOM) {
      if (filteredSongs.length <= 1) return currentSong; // 只有一首歌曲时，返回当前歌曲
      
      // 避免重复随机到当前歌曲
      const availableSongs = filteredSongs.filter(song => song.bvid !== currentSong.bvid);
      if (availableSongs.length === 0) return filteredSongs[0];
      
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      const nextSong = availableSongs[randomIndex];
      console.log('随机播放模式，选择歌曲:', nextSong.originalTitle);
      return nextSong;
    }
    
    // 顺序播放 - 从当前歌曲在原始列表中的位置开始，查找下一首在过滤列表中的歌曲
    const originalIndex = originalIndexRef.current;
    console.log('顺序播放模式，当前索引:', originalIndex);
    
    // 从原始索引的下一首开始查找
    if (originalIndex >= 0 && originalIndex < allSongs.length - 1) {
      // 在原始全部歌曲中往后查找，直到找到一首也在过滤列表中的歌曲
      for (let i = originalIndex + 1; i < allSongs.length; i++) {
        const nextSong = allSongs[i];
        if (filteredSongs.some(song => song.bvid === nextSong.bvid)) {
          console.log('找到下一首歌曲:', nextSong.originalTitle);
          return nextSong;
        }
      }
    }
    
    // 如果没找到或已经是最后一首，则从头开始
    for (let i = 0; i < allSongs.length; i++) {
      const nextSong = allSongs[i];
      if (filteredSongs.some(song => song.bvid === nextSong.bvid)) {
        console.log('从头开始找到歌曲:', nextSong.originalTitle);
        return nextSong;
      }
    }
    
    // 如果过滤后没有歌曲，返回null
    console.log('没有找到可播放的歌曲');
    return null;
  }, [currentSong, playMode, filteredSongs, allSongs]);

  // 获取上一首歌曲逻辑
  const getPreviousSong = useCallback((): Song | null => {
    if (!currentSong) return null;
    
    // 单曲循环模式下返回当前歌曲
    if (playMode === PlayMode.LOOP) {
      return currentSong;
    }
    
    // 对于随机播放，也是按照顺序查找上一首
    const originalIndex = originalIndexRef.current;
    
    if (originalIndex > 0) {
      // 在原始全部歌曲中往前查找，直到找到一首也在过滤列表中的歌曲
      for (let i = originalIndex - 1; i >= 0; i--) {
        const prevSong = allSongs[i];
        if (filteredSongs.some(song => song.bvid === prevSong.bvid)) {
          console.log('找到上一首歌曲:', prevSong.originalTitle);
          return prevSong;
        }
      }
    }
    
    // 如果没找到，则从末尾开始
    for (let i = allSongs.length - 1; i >= 0; i--) {
      const prevSong = allSongs[i];
      if (filteredSongs.some(song => song.bvid === prevSong.bvid)) {
        console.log('从末尾找到上一首歌曲:', prevSong.originalTitle);
        return prevSong;
      }
    }
    
    return null;
  }, [currentSong, playMode, filteredSongs, allSongs]);

  // 自动播放下一首
  const handlePlayNext = useCallback(() => {
    if (!autoPlay && !manualPlayRef.current) {
      console.log('自动播放已关闭，且不是手动播放，跳过');
      return;
    }
    
    if (!currentSong) {
      console.log('当前没有播放歌曲，跳过');
      return;
    }
    
    const nextSong = getNextSong();
    if (nextSong) {
      console.log(`准备播放下一首: ${nextSong.originalTitle}, 手动模式: ${manualPlayRef.current}`);
      
      // 如果是单曲循环模式并且是同一首歌，需要刷新iframe
      if (playMode === PlayMode.LOOP && nextSong.bvid === currentSong.bvid) {
        console.log('单曲循环模式，刷新iframe重新播放当前歌曲');
        refreshIframe();
        
        // 重新设置定时器
        clearPlayTimer();
        const duration = parseInt(nextSong.duration) || 240;
        const timeoutDuration = (duration + 5) * 1000;
        
        playTimerRef.current = window.setTimeout(() => {
          // 自动模式，不标记为手动
          manualPlayRef.current = false;
          handlePlayNext();
        }, timeoutDuration);
      } else {
        console.log('播放下一首歌曲');
        playSong(nextSong);
      }
    } else {
      console.log('没有找到可播放的下一首歌曲');
    }
  }, [autoPlay, currentSong, getNextSong, playSong, playMode, refreshIframe, clearPlayTimer]);

  // 手动播放下一首
  const playNext = useCallback(() => {
    console.log('手动播放下一首');
    manualPlayRef.current = true; // 标记为手动播放
    const nextSong = getNextSong();
    if (nextSong) {
      playSong(nextSong);
    }
  }, [getNextSong, playSong]);

  // 手动播放上一首
  const playPrevious = useCallback(() => {
    console.log('手动播放上一首');
    manualPlayRef.current = true; // 标记为手动播放
    const prevSong = getPreviousSong();
    if (prevSong) {
      playSong(prevSong);
    }
  }, [getPreviousSong, playSong]);

  // 切换播放模式
  const togglePlayMode = useCallback(() => {
    setPlayMode(prevMode => {
      let newMode;
      if (prevMode === PlayMode.SEQUENTIAL) {
        newMode = PlayMode.RANDOM;
      } else if (prevMode === PlayMode.RANDOM) {
        newMode = PlayMode.LOOP;
      } else {
        newMode = PlayMode.SEQUENTIAL;
      }
      
      // 保存到localStorage
      try {
        localStorage.setItem('playMode', newMode);
        console.log('切换播放模式:', newMode);
        
        // 立即读取回来验证是否保存成功
        const savedValue = localStorage.getItem('playMode');
        console.log('验证播放模式是否保存成功:', savedValue);
      } catch (error) {
        console.error('保存播放模式失败:', error);
      }
      
      return newMode;
    });
  }, []);
  
  // 自定义设置自动播放的方法，以确保正确保存设置
  const setAutoPlayWithSave = useCallback((value: boolean) => {
    console.log('设置自动播放状态为:', value);
    setAutoPlay(value);
    
    // 直接保存到localStorage
    try {
      localStorage.setItem('autoPlay', String(value));
      
      // 立即读取回来验证是否保存成功
      const savedValue = localStorage.getItem('autoPlay');
      console.log('验证自动播放设置是否保存成功:', savedValue);
    } catch (error) {
      console.error('保存自动播放设置失败:', error);
    }
  }, []);

  // 格式化时间
  const formatTime = useCallback((seconds: string): string => {
    const totalSeconds = parseInt(seconds) || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // 获取播放模式文本
  const getPlayModeText = useCallback((): string => {
    switch (playMode) {
      case PlayMode.SEQUENTIAL: return "顺序播放";
      case PlayMode.RANDOM: return "随机播放";
      case PlayMode.LOOP: return "单曲循环";
      default: return "顺序播放";
    }
  }, [playMode]);

  return {
    currentSong,
    loading,
    error,
    autoPlay,
    playMode,
    iframeRef,
    iframeKey,
    playSong,
    playNext,
    playPrevious,
    togglePlayMode,
    setAutoPlay: setAutoPlayWithSave,
    formatTime,
    getPlayModeText
  };
}; 