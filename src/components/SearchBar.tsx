import React from 'react';
import { PlayMode } from '../types';

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
            className={`favorite-filter-btn ${showFavorites ? 'active' : ''}`}
            onClick={toggleShowFavorites}
            title={showFavorites ? "显示全部歌曲" : "只显示红心歌曲"}
          >
            {showFavorites ? "❤️ 收藏列表" : "🤍 全部歌曲"}
          </button>
        </div>
        
        <button 
          className={`play-mode-btn mode-${playMode}`}
          onClick={togglePlayMode}
          title={getPlayModeText()}
        >
          {getPlayModeText()}
        </button>
      </div>
    </div>
  );
}; 