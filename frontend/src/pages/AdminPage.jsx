import { useState, useEffect } from 'react';
import { reportAPI } from '../api/apiClient';
import { Icon } from '../components/Icons';
import '../styles/Pages.css';

export const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsResponse = await reportAPI.getSystemStats();
      setStats(statsResponse.data.stats);

      const monthlyResponse = await reportAPI.getMonthlyUsers();
      const categoryResponse = await reportAPI.getViewsByCategory();
      const authorResponse = await reportAPI.getViewsByAuthor();
      const dailyUsageResponse = await reportAPI.getDailyUsage();
      const yearlyUsageResponse = await reportAPI.getYearlyUsage();
      const monthlyUsageResponse = await reportAPI.getMonthlyUsage();

      setReports({
        monthlyUsers: monthlyResponse.data.data,
        viewsByCategory: categoryResponse.data.data,
        viewsByAuthor: authorResponse.data.data,
        dailyUsage: dailyUsageResponse.data.data,
        yearlyUsage: yearlyUsageResponse.data.data,
        monthlyUsage: monthlyUsageResponse.data.data,
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <h1><Icon name="Pen" />Admin Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3><Icon name="User" /> Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3><Icon name="Book" /> Total Novels</h3>
            <p className="stat-value">{stats.totalNovels}</p>
          </div>
          <div className="stat-card">
            <h3><Icon name="FileText" /> Total Chapters</h3>
            <p className="stat-value">{stats.totalChapters}</p>
          </div>
          <div className="stat-card">
            <h3><Icon name="MessageCircle" /> Total Comments</h3>
            <p className="stat-value">{stats.totalComments}</p>
          </div>
          <div className="stat-card">
            <h3><Icon name="Eye" /> Total Views</h3>
            <p className="stat-value">{stats.totalViews}</p>
          </div>
          <div className="stat-card">
            <h3><Icon name="Pen" /> Authors</h3>
            <p className="stat-value">{stats.totalAuthors}</p>
          </div>
        </div>
      )}

      <h2><Icon name="BarChart" /> Daily Usage Report</h2>
      <div className="report-section">
        {reports.dailyUsage?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Unique Users</th>
                <th>Total Reads</th>
              </tr>
            </thead>
            <tbody>
              {reports.dailyUsage.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td>{row.userCount}</td>
                  <td>{row.totalReads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <h2><Icon name="BarChart" /> Monthly Usage Report</h2>
      <div className="report-section">
        {reports.monthlyUsage?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Unique Users</th>
                <th>Total Reads</th>
              </tr>
            </thead>
            <tbody>
              {reports.monthlyUsage.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.month}</td>
                  <td>{row.userCount}</td>
                  <td>{row.totalReads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <h2><Icon name="BarChart" /> Yearly Usage Report</h2>
      <div className="report-section">
        {reports.yearlyUsage?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Unique Users</th>
                <th>Total Reads</th>
              </tr>
            </thead>
            <tbody>
              {reports.yearlyUsage.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.year}</td>
                  <td>{row.userCount}</td>
                  <td>{row.totalReads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <h2><Icon name="TrendingUp" /> Views by Category</h2>
      <div className="report-section">
        {reports.viewsByCategory?.length > 0 ? (
          <div className="cards-grid">
            {reports.viewsByCategory.map((row, idx) => (
              <div key={idx} className="report-card">
                <h4>{row.CategoryName}</h4>
                <p>Novels: {row.novelCount}</p>
                <p>Views: {row.totalViews}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <h2><Icon name="Pen" /> Views by Author</h2>
      <div className="report-section">
        {reports.viewsByAuthor?.length > 0 ? (
          <div className="cards-grid">
            {reports.viewsByAuthor.map((row, idx) => (
              <div key={idx} className="report-card">
                <h4>{row.Username}</h4>
                <p>Novels: {row.novelCount}</p>
                <p>Views: {row.totalViews}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

    </div>
  );
};
