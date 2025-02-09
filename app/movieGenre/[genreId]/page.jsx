//Done by Van S10268226K

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import MovieGenreDropdown from "@/app/movieDropdown/page";
import Link from "next/link";


const API_KEY = "51372fec0f0d192195fa00d7602b7900";

// Get current year
const currentYear = new Date().getFullYear();
const firstDayOfYear = `${currentYear}-01-01`; // January 1st of the current year
const today = new Date().toISOString().split("T")[0]; // Current date

const TOP_RATED_MOVIES_API = (genreId) =>
  `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=vote_average.desc&page=1`;
const NEW_MOVIES_API = (genreId) =>
  `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&primary_release_date.gte=${firstDayOfYear}&primary_release_date.lte=${today}&sort_by=primary_release_date.asc&page=1`;
const CURRENTLY_RUNNING_MOVIES_API = (genreId) =>
  `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`;
const POPULAR_MOVIES_API = (genreId) =>
  `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`;

const fetcher = (url) => fetch(url).then((res) => res.json());

function MoviesByGenre() {
  const { genreId } = useParams();
  const [genreName, setGenreName] = useState("");

  const { data: topRatedMovies, error: topRatedError } = useSWR(() => genreId ? TOP_RATED_MOVIES_API(genreId) : null, fetcher);
  const { data: newMovies, error: newMoviesError } = useSWR(() => genreId ? NEW_MOVIES_API(genreId) : null, fetcher);
  const { data: currentlyRunningMovies, error: currentlyRunningError } = useSWR(() => genreId ? CURRENTLY_RUNNING_MOVIES_API(genreId) : null, fetcher);
  const { data: popularMovies, error: popularError } = useSWR(() => genreId ? POPULAR_MOVIES_API(genreId) : null, fetcher);

  // get genre name
  useEffect(() => {
    if (genreId) {
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          const genre = data.genres.find((g) => g.id.toString() === genreId);
          setGenreName(genre ? genre.name : "Unknown Genre");
        });
    }
  }, [genreId]);

  if (topRatedError || newMoviesError || currentlyRunningError || popularError) {
    return <p className="error">Failed to load data.</p>;
  }

  return (
    <div className="movies-genre-page">
      <MovieGenreDropdown></MovieGenreDropdown>
      <h1>{genreName} Movies</h1>

      {/*Shows popular/trending movies of the genre*/}
      <section className="movies-category">
        <h2>{genreName ? `Popular ${genreName} Movies` : "Popular Movies"}</h2>
        {popularMovies && (
          <div className="movies-grid">
            {popularMovies.results.slice(0, 20).map((movie) => (
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

        {/*Shows Top Rated movies of the genre*/}
      <section className="movies-category">
        <h2>{genreName ? `Top-Rated ${genreName} Movies` : "Top-Rated Movies"}</h2>
        {topRatedMovies && (
          <div className="movies-grid">
            {topRatedMovies.results.slice(0, 20).map((movie) => (
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

        {/*Shows new movies of the genre/Movies aired in the current year*/}
      <section className="movies-category">
        <h2>{genreName ? `New ${genreName} Movies of ${currentYear}` : "New Movies"}</h2>
        {newMovies && (
          <div className="movies-grid">
            {newMovies.results.slice(0, 20).map((movie) => (
              <div key={movie.id} className="movie-card">
                <Link href={`/movieDetails/${movie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="poster"
                  />
                </Link>
                <h3>{movie.title}</h3>
                <p>Aired on: {new Date(movie.release_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
        {/*Shows movies that are currently running*/}
      <section className="movies-category">
        <h2>{genreName ? `Currently Running ${genreName} Movies` : "Currently Running Movies"}</h2>
        {currentlyRunningMovies && (
          <div className="movies-grid">
            {currentlyRunningMovies.results.slice(0, 20).map((movie) => (
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
}

export default MoviesByGenre;
