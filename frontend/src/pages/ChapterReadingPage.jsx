import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { novelAPI, chapterAPI, readingHistoryAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icons';
import '../styles/Pages.css';

export const ChapterReadingPage = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [novel, setNovel] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    fetchData();
    // Update reading history if user is logged in
    if (user && novelId && chapterId) {
      readingHistoryAPI.updateHistory(user.userID, novelId, chapterId).catch(() => {});
    }
    // eslint-disable-next-line
  }, [novelId, chapterId, user]);

  const fetchData = async () => {
    try {
      // Fetch novel details
      const novelResponse = await novelAPI.getById(novelId, { countView: false });
      setNovel(novelResponse.data.novel);

      // Fetch all chapters
      const chaptersResponse = await chapterAPI.getAll({ novelID: novelId });
      const allChapters = chaptersResponse.data.chapters || [];
      setChapters(allChapters);

      // Fetch current chapter
      const currentChapter = allChapters.find(c => c.ChapterID === parseInt(chapterId));
      setChapter(currentChapter);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentChapterIndex = () => {
    return chapters.findIndex(c => c.ChapterID === parseInt(chapterId));
  };

  const getPreviousChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    return currentIndex > 0 ? chapters[currentIndex - 1] : null;
  };

  const getNextChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  };

  const previousChapter = getPreviousChapter();
  const nextChapter = getNextChapter();

  if (loading) return <div className="loading">Loading...</div>;
  if (!chapter) return <div className="error">Chapter not found</div>;
  if (!novel) return <div className="error">Novel not found</div>;

  return (
    <div className="reading-container">
      <div className="reading-header">
        <button 
          className="btn-secondary"
          onClick={() => navigate(`/novel/${novelId}`)}
        >
          ← Back to Novel
        </button>
        <h1>{novel.Title}</h1>
        <div className="reading-controls">
          <div className="font-size-control">
            <button 
              className="btn-sm"
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            >
              A−
            </button>
            <span>{fontSize}px</span>
            <button 
              className="btn-sm"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      <div className="reading-content-wrapper">
        <div className="reading-sidebar">
          <h3>Chapters</h3>
          <div className="chapter-list">
            {chapters.map((ch, index) => (
              <button
                key={ch.ChapterID}
                className={`chapter-list-item ${ch.ChapterID === chapter.ChapterID ? 'active' : ''}`}
                onClick={() => navigate(`/novel/${novelId}/chapter/${ch.ChapterID}`)}
                title={ch.Title}
              >
                <Icon name="FileText" />
                Ch. {ch.ChapterNumber}
              </button>
            ))}
          </div>
        </div>

        <div className="reading-main">
          <div className="chapter-header">
            <h2>Chapter {chapter.ChapterNumber}: {chapter.Title}</h2>
          </div>

          <div 
            className="chapter-content"
            style={{ fontSize: `${fontSize}px` }}
          >
            {chapter.Content?.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index}>{paragraph}</p>
              )
            ))}
          </div>

          <div className="chapter-navigation">
            {previousChapter ? (
              <button 
                className="btn-primary"
                onClick={() => navigate(`/novel/${novelId}/chapter/${previousChapter.ChapterID}`)}
              >
                <Icon name="FileText" />
                Previous Chapter
              </button>
            ) : (
              <div></div>
            )}

            <button 
              className="btn-secondary"
              onClick={() => navigate(`/novel/${novelId}`)}
            >
              <Icon name="Book" />
              Chapter List
            </button>

            {nextChapter ? (
              <button 
                className="btn-primary"
                onClick={() => navigate(`/novel/${novelId}/chapter/${nextChapter.ChapterID}`)}
              >
                Next Chapter
                <Icon name="FileText" />
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
