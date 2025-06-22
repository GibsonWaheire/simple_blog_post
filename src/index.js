document.addEventListener("DOMContentLoaded", main);

// ✅ Static JSON file path (GitHub Pages compatible)
const BASE_URL = "./db.json";
// const BASE_URL ="http://localhost:3000/posts";   // Assumes db.json is in root directory
let currentPostId = null;

function main() {
  displayPosts();
  togglePostForm();
  addNewPostListener();
  addEditPostListener();
}

// ✅ Fetch posts from static db.json and display them
function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const posts = data.posts;
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      posts.forEach(post => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition duration-200";

        div.innerHTML = `
          <img src="${post.image || 'https://via.placeholder.com/100x60'}" alt="thumb" class="w-full h-32 object-cover rounded mb-2">
          <h3 class="font-semibold text-lg">${post.title}</h3>
        `;

        div.addEventListener("click", () => showPostDetail(post));
        postList.appendChild(div);
      });

      if (posts.length > 0) {
        showPostDetail(posts[0]);
      }
    })
    .catch(err => {
      console.error("Failed to load posts:", err);
    });
}

// ✅ Static version of post details (no backend fetch by ID)
function showPostDetail(post) {
  currentPostId = post.id;
  const detail = document.getElementById("post-detail");

  const imageURL =
    typeof post.image === "string" && post.image.trim() !== ""
      ? post.image
      : "https://via.placeholder.com/600x200";

  detail.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">${post.title}</h2>
      <button id="delete-btn" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Delete</button>
    </div>
    <img id="post-image-${post.id}" src="${imageURL}" alt="Post Image" class="rounded mb-4 w-full max-h-60 object-cover" /> 
    <p class="mb-2">${post.content}</p>
    <h4 class="mb-4 font-semibold">Author: ${post.author}</h4>
    <button id="edit-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
    <button id="save-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">Save</button>
    <input type="text" id="edit-image-${post.id}" value="${post.image || ''}" placeholder="Update image URL" class="mt-4 p-2 border rounded-md w-full" />
    <div class="text-center my-2 text-gray-500">— OR —</div>
    <input type="file" id="upload-image-${post.id}" accept="image/*" class="p-2 border rounded-md w-full" />
  `;

  // ⛔ File/image upload preview works, but changes won’t save unless connected to a backend
  const uploadInput = document.getElementById(`upload-image-${post.id}`);
  uploadInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        document.getElementById(`post-image-${post.id}`).src = event.target.result;
        document.getElementById(`edit-image-${post.id}`).value = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // 🖊 Populate hidden form on edit
  document.getElementById("edit-btn").addEventListener("click", () => {
    const form = document.getElementById("edit-post-form");
    document.getElementById("edit-title").value = post.title;
    document.getElementById("edit-content").value = post.content;
    form.classList.remove("hidden");
  });

  // ⛔ This save won’t work on GitHub Pages (no PATCH support)
  document.getElementById("save-btn").addEventListener("click", () => {
    const updatedPost = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value,
      image: document.getElementById(`edit-image-${post.id}`).value
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(() => {
        displayPosts();
        showPostDetail(post);
        document.getElementById("edit-post-form").classList.add("hidden");
      });
  });

  // ⛔ Delete also won't work on static hosting
  document.getElementById("delete-btn").addEventListener("click", () => {
    fetch(`${BASE_URL}/${post.id}`, { method: "DELETE" })
      .then(() => {
        displayPosts();
        document.getElementById("post-detail").innerHTML = "<p>Post deleted.</p>";
      });
  });
}

// Toggle the visibility of the new post form
function togglePostForm() {
  const form = document.getElementById("new-post-form");
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "+ Add New Post";
  toggleBtn.className = "w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mb-4";

  form.classList.add("hidden");
  form.parentNode.insertBefore(toggleBtn, form);

  toggleBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
  });
}

// ⛔ Create new post (will not save unless hosted with backend)
function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const imageInput = document.getElementById("new-image");
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        createNewPost(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      createNewPost("");
    }

    function createNewPost(imageData) {
      const newPost = {
        title: form.title.value,
        content: form.content.value,
        author: form.author.value,
        image: imageData
      };

      fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      })
        .then(res => res.json())
        .then(() => {
          form.reset();
          form.classList.add("hidden");
          displayPosts();
        });
    }
  });
}

// ⛔ Edit form submit (same issue — no PATCH on static hosting)
function addEditPostListener() {
  const form = document.getElementById("edit-post-form");
  const cancelBtn = document.getElementById("cancel-edit");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
        showPostDetail(updatedData);
      });
  });

  cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden");
  });
}
