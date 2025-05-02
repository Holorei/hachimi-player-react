import { useState, useEffect, useRef } from 'react';
import songListData from '../assets/songList.json';
import './MusicPlayer.css';

interface Song {
  bvid: string;
  author: string;
  originalTitle: string;
  videoTitle: string;
}

const MusicPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoPlay, setAutoPlay] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const checkIntervalRef = useRef<number | null>(null);

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
      setLoading(true);
      setError(null);
      setCurrentSong(song);
      setLoading(false);
    } catch {
      setError('无法加载视频，请稍后再试。');
      setLoading(false);
    }
  };

  // 处理自动播放下一首
  const handleVideoEnded = () => {
    if (autoPlay && currentSong) {
      const currentIndex = filteredSongs.findIndex(song => song.bvid === currentSong.bvid);
      if (currentIndex > -1 && currentIndex < filteredSongs.length - 1) {
        // 播放下一首
        playSong(filteredSongs[currentIndex + 1]);
      } else if (filteredSongs.length > 0) {
        // 如果是最后一首，则从头开始播放
        playSong(filteredSongs[0]);
      }
    }
  };

  // 检查是否出现了重播按钮
  const checkForReplayButton = () => {
    if (!iframeRef.current || !autoPlay) return;

    try {
      const iframeDocument = iframeRef.current.contentDocument || 
                             (iframeRef.current.contentWindow?.document);
      
      if (iframeDocument) {
        // 查找重播按钮
        const replayButton = iframeDocument.querySelector('.bpx-player-replay');
        
        if (replayButton) {
          console.log('检测到视频结束，准备播放下一首');
          handleVideoEnded();
          
          // 清除之前的检查定时器
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error('无法访问iframe内容，可能是跨域限制:', error);
    }
  };

  // 当视频加载或自动播放状态更改时设置检查重播按钮的定时器
  useEffect(() => {
    // 清除任何现有的定时器
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    if (currentSong && autoPlay) {
      // 每秒检查一次是否出现了重播按钮
      checkIntervalRef.current = window.setInterval(checkForReplayButton, 1000);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [currentSong, autoPlay]);

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
                    <span className="song-bv">{song.bvid}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="player-controls">
        {currentSong && (
          <div className="now-playing">
            <h3>当前播放: {currentSong.originalTitle}</h3>
            <p>{currentSong.videoTitle}</p>
            <p>作者: {currentSong.author}</p>
            
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
                <p className="player-note">
                  音频播放由哔哩哔哩提供
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer; 