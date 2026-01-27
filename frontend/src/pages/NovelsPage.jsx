import { useState, useEffect } from 'react';
import { novelAPI } from '../api/apiClient';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons';
import '../styles/Pages.css';

export const NovelsPage = () => {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNovels();
  }, [search]);

  const fetchNovels = async () => {
    try {
      const response = await novelAPI.getAll({ search });
      setNovels(response.data.novels || []);
    } catch (error) {
      console.error('Failed to fetch novels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <h1><Icon name="Book" />Novels</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search novels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="novels-grid">
        {novels.length > 0 ? (
          novels.map((novel) => (
            <div key={novel.NovelID} className="novel-card">
              <img 
                src={novel.CoverImage ? `http://localhost:3000${novel.CoverImage}` : 'https://via.placeholder.com/200x300?text=No+Cover'} 
                alt={novel.Title}
                className="novel-cover"
              />
              <h3>{novel.Title}</h3>
              <p className="author">By: {novel.AuthorName || 'Unknown'}</p>
              {novel.categories && novel.categories.length > 0 && (
                <div className="categories-list">
                  {novel.categories.map((cat) => (
                    <span key={cat.CategoryID} className="category-tag">{cat.CategoryName}</span>
                  ))}
                </div>
              )}
              <p className="description">{novel.Description?.substring(0, 100)}...</p>
              <p className="views"><Icon name="Eye" /> {novel.ViewCount} views</p>
              <Link to={`/novel/${novel.NovelID}`} className="btn-primary">
                Read
              </Link>
            </div>
          ))
        ) : (
          <p>No novels found</p>
        )}
      </div>
    </div>
  );
};
