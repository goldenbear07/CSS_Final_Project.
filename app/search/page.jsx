'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_KEY = '51372fec0f0d192195fa00d7602b7900';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results || []));
    }
  }, [query]);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <div>
        {results.length > 0 ? (
          results.map((item) => (
            <div key={item.id}>
              <h3>{item.title || item.name}</h3>
              <p>{item.overview}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
