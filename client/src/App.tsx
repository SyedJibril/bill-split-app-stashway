// Define TypeScript interfaces for API responses
interface ShareResponse {
  shareId: string;
}

interface Bill {
  shareId: string;
  totalAmount: string;
  participants: ParticipantData[];
  amountPerPerson: Record<string, number> | null;
}

import { useState, useEffect } from "react";
import "./App.css";
import ParticipantList from "./components/ParticipantList";
import type { ParticipantData } from "./components/ParticipantList";

function App() {
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [amountPerPerson, setAmountPerPerson] = useState<Record<
    string,
    number
  > | null>(null);

  // Participant state
  const [participants, setParticipants] = useState<ParticipantData[]>([
    { id: "1", name: "User 1", ratio: 1 },
    { id: "2", name: "USer 2", ratio: 1 },
  ]);

  // Add states for share functionality
  const [shareId, setShareId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Generate a unique ID for new participants
  const generateId = () => {
    return Date.now().toString();
  };

  // Add a new participant
  const handleAddParticipant = () => {
    const newId = generateId();
    setParticipants([
      ...participants,
      { id: newId, name: `Person ${participants.length + 1}`, ratio: 1 },
    ]);
  };

  // Remove a participant
  const handleRemoveParticipant = (id: string) => {
    if (participants.length <= 2) {
      setError("You need at least 2 participants");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setParticipants(participants.filter((p) => p.id !== id));
  };

  // Update participant name
  const handleParticipantNameChange = (id: string, name: string) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  // Update participant ratio
  const handleParticipantRatioChange = (id: string, ratio: number) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, ratio } : p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(totalAmount);

    if (isNaN(total) || total <= 0) {
      setError("Please enter a valid amount");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Calculate the total ratio sum
    const totalRatio = participants.reduce((sum, p) => sum + p.ratio, 0);

    // Calculate amount per person based on their ratio
    const amounts: Record<string, number> = {};
    participants.forEach((p) => {
      amounts[p.id] = (p.ratio / totalRatio) * total;
    });

    setAmountPerPerson(amounts);
  };

  const handleShare = async () => {
    // Reset states
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/bills/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalAmount,
          participants,
          amountPerPerson,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: ShareResponse = await response.json();
      setShareId(data.shareId);

      // Create share URL
      const newShareUrl = `http://localhost:5000/api/bills/${data.shareId}`;
      setShareUrl(newShareUrl);
      setSuccessMessage("Bill shared successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share bill");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setSuccessMessage("Link copied to clipboard!");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Bill Splitter</h1>
      <form onSubmit={handleSubmit} className="bill-form">
        <div className="form-group">
          <label htmlFor="totalAmount">Total Bill Amount ($)</label>
          <input
            id="totalAmount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="Enter total amount"
            type="number"
            min={0}
            step="0.01"
          />
        </div>

        <ParticipantList
          participants={participants}
          onAddParticipant={handleAddParticipant}
          onRemoveParticipant={handleRemoveParticipant}
          onParticipantNameChange={handleParticipantNameChange}
          onParticipantRatioChange={handleParticipantRatioChange}
        />

        <button type="submit" className="submit-button">
          Split Bill
        </button>
      </form>
      <div className="result">
        <h2>Amount per person:</h2>
        {amountPerPerson && (
          <div className="amounts-list">
            {participants.map((p) => (
              <div key={p.id} className="person-amount">
                <span className="person-name">{p.name}:</span>
                <span className="amount">
                  ${amountPerPerson[p.id]?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Show loading state during API call */}
        <button
          onClick={handleShare}
          className="share-button"
          disabled={isLoading || !amountPerPerson}
        >
          {isLoading ? "Sharing..." : "Share Bill"}
        </button>

        {/* Show error message if there's an error */}
        {error && <p className="error-message">{error}</p>}

        {/* Show success message */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Show share link if available */}
        {shareUrl && (
          <div className="share-link">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="share-input"
              aria-label="Share URL"
              placeholder="Share URL"
            />
            <button onClick={copyToClipboard} className="copy-button">
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
