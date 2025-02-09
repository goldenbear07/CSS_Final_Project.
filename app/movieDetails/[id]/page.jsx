"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_KEY = "51372fec0f0d192195fa00d7602b7900"; // Replace with your TMDB API key.

export default function MovieDetails() {
  const { id } = useParams(); // Dynamic route parameter for the movie ID.
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null); // State to store trailer key
  const [loading, setLoading] = useState(true);

  // Fetch all required data
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);

        // Fetch movie details
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        const movieData = await movieRes.json();
        setMovie(movieData);

        // Fetch cast details
        const castRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
        );
        const castData = await castRes.json();
        setCast(castData.cast);

        // Fetch reviews
        const reviewsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}`
        );
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.results);

        // Fetch similar movies
        const similarMoviesRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
        );
        const similarMoviesData = await similarMoviesRes.json();
        setSimilarMovies(similarMoviesData.results);

        // Fetch trailer details
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!movie) {
    return <p>Failed to load movie details. Please try again later.</p>;
  }

  return (
    <div className="movie-details-page">
      {/* Banner Section */}
      <div
        className="banner"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || ""})`,
        }}
      >
        <div className="banner-overlay">
          <h1>{movie.title || "Unknown Title"}</h1>
          <div className="rating-info">
            <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
            <span>{movie.vote_count ? `${movie.vote_count} Reviews` : "No reviews"}</span>
            <span>Released: {movie.release_date || "Unknown"}</span>
            <span>{movie.runtime ? `${movie.runtime} mins` : "Runtime not available"}</span>
          </div>
          <p>{movie.overview || "No overview available for this movie."}</p>
          {trailerKey && (
            <button
              className="watch-trailer"
              onClick={() =>
                window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank")
              }
            >
              Watch Trailer
            </button>
          )}
        </div>
      </div>

      {/* Remaining sections (Storyline, Reviews, Cast, More Like This) */}
      {/* Storyline and Additional Info */}
      <div className="details-container">
        {/* Left Section */}
        <div className="left-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path || ""}`}
            alt={movie.title || "Movie Poster"}
            className="poster"
          />
        </div>

        {/* Right Section */}
        <div className="right-section">
          <h2>Storyline</h2>
          <p>{movie.overview || "No storyline available."}</p>
          <div className="info-grid">
            <p>
              <strong>Released:</strong> {movie.release_date || "Unknown"}
            </p>
            <p>
              <strong>Revenue:</strong>{" "}
              {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "Unknown"}
            </p>
            <p>
              <strong>Status:</strong> {movie.status || "Unknown"}
            </p>
            <p>
              <strong>Budget:</strong>{" "}
              {movie.budget ? `$${movie.budget.toLocaleString()}` : "Unknown"}
            </p>
            <p>
              <strong>Genre:</strong>{" "}
              {movie.genres && movie.genres.length > 0
                ? movie.genres.map((genre) => (
                    <span key={genre.id} className="genre">
                      {genre.name}
                    </span>
                  ))
                : "Unknown"}
            </p>
            <p>
              <strong>Language:</strong> {movie.original_language || "Unknown"}
            </p>
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

      {/* Cast Section */}
      <div className="cast-section">
        <h2>Cast</h2>
        <div className="cast-grid">
          {cast.length > 0 ? (
            cast.map((actor) => (
              <div key={actor.id} className="cast-card">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : "/placeholder.jpg"
                  }
                  alt={actor.name}
                />
                <p className="actor-name">{actor.name}</p>
                <p className="actor-role">{actor.character}</p>
              </div>
            ))
          ) : (
            <p>No cast information available.</p>
          )}
        </div>
      </div>

      {/* More Like This Section */}
      <div className="more-like-this">
        <h2>More Like This</h2>
        <div className="similar-grid">
          {similarMovies.length > 0 ? (
            similarMovies.map((movie) => (
              <div
                key={movie.id}
                className="similar-card"
                onClick={() => router.push(`/movieDetails/${movie.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
                <p className="movie-title">{movie.title}</p>
              </div>
            ))
          ) : (
            <p>No similar movies available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
