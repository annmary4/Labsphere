const fs = require('fs');

try {
  const modalManagerJs = fs.readFileSync('./js/modalManager.js', 'utf8');
  console.log("Checking modalManager.js syntax...");
  new Function(modalManagerJs);
  console.log("modalManager.js syntax OK!");
} catch (e) {
  console.error("SYNTAX ERROR in modalManager.js:", e.message);
}

try {
  const appJs = fs.readFileSync('./js/app.js', 'utf8');
  console.log("Checking app.js syntax...");
  new Function(appJs);
  console.log("app.js syntax OK!");
} catch (e) {
  console.error("SYNTAX ERROR in app.js:", e.message);
}
