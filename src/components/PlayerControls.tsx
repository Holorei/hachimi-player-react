import React from 'react';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';

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
      <button onClick={playPrevious} className="control-btn previous">
        <FaStepBackward />
      </button>
      <button onClick={playNext} className="control-btn next">
        <FaStepForward />
      </button>
    </div>
  );
}; 