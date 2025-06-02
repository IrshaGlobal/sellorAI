import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic client-side validation
    if (!storeName || !email || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
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
      const response = await axios.post(`${apiUrl}/auth/register`, {
        storeName,
        email,
        password,
      });

      if (response.data && response.data.token) {
        // Store JWT (e.g., in localStorage)
        localStorage.setItem('sellorAuthToken', response.data.token);
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Create Your Store</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="storeName" style={{ display: 'block', marginBottom: '5px' }}>Store Name:</label>
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
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
            minLength="6"
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <Link href="/login"><a>Login here</a></Link>
      </p>
    </div>
  );
}
