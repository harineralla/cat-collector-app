// Cat.js
import React, { useState } from 'react';
import './Cat.css';

function Cat({ cat, collectCat, deleteCat, editCat }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(cat.url);
 
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    editCat(cat.id, newUrl);
    setIsEditing(false);
  };

  return (
    <div className="cat-card">
      {isEditing ? (
        <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
      ) : (
        <img src={cat.url} alt="cat" className="cat-image" />
      )}
      {collectCat && <button onClick={() => collectCat(cat)} className="collect-button">Collect</button>}
      {deleteCat && <button onClick={() => deleteCat(cat)} className="delete-button">Delete</button>}
      {editCat && (
        isEditing ? (
          <button onClick={handleSave} className="save-button">Save</button>
        ) : (
          <button onClick={handleEdit} className="edit-button">Edit</button>
        )
      )}
    </div>
  );
}

export default Cat;