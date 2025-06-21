document.addEventListener('DOMContentLoaded', main); // wait for DOM to fully load before executing script

const BASE_URL = "http://localhost:3000/posts";
let currentPostId = null; // tracks currently selected post by ID

function main() {
  displayPosts(); // fetch and render all posts
  togglePostForm(); // sets up toggle to show/hide new post form
  addNewPostListener(); // set up form to add new posts
  addEditPostListener(); // set up form to edit posts
}

// so first we need to fetch the posts from the server
// then we need to display them in the post list
// then we need to add a new post
// then we need to handle the post click
// then we need to handle the edit button click
// then we need to handle the save button click
// then we need to handle the delete button click

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json()) // fetch the posts from the server
    .then(posts => {
      const postList = document.getElementById("post-list"); // get the post list element
      postList.innerHTML = ""; // clear the post list

      posts.forEach(post => { // loop through the posts
        const div = document.createElement("div"); // create a new div element
        div.className = "bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition duration-200"; // styled container with hover effect
        div.innerHTML = `
          <img src="${post.image || 'https://via.placeholder.com/100x60'}" alt="thumb" class="w-full h-32 object-cover rounded mb-2">
          <h3 class="font-semibold text-lg">${post.title}</h3>
        `; // set the inner HTML to include image and title
        div.addEventListener("click", () => handlePostClick(post.id)); // click to load post detail
        postList.appendChild(div); // add the div to the post list
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id); // show first post on load
      }
    });
}

function handlePostClick(postId) {
  fetch(`${BASE_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;
      const detail = document.getElementById("post-detail");

      // render post detail with delete, edit, and save buttons, and show image if available from submitted data only
      // get the image from the post using getElementById
      // and set the image src to the image url if it exists, otherwise set it to a default placeholder image.
      const imageURL = post.image?.trim() ? post.image : "https://via.placeholder.com/600x200";

      // so the below code is a template literal that is used to display the post detail. inserted into the #post-detail div when a user clicks a blog post title.
      detail.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">${post.title}</h2>
          <button id="delete-btn" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Delete</button>
        </div>
        <img src="${imageURL}" alt="Post Image" class="rounded mb-4 w-full max-h-60 object-cover" />
        <p class="mb-2">${post.content}</p>
        <h4 class="mb-4 font-semibold">Author: ${post.author}</h4>
        <button id="edit-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
        <button id="save-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">Save</button>
      `;

      // handle edit button click
      document.getElementById("edit-btn").addEventListener("click", () => {
        document.getElementById("edit-title").value = post.title;
        document.getElementById("edit-content").value = post.content;
        document.getElementById("edit-post-form").classList.remove("hidden"); // show edit form
      });

      // handle save button click (PATCH request) // we must patch because we are only updating a part of the post.  
      document.getElementById("save-btn").addEventListener("click", () => {
        const updatedPost = {
          title: document.getElementById("edit-title").value,
          content: document.getElementById("edit-content").value,
          image: post.image // preserve original image
        };

        fetch(`${BASE_URL}/${currentPostId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost)
        })
          .then(() => {
            displayPosts();
            handlePostClick(currentPostId);
            document.getElementById("edit-post-form").classList.add("hidden");
          });
      });

      // handle delete button click
      document.getElementById("delete-btn").addEventListener("click", () => {
        fetch(`${BASE_URL}/${postId}`, { method: "DELETE" })
          .then(() => {
            displayPosts();
            document.getElementById("post-detail").innerHTML = "<p>Post deleted.</p>";
          });
      });
    });
}

// so the below code is a function that toggles the visibility of the new post form., so it creates a button that toggles the visibility of the form. then it adds the button to the form. then it adds an event listener to the button that toggles the visibility of the form.
function togglePostForm() {
  const form = document.getElementById("new-post-form");
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "+ Add New Post";
  toggleBtn.className = "w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mb-4";

  form.classList.add("hidden"); // hide form initially
  form.parentNode.insertBefore(toggleBtn, form);

  toggleBtn.addEventListener("click", () => {
    form.classList.toggle("hidden"); // toggle visibility
  });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const imageInput = document.getElementById("new-image");
    let imageUrl = "";

    if (imageInput.files && imageInput.files[0]) {
      const file = imageInput.files[0];
      imageUrl = URL.createObjectURL(file); // convert image to blob URL for preview
    }

    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value,
      image: imageUrl // get image URL from file input
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        form.classList.add("hidden"); // hide form after submission
        displayPosts();
      });
  });
}

function addEditPostListener() {
  const form = document.getElementById("edit-post-form");
  const cancelBtn = document.getElementById("cancel-edit");

  form.addEventListener("submit", e => {
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
        handlePostClick(currentPostId);
      });
  });

  cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden"); // hide form on cancel
  });
}
