import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sellorAuthToken');
    if (!token) {
      router.push('/login?message=Please login to access the dashboard');
    } else {
      // Here you might want to validate the token with the backend in a real app
      // For MVP, just checking existence is a basic step.
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('sellorAuthToken');
    router.push('/login?message=You have been logged out');
  };

  if (loading) {
    return <p>Loading...</p>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // This will typically not be seen if redirect happens fast enough
    return <p>Redirecting to login...</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Vendor Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ padding: '10px 15px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>
      <p>Welcome to your store overview!</p>
      <p>Total Sales (Lifetime): $0.00</p>
      <p>Total Orders (Lifetime): 0</p>

      <div style={{ marginTop: '20px' }}>
        <Link href="/dashboard/products" passHref>
          <a style={{ marginRight: '10px', textDecoration: 'underline', color: 'blue' }}>Manage Products</a>
        </Link>
        <Link href="/dashboard/orders" passHref>
          <a style={{ marginRight: '10px', textDecoration: 'underline', color: 'blue' }}>View Orders</a>
        </Link>
        <Link href="/dashboard/settings" passHref>
          <a style={{ textDecoration: 'underline', color: 'blue' }}>Store Settings</a>
        </Link>
      </div>
      {/* Quick Action Button: "Add New Product" can be added here later */}
    </div>
  );
}
