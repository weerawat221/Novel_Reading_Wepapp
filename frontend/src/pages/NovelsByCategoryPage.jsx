import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { novelAPI, categoryAPI } from '../api/apiClient';
import { Icon } from '../components/Icons';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

export const NovelsByCategoryPage = () => {
  const { categoryId } = useParams();
  const [novels, setNovels] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    try {
      // Fetch all novels and filter by category
      const novelsResponse = await novelAPI.getAll({ search: '' });
      const allNovels = novelsResponse.data.novels || [];
      
      // Filter novels that have the selected category
      const filteredNovels = allNovels.filter(novel => 
        novel.categories && novel.categories.some(cat => cat.CategoryID === parseInt(categoryId))
      );
      
      setNovels(filteredNovels);

      // Fetch category details
      const categoryResponse = await categoryAPI.getById(categoryId);
      setCategory(categoryResponse.data.category);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <h1><Icon name="Book" />Novels in {category?.CategoryName || 'Category'}</h1>
      
      <div className="search-bar">
        <p>{novels.length} novel(s) found in this category</p>
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
          <p>No novels found in this category</p>
        )}
      </div>
    </div>
  );
};
