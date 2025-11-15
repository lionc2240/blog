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
