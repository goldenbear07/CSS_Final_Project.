"use client";
import useSWR from "swr";
import Link from "next/link"; // Import Link for navigation

const fetcher = async () => {
  const response = await fetch(
    "https://api.themoviedb.org/3/discover/movie?api_key=51372fec0f0d192195fa00d7602b7900"
  );
  const data = await response.json();
  return data;
};

export default function Movie() {
  const { data, error, isLoading } = useSWR("movieData", fetcher);

  if (error) return <p className="error">Failed to load movies.</p>;
  if (isLoading) return <p className="loading">Loading movies...</p>;

  return (
    <div className="movies-grid">
      {data.results.map((movie) => (
        <div key={movie.id} className="movie-card">
          <Link href={`/movieDetails/${movie.id}`}> {/* Use movieDetails instead of Movie */}
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
  );
}
