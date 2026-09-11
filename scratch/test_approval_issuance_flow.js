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

// Initialize storage
StorageService.init();

console.log("==================================================================");
console.log("   TESTING ROLE SEPARATION: TEAM LEAD APPROVE -> ADMIN ISSUE       ");
console.log("==================================================================");

// Step 1: Student submits a requisition
console.log("\n[STEP 1] Student submits requisition...");
const compBefore = StorageService.getComponents().find(c => c.id === 'COMP-001');
const initialQty = compBefore.quantity;
console.log(` -> Initial COMP-001 quantity: ${initialQty} pcs, reserved: ${compBefore.reservedQuantity || 0} pcs`);

const req = StorageService.submitComponentRequest('COMP-001', 3, 'Intern Dave', 'Drone Project', null, 'Anson');
console.log(` -> Created Request #${req.id} with status: ${req.status}, Assigned Lead: ${req.assignedLeadName}`);
if (req.status !== 'PENDING_LEAD_APPROVAL') throw new Error("Step 1 Failed: Expected status PENDING_LEAD_APPROVAL");

// Step 2: Team Lead logs in
console.log("\n[STEP 2] Team Lead 'anson' logs in...");
const leadSession = StorageService.login('anson', 'lead123');
console.log(` -> Logged in as: ${leadSession.fullName}, Role: ${leadSession.role}`);
if (StorageService.getRole() !== 'TEAM_LEAD') throw new Error("Step 2 Failed: Role should be TEAM_LEAD");
if (StorageService.isRole('ADMIN')) throw new Error("Step 2 Failed: Team Lead should NOT be ADMIN");

// Step 3: Team Lead approves request and sends to Lab Administrator
console.log("\n[STEP 3] Team Lead approves request and forwards to Lab Administrator...");
const approvedReq = StorageService.reviewLeadRequest(req.id, 3, 'Anson', 'APPROVE');
console.log(` -> Request #${approvedReq.id} status is now: ${approvedReq.status}`);
if (approvedReq.status !== 'PENDING_ADMIN_ISSUANCE') throw new Error("Step 3 Failed: Expected status PENDING_ADMIN_ISSUANCE");

const compAfterAppr = StorageService.getComponents().find(c => c.id === 'COMP-001');
console.log(` -> Inventory reserved quantity is now: ${compAfterAppr.reservedQuantity} pcs`);
if (compAfterAppr.reservedQuantity !== 3) throw new Error("Step 3 Failed: Reserved quantity should be 3");

// Step 4: Team Lead attempts to issue items -> MUST BE BLOCKED
console.log("\n[STEP 4] Team Lead attempts to issue physical stock (Security Check)...");
let blocked = false;
try {
  StorageService.issueMaterials(req.id, { issueQty: 3, issuedBy: 'Anson' });
} catch (err) {
  blocked = true;
  console.log(` -> Correctly blocked with error: "${err.message}"`);
}
if (!blocked) {
  throw new Error("Step 4 Failed: Team Lead was able to issue materials! Security check failed.");
}
console.log(" -> ✅ Access Denied enforced: Team Lead cannot issue materials!");

// Step 5: Lab Administrator logs in
console.log("\n[STEP 5] Lab Administrator logs in...");
const adminSession = StorageService.login('lab administrator', '123');
console.log(` -> Logged in as: ${adminSession.fullName}, Role: ${adminSession.role}`);
if (!StorageService.isRole('ADMIN')) throw new Error("Step 5 Failed: Expected ADMIN role");

// Step 6: Lab Administrator issues the items
console.log("\n[STEP 6] Lab Administrator issues the items and updates inventory...");
const issuedReq = StorageService.issueMaterials(req.id, {
  issueQty: 3,
  issuedBy: 'Lab Administrator',
  issueDate: '2026-09-11'
});
console.log(` -> Request #${issuedReq.id} status is now: ${issuedReq.status}`);
console.log(` -> Issued by: ${issuedReq.issuedBy}, Issued Qty: ${issuedReq.issuedQty} pcs`);
if (issuedReq.status !== 'ISSUED') throw new Error("Step 6 Failed: Expected status ISSUED");

const compAfterIssue = StorageService.getComponents().find(c => c.id === 'COMP-001');
console.log(` -> COMP-001 final physical stock: ${compAfterIssue.quantity} pcs (was ${initialQty}), reserved: ${compAfterIssue.reservedQuantity} pcs`);
if (compAfterIssue.quantity !== initialQty - 3) throw new Error("Step 6 Failed: Physical quantity was not deducted properly");
if (compAfterIssue.reservedQuantity !== 0) throw new Error("Step 6 Failed: Reserved quantity should be 0 after issuance");

console.log("\n==================================================================");
console.log("   ✅ ALL WORKFLOW TESTS PASSED: STRICT ROLE SEPARATION VERIFIED! ");
console.log("==================================================================");
