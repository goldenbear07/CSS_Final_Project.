'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_KEY = '51372fec0f0d192195fa00d7602b7900';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setResults([]); // Reset results on new search
    setCurrentPage(1); // Reset page to 1
  }, [query]);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&page=${currentPage}`)
        .then((res) => res.json())
        .then((data) => {
          setResults((prevResults) => currentPage === 1 ? data.results : [...prevResults, ...data.results]);
          setTotalPages(data.total_pages);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
    }
  }, [query, currentPage]);

  const loadMoreResults = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Navigate to the movie details page with a dynamic route
  const handleMovieClick = (id) => {
    router.push(`/movieDetails/${id}`);
  };

  return (
    <div className="popular-movies">
      <h2 className="popular-movies">Search Results for "{query}"</h2>
      <div className="search-results-grid">
        {isLoading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          results.map((item) => (
            <div 
              key={item.id} 
              className="search-card" 
              onClick={() => handleMovieClick(item.id)} // Navigate on click
              style={{ cursor: 'pointer' }}
            >
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
      {currentPage < totalPages && !isLoading && (
        <button onClick={loadMoreResults}>Load More</button>
      )}
    </div>
  );
};

export default SearchPage;
