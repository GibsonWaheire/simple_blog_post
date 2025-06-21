# Simple Blog Post Manager

A simple single-page application (SPA) built using **HTML**, **CSS (Tailwind)**, and **Vanilla JavaScript** that allows users to **view**, **create**, **edit**, and **delete** blog posts. It uses a mock REST API powered by `json-server`.

---

## ✨ Features

- ✅ View all blog post titles and thumbnail images in a scrollable list.
- ✅ Click a post to view full details: title, content, author, and image.
- ✅ Add a new blog post with title, content, author, and image (via file input).
- ✅ Toggle visibility of the "Add New Post" form.
- ✅ Edit post title, content, and image URL.
- ✅ Delete a post.
- ✅ Mobile-friendly, clean UI using Tailwind CSS.

---

## 🛠 Tech Stack

- **HTML5**
- **Tailwind CSS**
- **JavaScript (Vanilla)**
- **json-server** (Mock backend)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:GibsonWaheire/simple_blog_post.git
cd simple_blog_post
2. Install json-server
Make sure you have json-server installed globally or locally:

bash
Copy
Edit
npm install -g json-server
3. Start the server
bash
Copy
Edit
json-server --watch db.json --port 3000
4. Open the app
Just open the index.html in your browser. No build steps required.

📁 Project Structure
bash
Copy
Edit
simple_blog_post/
│
├── db.json                # Mock database for json-server
├── index.html             # Main HTML file
├── css/
│   └── style.css          # (Optional) Additional styling
├── src/
│   └── index.js           # Main JavaScript logic
└── README.md              # Project documentation
🧠 How It Works
index.js fetches posts from the json-server and renders them dynamically.

Post form is hidden by default and toggled via "+ Add New Post" button.

Clicking a post shows its full details and allows editing or deleting.

Images are displayed either from uploaded file (previewed) or URL string.

🧪 Sample JSON Format (db.json)
json
Copy
Edit
{
  "posts": [
    {
      "id": 1,
      "title": "Hello World",
      "content": "This is my first blog post!",
      "author": "Gibson",
      "image": "https://via.placeholder.com/600x200"
    }
  ]
}
📌 Tips
If you push to GitHub, use git pull origin main --allow-unrelated-histories if you get rejection errors.

Make sure to commit changes clearly with messages like:

git commit -m "Added image editing feature"

git commit -m "Displayed image previews in post list"

📃 License
MIT License — free to use and modify.

👨‍💻 Author
Gibson Waheire