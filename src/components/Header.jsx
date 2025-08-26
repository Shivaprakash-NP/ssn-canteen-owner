import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { auth } from '../utils/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { FiLogOut, FiList } from 'react-icons/fi';

const Header = () => {
  const { setCart } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setCart([]);
    navigate('/login');
  };
  
  const goHome = () => {
    navigate('/');
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-blue-600 cursor-pointer" onClick={goHome}>
          SSN Eats
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-5">
              <Link to="/history" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold transition-colors duration-300">
                <FiList />
                <span>My Orders</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors duration-300">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;