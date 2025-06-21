// Wait for DOM to fully load
// Initialize the main function after the DOM is ready
document.addEventListener("DOMContentLoaded", main);

const BASE_URL = "http://localhost:3000/posts";
let currentPostId = null; // Tracks currently selected post ID

function main() {
  displayPosts(); // Fetch and render all posts
  togglePostForm(); // Set up toggle to show/hide new post form
  addNewPostListener(); // Set up form to add new posts
  addEditPostListener(); // Set up form to edit posts
}

// Fetch posts from server and display them in the post list
function displayPosts() {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((posts) => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = ""; // Clear existing list before rendering new posts

      posts.forEach((post) => { //loop through each post and create a div for each post
        const div = document.createElement("div");
        div.className =
          "bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition duration-200"; //style the div
        // Create innerHTML with image and title
        div.innerHTML = `
          <img src="${post.image || 'https://via.placeholder.com/100x60'}" alt="thumb" class="w-full h-32 object-cover rounded mb-2">
          <h3 class="font-semibold text-lg">${post.title}</h3>
        `;
        div.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(div); // Add each post div to the list
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id); // Automatically display first post on load
      }
    });
}

// Display full details of a single post and set up event listeners
function handlePostClick(postId) {
  fetch(`${BASE_URL}/${postId}`)
    .then((res) => res.json())
    .then((post) => {
      currentPostId = post.id;
      const detail = document.getElementById("post-detail");

      // Use placeholder if image is empty or undefined
      const imageURL =
        typeof post.image === "string" && post.image.trim() !== ""
          ? post.image
          : "https://via.placeholder.com/600x200";

      // create detailed post view with buttons, image, and inputs.  this was added as an extra to make sure  it aligns with the demo in canvas
      // the idea is to have a form that allows you to edit the post, and then save it to the server
      // the form should have a title, content, and image input
      // the form should have a save button that saves the post to the server
      // the form should have a cancel button that cancels the edit
      // the form should have a delete button that deletes the post from the server
      // the form should have a preview of the image
      // the form should have a file input that allows you to upload an image
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

      // Handle file input for image preview and update
      // this is the code that allows the user to upload an image to the post
      const uploadInput = document.getElementById(`upload-image-${post.id}`);
      uploadInput.addEventListener("change", function (e) {
        const file = e.target.files[0]; // get the file
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            document.getElementById(`post-image-${post.id}`).src = event.target.result;
            document.getElementById(`edit-image-${post.id}`).value = event.target.result; // Set input to base64 string
          };
          reader.readAsDataURL(file); // Read file as base64 string
        }
      });

      // When Edit button is clicked, show hidden edit form and populate fields
      document.getElementById("edit-btn").addEventListener("click", () => {
        const form = document.getElementById("edit-post-form");
        document.getElementById("edit-title").value = post.title;
        document.getElementById("edit-content").value = post.content;
        form.classList.remove("hidden");
      });

      // Save updated post to server and refresh display
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
            handlePostClick(currentPostId);
            document.getElementById("edit-post-form").classList.add("hidden"); // Hide form again
          });
      });

      // Delete post and refresh post list
      document.getElementById("delete-btn").addEventListener("click", () => {
        fetch(`${BASE_URL}/${postId}`, { method: "DELETE" })
          .then(() => {
            displayPosts();
            document.getElementById("post-detail").innerHTML = "<p>Post deleted.</p>";
            fetch(BASE_URL)
              .then(res => res.json())
              .then(posts => {
                if (posts.length > 0) handlePostClick(posts[0].id); // Load another post if available
              });
          });
      });
    });
}

// Show/hide the post form using a toggle button
function togglePostForm() {
  const form = document.getElementById("new-post-form");
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "+ Add New Post";
  toggleBtn.className = "w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mb-4";

  form.classList.add("hidden");
  form.parentNode.insertBefore(toggleBtn, form);

  toggleBtn.addEventListener("click", () => {
    form.classList.toggle("hidden"); // Toggle visibility of form
  });
}

// Handle creation of a new post, including image upload if provided
function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const imageInput = document.getElementById("new-image");
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        createNewPost(reader.result); // Use base64 data as image
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
        image: imageData // Base64 string or empty
      };

      fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      })
        .then((res) => res.json())
        .then(() => {
          form.reset();
          form.classList.add("hidden");
          displayPosts(); // Refresh list
        });
    }
  });
}

// Allow updates via the hidden edit form (content and title only)
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
      .then((res) => res.json())
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
        handlePostClick(currentPostId); // Refresh view with updated post
      });
  });

  cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden"); // Cancel and hide edit form
  });
}
