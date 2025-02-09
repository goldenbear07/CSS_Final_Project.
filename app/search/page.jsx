"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const API_KEY = "51372fec0f0d192195fa00d7602b7900";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setResults([]);
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query, currentPage]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&page=${currentPage}`
      );
      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        setResults((prevResults) => [...prevResults, ...data.results]);
        setTotalPages(data.total_pages || 1);
      } else {
        console.error("Invalid API response:", data);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;

    if (
      scrollPosition >= documentHeight - 200 &&
      !isLoading &&
      currentPage < totalPages
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, currentPage, totalPages]);

  const handleMovieClick = (item) => {
    if (item.media_type === "movie") {
      router.push(`/movieDetails/${item.id}`);
    } else if (item.media_type === "tv") {
      router.push(`/tvDetails/${item.id}`);
    } else {
      console.error("Unknown media type:", item);
    }
  };

  return (
    <div className="popular-movies">
      <h2>Search Results for "{query}"</h2>
      <div className="search-results-grid">
        {results.length > 0 ? (
          results
            .filter((item) => item.poster_path && (item.title || item.name)) // Filter empty items
            .map((item, index) => (
              <div
                key={`${item.id}-${index}`} // Ensure unique keys
                className="search-card"
                onClick={() => handleMovieClick(item)} // Pass the whole item
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="poster"
                />
                <h3>{item.title || item.name}</h3>
                <p>⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"} / 10</p>
              </div>
            ))
        ) : (
          <p>{isLoading ? "Loading..." : "No results found."}</p>
        )}
      </div>
      {isLoading && <p>Loading more results...</p>}
    </div>
  );
};

export default SearchPage;
