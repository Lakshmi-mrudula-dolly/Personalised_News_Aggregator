import React, { useState } from 'react';

const Preferences = ({ email }) => {
    const [sentiment, setSentiment] = useState("POSITIVE");

    const savePreferences = async () => {
        await fetch('http://localhost:9000/user/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                sentiment_preference: sentiment,
                liked_articles: [],
                disliked_articles: []
            })
        });
        alert("Preferences saved successfully!");
    };

    return (
        <div>
            <h2>Set Preferences</h2>
            <label>Sentiment Preference:</label>
            <select value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
                <option value="POSITIVE">Positive</option>
                <option value="NEGATIVE">Negative</option>
            </select>
            <button onClick={savePreferences}>Save Preferences</button>
        </div>
    );
};

export default Preferences;
