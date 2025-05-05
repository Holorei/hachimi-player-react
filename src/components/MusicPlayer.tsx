import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';
import { useSongs } from '../hooks/useSongs';
import { usePlayer } from '../hooks/usePlayer';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { SongList } from './SongList';
import { Player } from './Player';
import '../styles/index.css';

const MusicPlayer: React.FC = () => {
  // 使用自定义钩子管理状态和逻辑
  const { theme, toggleTheme } = useTheme();
  const { favorites, showFavorites, toggleFavorite, toggleShowFavorites, isFavorite } = useFavorites();
  const { songs, filteredSongs, searchQuery, setSearchQuery } = useSongs(favorites, showFavorites);
  const {
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
    setAutoPlay,
    formatTime,
    getPlayModeText
  } = usePlayer(songs, filteredSongs);

  // 处理收藏按钮点击
  const handleToggleFavorite = (e: React.MouseEvent, bvid: string) => {
    e.stopPropagation();
    toggleFavorite(bvid);
  };

  // 处理当前播放歌曲的收藏按钮点击
  const handleCurrentSongFavorite = (e: React.MouseEvent) => {
    if (currentSong) {
      handleToggleFavorite(e, currentSong.bvid);
    }
  };

  return (
    <div className={`music-player ${theme}`}>
      <div className="player-header">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        playMode={playMode}
        togglePlayMode={togglePlayMode}
        showFavorites={showFavorites}
        toggleShowFavorites={toggleShowFavorites}
        getPlayModeText={getPlayModeText}
      />
      
      <div className="player-content">
        <div className="content-left">
          <SongList 
            filteredSongs={filteredSongs}
            currentSong={currentSong}
            playSong={playSong}
            showFavorites={showFavorites}
            favorites={favorites}
            toggleFavorite={handleToggleFavorite}
            formatTime={formatTime}
          />
        </div>
        
        <div className="content-right">
          {currentSong ? (
            <Player 
              currentSong={currentSong}
              loading={loading}
              error={error}
              autoPlay={autoPlay}
              playMode={playMode}
              iframeRef={iframeRef}
              iframeKey={iframeKey}
              isFavorite={currentSong ? isFavorite(currentSong.bvid) : false}
              toggleFavorite={handleCurrentSongFavorite}
              playPrevious={playPrevious}
              playNext={playNext}
              formatTime={formatTime}
            />
          ) : (
            <div className="no-song-selected">
              <h3>未选择歌曲</h3>
              <p>从左侧列表选择一首歌曲开始播放</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 