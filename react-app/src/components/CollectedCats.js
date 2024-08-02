import React, { useState, useEffect } from 'react';
import Cat from './Cat';

function CollectedCats() {
  const [cats, setCats] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/cats')
      .then(response => response.json())
      .then(data => setCats(data));
  }, []);

  const deleteCat = (catId) => {
    fetch(`http://localhost:5000/cats/${catId}`, { method: 'DELETE' })
      .then(() => setCats(cats.filter(cat => cat.id !== catId)));
  };

  const editCat = (catId, newUrl) => {
    fetch(`http://localhost:5000/cats/${catId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: newUrl }),
    }).then(() => {
      setCats(cats.map(cat => (cat.id === catId ? { ...cat, url: newUrl } : cat)));
    });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredCats = filter ? cats.filter(cat => cat.breed === filter) : cats;

  return (
    <div>
      <h2>Collected Cats</h2>
      <p>Total: {cats.length}</p>
      <select value={filter} onChange={handleFilterChange}>
        <option value="">All</option>
        {/* Add an option for each unique breed */}
        {Array.from(new Set(cats.map(cat => cat.breed))).map(breed => (
          <option key={breed} value={breed}>{breed}</option>
        ))}
      </select>
      {filteredCats.map(cat => (
        <Cat key={cat.id} cat={cat} deleteCat={deleteCat} editCat={editCat} />
      ))}
    </div>
  );
}

export default CollectedCats;
