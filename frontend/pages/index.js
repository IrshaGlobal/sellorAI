import Link from 'next/link'; // Import Link component

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '50px' }}>
      <header style={{ marginBottom: '50px' }}>
        <h1>Launch Your Online Store in Minutes with AI Power.</h1>
        <p style={{ fontSize: '1.2em', color: '#555' }}>
          Upload an image, our AI does the rest. Start selling today!
        </p>
        <Link href="/register" passHref>
          <button
            style={{
              padding: '15px 30px',
              fontSize: '1.1em',
              color: 'white',
              backgroundColor: '#0070f3',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Create Your Store Now
          </button>
        </Link>
      </header>

      <section style={{ marginBottom: '50px' }}>
        <h2>How It Works (Simplified)</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          <div style={{ width: '20%' }}>
            <p><strong>Step 1: Sign Up.</strong><br/>Quick and easy registration.</p>
          </div>
          <div style={{ width: '20%' }}>
            <p><strong>Step 2: Upload Product Image.</strong><br/>Our AI gets to work.</p>
          </div>
          <div style={{ width: '20%' }}>
            <p><strong>Step 3: AI Generates Product Details.</strong><br/>Titles, descriptions, and more.</p>
          </div>
          <div style={{ width: '20%' }}>
            <p><strong>Step 4: Customize Your Store & Launch.</strong><br/>Go live in minutes.</p>
          </div>
        </div>
      </section>

      {/* Placeholder for other sections like Key Features, Pricing, FAQ */}

      <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '0.9em', color: '#777' }}>
        <p>&copy; {new Date().getFullYear()} sellor.ai</p>
        <p>
          <Link href="/terms"><a>Terms of Service</a></Link> | <Link href="/privacy"><a>Privacy Policy</a></Link>
        </p>
      </footer>
    </div>
  );
}

// Basic placeholder pages for terms and privacy for Link components to work without error
// These would eventually be actual pages.
export async function getStaticProps() {
  // This function is not strictly necessary for this page if it's purely static,
  // but good to have if we add data fetching later.
  // For now, it ensures the page is rendered as static HTML.
  return {
    props: {}, // will be passed to the page component as props
  }
}
