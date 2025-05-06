import React, { useRef } from 'react';
import { Song } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { FaFileExport, FaFileImport } from 'react-icons/fa';

interface SongListProps {
  filteredSongs: Song[];
  currentSong: Song | null;
  playSong: (song: Song) => void;
  showFavorites: boolean;
  favorites: string[];
  toggleFavorite: (e: React.MouseEvent, bvid: string) => void;
  formatTime: (seconds: string) => string;
  exportFavorites: () => void;
  importFavorites: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SongList: React.FC<SongListProps> = ({
  filteredSongs,
  currentSong,
  playSong,
  showFavorites,
  favorites,
  toggleFavorite,
  formatTime,
  exportFavorites,
  importFavorites
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="song-list">
      <div className="song-list-header">
        <h2>歌曲列表 {showFavorites && "(收藏)"}</h2>
        
        {showFavorites && (
          <div className="favorite-actions">
            <button 
              className="favorite-action-btn export-btn" 
              onClick={exportFavorites}
              title="导出收藏列表"
            >
              <FaFileExport />
              <span>导出</span>
            </button>
            <button 
              className="favorite-action-btn import-btn" 
              onClick={handleImportClick}
              title="导入收藏列表"
            >
              <FaFileImport />
              <span>导入</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".json"
              onChange={importFavorites}
            />
          </div>
        )}
      </div>
      
      {filteredSongs.length === 0 ? (
        <p className="no-results">
          {showFavorites ? "没有收藏的歌曲" : "没有找到匹配的歌曲"}
        </p>
      ) : (
        <ul>
          {filteredSongs.map((song, index) => (
            <li key={index} onClick={() => playSong(song)}>
              <div className={`song-item ${currentSong?.bvid === song.bvid ? 'active' : ''}`}>
                <div className="song-title-container">
                  <FavoriteButton 
                    isFavorite={favorites.includes(song.bvid)}
                    onClick={(e: React.MouseEvent) => toggleFavorite(e, song.bvid)}
                    size="small"
                  />
                  <div className="song-title">
                    {song.originalTitle}
                    <span className="video-title">（{song.videoTitle}）</span>
                  </div>
                </div>
                <div className="song-info">
                  <span className="song-author">{song.author}</span>
                  <div className="song-details">
                    <span className="song-duration">{formatTime(song.duration)}</span>
                    <span className="song-bv">{song.bvid}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 