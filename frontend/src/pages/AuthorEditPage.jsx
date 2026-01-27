import { useState, useEffect } from 'react';
import { novelAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons';

export const AuthorEditPage = () => {
  const { user } = useAuth();
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNovel, setEditingNovel] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchNovels();
  }, []);

  const fetchNovels = async () => {
    try {
      const response = await novelAPI.getAll({ search: '' });
      setNovels(response.data.novels?.filter(n => n.AuthorID === user?.userID) || []);
    } catch (error) {
      console.error('Failed to fetch novels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStatus = (novel) => {
    setEditingNovel(novel);
    setEditFormData({ status: novel.Status });
    setShowEditModal(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    try {
      await novelAPI.update(editingNovel.NovelID, {
        status: editFormData.status,
      });
      setShowEditModal(false);
      setEditingNovel(null);
      fetchNovels();
    } catch (error) {
      console.error('Failed to update novel:', error);
      alert(error.response?.data?.message || 'Failed to update novel');
    }
  };

  const handleDelete = async (novelID) => {
    if (!window.confirm('Are you sure you want to delete this novel?')) {
      return;
    }

    try {
      await novelAPI.delete(novelID);
      fetchNovels();
    } catch (error) {
      console.error('Failed to delete novel:', error);
      alert(error.response?.data?.message || 'Failed to delete novel');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="author-tab-content">
      <h2><Icon name="Edit" />Edit Novels</h2>

      <div className="novels-table">
        {novels.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {novels.map((novel) => (
                <tr key={novel.NovelID}>
                  <td>
                    <img 
                      src={novel.CoverImage ? `http://localhost:3000${novel.CoverImage}` : 'https://via.placeholder.com/50x75?text=No'} 
                      alt={novel.Title}
                      className="table-cover-image"
                    />
                  </td>
                  <td className="novel-title-link">
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      navigate(`/author/chapters/${novel.NovelID}`);
                    }}>
                      {novel.Title}
                    </a>
                  </td>
                  <td>{novel.Status}</td>
                  <td>{novel.ViewCount}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate(`/author/chapters/${novel.NovelID}`)}
                    >
                      Manage Chapters
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => handleEditStatus(novel)}
                    >
                      <Icon name="Edit" />Edit Status
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDelete(novel.NovelID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No novels to edit. Create one first!</p>
        )}
      </div>

      {/* Edit Status Modal */}
      {showEditModal && editingNovel && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Novel Status</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="modal-form">
              <div className="form-group">
                <label>Novel Title</label>
                <input
                  type="text"
                  value={editingNovel.Title}
                  disabled
                  style={{ backgroundColor: '#ecf0f1', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ status: e.target.value })}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
