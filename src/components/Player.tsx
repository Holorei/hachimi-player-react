import React, { useEffect, useRef } from 'react';
import { Song, PlayMode } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { PlayerControls } from './PlayerControls';

interface PlayerProps {
  currentSong: Song | null;
  loading: boolean;
  error: string | null;
  autoPlay: boolean;
  playMode: PlayMode;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  iframeKey: number;
  isFavorite: boolean;
  toggleFavorite: (e: React.MouseEvent) => void;
  playPrevious: () => void;
  playNext: () => void;
  formatTime: (seconds: string) => string;
}

export const Player: React.FC<PlayerProps> = ({
  currentSong,
  loading,
  error,
  autoPlay,
  playMode,
  iframeRef,
  iframeKey,
  isFavorite,
  toggleFavorite,
  playPrevious,
  playNext,
  formatTime
}) => {
  // 使用一个引用来追踪iframe是否已经加载过
  const hasLoadedRef = useRef(false);

  // 在iframe加载完成后尝试修复声音问题
  const handleIframeLoad = () => {
    // 确保iframe存在
    if (iframeRef.current) {
      console.log('iframe加载完成，尝试修复声音问题');
      
      // 尝试与iframe通信
      try {
        // 重置hasLoaded标志
        hasLoadedRef.current = true;
        
        // 一些网站会在iframe加载后自动静音，我们添加一个延迟取消静音的操作
        setTimeout(() => {
          try {
            // 尝试通过iframe的contentWindow发送消息来取消静音
            if (iframeRef.current && iframeRef.current.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                { cmd: 'unmute', volume: 1 }, 
                '*'
              );
              console.log('向iframe发送取消静音消息');
            }
          } catch (e) {
            console.error('尝试取消静音失败:', e);
          }
        }, 1000);
      } catch (e) {
        console.error('与iframe通信失败:', e);
      }
    }
  };

  // 监听来自iframe的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 处理可能来自iframe的消息
      if (event.data && event.data.cmd === 'player_ready') {
        console.log('收到播放器就绪消息');
        // 播放器就绪后发送取消静音消息
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { cmd: 'unmute', volume: 1 }, 
            '*'
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [iframeRef]);

  if (!currentSong) return null;

  return (
    <div className="player-container">
      <div className="now-playing">
                
      <PlayerControls
          playPrevious={playPrevious}
          playNext={playNext}
        />
        <h3>当前播放: {currentSong.originalTitle}</h3>
        <p>{currentSong.videoTitle}</p>
        <div className="now-playing-info">
          <p>作者: {currentSong.author}</p>
          <p>时长: {formatTime(currentSong.duration)}</p>
          <FavoriteButton 
            isFavorite={isFavorite}
            onClick={toggleFavorite}
            size="large"
          />
        </div>

        
        {loading && <p>加载中...</p>}
        {error && <p className="error">{error}</p>}
        
        {currentSong && !error && (
          <div className="bilibili-player">
            <iframe 
              key={iframeKey}
              ref={iframeRef as React.RefObject<HTMLIFrameElement>}
              src={`https://player.bilibili.com/player.html?bvid=${currentSong.bvid}&page=1&high_quality=1&danmaku=1&autoplay=1&mute=0&as_wide=1`}
              scrolling="no"
              frameBorder="0" 
              allowFullScreen
              allow="autoplay"
              onLoad={handleIframeLoad}
              title={currentSong.originalTitle}
            ></iframe>
            <div className="player-info">
              <p className="player-note">
                音频播放由哔哩哔哩提供
              </p>
              {autoPlay && (
                <p className="auto-play-note">
                  将在{formatTime(currentSong.duration)}后
                  {playMode === PlayMode.LOOP 
                    ? "重新播放此歌曲" 
                    : playMode === PlayMode.RANDOM 
                      ? "随机播放下一首" 
                      : "播放下一首"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 