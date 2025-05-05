import React from 'react';

interface PlayerControlsProps {
  playPrevious: () => void;
  playNext: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  playPrevious,
  playNext
}) => {
  return (
    <div className="playback-controls">
      <button onClick={playPrevious} className="control-btn">上一首</button>
      <button onClick={playNext} className="control-btn">下一首</button>
    </div>
  );
}; 