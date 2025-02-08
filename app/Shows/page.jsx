"use client";

import React, { useState, useEffect } from "react";
import styles from "../globals.css";
import useSWR from "swr";
import Link from "next/link";

// Use your API key directly in the code
const API_KEY = "51372fec0f0d192195fa00d7602b7900";

const GENRE_API = `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`;
const POPULAR_TV_API = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`;

const fetcher = (url) => fetch(url).then((res) => res.json());

const TV_API = (genreId) => `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}`;

const Page = () => {
  const { data: genreData, error: genreError } = useSWR(GENRE_API, fetcher);
  const { data: popularTvData, error: popularTvError } = useSWR(POPULAR_TV_API, fetcher);
  const [tvShows, setTvShows] = useState({});

  useEffect(() => {
    if (genreData && genreData.genres) {
      genreData.genres.forEach(async (genre) => {
        const response = await fetch(TV_API(genre.id));
        const data = await response.json();
        setTvShows((prev) => ({ ...prev, [genre.name]: data.results.slice(0, 10) }));
      });
    }
  }, [genreData]);

  if (genreError) return <p className="error">Failed to load genres.</p>;
  if (popularTvError) return <p className="error">Failed to load popular TV shows.</p>;

  return (
    <div>
      {/* Popular TV Shows Section */}
      <section className="popular-tv-genre">
        <h2>Popular TV Shows</h2>
        {popularTvData && (
          <div className="movies-grid">
            {popularTvData.results.map((show) => (
              <div key={show.id} className="movie-card">
                <Link href={`/tvDetails/${show.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="poster"
                  />
                </Link>
                <h3>{show.name}</h3>
                <p>⭐ {show.vote_average.toFixed(1)} / 10</p>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* TV Shows by Genre */}
      {Object.entries(tvShows).map(([genre, shows]) => (
        <div key={genre} className="popular-tv-genre">
          <h3>
            <Link href={`/genre/${genre.toLowerCase()}`}>{genre}</Link>
          </h3>
          <div className="movies-grid">
            {shows.map((show) => (
              <div key={show.id} className="movie-card">
                <Link href={`/tvDetails/${show.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="poster"
                  />
                </Link>
                <h3>{show.name}</h3>
                <p>⭐ {show.vote_average.toFixed(1)} / 10</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;

