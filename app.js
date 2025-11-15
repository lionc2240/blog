document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const postContent = document.getElementById('post-content');
    const tocContainer = document.getElementById('toc-container');
    const searchInput = document.getElementById('search-input');
    const newPostBtn = document.getElementById('new-post');
    const toggleThemeBtn = document.getElementById('toggle-theme');

    // Editor elements
    const editorPane = document.getElementById('editor-pane');
    const editorTitle = document.getElementById('editor-title');
    const editorTags = document.getElementById('editor-tags');
    const editorDate = document.getElementById('editor-date');
    const editorText = document.getElementById('editor-text');
    const editorPreview = document.getElementById('editor-preview');
    const closeEditorBtn = document.getElementById('close-editor');
    const downloadMdBtn = document.getElementById('download-md');
    const saveGithubBtn = document.getElementById('save-github');
    // image upload removed — use images/ folder and reference relative paths in markdown

    let lunrIndex = null;
    const lunrDocs = {};

    async function main() {
        try {
            const posts = await scanPostsFolder();

            if (posts.length === 0) {
                postList.innerHTML = '<h2>Posts</h2><p>No markdown files found in the posts folder.</p>';
                return;
            }

            renderPostList(posts);
            await buildSearchIndex(posts);

            // Load post from URL hash if present, otherwise load the first post
            const postFromHash = window.location.hash.substring(1);
            if (postFromHash && posts.some(p => p === postFromHash)) {
                loadPost(postFromHash);
            } else if (posts.length > 0) {
                loadPost(posts[0]);
            }

            // Event listeners
            searchInput.addEventListener('input', onSearch);
            newPostBtn.addEventListener('click', () => openEditor());
            toggleThemeBtn.addEventListener('click', toggleTheme);
            editorText.addEventListener('input', updateEditorPreview);
            closeEditorBtn.addEventListener('click', () => editorPane.classList.add('hidden'));
            downloadMdBtn.addEventListener('click', downloadMarkdownFile);
            saveGithubBtn.addEventListener('click', savePostToGitHub);
            // image upload handlers removed

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
            
            // Parse HTML to extract markdown files using regex
            const mdFileRegex = /<a href="([^"]*\.md)">([^<]*)<\/a>/g;
            const links = [];
            let match;
            
            while ((match = mdFileRegex.exec(html)) !== null) {
                // Use the text content (match[2]) as it's already decoded
                links.push(match[2]);
            }
            
            // If no matches found, try alternative parsing
            if (links.length === 0) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const extracted = Array.from(doc.querySelectorAll('a'))
                    .map(a => a.textContent.trim())
                    .filter(text => text.endsWith('.md'))
                    .sort();
                return extracted;
            }
            
            return links.sort();
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

    async function buildSearchIndex(posts) {
        if (typeof lunr === 'undefined') return;
        const documents = [];
        for (let i = 0; i < posts.length; i++) {
            const name = posts[i];
            try {
                const resp = await fetch(`posts/${encodeURIComponent(name)}`);
                if (!resp.ok) continue;
                const text = await resp.text();
                // Try extract title
                const titleMatch = text.match(/^#\s+(.*)/m);
                const title = titleMatch ? titleMatch[1].trim() : name.replace('.md','');
                const id = String(i);
                lunrDocs[id] = { name, title };
                documents.push({ id, title, body: text });
            } catch (e) {
                console.warn('Failed fetching post for index', name, e);
            }
        }

        try {
            lunrIndex = lunr(function () {
                this.ref('id');
                this.field('title');
                this.field('body');
                documents.forEach(function (doc) { this.add(doc); }, this);
            });
        } catch (e) {
            console.warn('Failed to build lunr index', e);
            lunrIndex = null;
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

    function renderSearchResults(results) {
        // Replace post list with results
        const list = document.createElement('ul');
        results.forEach(r => {
            const doc = lunrDocs[r.ref];
            if (!doc) return;
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = doc.title;
            a.href = `#${doc.name}`;
            a.addEventListener('click', (e) => { e.preventDefault(); loadPost(doc.name); });
            li.appendChild(a);
            list.appendChild(li);
        });
        postList.innerHTML = '<h2>Search Results</h2>';
        postList.appendChild(list);
    }

    function onSearch(e) {
        const q = e.target.value.trim();
        if (!q) {
            // re-render full list
            scanPostsFolder().then(renderPostList);
            return;
        }
        if (!lunrIndex) return;
        try {
            const results = lunrIndex.search(q);
            renderSearchResults(results);
        } catch (err) {
            console.warn('Search error', err);
        }
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

    // Editor / frontmatter helpers
    function parseFrontmatterAndBody(text) {
        const fmRegex = /^---\n([\s\S]*?)\n---\n?/;
        const match = text.match(fmRegex);
        if (match) {
            try {
                const data = jsyaml.load(match[1]);
                const body = text.slice(match[0].length);
                return { frontmatter: data || {}, body };
            } catch (e) {
                return { frontmatter: {}, body: text };
            }
        }
        return { frontmatter: {}, body: text };
    }

    function buildFrontmatterYaml(obj) {
        try {
            return '---\n' + jsyaml.dump(obj) + '---\n\n';
        } catch (e) {
            // fallback
            const lines = ['---'];
            for (const k in obj) {
                if (Array.isArray(obj[k])) {
                    lines.push(`${k}:`);
                    obj[k].forEach(v => lines.push(`  - "${v}"`));
                } else {
                    lines.push(`${k}: "${String(obj[k])}"`);
                }
            }
            lines.push('---\n');
            return lines.join('\n');
        }
    }

    function openEditor(filename) {
        editorPane.classList.remove('hidden');
        if (!filename) {
            editorTitle.value = '';
            editorTags.value = '';
            editorDate.value = new Date().toISOString().slice(0,10);
            editorText.value = '# New Post\n\nStart writing...';
            updateEditorPreview();
            editorPane.dataset.filename = '';
            return;
        }
        // load file
        fetch(`posts/${filename}`).then(r => r.text()).then(text => {
            const parsed = parseFrontmatterAndBody(text);
            const fm = parsed.frontmatter || {};
            editorTitle.value = fm.title || filename.replace('.md','');
            editorTags.value = (fm.tags || []).join(', ');
            editorDate.value = fm.date || new Date().toISOString().slice(0,10);
            editorText.value = parsed.body;
            editorPane.dataset.filename = filename;
            updateEditorPreview();
        }).catch(e => { console.error(e); alert('Could not load post for editing'); });
    }

    function updateEditorPreview() {
        const md = editorText.value || '';
        const html = marked.parse(md);
        const temp = document.createElement('div');
        temp.innerHTML = html;
        temp.querySelectorAll('pre code').forEach((b) => hljs.highlightElement(b));
        editorPreview.innerHTML = '';
        editorPreview.appendChild(temp);
    }

    function slugify(text) {
        return text.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    }

    function downloadMarkdownFile() {
        const title = editorTitle.value || 'post';
        const tags = editorTags.value.split(',').map(s => s.trim()).filter(Boolean);
        const date = editorDate.value || new Date().toISOString().slice(0,10);
        const fm = { title, date, tags };
        const content = buildFrontmatterYaml(fm) + editorText.value;
        const blob = new Blob([content], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = slugify(title) + '.md';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    // GitHub helpers
    function b64EncodeUnicode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    async function savePostToGitHub() {
        const token = prompt('Enter a GitHub personal access token (repo scope)');
        if (!token) return alert('Token required');
        const owner = prompt('Owner (GitHub username or org)');
        const repo = prompt('Repository name');
        const branch = prompt('Branch (default: main)') || 'main';
        if (!owner || !repo) return alert('Owner and repo required');

        const title = editorTitle.value || 'post';
        const tags = editorTags.value.split(',').map(s => s.trim()).filter(Boolean);
        const date = editorDate.value || new Date().toISOString().slice(0,10);
        const fm = { title, date, tags };
        const content = buildFrontmatterYaml(fm) + editorText.value;
        const path = `posts/${slugify(title)}.md`;
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;

        try {
            // check if exists to get sha
            const getResp = await fetch(url + `?ref=${branch}`, { headers: { Authorization: `token ${token}` } });
            let sha = null;
            if (getResp.ok) {
                const data = await getResp.json();
                sha = data.sha;
            }

            const body = {
                message: `Add/update post ${path}`,
                content: b64EncodeUnicode(content),
                branch
            };
            if (sha) body.sha = sha;

            const putResp = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `token ${token}` },
                body: JSON.stringify(body)
            });
            const respData = await putResp.json();
            if (putResp.ok) {
                alert('Saved to GitHub: ' + respData.content.path);
                editorPane.classList.add('hidden');
                // refresh post list
                const posts = await scanPostsFolder();
                renderPostList(posts);
                await buildSearchIndex(posts);
            } else {
                console.error('GitHub save error', respData);
                alert('Failed to save to GitHub: ' + (respData.message || 'unknown'));
            }
        } catch (e) {
            console.error(e);
            alert('Failed to save to GitHub');
        }
    }

    // image upload to GitHub removed — use manual images/ folder placement

    // data-URI insertion removed

    function toggleTheme() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // restore theme
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

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
