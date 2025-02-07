'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // Use Next.js router
import styles from './Navbar.module.css';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Use router.replace to update the query and refresh the page
            router.replace(`/search?query=${encodeURIComponent(searchQuery)}`);
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
            </ul>
            <div className={styles.navRight}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key press
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
