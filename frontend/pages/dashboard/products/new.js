import { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { useRouter } from 'next/router';
import Link from 'next/link';

// Predefined category list (as per requirements)
const predefinedCategories = [
  'Apparel', 'Accessories', 'Home & Decor', 'Electronics', 
  'Beauty & Health', 'Toys & Games', 'Books', 'Other'
];

export default function NewProductPage() {
  const router = useRouter();
  
  const [productImageFile, setProductImageFile] = useState(null); // We are not saving the file itself in this step
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(''); 
  const [suggestedCategory, setSuggestedCategory] = useState('');

  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [inventoryQuantity, setInventoryQuantity] = useState(1);
  
  const [isAiDataLoaded, setIsAiDataLoaded] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false); // New state for saving
  const [error, setError] = useState('');
  const [formFieldsDisabled, setFormFieldsDisabled] = useState(true); 

  useEffect(() => {
    if (isAiDataLoaded) {
      setFormFieldsDisabled(false);
    }
  }, [isAiDataLoaded]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setError('Image size exceeds 5MB limit. Please choose a smaller file.');
        setProductImageFile(null);
        setImagePreviewUrl('');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Invalid file type. Please upload a JPEG or PNG image.');
        setProductImageFile(null);
        setImagePreviewUrl('');
        return;
      }

      setProductImageFile(file); // Keep file info if needed later, not sent in this step
      setImagePreviewUrl(URL.createObjectURL(file));
      setError(''); 
      setLoadingAi(true);
      setIsAiDataLoaded(false); 
      setFormFieldsDisabled(true);

      const formData = new FormData();
      formData.append('productImage', file);

      const token = localStorage.getItem('sellorAuthToken');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoadingAi(false);
        router.push('/login?message=Session expired. Please login again.');
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await axios.post(`${apiUrl}/ai/generate-product-details-from-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        const aiData = response.data;
        setTitle(aiData.title || '');
        setDescription(aiData.description || '');
        setTags(Array.isArray(aiData.tags) ? aiData.tags.join(', ') : (aiData.tags || ''));
        setSuggestedCategory(aiData.suggestedCategory || '');
        
        setIsAiDataLoaded(true);
        setFormFieldsDisabled(false);

      } catch (err) {
        console.error('AI processing error:', err);
        let errorMessage = 'Failed to process image with AI. Please try again or fill details manually.';
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        // Allow manual input if AI fails by enabling the form
        setIsAiDataLoaded(true); // Treat as "AI attempted"
        setFormFieldsDisabled(false); 
      } finally {
        setLoadingAi(false);
      }
    }
  };

  const handleSave = async (status = 'draft') => {
    setError('');
    if (!title) {
        setError('Product title is required.');
        return;
    }
    if (!price || parseFloat(price) <= 0) {
        setError('Please enter a valid price.');
        return;
    }
    const invQty = parseInt(inventoryQuantity);
    if (isNaN(invQty) || invQty < 0) {
        setError('Please enter a valid inventory quantity.');
        return;
    }

    setSavingProduct(true);

    const productData = {
      title,
      description,
      price: parseFloat(price),
      sku,
      inventory_quantity: invQty, // Use the parsed integer
      category: suggestedCategory,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Convert comma-separated string to array of strings
      status,
      image_url: null // Not handling actual image URL persistence in this step
    };

    const token = localStorage.getItem('sellorAuthToken');
    if (!token) {
      setError('Authentication token not found. Please login again.');
      setSavingProduct(false);
      router.push('/login?message=Session expired. Please login again.');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      await axios.post(`${apiUrl}/products`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Redirect to product list page with a success message
      router.push('/dashboard/products?message=Product saved successfully!');
    } catch (err) {
      console.error('Failed to save product:', err);
      let errorMessage = 'Failed to save product. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setSavingProduct(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
  const disabledInputStyle = { ...inputStyle, backgroundColor: '#e9ecef', cursor: 'not-allowed', color: '#6c757d' };
  const buttonStyle = { padding: '10px 20px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em'};
  const disabledButtonStyle = { ...buttonStyle, backgroundColor: '#adb5bd', cursor: 'not-allowed' };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Add New Product (AI Assisted)</h1>
        <Link href="/dashboard/products">
          <a style={{textDecoration:'none', color: '#007bff'}}>&larr; Back to Products</a>
        </Link>
      </div>

      {error && <p style={{ color: 'white', backgroundColor: '#dc3545', border: '1px solid #dc3545', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>{error}</p>}

      <div style={{ marginBottom: '30px', border: '1px solid #eee', padding: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <label htmlFor="productImageUpload" style={labelStyle}>Step 1: Upload Product Image (Max 5MB, JPEG/PNG)</label>
        <input type="file" id="productImageUpload" accept="image/jpeg, image/png" onChange={handleImageUpload} style={{ display: 'block', marginBottom: '10px', padding: '10px', border: '1px dashed #ccc', borderRadius: '4px', width: '100%' }} disabled={loadingAi || savingProduct} />
        {imagePreviewUrl && <img src={imagePreviewUrl} alt="Product Preview" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px', objectFit: 'contain' }} />}
        {loadingAi && <p style={{color: '#007bff', fontWeight: 'bold'}}>AI is analyzing your product... ✨ Please wait.</p>}
      </div>
      
      { (imagePreviewUrl || isAiDataLoaded) && (
        <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h2 style={{borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px'}}>Step 2: Review & Complete Product Details</h2>
          
          <label htmlFor="title" style={labelStyle}>Product Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} style={(formFieldsDisabled || savingProduct) ? disabledInputStyle : inputStyle} disabled={formFieldsDisabled || savingProduct} />

          <label htmlFor="description" style={labelStyle}>Product Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" style={(formFieldsDisabled || savingProduct) ? disabledInputStyle : inputStyle} disabled={formFieldsDisabled || savingProduct}></textarea>

          <label htmlFor="price" style={labelStyle}>Price ($):</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0.01" step="0.01" required style={savingProduct ? disabledInputStyle : inputStyle} disabled={savingProduct} />
          
          <label htmlFor="tags" style={labelStyle}>Tags/Keywords (comma-separated):</label>
          <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} style={(formFieldsDisabled || savingProduct) ? disabledInputStyle : inputStyle} disabled={formFieldsDisabled || savingProduct}/>

          <label htmlFor="category" style={labelStyle}>Category:</label>
          <select id="category" value={suggestedCategory} onChange={(e) => setSuggestedCategory(e.target.value)} style={(formFieldsDisabled || savingProduct) ? disabledInputStyle : inputStyle} disabled={formFieldsDisabled || savingProduct}>
            <option value="">{formFieldsDisabled && !isAiDataLoaded ? "Category (AI will suggest)" : "Select or Confirm Category"}</option>
            {predefinedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <label htmlFor="sku" style={labelStyle}>SKU (Optional):</label>
          <input type="text" id="sku" value={sku} onChange={(e) => setSku(e.target.value)} style={savingProduct ? disabledInputStyle : inputStyle} disabled={savingProduct}/>

          <label htmlFor="inventoryQuantity" style={labelStyle}>Inventory Quantity:</label>
          <input type="number" id="inventoryQuantity" value={inventoryQuantity} onChange={(e) => setInventoryQuantity(parseInt(e.target.value))} min="0" step="1" required style={savingProduct ? disabledInputStyle : inputStyle} disabled={savingProduct}/>
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => handleSave('draft')} 
              disabled={loadingAi || formFieldsDisabled || savingProduct}
              style={(loadingAi || formFieldsDisabled || savingProduct) ? disabledButtonStyle : {...buttonStyle, backgroundColor: '#6c757d'}}
            >
              {savingProduct ? 'Saving...' : 'Save as Draft'}
            </button>
            <button 
              onClick={() => handleSave('published')} 
              disabled={loadingAi || formFieldsDisabled || savingProduct}
              style={(loadingAi || formFieldsDisabled || savingProduct) ? disabledButtonStyle : {...buttonStyle, backgroundColor: '#28a745'}}
            >
              {savingProduct ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
