'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_KEY = '51372fec0f0d192195fa00d7602b7900';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query'); // Get the search query from URL
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);  // Loading state

  // Effect to fetch search results based on query and currentPage
  useEffect(() => {
    if (query) {
      setIsLoading(true);  // Start loading
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&page=${currentPage}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(currentPage === 1 ? data.results : [...results, ...data.results]); // Reset if it's the first page
          setTotalPages(data.total_pages);
          setIsLoading(false);  // Stop loading after data is fetched
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setIsLoading(false);  // Stop loading on error
        });
    }
  }, [query, currentPage]); // Trigger when query or currentPage changes

  const loadMoreResults = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1); // Increment page number
    }
  };

  return (
    <div className="popular-movies">
      <h2 className="popular-movies">Search Results for "{query}"</h2>
      <div className="search-results-grid"> {/* Updated class for grid layout */}
        {isLoading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          results.map((item) => (
            <div key={item.id} className="search-card"> {/* Updated class for each movie card */}
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="poster"
              />
              <h3>{item.title || item.name}</h3>
              <p>⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'} / 10</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
      {/* Only show the "Load More" button if there are more pages to load */}
      {currentPage < totalPages && !isLoading && (
        <button onClick={loadMoreResults}>Load More</button>
      )}
    </div>
  );
};

export default SearchPage;

