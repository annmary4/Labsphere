/**
 * LabSphere Storage Service - Complete 59-Component Catalog (v35)
 */

const CURRENT_VERSION = "v10600_registered_users_strict_filter";

const STORAGE_KEYS = {
  VERSION: "labsphere_version_v10250",
  COMPONENTS: "labsphere_components_v10250",
  BOXES: "labsphere_boxes_v10250",
  RACKS: "labsphere_racks_v10250",
  TRANSACTIONS: "labsphere_transactions_v10250",
  PROJECTS: "labsphere_projects_v10250",
  REQUESTS: "labsphere_requests_v10250",
  USERS: "labsphere_users_v10250",
  SESSION: "labsphere_session_v10250",
  SECURITY_LOGS: "labsphere_sec_logs_v10250",
  NOTIFICATIONS: "labsphere_notifs_v10250",
  REQUISITION_DRAFTS: "labsphere_req_drafts_v10250"
};

function sanitizeMojibake(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/Ãƒâ€šÃ‚Â°/g, '°')
    .replace(/Ãƒâ€šÃ‚Â±/g, '±')
    .replace(/Ãƒâ€šÃ‚Â/g, '')
    .replace(/Ãƒâ€š/g, '')
    .replace(/Ãƒ/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/Â°/g, '°')
    .replace(/Â±/g, '±')
    .replace(/Â/g, '')
    .replace(/ƒ/g, '')
    .replace(/Æ/g, '');
}

function cleanMojibakeDeep(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeMojibake(obj);
  if (Array.isArray(obj)) return obj.map(cleanMojibakeDeep);
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const key in obj) {
      cleaned[key] = cleanMojibakeDeep(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`LocalStorage quota limit reached for key '${key}'. Cleaning up legacy versions...`);
    try {
      const activeKeys = Object.values(STORAGE_KEYS);
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("labsphere_") || k.includes("labsphere")) && !activeKeys.includes(k)) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`Could not save key '${key}' due to browser quota limits:`, err);
    }
  }
}

const MASTER_USERS_KEY = "labsphere_master_user_accounts";

