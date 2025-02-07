'use client';

import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log(`Searching for: ${searchQuery}`);
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>MovieHub</div>
            <ul className={styles.navLinks}>
                <li><a href="/">Home</a></li>
                <li><a href="/movies">Movies</a></li>
                <li><a href="/tv-shows">TV Shows</a></li>
                <li><a href="/favourites">Favourites</a></li>
            </ul>
            <div className={styles.navRight}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
