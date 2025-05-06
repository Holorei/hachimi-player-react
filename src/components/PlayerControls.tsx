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
      <button onClick={playPrevious} className="control-btn previous" title="上一首">
        <FaStepBackward />
      </button>
      <button onClick={playNext} className="control-btn next" title="下一首">
        <FaStepForward />
      </button>
    </div>
  );
}; 