const DEFAULT_SYSTEM_USERS = [
  { id: "USR-1001", username: "lab administrator", email: "ann.sunil@jobinandjismi.com", passwordHash: "123", role: "ADMIN", fullName: "Lab Administrator", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1002", username: "engineer", email: "engineer@labsphere.io", passwordHash: "eng123", role: "ENGINEER", fullName: "Lead Lab Engineer", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1003", username: "researcher", email: "researcher@labsphere.io", passwordHash: "research123", role: "MANAGEMENT", fullName: "Research Associate", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1004", username: "student", email: "student@labsphere.io", passwordHash: "student123", role: "STUDENT", fullName: "Student Intern", status: "ACTIVE", createdAt: "2026-08-01" }
];

function isMasterAdmin(email, username) {
  const e = (email || "").trim().toLowerCase();
  const u = (username || "").trim().toLowerCase();
  return e === "ann.sunil@jobinandjismi.com" || u === "lab administrator" || e === "admin@labsphere.io" || u === "admin";
}

class StorageService {
  static cleanupLegacyLocalStorage() {
    try {
      const activeKeys = [...Object.values(STORAGE_KEYS), MASTER_USERS_KEY, "labsphere_session_master"];
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("labsphere_") || key.includes("labsphere")) && !activeKeys.includes(key)) {
          console.log("Removing legacy LocalStorage key to free quota:", key);
          localStorage.removeItem(key);
        }
      }
    } catch (e) {}
  }

  static async init() {
    console.log("Initializing LabSphere Storage Engine & Central Master DB Sync...");

    // Immediately clean up old version keys from browser localStorage to free quota space
    this.cleanupLegacyLocalStorage();

    // Preserve active login session across desktop/mobile mode switches & refreshes (logout only occurs on explicit Logout click)

    if (localStorage.getItem(STORAGE_KEYS.VERSION) !== CURRENT_VERSION) {
      if (typeof INITIAL_COMPONENTS !== "undefined" && INITIAL_COMPONENTS.length > 0) {
        localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(INITIAL_COMPONENTS));
      }
      if (typeof INITIAL_BOXES !== "undefined" && INITIAL_BOXES.length > 0) {
        localStorage.setItem(STORAGE_KEYS.BOXES, JSON.stringify(INITIAL_BOXES));
      }
      if (typeof INITIAL_RACKS !== "undefined" && INITIAL_RACKS.length > 0) {
        localStorage.setItem(STORAGE_KEYS.RACKS, JSON.stringify(INITIAL_RACKS));
      }
      // Preserve all registered user accounts on version updates
      const existingUsers = this.getUsers();
      this.saveUsers(existingUsers);

      if (typeof INITIAL_PROJECTS !== "undefined") {
        this.saveProjects(INITIAL_PROJECTS);
      }
      if (typeof INITIAL_REQUESTS !== "undefined") {
        this.saveRequests(INITIAL_REQUESTS);
      }
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    }

    // Always ensure full 59 component catalog is loaded
    const comps = this.getComponents();
    if (!comps || comps.length < 50) {
      if (typeof INITIAL_COMPONENTS !== "undefined" && INITIAL_COMPONENTS.length > 0) {
        localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(INITIAL_COMPONENTS));
      }
    }

    await this.pullCentralServerSync().catch(() => {});
  }

  static async pullCentralServerSync() {
    try {
      // 1. Two-Way Cross-Device Cloud User Sync via JsonBlob Store
      const cloudUsersRes = await fetch("https://jsonblob.com/api/jsonBlob/019fd57b-3e4a-7996-8d3b-034f027f9209", {
        headers: { "Accept": "application/json" }
      }).catch(() => null);

      let cloudUsers = [];
      if (cloudUsersRes && cloudUsersRes.ok) {
        const cloudObj = await cloudUsersRes.json();
        if (cloudObj && Array.isArray(cloudObj.users)) {
          cloudUsers = cloudObj.users;
        }
      }

      const localUsers = this.getUsers();
      let merged = [...localUsers];
      let hasNewLocalToPush = false;

      cloudUsers.forEach(cu => {
        if (cu && cu.username && !merged.some(lu => (lu.username && lu.username.toLowerCase() === cu.username.toLowerCase()) || (lu.email && cu.email && lu.email.toLowerCase() === cu.email.toLowerCase()))) {
          merged.push(cu);
        }
      });

      localUsers.forEach(lu => {
        if (lu && lu.username && !cloudUsers.some(cu => (cu.username && cu.username.toLowerCase() === lu.username.toLowerCase()) || (cu.email && lu.email && cu.email.toLowerCase() === lu.email.toLowerCase()))) {
          hasNewLocalToPush = true;
        }
      });

      safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(merged));
      try { localStorage.setItem(MASTER_USERS_KEY, JSON.stringify(merged)); } catch (e) {}

      // If local device created accounts that aren't in the cloud yet, push them to the cloud!
      if (hasNewLocalToPush) {
        fetch("https://jsonblob.com/api/jsonBlob/019fd57b-3e4a-7996-8d3b-034f027f9209", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            updatedAt: new Date().toISOString(),
            users: merged
          })
        }).catch(() => {});
      }

      let res = await fetch("api/db?t=" + Date.now()).catch(() => null);
      if (!res || !res.ok) {
        res = await fetch("data/db.json?t=" + Date.now()).catch(() => null);
      }
      if (!res || !res.ok) {
        res = await fetch("./data/db.json?t=" + Date.now()).catch(() => null);
      }
      if (res && res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          console.log("Central Server Master DB fetched successfully.");
          if (data.components && Array.isArray(data.components) && data.components.length > 0) {
            // Preserve local custom image URLs so server sync doesn't overwrite local edits
            try {
              const localData = localStorage.getItem(STORAGE_KEYS.COMPONENTS);
              if (localData) {
                const localComps = JSON.parse(localData);
                if (Array.isArray(localComps)) {
                  const localImgMap = new Map();
                  localComps.forEach(lc => {
                    if (lc.id && lc.imageUrl) localImgMap.set(lc.id, lc.imageUrl);
                  });
                  data.components.forEach(sc => {
                    if (!sc.imageUrl && localImgMap.has(sc.id)) {
                      sc.imageUrl = localImgMap.get(sc.id);
                    }
                  });
                }
              }
            } catch (err) {}
            localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(data.components));
          }
          if (data.boxes && Array.isArray(data.boxes)) localStorage.setItem(STORAGE_KEYS.BOXES, JSON.stringify(data.boxes));
          if (data.racks && Array.isArray(data.racks)) localStorage.setItem(STORAGE_KEYS.RACKS, JSON.stringify(data.racks));
          if (data.projects && Array.isArray(data.projects)) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
          if (data.requests && Array.isArray(data.requests) && data.requests.length > 0) {
            const localRequests = this.getRequests();
            const mergedRequests = [...localRequests];
            data.requests.forEach(sr => {
              if (sr && sr.id && !mergedRequests.some(lr => lr.id === sr.id)) {
                mergedRequests.push(sr);
              }
            });
            localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(mergedRequests));
          }
          if (data.transactions && Array.isArray(data.transactions)) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
          if (data.users && Array.isArray(data.users)) {
            const currentUsers = this.getUsers();
            data.users.forEach(su => {
              if (!currentUsers.some(cu => cu.username.toLowerCase() === su.username.toLowerCase() || cu.email.toLowerCase() === su.email.toLowerCase())) {
                currentUsers.push(su);
              }
            });
            this.saveUsers(currentUsers);
          }
          if (data.securityLogs && Array.isArray(data.securityLogs)) localStorage.setItem(STORAGE_KEYS.SECURITY_LOGS, JSON.stringify(data.securityLogs));
        }
      }
    } catch (e) {
      console.warn("Central sync server offline, using local storage cache.");
    }
  }

  static async pushCentralServerSync() {
    try {
      const allUsers = this.getUsers();
      fetch("https://jsonblob.com/api/jsonBlob/019fd57b-3e4a-7996-8d3b-034f027f9209", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          updatedAt: new Date().toISOString(),
          users: allUsers
        })
      }).catch(() => {});

      const masterData = {
        components: this.getComponents(),
        boxes: this.getBoxes(),
        racks: this.getRacks(),
        projects: this.getProjects(),
        requests: this.getRequests(),
        transactions: this.getTransactions(),
        users: allUsers,
        notifications: this.getNotifications(),
        securityLogs: this.getSecurityLogs()
      };
      await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(masterData)
      });
    } catch (e) {}
  }

  static forceRestoreDefaultBoxSetup() {
    // Preserve exact rackId, shelfId, and boxId assignments as specified in db.json / user inputs
    return;
  }

  static getAvailableLocalStorageSnapshots() {
    const snapshots = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.toLowerCase().includes("labsphere")) {
        try {
          const val = localStorage.getItem(key);
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
            snapshots.push({
              key,
              count: parsed.length,
              type: (key.includes("box") && !key.includes("comp")) ? "BOXES" : "COMPONENTS",
              sample: parsed.slice(0, 4).map(c => `${c.name || c.id} (${c.boxId || 'N/A'})`).join(" • "),
              fullData: parsed
            });
          }
        } catch (e) {}
      }
    }
    return snapshots;
  }

  static restoreSpecificSnapshot(keyName) {
    const data = localStorage.getItem(keyName);
    if (!data) throw new Error(`Snapshot '${keyName}' not found in LocalStorage.`);
    
    if (keyName.includes("box") && !keyName.includes("comp")) {
      localStorage.setItem(STORAGE_KEYS.BOXES, data);
    } else {
      localStorage.setItem(STORAGE_KEYS.COMPONENTS, data);
    }
    return true;
  }

  // --- NOTIFICATION CENTER METHODS ---
  static getNotifications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.filter(n => n && typeof n === 'object' && n.title && n.message && n.type);
        }
      }
    } catch (e) {
      console.warn("Error reading notifications:", e);
    }
    return [];
  }

  static saveNotifications(notifs) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  static addNotification(type, title, message) {
    const notifs = this.getNotifications();
    const newNotif = {
      id: "NOTIF-" + Date.now().toString().slice(-4),
      type,
      title,
      message,
      timestamp: new Date().toLocaleString(),
      read: false
    };
    notifs.unshift(newNotif);
    this.saveNotifications(notifs);
    return newNotif;
  }

  static markNotificationsRead() {
    const notifs = this.getNotifications();
    notifs.forEach(n => n.read = true);
    this.saveNotifications(notifs);
  }

  // --- PARTIAL RETURN & BORROW WORKFLOW METHODS ---
  static handlePartialReturn(requestId, returnQty, condition = "GOOD", notes = "") {
    const requests = this.getRequests();
    const components = this.getComponents();
    const req = requests.find(r => r.id === requestId);

    if (!req) throw new Error("Request record not found!");

    const comp = components.find(c => c.id === req.componentId);
    const targetIssuedQty = req.qtyApproved || req.qtyRequested;
    const remainingToReturn = targetIssuedQty - (req.returnedQty || 0);
    const qtyToReturn = Math.min(returnQty, remainingToReturn);

    if (qtyToReturn <= 0) {
      throw new Error("Invalid return quantity or all items already returned.");
    }

    req.returnedQty = (req.returnedQty || 0) + qtyToReturn;
    req.condition = condition;

    if (condition === "DAMAGED") {
      req.damagedQty = (req.damagedQty || 0) + qtyToReturn;
      req.damageReport = notes || `Reported ${qtyToReturn} pcs damaged on return`;
    }

    if (req.returnedQty >= targetIssuedQty) {
      req.status = condition === "DAMAGED" ? "DAMAGED" : "RETURNED";
      req.returnedAt = new Date().toLocaleString();
    } else {
      req.status = "PARTIAL_RETURN";
    }

    req.notes += ` [Returned ${qtyToReturn} pcs in ${condition} condition on ${new Date().toLocaleDateString()}${notes ? ': ' + notes : ''}]`;
    this.saveRequests(requests);

    if (comp) {
      const prevQty = comp.quantity;
      if (condition === "DAMAGED") {
        comp.inventoryState = "DAMAGED";
        this.saveComponents(components);

        this.addNotification(
          "RETURNED_ITEM",
          `Alert: Damaged Component Returned: ${comp.name}`,
          `${req.requesterName} returned ${qtyToReturn} pcs of ${comp.name} in DAMAGED condition. ${notes}`
        );

        this.logTransaction(
          comp.id,
          comp.name,
          "ITEM_DAMAGED",
          0,
          prevQty,
          comp.quantity,
          `Damaged asset reported: ${qtyToReturn} unit(s) of ${comp.name} returned in DAMAGED condition by ${req.requesterName}. Note: ${notes || 'N/A'}`
        );
      } else {
        comp.quantity += qtyToReturn;
        comp.inventoryState = "AVAILABLE";
        this.saveComponents(components);

        this.addNotification(
          "RETURNED_ITEM",
          `Sync Component Returned: ${comp.name}`,
          `${req.requesterName} returned ${qtyToReturn} pcs of ${comp.name} (${condition} condition).`
        );

        this.logTransaction(
          comp.id,
          comp.name,
          "ITEM_RETURNED",
          qtyToReturn,
          prevQty,
          comp.quantity,
          `Returned ${qtyToReturn} unit(s) of ${comp.name} (Condition: ${condition}). Stock restored to ${comp.quantity}.`
        );
      }
    }

    return req;
  }

  // --- DAMAGED ITEM INDEPENDENT REPORTING WORKFLOW ---
  static reportDamagedAsset(requestId, componentId, damagedQty, damageReport = "") {
    const requests = this.getRequests();
    const components = this.getComponents();
    const req = requests.find(r => r.id === requestId);
    const comp = components.find(c => c.id === (componentId || (req ? req.componentId : null)));

    if (!comp && !req) throw new Error("Component or request record not found!");

    const numDamaged = parseInt(damagedQty) || 1;
    const compName = comp ? comp.name : (req ? req.componentName : "Unknown Component");
    const compId = comp ? comp.id : (req ? req.componentId : "COMP-000");

    if (req) {
      req.damagedQty = (req.damagedQty || 0) + numDamaged;
      req.damageReport = damageReport || "Damaged item reported";
      req.notes += ` [Damaged reported: ${numDamaged} pcs - ${damageReport}]`;
      this.saveRequests(requests);
    }

    if (comp) {
      comp.inventoryState = "DAMAGED";
      this.saveComponents(components);
    }

    this.addNotification(
      "RETURNED_ITEM",
      `Alert: Damaged Material Reported (${compName})`,
      `${numDamaged} unit(s) of ${compName} reported DAMAGED. Description: ${damageReport || 'No description provided'}.`
    );

    this.logTransaction(
      compId,
      compName,
      "ITEM_DAMAGED",
      0,
      comp ? comp.quantity : 0,
      comp ? comp.quantity : 0,
      `Damaged asset reported: ${numDamaged} pcs of ${compName}. Description: ${damageReport || 'N/A'}`
    );

    return true;
  }

  // --- BOX TRANSFER & CONTENTS SWAP METHODS ---
  static ensureBoxExists(boxIdInput) {
    const boxes = this.getBoxes();
    const cleanId = boxIdInput.trim().toUpperCase();
    let box = boxes.find(b => b.id === cleanId);

    if (!box) {
      let shelfId = 1;
      const match = cleanId.match(/BOX\s+([A-Z])/i);
      if (match) {
        const letter = match[1].toUpperCase();
        shelfId = letter.charCodeAt(0) - 64;
        if (shelfId < 1 || shelfId > 6) shelfId = 1;
      }

      box = {
        id: cleanId,
        rackId: 1,
        shelfId: shelfId,
        label: `${cleanId}: Storage Footprint`
      };

      boxes.push(box);
      this.saveBoxes(boxes);
    }

    return box;
  }

  static moveSingleComponentToBox(componentId, targetBoxIdInput) {
    const components = this.getComponents();
    const cleanBoxId = targetBoxIdInput.trim().toUpperCase();
    const comp = components.find(c => c.id === componentId);

    if (!comp) throw new Error("Component not found.");
    if (comp.boxId === cleanBoxId) throw new Error(`Component '${comp.name}' is already stored inside ${cleanBoxId}.`);

    const prevBoxId = comp.boxId;
    const targetBox = this.ensureBoxExists(cleanBoxId);

    comp.boxId = targetBox.id;
    comp.rackId = targetBox.rackId;
    comp.shelfId = targetBox.shelfId;
    comp.lastUpdated = new Date().toISOString().slice(0, 10);

    this.saveComponents(components);

    this.addNotification(
      "REQUEST_STATUS",
      `Box Item Moved: ${comp.name}`,
      `Relocated '${comp.name}' from ${prevBoxId} into ${targetBox.id}.`
    );

    this.logTransaction(
      comp.id,
      comp.name,
      "SINGLE_ITEM_MOVE",
      0,
      comp.quantity,
      comp.quantity,
      `Relocated single component '${comp.name}' from ${prevBoxId} into ${targetBox.id}.`
    );

    return comp;
  }

  static moveComponentToBox(componentId, targetBoxIdInput) {
    const components = this.getComponents();
    const comp = components.find(c => c.id === componentId);
    
    if (!comp) throw new Error("Component not found!");
    
    const prevBoxId = comp.boxId;
    const targetBox = this.ensureBoxExists(targetBoxIdInput);
    const targetBoxId = targetBox.id;

    if (prevBoxId === targetBoxId) throw new Error("Component is already in target box.");

    const prevBox = this.getBoxes().find(b => b.id === prevBoxId);

    const existingInTarget = components.filter(c => c.boxId === targetBoxId);
    const existingInPrev = components.filter(c => c.boxId === prevBoxId);

    if (existingInTarget.length > 0) {
      // MUTUAL SWAP: Components in prevBox take targetBoxId; components in targetBox take prevBoxId
      existingInPrev.forEach(c => {
        c.boxId = targetBoxId;
        c.rackId = targetBox.rackId;
        c.shelfId = targetBox.shelfId;
        c.lastUpdated = new Date().toISOString().slice(0, 10);
      });

      existingInTarget.forEach(c => {
        c.boxId = prevBoxId;
        if (prevBox) {
          c.rackId = prevBox.rackId;
          c.shelfId = prevBox.shelfId;
        }
        c.lastUpdated = new Date().toISOString().slice(0, 10);
      });

      this.saveComponents(components);

      const targetNames = existingInTarget.map(c => c.name).join(", ");
      const prevNames = existingInPrev.map(c => c.name).join(", ");

      this.addNotification(
        "REQUEST_STATUS",
        `Sync Mutual Box Swap: ${prevBoxId} ↔ ${targetBoxId}`,
        `Swapped Box IDs & Locations: ${prevBoxId} (${prevNames}) ↔ ${targetBoxId} (${targetNames}).`
      );

      this.logTransaction(
        comp.id,
        comp.name,
        "MUTUAL_BOX_SWAP",
        0,
        comp.quantity,
        comp.quantity,
        `Mutually swapped components and Box IDs between ${prevBoxId} and ${targetBoxId}.`
      );

      return components.find(c => c.id === componentId);
    } else {
      existingInPrev.forEach(c => {
        c.boxId = targetBoxId;
        c.rackId = targetBox.rackId;
        c.shelfId = targetBox.shelfId;
        c.lastUpdated = new Date().toISOString().slice(0, 10);
      });

      this.saveComponents(components);

      this.addNotification(
        "REQUEST_STATUS",
        `Box Material Moved: ${comp.name}`,
        `Transferred '${comp.name}' from ${prevBoxId} to ${targetBoxId}.`
      );

      this.logTransaction(
        comp.id,
        comp.name,
        "BOX_TRANSFER",
        0,
        comp.quantity,
        comp.quantity,
        `Moved component '${comp.name}' from ${prevBoxId} to ${targetBoxId}.`
      );

      return components.find(c => c.id === componentId);
    }
  }

  static renameOrMoveBox(oldBoxId, newBoxIdInput, newRackId, newShelfId) {
    const cleanOldId = oldBoxId.trim().toUpperCase();
    const newBoxId = newBoxIdInput.trim().toUpperCase();

    const boxes = this.getBoxes();
    const components = this.getComponents();

    let box = boxes.find(b => (b.id || "").trim().toUpperCase() === cleanOldId);
    if (!box) {
      box = this.ensureBoxExists(cleanOldId);
    }

    if (newBoxId !== cleanOldId && boxes.some(b => (b.id || "").trim().toUpperCase() === newBoxId)) {
      throw new Error(`Box ID '${newBoxId}' is already in use by another box!`);
    }

    box.id = newBoxId;
    box.rackId = Number(newRackId);
    box.shelfId = Number(newShelfId);
    box.label = `${newBoxId}: Storage Footprint`;

    this.saveBoxes(boxes);

    components.forEach(c => {
      if ((c.boxId || "").trim().toUpperCase() === cleanOldId) {
        c.boxId = newBoxId;
        c.rackId = Number(newRackId);
        c.shelfId = Number(newShelfId);
        c.lastUpdated = new Date().toISOString().slice(0, 10);
      }
    });

    this.saveComponents(components);

    this.addNotification(
      "REQUEST_STATUS",
      `Tag Box Relocated / Renamed: ${cleanOldId} → ${newBoxId}`,
      `Updated Box ID and location for physical box ${cleanOldId} to ${newBoxId} (Rack ${newRackId}, Shelf ${String.fromCharCode(64 + Number(newShelfId))}).`
    );

    return box;
  }

  static swapBoxContents(boxId1, boxId2) {
    if (boxId1 === boxId2) throw new Error("Target box must be different from source box.");

    const components = this.getComponents();
    const boxes = this.getBoxes();

    const box1 = boxes.find(b => b.id === boxId1);
    const box2 = boxes.find(b => b.id === boxId2);

    if (!box1 || !box2) throw new Error("One or both target boxes do not exist.");

    const box1Comps = components.filter(c => c.boxId === boxId1);
    const box2Comps = components.filter(c => c.boxId === boxId2);

    if (box1Comps.length === 0 && box2Comps.length === 0) {
      throw new Error(`Both ${boxId1} and ${boxId2} are empty!`);
    }

    box1Comps.forEach(c => {
      c.boxId = boxId2;
      c.rackId = box2.rackId;
      c.shelfId = box2.shelfId;
      c.lastUpdated = new Date().toISOString().slice(0, 10);
    });

    box2Comps.forEach(c => {
      c.boxId = boxId1;
      c.rackId = box1.rackId;
      c.shelfId = box1.shelfId;
      c.lastUpdated = new Date().toISOString().slice(0, 10);
    });

    this.saveComponents(components);

    this.addNotification(
      "REQUEST_STATUS",
      `Sync Box Contents Swapped: ${boxId1} ↔ ${boxId2}`,
      `Swapped all inventory contents between ${boxId1} (${box1Comps.length} items) and ${boxId2} (${box2Comps.length} items).`
    );

    this.logTransaction(
      "BOX-SWAP",
      `${boxId1} ↔ ${boxId2}`,
      "BOX_SWAP",
      0,
      0,
      0,
      `Swapped physical box contents between ${boxId1} and ${boxId2}.`
    );

    return true;
  }

  static getComponentByBarcode(barcodeInput) {
    const components = this.getComponents();
    const query = barcodeInput.trim().toLowerCase();
    
    return components.find(c => 
      (c.barcode && c.barcode.toLowerCase() === query) ||
      (c.id && c.id.toLowerCase() === query) ||
      (c.partNumber && c.partNumber.toLowerCase() === query)
    );
  }

  static getUsers() {
    let users = [];
    try {
      const data = localStorage.getItem(MASTER_USERS_KEY) || localStorage.getItem(STORAGE_KEYS.USERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          users = parsed;
        }
      }
    } catch (e) {}

    const defaultUsers = (typeof INITIAL_USERS !== "undefined" && Array.isArray(INITIAL_USERS)) ? INITIAL_USERS : DEFAULT_SYSTEM_USERS;

    if (!users || users.length === 0) {
      users = [...defaultUsers];
    } else {
      defaultUsers.forEach(defU => {
        if (!users.some(u => u.username.toLowerCase() === defU.username.toLowerCase() || u.email.toLowerCase() === defU.email.toLowerCase())) {
          users.push(defU);
        }
      });
    }

    // Ensure primary Master Admin account is always synchronized with exact specified credentials
    let adminUser = users.find(u => u.role === "ADMIN" || isMasterAdmin(u.email, u.username));
    if (adminUser) {
      adminUser.username = "lab administrator";
      adminUser.email = "ann.sunil@jobinandjismi.com";
      adminUser.passwordHash = "123";
      adminUser.role = "ADMIN";
      adminUser.fullName = "Lab Administrator";
    } else {
      users.unshift({
        id: "USR-1001",
        username: "lab administrator",
        email: "ann.sunil@jobinandjismi.com",
        passwordHash: "123",
        role: "ADMIN",
        fullName: "Lab Administrator",
        status: "ACTIVE",
        createdAt: "2026-08-01"
      });
    }

    return users;
  }

  static saveUsers(users) {
    safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    try {
      localStorage.setItem(MASTER_USERS_KEY, JSON.stringify(users));
    } catch (e) {}

    // Cloud Multi-Device Sync across all phones/PCs via JsonBlob
    fetch("https://jsonblob.com/api/jsonBlob/019fd57b-3e4a-7996-8d3b-034f027f9209", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        updatedAt: new Date().toISOString(),
        users: users
      })
    }).catch(() => {});
  }

  static createUser(username, email, password, role, fullName) {
    if (!this.isRole("ADMIN")) {
      throw new Error("Access Denied: Only Administrators are authorized to register new user accounts!");
    }

    // Lock Administrator account creation to authorized master admin user only
    if (role === "ADMIN" && !isMasterAdmin(email, username)) {
      throw new Error("Security Lock: Creation of additional Lab Administrator accounts is locked. The Lab Administrator role is strictly reserved for the authorized Master Administrator (ann.sunil@jobinandjismi.com).");
    }

    const users = this.getUsers();
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(`User with email '${email}' already exists!`);
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error(`Username '${username}' is already taken!`);
    }

    const newUser = {
      id: "USR-" + Date.now().toString().slice(-4),
      username,
      email,
      passwordHash: password,
      role,
      fullName,
      status: "ACTIVE",
      createdAt: new Date().toISOString().slice(0, 10),
      lastActive: new Date().toLocaleString()
    };

    users.push(newUser);
    this.saveUsers(users);

    const session = this.getCurrentSession();
    this.logSecurityEvent("USER_CREATED", session ? session.userId : "ADMIN", username, USER_ROLES[role], `Created new user account '${fullName}' (${email}) with role ${role}.`);
    return newUser;
  }

  static updateUserNameById(userId, newFullName) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("User not found!");

    const cleanName = newFullName.trim();
    user.fullName = cleanName;
    this.saveUsers(users);

    const session = this.getCurrentSession();
    if (session && (session.userId === userId || session.role === user.role)) {
      session.fullName = cleanName;
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    }

    this.logSecurityEvent("USER_UPDATED", userId, user.username, USER_ROLES[user.role], `Updated full name for account '${user.email}' to '${cleanName}'.`);
    return user;
  }

  static toggleUserStatus(userId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;

    user.status = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    this.saveUsers(users);

    const session = this.getCurrentSession();
    this.logSecurityEvent(
      user.status === "DISABLED" ? "USER_DISABLED" : "USER_ENABLED",
      session ? session.userId : "ADMIN",
      user.username,
      USER_ROLES[user.role],
      `Account status for '${user.email}' changed to ${user.status}.`
    );

    return user;
  }

  static updateUserRole(userId, newRole) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;

    if (newRole === "ADMIN" && !isMasterAdmin(user.email, user.username)) {
      throw new Error("Security Lock: Role elevation to Lab Administrator is locked. The Admin role is strictly reserved for the authorized Master Administrator (ann.sunil@jobinandjismi.com).");
    }

    const prevRole = user.role;
    user.role = newRole;
    this.saveUsers(users);

    const session = this.getCurrentSession();
    this.logSecurityEvent("ROLE_CHANGED", session ? session.userId : "ADMIN", user.username, USER_ROLES[newRole], `Reassigned role for '${user.email}' from ${prevRole} to ${newRole}.`);
    return user;
  }

  static adminResetPassword(userId, newPassword) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("User account not found!");

    user.passwordHash = newPassword;
    this.saveUsers(users);

    const session = this.getCurrentSession();
    this.logSecurityEvent("ADMIN_PASSWORD_RESET", session ? session.userId : "ADMIN", user.username, USER_ROLES[user.role], `Admin force-reset password for user '${user.email}'.`);
    return true;
  }

  static getUserActivityHistory(userId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { user: null, activity: [] };

    const transactions = this.getTransactions();
    const securityLogs = this.getSecurityLogs();
    const requests = this.getRequests();

    const userSecLogs = securityLogs.filter(s => s.userId === user.id || s.username.toLowerCase() === user.email.toLowerCase());
    const userReqs = requests.filter(r => r.requesterName.toLowerCase().includes(user.fullName.toLowerCase()) || r.requesterName.toLowerCase().includes(user.username.toLowerCase()));

    return {
      user,
      secLogsCount: userSecLogs.length,
      requestsCount: userReqs.length,
      userSecLogs,
      userReqs
    };
  }

  static async login(emailOrUsername, password) {
    const input = emailOrUsername.trim().toLowerCase();
    
    // Always sync latest cloud user accounts first so phone/mobile devices pull accounts created on PCs instantly
    await this.pullCentralServerSync().catch(() => {});

    let users = this.getUsers();
    
    let user = users.find(u => 
      ((u.email && u.email.toLowerCase() === input) || (u.username && u.username.toLowerCase() === input)) &&
      (u.passwordHash === password || u.password === password)
    );

    if (!user) {
      this.logSecurityEvent("LOGIN_ATTEMPT", "UNKNOWN", input, "GUEST", `Login attempt for: ${input}`);
      throw new Error("Invalid username/email or password!");
    }

    user.status = "ACTIVE";
    user.lastActive = new Date().toLocaleString();
    this.saveUsers(users);

    const session = this.createSessionForUser(user);
    this.logSecurityEvent("LOGIN_SUCCESS", user.id, user.username, USER_ROLES[user.role] || user.role, `User ${user.email} logged in successfully.`);
    return session;
  }

  static authenticateUser(emailOrUsername, password) {
    return this.login(emailOrUsername, password);
  }

  static createSessionForUser(user) {
    const session = {
      sessionId: "SESS-" + Date.now(),
      userId: user.id || "USR-" + Date.now().toString().slice(-4),
      username: user.username || "user",
      email: user.email || "user@labsphere.io",
      role: user.role || "ADMIN",
      fullName: user.fullName || user.username || "Lab User",
      loginTime: new Date().toLocaleString(),
      expiresAt: "UNLIMITED"
    };

    try { sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session)); } catch (e) {}
    try { localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session)); } catch (e) {}
    try { localStorage.setItem("labsphere_session_master", JSON.stringify(session)); } catch (e) {}
    try { sessionStorage.setItem("labsphere_session_master", JSON.stringify(session)); } catch (e) {}
    return session;
  }

  static logout() {
    try { sessionStorage.removeItem(STORAGE_KEYS.SESSION); } catch (e) {}
    try { localStorage.removeItem(STORAGE_KEYS.SESSION); } catch (e) {}
    try { localStorage.removeItem("labsphere_session_master"); } catch (e) {}
    try { sessionStorage.removeItem("labsphere_session_master"); } catch (e) {}
  }

  static getCurrentSession() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.SESSION) || 
                   localStorage.getItem(STORAGE_KEYS.SESSION) ||
                   sessionStorage.getItem("labsphere_session_master") ||
                   localStorage.getItem("labsphere_session_master");
      if (!data) return null;
      const session = JSON.parse(data);
      if (session) {
        const users = this.getUsers();
        const user = users.find(u => 
          (session.userId && u.id === session.userId) || 
          (session.username && u.username.toLowerCase() === session.username.toLowerCase()) ||
          (session.email && u.email.toLowerCase() === session.email.toLowerCase())
        );
        if (user) {
          session.fullName = user.fullName || user.username;
          session.username = user.username;
          session.email = user.email;
          session.role = user.role;
        }
      }
      return session;
    } catch (e) {
      return null;
    }
  }

  static resetPassword(emailInput, newPassword) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === emailInput.trim().toLowerCase());
    
    if (!user) {
      throw new Error("User with specified email address not found.");
    }

    user.passwordHash = newPassword;
    this.saveUsers(users);

    this.logSecurityEvent("PASSWORD_RESET", user.id, user.username, USER_ROLES[user.role], `Password reset successfully for ${user.email}.`);
    return true;
  }

  static getSecurityLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return (typeof INITIAL_SECURITY_LOGS !== "undefined" && Array.isArray(INITIAL_SECURITY_LOGS)) ? INITIAL_SECURITY_LOGS : [];
  }

  static saveSecurityLogs(logs) {
    const trimmedLogs = Array.isArray(logs) ? logs.slice(0, 30) : [];
    safeSetItem(STORAGE_KEYS.SECURITY_LOGS, JSON.stringify(trimmedLogs));
  }

  static logSecurityEvent(eventType, userId, username, roleLabel, details) {
    try {
      const logs = this.getSecurityLogs();
      const newLog = {
        id: "SEC-" + Date.now().toString().slice(-4),
        eventType,
        userId,
        username,
        role: roleLabel,
        timestamp: new Date().toLocaleString(),
        details
      };
      logs.unshift(newLog);
      this.saveSecurityLogs(logs);
      return newLog;
    } catch (e) {
      console.warn("Security logging handled safely without quota exception:", e);
      return null;
    }
  }

  static getRole() {
    const session = this.getCurrentSession();
    return session ? session.role : "ADMIN";
  }

  static setRole(roleKey) {
    const session = this.getCurrentSession();
    const users = this.getUsers();
    
    // If current session already matches target role, retain active session user name
    if (session && session.role === roleKey) {
      return;
    }

    const targetUser = users.find(u => u.role === roleKey) || users[0];
    this.createSessionForUser(targetUser);
  }

  static updateProfileName(newName) {
    if (!newName || !newName.trim()) return null;
    const session = this.getCurrentSession();
    if (!session) return null;

    const cleanName = newName.trim();
    session.fullName = cleanName;
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

    const users = this.getUsers();
    const user = users.find(u => u.id === session.userId || u.role === session.role);
    if (user) {
      user.fullName = cleanName;
      this.saveUsers(users);
    }

    return session;
  }

  static isRole(roleKey) {
    return this.getRole() === roleKey;
  }

  static getRequests() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (data) {
        let parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Filter out only legacy sample data string 'sarah jenkins'
          const cleaned = parsed.filter(r => {
            if (!r || !r.requesterName) return false;
            const name = r.requesterName.toLowerCase();
            return !name.includes("sarah jenkins") && !name.includes("dr. sarah");
          });
          return cleaned;
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static saveRequests(requests) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }

  static submitComponentRequest(componentId, qtyRequested, requesterName, notes = "", projectId = null) {
    const components = this.getComponents();
    const comp = components.find(c => c.id === componentId);
    if (!comp) throw new Error("Component not found!");

    const requests = this.getRequests();
    const session = this.getCurrentSession();
    const currentRole = this.getRole();
    const isLeadOrAdmin = currentRole === "ADMIN" || currentRole === "ENGINEER";

    const newReq = {
      id: "REQ-" + Date.now().toString().slice(-4),
      componentId: comp.id,
      componentName: comp.name,
      requesterName: requesterName || (session ? session.fullName : "Project Member"),
      role: USER_ROLES[currentRole] || "Project Member",
      projectId: projectId || null,
      qtyRequested: parseInt(qtyRequested) || 1,
      qtyApproved: parseInt(qtyRequested) || 1,
      returnedQty: 0,
      damagedQty: 0,
      status: "SUBMITTED",
      requestedAt: new Date().toLocaleString(),
      notes: notes || `Submitted request for ${qtyRequested} ${comp.unit} of ${comp.name}`
    };

    requests.unshift(newReq);
    this.saveRequests(requests);

    this.addNotification(
      "PENDING_APPROVAL",
      "New Material Requisition Submitted",
      `${newReq.requesterName} submitted request #${newReq.id} for ${qtyRequested} pcs of ${comp.name}.`
    );

    this.logTransaction(
      comp.id,
      comp.name,
      "REQUEST_SUBMITTED",
      0,
      comp.quantity,
      comp.quantity,
      `Material request #${newReq.id} submitted by ${newReq.requesterName} (${qtyRequested} ${comp.unit}). Pending Team Lead review.`
    );

    return newReq;
  }

  static getEffectiveAvailableStock(component) {
    if (!component) return 0;
    const total = component.quantity || 0;
    const reserved = component.reservedQuantity || 0;
    return Math.max(0, total - reserved);
  }

  static cancelRequest(requestId) {
    let requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error("Request not found!");
    
    // Only allow cancelling pending/submitted requisitions
    if (req.status !== "SUBMITTED" && req.status !== "PENDING" && req.status !== "LEAD_APPROVED") {
      throw new Error("Only pending requisitions awaiting approval can be cancelled.");
    }
    
    // Release reserved inventory if request was approved/reserved
    if (req.status === "LEAD_APPROVED" || req.status === "LEAD_MODIFIED" || req.status === "APPROVED") {
      const components = this.getComponents();
      const comp = components.find(c => c.id === req.componentId);
      if (comp) {
        comp.reservedQuantity = Math.max(0, (comp.reservedQuantity || 0) - (req.qtyApproved || req.qtyRequested));
        comp.inventoryState = (comp.reservedQuantity || 0) > 0 ? "RESERVED" : (comp.quantity > 0 ? "AVAILABLE" : "BORROWED");
        this.saveComponents(components);
      }
    }

    requests = requests.filter(r => r.id !== requestId);
    this.saveRequests(requests);
    this.addNotification("REQUEST_CANCELLED", "Requisition Cancelled", `Requisition #${requestId} for ${req.componentName} was cancelled by requester.`);
    return true;
  }

  static editPendingRequest(requestId, newQty, newNotes) {
    let requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error("Request not found!");
    
    if (req.status !== "SUBMITTED" && req.status !== "PENDING") {
      throw new Error("Only pending requisitions can be edited before approval.");
    }
    
    if (newQty) req.qtyRequested = parseInt(newQty) || req.qtyRequested;
    if (newNotes !== undefined) req.notes = newNotes;
    this.saveRequests(requests);
    return req;
  }

  // --- MULTI-ITEM REQUISITION & DRAFT MANAGEMENT ---
  static getRequisitionDrafts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUISITION_DRAFTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static saveRequisitionDrafts(drafts) {
    localStorage.setItem(STORAGE_KEYS.REQUISITION_DRAFTS, JSON.stringify(drafts));
  }

  static saveRequisitionDraft(draftData) {
    const drafts = this.getRequisitionDrafts();
    const draftId = draftData.id || "DRAFT-" + Date.now();
    const existingIndex = drafts.findIndex(d => d.id === draftId);
    const now = new Date().toLocaleString();
    const updatedDraft = {
      id: draftId,
      projectId: draftData.projectId || null,
      projectName: draftData.projectName || "General / Unassigned",
      notes: draftData.notes || "",
      items: draftData.items || [],
      updatedAt: now,
      requesterName: draftData.requesterName || (this.getCurrentSession() ? this.getCurrentSession().fullName : "User")
    };

    if (existingIndex >= 0) {
      drafts[existingIndex] = updatedDraft;
    } else {
      drafts.unshift(updatedDraft);
    }
    this.saveRequisitionDrafts(drafts);
    return updatedDraft;
  }

  static deleteRequisitionDraft(draftId) {
    let drafts = this.getRequisitionDrafts();
    drafts = drafts.filter(d => d.id !== draftId);
    this.saveRequisitionDrafts(drafts);
  }

  static submitMultiItemRequisition({ projectId, projectName, notes, items, requesterName, draftId }) {
    if (!items || !items.length) {
      throw new Error("No items selected for requisition!");
    }
    const components = this.getComponents();
    const requests = this.getRequests();
    const session = this.getCurrentSession();
    const currentRole = this.getRole();
    const batchId = "REQ-BATCH-" + Date.now().toString().slice(-4);
    const name = requesterName || (session ? session.fullName : "Project Member");
    const timestamp = new Date().toLocaleString();

    const createdRequests = [];

    items.forEach((item, idx) => {
      const comp = components.find(c => c.id === item.componentId);
      if (!comp) return;

      const qty = parseInt(item.quantity) || 1;
      const itemNotes = item.itemNotes ? ` [Note: ${item.itemNotes}]` : "";
      const fullNotes = `[Batch ${batchId}] Project: '${projectName || "General"}'. ${notes || ''}${itemNotes}`.trim();

      const newReq = {
        id: `REQ-${Date.now().toString().slice(-4)}-${idx + 1}`,
        batchId: batchId,
        componentId: comp.id,
        componentName: comp.name,
        requesterName: name,
        role: USER_ROLES[currentRole] || "Project Member",
        projectId: projectId || null,
        projectName: projectName || "General",
        qtyRequested: qty,
        qtyApproved: qty,
        returnedQty: 0,
        damagedQty: 0,
        status: "SUBMITTED",
        requestedAt: timestamp,
        notes: fullNotes
      };

      requests.unshift(newReq);
      createdRequests.push(newReq);

      this.logTransaction(
        comp.id,
        comp.name,
        "REQUEST_SUBMITTED",
        0,
        comp.quantity,
        comp.quantity,
        `Multi-Item Requisition #${batchId} (${idx + 1}/${items.length}) requested by ${name} (${qty} ${comp.unit || 'pcs'}).`
      );
    });

    this.saveRequests(requests);

    if (draftId) {
      this.deleteRequisitionDraft(draftId);
    }

    this.addNotification(
      "PENDING_APPROVAL",
      `Multi-Item Requisition #${batchId} Submitted`,
      `${name} submitted requisition batch #${batchId} with ${createdRequests.length} items for '${projectName || "General"}'.`
    );

    return { batchId, createdRequests };
  }

  // --- STAGE 2: TEAM LEAD REVIEW & MODIFY WORKFLOW ---
  static reviewLeadRequest(requestId, qtyApproved, leadName, decision = "APPROVE", reason = "") {
    const requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error("Request record not found!");

    const session = this.getCurrentSession();
    const reviewerName = leadName || (session ? session.fullName : "Team Lead");
    const numApprovedQty = Math.max(0, parseInt(qtyApproved) || 0);

    if (decision === "REJECT") {
      // Release reserved stock if request was previously approved
      if (req.status === "LEAD_APPROVED" || req.status === "LEAD_MODIFIED" || req.status === "APPROVED") {
        const components = this.getComponents();
        const comp = components.find(c => c.id === req.componentId);
        if (comp) {
          comp.reservedQuantity = Math.max(0, (comp.reservedQuantity || 0) - (req.qtyApproved || req.qtyRequested));
          comp.inventoryState = (comp.reservedQuantity || 0) > 0 ? "RESERVED" : (comp.quantity > 0 ? "AVAILABLE" : "BORROWED");
          this.saveComponents(components);
        }
      }

      req.status = "REJECTED";
      req.leadName = reviewerName;
      req.leadApprovedAt = new Date().toLocaleString();
      req.notes += ` [Rejected by Administrator/Lead (${reviewerName}): ${reason || 'No reason specified'}]`;
      this.saveRequests(requests);

      this.addNotification(
        "REQUEST_STATUS",
        "Request Rejected",
        `Material request #${req.id} for ${req.componentName} was REJECTED by ${reviewerName}.`
      );

      this.logTransaction(
        req.componentId,
        req.componentName,
        "REQUEST_REJECTED",
        0,
        0,
        0,
        `Request #${req.id} rejected by ${reviewerName}. Reason: ${reason || 'N/A'}.`
      );
      return req;
    }

    if (numApprovedQty <= 0) {
      throw new Error("Approved quantity must be greater than zero.");
    }

    const wasModified = numApprovedQty !== req.qtyRequested;
    req.qtyApproved = numApprovedQty;
    req.status = wasModified ? "LEAD_MODIFIED" : "LEAD_APPROVED";
    req.leadName = reviewerName;
    req.leadApprovedAt = new Date().toLocaleString();
    if (wasModified) {
      req.notes += ` [Modified by Reviewer (${reviewerName}): Requested ${req.qtyRequested}, Approved ${numApprovedQty}]`;
    } else {
      req.notes += ` [Approved by Reviewer (${reviewerName})]`;
    }

    // Immediately reserve component inventory upon approval
    const components = this.getComponents();
    const comp = components.find(c => c.id === req.componentId);
    if (comp) {
      comp.reservedQuantity = (comp.reservedQuantity || 0) + numApprovedQty;
      comp.inventoryState = "RESERVED";
      this.saveComponents(components);
    }

    this.saveRequests(requests);

    this.addNotification(
      "PENDING_APPROVAL",
      "Material Request Approved & Inventory Reserved",
      `Request #${req.id} for ${req.componentName} (${numApprovedQty} pcs) was APPROVED by ${reviewerName}. Inventory is now RESERVED awaiting physical issuance.`
    );

    this.logTransaction(
      req.componentId,
      req.componentName,
      "INVENTORY_RESERVED",
      0,
      comp ? comp.quantity : 0,
      comp ? comp.quantity : 0,
      `Request #${req.id} approved by ${reviewerName} (${numApprovedQty} pcs). Inventory moved to RESERVED state.`
    );

    return req;
  }

  // --- STAGE 3: INVENTORY ADMIN ISSUANCE WORKFLOW ---
  static issueMaterials(requestId, adminName = null) {
    const requests = this.getRequests();
    const components = this.getComponents();
    const req = requests.find(r => r.id === requestId);

    if (!req) throw new Error("Request record not found!");
    if (req.status === "ISSUED" || req.status === "RETURNED") {
      throw new Error(`Request #${req.id} is already in state ${req.status}!`);
    }

    const comp = components.find(c => c.id === req.componentId);
    if (!comp) throw new Error("Component not found in catalog!");

    const issueQty = req.qtyApproved || req.qtyRequested;
    if (comp.quantity < issueQty) {
      throw new Error(`Insufficient lab inventory! Need ${issueQty} pcs of ${comp.name}, but only ${comp.quantity} pcs are available in stock.`);
    }

    const session = this.getCurrentSession();
    const issuer = adminName || (session ? session.fullName : "Inventory Administrator");

    // Release reserved quantity and deduct physical quantity upon issuance
    const prevQty = comp.quantity;
    comp.reservedQuantity = Math.max(0, (comp.reservedQuantity || 0) - issueQty);
    comp.quantity -= issueQty;

    if (comp.quantity === 0) {
      comp.inventoryState = "BORROWED";
    } else if (comp.reservedQuantity > 0) {
      comp.inventoryState = "RESERVED";
    } else {
      comp.inventoryState = "AVAILABLE";
    }

    req.status = "ISSUED";
    req.issuedBy = issuer;
    req.issuedAt = new Date().toLocaleString();
    req.notes += ` [Issued by Inventory Admin (${issuer}) on ${new Date().toLocaleDateString()}]`;

    this.saveComponents(components);
    this.saveRequests(requests);

    this.addNotification(
      "REQUEST_STATUS",
      "Materials Issued from Inventory",
      `Materials for request #${req.id} (${req.componentName} x ${issueQty}) have been ISSUED by Inventory Admin ${issuer}.`
    );

    this.logTransaction(
      comp.id,
      comp.name,
      "MATERIALS_ISSUED",
      -issueQty,
      prevQty,
      comp.quantity,
      `Issued ${issueQty} ${comp.unit} of ${comp.name} for request #${req.id} to ${req.requesterName} (Issued by: ${issuer}).`
    );

    return req;
  }

  static approveRequest(requestId) {
    const requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return false;

    // If still in SUBMITTED state, auto-lead-approve first then issue
    if (req.status === "SUBMITTED" || req.status === "PENDING") {
      this.reviewLeadRequest(requestId, req.qtyRequested, "Lab Lead", "APPROVE");
    }
    return this.issueMaterials(requestId);
  }

  static rejectRequest(requestId, reason = "") {
    return this.reviewLeadRequest(requestId, 0, "Administrator", "REJECT", reason);
  }

  static suggestAlternativeComponent(requestId, altComponentId, customNote = "") {
    const requests = this.getRequests();
    const components = this.getComponents();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error("Request not found!");

    const altComp = components.find(c => c.id === altComponentId);
    if (!altComp) throw new Error("Alternative component not found!");

    const session = this.getCurrentSession();
    const adminName = session ? session.fullName : "Lab Administrator";

    const noteMsg = `💡 Administrator Suggestion (${adminName}): Compatible alternative '${altComp.name}' is available in stock (${altComp.quantity} ${altComp.unit || 'pcs'} in Box ${altComp.boxId || 'A1'}). ${customNote}`.trim();

    req.notes += ` [${noteMsg}]`;
    req.suggestedAltComponentId = altComp.id;
    req.suggestedAltComponentName = altComp.name;

    this.saveRequests(requests);

    this.addNotification(
      "REQUEST_STATUS",
      "Alternative Component Suggested by Admin",
      `Admin ${adminName} suggested alternative '${altComp.name}' for request #${req.id}.`
    );

    return req;
  }

  static parseAndMatchBOM(csvText) {
    const lines = csvText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const components = this.getComponents();
    const results = [];

    lines.forEach((line, index) => {
      // Skip header row if it contains keywords like 'name', 'part', 'component', 'qty'
      const lineLower = line.toLowerCase();
      if (index === 0 && (lineLower.includes("name") || lineLower.includes("part") || lineLower.includes("component") || lineLower.includes("qty"))) {
        return;
      }

      const parts = line.split(",").map(p => p.trim().replace(/^"/, '').replace(/"$/, ''));
      const partName = parts[0] || `BOM Item ${index + 1}`;
      const qtyRequired = parseInt(parts[1]) || 1;

      const searchTerms = partName.toLowerCase().split(/\s+/).filter(t => t.length > 0);

      // Intelligent Fuzzy Multi-Word Matching
      const matched = components.find(c => {
        const targetStr = `${c.name} ${c.partNumber || ''} ${c.category} ${c.specifications || ''} ${(c.tags || []).join(' ')}`.toLowerCase();
        
        // Exact substring match
        if (targetStr.includes(partName.toLowerCase())) return true;

        // Token match: if all key words exist in targetStr
        if (searchTerms.length > 0) {
          return searchTerms.every(term => targetStr.includes(term));
        }

        return false;
      });

      if (matched) {
        let status = "MATCH_IN_STOCK";
        if (matched.quantity === 0) {
          status = "OUT_OF_STOCK";
        } else if (matched.quantity < qtyRequired) {
          status = "MATCH_SHORTAGE";
        }

        results.push({
          bomPartName: partName,
          qtyRequired,
          matchedCompId: matched.id,
          matchedCompName: matched.name,
          matchedBoxId: matched.boxId,
          availableQty: matched.quantity,
          status
        });
      } else {
        results.push({
          bomPartName: partName,
          qtyRequired,
          matchedCompId: null,
          matchedCompName: "Not Found in Lab Catalog",
          matchedBoxId: "N/A",
          availableQty: 0,
          status: "NOT_IN_LAB"
        });
      }
    });

    return results;
  }

  static getManagementReport() {
    const components = this.getComponents();
    const requests = this.getRequests();
    const projects = this.getProjects();

    let totalAssetValue = 0;
    const categoryValuation = {};

    components.forEach(c => {
      const priceInRupees = c.unitPrice || 450;
      const itemVal = c.quantity * priceInRupees;
      totalAssetValue += itemVal;

      if (!categoryValuation[c.category]) {
        categoryValuation[c.category] = { count: 0, totalQty: 0, value: 0 };
      }
      categoryValuation[c.category].count += 1;
      categoryValuation[c.category].totalQty += c.quantity;
      categoryValuation[c.category].value += itemVal;
    });

    const activeIssuedCount = requests.filter(r => r.status === "APPROVED" || r.status === "PARTIAL_RETURN").length;

    return {
      totalAssetValueFormatted: `₹${totalAssetValue.toLocaleString('en-IN')}`,
      totalComponentTypes: components.length,
      totalPhysicalUnits: components.reduce((acc, c) => acc + c.quantity, 0),
      activeIssuedCount,
      activeProjectsCount: projects.length,
      categoryValuation
    };
  }

  static getComponents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPONENTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return cleanMojibakeDeep(parsed);
        }
      }
    } catch (e) {}

    if (typeof INITIAL_COMPONENTS !== "undefined" && Array.isArray(INITIAL_COMPONENTS) && INITIAL_COMPONENTS.length > 0) {
      const cleanedInitial = cleanMojibakeDeep(INITIAL_COMPONENTS);
      try {
        localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(cleanedInitial));
      } catch (e) {}
      return cleanedInitial;
    }
    return [];
  }

  static saveComponents(components) {
    safeSetItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(components));
    this.pushCentralServerSync();
  }

  static deleteComponent(componentId) {
    if (!this.isRole("ADMIN")) {
      throw new Error("Access Restricted: Only Lab Administrators can delete component details.");
    }
    let components = this.getComponents();
    const target = components.find(c => c.id === componentId);
    if (!target) return false;

    components = components.filter(c => c.id !== componentId);
    this.saveComponents(components);

    this.logTransaction(
      target.id,
      target.name,
      "DELETE",
      -target.quantity,
      target.quantity,
      0,
      `Permanently deleted component entry '${target.name}' from ${target.boxId}.`
    );

    return true;
  }

  static getTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    } catch (e) {
      return INITIAL_TRANSACTIONS;
    }
  }

  static saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static logTransaction(componentId, componentName, actionType, qtyChanged, previousQty, newQty, notes = "") {
    const txns = this.getTransactions();
    const currentRoleKey = this.getRole();
    const roleLabel = USER_ROLES[currentRoleKey] || currentRoleKey;

    const newTxn = {
      id: "TXN-" + Date.now(),
      componentId,
      componentName,
      actionType,
      qtyChanged,
      previousQty,
      newQty,
      userRole: roleLabel,
      timestamp: new Date().toLocaleString(),
      notes: notes || `${actionType} transaction logged by ${roleLabel}`
    };

    txns.unshift(newTxn);
    this.saveTransactions(txns);
    return newTxn;
  }

  static getProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch (e) {
      return INITIAL_PROJECTS;
    }
  }

  static saveProjects(projects) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  static createProject(projectName, leaderName, description, membersStr = "") {
    const projects = this.getProjects();
    const members = membersStr.split(",").map(m => m.trim()).filter(m => m.length > 0);
    if (!members.includes(leaderName)) members.unshift(leaderName);

    const newProject = {
      id: "PROJ-" + Date.now().toString().slice(-4),
      projectName,
      leaderName,
      description,
      members,
      bom: [],
      allocatedInventory: [],
      consumables: [
        { name: "Silicon Wire Spool", qty: "2 meters", costRupees: 100 },
        { name: "Solder Wire", qty: "1 reel", costRupees: 250 }
      ],
      reusableAssets: [],
      estimatedCostRupees: 1500,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    projects.unshift(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  static getProcurementReport() {
    const components = this.getComponents();
    const reorderList = components.filter(c => c.quantity <= c.minQuantity);
    
    let totalItemsNeeded = 0;
    const itemsToProcure = reorderList.map(c => {
      const suggestedReorder = Math.max((c.minQuantity * 3) - c.quantity, 5);
      totalItemsNeeded += suggestedReorder;
      return {
        id: c.id,
        name: c.name,
        partNumber: c.partNumber,
        boxId: c.boxId,
        category: c.category,
        currentQty: c.quantity,
        minQuantity: c.minQuantity,
        suggestedReorder,
        unit: c.unit,
        status: c.quantity === 0 ? "OUT_OF_STOCK" : "LOW_STOCK"
      };
    });

    return {
      totalLowStockCount: reorderList.length,
      totalOutCount: reorderList.filter(c => c.quantity === 0).length,
      totalItemsNeeded,
      itemsToProcure
    };
  }

  static getBoxes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOXES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return (typeof INITIAL_BOXES !== "undefined" && Array.isArray(INITIAL_BOXES)) ? INITIAL_BOXES : [];
  }

  static saveBoxes(boxes) {
    localStorage.setItem(STORAGE_KEYS.BOXES, JSON.stringify(boxes));
    this.pushCentralServerSync();
  }

  static getRacks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RACKS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const rack2 = parsed.find(r => Number(r.id) === 2);
          if (rack2 && rack2.shelvesCount !== 5) {
            rack2.shelvesCount = 5;
            this.saveRacks(parsed);
          }
          return parsed;
        }
      }
    } catch (e) {}
    return (typeof INITIAL_RACKS !== "undefined" && Array.isArray(INITIAL_RACKS)) ? INITIAL_RACKS : [];
  }

  static saveRacks(racks) {
    localStorage.setItem(STORAGE_KEYS.RACKS, JSON.stringify(racks));
    this.pushCentralServerSync();
  }

  static restoreFullLabCatalog() {
    localStorage.setItem("labsphere_db_v53_initialized", "true");
    this.saveComponents(INITIAL_COMPONENTS);
    this.saveBoxes(INITIAL_BOXES);
    this.saveRacks(INITIAL_RACKS);
    this.saveProjects(INITIAL_PROJECTS);
    this.saveTransactions(INITIAL_TRANSACTIONS);
    this.saveRequests(INITIAL_REQUESTS);
    this.forceRestoreDefaultBoxSetup();
  }

  static resetToDefaults() {
    localStorage.clear();
    localStorage.setItem("labsphere_db_v53_initialized", "true");
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    this.saveComponents(INITIAL_COMPONENTS);
    this.saveBoxes(INITIAL_BOXES);
    this.saveRacks(INITIAL_RACKS);
    this.saveProjects(INITIAL_PROJECTS);
    this.saveTransactions(INITIAL_TRANSACTIONS);
    this.saveRequests(INITIAL_REQUESTS);
    this.saveUsers(INITIAL_USERS);
    this.createSessionForUser(INITIAL_USERS[0]);
    this.forceRestoreDefaultBoxSetup();
  }

  static exportJSON() {
    const backupData = {
      version: CURRENT_VERSION,
      timestamp: new Date().toISOString(),
      components: this.getComponents(),
      boxes: this.getBoxes(),
      racks: this.getRacks(),
      projects: this.getProjects(),
      requests: this.getRequests(),
      transactions: this.getTransactions()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `labsphere_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !data.components || !Array.isArray(data.components)) {
        throw new Error("Invalid backup file format. Must contain a components array.");
      }

      this.saveComponents(data.components);
      if (data.boxes) this.saveBoxes(data.boxes);
      if (data.racks) this.saveRacks(data.racks);
      if (data.projects) this.saveProjects(data.projects);
      if (data.requests) this.saveRequests(data.requests);
      if (data.transactions) this.saveTransactions(data.transactions);

      return true;
    } catch (e) {
      throw new Error(`Import failed: ${e.message}`);
    }
  }

  static handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        StorageService.importJSON(e.target.result);
        alert("Success: Backup imported successfully! All your custom box moves and components are restored.");
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    };
    reader.readAsText(file);
  }
}
