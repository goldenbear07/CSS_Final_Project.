//Toh Keng Siong S10267107C

"use client";

import React from 'react';
import Movie from './api/movieData';
import TV from './api/tvData';
import styles from "./globals.css";
import useSWR from "swr";


const fetcher = async () => {
  const response = await fetch(
    "https://api.themoviedb.org/3/discover/movie?api_key=51372fec0f0d192195fa00d7602b7900"
  );
  const data = await response.json();
  return data;
};

const Page = () => {
    const { data, error, isLoading } = useSWR("movieData", fetcher);
  
    if (error) return <p className="error">Failed to load movies.</p>;
    if (isLoading) return <p className="loading">Loading movies...</p>;
  
    const featuredMovie = data?.results[0]; // Get the first movie as the featured movie
  
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
              <button>Watch Trailer</button>
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