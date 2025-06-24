# Simple Blog Post Manager

A simple single-page application (SPA) built using **HTML**, **CSS (Tailwind)**, and **Vanilla JavaScript** that allows users to **view**, **create**, **edit**, and **delete** blog posts. It uses a mock REST API powered by `json-server`.

---

## ✨ Features

- ✅ View all blog post titles and thumbnail images in a scrollable list.
- ✅ Click a post to view full details: title, content, author, and image.
- ✅ Add a new blog post with title, content, author, and image (via file input).
- ✅ Toggle visibility of the "Add New Post" form.
- ✅ Edit post title, content, and image URL.
- ✅ Delete a post with confirmation.
- ✅ Mobile-friendly, clean UI using Tailwind CSS.
- ✅ **Enhanced UX**: Loading states, success messages, form validation.
- ✅ **Image handling**: File size validation (5MB max), 
- ✅ **Error handling**: Comprehensive error messages and fallbacks.
- ✅ **Testing**: Built-in test suite for functionality verification.

---

## 🛠 Tech Stack

- **HTML5**
- **Tailwind CSS**
- **JavaScript (Vanilla)**
- **json-server** (Mock backend)

---

## 🧠 Application Logic Overview

### 🌀 Initialization Flow:
- **Page Load** → Triggers `main()` function
- `main()` calls `displayPosts()` to fetch and show all posts
- Posts are dynamically rendered into the DOM

### 📝 Form Handling:
**Image uploads:**
- Processed with FileReader to convert to base64
- Image preview shown before submission
- File size validation (5MB max)

**Text-only submissions:**
- Sent directly as JSON
- Form validation for required fields

**Both types:**
- Saved via POST request
- UI is refreshed automatically after success
- Loading states and success messages

### 🛠️ Post Management:
- **Click on Post** → Loads full details
- **Edit Post:**
  - Click Edit → Prefills hidden form
  - Click Save → Sends PATCH request to server
  - Enhanced validation and error handling
- **Delete Post:**
  - Click Delete → Confirmation dialog
  - Sends DELETE request
  - Automatically refreshes post list

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:GibsonWaheire/simple_blog_post.git
cd simple_blog_post
```

### 2. Install json-server

Make sure you have json-server installed globally or locally:

```bash
npm install -g json-server
```

### 3. Start the server

```bash
json-server --watch db.json --port 3000
```

### 4. Open the app

Just open the `index.html` in your browser. No build steps required.

---

## 📁 Project Structure

```
simple_blog_post/
│
├── db.json                # Mock database for json-server
├── index.html             # Main HTML file
├── css/
│   └── style.css          # (Optional) Additional styling
├── src/
│   ├── index.js           # Main JavaScript logic
│   └── test.js            # Test suite for functionality
└── README.md              # Project documentation
```

---

## 🧪 Testing

The application includes a built-in test suite. To run tests:

1. Open the browser console
2. Run: `BlogPostManagerTests.runAllTests()`

Tests include:
- ✅ DOM element validation
- ✅ API connection testing
- ✅ Form validation
- ✅ Image file validation

---

## 🧠 How It Works

- `index.js` fetches posts from the json-server and renders them dynamically.
- Post form is hidden by default and toggled via "+ Add New Post" button.
- Clicking a post shows its full details and allows editing or deleting.
- Images are displayed either from uploaded file (previewed) or URL string.
- Enhanced error handling and user feedback throughout.

---

## 📌 Sample JSON Format (db.json)

```json
{
  "posts": [
    {
      "id": 1,
      "title": "Hello World",
      "content": "This is my first blog post!",
      "author": "Gibson",
      "image": "https://via.placeholder.com/600x200",
      "date": "2024-02-25"
    }
  ]
}
```

---

## 🔧 Recent Improvements

- **Enhanced Error Handling**: Comprehensive error messages and fallbacks
- **Form Validation**: Required field validation and file size limits
- **Loading States**: Visual feedback during operations
- **Success Messages**: Toast notifications for successful operations
- **Better UX**: Improved button states, transitions, and accessibility
- **Testing Suite**: Built-in functionality testing

---

## 📌 Tips

- If you push to GitHub, use `git pull origin main --allow-unrelated-histories` if you get rejection errors.
- Make sure to commit changes clearly with messages like:
  - `git commit -m "Added image editing feature"`
  - `git commit -m "Enhanced form validation and error handling"`
- The app requires json-server to be running for full functionality.

git commit -m "Added image editing feature"

## 📃 License

📃 License
MIT License — free to use and modify.

---

## 👨‍💻 Author

Gibson Waheire