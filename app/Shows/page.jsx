"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link"; // Import Link for navigation
import styles from "../globals.css";

// Fetcher for Movies by Genre
const fetcherByGenre = async (genreId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=51372fec0f0d192195fa00d7602b7900&with_genres=${genreId}`
  );
  const data = await response.json();
  return data;
};

// Fetcher for Movie Genres
const fetchGenres = async () => {
  const response = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=51372fec0f0d192195fa00d7602b7900"
  );
  const data = await response.json();
  return data.genres;
};

export default function Page() {
  const { data: genresData, error: genresError, isLoading: genresLoading } = useSWR("genres", fetchGenres);
  const [genreNames, setGenreNames] = useState({});

  // Handle loading and errors
  if (genresError) return <p className="error">Failed to load genres.</p>;
  if (genresLoading) return <p className="loading">Loading genres...</p>;

  const genres = genresData || [];

  // Map genre IDs to genre names
  if (genres.length && Object.keys(genreNames).length === 0) {
    const genreMap = {};
    genres.forEach((genre) => {
      genreMap[genre.id] = genre.name;
    });
    setGenreNames(genreMap); // Store the genre name map
  }

  return (
    <div>
      {/* Dynamic Movie Genre Sections */}
      {genres.map((genre) => {
        const { data, error, isLoading } = useSWR(
          [`movieDataByGenre-${genre.id}`, genre.id],
          () => fetcherByGenre(genre.id)
        );

        // Handle loading and errors for each genre
        if (error) return <p className="error" key={genre.id}>Failed to load {genreNames[genre.id]} movies.</p>;
        if (isLoading) return <p className="loading" key={genre.id}>Loading {genreNames[genre.id]} movies...</p>;

        const movies = data?.results.slice(0, 10) || []; // Limit to 10 movies

        return (
          <section key={genre.id} className="movie-genre-section">
            <h2>{genreNames[genre.id]}</h2> {/* Display Genre Name as Title */}
            <div className="movies-grid">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <Link href={`/movieDetails/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="poster"
                    />
                  </Link>
                  <h3>{movie.title}</h3>
                  <p>⭐ {movie.vote_average.toFixed(1)} / 10</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}


