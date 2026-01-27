import { useState, useEffect } from 'react';
import { novelAPI, chapterAPI, commentAPI, favoriteAPI } from '../api/apiClient';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icons';
import { hasViewedNovel, markNovelAsViewed } from '../utils/cookieUtils';
import '../styles/Pages.css';

export const NovelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');


  useEffect(() => {
    fetchData();
    if (user) {
      checkFavorite();
    }
    // eslint-disable-next-line
  }, [id, user]);

  const checkFavorite = async () => {
    try {
      const res = await favoriteAPI.getUserFavorites(user.userID);
      setIsFavorite(res.data.favorites.some(fav => fav.NovelID === parseInt(id)));
    } catch {
      setIsFavorite(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มรายการโปรด');
      return;
    }
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await favoriteAPI.removeFavorite(user.userID, id);
        setIsFavorite(false);
      } else {
        await favoriteAPI.addFavorite(user.userID, id);
        setIsFavorite(true);
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการจัดการรายการโปรด');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      // Check if this novel has been viewed already
      const alreadyViewed = hasViewedNovel(id);
      
      // Set cookie BEFORE making API call to prevent double counting
      if (!alreadyViewed) {
        markNovelAsViewed(id);
      }
      
      const novelResponse = await novelAPI.getById(id, { countView: !alreadyViewed });
      setNovel(novelResponse.data.novel);

      const chaptersResponse = await chapterAPI.getAll({ novelID: id });
      setChapters(chaptersResponse.data.chapters || []);

      const commentsResponse = await commentAPI.getAll({ novelID: id });
      setComments(commentsResponse.data.comments || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }

    try {
      await commentAPI.create({ novelID: id, message: newComment });
      setNewComment('');
      fetchData();
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditCommentText(comment.Message);
    setShowEditCommentModal(true);
  };

  const handleSaveEditComment = async (e) => {
    e.preventDefault();
    try {
      await commentAPI.update(editingComment.CommentID, { message: editCommentText });
      setShowEditCommentModal(false);
      setEditingComment(null);
      fetchData();
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentID) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentAPI.delete(commentID);
      fetchData();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!novel) return <div className="error">Novel not found</div>;

  return (
    <div className="page-container">
      <div className="novel-detail">
        <img src={novel.CoverImage ? `http://localhost:3000${novel.CoverImage}` : 'https://via.placeholder.com/300x400?text=No+Cover'} alt={novel.Title} className="detail-cover" />
        <div className="detail-info">
          <h1>{novel.Title}</h1>
          <p><strong>Author:</strong> {novel.AuthorName}</p>
          {novel.categories && novel.categories.length > 0 && (
            <p><strong>Categories:</strong> {novel.categories.map(c => c.CategoryName).join(', ')}</p>
          )}
          <p><strong>Status:</strong> {novel.Status}</p>
          <p><strong>Views:</strong> <Icon name="Eye" /> {novel.ViewCount}</p>
          <p className="description">{novel.Description}</p>
          <button
            className={`btn-favorite${isFavorite ? ' favorited' : ''}`}
            onClick={handleFavorite}
            disabled={favoriteLoading}
            style={{marginTop: 12}}
          >
            <Icon name={isFavorite ? 'Heart' : 'Heart'} />
            {isFavorite ? ' ลบจากรายการโปรด' : ' เพิ่มในรายการโปรด'}
          </button>
        </div>
      </div>

      <h2><Icon name="Book" />Chapters ({chapters.length})</h2>
      <div className="chapters-list">
        {chapters.length > 0 ? (
          chapters.map((chapter) => (
            <div key={chapter.ChapterID} className="chapter-item">
              <h4>Chapter {chapter.ChapterNumber}: {chapter.Title}</h4>
              <button 
                className="btn-secondary"
                onClick={() => navigate(`/novel/${id}/chapter/${chapter.ChapterID}`)}
              >
                Read
              </button>
            </div>
          ))
        ) : (
          <p>No chapters yet</p>
        )}
      </div>

      <h2><Icon name="MessageCircle" />Comments ({comments.length})</h2>
      {user && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit" className="btn-primary">Post Comment</button>
        </form>
      )}

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.CommentID} className="comment-item">
              <div className="comment-header">
                <strong>{comment.Username}</strong>
                {user && user.userID === comment.UserID && (
                  <div className="comment-actions">
                    <button 
                      className="btn-sm-link"
                      onClick={() => handleEditComment(comment)}
                      title="Edit"
                    >
                      <Icon name="Edit" />
                    </button>
                    <button 
                      className="btn-sm-link btn-danger-link"
                      onClick={() => handleDeleteComment(comment.CommentID)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <p>{comment.Message}</p>
              <small>{new Date(comment.CommentedAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>

      {/* Edit Comment Modal */}
      {showEditCommentModal && editingComment && (
        <div className="modal-overlay" onClick={() => setShowEditCommentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Comment</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditCommentModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditComment} className="modal-form">
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                  required
                  rows="5"
                  placeholder="Edit your comment..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditCommentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
