import React from "react";

interface ParticipantProps {
  id: string;
  name: string;
  ratio: number;
  onNameChange: (id: string, name: string) => void;
  onRatioChange: (id: string, ratio: number) => void;
  onRemove: (id: string) => void;
}

const Participant: React.FC<ParticipantProps> = ({
  id,
  name,
  ratio,
  onNameChange,
  onRatioChange,
  onRemove,
}) => {
  return (
    <div className="participant">
      <div className="participant-inputs">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          placeholder="Name"
          className="participant-name"
        />
        <input
          type="number"
          min="1"
          value={ratio}
          onChange={(e) => onRatioChange(id, parseInt(e.target.value) || 1)}
          placeholder="Ratio"
          className="participant-ratio"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="remove-participant"
      >
        &times;
      </button>
    </div>
  );
};

export default Participant;
