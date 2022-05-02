const fs = require('fs');

const allFileContents = fs.readFileSync(process.argv[2], 'utf-8');
const claims = []

allFileContents.split(/\r?\n/).forEach(row => {
    if (row.match(/^[0-9]+./)) { // if a raw starts with a number

        const claim = parseInt(row.match(/^[0-9]+/)[0]) // extract the claim number

        // check if a claim has a parent
        let parent = row.match(/(The system of claim|The method of claim)\s[0-9]+/)
        parent = parent ? parseInt(parent[0].match(/[0-9]+/)[0]) : null

        claims.push({
            parent,
            claim,
            content: row,
            children: []
        })
    } else {
        // if the row doesn't start with a number it's a part of the previous claim
        claims[claims.length-1].content = claims[claims.length-1].content.concat('\n' + row)
    }
})

console.log('claims', claims)
