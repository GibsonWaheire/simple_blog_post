// index.js
const BASE_URL = "http://localhost:3000/posts";
let currentPostId = null;

document.addEventListener("DOMContentLoaded", main);

function main() {
  displayPosts();
  togglePostForm();
  addNewPostListener();
  addEditPostListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      if (posts.length === 0) {
        postList.innerHTML = '<p class="text-gray-500 text-center">No posts found. Create your first post!</p>';
        return;
      }

      posts.forEach(post => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition duration-200";
        div.innerHTML = 
        `
          <h3 class="font-semibold text-lg">${post.title || 'Untitled Post'}</h3>
        `;
        div.addEventListener("click", () => showPostDetail(post));
        postList.appendChild(div);
      });

      showPostDetail(posts[0]);
    })
    .catch(err => {
      console.error("Failed to load posts:", err);
      document.getElementById("post-list").innerHTML = '<p class="text-red-500 text-center">Loading posts...</p>';
    });
}

function showPostDetail(post) {
  currentPostId = post.id;
  const detail = document.getElementById("post-detail");
  const imageURL = post.image?.trim() || "https://via.placeholder.com/600x200";

  detail.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">${post.title || 'Untitled Post'}</h2>
      <button id="delete-btn" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Delete</button>
    </div>
    <img src="${imageURL}" alt="Post Image" class="rounded mb-4 w-full max-h-60 object-cover" /> 
    <p class="mb-2">${post.content || 'No content available'}</p>
    <h4 class="mb-4 font-semibold">Author: ${post.author || 'Unknown'}</h4>
    <button id="edit-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
    <button id="save-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">Save</button>
    <input type="text" id="edit-image" value="${post.image || ''}" placeholder="Update image URL" class="mt-4 p-2 border rounded-md w-full" />
  `;

  document.getElementById("edit-btn").addEventListener("click", () => {
    const form = document.getElementById("edit-post-form");
    document.getElementById("edit-title").value = post.title;
    document.getElementById("edit-content").value = post.content;
    form.classList.remove("hidden");
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    const updatedPost = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value,
      image: document.getElementById("edit-image").value
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        displayPosts();
        showPostDetail({ ...post, ...updatedPost });
        document.getElementById("edit-post-form").classList.add("hidden");
      })
      .catch(err => alert("Failed to update post."));
  });

  document.getElementById("delete-btn").addEventListener("click", () => {
    if (confirm("Delete this post?")) {
      fetch(`${BASE_URL}/${post.id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(() => {
          displayPosts();
          detail.innerHTML = "<p class='text-gray-500 text-center'>Post deleted.</p>";
        })
        .catch(err => alert("Failed to delete post."));
    }
  });
}

function togglePostForm() {
  const form = document.getElementById("new-post-form");
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "+ Add New Post";
  toggleBtn.className = "w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded mb-4";

  form.classList.add("hidden");
  form.parentNode.insertBefore(toggleBtn, form);

  toggleBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
  });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = form.title.value.trim();
    const content = form.content.value.trim();
    const author = form.author.value.trim();
    const imageURL = document.getElementById("new-image").value.trim();

    if (!title || !content || !author) {
      alert("Please fill in all required fields.");
      return;
    }

    const newPost = {
      title,
      content,
      author,
      image: imageURL,
      date: new Date().toISOString().split('T')[0]
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        form.reset();
        form.classList.add("hidden");
        displayPosts();
      })
      .catch(err => alert("Failed to create post."));
  });
}

function addEditPostListener() {
  const form = document.getElementById("edit-post-form");
  const cancelBtn = document.getElementById("cancel-edit");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("edit-title").value.trim();
    const content = document.getElementById("edit-content").value.trim();

    if (!title || !content) {
      alert("Please fill in both title and content.");
      return;
    }

    const updatedData = { title, content };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
      })
      .catch(err => alert("Failed to update post."));
  });

  cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden");
  });
}
