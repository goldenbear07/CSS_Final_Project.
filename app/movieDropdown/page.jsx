//Done by Van S10268226K


"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";

const API_KEY = "51372fec0f0d192195fa00d7602b7900";
const GENRE_API = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

const fetcher = (url) => fetch(url).then((res) => res.json());

const MovieGenreDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: genresData, error } = useSWR(GENRE_API, fetcher);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  if (error) return <p className="error">Failed to load genres.</p>;

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-button">
        Select Genre
      </button>
      {isOpen && genresData && (
        <ul className="dropdown-menu">
          {genresData.genres.map((genre) => (
            <li key={genre.id} className="dropdown-item">
              <Link href={`/movieGenre/${genre.id}`}>{genre.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieGenreDropdown;
