const fs = require('fs');

const initialDataCode = fs.readFileSync('js/initialData.js', 'utf8');
eval(initialDataCode + '; global.INITIAL_COMPONENTS = INITIAL_COMPONENTS;');

console.log("=== CHECKING ALL COMPONENT SPECIFICATIONS FOR NOISE ===");
INITIAL_COMPONENTS.forEach(c => {
  console.log(`[${c.id}] ${c.name}:`);
  console.log(`  Specs: "${c.specifications}"`);
});
