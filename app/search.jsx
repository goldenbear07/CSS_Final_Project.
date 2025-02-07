'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_KEY = '51372fec0f0d192195fa00d7602b7900';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  // Load search history from localStorage on initial load
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(storedHistory);
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (query) {
      // Fetch search results from API
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results || []));
    }
  }, [query]);

  return (
    <div className="popular-movies">
      <h1 className="popular-movies h2">Search Results for "{query}"</h1>

      {/* Display Recent Search History */}
      <div>
        <h2>Recent Searches</h2>
        {history.length > 0 ? (
          <ul>
            {history.map((search, index) => (
              <li key={index}>{search}</li>
            ))}
          </ul>
        ) : (
          <p>No recent searches.</p>
        )}
      </div>

      {/* Display Search Results */}
      <div className="movies-grid">
        {results.length > 0 ? (
          results.map((item) => (
            <div key={item.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="poster"
              />
              <h3>{item.title || item.name}</h3>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

