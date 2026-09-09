const fs = require('fs');

// Mock browser localStorage
const localStorageMap = new Map();
global.localStorage = {
  getItem: (k) => localStorageMap.get(k) || null,
  setItem: (k, v) => localStorageMap.set(k, String(v)),
  removeItem: (k) => localStorageMap.delete(k),
  clear: () => localStorageMap.clear()
};

// Load code files
const typesCode = fs.readFileSync('js/types.js', 'utf8');
const initialDataCode = fs.readFileSync('js/initialData.js', 'utf8');
const storageCode = fs.readFileSync('js/storage.js', 'utf8');

eval(typesCode);
eval(initialDataCode);
eval(storageCode);

console.log("==================================================================");
console.log("   TEAM LEAD SELECTION (ANSON / AMAL) VERIFICATION TEST           ");
console.log("==================================================================");

// 1. Submit Request targeting Anson
console.log("\n[TEST 1] Submitting requisition for Team Lead Anson...");
const reqAnson = StorageService.submitComponentRequest('COMP-001', 3, 'Intern Alice', 'Robotics Lab', null, 'Anson');
console.log(` -> Requisition Created: #${reqAnson.id}`);
console.log(` -> Assigned Lead: ${reqAnson.assignedLeadName} (Expected: Anson)`);
if (reqAnson.assignedLeadName !== 'Anson') throw new Error("Test 1 Failed: assignedLeadName should be Anson");

// 2. Submit Request targeting Amal
console.log("\n[TEST 2] Submitting multi-item requisition batch for Team Lead Amal...");
const reqAmalBatch = StorageService.submitMultiItemRequisition({
  projectId: 'PRJ-101',
  projectName: 'Drone Sensors',
  notes: 'High priority experiment',
  items: [{ componentId: 'COMP-002', quantity: 5 }],
  requesterName: 'Intern Bob',
  assignedLeadName: 'Amal'
});
console.log(` -> Requisition Batch Created: #${reqAmalBatch.batchId}`);
const reqAmal = reqAmalBatch.createdRequests[0];
console.log(` -> Item Assigned Lead: ${reqAmal.assignedLeadName} (Expected: Amal)`);
if (reqAmal.assignedLeadName !== 'Amal') throw new Error("Test 2 Failed: assignedLeadName should be Amal");

console.log("\n==================================================================");
console.log("   ✅ ALL TEAM LEAD SELECTION TESTS PASSED SUCCESSFULLY!          ");
console.log("==================================================================");
