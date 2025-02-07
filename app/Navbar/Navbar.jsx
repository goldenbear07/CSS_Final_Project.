'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Save to localStorage
      const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
      if (!storedHistory.includes(searchQuery)) {
        storedHistory.unshift(searchQuery); // Add to the beginning
        if (storedHistory.length > 5) storedHistory.pop(); // Limit to the last 5 searches
        localStorage.setItem('searchHistory', JSON.stringify(storedHistory));
      }
      // Navigate to search page
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>MovieHub</div>
      <ul className={styles.navLinks}>
        <li><a href="/">Home</a></li>
        <li><a href="/Movies">Movies</a></li>
        <li><a href="/Shows">TV Shows</a></li>
        <li><a href="/favourites">Favourites</a></li>
        <li><a href="/search-history">Search History</a></li> {/* New link */}
      </ul>
      <div className={styles.navRight}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Allow Enter key
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
        <FaUserCircle className={styles.profileIcon} />
      </div>
    </nav>
  );
};

export default Navbar;


