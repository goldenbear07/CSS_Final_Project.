//Ryan tan (S10268158F)


"use client";

import React, { useState, useEffect } from "react";
import styles from "../globals.css";
import useSWR from "swr";
import Link from "next/link";
import MovieGenreDropdown from "../movieDropdown/page";

// API key to be used in the code
const API_KEY = "51372fec0f0d192195fa00d7602b7900";

// API for different movie categories
const TOP_RATED_MOVIE_API = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1`;
const UPCOMING_MOVIE_API = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&page=1`;
const NOW_PLAYING_MOVIE_API = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=1`;
const POPULAR_MOVIES_API = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`;

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  // Creates a state to hold data for different categories
  const { data: topRatedData, error: topRatedError } = useSWR(TOP_RATED_MOVIE_API, fetcher);
  const { data: upcomingData, error: upcomingError } = useSWR(UPCOMING_MOVIE_API, fetcher);
  const { data: nowPlayingData, error: nowPlayingError } = useSWR(NOW_PLAYING_MOVIE_API, fetcher);
  const { data: popularMoviesData, error: popularMoviesError } = useSWR(POPULAR_MOVIES_API, fetcher);

  if (topRatedError || upcomingError || nowPlayingError || popularMoviesError) {
    return <p className="error">Failed to load movies.</p>;
  } // if any of the API reqs has an error, render the error message.

  return (
    <div>
      <MovieGenreDropdown></MovieGenreDropdown>

      {/* Popular movies */}
      <section className="movie-category">
        <h2>Popular Movies</h2>
        {popularMoviesData && (
          <div className="movies-grid">
            {popularMoviesData.results.slice(0, 20).map((movie) => (
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

      {/* Top-Rated movies */}
      <section className="movie-category">
        <h2>Top-Rated Movies</h2>
        {topRatedData && (
          <div className="movies-grid">
            {topRatedData.results.slice(0, 20).map((movie) => (
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

      {/* Upcoming movies */}
      <section className="movie-category">
        <h2>Upcoming Movies</h2>
        {upcomingData && (
          <div className="movies-grid">
            {upcomingData.results.slice(0, 20).map((movie) => (
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

      {/* Now Playing Movies Section */}
      <section className="movie-category">
        <h2>Now Playing Movies</h2>
        {nowPlayingData && (
          <div className="movies-grid">
            {nowPlayingData.results.slice(0, 20).map((movie) => (
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
    </div>
  );
};

export default Page;
