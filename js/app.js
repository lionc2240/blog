document.addEventListener('DOMContentLoaded', () => {
    // Add mouse tracking for cards hover effect
    const handleOnMouseMove = e => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
    };

    const attachCardEffects = () => {
        for(const card of document.querySelectorAll(".post-card")) {
            card.onmousemove = e => handleOnMouseMove(e);
        }
    };

    // Scroll to Top & Smart Navbar Logic
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(scrollTopBtn);

    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Smart Navbar logic
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        // Scroll to top button logic
        if (currentScrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Determine current page
    const isPostPage = document.body.classList.contains('post-page');

    if (!isPostPage) {
        // We are on index.html, load posts list
        loadPostsList();
    } else {
        // We are on post.html, load specific post
        loadSinglePost();
    }

    async function loadPostsList() {
        const container = document.getElementById('posts-container');
        const tagsContainer = document.getElementById('tags-container');
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const posts = await response.json();
            
            // Sort by date descending
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Extract unique tags
            const allTags = new Set();
            posts.forEach(post => {
                if (post.tags) {
                    post.tags.forEach(tag => allTags.add(tag));
                }
            });

            // Render tag buttons
            if (tagsContainer) {
                tagsContainer.innerHTML = '';
                const allBtn = document.createElement('button');
                allBtn.className = 'tag-filter-btn active';
                allBtn.textContent = 'Tất cả';
                allBtn.dataset.tag = 'all';
                tagsContainer.appendChild(allBtn);

                allTags.forEach(tag => {
                    const btn = document.createElement('button');
                    btn.className = 'tag-filter-btn';
                    btn.textContent = tag;
                    btn.dataset.tag = tag;
                    tagsContainer.appendChild(btn);
                });

                // Set click handler
                tagsContainer.addEventListener('click', (e) => {
                    const btn = e.target.closest('.tag-filter-btn');
                    if (!btn) return;

                    // Toggle active class
                    tagsContainer.querySelectorAll('.tag-filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const selectedTag = btn.dataset.tag;
                    renderFilteredPosts(posts, selectedTag, container);
                });
            }

            renderFilteredPosts(posts, 'all', container);
        } catch (error) {
            console.error('Error loading posts:', error);
            container.innerHTML = '<div class="loading">Không thể tải bài viết. Vui lòng thử lại sau.</div>';
        }
    }

    function renderFilteredPosts(posts, filterTag, container) {
        container.innerHTML = '';
        
        const filtered = filterTag === 'all' 
            ? posts 
            : posts.filter(post => post.tags && post.tags.includes(filterTag));

        if (filtered.length === 0) {
            container.innerHTML = '<div class="loading">Không tìm thấy bài viết nào.</div>';
            return;
        }

        filtered.forEach(post => {
            const card = document.createElement('a');
            card.href = `post.html?id=${post.id}`;
            card.className = 'post-card';
            
            // Format date
            const dateObj = new Date(post.date);
            const formattedDate = dateObj.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });

            let tagsHtml = '';
            if(post.tags && post.tags.length > 0) {
                tagsHtml = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('');
            }

            card.innerHTML = `
                <div class="post-meta">
                    <span>${formattedDate}</span>
                    ${tagsHtml}
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <span class="post-read-more">Đọc tiếp →</span>
            `;
            container.appendChild(card);
        });

        attachCardEffects();
    }

    async function loadSinglePost() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (!postId) {
            document.getElementById('post-header').innerHTML = '<h1>Bài viết không tồn tại</h1>';
            document.getElementById('post-content').innerHTML = '';
            return;
        }

        try {
            // Fetch post metadata
            const response = await fetch('data/posts.json');
            const posts = await response.json();
            const postMeta = posts.find(p => p.id === postId);

            if (!postMeta) {
                document.getElementById('post-header').innerHTML = '<h1>Bài viết không tồn tại</h1>';
                document.getElementById('post-content').innerHTML = '';
                return;
            }

            // Fetch Markdown Content
            const mdResponse = await fetch(`posts/${postMeta.file}`);
            if (!mdResponse.ok) throw new Error('Could not load markdown file');
            const mdContent = await mdResponse.text();

            // Calculate Reading Time (assume 200 words per minute for Vietnamese)
            const wordCount = mdContent.trim().split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200);

            // Update Header
            const dateObj = new Date(postMeta.date);
            const formattedDate = dateObj.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
            
            document.getElementById('post-header').innerHTML = `
                <h1 class="post-page-title">${postMeta.title}</h1>
                <div class="post-meta" style="justify-content: center; font-size: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                    <span>${formattedDate}</span>
                    <span class="post-reading-time" style="display: flex; align-items: center; gap: 0.25rem;">⏱️ ${readingTime} phút đọc</span>
                    ${postMeta.tags ? postMeta.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('') : ''}
                </div>
            `;
            document.title = `${postMeta.title} - HgBlog`;

            // Setup Copy Article Markdown Button
            const postHeader = document.getElementById('post-header');
            const copyBtnHtml = `
                <div style="display: flex; justify-content: center;">
                    <button id="copy-full-md" class="copy-md-btn" title="Copy Markdown">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy as Markdown
                    </button>
                </div>
            `;
            postHeader.insertAdjacentHTML('beforeend', copyBtnHtml);
            
            document.getElementById('copy-full-md').addEventListener('click', async (e) => {
                const btn = e.currentTarget;
                const sourceText = `\n\n> Nguồn: [${postMeta.title}](${window.location.href})`;
                await copyToClipboard(mdContent + sourceText, btn);
            });

            // Parse Markdown
            if (typeof marked !== 'undefined') {
                // Configure marked to add IDs to headings automatically
                const renderer = new marked.Renderer();
                marked.setOptions({ renderer: renderer });

                let htmlContent = marked.parse(mdContent);
                if (typeof DOMPurify !== 'undefined') {
                    htmlContent = DOMPurify.sanitize(htmlContent);
                }
                
                const contentDiv = document.getElementById('post-content');
                contentDiv.innerHTML = htmlContent;
                contentDiv.classList.add('loaded');
                
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAll();
                }

                // Add anchor links and copy buttons to headings (H2, H3)
                const headings = contentDiv.querySelectorAll('h2, h3');
                
                // Table of Contents generation
                if (headings.length > 0) {
                    const tocContainer = document.createElement('div');
                    tocContainer.className = 'toc-container';
                    
                    const tocHeader = document.createElement('div');
                    tocHeader.className = 'toc-header';
                    
                    const tocTitle = document.createElement('span');
                    tocTitle.className = 'toc-title';
                    tocTitle.innerHTML = '📌 Mục lục bài viết';
                    
                    const tocToggle = document.createElement('button');
                    tocToggle.id = 'toc-toggle';
                    tocToggle.className = 'toc-toggle-btn';
                    tocToggle.textContent = '[Ẩn]';
                    
                    tocHeader.appendChild(tocTitle);
                    tocHeader.appendChild(tocToggle);
                    tocContainer.appendChild(tocHeader);
                    
                    const tocList = document.createElement('ul');
                    tocList.id = 'toc-list';
                    tocList.className = 'toc-list';
                    
                    headings.forEach(heading => {
                        const headingText = heading.innerText.trim();
                        const headingId = heading.id || headingText.toLowerCase().replace(/[^\w]+/g, '-');
                        if (!heading.id) heading.id = headingId;
                        
                        const tocItem = document.createElement('li');
                        tocItem.className = `toc-item toc-item-${heading.tagName.toLowerCase()}`;
                        
                        const tocLink = document.createElement('a');
                        tocLink.href = `#${headingId}`;
                        tocLink.className = 'toc-link';
                        tocLink.textContent = headingText;
                        
                        tocItem.appendChild(tocLink);
                        tocList.appendChild(tocItem);
                    });
                    
                    tocContainer.appendChild(tocList);
                    contentDiv.prepend(tocContainer);
                    
                    // Toggle behavior
                    tocToggle.addEventListener('click', () => {
                        const isHidden = tocList.style.display === 'none';
                        tocList.style.display = isHidden ? 'flex' : 'none';
                        tocToggle.textContent = isHidden ? '[Ẩn]' : '[Hiện]';
                    });
                }

                // Add anchors to headings
                headings.forEach(heading => {
                    const headingText = heading.innerText;
                    const anchor = document.createElement('a');
                    anchor.href = `#${heading.id}`;
                    anchor.className = 'anchor-link';
                    anchor.innerText = '#';

                    heading.prepend(anchor);
                    heading.style.position = 'relative';

                    // Make the heading itself clickable to update URL hash
                    heading.addEventListener('click', (e) => {
                        if (e.target !== anchor) {
                            window.location.hash = heading.id;
                        }
                    });
                });

                // Add copy buttons to code blocks (PRE tags)
                const preBlocks = contentDiv.querySelectorAll('pre');
                preBlocks.forEach(pre => {
                    const btn = document.createElement('button');
                    btn.className = 'code-copy-btn';
                    btn.innerText = 'Copy';
                    
                    btn.addEventListener('click', async () => {
                        const code = pre.querySelector('code');
                        const textToCopy = code ? code.innerText : pre.innerText;
                        
                        await copyToClipboard(textToCopy, btn);
                        btn.innerText = 'Copied!';
                        setTimeout(() => btn.innerText = 'Copy', 2000);
                    });
                    
                    pre.appendChild(btn);
                });

            } else {
                document.getElementById('post-content').innerHTML = '<p>Lỗi: Không thể tải thư viện hiển thị nội dung.</p>';
            }

        } catch (error) {
            console.error('Error loading post:', error);
            document.getElementById('post-header').innerHTML = '<h1>Lỗi tải bài viết</h1>';
            document.getElementById('post-content').innerHTML = '<p>Không thể tải nội dung bài viết. Vui lòng thử lại sau.</p>';
        }
    }

    // Helper: Extract section from markdown
    function extractMarkdownSection(md, headingText) {
        const lines = md.split('\n');
        let startIndex = -1;
        let headingLevel = 0;
        
        const searchStr = headingText.trim().toLowerCase();

        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(/^(#{1,6})\s+(.*)/);
            if (match) {
                const text = match[2].trim().toLowerCase();
                // Match exact or check if it includes (handling trailing characters)
                if (text === searchStr || searchStr.includes(text) || text.includes(searchStr)) {
                    startIndex = i;
                    headingLevel = match[1].length;
                    break;
                }
            }
        }

        if (startIndex === -1) return null;

        let endIndex = lines.length;
        for (let i = startIndex + 1; i < lines.length; i++) {
            const match = lines[i].match(/^(#{1,6})\s+(.*)/);
            if (match) {
                const level = match[1].length;
                if (level <= headingLevel) {
                    endIndex = i;
                    break;
                }
            }
        }

        return lines.slice(startIndex, endIndex).join('\n');
    }

    // Helper: Copy to clipboard with UI feedback
    async function copyToClipboard(text, btnElement) {
        try {
            await navigator.clipboard.writeText(text);
            const originalHtml = btnElement.innerHTML;
            btnElement.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            btnElement.style.color = '#10b981';
            
            setTimeout(() => {
                btnElement.innerHTML = originalHtml;
                btnElement.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Không thể copy nội dung. Vui lòng cấp quyền clipboard cho trình duyệt.');
        }
    }
});
