import React from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'small' | 'large';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onClick,
  size = 'small'
}) => {
  return (
    <button 
      className={`favorite-btn ${isFavorite ? 'favorited' : ''} ${size === 'large' ? 'large' : ''}`}
      onClick={onClick}
      title={isFavorite ? "取消收藏" : "收藏歌曲"}
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
}; 