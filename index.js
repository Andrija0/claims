const fs = require('fs');

const allFileContents = fs.readFileSync(process.argv[2], 'utf-8');

console.log('allFileContents', allFileContents)
