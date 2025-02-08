"use client";

import React, { useState, useEffect } from "react";
import styles from "./movies.module.css";
import useSWR from "swr";
import Link from "next/link";

const API_KEY = "51372fec0f0d192195fa00d7602b7900";
const GENRE_API = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
const MOVIE_API = (genreId) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=1`;
const POPULAR_MOVIE_API = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`;

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { data: genreData, error: genreError } = useSWR(GENRE_API, fetcher);
  const { data: popularMovieData, error: popularMovieError } = useSWR(POPULAR_MOVIE_API, fetcher);
  const [movies, setMovies] = useState({});

  useEffect(() => {
    if (genreData && genreData.genres) {
      genreData.genres.forEach(async (genre) => {
        const response = await fetch(MOVIE_API(genre.id));
        const data = await response.json();
        setMovies((prev) => ({ ...prev, [genre.name]: data.results.slice(0, 10) })); // Store first 10 movies per genre
      });
    }
  }, [genreData]);

  if (genreError) return <p className="error">Failed to load genres.</p>;
  if (popularMovieError) return <p className="error">Failed to load popular movies.</p>;

  return (
    <div>
      {/* Featured Popular Movies */}
      <section className="movie-genre-section">
        <h2>Popular Movies</h2>
        {popularMovieData && (
          <div className="movies-grid">
            {popularMovieData.results.map((movie) => (
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
        )}
      </section>

      {/* Movies by Genre */}
      {Object.entries(movies).map(([genre, moviesInGenre]) => (
        <section key={genre} className="movie-genre-section">
          <h3>{genre}</h3>
          <div className="movies-grid">
            {moviesInGenre.map((movie) => (
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
      ))}
    </div>
  );
};

export default Page;
