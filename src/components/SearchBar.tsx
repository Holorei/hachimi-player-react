import React from 'react';
import { PlayMode } from '../types';
import { FaHeart, FaRegHeart, FaRandom, FaRedo, FaForward, FaPlay, FaPause } from 'react-icons/fa';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  playMode: PlayMode;
  togglePlayMode: () => void;
  showFavorites: boolean;
  toggleShowFavorites: () => void;
  getPlayModeText: () => string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  autoPlay,
  setAutoPlay,
  playMode,
  togglePlayMode,
  showFavorites,
  toggleShowFavorites,
  getPlayModeText
}) => {
  // 根据播放模式获取图标
  const getPlayModeIcon = () => {
    switch (playMode) {
      case PlayMode.SEQUENTIAL:
        return <FaForward />;
      case PlayMode.LOOP:
        return <FaRedo />;
      case PlayMode.RANDOM:
        return <FaRandom />;
      default:
        return <FaForward />;
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="搜索歌曲、作者或BV号..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <div className="player-controls-top">
        <div className="control-group">
          <button 
            className={`auto-play-btn ${autoPlay ? 'active' : ''}`}
            onClick={() => setAutoPlay(!autoPlay)}
            title={autoPlay ? "暂停播放" : "自动播放"}
          >
            {autoPlay ? <FaPause /> : <FaPlay />}
            <span>{autoPlay ? " 暂停播放" : " 自动播放"}</span>
          </button>
          <button 
            className={`favorite-filter-btn ${showFavorites ? 'active' : ''}`}
            onClick={toggleShowFavorites}
            title={showFavorites ? "显示全部歌曲" : "只显示红心歌曲"}
          >
            {showFavorites ? <FaHeart /> : <FaRegHeart />}
            <span>{showFavorites ? " 收藏列表" : " 全部歌曲"}</span>
          </button>
          <button 
            className={`play-mode-btn mode-${playMode}`}
            onClick={togglePlayMode}
            title={getPlayModeText()}
          >
            {getPlayModeIcon()}
            <span> {getPlayModeText()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 