"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_KEY = "51372fec0f0d192195fa00d7602b7900";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch movie details
  useEffect(() => {
    if (id) {
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => setMovie(data));
    }
  }, [id]);

  // Fetch trailer data
  useEffect(() => {
    if (id) {
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
      )
        .then((res) => res.json())
        .then((data) => {
          const officialTrailer = data.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          setTrailer(officialTrailer);
        });
    }
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (id) {
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`
      )
        .then((res) => res.json())
        .then((data) => setReviews(data.results));
    }
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-details-page">
      {/* Banner Section */}
      <div
        className="banner"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="banner-overlay">
          <h1>{movie.title}</h1>
          <div className="rating-info">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.vote_count} Reviews</span>
            <span>{movie.release_date}</span>
            <span>{movie.runtime || "N/A"} mins</span>
          </div>
          <p>{movie.overview}</p>
          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-trailer"
            >
              Watch Trailer
            </a>
          )}
        </div>
      </div>

      {/* Storyline and Additional Info */}
      <div className="details-container">
        <div className="left-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="poster"
          />
        </div>

        <div className="right-section">
          <h2>Storyline</h2>
          <p>{movie.overview}</p>
          <div className="info-grid">
            <p><strong>Released:</strong> {movie.release_date}</p>
            <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
            <p><strong>Status:</strong> {movie.status}</p>
            <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
            <p><strong>Genre:</strong> {movie.genres.map((genre) => (
              <span key={genre.id} className="genre">{genre.name}</span>
            ))}</p>
            <p><strong>Language:</strong> {movie.original_language}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3>{review.author}</h3>
              <p className="review-content">
                {review.content.length > 300
                  ? `${review.content.substring(0, 300)}...`
                  : review.content}
              </p>
              {review.content.length > 300 && (
                <span
                  className="read-more"
                  onClick={(e) => {
                    const contentElement = e.target.previousElementSibling;
                    contentElement.innerText = review.content;
                    e.target.style.display = "none";
                  }}
                >
                  Read More
                </span>
              )}
            </div>
          ))
        ) : (
          <p>No reviews available for this movie.</p>
        )}
      </div>
    </div>
  );
}
