document.addEventListener("DOMContentLoaded", main); // ✅ Ensures DOM is loaded before executing main function

// ✅ Static JSON file path (GitHub Pages compatible)
// const BASE_URL = "./db.json";

const BASE_URL ="http://localhost:3000/posts";   // Assumes db.json is in root directory
let currentPostId = null;

function main() {
  displayPosts();
  togglePostForm();
  addNewPostListener();
  addEditPostListener();
}

// ✅ Fetch posts from json-server and display them
function displayPosts() {
  fetch(BASE_URL) // ✅ Fetches posts from json-server
    .then(res => { // ✅ Handles response from json-server
      if (!res.ok) { // ✅ Checks if response is successful
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json(); // ✅ Parses response as JSON
    })
    .then(posts => { // ✅ Handles posts data
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      if (posts.length === 0) { // ✅ Checks if there are no posts. we call this a "happy path". 
        postList.innerHTML = '<p class="text-gray-500 text-center">No posts found. Create your first post!</p>';
        return;
      }

      posts.forEach(post => { // ✅ Loops through each post and creates a div for each post
        const div = document.createElement("div"); // ✅ Creates a div for each post
        div.className = "bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition duration-200"; // ✅ Adds a class to the div

        div.innerHTML = `
          <img src="${post.image || 'https://via.placeholder.com/100x60'}" alt="thumb" class="w-full h-32 object-cover rounded mb-2">
          <h3 class="font-semibold text-lg">${post.title || 'Untitled Post'}</h3>
        `; // ✅ Adds a title to the div. the reason for this is because we want to display the title of the post in the div.

        div.addEventListener("click", () => showPostDetail(post)); // ✅ Adds an event listener to the div. the reason for this is because we want to display the details of the post when the div is clicked.
        postList.appendChild(div); // ✅ Adds the div to the postList.
      });

      if (posts.length > 0) {
        showPostDetail(posts[0]);
      }
    })
    .catch(err => { //  ✅ Handles error if posts are not loaded (this is a "sad path") . 
      console.error("Failed to load posts:", err); // ✅ Logs error to console
      const postList = document.getElementById("post-list"); // ✅ Gets the postList element
      postList.innerHTML = '<p class="text-red-500 text-center">Failed to load posts. Please check if json-server is running.</p>'; // ✅ Displays error message
    });
}

// ✅ Enhanced post details display with better error handling
function showPostDetail(post) {
  currentPostId = post.id; // ✅ Sets the currentPostId to the id of the post
  const detail = document.getElementById("post-detail"); // ✅ Gets the postDetail element

  const imageURL =
    typeof post.image === "string" && post.image.trim() !== "" // ✅ Checks if the image is a string and is not empty
      ? post.image // ✅ If the image is a string and is not empty, set the imageURL to the image
      : "https://via.placeholder.com/600x200"; // ✅ If the image is not a string or is empty, set the imageURL to a placeholder image

  detail.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">${post.title || 'Untitled Post'}</h2>
      <button id="delete-btn" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-200">Delete</button>
    </div>
    <img id="post-image-${post.id}" src="${imageURL}" alt="Post Image" class="rounded mb-4 w-full max-h-60 object-cover" /> 
    <p class="mb-2">${post.content || 'No content available'}</p>
    <h4 class="mb-4 font-semibold">Author: ${post.author || 'Unknown'}</h4>
    <button id="edit-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">Edit</button>
    <button id="save-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2 transition duration-200">Save</button>
    <input type="text" id="edit-image-${post.id}" value="${post.image || ''}" placeholder="Update image URL" class="mt-4 p-2 border rounded-md w-full" />
    <div class="text-center my-2 text-gray-500">— OR —</div>
    <input type="file" id="upload-image-${post.id}" accept="image/*" class="p-2 border rounded-md w-full" />
  `;

  // ✅ File/image upload preview with enhanced error handling
  const uploadInput = document.getElementById(`upload-image-${post.id}`);
  uploadInput.addEventListener("change", function (e) {
    const file = e.target.files[0]; 
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Please select an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function (event) {
        document.getElementById(`post-image-${post.id}`).src = event.target.result;
        document.getElementById(`edit-image-${post.id}`).value = event.target.result;
      };
      reader.onerror = function() {
        alert("Error reading file. Please try again.");
      };
      alert("File uploaded successfully.");
    }
  });

  // 🖊 Populate hidden form on edit
  document.getElementById("edit-btn").addEventListener("click", () => {
    const form = document.getElementById("edit-post-form");
    document.getElementById("edit-title").value = post.title || '';
    document.getElementById("edit-content").value = post.content || '';
    form.classList.remove("hidden");
  });

  // ✅ Enhanced save functionality with proper error handling
  document.getElementById("save-btn").addEventListener("click", () => {
    const updatedPost = {
      title: document.getElementById("edit-title").value || post.title,
      content: document.getElementById("edit-content").value || post.content,
      image: document.getElementById(`edit-image-${post.id}`).value || post.image
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        displayPosts();
        showPostDetail({...post, ...updatedPost});
        document.getElementById("edit-post-form").classList.add("hidden");
      })
      .catch(err => {
        console.error("Failed to update post:", err);
        alert("Failed to update post. Please try again.");
      });
  });

  // ✅ Enhanced delete functionality with confirmation
  document.getElementById("delete-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this post?")) {
      fetch(`${BASE_URL}/${post.id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(() => {
          displayPosts();
          document.getElementById("post-detail").innerHTML = "<p class='text-gray-500 text-center'>Post deleted successfully.</p>";
        })
        .catch(err => {
          console.error("Failed to delete post:", err);
          alert("Failed to delete post. Please try again.");
        });
    }
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

// ✅ Enhanced new post creation with validation and error handling
function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic validation
    const title = form.title.value.trim();
    const content = form.content.value.trim();
    const author = form.author.value.trim();

    if (!title || !content || !author) {
      alert("Please fill in all required fields (title, content, and author).");
      return;
    }

    // Show loading state
    const submitBtn = document.getElementById("submit-btn");
    const submitText = submitBtn.querySelector(".submit-text");
    const loadingText = submitBtn.querySelector(".loading-text");
    
    submitBtn.disabled = true;
    submitText.classList.add("hidden");
    loadingText.classList.remove("hidden");

    const imageInput = document.getElementById("new-image");
    const file = imageInput.files[0];

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Please select an image under 5MB.");
        resetSubmitButton();
        return;
      }

      const reader = new FileReader();
      reader.onloadend = function () {
        createNewPost(reader.result);
      };
      reader.onerror = function() {
        alert("Error reading file. Please try again.");
        resetSubmitButton();
      };
      reader.readAsDataURL(file);
    } else {
      createNewPost("");
    }

    function createNewPost(imageData) {
      const newPost = {
        title: title,
        content: content,
        author: author,
        image: imageData,
        date: new Date().toISOString().split('T')[0] // Add current date
      };

      fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(() => {
          form.reset();
          form.classList.add("hidden");
          displayPosts();
          // Show success message
          showSuccessMessage("Post created successfully!");
        })
        .catch(err => {
          console.error("Failed to create post:", err);
          alert("Failed to create post. Please try again.");
        })
        .finally(() => {
          resetSubmitButton();
        });
    }

    function resetSubmitButton() {
      submitBtn.disabled = false;
      submitText.classList.remove("hidden");
      loadingText.classList.add("hidden");
    }
  });
}

