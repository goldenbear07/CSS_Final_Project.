"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter here

const API_KEY = "51372fec0f0d192195fa00d7602b7900"; // Replace with your TMDB API key.

export default function TVDetails() {
  const { id } = useParams(); // Dynamic route parameter for the TV show ID.
  const router = useRouter(); // Initialize router
  const [tvShow, setTvShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null); // State to store trailer key
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVDetails = async () => {
      try {
        setLoading(true);

        // Fetch TV show details
        const tvRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
        );
        const tvData = await tvRes.json();
        setTvShow(tvData);

        // Fetch cast details
        const castRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`
        );
        const castData = await castRes.json();
        setCast(castData.cast || []); // Default to an empty array if cast data is missing

        // Fetch reviews
        const reviewsRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${API_KEY}`
        );
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.results || []); // Default to an empty array if reviews data is missing

        // Fetch similar TV shows
        const similarRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}`
        );
        const similarData = await similarRes.json();
        setSimilarShows(similarData.results || []); // Default to an empty array if similar shows are missing

        // Fetch trailer details
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`
        );
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch TV details:", error);
        setLoading(false);
      }
    };

    fetchTVDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!tvShow) {
    return <p>Failed to load TV show details. Please try again later.</p>;
  }

  return (
    <div className="tv-details-page">
      {/* Banner Section */}
      <div
        className="banner"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path || ""})`,
        }}
      >
        <div className="banner-overlay">
          <h1>{tvShow.name || "Unknown Title"}</h1>
          <div className="rating-info">
            <span>⭐ {tvShow.vote_average ? tvShow.vote_average.toFixed(1) : "N/A"}</span>
            <span>{tvShow.vote_count ? `${tvShow.vote_count} Reviews` : "No reviews"}</span>
            <span>First Air Date: {tvShow.first_air_date || "Unknown"}</span>
            <span>Seasons: {tvShow.number_of_seasons || "N/A"}</span>
          </div>
          <p>{tvShow.overview || "No overview available for this TV show."}</p>
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

      {/* Storyline and Additional Info */}
      <div className="details-container">
        <div className="left-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path || ""}`}
            alt={tvShow.name || "TV Poster"}
            className="poster"
          />
        </div>

        <div className="right-section">
          <h2>Storyline</h2>
          <p>{tvShow.overview || "No storyline available."}</p>
          <div className="info-grid">
            <p>
              <strong>First Air Date:</strong> {tvShow.first_air_date || "Unknown"}
            </p>
            <p>
              <strong>Last Air Date:</strong> {tvShow.last_air_date || "Unknown"}
            </p>
            <p>
              <strong>Status:</strong> {tvShow.status || "Unknown"}
            </p>
            <p>
              <strong>Seasons:</strong> {tvShow.number_of_seasons || "Unknown"}
            </p>
            <p>
              <strong>Episodes:</strong> {tvShow.number_of_episodes || "Unknown"}
            </p>
            <p>
              <strong>Genre:</strong>{" "}
              {tvShow.genres && tvShow.genres.length > 0
                ? tvShow.genres.map((genre) => (
                    <span key={genre.id} className="genre">
                      {genre.name}
                    </span>
                  ))
                : "Unknown"}
            </p>
            <p>
              <strong>Language:</strong> {tvShow.original_language || "Unknown"}
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
          <p>No reviews available for this TV show.</p>
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
                <p className="actor-role">{actor.character || "Unknown Role"}</p>
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
          {similarShows.length > 0 ? (
            similarShows.map((show) => (
              <div
                key={show.id}
                className="similar-card"
                onClick={() => router.push(`/tvDetails/${show.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                  alt={show.name}
                />
                <p className="tv-title">{show.name}</p>
              </div>
            ))
          ) : (
            <p>No similar TV shows available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
