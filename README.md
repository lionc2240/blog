# My Simple Markdown Blog

A lightweight, static markdown previewer that automatically discovers and displays markdown files from your `posts/` folder. No database required, just pure HTML, CSS, and JavaScript.

## Features

✨ **Auto-Discovery**: Automatically scans the `posts/` folder and displays all markdown files  
🎨 **Syntax Highlighting**: Beautiful code block highlighting with highlight.js  
📑 **Table of Contents**: Auto-generated TOC for each post with clickable links  
📋 **Copy Markdown**: One-click copy button to get the raw markdown  
📱 **Responsive Design**: Works seamlessly on desktop and mobile  
⚡ **Zero Build Required**: No compile step needed - just create a `.md` file and it appears!

## How to Run

The blog requires a local web server to avoid CORS issues when loading markdown files.

1. **Have Python installed** (comes pre-installed on most systems)

2. **Start a web server** in the project root directory:

   ```bash
   # Python 3
   python3 -m http.server 8000
   ```

3. **Open in your browser**: Navigate to `http://localhost:8000`

## How to Add a New Post

It's simple! Just create a new markdown file in the `posts/` folder:

```bash
# Example: create a new post
echo "# My New Post\n\nContent here..." > posts/my-new-post.md
```

Then:
1. Refresh your browser
2. Your new post will automatically appear in the sidebar
3. Click to view it!

## Project Structure

```
blog/
├── index.html          # Main HTML file
├── app.js             # Core JavaScript (dynamic scanning & rendering)
├── style.css          # All styling
├── posts/             # Your markdown files go here
│   ├── sample-post.md
│   ├── another-sample.md
│   └── ...
├── images/            # Images for your posts
│   ├── photo1.jpg
│   └── ...
├── README.md          # This file
├── REQUIREMENTS.md    # Project requirements
└── GEMINI.md         # Implementation guidelines
```

## Adding Images to Posts

Store your images in the `images/` folder and reference them in your markdown files:

```markdown
![Description](../images/my-image.jpg)
```

**Example:**
```markdown
# My Post

This is my post with an image:

![Beautiful Sunset](../images/sunset.jpg)

And some more text...
```

## How It Works

1. **Automatic Folder Scanning**: On page load, the app fetches the `posts/` directory listing
2. **Dynamic Post List**: All `.md` files are parsed and displayed in the left sidebar
3. **Click to Preview**: Click any post to load and render it as HTML
4. **No posts.json Needed**: The app automatically detects new posts without manual updates

## Browser Support

Works in all modern browsers that support:
- Fetch API
- ES6 JavaScript
- CSS Grid/Flexbox

## License

Feel free to use and modify as you wish!

## Deploying to Netlify

This site is static and works well on Netlify. Recommended config files are included: `netlify.toml`, `_redirects`, and `_headers`.

Quick steps:

1. Push the repository to GitHub (or any Git provider supported by Netlify).
2. Sign in to Netlify and choose "New site from Git" → connect your repo.
3. In Netlify site settings set:
    - **Build command**: leave empty (no build needed) or set to your build command if you add a build step.
    - **Publish directory**: `/` (the repository root, where `index.html` lives).
4. Deploy the site.

Notes and important details:
- The repo currently contains an `images/` folder that you may have added images to locally. If `images/` is included in `.gitignore` (so images are not committed to the repo), Netlify will not have those images after deploy. To include images in your deployed site either:
   - Commit the images to the repo (remove `images/` from `.gitignore`), or
   - Host images on an external CDN or image host and reference them by full URL in your Markdown.
- The `_redirects` and `netlify.toml` files include a rule that redirects all paths to `index.html` so client-side navigation works.
- `_headers` includes basic security and caching headers; adjust them as needed for your project.

If you want, I can:
- Remove `images/` from `.gitignore` and add a small `images/` index UI so you can pick images from the editor, or
- Keep `images/` ignored and help you implement an image hosting workflow (Cloudinary, Imgur, or GitHub releases).
