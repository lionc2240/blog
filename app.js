document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const postContent = document.getElementById('post-content');
    const tocContainer = document.getElementById('toc-container');

    async function main() {
        try {
            // Dynamically scan the posts folder
            const posts = await scanPostsFolder();
            
            if (posts.length === 0) {
                postList.innerHTML = '<h2>Posts</h2><p>No markdown files found in the posts folder.</p>';
                return;
            }
            
            renderPostList(posts);

            // Load post from URL hash if present, otherwise load the first post
            const postFromHash = window.location.hash.substring(1);
            if (postFromHash && posts.some(p => p === postFromHash)) {
                loadPost(postFromHash);
            } else if (posts.length > 0) {
                loadPost(posts[0]);
            }
        } catch (error) {
            console.error('Error initializing blog:', error);
            postList.innerHTML = '<h2>Error</h2><p>Could not load posts.</p>';
        }
    }

    async function scanPostsFolder() {
        try {
            // Try to fetch directory listing from posts folder
            const response = await fetch('posts/');
            if (!response.ok) {
                throw new Error('Could not access posts folder.');
            }
            
            const html = await response.text();
            
            // Parse HTML to extract markdown files
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Look for links to .md files
            const links = Array.from(doc.querySelectorAll('a'))
                .map(a => a.textContent || a.href)
                .filter(href => href.endsWith('.md'))
                .sort();
            
            return links;
        } catch (error) {
            console.warn('Could not auto-detect posts folder via directory listing:', error);
            console.log('Attempting to load from posts.json as fallback...');
            
            // Fallback to posts.json if directory listing fails
            try {
                const response = await fetch('posts.json');
                if (response.ok) {
                    return await response.json();
                }
            } catch (e) {
                console.error('posts.json fallback also failed:', e);
            }
            
            return [];
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
