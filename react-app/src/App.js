
import React, { useState } from 'react';
import CatList from './components/CatList';
import CollectedCats from './components/CollectedCats';

function App() {
  const [collectedCats, setCollectedCats] = useState([]);

  const collectCat = (cat) => {
    setCollectedCats([...collectedCats, cat]);
  };

  return (
    <div>
      <h1>Cat Collector APP</h1>
      <CatList collectCat={collectCat} />
      <h1>SEPARATIO</h1>
      <CollectedCats cats={collectedCats} />
    </div>


  );
}

export default App;