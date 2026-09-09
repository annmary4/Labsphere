const fs = require('fs');
const content = fs.readFileSync('js/initialData.js', 'utf8');

eval(content);

console.log("INITIAL_RACKS:", INITIAL_RACKS);

const rack2Shelf6Boxes = INITIAL_BOXES.filter(b => Number(b.rackId) === 2 && Number(b.shelfId) === 6);
console.log("Rack 2 Shelf 6 Boxes count:", rack2Shelf6Boxes.length, rack2Shelf6Boxes);

const rack2Shelf6Comps = INITIAL_COMPONENTS.filter(c => Number(c.rackId) === 2 && Number(c.shelfId) === 6);
console.log("Rack 2 Shelf 6 Components count:", rack2Shelf6Comps.length, rack2Shelf6Comps);
