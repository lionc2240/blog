const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const outputFilePath = path.join(__dirname, 'posts.json');

try {
    const files = fs.readdirSync(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    fs.writeFileSync(outputFilePath, JSON.stringify(markdownFiles, null, 2));
    console.log(`Successfully created ${outputFilePath} with ${markdownFiles.length} posts.`);
} catch (error) {
    console.error('Error building post list:', error);
    process.exit(1);
}
