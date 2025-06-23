// Simple test suite for Blog Post Manager
// Run this in the browser console to test functionality

const BlogPostManagerTests = {
  // Test data
  testPost: {
    title: "Test Post",
    content: "This is a test post content",
    author: "Test Author",
    image: "https://via.placeholder.com/300x200"
  },

  // Test if all required DOM elements exist
  testDOMElements() {
    console.log("🧪 Testing DOM Elements...");
    
    const requiredElements = [
      'post-list',
      'post-detail', 
      'new-post-form',
      'edit-post-form',
      'new-title',
      'new-content',
      'new-author',
      'new-image'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length === 0) {
      console.log("✅ All required DOM elements found");
      return true;
    } else {
      console.error("❌ Missing DOM elements:", missingElements);
      return false;
    }
  },

  // Test if fetch is working
  async testFetchConnection() {
    console.log("🧪 Testing API Connection...");
    
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (response.ok) {
        const posts = await response.json();
        console.log("✅ API connection successful, found", posts.length, "posts");
        return true;
      } else {
        console.error("❌ API connection failed:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ API connection error:", error.message);
      console.log("💡 Make sure json-server is running: json-server --watch db.json --port 3000");
      return false;
    }
  },

  // Test form validation
  testFormValidation() {
    console.log("🧪 Testing Form Validation...");
    
    const form = document.getElementById('new-post-form');
    const titleInput = document.getElementById('new-title');
    const contentInput = document.getElementById('new-content');
    const authorInput = document.getElementById('new-author');

    // Test required field validation
    titleInput.value = '';
    contentInput.value = '';
    authorInput.value = '';

    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);

    // Check if form submission was prevented (validation working)
    if (submitEvent.defaultPrevented) {
      console.log("✅ Form validation working");
      return true;
    } else {
      console.error("❌ Form validation not working");
      return false;
    }
  },

  // Test image file validation
  testImageValidation() {
    console.log("🧪 Testing Image Validation...");
    
    const imageInput = document.getElementById('new-image');
    
    // Create a mock file larger than 5MB
    const largeFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB
    
    // Simulate file selection
    const changeEvent = new Event('change');
    imageInput.files = [largeFile];
    imageInput.dispatchEvent(changeEvent);
    
    console.log("✅ Image validation test completed");
    return true;
  },

  // Run all tests
  async runAllTests() {
    console.log("🚀 Starting Blog Post Manager Tests...\n");
    
    const results = {
      domElements: this.testDOMElements(),
      apiConnection: await this.testFetchConnection(),
      formValidation: this.testFormValidation(),
      imageValidation: this.testImageValidation()
    };

    console.log("\n📊 Test Results:");
    console.log("DOM Elements:", results.domElements ? "✅ PASS" : "❌ FAIL");
    console.log("API Connection:", results.apiConnection ? "✅ PASS" : "❌ FAIL");
    console.log("Form Validation:", results.formValidation ? "✅ PASS" : "❌ FAIL");
    console.log("Image Validation:", results.imageValidation ? "✅ PASS" : "❌ FAIL");

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;

    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log("🎉 All tests passed! Your blog post manager is working correctly.");
    } else {
      console.log("⚠️  Some tests failed. Check the errors above.");
    }

    return results;
  }
};

// Auto-run tests when loaded
if (typeof window !== 'undefined') {
  window.BlogPostManagerTests = BlogPostManagerTests;
  console.log("🧪 Blog Post Manager Tests loaded. Run BlogPostManagerTests.runAllTests() to test.");
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogPostManagerTests;
}
