import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { novelAPI, chapterAPI } from '../api/apiClient';
import { Icon } from '../components/Icons';
import '../styles/Pages.css';

const MAX_CONTENT_LENGTH = 50000; // Maximum characters allowed

export const AuthorChapterPage = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({
    chapterNumber: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchData();
  }, [novelId]);

  const fetchData = async () => {
    try {
      // Don't count view when author is editing chapters
      const novelResponse = await novelAPI.getById(novelId, { countView: false });
      setNovel(novelResponse.data.novel);

      const chaptersResponse = await chapterAPI.getAll({ novelID: novelId });
      setChapters(chaptersResponse.data.chapters || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingChapter) {
        // Update chapter
        await chapterAPI.update(editingChapter.ChapterID, {
          chapterNumber: parseInt(formData.chapterNumber),
          title: formData.title,
          content: formData.content,
        });
      } else {
        // Create new chapter
        await chapterAPI.create({
          novelID: novelId,
          chapterNumber: parseInt(formData.chapterNumber),
          title: formData.title,
          content: formData.content,
        });
      }
      setFormData({ chapterNumber: '', title: '', content: '' });
      setEditingChapter(null);
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save chapter:', error);
      alert(error.response?.data?.message || 'Failed to save chapter');
    }
  };

  const handleEdit = (chapter) => {
    setEditingChapter(chapter);
    setFormData({
      chapterNumber: chapter.ChapterNumber,
      title: chapter.Title,
      content: chapter.Content,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (chapterID) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) {
      return;
    }

    try {
      await chapterAPI.delete(chapterID);
      fetchData();
    } catch (error) {
      console.error('Failed to delete chapter:', error);
      alert(error.response?.data?.message || 'Failed to delete chapter');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingChapter(null);
    setFormData({ chapterNumber: '', title: '', content: '' });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!novel) return <div className="error">Novel not found</div>;

  return (
    <div className="page-container">
      <div className="chapter-page-header">
        <button 
          className="btn-secondary"
          onClick={() => navigate('/author')}
        >
          ← Back to Author Hub
        </button>
        <h1><Icon name="Book" />{novel.Title} - Manage Chapters</h1>
      </div>

      <button 
        className="btn-primary"
        onClick={() => {
          if (!editingChapter) {
            setFormData({ 
              chapterNumber: chapters.length + 1, 
              title: '', 
              content: '' 
            });
          }
          setShowCreateForm(!showCreateForm);
        }}
      >
        <Icon name="Plus" />{showCreateForm ? 'Cancel' : 'Add Chapter'}
      </button>

      {showCreateForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-row">
            <div className="form-group">
              <label>Chapter Number</label>
              <input
                type="number"
                value={formData.chapterNumber}
                onChange={(e) => setFormData({ ...formData, chapterNumber: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Chapter Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-group-header">
              <label>Content</label>
              <span className="char-counter">
                {formData.content.length} / {MAX_CONTENT_LENGTH} characters
              </span>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CONTENT_LENGTH) {
                  setFormData({ ...formData, content: e.target.value });
                }
              }}
              required
              rows="10"
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={`Enter chapter content (maximum ${MAX_CONTENT_LENGTH} characters)`}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingChapter ? 'Update Chapter' : 'Create Chapter'}
            </button>
          </div>
        </form>
      )}

      <h2><Icon name="FileText" />Chapters ({chapters.length})</h2>
      <div className="chapters-management">
        {chapters.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Chapter #</th>
                <th>Title</th>
                <th>Content Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter) => (
                <tr key={chapter.ChapterID}>
                  <td>Chapter {chapter.ChapterNumber}</td>
                  <td>{chapter.Title}</td>
                  <td className="content-preview">
                    {chapter.Content?.substring(0, 100)}...
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="btn-secondary"
                      onClick={() => handleEdit(chapter)}
                    >
                      <Icon name="Edit" />Edit
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDelete(chapter.ChapterID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No chapters yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};