// ✅ Enhanced edit form submit with validation and error handling
function addEditPostListener() {
  const form = document.getElementById("edit-post-form");
  const cancelBtn = document.getElementById("cancel-edit");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic validation
    const title = document.getElementById("edit-title").value.trim();
    const content = document.getElementById("edit-content").value.trim();

    if (!title || !content) {
      alert("Please fill in both title and content fields.");
      return;
    }

    // Show loading state
    const updateBtn = document.getElementById("update-btn");
    const updateText = updateBtn.querySelector(".update-text");
    const updatingText = updateBtn.querySelector(".updating-text");
    
    updateBtn.disabled = true;
    updateText.classList.add("hidden");
    updatingText.classList.remove("hidden");

    const updatedData = {
      title: title,
      content: content
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
        showSuccessMessage("Post updated successfully!");
      })
      .catch(err => {
        console.error("Failed to update post:", err);
        alert("Failed to update post. Please try again.");
      })
      .finally(() => {
        updateBtn.disabled = false;
        updateText.classList.remove("hidden");
        updatingText.classList.add("hidden");
      });
  });

  cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

// ✅ Utility function to show success messages
function showSuccessMessage(message) {
  const successMsg = document.createElement("div");
  successMsg.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 transform transition-all duration-300 ease-in-out";
  successMsg.textContent = message;
  document.body.appendChild(successMsg);
  
  // Animate in
  setTimeout(() => {
    successMsg.style.transform = "translateX(0)";
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    successMsg.style.transform = "translateX(100%)";
    setTimeout(() => successMsg.remove(), 300);
  }, 3000);
}
