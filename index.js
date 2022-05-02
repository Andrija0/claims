const fs = require('fs');

function addClaim(claimList, newClaim) {
    if (newClaim.parent == null) {
        delete newClaim.parent
        claimList.push(newClaim)
        return
    }

    for (const parent of claimList) {
        if (newClaim.parent === parent.claim) {
            delete newClaim.parent
            parent.children.push(newClaim)
            return
        }
        addClaim(parent.children, newClaim)
    }
}

const allFileContents = fs.readFileSync(process.argv[2], 'utf-8');
const claims = []

allFileContents.split(/\r?\n/).forEach(row => {
    if (row.match(/^[0-9]+./)) { // if a row starts with a number

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

const nestedClaims = [];

for (const claim of claims) {
    addClaim(nestedClaims, claim);
}

console.log(JSON.stringify(nestedClaims, null, 2));
console.log('END');

