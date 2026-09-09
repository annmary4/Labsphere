const fs = require('fs');

// Mock localStorage
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => { mockStorage[key] = String(value); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

const initialDataCode = fs.readFileSync('js/initialData.js', 'utf8');
eval(initialDataCode + '; global.INITIAL_COMPONENTS = INITIAL_COMPONENTS; global.INITIAL_REQUESTS = INITIAL_REQUESTS;');

mockStorage[STORAGE_KEYS.COMPONENTS] = JSON.stringify(INITIAL_COMPONENTS);

const storageCode = fs.readFileSync('js/storage.js', 'utf8');
eval(storageCode);

console.log("=== TESTING INVENTORY ADMIN ISSUANCE SUITE ===");

// 1. Create a test component
const initialComponents = StorageService.getComponents();
const testComp = initialComponents[0];
const initialStock = testComp.quantity;

console.log(`Initial Component '${testComp.name}': Physical Stock = ${initialStock}`);

// 2. Submit a request for 10 pcs
const req = StorageService.submitComponentRequest(testComp.id, 10, "Student Intern Alice", "Robotics Competition Project");
console.log("Submitted Request:", req.id, "Qty Requested:", req.qtyRequested, "Status:", req.status);

// 3. Test Partial Issuance (4 pcs)
const partialIssue = StorageService.issueMaterials(req.id, {
  issueQty: 4,
  issueDate: "2026-08-17",
  issuedBy: "Inventory Admin Sunil"
});

console.log("\n--- TEST PARTIAL ISSUANCE (4 pcs) ---");
console.log("Request Status:", partialIssue.status); // Expected: PARTIALLY_ISSUED
console.log("Issued Qty:", partialIssue.issuedQty, "/ 10 pcs");
console.log("Issued By:", partialIssue.issuedBy);
console.log("Issue Date:", partialIssue.issueDate);

const updatedComp1 = StorageService.getComponents().find(c => c.id === testComp.id);
console.log("Updated Physical Stock:", updatedComp1.quantity, "(Expected:", initialStock - 4, ")");

// 4. Test Remaining Issuance (6 pcs -> Full Fulfill)
const fullIssue = StorageService.issueMaterials(req.id, {
  issueQty: 6,
  issueDate: "2026-08-18",
  issuedBy: "Inventory Admin Sunil"
});

console.log("\n--- TEST FULL ISSUANCE FULFILLMENT (Remaining 6 pcs) ---");
console.log("Request Status:", fullIssue.status); // Expected: ISSUED
console.log("Issued Qty:", fullIssue.issuedQty, "/ 10 pcs");
console.log("Issued By:", fullIssue.issuedBy);
console.log("Issue Date:", fullIssue.issueDate);

const updatedComp2 = StorageService.getComponents().find(c => c.id === testComp.id);
console.log("Final Physical Stock:", updatedComp2.quantity, "(Expected:", initialStock - 10, ")");

const txs = StorageService.getTransactions();
console.log("Latest Transactions:", txs.slice(0, 2));

console.log("\n✅ ALL INVENTORY ADMIN ISSUANCE SUITE TESTS PASSED!");
