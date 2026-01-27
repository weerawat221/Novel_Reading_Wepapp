import { useState } from 'react';
import { AuthorCreatePage } from './AuthorCreatePage';
import { AuthorEditPage } from './AuthorEditPage';
import { AuthorReportPage } from './AuthorReportPage';
import { Icon } from '../components/Icons';
import '../styles/Pages.css';

export const AuthorPage = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="author-page-container">
      <div className="author-sidebar">
        <h2><Icon name="Book" />Author Hub</h2>
        <nav className="sidebar-nav">
          <button
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <Icon name="Plus" />Create
          </button>
          <button
            className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <Icon name="Edit" />Edit
          </button>
          <button
            className={`tab-button ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <Icon name="BarChart" />Reports
          </button>
        </nav>
      </div>

      <div className="author-content">
        {activeTab === 'create' && <AuthorCreatePage />}
        {activeTab === 'edit' && <AuthorEditPage />}
        {activeTab === 'report' && <AuthorReportPage />}
      </div>
    </div>
  );
};
