import React, { useEffect, useState } from 'react';
import Cat from './Cat';

function CatList({ collectCat }) {
  const [cats, setCats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const catsPerPage = 10;

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:5000/cats?page=${currentPage}&per_page=${catsPerPage}`)
      .then(response => response.json())
      .then(data => {
        setCats(data);
        setIsLoading(false);
      });
  }, [currentPage]);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCats = cats.filter(cat => cat.api_id.includes(search));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <input type="text" value={search} onChange={handleSearchChange} placeholder="Search cats by id" />
      {filteredCats.map(cat => (
        <Cat key={cat.api_id} cat={cat} collectCat={collectCat} />
      ))}
      <button onClick={prevPage}>Previous</button>
      <button onClick={nextPage}>Next</button>
    </div>
  );
}

export default CatList;
