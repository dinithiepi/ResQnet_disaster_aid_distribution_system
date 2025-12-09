// update-api-urls.js - Script to update all hardcoded API URLs to use environment variable
// Run this with: node update-api-urls.js

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file already imports API_BASE_URL
  if (!content.includes("import API_BASE_URL from")) {
    // Add import at the top after other imports
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i + 1;
      } else if (insertIndex > 0 && lines[i].trim() === '') {
        break;
      }
    }
    
    // Check if file has any localhost:4000 references
    if (content.includes('http://localhost:4000')) {
      lines.splice(insertIndex, 0, "import API_BASE_URL from '../config/api';");
      content = lines.join('\n');
      modified = true;
    }
  }

  // Replace all occurrences of 'http://localhost:4000'
  const originalContent = content;
  content = content.replace(/['"]http:\/\/localhost:4000/g, '`${API_BASE_URL}');
  
  if (content !== originalContent) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.relative(__dirname, filePath)}`);
    return true;
  }
  
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      if (replaceInFile(filePath)) {
        count++;
      }
    }
  });

  return count;
}

console.log('🚀 Starting API URL update...\n');
const filesModified = walkDir(srcDir);
console.log(`\n✨ Done! Modified ${filesModified} files.`);
console.log('\n📝 Next steps:');
console.log('1. Review the changes');
console.log('2. Test locally with npm run dev');
console.log('3. For production: Set VITE_API_URL in your deployment platform');
