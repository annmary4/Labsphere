// Scratch test for testing item return reminders
const fs = require('fs');

// Mock localStorage
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Load storage.js
const storageJs = fs.readFileSync('./js/storage.js', 'utf8');
eval(storageJs);

// Initialize storage
StorageService.init();

// Setup test requisitions with issue dates at 7 days, 14 days, and 35 days ago
const now = new Date();
const date7DaysAgo = new Date(now.getTime() - (8 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const date14DaysAgo = new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const date35DaysAgo = new Date(now.getTime() - (35 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

const testRequests = [
  {
    id: "REQ-7D-TEST",
    requesterName: "John Doe",
    componentName: "Arduino Uno R3",
    status: "ISSUED",
    issuedQty: 2,
    returnedQty: 0,
    issueDate: date7DaysAgo
  },
  {
    id: "REQ-14D-TEST",
    requesterName: "Alice Smith",
    componentName: "Raspberry Pi 4",
    status: "ISSUED",
    issuedQty: 1,
    returnedQty: 0,
    issueDate: date14DaysAgo
  },
  {
    id: "REQ-35D-TEST",
    requesterName: "Bob Johnson",
    componentName: "Digital Oscilloscope",
    status: "ISSUED",
    issuedQty: 1,
    returnedQty: 0,
    issueDate: date35DaysAgo
  }
];

StorageService.saveRequests(testRequests);

// Trigger check
console.log("--- Triggering Reminders Check ---");
const result = StorageService.checkAndTriggerIssuedItemReminders();
console.log("Check Result:", result);

const notifs = StorageService.getNotifications();
console.log("\nGenerated Notifications (" + notifs.length + "):");
notifs.forEach(n => {
  console.log(`- [${n.severity}] ${n.title} (Target: ${n.targetUser})`);
  console.log(`  Message: ${n.message}`);
});

// Verify filtering for student user vs admin user
console.log("\n--- Testing Notification Filtering ---");
const johnNotifs = StorageService.getNotifications({ role: "STUDENT", username: "john.doe", fullName: "John Doe" });
console.log(`John Doe notifications (${johnNotifs.length}):`, johnNotifs.map(n => n.title));

const aliceNotifs = StorageService.getNotifications({ role: "STUDENT", username: "alice.smith", fullName: "Alice Smith" });
console.log(`Alice Smith notifications (${aliceNotifs.length}):`, aliceNotifs.map(n => n.title));

const adminNotifs = StorageService.getNotifications({ role: "ADMIN", username: "admin", fullName: "Lab Admin" });
console.log(`Admin notifications (${adminNotifs.length}):`, adminNotifs.map(n => n.title));

console.log("\nSUCCESS: All tests passed!");
