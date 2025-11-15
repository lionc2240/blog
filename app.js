document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const postContent = document.getElementById('post-content');
    const tocContainer = document.getElementById('toc-container');

    async function main() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error('Could not load post list.');
            }
            const posts = await response.json();
            
            renderPostList(posts);

            // Load post from URL hash if present, otherwise load the first post
            const postFromHash = window.location.hash.substring(1);
            if (postFromHash && posts.includes(postFromHash)) {
                loadPost(postFromHash);
            } else if (posts.length > 0) {
                loadPost(posts[0]);
            }
        } catch (error) {
            console.error('Error initializing blog:', error);
            postList.innerHTML = '<h2>Error</h2><p>Could not load posts.</p>';
        }
    }

    function renderPostList(posts) {
        const list = document.createElement('ul');
        posts.forEach(post => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = post.replace('.md', '').replace(/-/g, ' ');
            link.href = `#${post}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadPost(post);
            });
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
        postList.innerHTML = '<h2>Posts</h2>';
        postList.appendChild(list);
    }

    async function loadPost(postName) {
        try {
            const response = await fetch(`posts/${postName}`);
            if (!response.ok) {
                postContent.innerHTML = `<p>Error: Could not load post.</p>`;
                return;
            }
            const markdown = await response.text();
            
            // Add copy button
            const copyButton = document.createElement('button');
            copyButton.id = 'copy-button';
            copyButton.textContent = 'Copy Markdown';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(markdown).then(() => {
                    alert('Markdown copied to clipboard!');
                }, () => {
                    alert('Failed to copy markdown.');
                });
            };

            postContent.innerHTML = ''; // Clear previous content
            postContent.appendChild(copyButton);


            const html = marked.parse(markdown);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Apply syntax highlighting
            tempDiv.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            
            postContent.appendChild(tempDiv);

            generateToc(tempDiv);
            window.location.hash = postName;

        } catch (error) {
            console.error('Error loading post:', error);
            postContent.innerHTML = `<p>Error: Could not load post.</p>`;
        }
    }

    function generateToc(contentElement) {
        const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const tocList = document.createElement('ul');

        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1));
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            // Create a unique ID for the heading if it doesn't have one
            const id = heading.id || heading.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            heading.id = id;

            link.textContent = heading.textContent;
            link.href = `#${id}`;
            link.style.paddingLeft = `${(level - 1) * 15}px`;
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });

        tocContainer.innerHTML = '<h2>Table of Contents</h2>';
        if (tocList.children.length > 0) {
            tocContainer.appendChild(tocList);
        } else {
            tocContainer.innerHTML += '<p>No headings found.</p>';
        }
    }

    // Initial load
    main();
});
