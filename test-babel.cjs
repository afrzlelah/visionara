const fs = require('fs');
const parser = require('@babel/parser');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('resources/js');
files.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  try {
    parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
  } catch (e) {
    console.error(`Error parsing ${file}:`, e.message);
  }
});
console.log('Finished scanning all files');
