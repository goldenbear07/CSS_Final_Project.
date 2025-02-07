"use client";
import useSWR from "swr";
import Link from "next/link"; // Import Link for navigation

const fetcher = async () => {
  const response = await fetch(
    "https://api.themoviedb.org/3/tv/popular?api_key=51372fec0f0d192195fa00d7602b7900"
  );
  const data = await response.json();
  return data;
};

export default function TvShows() {
  const { data, error, isLoading } = useSWR("tvData", fetcher);

  if (error) return <p className="error">Failed to load TV shows.</p>;
  if (isLoading) return <p className="loading">Loading TV shows...</p>;

  return (
    <div className="movies-grid">
      {data.results.map((show) => (
        <div key={show.id} className="movie-card">
          <Link href={`/tvDetails/${show.id}`}> {/* Ensure correct route */}
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
  );
}
