import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure axios is imported
import { useRouter } from 'next/router'; // For redirecting if auth fails

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('sellorAuthToken');
      if (!token) {
        setError('Authentication token not found. Please login.');
        setLoading(false);
        router.push('/login?message=Session expired. Please login again.'); // Redirect to login
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await axios.get(`${apiUrl}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Authentication failed. Please login again.');
          router.push('/login?message=Session expired. Please login again.'); // Redirect to login
        } else {
          setError('Failed to fetch products. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [router]); // Added router to dependency array

  const handleEdit = (productId) => {
    // Placeholder for edit functionality
    alert(`Edit product with ID: ${productId} (Not implemented)`);
    // router.push(`/dashboard/products/edit/${productId}`); // Example navigation
  };

  const handleDelete = async (productId) => {
    // Placeholder for delete functionality
    if (window.confirm(`Are you sure you want to delete product ID: ${productId}? (Not implemented)`)) {
      // try {
      //   const token = localStorage.getItem('sellorAuthToken');
      //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      //   await axios.delete(`${apiUrl}/products/${productId}`, {
      //     headers: { Authorization: `Bearer ${token}` }
      //   });
      //   setProducts(products.filter(p => p.product_id !== productId)); // Update UI
      //   alert('Product deleted (simulated).');
      // } catch (err) {
      //   console.error('Failed to delete product:', err);
      //   setError('Failed to delete product.');
      // }
      alert(`Delete product with ID: ${productId} (Not implemented)`);
    }
  };
  
  const tableHeaderStyle = { border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f9f9f9' };
  const tableCellStyle = { border: '1px solid #ddd', padding: '10px', verticalAlign: 'middle' };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Products</h1>
        <Link href="/dashboard/products/new" passHref>
          <a style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            + Add New Product
          </a>
        </Link>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
      
      {!loading && !error && products.length === 0 && (
        <div style={{textAlign: 'center', padding: '30px', border: '1px dashed #ccc', borderRadius: '5px'}}>
            <p style={{fontSize: '1.2em'}}>No products found.</p>
            <p>Ready to start selling? Add your first product!</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Image</th>
              <th style={tableHeaderStyle}>Title</th>
              <th style={tableHeaderStyle}>Price</th>
              <th style={tableHeaderStyle}>Inventory</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.product_id}>
                <td style={tableCellStyle}>
                  {product.image_url ? 
                    <img src={product.image_url} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> : 
                    <div style={{width: '50px', height: '50px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize:'0.8em', color:'#aaa'}}>No Img</div>
                  }
                </td>
                <td style={tableCellStyle}>{product.title}</td>
                <td style={tableCellStyle}>${parseFloat(product.price).toFixed(2)}</td>
                <td style={tableCellStyle}>{product.inventory_quantity}</td>
                <td style={{ ...tableCellStyle, textTransform: 'capitalize' }}>
                    <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: product.status === 'published' ? '#28a745' : '#ffc107',
                        color: product.status === 'published' ? 'white' : 'black'
                    }}>
                        {product.status}
                    </span>
                </td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleEdit(product.product_id)} style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(product.product_id)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: '30px' }}>
        <Link href="/dashboard">
          <a style={{textDecoration:'none', color: '#007bff'}}>&larr; Back to Dashboard</a>
        </Link>
      </div>
    </div>
  );
}
