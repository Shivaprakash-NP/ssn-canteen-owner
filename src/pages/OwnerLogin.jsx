import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

const OwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const ALLOWED_OWNER_UID = "TOkH0DObOMSme70E6ZVWVFvztP83";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user.uid === ALLOWED_OWNER_UID) {
        navigate('/');
      } else {
        setError('Access Denied. You are not an authorized owner.');
        await signOut(auth); // Sign out the unauthorized user
      }
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Canteen Owner Login</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="owner@ssn.com"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default OwnerLogin;