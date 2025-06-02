// Predefined category list (as per requirements, keep in sync with frontend)
const predefinedCategories = [
  'Apparel', 'Accessories', 'Home & Decor', 'Electronics', 
  'Beauty & Health', 'Toys & Games', 'Books', 'Other'
];

// Mock implementation of AI Product Service
// In a real application, this service would make an API call to an AI provider (OpenAI, Google Vertex AI, etc.)
async function generateDetailsFromImage(imageBuffer, mimeType) {
  console.log(`AI Service: Received image buffer of type ${mimeType}, size: ${imageBuffer.length} bytes.`);
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds delay

  // --- This is MOCK DATA ---
  // Replace this with actual AI API call logic in a later step
  const mockData = {
    title: `Mock AI Title - ${new Date().toISOString().slice(11,19)}`,
    description: "This is a mock AI-generated description. It emphasizes key features and benefits of the product shown in the image. It's designed to be engaging and informative for potential customers.",
    tags: ['mock tag', 'ai generated', 'product feature'], // Could be an array or comma-separated string
    suggestedCategory: predefinedCategories[Math.floor(Math.random() * predefinedCategories.length)], // Random suggestion
    // You might also include confidence scores or other metadata from the AI
  };
  
  console.log("AI Service: Returning mock data:", mockData);
  return mockData;
}

module.exports = {
  generateDetailsFromImage,
  predefinedCategories // Export categories if needed elsewhere in backend, though frontend has its own list
};
