document.addEventListener('DOMContentLoaded', function () {
    const postsToShowInitially = 9;
    const postsToLoadOnClick = 6;
    const loadMoreButton = document.getElementById('loadMorePostsButton');
    const postItems = document.querySelectorAll('.post-item');

    if (!loadMoreButton || postItems.length === 0) {
        if(loadMoreButton) loadMoreButton.style.display = 'none'; // Hide button if no posts
        return; // No button or no posts, nothing to do
    }

    // Initially hide all posts
    postItems.forEach(item => item.style.display = 'none');

    let currentlyShown = 0;

    // Function to show a batch of posts
    function showPosts(count) {
        let shownThisBatch = 0;
        for (let i = 0; i < postItems.length; i++) {
            if (postItems[i].style.display === 'none') {
                if (shownThisBatch < count) {
                    postItems[i].style.display = ''; // Or 'block', 'flex', etc. depending on CSS
                    shownThisBatch++;
                    currentlyShown++;
                }
            }
        }
        return shownThisBatch;
    }

    // Show initial posts
    showPosts(postsToShowInitially);

    // Update button visibility
    if (currentlyShown >= postItems.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'inline-block'; // Or 'block'
    }

    // Handle button click
    loadMoreButton.addEventListener('click', function () {
        showPosts(postsToLoadOnClick);
        if (currentlyShown >= postItems.length) {
            loadMoreButton.style.display = 'none';
        }
    });
});
