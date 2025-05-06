import React from 'react';
import { PlayMode } from '../types';
import { FaHeart, FaRegHeart, FaRandom, FaRedo, FaForward } from 'react-icons/fa';

// 为Google AdSense添加类型声明
declare global {
  interface Window {
    adsbygoogle: Array<{[key: string]: unknown}>;
  }
}

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

  // 广告组件加载后插入脚本
  React.useEffect(() => {
    const adsScript = document.createElement('script');
    adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8113458408576939";
    adsScript.async = true;
    adsScript.crossOrigin = "anonymous";
    document.head.appendChild(adsScript);

    (window.adsbygoogle = window.adsbygoogle || []).push({});

    return () => {
      // 组件卸载时清理
      if (document.head.contains(adsScript)) {
        document.head.removeChild(adsScript);
      }
    };
  }, []);

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
      
      {/* 底部水平广告 */}
      <div className="horizontal-ad">
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-8113458408576939"
          data-ad-slot="1106366368"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </div>
    </div>
  );
}; 