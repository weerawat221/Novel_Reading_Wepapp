
import { useEffect, useState } from 'react';
import { readingHistoryAPI, novelAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

export const ReadingHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [novelCovers, setNovelCovers] = useState({});
  // No need for chapterTitles state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await readingHistoryAPI.getUserHistory(user.userID);
      const historyData = res.data.history || [];
      setHistory(historyData);
      // Fetch cover images for novels in history
      const covers = {};
      await Promise.all(historyData.map(async (item) => {
        try {
          const novelRes = await novelAPI.getById(item.NovelID, { countView: false });
          covers[item.NovelID] = novelRes.data.novel?.CoverImage || null;
        } catch {
          covers[item.NovelID] = null;
        }
      }));
      setNovelCovers(covers);
    } catch (err) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="author-tab-content">
      <h2>Reading History</h2>
      <div className="novels-table">
        {history.length === 0 ? (
          <p>No reading history yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Chapter</th>
                <th>Last Read</th>
                
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.NovelID}>
                  <td>
                    <Link to={`/novel/${item.NovelID}`}>
                      <img
                        src={novelCovers[item.NovelID] ? `http://localhost:3000${novelCovers[item.NovelID]}` : 'https://via.placeholder.com/60x80?text=No+Cover'}
                        alt={item.Title}
                        className="table-cover-image"
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/novel/${item.NovelID}/chapter/${item.ChapterID || ''}`}>
                      {item.Title}
                    </Link>
                  </td>
                  <td>
                    {item.ChapterID && item.ChapterNumber ? (
                      <Link to={`/novel/${item.NovelID}/chapter/${item.ChapterID}`}>
                        {`ตอนที่ ${item.ChapterNumber}`}
                      </Link>
                    ) : item.ChapterID ? (
                      <Link to={`/novel/${item.NovelID}/chapter/${item.ChapterID}`}>{item.ChapterID}</Link>
                    ) : 'N/A'}
                  </td>
                  <td>{new Date(item.LastReadAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReadingHistoryPage;
