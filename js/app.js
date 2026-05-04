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
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const posts = await response.json();
            
            // Sort by date descending
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            container.innerHTML = ''; // Clear loading

            posts.forEach(post => {
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
        } catch (error) {
            console.error('Error loading posts:', error);
            container.innerHTML = '<div class="loading">Không thể tải bài viết. Vui lòng thử lại sau.</div>';
        }
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

            // Update Header
            const dateObj = new Date(postMeta.date);
            const formattedDate = dateObj.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
            
            document.getElementById('post-header').innerHTML = `
                <h1 class="post-page-title">${postMeta.title}</h1>
                <div class="post-meta" style="justify-content: center; font-size: 1rem;">
                    <span>${formattedDate}</span>
                    ${postMeta.tags ? postMeta.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('') : ''}
                </div>
            `;
            document.title = `${postMeta.title} - My Personal Blog`;

            // Fetch Markdown Content
            const mdResponse = await fetch(`posts/${postMeta.file}`);
            if (!mdResponse.ok) throw new Error('Could not load markdown file');
            const mdContent = await mdResponse.text();

            // Setup Copy Article Markdown Button
            const postHeader = document.getElementById('post-header');
            const copyBtnHtml = `
                <button id="copy-full-md" class="copy-md-btn" title="Copy toàn bộ bài viết dưới dạng Markdown">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy Markdown
                </button>
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
                document.getElementById('post-content').innerHTML = htmlContent;
                
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAll();
                }

                // Add copy buttons to headings (H2, H3)
                const contentDiv = document.getElementById('post-content');
                const headings = contentDiv.querySelectorAll('h2, h3');
                
                headings.forEach(heading => {
                    // Create copy section button
                    const btn = document.createElement('button');
                    btn.className = 'copy-section-btn';
                    btn.title = 'Copy chương này (Markdown)';
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                    
                    // Add click event
                    btn.addEventListener('click', async () => {
                        const headingText = heading.innerText;
                        const sectionMd = extractMarkdownSection(mdContent, headingText);
                        
                        if (sectionMd) {
                            // Ensure section link has an ID
                            if (!heading.id) {
                                heading.id = headingText.toLowerCase().replace(/[^\w]+/g, '-');
                            }
                            const sectionUrl = new URL(window.location.href);
                            sectionUrl.hash = heading.id;
                            
                            const sourceText = `\n\n> Nguồn: [${headingText}](${sectionUrl.toString()})`;
                            await copyToClipboard(sectionMd + sourceText, btn);
                        }
                    });

                    heading.appendChild(btn);
                    heading.style.position = 'relative'; // Ensure button positioning works if needed
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
