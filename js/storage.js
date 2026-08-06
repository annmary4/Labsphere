/**
 * LabSphere Storage Service - Complete 59-Component Catalog (v35)
 */

const CURRENT_VERSION = "v9530_mobile_card_gap";

const STORAGE_KEYS = {
  VERSION: "labsphere_version_v9530",
  COMPONENTS: "labsphere_components_v9530",
  BOXES: "labsphere_boxes_v9530",
  RACKS: "labsphere_racks_v9530",
  TRANSACTIONS: "labsphere_transactions_v9530",
  PROJECTS: "labsphere_projects_v9530",
  REQUESTS: "labsphere_requests_v9530",
  USERS: "labsphere_users_v9530",
  SESSION: "labsphere_session_v9530",
  SECURITY_LOGS: "labsphere_sec_logs_v9530",
  NOTIFICATIONS: "labsphere_notifs_v9530"
};

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
  { id: "USR-1001", username: "admin", email: "admin@labsphere.io", passwordHash: "admin123", role: "ADMIN", fullName: "Lab Administrator", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1002", username: "engineer", email: "engineer@labsphere.io", passwordHash: "eng123", role: "ENGINEER", fullName: "Lead Lab Engineer", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1003", username: "researcher", email: "researcher@labsphere.io", passwordHash: "research123", role: "MANAGEMENT", fullName: "Research Associate", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1004", username: "student", email: "student@labsphere.io", passwordHash: "student123", role: "STUDENT", fullName: "Student Intern", status: "ACTIVE", createdAt: "2026-08-01" }
];

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

    // Always ensure components array is not empty
    const comps = this.getComponents();
    if (!comps || comps.length === 0) {
      if (typeof INITIAL_COMPONENTS !== "undefined" && INITIAL_COMPONENTS.length > 0) {
        localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(INITIAL_COMPONENTS));
      }
    }

    await this.pullCentralServerSync();
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
          if (data.requests && Array.isArray(data.requests)) localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(data.requests));
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
          if (data.notifications && Array.isArray(data.notifications)) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data.notifications));
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
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
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
  static handlePartialReturn(requestId, returnQty, condition = "GOOD") {
    const requests = this.getRequests();
    const components = this.getComponents();
    const req = requests.find(r => r.id === requestId);

    if (!req) throw new Error("Request record not found!");

    const comp = components.find(c => c.id === req.componentId);
    const qtyToReturn = Math.min(returnQty, req.qtyRequested - (req.returnedQty || 0));

    if (qtyToReturn <= 0) {
      throw new Error("Invalid return quantity.");
    }

    req.returnedQty = (req.returnedQty || 0) + qtyToReturn;
    req.condition = condition;

    if (req.returnedQty >= req.qtyRequested) {
      req.status = "RETURNED";
      req.returnedAt = new Date().toLocaleString();
    } else {
      req.status = "PARTIAL_RETURN";
    }

    req.notes += ` [Returned ${qtyToReturn} pcs in ${condition} condition on ${new Date().toLocaleDateString()}]`;
    this.saveRequests(requests);

    if (comp) {
      const prevQty = comp.quantity;
      if (condition === "DAMAGED") {
        comp.inventoryState = "DAMAGED";
        this.addNotification(
          "RETURNED_ITEM",
          `⚠️ Damaged Component Returned: ${comp.name}`,
          `${req.requesterName} returned ${qtyToReturn} pcs of ${comp.name} in DAMAGED condition.`
        );
      } else {
        comp.quantity += qtyToReturn;
        comp.inventoryState = "AVAILABLE";
        this.addNotification(
          "RETURNED_ITEM",
          `🔄 Component Returned: ${comp.name}`,
          `${req.requesterName} returned ${qtyToReturn} pcs of ${comp.name} (${condition} condition).`
        );
      }
      this.saveComponents(components);

      this.logTransaction(
        comp.id,
        comp.name,
        "ITEM_RETURNED",
        qtyToReturn,
        prevQty,
        comp.quantity,
        `Returned ${qtyToReturn} unit(s) of ${comp.name} (Condition: ${condition}).`
      );
    }

    return req;
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
      `📦 Item Moved: ${comp.name}`,
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
        `🔄 Mutual Box Swap: ${prevBoxId} ↔ ${targetBoxId}`,
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
        `📦 Material Moved: ${comp.name}`,
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
      `🏷️ Box Relocated / Renamed: ${cleanOldId} → ${newBoxId}`,
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
      `🔄 Box Contents Swapped: ${boxId1} ↔ ${boxId2}`,
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
      return data ? JSON.parse(data) : INITIAL_REQUESTS;
    } catch (e) {
      return INITIAL_REQUESTS;
    }
  }

  static saveRequests(requests) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }

  static submitComponentRequest(componentId, qtyRequested, requesterName, notes = "") {
    const components = this.getComponents();
    const comp = components.find(c => c.id === componentId);
    if (!comp) throw new Error("Component not found!");

    const requests = this.getRequests();
    const session = this.getCurrentSession();

    const newReq = {
      id: "REQ-" + Date.now().toString().slice(-4),
      componentId: comp.id,
      componentName: comp.name,
      requesterName: requesterName || (session ? session.fullName : "Student"),
      role: USER_ROLES[this.getRole()] || "Student",
      qtyRequested,
      returnedQty: 0,
      status: "PENDING",
      requestedAt: new Date().toLocaleString(),
      notes: notes || `Requested ${qtyRequested} ${comp.unit} of ${comp.name}`
    };

    requests.unshift(newReq);
    this.saveRequests(requests);

    this.addNotification(
      "PENDING_APPROVAL",
      "📋 New Checkout Request Submitted",
      `${newReq.requesterName} requested ${qtyRequested} pcs of ${comp.name}.`
    );

    this.logTransaction(
      comp.id,
      comp.name,
      "CHECK_OUT",
      0,
      comp.quantity,
      comp.quantity,
      `Checkout request submitted by ${requesterName} for ${qtyRequested} unit(s). Pending Admin approval.`
    );

    return newReq;
  }

  static approveRequest(requestId) {
    const requests = this.getRequests();
    const components = this.getComponents();
    const req = requests.find(r => r.id === requestId);

    if (!req || req.status !== "PENDING") return false;

    const comp = components.find(c => c.id === req.componentId);
    if (!comp) throw new Error("Component not found!");
    if (comp.quantity < req.qtyRequested) {
      throw new Error(`Insufficient inventory to approve! Requested: ${req.qtyRequested}, Available: ${comp.quantity}`);
    }

    const prevQty = comp.quantity;
    comp.quantity -= req.qtyRequested;
    comp.inventoryState = "BORROWED";
    req.status = "APPROVED";
    req.approvedAt = new Date().toLocaleString();

    this.saveComponents(components);
    this.saveRequests(requests);

    this.addNotification(
      "REQUEST_STATUS",
      "✅ Request Approved by Admin",
      `Checkout request #${req.id} for ${req.componentName} (${req.qtyRequested} pcs) was APPROVED.`
    );

    this.logTransaction(
      comp.id,
      comp.name,
      "REQUEST_APPROVED",
      -req.qtyRequested,
      prevQty,
      comp.quantity,
      `Approved checkout request #${req.id} for ${req.requesterName} (${req.qtyRequested} ${comp.unit}).`
    );

    return true;
  }

  static rejectRequest(requestId, reason = "") {
    const requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return false;

    req.status = "REJECTED";
    req.notes += ` [Rejected by Admin: ${reason || 'No reason provided'}]`;
    this.saveRequests(requests);

    this.addNotification(
      "REQUEST_STATUS",
      "❌ Request Rejected by Admin",
      `Checkout request #${req.id} for ${req.componentName} was REJECTED: ${reason}`
    );

    return true;
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
          return parsed;
        }
      }
    } catch (e) {}

    if (typeof INITIAL_COMPONENTS !== "undefined" && Array.isArray(INITIAL_COMPONENTS) && INITIAL_COMPONENTS.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(INITIAL_COMPONENTS));
      } catch (e) {}
      return INITIAL_COMPONENTS;
    }
    return [];
  }

  static saveComponents(components) {
    safeSetItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(components));
    this.pushCentralServerSync();
  }

  static deleteComponent(componentId) {
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
        alert("🎉 Backup imported successfully! All your custom box moves and components are restored.");
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    };
    reader.readAsText(file);
  }
}
