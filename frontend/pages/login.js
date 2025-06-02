import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For messages like "Logged out successfully"
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Display messages from query params (e.g., after logout or failed dashboard access)
    if (router.query.message && !error) { // Avoid overwriting login errors
      setMessage(router.query.message);
      // Clear the message from URL query params without full page reload
      router.replace('/login', undefined, { shallow: true });
    }

    // If already logged in (e.g. user navigates to /login manually), redirect to dashboard
    const token = localStorage.getItem('sellorAuthToken');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]); // Effect dependencies

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('sellorAuthToken', response.data.token);
        router.push('/dashboard?message=Login successful!'); // Redirect to dashboard
      } else {
        // Should not happen if backend is consistent
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Vendor Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'orange' }}>{message}</p>}
      
      <form onSubmit={handleLoginSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            color: 'white', 
            backgroundColor: '#0070f3', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <Link href="/register"><a>Register here</a></Link>
      </p>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        <Link href="/"><a>Back to Home</a></Link>
      </p>
    </div>
  );
}
