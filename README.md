# My Simple Markdown Blog

This is a simple, static blog that renders Markdown files into HTML.

## Features

- Renders Markdown posts with syntax highlighting.
- Generates a Table of Contents for each post.
- Provides a "Copy Markdown" button.
- Clean, modern, and responsive design.

## How to Run

Because the blog fetches post files using JavaScript, you need to run it from a local web server to avoid browser security errors (CORS issues).

1.  **Make sure you have Python installed.** Most systems have it pre-installed.

2.  **Start a simple web server.** Open your terminal in the root directory of this project and run one of the following commands:

    For Python 3:
    ```bash
    python3 -m http.server
    ```

    For Python 2:
    ```bash
    python -m SimpleHTTPServer
    ```

3.  **Open the blog in your browser.** Navigate to `http://localhost:8000`.

## How to Add a New Post

1.  Create a new Markdown file (e.g., `my-new-post.md`) inside the `posts/` directory.
2.  Open `app.js` and add the filename to the `posts` array at the top of the file:
    ```javascript
    const posts = [
        'sample-post.md',
        'my-new-post.md' // Add your new post here
    ];
    ```
3.  Refresh your browser. Your new post will appear in the navigation list.

## Project Structure

- `index.html`: The main HTML file.
- `style.css`: Contains all the styles for the blog.
- `app.js`: The core JavaScript file that handles post loading, Markdown rendering, and other dynamic features.
- `posts/`: This directory contains all your blog posts in Markdown format.
