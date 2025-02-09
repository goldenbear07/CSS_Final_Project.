//Done by Van S10268226K

"use client";

import React, { useState, useEffect } from "react";
import styles from "../globals.css";
import useSWR from "swr";
import Link from "next/link";
import DropdownMenu from '../TVdropdown/dropdown';


const API_KEY = "51372fec0f0d192195fa00d7602b7900";

const TOP_RATED_TV_API = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=1`;
const UPCOMING_TV_API = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&page=1`;
const CURRENTLY_RUNNING_TV_API = `https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}&page=1`;

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { data: topRatedData, error: topRatedError } = useSWR(TOP_RATED_TV_API, fetcher);
  const { data: upcomingData, error: upcomingError } = useSWR(UPCOMING_TV_API, fetcher);
  const { data: currentlyRunningData, error: currentlyRunningError } = useSWR(CURRENTLY_RUNNING_TV_API, fetcher);

  if (topRatedError || upcomingError || currentlyRunningError) {
    return <p className="error">Failed to load TV shows.</p>;
  }

  return (
    <div>
        <DropdownMenu></DropdownMenu>
      <section className="tv-category">
        <h2>Top-Rated TV Shows</h2>
        {topRatedData && (
          <div className="movies-grid">
            {topRatedData.results.slice(0, 20).map((show) => (
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

      <section className="tv-category">
        <h2>Upcoming TV Shows</h2>
        {upcomingData && (
          <div className="movies-grid">
            {upcomingData.results.slice(0, 20).map((show) => (
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

      <section className="tv-category">
        <h2>Currently Running TV Shows</h2>
        {currentlyRunningData && (
          <div className="movies-grid">
            {currentlyRunningData.results.slice(0, 20).map((show) => (
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
    </div>
  );
};

export default Page;
