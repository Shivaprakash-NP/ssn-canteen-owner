import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import OwnerLogin from './pages/OwnerLogin';
import OwnerDashboard from './pages/OwnerDashboard';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/login" element={<OwnerLogin />} />
          <Route path="/" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
