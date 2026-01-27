import { useEffect, useState } from 'react';
import { favoriteAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await favoriteAPI.getUserFavorites(user.userID);
      setFavorites(res.data.favorites || []);
    } catch (err) {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (novelId) => {
    try {
      await favoriteAPI.removeFavorite(user.userID, novelId);
      setFavorites(favorites.filter(fav => fav.NovelID !== novelId));
    } catch (err) {
      alert('Failed to remove favorite');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="favorites-page">
      <h2>My Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {favorites.map(fav => (
            <li key={fav.NovelID}>
              <Link to={`/novel/${fav.NovelID}`}>{fav.Title}</Link>
              <button onClick={() => handleRemove(fav.NovelID)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;
