"use client";

import React, { useEffect, useState } from "react";
import Movie from "./api/movieData";
import TV from "./api/tvData";
import useSWR from "swr";
import "./globals.css"; // Import your CSS

const API_KEY = "51372fec0f0d192195fa00d7602b7900";

// Fetch movie data
const fetcher = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

// Fetch trailer for a specific movie
const fetchTrailer = async (movieId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  const trailer = data.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

const Page = () => {
  const { data, error, isLoading } = useSWR("movieData", fetcher);
  const [trailerLink, setTrailerLink] = useState(null);

  const featuredMovie = data?.results?.[0] || null;

  // Always call hooks in the same order
  useEffect(() => {
    const getTrailer = async () => {
      if (featuredMovie) {
        const trailer = await fetchTrailer(featuredMovie.id);
        setTrailerLink(trailer);
      } else {
        setTrailerLink(null); // Ensure state consistency
      }
    };
    getTrailer();
  }, [featuredMovie]);

  if (error) return <p className="error">Failed to load movies.</p>;
  if (isLoading) return <p className="loading">Loading movies...</p>;

  return (
    <div>
      {/* Featured Movie Section */}
      {featuredMovie && (
        <section
          className="featured-movie"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          <div className="movie-details">
            <h1>{featuredMovie.title}</h1>
            <p>{featuredMovie.overview}</p>
            {trailerLink ? (
              <a
                href={trailerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-trailer"
              >
                Watch Trailer
              </a>
            ) : (
              <button className="watch-trailer disabled" disabled>
                Trailer Not Available
              </button>
            )}
          </div>
        </section>
      )}

      {/* Popular Movies Section */}
      <section className="popular-movies">
        <h2>Popular Movies</h2>
        <Movie />
      </section>

      {/* Popular TV Shows Section */}
      <section className="popular-tv">
        <h2>Popular TV Shows</h2>
        <TV />
      </section>
    </div>
  );
};

export default Page;
