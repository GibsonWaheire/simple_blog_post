function main() {
    displayPosts();
    togglePostForm();
    addNewPostListener();
    addEditPostListener();
}

function displayPosts() {
    fetch(BASE_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const posts = data?.posts ?? [];
            const postList = document.getElementById("post-list");
            
            if (!postList) {
                console.error("Element #post-list not found");
                return;
            }

            postList.innerHTML = "";
            
            if (posts.length === 0) {
                showEmptyState(postList);
                return;
            }

            posts.forEach(post => {
                const div = document.createElement("div");
                div.className = "bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition duration-200";
                
                const imgSrc = post.image || 'https://via.placeholder.com/100x60';
                const title = post.title ?? '(Untitled Post)';
                
                div.innerHTML = `
                    <img src="${imgSrc}" alt="Post thumbnail" class="w-full h-32 object-cover rounded mb-2">
                    <h3 class="font-semibold text-lg">${title}</h3>
                `;
                
                div.addEventListener("click", () => showPostDetail(post));
                postList.appendChild(div);
            });

            if (posts.length > 0) {
                showPostDetail(posts[0]);
            }
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
            showErrorState(postList);
        });
}

// Helper functions
function showEmptyState(container) {
    container.innerHTML = '<p class="text-center py-8 text-gray-600">No posts found.</p>';
}

function showErrorState(container) {
    container.innerHTML = '<p class="text-center py-8 text-red-600">Failed to load posts. Please try again later.</p>';
}
