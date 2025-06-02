import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (router.query.message) {
      setMessage(router.query.message);
    }
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('sellorAuthToken');
    if (token) {
      router.push('/dashboard');
    }
  }, [router.query.message, router]);

  // Basic login form (non-functional for now, will be implemented later)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Placeholder for actual login logic
    setMessage('Login functionality is not yet implemented. Please register if you are a new user.');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Vendor Login</h2>
      {message && <p style={{ color: router.query.message && router.query.message.includes('logged out') ? 'green' : 'orange' }}>{message}</p>}

      <form onSubmit={handleLoginSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" id="email" name="email" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input type="password" id="password" name="password" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ padding: '10px 20px', color: 'white', backgroundColor: '#0070f3', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
          Login (Not Implemented)
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
