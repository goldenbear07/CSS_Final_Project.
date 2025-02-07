'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js router for navigation
import styles from './SearchHistory.module.css';

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const router = useRouter(); // To navigate to the search page

  // Load search history from localStorage on page load
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(storedHistory.slice(0, 10)); // Get the last 10 searches
  }, []);

  // Handle deleting a search from history
  const handleDelete = (searchQuery) => {
    const updatedHistory = history.filter((search) => search !== searchQuery);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory); // Update the state to re-render the UI
  };

  // Handle clearing all search history
  const handleClearAll = () => {
    localStorage.removeItem('searchHistory'); // Remove all search history from localStorage
    setHistory([]); // Clear the history in the state to reflect the UI update
  };

  // Handle clicking on a search entry
  const handleSearchClick = (searchQuery) => {
    // Populate the search bar with the clicked query
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`); // Redirect to search results
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Search History</h1>

      {/* Clear All Button */}
      {history.length > 0 && (
        <button className={styles.clearAllButton} onClick={handleClearAll}>
          Clear All
        </button>
      )}

      {history.length > 0 ? (
        <ul className={styles.historyList}>
          {history.map((search, index) => (
            <li key={index} className={styles.historyItem}>
              <span 
                className={styles.historyText} 
                onClick={() => handleSearchClick(search)} // Handle click to populate and navigate
              >
                {search}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(search)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No search history found.</p>
      )}
    </div>
  );
};

export default SearchHistory;


