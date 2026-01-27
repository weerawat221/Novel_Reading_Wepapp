import { useState, useEffect } from 'react';
import { novelAPI, reportAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Icon } from '../components/Icons';

export const AuthorReportPage = () => {
  const { user } = useAuth();
  const [novels, setNovels] = useState([]);
  const [viewsData, setViewsData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [reportType, setReportType] = useState('views'); // 'views' or 'comments'
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get author's novels
      const novelsResponse = await novelAPI.getAll({ search: '' });
      const authorNovels = novelsResponse.data.novels?.filter(n => n.AuthorID === user?.userID) || [];
      setNovels(authorNovels);

      // Get author views report
      const viewsResponse = await reportAPI.getAuthorViews();
      setViewsData(viewsResponse.data.data || []);

      // Get all comments to filter by novel and chapter
      const commentsResponse = await reportAPI.getAuthorComments();
      setCommentsData(commentsResponse.data.data || []);
      setComments(commentsResponse.data.data || []);

    //   // Set first novel as default
    //   if (authorNovels.length > 0) {
    //     setSelectedNovel(authorNovels[0].NovelID);
    //   }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (reportType === 'views') {
      if (selectedNovel) {
        // Show chapters for selected novel
        return viewsData
          .filter(item => item.NovelID === selectedNovel)
          .map(item => ({
            name: item.Title || `Chapter ${item.ChapterNumber || 'Unknown'}`,
            value: item.ViewCount || 0
          }));
      } else {
        // Show all novels
        const novelViews = {};
        viewsData.forEach(item => {
          const novelTitle = novels.find(n => n.NovelID === item.NovelID)?.Title || `Novel ${item.NovelID}`;
          novelViews[novelTitle] = (novelViews[novelTitle] || 0) + (item.ViewCount || 0);
        });
        return Object.entries(novelViews).map(([name, value]) => ({ name, value }));
      }
    } else {
      // Comments report
      if (selectedNovel) {
        const novelComments = comments.filter(c => c.NovelID === selectedNovel);
        return novelComments.map(item => ({
          name: `${item.Title || 'Chapter'} (${item.UserName || 'Anonymous'})`,
          value: 1
        }));
      } else {
        // Show comment count per novel
        const novelComments = {};
        comments.forEach(item => {
          const novelTitle = novels.find(n => n.NovelID === item.NovelID)?.Title || `Novel ${item.NovelID}`;
          novelComments[novelTitle] = (novelComments[novelTitle] || 0) + 1;
        });
        return Object.entries(novelComments).map(([name, value]) => ({ name, value }));
      }
    }
  };

  const chartData = getChartData();
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="author-tab-content">
      <h2><Icon name="BarChart" />Reports & Statistics</h2>

      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
            className="report-select"
          >
            <option value="views">View Count</option>
            <option value="comments">Comment Count</option>
          </select>
        </div>

        <div className="control-group">
          <label>Novel:</label>
          <select 
            value={selectedNovel || ''} 
            onChange={(e) => setSelectedNovel(e.target.value ? parseInt(e.target.value) : null)}
            className="report-select"
          >
            <option value="">All Novels</option>
            {novels.map(novel => (
              <option key={novel.NovelID} value={novel.NovelID}>
                {novel.Title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="report-stats">
        <div className="stat-box">
          <h3>Total {reportType === 'views' ? 'Views' : 'Comments'}</h3>
          <div className="stat-value">{totalValue.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <h3>Number of {reportType === 'views' ? 'Chapters/Novels' : 'Comments'}</h3>
          <div className="stat-value">{chartData.length}</div>
        </div>
      </div>

      <div className="chart-container">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No data available for this selection.</p>
        )}
      </div>

      <div className="report-table">
        <h3>Detailed Report</h3>
        {chartData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>{reportType === 'views' ? 'Chapter/Novel' : 'Comment'}</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.value.toLocaleString()}</td>
                  <td>{((item.value / totalValue) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data to display</p>
        )}
      </div>
    </div>
  );
};
