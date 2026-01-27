import { useState, useEffect } from 'react';
import { novelAPI, categoryAPI } from '../api/apiClient';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icons';

export const AuthorCreatePage = () => {
  const { user } = useAuth();
  const [novels, setNovels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryID: [],
    coverImage: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get categories
      const categoriesResponse = await categoryAPI.getAll();
      setCategories(categoriesResponse.data.categories || []);
      
      // Get author's novels
      const novelsResponse = await novelAPI.getAll({ search: '' });
      setNovels(novelsResponse.data.novels?.filter(n => n.AuthorID === user?.userID) || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleCreateNovel = async (e) => {
    e.preventDefault();
    try {
      if (formData.categoryID.length === 0) {
        alert('Please select at least one category');
        return;
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Append each category ID
      formData.categoryID.forEach(catID => {
        formDataToSend.append('categoryID', catID);
      });
      
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }
      
      // Use the axios instance for file upload
      await api.post('/novels', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setFormData({ title: '', description: '', categoryID: [], coverImage: null });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create novel:', error);
      alert(error.response?.data?.message || 'Failed to create novel');
    }
  };

  return (
    <div className="author-tab-content">
      <h2><Icon name="Plus" />Create New Novel</h2>
      
      <button 
        className="btn-primary"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? 'Cancel' : 'Create New Novel'}
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateNovel} className="form-card">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.files?.[0] || null })}
              className="file-input"
            />
            {formData.coverImage && (
              <div className="image-preview">
                <img src={URL.createObjectURL(formData.coverImage)} alt="Preview" />
                <p>{formData.coverImage.name}</p>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Categories (Select one or more)</label>
            <div className="categories-checkboxes">
              {categories.map((cat) => (
                <label key={cat.CategoryID} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={cat.CategoryID}
                    checked={formData.categoryID.includes(cat.CategoryID.toString())}
                    onChange={(e) => {
                      const catID = e.target.value;
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          categoryID: [...formData.categoryID, catID]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          categoryID: formData.categoryID.filter(id => id !== catID)
                        });
                      }
                    }}
                  />
                  {cat.CategoryName}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary">Create Novel</button>
        </form>
      )}

      <h2><Icon name="Book" />My Novels ({novels.length})</h2>
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
              <p className="status">Status: {novel.Status}</p>
              <p className="views"><Icon name="Eye" /> {novel.ViewCount} views</p>
              {novel.categories && novel.categories.length > 0 && (
                <div className="categories-list">
                  {novel.categories.map((cat) => (
                    <span key={cat.CategoryID} className="category-tag">{cat.CategoryName}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No novels yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};
