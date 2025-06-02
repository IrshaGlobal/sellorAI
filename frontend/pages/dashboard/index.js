import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // For messages like "Login successful!"

  useEffect(() => {
    // Display messages from query params
    if (router.query.message) {
      setMessage(router.query.message);
      // Clear the message from URL query params without full page reload
      router.replace('/dashboard', undefined, { shallow: true });
    }

    const token = localStorage.getItem('sellorAuthToken');
    if (!token) {
      router.push('/login?message=Please login to access the dashboard');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]); // Added router to dependency array for router.query.message

  const handleLogout = () => {
    localStorage.removeItem('sellorAuthToken');
    router.push('/login?message=You have been logged out successfully');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Loading...</p></div>;
  }

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Redirecting to login...</p></div>; 
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Vendor Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Logout
        </button>
      </header>

      {message && <p style={{ color: 'green', border: '1px solid green', padding: '10px', marginBottom: '20px' }}>{message}</p>}
      
      <p>Welcome to your store overview!</p>
      {/* These are placeholders, actual data will come from backend later */}
      <p>Total Sales (Lifetime): $0.00</p> 
      <p>Total Orders (Lifetime): 0</p>
      
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <Link href="/dashboard/products" passHref>
          <a style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Manage Products</a>
        </Link>
        <Link href="/dashboard/orders" passHref>
          <a style={{ padding: '10px 15px', backgroundColor: '#17a2b8', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>View Orders</a>
        </Link>
        <Link href="/dashboard/settings" passHref>
          <a style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Store Settings</a>
        </Link>
      </div>
    </div>
  );
}
