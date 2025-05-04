import { useState, useEffect, useRef } from 'react';
import songListData from '../assets/songList.json';
import './MusicPlayer.css';

interface Song {
  bvid: string;
  author: string;
  originalTitle: string;
  videoTitle: string;
  Duration: string;  // 持续时间（秒）
}

// 播放模式枚举
enum PlayMode {
  SEQUENTIAL = 'sequential',  // 顺序播放
  RANDOM = 'random'          // 随机播放
}

const MusicPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoPlay, setAutoPlay] = useState(true);
  const [playMode, setPlayMode] = useState<PlayMode>(PlayMode.SEQUENTIAL);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // 加载歌曲列表
    setSongs(songListData);
    setFilteredSongs(songListData);
  }, []);

  // 搜索功能
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs(songs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = songs.filter(
        song => 
          song.originalTitle.toLowerCase().includes(query) || 
          song.videoTitle.toLowerCase().includes(query) || 
          song.author.toLowerCase().includes(query) ||
          song.bvid.toLowerCase().includes(query)
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songs]);

  const playSong = async (song: Song) => {
    try {
      // 清除之前的定时器
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
      
      setLoading(true);
      setError(null);
      setCurrentSong(song);
      
      // 设置自动播放定时器
      if (autoPlay) {
        const duration = parseInt(song.Duration) || 240; // 默认4分钟
        const timeoutDuration = (duration + 5) * 1000; // 加5秒缓冲
        console.log(`设置自动播放定时器：${timeoutDuration / 1000}秒后播放下一首`);
        
        playTimerRef.current = window.setTimeout(() => {
          handleVideoEnded();
        }, timeoutDuration);
      }
      
      setLoading(false);
    } catch {
      setError('无法加载视频，请稍后再试。');
      setLoading(false);
    }
  };

  // 获取下一首歌曲
  const getNextSong = (): Song | null => {
    if (!currentSong || filteredSongs.length === 0) return null;
    
    if (playMode === PlayMode.RANDOM) {
      // 随机模式：随机选择一首（不是当前歌曲）
      const availableSongs = filteredSongs.filter(song => song.bvid !== currentSong.bvid);
      if (availableSongs.length === 0) return filteredSongs[0];
      
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      return availableSongs[randomIndex];
    } else {
      // 顺序模式：播放下一首
      const currentIndex = filteredSongs.findIndex(song => song.bvid === currentSong.bvid);
      if (currentIndex === -1) return filteredSongs[0];
      
      if (currentIndex < filteredSongs.length - 1) {
        return filteredSongs[currentIndex + 1];
      } else {
        // 到达列表末尾，从头开始
        return filteredSongs[0];
      }
    }
  };

  // 处理自动播放下一首
  const handleVideoEnded = () => {
    if (autoPlay && currentSong) {
      const nextSong = getNextSong();
      if (nextSong) {
        console.log(`准备播放下一首: ${nextSong.originalTitle}`);
        playSong(nextSong);
      }
    }
  };

  // 切换播放模式
  const togglePlayMode = () => {
    setPlayMode(prevMode => 
      prevMode === PlayMode.SEQUENTIAL ? PlayMode.RANDOM : PlayMode.SEQUENTIAL
    );
  };

  // 手动播放下一首
  const playNext = () => {
    const nextSong = getNextSong();
    if (nextSong) {
      playSong(nextSong);
    }
  };

  // 手动播放上一首
  const playPrevious = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    
    const currentIndex = filteredSongs.findIndex(song => song.bvid === currentSong.bvid);
    if (currentIndex === -1) return;
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = filteredSongs.length - 1; // 循环到列表末尾
    }
    
    playSong(filteredSongs[prevIndex]);
  };

  // 当自动播放或播放模式状态更改时，更新定时器
  useEffect(() => {
    // 如果关闭了自动播放，清除定时器
    if (!autoPlay && playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
    
    // 组件卸载时清除定时器
    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
    };
  }, [autoPlay, playMode]);

  // 格式化时间
  const formatTime = (seconds: string): string => {
    const totalSeconds = parseInt(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player">
      <div className="search-container">
        <input
          type="text"
          placeholder="搜索歌曲、作者或BV号..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="player-controls-top">
          <div className="auto-play-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={autoPlay} 
                onChange={() => setAutoPlay(!autoPlay)} 
              />
              <span>自动播放下一首</span>
            </label>
          </div>
          <button 
            className={`play-mode-btn ${playMode === PlayMode.RANDOM ? 'random' : ''}`}
            onClick={togglePlayMode}
            title={playMode === PlayMode.SEQUENTIAL ? "顺序播放" : "随机播放"}
          >
            {playMode === PlayMode.SEQUENTIAL ? "顺序播放" : "随机播放"}
          </button>
        </div>
      </div>

      <div className="song-list">
        <h2>哔哩哔哩歌曲列表</h2>
        {filteredSongs.length === 0 ? (
          <p className="no-results">没有找到匹配的歌曲</p>
        ) : (
          <ul>
            {filteredSongs.map((song, index) => (
              <li key={index} onClick={() => playSong(song)}>
                <div className={`song-item ${currentSong?.bvid === song.bvid ? 'active' : ''}`}>
                  <div className="song-title">
                    {song.originalTitle}
                    <span className="video-title">（{song.videoTitle}）</span>
                  </div>
                  <div className="song-info">
                    <span className="song-author">{song.author}</span>
                    <div className="song-details">
                      <span className="song-duration">{formatTime(song.Duration)}</span>
                      <span className="song-bv">{song.bvid}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="player-container">
        {currentSong && (
          <div className="now-playing">
            <h3>当前播放: {currentSong.originalTitle}</h3>
            <p>{currentSong.videoTitle}</p>
            <p>作者: {currentSong.author}</p>
            <p>时长: {formatTime(currentSong.Duration)}</p>
            
            <div className="playback-controls">
              <button onClick={playPrevious} className="control-btn previous">上一首</button>
              <button onClick={playNext} className="control-btn next">下一首</button>
            </div>
            
            {loading && <p>加载中...</p>}
            {error && <p className="error">{error}</p>}
            
            {currentSong && !error && (
              <div className="bilibili-player">
                <iframe 
                  ref={iframeRef}
                  src={`https://player.bilibili.com/player.html?bvid=${currentSong.bvid}&page=1&high_quality=1&danmaku=1&autoplay=1`}
                  scrolling="no"
                  frameBorder="0" 
                  allowFullScreen 
                  title={currentSong.originalTitle}
                ></iframe>
                <div className="player-info">
                  <p className="player-note">
                    音频播放由哔哩哔哩提供
                  </p>
                  {autoPlay && (
                    <p className="auto-play-note">
                      将在{formatTime(currentSong.Duration)}后自动播放
                      {playMode === PlayMode.RANDOM ? "随机" : "下一首"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer; 