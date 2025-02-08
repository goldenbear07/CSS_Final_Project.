"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";

const API_KEY = "51372fec0f0d192195fa00d7602b7900";
const GENRE_API = `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`;
const TV_API = (genreId) => `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=1`;

const fetcher = (url) => fetch(url).then((res) => res.json());

const GenrePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: genreData } = useSWR(GENRE_API, fetcher);
  const [tvShows, setTvShows] = useState([]);
  const [genreId, setGenreId] = useState(null);

  useEffect(() => {
    if (genreData && slug) {
      const genre = genreData.genres.find((g) => g.name.toLowerCase() === slug.toLowerCase());
      if (genre) {
        setGenreId(genre.id);
      }
    }
  }, [genreData, slug]);

  useEffect(() => {
    if (genreId) {
      fetch(TV_API(genreId))
        .then((res) => res.json())
        .then((data) => setTvShows(data.results || []));
    }
  }, [genreId]);

  if (!slug) return <p>Loading...</p>;
  if (!genreId) return <p>Genre not found.</p>;

  return (
    <div>
      <h1>{slug} TV Shows</h1>
      <div className="movies-grid">
        {tvShows.length > 0 ? (
          tvShows.map((show) => (
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
          ))
        ) : (
          <p>No TV shows found in this genre.</p>
        )}
      </div>
    </div>
  );
};

export default GenrePage;