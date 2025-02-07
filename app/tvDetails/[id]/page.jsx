"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_KEY = "51372fec0f0d192195fa00d7602b7900";

export default function TvShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => setShow(data));
    }
  }, [id]);

  if (!show) return <p className="loading">Loading TV show details...</p>;

  return (
    <div className="details-page">
      <div 
        className="details-banner"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})` }}
      >
        <div className="details-overlay">
          <h1>{show.name}</h1>
          <p className="details-rating">⭐ {show.vote_average.toFixed(1)} / 10</p>
          <p className="details-description">{show.overview}</p>
        </div>
      </div>

      <div className="details-info">
        <h2>TV Show Info</h2>
        <p><strong>First Air Date:</strong> {show.first_air_date}</p>
        <p><strong>Seasons:</strong> {show.number_of_seasons}</p>
        <p><strong>Genres:</strong> {show.genres.map((genre) => genre.name).join(", ")}</p>
      </div>
    </div>
  );
}
