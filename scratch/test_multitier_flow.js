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
console.log("   MULTI-TIER REQUISITION & INVENTORY ISSUANCE VERIFICATION TEST  ");
console.log("==================================================================");

// 1. Submit Request by Intern
const compBefore = StorageService.getComponents().find(c => c.id === 'COMP-001');
const initStock = compBefore.quantity;
console.log(`Initial Stock for ${compBefore.name} (${compBefore.id}): ${initStock} pcs`);

console.log("\n[STEP 1] Intern submits checkout request for 2 pcs...");
const req = StorageService.submitComponentRequest('COMP-001', 2, 'Intern Alice', 'Project Prototyping');
console.log(` -> Requisition Created: #${req.id}`);
console.log(` -> Requisition Status: ${req.status} (Expected: PENDING_LEAD_APPROVAL)`);
if (req.status !== 'PENDING_LEAD_APPROVAL') throw new Error("Step 1 Failed: Status should be PENDING_LEAD_APPROVAL");

// 2. Team Lead Review & Approval
console.log("\n[STEP 2] Team Lead Bob reviews and approves the requisition...");
const leadApprovedReq = StorageService.reviewLeadRequest(req.id, 2, 'Team Lead Bob', 'APPROVE');
console.log(` -> Status after Team Lead approval: ${leadApprovedReq.status} (Expected: PENDING_ADMIN_ISSUANCE)`);
console.log(` -> Lead Name recorded: ${leadApprovedReq.leadName}`);
if (leadApprovedReq.status !== 'PENDING_ADMIN_ISSUANCE') throw new Error("Step 2 Failed: Status should be PENDING_ADMIN_ISSUANCE");

// 3. Lab Administrator Issuance & Stock Update
console.log("\n[STEP 3] Lab Administrator Carol issues physical stock...");
const issuedReq = StorageService.issueMaterials(req.id, {
  issuedBy: 'Admin Carol',
  issueDate: '2026-08-18',
  issueQty: 2
});
console.log(` -> Status after Admin Issuance: ${issuedReq.status} (Expected: ISSUED)`);
console.log(` -> Issued By: ${issuedReq.issuedBy}`);
console.log(` -> Issue Date: ${issuedReq.issueDate}`);

// 4. Verify Stock Deduction
const compAfter = StorageService.getComponents().find(c => c.id === 'COMP-001');
console.log(` -> Final Stock for ${compAfter.name}: ${compAfter.quantity} pcs (Expected: ${initStock - 2} pcs)`);

if (compAfter.quantity !== (initStock - 2)) {
  throw new Error("Step 4 Failed: Stock level was not properly deducted!");
}

console.log("\n==================================================================");
console.log("   ✅ ALL MULTI-TIER FLOW VERIFICATION TESTS PASSED SUCCESSFULLY!  ");
console.log("==================================================================");
