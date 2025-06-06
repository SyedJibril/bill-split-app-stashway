import React from "react";
import Participant from "./Participant";

export interface ParticipantData {
  id: string;
  name: string;
  ratio: number;
}

interface ParticipantListProps {
  participants: ParticipantData[];
  onAddParticipant: () => void;
  onRemoveParticipant: (id: string) => void;
  onParticipantNameChange: (id: string, name: string) => void;
  onParticipantRatioChange: (id: string, ratio: number) => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onParticipantNameChange,
  onParticipantRatioChange,
}) => {
  return (
    <div className="participants-container">
      <h3>Users List</h3>
      <div className="participants-list">
        {participants.map((participant) => (
          <Participant
            key={participant.id}
            id={participant.id}
            name={participant.name}
            ratio={participant.ratio}
            onNameChange={onParticipantNameChange}
            onRatioChange={onParticipantRatioChange}
            onRemove={onRemoveParticipant}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onAddParticipant}
        className="add-participant-button"
      >
        Add Participant
      </button>
    </div>
  );
};

export default ParticipantList;
