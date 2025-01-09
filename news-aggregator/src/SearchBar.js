import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [category, setCategory] = useState('technology'); // Default category

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category) {
      onSearch(category); // Pass the selected category to the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="category">Choose a category:</label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="technology">Technology</option>
        <option value="sports">Sports</option>
        <option value="business">Business</option>
        <option value="health">Health</option>
        <option value="entertainment">Entertainment</option>
        <option value="science">Science</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
