//Toh Keng Siong S10267107C

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_KEY = "51372fec0f0d192195fa00d7602b7900";

export default function TvShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch TV show details
  useEffect(() => {
    if (id) {
      fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => setShow(data));
    }
  }, [id]);

  // Fetch trailer data
  useEffect(() => {
    if (id) {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
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
        `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${API_KEY}&language=en-US`
      )
        .then((res) => res.json())
        .then((data) => setReviews(data.results));
    }
  }, [id]);

  if (!show) return <p>Loading...</p>;

  return (
    <div className="movie-details-page">
      {/* Banner Section */}
      <div 
        className="banner" 
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
        }}
      >
        <div className="banner-overlay">
          <h1>{show.name}</h1>
          <div className="rating-info">
            <span>⭐ {show.vote_average.toFixed(1)}</span>
            <span>{show.vote_count} Reviews</span>
            <span>First Aired: {show.first_air_date}</span>
            <span>Seasons: {show.number_of_seasons}</span>
          </div>
          <p>{show.overview}</p>
          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-trailer"
            >
              ▶ Watch Trailer
            </a>
          )}
        </div>
      </div>

      {/* Storyline and Additional Info */}
      <div className="details-container">
        <div className="left-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.name}
            className="poster"
          />
        </div>

        <div className="right-section">
          <h2>Storyline</h2>
          <p>{show.overview}</p>
          <div className="info-grid">
            <p><strong>First Air Date:</strong> {show.first_air_date}</p>
            <p><strong>Last Air Date:</strong> {show.last_air_date}</p>
            <p><strong>Status:</strong> {show.status}</p>
            <p><strong>Seasons:</strong> {show.number_of_seasons}</p>
            <p><strong>Episodes:</strong> {show.number_of_episodes}</p>
            <p><strong>Genre:</strong> {show.genres.map((genre) => (
              <span key={genre.id} className="genre">{genre.name}</span>
            ))}</p>
            <p><strong>Language:</strong> {show.original_language}</p>
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
