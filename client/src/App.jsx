import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './Dashboard';
import Logs from './pages/Logs';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="empty-state" style={{ padding: '60px 20px' }}>
      <div className="empty-state-icon">404</div>
      <h1>Page Not Found</h1>
      <a href="/" className="btn btn-primary">← Back to Dashboard</a>
    </div>
  );
}

export default App;
