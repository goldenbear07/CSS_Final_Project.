//Done by Van S10268226K
'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import DropdownMenu  from '@/app/TVdropdown/dropdown';
const API_KEY = '51372fec0f0d192195fa00d7602b7900';

const currentYear = new Date().getFullYear();
const firstDayOfYear = `${currentYear}-01-01`; // January 1st of the current year
const today = new Date().toISOString().split('T')[0]; // Current date

const TOP_RATED_TV_API = (genreId) =>
  `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=vote_average.desc&page=1`;
const NEW_TV_SHOWS_API = (genreId) =>
  `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&first_air_date.gte=${firstDayOfYear}&first_air_date.lte=${today}&sort_by=first_air_date.asc&page=1`; // Only shows that started this year
const CURRENTLY_RUNNING_TV_API = (genreId) =>
  `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`;
const POPULAR_TV_API = (genreId) =>
  `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`;

const fetcher = (url) => fetch(url).then((res) => res.json());

const GenrePage = ({ params }) => {
  const resolvedParams = React.use(params);
  const { genreId } = resolvedParams;

  const { data: topRatedData, error: topRatedError } = useSWR(TOP_RATED_TV_API(genreId), fetcher);
  const { data: newShowsData, error: newShowsError } = useSWR(NEW_TV_SHOWS_API(genreId), fetcher);
  const { data: currentlyRunningData, error: currentlyRunningError } = useSWR(CURRENTLY_RUNNING_TV_API(genreId), fetcher);
  const { data: popularData, error: popularError } = useSWR(POPULAR_TV_API(genreId), fetcher);

  // get genre names
  const { data: genreData, error: genreError } = useSWR(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`, fetcher);

  if (topRatedError || newShowsError || currentlyRunningError || popularError || genreError) {
    return <p className="error">Failed to load data.</p>;
  }

  // get the genre name based on genreId
  const genre = genreData?.genres.find((genre) => genre.id === parseInt(genreId))?.name;

  return (
    <div>
      <DropdownMenu></DropdownMenu>
      <h1>{genre} TV Shows</h1>

      {/*Shows currently popular/trending TV shows*/}
      <section className="tv-category">
        <h2>{genre ? `Popular ${genre} TV Shows` : 'Popular TV Shows'}</h2>
        {popularData && (
          <div className="movies-grid">
            {popularData.results.slice(0, 20).map((show) => (
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
            ))}
          </div>
        )}
      </section>
      
      {/*Shows top rated shows of the genre*/}
      <section className="tv-category">
        <h2>{genre ? `Top-Rated ${genre} TV Shows` : 'Top-Rated TV Shows'}</h2>
        {topRatedData && (
          <div className="movies-grid">
            {topRatedData.results.slice(0, 20).map((show) => (
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
            ))}
          </div>
        )}
      </section>
      
      {/*Shows only TV shows that started airing in the current year */}
      <section className="tv-category">
        <h2>{genre ? `New ${genre} TV Shows of ${currentYear}` : 'New TV Shows'}</h2>
        {newShowsData && (
          <div className="movies-grid">
            {newShowsData.results.slice(0, 20).map((show) => (
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
                <p>Aired on: {new Date(show.first_air_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GenrePage;
