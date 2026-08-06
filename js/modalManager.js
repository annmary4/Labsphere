/**
 * LabSphere Modal Manager - Enterprise Workflows, Partial Returns & Project Workspace Edition
 */

class ModalManager {
  static init(callbacks = {}) {
    this.callbacks = callbacks;
    this.currentComponent = null;
    this.isEditMode = false;
    this.isInitialized = true;

    try {
      this.bindEvents();
      console.log('[ModalManager] bindEvents() OK');
    } catch (e) {
      console.error('[ModalManager] bindEvents() threw:', e.message, e);
    }
  }

  static showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    toast.style.cssText = "background:#0f172a; color:#38bdf8; border:2px solid #38bdf8; padding:14px 20px; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,0.6); font-weight:700; font-size:0.95rem; margin-bottom:12px; display:flex; align-items:center; gap:10px; position:fixed; top:20px; right:20px; z-index:9999;";
    toast.innerHTML = `<span style="font-size:1.3rem;">🎉</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s ease";
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }

  static bindEvents() {
    // Notification Center Dropdown
    const btnNotif = document.getElementById("btn-nav-notif");
    const notifDropdown = document.getElementById("notif-dropdown");

    if (btnNotif && notifDropdown) {
      btnNotif.addEventListener("click", (e) => {
        e.stopPropagation();
        this.renderNotificationCenter();
        notifDropdown.classList.toggle("show");
      });
      document.addEventListener("click", () => notifDropdown.classList.remove("show"));
    }

    const markReadBtn = document.getElementById("btn-mark-notif-read");
    if (markReadBtn) {
      markReadBtn.addEventListener("click", () => {
        StorageService.markNotificationsRead();
        this.renderNotificationCenter();
        if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
      });
    }

    // QR / Barcode Scanner Modal Listeners
    const closeQrModal = document.getElementById("btn-close-qr-modal");
    const submitQrScan = document.getElementById("btn-submit-qr-scan");

    if (closeQrModal) closeQrModal.addEventListener("click", () => this.closeScanQrModal());
    if (submitQrScan) submitQrScan.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleScanBarcode();
    });

    // User Manager Modal Listeners
    const closeUserMgr = document.getElementById("btn-close-user-mgr-modal");
    const createUserBtn = document.getElementById("btn-create-user-submit");

    if (closeUserMgr) closeUserMgr.addEventListener("click", () => this.closeUserManagerModal());
    if (createUserBtn) createUserBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleCreateUser();
    });

    // Login Modal listeners
    const closeLogin = document.getElementById("btn-close-login-modal");
    const submitLogin = document.getElementById("btn-submit-login");
    const forgotPw = document.getElementById("btn-forgot-password-link");

    if (closeLogin) closeLogin.addEventListener("click", () => this.closeLoginModal());
    if (submitLogin) submitLogin.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleLoginSubmit();
    });

    if (forgotPw) forgotPw.addEventListener("click", () => {
      this.closeLoginModal();
      this.openResetPasswordModal();
    });

    // Demo Accounts
    const demoAdmin = document.getElementById("demo-login-admin");
    const demoEng = document.getElementById("demo-login-engineer");
    const demoStudent = document.getElementById("demo-login-student");
    const demoMgmt = document.getElementById("demo-login-mgmt");

    if (demoAdmin) demoAdmin.addEventListener("click", () => this.loginWithAccount("admin@labsphere.io", "admin123"));
    if (demoEng) demoEng.addEventListener("click", () => this.loginWithAccount("engineer@labsphere.io", "eng123"));
    if (demoStudent) demoStudent.addEventListener("click", () => this.loginWithAccount("student@labsphere.io", "student123"));
    if (demoMgmt) demoMgmt.addEventListener("click", () => this.loginWithAccount("mgmt@labsphere.io", "mgmt123"));

    // Reset Password
    const closeResetPw = document.getElementById("btn-close-reset-pw-modal");
    const submitResetPw = document.getElementById("btn-submit-reset-pw");

    if (closeResetPw) closeResetPw.addEventListener("click", () => this.closeResetPasswordModal());
    if (submitResetPw) submitResetPw.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleResetPasswordSubmit();
    });

    // Component Modal listeners
    const closeBtn = document.getElementById("btn-close-component-modal");
    const doneBtn = document.getElementById("btn-close-view");
    const cancelEditBtn = document.getElementById("btn-cancel-edit");
    const backdrop = document.getElementById("component-modal");

    if (closeBtn) closeBtn.addEventListener("click", () => this.closeComponentModal());
    if (doneBtn) doneBtn.addEventListener("click", () => this.closeComponentModal());
    if (cancelEditBtn) cancelEditBtn.addEventListener("click", () => this.toggleEditMode(false));

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.closeComponentModal();
      });
    }

    const requestBtn = document.getElementById("btn-request-component");
    if (requestBtn) requestBtn.addEventListener("click", () => this.handleStudentRequest());

    const printCompQrBtn = document.getElementById("btn-print-comp-qr");
    if (printCompQrBtn) {
      printCompQrBtn.addEventListener("click", () => {
        if (this.currentComponent) this.printComponentQrCode(this.currentComponent.id);
      });
    }

    const moveBoxBtn = document.getElementById("btn-move-box-component");
    if (moveBoxBtn) moveBoxBtn.addEventListener("click", () => this.handleMoveComponentToBox());

    const editBtn = document.getElementById("btn-edit-component");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        if (!StorageService.isRole("ADMIN")) {
          StorageService.setRole("ADMIN");
        }
        this.toggleEditMode(true);
      });
    }

    const compForm = document.getElementById("component-form");
    if (compForm) {
      compForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSaveComponent();
      });
    }

    const saveBtn = document.getElementById("btn-save-component");
    if (saveBtn) {
      saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleSaveComponent();
      });
    }

    const deleteBtn = document.getElementById("btn-delete-component");
    if (deleteBtn) deleteBtn.addEventListener("click", () => this.handleDeleteComponent());

    const deleteEditBtn = document.getElementById("btn-delete-component-edit");
    if (deleteEditBtn) deleteEditBtn.addEventListener("click", () => this.handleDeleteComponent());

    const minusBtn = document.getElementById("insp-qty-minus");
    const plusBtn = document.getElementById("insp-qty-plus");

    if (minusBtn) minusBtn.addEventListener("click", () => this.adjustQuantity(-1));
    if (plusBtn) plusBtn.addEventListener("click", () => this.adjustQuantity(1));

    // Modals
    const closeBoxModal = document.getElementById("btn-close-box-modal");
    const closeBoxMgr = document.getElementById("btn-close-box-mgr");
    const createBoxBtn = document.getElementById("btn-create-box");

    if (closeBoxModal) closeBoxModal.addEventListener("click", () => this.closeBoxModal());
    if (closeBoxMgr) closeBoxMgr.addEventListener("click", () => this.closeBoxModal());
    if (createBoxBtn) createBoxBtn.addEventListener("click", () => this.handleCreateBox());

    const closeProjModal = document.getElementById("btn-close-proj-modal");
    const createProjBtn = document.getElementById("btn-create-project-submit");
    if (closeProjModal) closeProjModal.addEventListener("click", () => this.closeProjectModal());
    if (createProjBtn) createProjBtn.addEventListener("click", () => this.handleCreateProject());

    const closeAuditModal = document.getElementById("btn-close-audit-modal");
    if (closeAuditModal) closeAuditModal.addEventListener("click", () => this.closeAuditModal());

    const closeProcureModal = document.getElementById("btn-close-procure-modal");
    const exportProcureBtn = document.getElementById("btn-export-procure-csv");
    if (closeProcureModal) closeProcureModal.addEventListener("click", () => this.closeProcurementModal());
    if (exportProcureBtn) exportProcureBtn.addEventListener("click", () => this.exportProcurementCSV());

    const closeStudentReqModal = document.getElementById("btn-close-student-req-modal");
    if (closeStudentReqModal) closeStudentReqModal.addEventListener("click", () => this.closeStudentRequestsModal());

    const closeAdminApprModal = document.getElementById("btn-close-admin-appr-modal");
    if (closeAdminApprModal) closeAdminApprModal.addEventListener("click", () => this.closeAdminApprovalModal());

    const closeBomModal = document.getElementById("btn-close-bom-modal");
    const parseBomBtn = document.getElementById("btn-parse-bom-submit");
    if (closeBomModal) closeBomModal.addEventListener("click", () => this.closeBomModal());
    if (parseBomBtn) parseBomBtn.addEventListener("click", () => this.handleParseBOM());

    const closeMgmtModal = document.getElementById("btn-close-mgmt-modal");
    if (closeMgmtModal) closeMgmtModal.addEventListener("click", () => this.closeManagementModal());
  }

  // --- NOTIFICATION CENTER RENDERER ---
  static renderNotificationCenter() {
    const notifs = StorageService.getNotifications();
    const list = document.getElementById("notif-list");
    const badge = document.getElementById("notif-unread-count");

    const unreadCount = notifs.filter(n => !n.read).length;
    if (badge) {
      badge.innerText = unreadCount;
      if (unreadCount > 0) badge.classList.remove("hidden");
      else badge.classList.add("hidden");
    }

    if (list) {
      list.innerHTML = "";
      if (notifs.length === 0) {
        list.innerHTML = `<p class="empty-hint" style="padding:12px; text-align:center;">No notifications at this time.</p>`;
      } else {
        notifs.forEach(n => {
          const item = document.createElement("div");
          item.className = `notif-item ${n.read ? 'read' : 'unread'}`;
          item.innerHTML = `
            <div class="notif-title"><strong>${n.title}</strong></div>
            <p class="notif-msg">${n.message}</p>
            <span class="notif-time">${n.timestamp}</span>
          `;
          list.appendChild(item);
        });
      }
    }
  }

  // --- BARCODE & QR SCANNER MODAL ---
  static openScanQrModal() {
    const backdrop = document.getElementById("scan-qr-modal");
    document.getElementById("qr-input-code").value = "";
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeScanQrModal() {
    const backdrop = document.getElementById("scan-qr-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static handleScanBarcode() {
    const code = document.getElementById("qr-input-code").value.trim();
    if (!code) {
      alert("Please scan or enter a Barcode / QR Code / Component ID.");
      return;
    }

    const comp = StorageService.getComponentByBarcode(code);
    if (!comp) {
      alert(`No component found matching Barcode / QR Code '${code}'.`);
      return;
    }

    this.closeScanQrModal();
    this.openComponentInspector(comp);
  }

  // --- ADMINISTRATOR USER MANAGEMENT MODAL ---
  static openUserManagerModal() {
    const backdrop = document.getElementById("user-manager-modal");
    this.renderUsersTable();
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeUserManagerModal() {
    const backdrop = document.getElementById("user-manager-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static renderUsersTable() {
    const users = StorageService.getUsers();
    const tbody = document.getElementById("users-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    users.forEach(u => {
      const tr = document.createElement("tr");

      let statusBadge = `<span class="stock-tag success">ACTIVE</span>`;
      if (u.status === "DISABLED") {
        statusBadge = `<span class="stock-tag danger">DISABLED</span>`;
      }

      tr.innerHTML = `
        <td>
          <strong>${u.fullName}</strong><br>
          <span class="mono text-muted" style="font-size:0.75rem;">@${u.username}</span>
        </td>
        <td>${u.email}</td>
        <td>
          <select class="user-role-select" data-user-id="${u.id}" style="padding:4px 8px; background:var(--bg-dark); color:var(--text-main); border:1px solid var(--border-color); border-radius:4px;">
            <option value="STUDENT" ${u.role === 'STUDENT' ? 'selected' : ''}>Student</option>
            <option value="ENGINEER" ${u.role === 'ENGINEER' ? 'selected' : ''}>Engineer</option>
            <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
            <option value="MANAGEMENT" ${u.role === 'MANAGEMENT' ? 'selected' : ''}>Management</option>
          </select>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm btn-toggle-status" data-user-id="${u.id}">
              ${u.status === 'ACTIVE' ? '🚫 Disable' : '✅ Enable'}
            </button>
            <button class="btn btn-secondary btn-sm btn-reset-pw" data-user-id="${u.id}">
              🔑 Reset PW
            </button>
            <button class="btn btn-secondary btn-sm btn-view-activity" data-user-id="${u.id}">
              📜 Activity
            </button>
          </div>
        </td>
      `;

      tr.querySelector(".user-role-select").addEventListener("change", (e) => {
        StorageService.updateUserRole(u.id, e.target.value);
        alert(`Updated role for ${u.email} to ${e.target.value}!`);
        this.renderUsersTable();
        if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
      });

      tr.querySelector(".btn-toggle-status").addEventListener("click", () => {
        const updated = StorageService.toggleUserStatus(u.id);
        alert(`Account '${updated.email}' is now ${updated.status}.`);
        this.renderUsersTable();
      });

      tr.querySelector(".btn-reset-pw").addEventListener("click", () => {
        const newPw = prompt(`Enter new password for ${u.fullName} (${u.email}):`, "newpass123");
        if (newPw) {
          StorageService.adminResetPassword(u.id, newPw);
          alert(`Password successfully force-reset for ${u.email}!`);
        }
      });

      tr.querySelector(".btn-view-activity").addEventListener("click", () => {
        this.renderUserActivityInspector(u.id);
      });

      tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  static handleCreateUser() {
    const fullName = document.getElementById("new-user-fullname").value.trim();
    const email = document.getElementById("new-user-email").value.trim();
    const username = document.getElementById("new-user-username").value.trim();
    const password = document.getElementById("new-user-password").value;
    const role = document.getElementById("new-user-role").value;

    if (!fullName || !email || !username || !password) {
      alert("Please fill in all user registration fields.");
      return;
    }

    try {
      const newUser = StorageService.createUser(username, email, password, role, fullName);
      alert(`Success! Created user account '${newUser.fullName}' (${newUser.email}) with role ${newUser.role}.`);
      document.getElementById("create-user-form").reset();
      this.renderUsersTable();
    } catch (err) {
      alert(err.message);
    }
  }

  static renderUserActivityInspector(userId) {
    const history = StorageService.getUserActivityHistory(userId);
    const container = document.getElementById("user-activity-container");
    if (!container || !history.user) return;

    let html = `<h4 style="color:var(--primary); margin-bottom:8px;">📜 Activity History for ${history.user.fullName} (${history.user.email})</h4>`;

    if (history.userSecLogs.length === 0 && history.userReqs.length === 0) {
      html += `<p class="empty-hint">No activity recorded for this user yet.</p>`;
    } else {
      history.userSecLogs.forEach(s => {
        html += `
          <div class="audit-timeline-item">
            <div class="audit-badge ${s.eventType}">
              <i data-lucide="key"></i> ${s.eventType}
            </div>
            <div class="audit-details">
              <strong>${s.username}</strong>
              <p class="audit-notes">${s.details}</p>
              <span class="audit-meta">${s.timestamp}</span>
            </div>
          </div>
        `;
      });
      history.userReqs.forEach(r => {
        html += `
          <div class="audit-timeline-item">
            <div class="audit-badge CHECK_OUT">
              <i data-lucide="hand-metal"></i> CHECKOUT_REQUEST
            </div>
            <div class="audit-details">
              <strong>Requested ${r.qtyRequested} pcs of ${r.componentName}</strong>
              <p class="audit-notes">${r.notes}</p>
              <span class="audit-meta">Status: ${r.status} &bull; ${r.requestedAt}</span>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
    container.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
  }

  // --- INSPECTOR MODAL ---
  static openComponentInspector(component, startInEditMode = false) {
    if (!component) return;

    if (typeof component === "string") {
      const comps = StorageService.getComponents();
      const found = comps.find(c => c.id === component || (c.name && c.name.toLowerCase() === component.toLowerCase()));
      if (found) {
        component = found;
      } else {
        console.warn("[ModalManager] Component not found by ID/Name:", component);
        return;
      }
    }

    this.currentComponent = component;

    // If starting in edit mode, launch the standalone edit popup dialog directly
    if (startInEditMode && window.openComponentEditDialog) {
      this.closeComponentModal();
      window.openComponentEditDialog(component.id);
      return;
    }

    // POP UP THE MODAL BACKDROP IMMEDIATELY AT BODY LEVEL
    let backdrop = document.getElementById("component-modal");
    if (backdrop) {
      if (backdrop.parentNode !== document.body) {
        document.body.appendChild(backdrop);
      }
      backdrop.classList.remove("hidden");
      backdrop.style.cssText = "display:flex !important; position:fixed !important; inset:0 !important; width:100vw !important; height:100vh !important; z-index:9999999 !important; background:rgba(15,23,42,0.9) !important; backdrop-filter:blur(6px) !important; align-items:center !important; justify-content:center !important; visibility:visible !important; opacity:1 !important;";

      // Allow clicking on dark background backdrop to close modal
      backdrop.onclick = (e) => {
        if (e.target === backdrop) {
          ModalManager.closeComponentModal();
        }
      };
    }

    try {
      this.renderInspectorData(component);
    } catch (e) {
      console.error("[ModalManager] renderInspectorData error:", e);
    }

    try {
      this.toggleEditMode(startInEditMode);
    } catch (e) {
      console.error("[ModalManager] toggleEditMode error:", e);
    }
  }

  static openComponentEditor(component) {
    if (typeof component === "object" && component.id) {
      component = component.id;
    }
    if (window.openComponentEditDialog) {
      this.closeComponentModal();
      window.openComponentEditDialog(component);
    } else {
      this.openComponentInspector(component, true);
    }
  }

  static closeComponentModal() {
    const backdrop = document.getElementById("component-modal");
    if (backdrop) {
      backdrop.classList.add("hidden");
      backdrop.style.cssText = "display:none !important; visibility:hidden !important; opacity:0 !important; z-index:-1 !important;";
    }
    const directEdit = document.getElementById("direct-edit-dialog");
    if (directEdit) {
      directEdit.remove();
    }
  }

  // --- MULTI-COMPONENT BOX CONTENTS INSPECTOR MODAL ---
  static openBoxInspectorModal(boxId, components) {
    const backdrop = document.getElementById("box-inspector-modal");
    const titleEl = document.getElementById("box-insp-modal-title");
    const pathEl = document.getElementById("box-insp-location-path");
    const descEl = document.getElementById("box-insp-desc");
    const container = document.getElementById("box-insp-cards-container");

    if (!backdrop || !container) return;

    const allNamesStr = components.map(c => c.name).join(" + ");
    if (titleEl) titleEl.innerText = `📦 ${boxId}: ${allNamesStr} (${components.length} Items Inside)`;

    if (components.length > 0) {
      const c = components[0];
      const lab = c.labName || "Main Robotics & Embedded Systems Lab";
      const room = c.roomName || (c.rackId === 1 ? "Room 101 - Prototyping Hall" : "Room 102 - Storage Bay");
      if (pathEl) pathEl.innerText = `📍 ${lab} › ${room} › Rack ${c.rackId} › Shelf ${String.fromCharCode(64 + Number(c.shelfId))} › ${boxId}`;
    }

    if (descEl) descEl.innerText = `This physical box (${boxId}) contains ${components.length} component(s): [ ${allNamesStr} ]. All items inside are displayed side-by-side below:`;

    container.innerHTML = "";
    const isAdmin = StorageService.isRole("ADMIN");

    components.forEach((c, idx) => {
      const card = document.createElement("div");
      card.className = "box-comp-item-card";
      card.style.cssText = "background:var(--bg-dark); border:1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:12px; position:relative;";

      let stockTagClass = "IN_STOCK";
      let stockTagText = `In Stock (${c.quantity} ${c.unit || 'pcs'})`;
      if (c.quantity === 0) {
        stockTagClass = "OUT_OF_STOCK";
        stockTagText = "Out of Stock";
      } else if (c.quantity <= c.minQuantity) {
        stockTagClass = "LOW_STOCK";
        stockTagText = `Low Stock (${c.quantity} ${c.unit || 'pcs'})`;
      }

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
          <div>
            <span class="shelf-level-tag" style="margin-bottom:4px; display:inline-block;">Item #${idx + 1} in ${c.boxId}</span>
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin:0;">${c.name}</h3>
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">PN: ${c.partNumber || 'N/A'} &bull; ${c.manufacturer || 'N/A'}</span>
          </div>
          <span class="stock-tag ${stockTagClass}">${stockTagText}</span>
        </div>

        <div style="display:flex; gap:12px; align-items:center;">
          <img src="${ComponentsView.getAccurateImageForComponent ? ComponentsView.getAccurateImageForComponent(c) : (c.imageUrl || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&q=80')}" style="width:70px; height:70px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color);" />
          <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
            <div><strong>Stack Layer:</strong> ${c.stackLayer || 'Layer 1'}</div>
            <div><strong>Category:</strong> ${c.category}</div>
            <div><strong>Unit Price:</strong> ₹${(c.unitPrice || 0).toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div style="background:var(--bg-card); padding:8px 10px; border-radius:6px; font-size:0.75rem; color:var(--text-main);">
          <strong>Purpose / Specs:</strong> ${c.purpose || c.specifications || 'Standard electronics component.'}
        </div>

        <div style="display:flex; gap:8px; margin-top:auto; padding-top:10px; border-top:1px dashed var(--border-color); align-items:center; justify-content:space-between;">
          <button class="btn btn-sm btn-primary btn-req-item" data-id="${c.id}">
            <i data-lucide="shopping-bag"></i> Request Checkout
          </button>
          
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-secondary btn-move-item" data-id="${c.id}" title="Move only this component to a different box">
              <i data-lucide="corner-up-right"></i> Move Box
            </button>
            <button class="btn btn-sm btn-secondary btn-inspect-single" data-id="${c.id}">
              <i data-lucide="sliders"></i> Full Details
            </button>
            <button class="btn btn-sm btn-warning btn-qty-plus" data-id="${c.id}" title="Add 1 Qty">+1</button>
            <button class="btn btn-sm btn-danger btn-qty-minus" data-id="${c.id}" title="Remove 1 Qty">-1</button>
          </div>
        </div>
      `;

      card.querySelector(".btn-req-item").addEventListener("click", () => {
        const qtyStr = prompt(`Request Checkout for '${c.name}':\n\nEnter quantity to borrow (Available: ${c.quantity} ${c.unit || 'pcs'}):`, "1");
        if (!qtyStr) return;
        const qty = parseInt(qtyStr);
        if (isNaN(qty) || qty <= 0) {
          alert("Please enter a valid positive number.");
          return;
        }
        try {
          StorageService.submitComponentRequest(c.id, qty);
          alert(`Successfully submitted checkout request for ${qty} ${c.unit || 'pcs'} of ${c.name}!`);
          if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
        } catch (err) {
          alert(err.message);
        }
      });

      card.querySelector(".btn-move-item").addEventListener("click", () => {
        const targetBoxStr = prompt(`Relocate Component '${c.name}':\n\nCurrent Box: ${c.boxId}\nEnter target Box ID to move '${c.name}' into (e.g. BOX A-006, BOX B-001):`, "");
        if (!targetBoxStr || !targetBoxStr.trim()) return;

        try {
          StorageService.moveSingleComponentToBox(c.id, targetBoxStr.trim());
          const msg = `🎉 Successfully moved '${c.name}' into ${targetBoxStr.trim().toUpperCase()}!`;
          alert(msg);
          ModalManager.showToast(msg, "success");

          if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();

          const remainingComps = StorageService.getComponents().filter(x => x.boxId === boxId);
          if (remainingComps.length > 0) {
            this.openBoxInspectorModal(boxId, remainingComps);
          } else {
            this.closeBoxInspectorModal();
          }
        } catch (err) {
          alert(`Move Failed: ${err.message}`);
        }
      });

      card.querySelector(".btn-inspect-single").addEventListener("click", () => {
        this.closeBoxInspectorModal();
        this.openComponentInspector(c);
      });

      if (isAdmin) {
        card.querySelector(".btn-qty-plus").addEventListener("click", () => {
          this.currentComponent = c;
          this.adjustQuantity(1);
          this.openBoxInspectorModal(boxId, StorageService.getComponents().filter(x => x.boxId === boxId));
        });
        card.querySelector(".btn-qty-minus").addEventListener("click", () => {
          this.currentComponent = c;
          this.adjustQuantity(-1);
          this.openBoxInspectorModal(boxId, StorageService.getComponents().filter(x => x.boxId === boxId));
        });
      }

      container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
    backdrop.classList.remove("hidden");
    backdrop.style.display = "flex";
  }

  static closeBoxInspectorModal() {
    const backdrop = document.getElementById("box-inspector-modal");
    if (backdrop) {
      backdrop.classList.add("hidden");
      backdrop.style.display = "none";
    }
  }

  static openAddComponentModal(defaultRackId = 1, defaultShelfId = 1, defaultBoxId = "") {
    this.currentComponent = null;

    const form = document.getElementById("component-form");
    if (form) form.reset();

    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    setVal("form-comp-id", "");
    setVal("form-rack", defaultRackId);
    setVal("form-shelf", defaultShelfId);
    setVal("form-box", defaultBoxId || `BOX A-001`);

    const modalTitle = document.getElementById("modal-title");
    if (modalTitle) modalTitle.innerText = "Add New Component";

    this.toggleEditMode(true);

    const backdrop = document.getElementById("component-modal");
    if (backdrop) {
      backdrop.classList.remove("hidden");
      backdrop.style.display = "flex";
    }
  }

  static toggleEditMode(edit) {
    this.isEditMode = edit;

    if (edit && this.currentComponent && window.openComponentEditDialog) {
      const compId = this.currentComponent.id;
      this.closeComponentModal();
      window.openComponentEditDialog(compId);
      return;
    }

    const viewContainer = document.getElementById("modal-view-mode");
    const formContainer = document.getElementById("component-form");
    const viewFooter = document.getElementById("modal-view-footer");
    const formFooter = document.getElementById("modal-form-footer");
    const modalTitle = document.getElementById("modal-title");
    const tabView = document.getElementById("modal-tab-view");
    const tabEdit = document.getElementById("modal-tab-edit");

    if (edit) {
      if (viewContainer) { viewContainer.classList.add("hidden"); viewContainer.style.display = "none"; }
      if (formContainer) { formContainer.classList.remove("hidden"); formContainer.style.display = "block"; }
      if (viewFooter) { viewFooter.classList.add("hidden"); viewFooter.style.display = "none"; }
      if (formFooter) { formFooter.classList.remove("hidden"); formFooter.style.display = "flex"; }

      if (tabView) { tabView.style.background = "transparent"; tabView.style.color = "var(--text-muted)"; }
      if (tabEdit) { tabEdit.style.background = "#0ea5e9"; tabEdit.style.color = "white"; }

      if (this.currentComponent) {
        if (modalTitle) modalTitle.innerText = `✏️ Edit Details: ${this.currentComponent.name}`;
        this.populateFormWithComponent(this.currentComponent);
      }
    } else {
      if (viewContainer) { viewContainer.classList.remove("hidden"); viewContainer.style.display = "block"; }
      if (formContainer) { formContainer.classList.add("hidden"); formContainer.style.display = "none"; }
      if (viewFooter) { viewFooter.classList.remove("hidden"); viewFooter.style.display = "flex"; }
      if (formFooter) { formFooter.classList.add("hidden"); formFooter.style.display = "none"; }

      if (tabView) { tabView.style.background = "#0284c7"; tabView.style.color = "white"; }
      if (tabEdit) { tabEdit.style.background = "transparent"; tabEdit.style.color = "var(--text-muted)"; }

      if (this.currentComponent && modalTitle) {
        modalTitle.innerText = `👁️ View Info: ${this.currentComponent.name}`;
      }
    }
  }

  static renderInspectorData(c) {
    if (!c) return;

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = (val !== undefined && val !== null) ? val : "";
    };
    const setHtml = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = (val !== undefined && val !== null) ? val : "";
    };

    setTxt("insp-name", c.name);
    const mfg = c.manufacturer ? ` &bull; Manufacturer: ${c.manufacturer}` : "";
    setHtml("insp-part-number", `PN: ${c.partNumber || 'N/A'}${mfg}`);
    setTxt("insp-category", c.category);
    setTxt("insp-box-id", c.boxId);
    setTxt("insp-quantity", c.quantity);
    setTxt("insp-unit", c.unit || "pcs");
    setTxt("insp-min-qty", `${c.minQuantity || 0} ${c.unit || 'pcs'}`);

    // 6-TIER STORAGE HIERARCHY BREADCRUMB PATH
    const lab = c.labName || "Main Robotics & Embedded Systems Lab";
    const room = c.roomName || (c.rackId === 1 ? "Room 101 - Prototyping Hall" : "Room 102 - Storage Bay");
    const stack = c.stackLayer || "Layer 1 (Top Tray Bin #A)";

    setTxt("insp-location-path", `${lab} › ${room} › Rack ${c.rackId} › Shelf ${String.fromCharCode(64 + Number(c.shelfId))} › ${c.boxId} › ${stack}`);

    setTxt("insp-purpose", c.purpose || "No purpose description available.");
    setTxt("insp-specs", c.specifications || "No technical specs available.");
    setTxt("insp-updated", c.lastUpdated || "2026-07-29");

    // Multi-item Box Switcher Bar
    const boxComps = StorageService.getComponents().filter(item => item.boxId === c.boxId);
    let boxSwitcher = document.getElementById("insp-box-switcher");
    if (boxComps.length > 1) {
      if (!boxSwitcher) {
        const topBanner = document.querySelector(".inspector-top-banner");
        boxSwitcher = document.createElement("div");
        boxSwitcher.id = "insp-box-switcher";
        boxSwitcher.style.cssText = "display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; padding:6px 10px; background:var(--bg-dark); border-radius:6px; border:1px solid var(--border-color); font-size:0.75rem;";
        if (topBanner && topBanner.parentNode) {
          topBanner.parentNode.insertBefore(boxSwitcher, topBanner.nextSibling);
        } else {
          const viewMode = document.getElementById("modal-view-mode");
          if (viewMode) viewMode.prepend(boxSwitcher);
        }
      }

      let switcherHtml = `<span class="text-muted" style="font-weight:600;">📦 ${c.boxId} Contains ${boxComps.length} Items:</span>`;
      boxComps.forEach(item => {
        const activeStyle = item.id === c.id ? "background:var(--primary); color:#0f172a; font-weight:700;" : "background:var(--bg-card); color:var(--text-main);";
        switcherHtml += `<button class="btn btn-sm btn-switch-box-item" data-comp-id="${item.id}" style="padding:2px 8px; border-radius:4px; font-size:0.7rem; cursor:pointer; ${activeStyle}">${item.name}</button>`;
      });
      boxSwitcher.innerHTML = switcherHtml;
      boxSwitcher.classList.remove("hidden");

      boxSwitcher.querySelectorAll(".btn-switch-box-item").forEach(btn => {
        btn.addEventListener("click", () => {
          const compId = btn.getAttribute("data-comp-id");
          const target = boxComps.find(x => x.id === compId);
          if (target) {
            ModalManager.openComponentInspector(target);
          }
        });
      });
    } else if (boxSwitcher) {
      boxSwitcher.classList.add("hidden");
    }

    // Image Photo Display
    let imgWrap = document.getElementById("insp-image-wrap");
    if (!imgWrap) {
      const topBanner = document.querySelector(".inspector-top-banner");
      imgWrap = document.createElement("div");
      imgWrap.id = "insp-image-wrap";
      imgWrap.style.cssText = "width:100%; height:160px; border-radius:10px; overflow:hidden; margin-top:12px; background:#0f172a;";
      if (topBanner && topBanner.parentNode) {
        topBanner.parentNode.insertBefore(imgWrap, topBanner.nextSibling);
      } else {
        const viewMode = document.getElementById("modal-view-mode");
        if (viewMode) viewMode.appendChild(imgWrap);
      }
    }
    const imgSrc = ComponentsView.getAccurateImageForComponent ? ComponentsView.getAccurateImageForComponent(c) : (c.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80');
    imgWrap.innerHTML = `<img src="${imgSrc}" alt="${c.name}" style="width:100%; height:100%; object-fit:contain; background:#0f172a; padding:6px;" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'">`;

    // Inventory State Badge (AVAILABLE, RESERVED, BORROWED, DAMAGED, ARCHIVED)
    let stateSection = document.getElementById("insp-state-section");
    if (!stateSection) {
      const parent = document.getElementById("modal-view-mode");
      stateSection = document.createElement("div");
      stateSection.id = "insp-state-section";
      stateSection.className = "insp-section";
      parent.appendChild(stateSection);
    }
    const stateVal = c.inventoryState || "AVAILABLE";
    let stateClass = "success";
    if (stateVal === "BORROWED") stateClass = "warning";
    else if (stateVal === "RESERVED") stateClass = "info";
    else if (stateVal === "DAMAGED") stateClass = "danger";

    stateSection.innerHTML = `
      <h4><i data-lucide="shield-check"></i> Inventory Lifecycle State</h4>
      <p style="font-size:0.85rem;">Current State: <span class="stock-tag ${stateClass}">${stateVal}</span></p>
    `;

    // Compatible Components Section
    let compSection = document.getElementById("insp-compat-section");
    if (!compSection) {
      const parent = document.getElementById("modal-view-mode");
      compSection = document.createElement("div");
      compSection.id = "insp-compat-section";
      compSection.className = "insp-section";
      parent.appendChild(compSection);
    }
    const compatList = c.compatibleComponents || ["Arduino Uno", "ESP32", "Raspberry Pi", "Standard Breadboard"];
    let compatHtml = `<h4><i data-lucide="cpu"></i> Compatible Components & Systems</h4><div style="display:flex; flex-wrap:wrap; gap:6px;">`;
    compatList.forEach(item => {
      compatHtml += `<span class="tag-item" style="background:rgba(56,189,248,0.15); color:var(--primary); border:1px solid rgba(56,189,248,0.3);">⚡ ${item}</span>`;
    });
    compatHtml += `</div>`;
    compSection.innerHTML = compatHtml;

    // Drop-in Alternatives Section
    let altSection = document.getElementById("insp-alt-section");
    if (!altSection) {
      const parent = document.getElementById("modal-view-mode");
      altSection = document.createElement("div");
      altSection.id = "insp-alt-section";
      altSection.className = "insp-section";
      parent.appendChild(altSection);
    }
    const altList = c.alternatives || ["ESP8266 NodeMCU Module", "Raspberry Pi Pico W Board"];
    let altHtml = `<h4><i data-lucide="git-compare"></i> Suggested Drop-in Alternatives</h4><div style="background:var(--bg-dark); padding:10px; border-radius:8px; border:1px solid var(--border-color); font-size:0.85rem;">`;
    altList.forEach(alt => {
      altHtml += `<p style="margin-bottom:4px;">🔄 <strong>${alt}</strong> <span class="text-muted" style="font-size:0.75rem;">(Alternative drop-in substitute)</span></p>`;
    });
    altHtml += `</div>`;
    altSection.innerHTML = altHtml;

    // QR Code & Barcode Card
    let qrSection = document.getElementById("insp-qr-section");
    if (!qrSection) {
      const parent = document.getElementById("modal-view-mode");
      qrSection = document.createElement("div");
      qrSection.id = "insp-qr-section";
      qrSection.className = "insp-section";
      parent.appendChild(qrSection);
    }
    const barcodeVal = c.barcode || `LAB-${c.id}`;
    qrSection.innerHTML = `
      <h4><i data-lucide="qr-code"></i> Barcode & QR Identification</h4>
      <div style="display:flex; align-items:center; gap:14px; background:var(--bg-dark); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
        <div style="width:50px; height:50px; background:#fff; padding:4px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800; font-family:monospace; font-size:0.65rem; color:#000; text-align:center;">
          [QR CODE]<br>${c.id}
        </div>
        <div>
          <span class="mono" style="font-size:0.95rem; font-weight:700; color:var(--primary);">${barcodeVal}</span>
          <p class="text-muted" style="font-size:0.75rem;">Scan this QR/Barcode to instantly locate this item in LabSphere.</p>
        </div>
      </div>
    `;

    // Supplier & Procurement Card
    let suppSection = document.getElementById("insp-supp-section");
    if (!suppSection) {
      const parent = document.getElementById("modal-view-mode");
      suppSection = document.createElement("div");
      suppSection.id = "insp-supp-section";
      suppSection.className = "insp-section";
      parent.appendChild(suppSection);
    }
    const supp = c.supplierInfo || { vendorName: "Robu.in Electronics", vendorSku: "ROBU-GEN-01", vendorUrl: "https://robu.in/", unitPrice: c.unitPrice || 450, leadTimeDays: 2 };
    suppSection.innerHTML = `
      <h4><i data-lucide="shopping-bag"></i> Supplier & Procurement Info</h4>
      <div style="background:var(--bg-dark); padding:12px; border-radius:8px; border:1px solid var(--border-color); font-size:0.85rem;">
        <p><strong>Vendor:</strong> ${supp.vendorName} &bull; <strong>SKU:</strong> <span class="mono">${supp.vendorSku}</span></p>
        <p><strong>Unit Price:</strong> <span class="primary-text font-bold">₹${supp.unitPrice || c.unitPrice || 450}</span> &bull; <strong>Reorder Lead Time:</strong> ${supp.leadTimeDays || 3} Days</p>
        ${supp.vendorUrl ? `<p style="margin-top:4px;"><a href="${supp.vendorUrl}" target="_blank" class="link-btn">🛒 Direct Vendor Purchase Link</a></p>` : ''}
      </div>
    `;

    // Knowledge Base & PDF Datasheets
    let kbSection = document.getElementById("insp-kb-section");
    if (!kbSection) {
      const parent = document.getElementById("modal-view-mode");
      kbSection = document.createElement("div");
      kbSection.id = "insp-kb-section";
      kbSection.className = "insp-section";
      parent.appendChild(kbSection);
    }

    let kbHtml = `<h4><i data-lucide="book-open"></i> Component Specs & Knowledge Base</h4>`;
    kbHtml += `<div style="background:var(--bg-dark); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color); font-size:0.85rem; margin-bottom:8px;">`;
    kbHtml += `<p>🏷️ <strong>Barcode / ID:</strong> <span class="mono primary-text">${c.barcode || c.id}</span></p>`;
    kbHtml += `<p>🏭 <strong>Manufacturer:</strong> ${c.manufacturer || 'Lab Catalog Vendor'}</p>`;
    kbHtml += `<p>💵 <strong>Unit Price:</strong> ₹${(c.unitPrice || 450).toLocaleString('en-IN')}</p>`;
    if (c.tags && Array.isArray(c.tags) && c.tags.length > 0) {
      kbHtml += `<p style="margin-top:4px;">🏷️ <strong>Tags:</strong> ${c.tags.map(t => `<span class="tag-item" style="background:rgba(56,189,248,0.1); color:var(--primary); padding:2px 6px; font-size:0.7rem; border-radius:4px; margin-right:4px;">#${t}</span>`).join('')}</p>`;
    }
    kbHtml += `</div>`;

    if (c.datasheetUrl) {
      kbHtml += `<p style="margin-top:6px;">📄 <a href="${c.datasheetUrl}" target="_blank" class="link-btn" style="color:var(--primary); font-weight:700;">View Official Datasheet (PDF)</a></p>`;
    }
    if (c.pinoutNotes) {
      kbHtml += `<div class="insp-specs-box pinout-box" style="margin-top:6px;"><strong>Pinout Notes:</strong> ${c.pinoutNotes}</div>`;
    }
    kbSection.innerHTML = kbHtml;

    const badge = document.getElementById("insp-stock-badge");
    const badgeText = document.getElementById("insp-stock-text");
    if (c.quantity === 0) {
      badge.className = "inspector-stock-badge danger";
      badgeText.innerText = "Out of Stock";
    } else if (c.quantity <= c.minQuantity) {
      badge.className = "inspector-stock-badge warning";
      badgeText.innerText = "Low Stock Alert";
    } else {
      badge.className = "inspector-stock-badge success";
      badgeText.innerText = "In Stock";
    }

    const tagsList = document.getElementById("insp-tags-list");
    tagsList.innerHTML = "";
    if (c.tags && c.tags.length > 0) {
      c.tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "tag-item";
        span.innerText = `#${tag}`;
        tagsList.appendChild(span);
      });
    }

    // ALWAYS DISPLAY ALL IN-MODAL FEATURE BUTTONS
    const minusBtn = document.getElementById("insp-qty-minus");
    const plusBtn = document.getElementById("insp-qty-plus");
    if (minusBtn) minusBtn.style.display = "inline-block";
    if (plusBtn) plusBtn.style.display = "inline-block";

    const editBtn = document.getElementById("btn-edit-component");
    const moveBtn = document.getElementById("btn-move-box-component");
    const deleteBtn = document.getElementById("btn-delete-component");

    if (editBtn) editBtn.style.display = "inline-flex";
    if (moveBtn) moveBtn.style.display = "inline-flex";
    if (deleteBtn) deleteBtn.style.display = "inline-flex";

    if (window.lucide) window.lucide.createIcons();
  }

  static populateFormWithComponent(c) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = (val !== undefined && val !== null) ? val : "";
    };

    setVal("form-comp-id", c.id);
    setVal("form-name", c.name);
    setVal("form-part-number", c.partNumber || "");
    setVal("form-manufacturer", c.manufacturer || "");
    setVal("form-barcode", c.barcode || "");
    setVal("form-image-url", c.imageUrl || "");
    setVal("form-datasheet-url", c.datasheetUrl || "");
    setVal("form-lab-name", c.labName || "Main Robotics & Embedded Systems Lab");
    setVal("form-room-name", c.roomName || "Room 101 - Prototyping Hall");
    setVal("form-rack", c.rackId);
    setVal("form-shelf", c.shelfId);
    setVal("form-box", c.boxId);
    setVal("form-stack-layer", c.stackLayer || "Layer 1 (Top Compartment)");
    setVal("form-state", c.inventoryState || "AVAILABLE");

    const catSelect = document.getElementById("form-category");
    if (catSelect && c.category) {
      const opts = Array.from(catSelect.options);
      const exists = opts.some(o => o.value.toLowerCase() === c.category.toLowerCase());
      if (!exists) {
        const opt = document.createElement("option");
        opt.value = c.category;
        opt.innerText = c.category;
        catSelect.appendChild(opt);
      }
      catSelect.value = c.category;
    } else {
      setVal("form-category", c.category);
    }

    setVal("form-quantity", c.quantity);
    setVal("form-min-qty", c.minQuantity || 1);
    setVal("form-unit-price", c.unitPrice || 450);
    setVal("form-purpose", c.purpose || "");
    setVal("form-specs", c.specifications || "");
    setVal("form-compat", (c.compatibleComponents || []).join(", "));
    setVal("form-alternatives", (c.alternatives || []).join(", "));
    setVal("form-tags", (c.tags || []).join(", "));

    if (c.supplierInfo) {
      setVal("form-vendor-name", c.supplierInfo.vendorName || "");
      setVal("form-vendor-sku", c.supplierInfo.vendorSku || "");
      setVal("form-vendor-url", c.supplierInfo.vendorUrl || "");
      setVal("form-lead-time", c.supplierInfo.leadTimeDays || 3);
    }
  }

  static handleSaveComponent() {
    try {
      if (!StorageService.isRole("ADMIN")) {
        StorageService.setRole("ADMIN");
      }

      const getVal = (id, fallback = "") => {
        const el = document.getElementById(id);
        return el ? (el.value.trim() || fallback) : fallback;
      };

      const id = getVal("form-comp-id");
      const name = getVal("form-name");

      if (!name) {
        alert("Please enter a valid Component Name.");
        return;
      }

      const components = StorageService.getComponents();
      const manufacturer = getVal("form-manufacturer", "Lab Component Vendor");
      const labName = getVal("form-lab-name", "Main Robotics & Embedded Systems Lab");
      const roomName = getVal("form-room-name", "Room 101 - Prototyping Hall");
      const rackId = Number(getVal("form-rack", "1")) || 1;
      const shelfId = Number(getVal("form-shelf", "1")) || 1;
      const boxId = (getVal("form-box", "BOX A-001")).toUpperCase();

      // Auto-create box if it doesn't exist yet
      StorageService.ensureBoxExists(boxId, rackId, shelfId);

      const stackLayer = getVal("form-stack-layer", "Layer 1 (Top Compartment)");
      const inventoryState = getVal("form-state", "AVAILABLE");
      const category = getVal("form-category", "Microcontrollers & Dev Boards");
      const quantity = Number(getVal("form-quantity", "1")) || 1;
      const minQuantity = Number(getVal("form-min-qty", "1")) || 1;
      const unitPrice = Number(getVal("form-unit-price", "450")) || 450;
      const barcode = getVal("form-barcode", `8901234${Date.now().toString().slice(-6)}`);
      const imageUrl = getVal("form-image-url", "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&q=80");
      const datasheetUrl = getVal("form-datasheet-url");
      const purpose = getVal("form-purpose", "Standard laboratory electronic component.");
      const specifications = getVal("form-specs", "Standard operating parameters.");

      const compatRaw = getVal("form-compat");
      const compatibleComponents = compatRaw.split(",").map(t => t.trim()).filter(t => t.length > 0);

      const altRaw = getVal("form-alternatives");
      const alternatives = altRaw.split(",").map(t => t.trim()).filter(t => t.length > 0);

      const tagsRaw = getVal("form-tags");
      const tags = tagsRaw.split(",").map(t => t.trim().toLowerCase()).filter(t => t.length > 0);

      const supplierInfo = {
        vendorName: getVal("form-vendor-name", "Robu.in / Lab Vendor"),
        vendorSku: getVal("form-vendor-sku", `SKU-${name.slice(0, 4).toUpperCase()}`),
        vendorUrl: getVal("form-vendor-url"),
        unitPrice,
        leadTimeDays: Number(getVal("form-lead-time", "3")) || 3
      };

      if (id) {
        const existing = components.find(c => c.id === id);
        if (existing) {
          const prevQty = existing.quantity;
          existing.name = name;
          existing.partNumber = getVal("form-part-number", existing.partNumber);
          existing.manufacturer = manufacturer;
          existing.barcode = barcode;
          existing.imageUrl = imageUrl;
          existing.datasheetUrl = datasheetUrl;
          existing.labName = labName;
          existing.roomName = roomName;
          existing.rackId = rackId;
          existing.shelfId = shelfId;
          existing.boxId = boxId;
          existing.stackLayer = stackLayer;
          existing.inventoryState = inventoryState;
          existing.category = category;
          existing.quantity = quantity;
          existing.minQuantity = minQuantity;
          existing.unitPrice = unitPrice;
          existing.purpose = purpose;
          existing.specifications = specifications;
          existing.compatibleComponents = compatibleComponents;
          existing.alternatives = alternatives;
          existing.tags = tags;
          existing.supplierInfo = supplierInfo;
          existing.lastUpdated = new Date().toISOString().slice(0, 10);

          // Synchronize box location
          const targetBox = StorageService.ensureBoxExists(boxId);
          targetBox.rackId = rackId;
          targetBox.shelfId = shelfId;
          StorageService.saveBoxes(StorageService.getBoxes());

          StorageService.saveComponents(components);

          StorageService.logTransaction(
            existing.id,
            existing.name,
            "EDIT_DETAILS",
            quantity - prevQty,
            prevQty,
            quantity,
            "Updated component details, state, compatibility, & alternatives."
          );

          this.currentComponent = existing;
          const msg = `Successfully updated component '${name}'!`;
          alert(msg);
          ModalManager.showToast(msg, "success");
        }
      } else {
        const newComp = {
          id: "COMP-" + Date.now().toString().slice(-4),
          name,
          partNumber: getVal("form-part-number", `PN-${name.slice(0, 5).toUpperCase()}`),
          manufacturer,
          barcode,
          imageUrl,
          datasheetUrl,
          labName,
          roomName,
          rackId,
          shelfId,
          boxId,
          stackLayer,
          inventoryState,
          category,
          quantity,
          unit: "pcs",
          minQuantity,
          unitPrice,
          purpose,
          specifications,
          compatibleComponents,
          alternatives,
          tags,
          supplierInfo,
          lastUpdated: new Date().toISOString().slice(0, 10)
        };

        components.push(newComp);

        const targetBox = StorageService.ensureBoxExists(boxId);
        targetBox.rackId = rackId;
        targetBox.shelfId = shelfId;
        StorageService.saveBoxes(StorageService.getBoxes());

        StorageService.saveComponents(components);

        StorageService.logTransaction(
          newComp.id,
          newComp.name,
          "CREATE",
          quantity,
          0,
          quantity,
          "Created new laboratory component entry with inventory state."
        );

        this.currentComponent = newComp;
        const msg = `🎉 SUCCESS: Item '${name}' has been added successfully to ${boxId}!`;
        alert(msg);
        ModalManager.showToast(msg, "success");
      }

      this.closeComponentModal();

      if (this.callbacks.onInventoryChanged) {
        this.callbacks.onInventoryChanged();
      }
    } catch (err) {
      alert(`Save Failed: ${err.message}`);
      console.error("Save Component Error:", err);
    }
  }

  static adjustQuantity(delta) {
    if (!this.currentComponent) return;
    StorageService.setRole("ADMIN");

    const components = StorageService.getComponents();
    const target = components.find(item => item.id === this.currentComponent.id);

    if (target) {
      const prev = target.quantity;
      const newQty = Math.max(0, target.quantity + delta);
      if (prev === newQty) return;

      target.quantity = newQty;
      target.lastUpdated = new Date().toISOString().slice(0, 10);
      StorageService.saveComponents(components);

      const actionType = delta > 0 ? "QTY_ADD" : "QTY_REMOVE";
      StorageService.logTransaction(
        target.id,
        target.name,
        actionType,
        delta,
        prev,
        newQty,
        `Quick ${delta > 0 ? 'increase' : 'decrease'} of ${Math.abs(delta)} unit(s)`
      );

      this.currentComponent = target;
      this.renderInspectorData(target);

      if (this.callbacks.onInventoryChanged) {
        this.callbacks.onInventoryChanged();
      }
    }
  }

  static handleStudentRequest() {
    if (!this.currentComponent) return;
    const comp = this.currentComponent;

    const qtyStr = prompt(`Request Checkout for '${comp.name}':\nEnter quantity needed (Available: ${comp.quantity} ${comp.unit}):`, "1");
    if (!qtyStr) return;
    const qty = parseInt(qtyStr);

    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    const session = StorageService.getCurrentSession();
    const studentName = prompt("Enter Student / Intern Name:", session ? session.fullName : "Student Researcher");
    if (!studentName) return;

    try {
      StorageService.submitComponentRequest(comp.id, qty, studentName);
      alert(`Success! Checkout request for ${qty} ${comp.unit} of '${comp.name}' submitted. An Admin will review your request.`);
      this.closeComponentModal();
      if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
    } catch (err) {
      alert(err.message);
    }
  }

  static handleMoveComponentToBox() {
    if (!this.currentComponent) return;
    StorageService.setRole("ADMIN");
    const comp = this.currentComponent;

    const targetBoxStr = prompt(`Relocate Component '${comp.name}':\n\nCurrent Box: ${comp.boxId}\nEnter target Box ID to move '${comp.name}' into (e.g. BOX A-006, BOX B-001):`, "");
    if (!targetBoxStr || !targetBoxStr.trim()) return;

    try {
      StorageService.moveSingleComponentToBox(comp.id, targetBoxStr.trim());
      const msg = `🎉 Successfully moved '${comp.name}' into ${targetBoxStr.trim().toUpperCase()}!`;
      alert(msg);
      ModalManager.showToast(msg, "success");
      this.closeComponentModal();
      if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
    } catch (err) {
      alert(`Move Failed: ${err.message}`);
    }
  }

  static handleDeleteComponent() {
    if (!this.currentComponent) return;
    StorageService.setRole("ADMIN");

    if (confirm(`Are you sure you want to delete '${this.currentComponent.name}' (${this.currentComponent.boxId})?`)) {
      let components = StorageService.getComponents();
      const c = this.currentComponent;
      components = components.filter(item => item.id !== c.id);
      StorageService.saveComponents(components);

      StorageService.logTransaction(
        c.id,
        c.name,
        "DELETE",
        -c.quantity,
        c.quantity,
        0,
        `Deleted component entry from ${c.boxId}.`
      );

      this.closeComponentModal();

      if (this.callbacks.onInventoryChanged) {
        this.callbacks.onInventoryChanged();
      }
    }
  }

  static closeComponentModal() {
    const backdrop = document.getElementById("component-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static openLoginModal() {
    const backdrop = document.getElementById("login-modal");
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeLoginModal() {
    const backdrop = document.getElementById("login-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static handleLoginSubmit() {
    const input = document.getElementById("login-email").value.trim();
    const pw = document.getElementById("login-password").value;

    if (!input || !pw) {
      alert("Please enter both email/username and password.");
      return;
    }

    try {
      const session = StorageService.login(input, pw);
      alert(`Welcome back, ${session.fullName}! Successfully logged in as ${session.role}.`);
      this.closeLoginModal();
      if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
    } catch (err) {
      alert(err.message);
    }
  }

  static loginWithAccount(email, password) {
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = password;
    this.handleLoginSubmit();
  }

  static openResetPasswordModal() {
    const backdrop = document.getElementById("reset-pw-modal");
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeResetPasswordModal() {
    const backdrop = document.getElementById("reset-pw-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  // --- USER ACCOUNT & PERSONA MANAGER ---
  static openUserManagerModal() {
    const backdrop = document.getElementById("user-manager-modal");
    const tbody = document.getElementById("user-manager-table-body");
    const users = StorageService.getUsers();

    if (tbody) {
      tbody.innerHTML = "";
      users.forEach(u => {
        const tr = document.createElement("tr");
        const statusBadge = u.status === "ACTIVE" ? '<span class="stock-tag IN_STOCK">ACTIVE</span>' : '<span class="stock-tag OUT_OF_STOCK">DISABLED</span>';

        tr.innerHTML = `
          <td><strong>${u.fullName}</strong></td>
          <td class="mono">${u.username}</td>
          <td>${u.email}</td>
          <td><span class="role-badge role-${u.role.toLowerCase()}">${USER_ROLES[u.role] || u.role}</span></td>
          <td>${statusBadge}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-secondary btn-edit-user-name" data-id="${u.id}" data-name="${u.fullName}" title="Edit User Display Name"><i data-lucide="edit-3"></i> Edit Name</button>
              <button class="btn btn-sm btn-warning btn-toggle-user" data-id="${u.id}">${u.status === 'ACTIVE' ? 'Disable' : 'Enable'}</button>
            </div>
          </td>
        `;

        tr.querySelector(".btn-edit-user-name").addEventListener("click", () => {
          this.handleEditUserName(u.id, u.fullName, u.role);
        });

        tr.querySelector(".btn-toggle-user").addEventListener("click", () => {
          this.handleToggleUserStatus(u.id);
        });

        tbody.appendChild(tr);
      });
    }

    if (window.lucide) window.lucide.createIcons();
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeUserManagerModal() {
    const backdrop = document.getElementById("user-manager-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static handleEditUserName(userId, currentName, role) {
    const newName = prompt(`Edit Full Name for account (${role}):`, currentName);
    if (!newName || !newName.trim()) return;

    try {
      StorageService.updateUserNameById(userId, newName.trim());
      alert(`Success! Updated full name to '${newName.trim()}'.`);
      this.openUserManagerModal();
      if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
    } catch (err) {
      alert(err.message);
    }
  }

  static handleToggleUserStatus(userId) {
    try {
      const updated = StorageService.toggleUserStatus(userId);
      alert(`Account status updated to ${updated.status}.`);
      this.openUserManagerModal();
      if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
    } catch (err) {
      alert(err.message);
    }
  }

  static handleCreateUserSubmit() {
    const fullName = document.getElementById("new-user-fullname").value.trim();
    const username = document.getElementById("new-user-username").value.trim();
    const email = document.getElementById("new-user-email").value.trim();
    const password = document.getElementById("new-user-password").value;
    const role = document.getElementById("new-user-role").value;

    if (!fullName || !username || !email || !password) {
      alert("Please fill in Full Name, Username, Email, and Password.");
      return;
    }

    try {
      StorageService.createUser(username, email, password, role, fullName);
      alert(`Successfully registered new user '${fullName}' (${role})!`);
      document.getElementById("new-user-fullname").value = "";
      document.getElementById("new-user-username").value = "";
      document.getElementById("new-user-email").value = "";
      document.getElementById("new-user-password").value = "";

      this.openUserManagerModal();
      if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
    } catch (err) {
      alert(err.message);
    }
  }

  static handleResetPasswordSubmit() {
    const email = document.getElementById("reset-email").value.trim();
    const newPw = document.getElementById("reset-new-password").value;

    if (!email || !newPw) {
      alert("Please enter both email address and new password.");
      return;
    }

    try {
      StorageService.resetPassword(email, newPw);
      alert(`Password successfully updated for ${email}! You may now log in with your new password.`);
      this.closeResetPasswordModal();
      this.openLoginModal();
    } catch (err) {
      alert(err.message);
    }
  }

  static openAuditModal() {
    const backdrop = document.getElementById("audit-modal");
    const container = document.getElementById("audit-log-container");
    const transactions = StorageService.getTransactions();
    const securityLogs = StorageService.getSecurityLogs();

    if (container) {
      container.innerHTML = "";

      let html = `<h4 style="margin-bottom: 10px; color: var(--primary);"><i data-lucide="shield"></i> Authentication & Security Audit Logs</h4>`;
      securityLogs.forEach(s => {
        html += `
          <div class="audit-timeline-item">
            <div class="audit-badge ${s.eventType}">
              <i data-lucide="key"></i> ${s.eventType}
            </div>
            <div class="audit-details">
              <strong>${s.username}</strong> (${s.role})
              <p class="audit-notes">${s.details}</p>
              <span class="audit-meta">${s.timestamp}</span>
            </div>
          </div>
        `;
      });

      html += `<h4 style="margin-top: 20px; margin-bottom: 10px; color: var(--primary);"><i data-lucide="layers"></i> Inventory Transaction Log</h4>`;
      transactions.forEach(t => {
        html += `
          <div class="audit-timeline-item">
            <div class="audit-badge ${t.actionType}">
              <i data-lucide="clock"></i> ${t.actionType}
            </div>
            <div class="audit-details">
              <strong>${t.componentName}</strong>
              <p class="audit-notes">${t.notes}</p>
              <span class="audit-meta">${t.userRole} &bull; ${t.timestamp}</span>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    if (window.lucide) window.lucide.createIcons();
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeAuditModal() {
    const backdrop = document.getElementById("audit-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  // --- PARTIAL RETURN MODAL HANDLER ---
  static openStudentRequestsModal() {
    const backdrop = document.getElementById("student-req-modal");
    const container = document.getElementById("student-requests-container");
    const requests = StorageService.getRequests();

    if (container) {
      container.innerHTML = "";
      requests.forEach(r => {
        const card = document.createElement("div");
        card.className = "request-card";

        let statusBadgeClass = "warning";
        if (r.status === "APPROVED") statusBadgeClass = "success";
        else if (r.status === "REJECTED") statusBadgeClass = "danger";
        else if (r.status === "RETURNED") statusBadgeClass = "info";
        else if (r.status === "PARTIAL_RETURN") statusBadgeClass = "warning";

        const remainingQty = r.qtyRequested - (r.returnedQty || 0);

        card.innerHTML = `
          <div class="request-header">
            <strong>${r.componentName}</strong>
            <span class="stock-tag ${statusBadgeClass}">${r.status}</span>
          </div>
          <p class="request-meta">Qty Requested: <strong>${r.qtyRequested} pcs</strong> &bull; Returned: <strong>${r.returnedQty || 0} pcs</strong> &bull; Remaining: <strong class="primary-text">${remainingQty} pcs</strong></p>
          <p class="request-meta">Student: ${r.requesterName} &bull; Date: ${r.requestedAt} ${r.dueDate ? `&bull; Due: ${r.dueDate}` : ''}</p>
          <p class="request-notes">${r.notes}</p>
          ${(r.status === 'APPROVED' || r.status === 'PARTIAL_RETURN') ? `
            <div style="margin-top:8px; display:flex; gap:8px; align-items:center;">
              <button class="btn btn-secondary btn-sm btn-partial-return-item" data-req-id="${r.id}">
                <i data-lucide="rotate-ccw"></i> Return Item (Full or Partial)
              </button>
            </div>
          ` : ''}
        `;

        const returnBtn = card.querySelector(".btn-partial-return-item");
        if (returnBtn) {
          returnBtn.addEventListener("click", () => {
            const retQtyStr = prompt(`Return '${r.componentName}':\nEnter quantity returning now (Remaining borrowed: ${remainingQty} pcs):`, `${remainingQty}`);
            if (!retQtyStr) return;
            const retQty = parseInt(retQtyStr);
            if (isNaN(retQty) || retQty <= 0) {
              alert("Please enter a valid positive number.");
              return;
            }

            const cond = prompt("Select Item Condition (GOOD / FAIR / DAMAGED):", "GOOD") || "GOOD";
            try {
              StorageService.handlePartialReturn(r.id, retQty, cond.toUpperCase());
              alert(`Successfully logged return of ${retQty} pcs (${cond.toUpperCase()} condition)!`);
              this.openStudentRequestsModal();
              if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
            } catch (err) {
              alert(err.message);
            }
          });
        }

        container.appendChild(card);
      });
    }

    if (window.lucide) window.lucide.createIcons();
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeStudentRequestsModal() {
    const backdrop = document.getElementById("student-req-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static openAdminApprovalModal() {
    const backdrop = document.getElementById("admin-appr-modal");
    const container = document.getElementById("admin-approval-container");
    const requests = StorageService.getRequests().filter(r => r.status === "PENDING");

    if (container) {
      container.innerHTML = "";
      if (requests.length === 0) {
        container.innerHTML = `<p class="empty-hint">🎉 No pending checkout requests! All student requests are cleared.</p>`;
      } else {
        requests.forEach(r => {
          const card = document.createElement("div");
          card.className = "approval-card";
          card.innerHTML = `
            <div class="approval-header">
              <strong>${r.componentName}</strong>
              <span class="mono">Qty: ${r.qtyRequested} pcs</span>
            </div>
            <p class="approval-meta">Requester: <strong>${r.requesterName}</strong> (${r.role}) &bull; Date: ${r.requestedAt}</p>
            <p class="approval-notes">${r.notes}</p>
            <div class="approval-actions">
              <button class="btn btn-primary btn-approve" data-id="${r.id}"><i data-lucide="check"></i> Approve Checkout</button>
              <button class="btn btn-danger btn-reject" data-id="${r.id}"><i data-lucide="x"></i> Reject</button>
            </div>
          `;

          card.querySelector(".btn-approve").addEventListener("click", () => {
            try {
              StorageService.approveRequest(r.id);
              alert(`Approved checkout request #${r.id} for ${r.requesterName}!`);
              this.openAdminApprovalModal();
              if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
            } catch (err) {
              alert(err.message);
            }
          });

          card.querySelector(".btn-reject").addEventListener("click", () => {
            const reason = prompt("Enter reason for rejection:", "Item reserved for active lab project");
            StorageService.rejectRequest(r.id, reason || "");
            this.openAdminApprovalModal();
            if (this.callbacks.onInventoryChanged) this.callbacks.onInventoryChanged();
          });

          container.appendChild(card);
        });
      }
    }

    if (window.lucide) window.lucide.createIcons();
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeAdminApprovalModal() {
    const backdrop = document.getElementById("admin-appr-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static openBomModal() {
    const backdrop = document.getElementById("bom-modal");
    document.getElementById("bom-results-container").classList.add("hidden");
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeBomModal() {
    const backdrop = document.getElementById("bom-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static handleParseBOM() {
    const text = document.getElementById("bom-csv-text").value.trim();
    if (!text) {
      alert("Please paste a CSV BOM list or upload a file.");
      return;
    }

    const results = StorageService.parseAndMatchBOM(text);
    const container = document.getElementById("bom-results-container");
    const tbody = document.getElementById("bom-table-body");

    tbody.innerHTML = "";
    results.forEach(res => {
      const tr = document.createElement("tr");
      let statusTag = `<span class="stock-tag IN_STOCK">✅ Available in Lab (${res.availableQty} pcs)</span>`;
      if (res.status === "MATCH_SHORTAGE") {
        statusTag = `<span class="stock-tag LOW_STOCK">⚠️ Stock Shortage (Have ${res.availableQty}, Need ${res.qtyRequired})</span>`;
      } else if (res.status === "OUT_OF_STOCK") {
        statusTag = `<span class="stock-tag OUT_OF_STOCK">❌ Out of Stock (0 pcs in lab)</span>`;
      } else if (res.status === "NOT_IN_LAB") {
        statusTag = `<span class="stock-tag OUT_OF_STOCK">🔍 Not Found in Lab Catalog</span>`;
      }

      tr.innerHTML = `
        <td><strong>${res.bomPartName}</strong></td>
        <td>${res.qtyRequired}</td>
        <td>${res.matchedCompName}</td>
        <td class="mono">${res.matchedBoxId}</td>
        <td>${statusTag}</td>
      `;
      tbody.appendChild(tr);
    });

    container.classList.remove("hidden");
  }

  static openManagementModal() {
    const backdrop = document.getElementById("management-modal");
    const report = StorageService.getManagementReport();

    document.getElementById("mgmt-total-value").innerText = report.totalAssetValueFormatted;
    document.getElementById("mgmt-total-units").innerText = report.totalPhysicalUnits;
    document.getElementById("mgmt-issued-count").innerText = report.activeIssuedCount;
    document.getElementById("mgmt-active-projects").innerText = report.activeProjectsCount;

    const tbody = document.getElementById("mgmt-category-table-body");
    if (tbody) {
      tbody.innerHTML = "";
      Object.keys(report.categoryValuation).forEach(cat => {
        const item = report.categoryValuation[cat];
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${cat}</strong></td>
          <td>${item.count} component types</td>
          <td class="mono">${item.totalQty} units</td>
          <td class="mono"><strong>₹${item.value.toLocaleString('en-IN')}</strong></td>
        `;
        tbody.appendChild(tr);
      });
    }

    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeManagementModal() {
    const backdrop = document.getElementById("management-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static openBoxModal() {
    this.renderBoxList();
    const backdrop = document.getElementById("box-manager-modal");
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeBoxModal() {
    const backdrop = document.getElementById("box-manager-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static handleMoveComponentToBox() {
    if (!this.currentComponent) return;

    if (StorageService.isRole("STUDENT")) {
      alert("Students/Interns have View & Request permissions. Switch role to Admin to transfer components.");
      return;
    }

    const comp = this.currentComponent;
    const boxes = StorageService.getBoxes();
    const availableBoxes = boxes.map(b => b.id).join(", ");

    const targetBoxId = prompt(
      `Transfer '${comp.name}' from ${comp.boxId} to another physical box:\n\nEnter Target Box ID (e.g. BOX A-005, BOX B-002):\n\nAvailable Active Boxes:\n${availableBoxes}`,
      comp.boxId
    );

    if (!targetBoxId) return;
    const cleanBoxId = targetBoxId.trim().toUpperCase();

    if (cleanBoxId === comp.boxId) {
      alert("Component is already stored in this box.");
      return;
    }

    const components = StorageService.getComponents();
    const existingInTarget = components.filter(c => c.boxId === cleanBoxId);

    if (existingInTarget.length > 0) {
      const targetNames = existingInTarget.map(c => c.name).join(", ");
      const confirmSwap = confirm(
        `Target box '${cleanBoxId}' currently contains: [${targetNames}].\n\nMoving '${comp.name}' to ${cleanBoxId} will MUTUALLY SWAP the components and location IDs between ${comp.boxId} and ${cleanBoxId}.\n\nDo you want to proceed with the mutual swap?`
      );
      if (!confirmSwap) return;
    }

    try {
      const updated = StorageService.moveComponentToBox(comp.id, cleanBoxId);
      alert(`Success! Mutually swapped contents and location IDs between ${comp.boxId} and ${cleanBoxId}. '${comp.name}' is now in ${cleanBoxId}.`);
      this.currentComponent = updated;
      this.renderInspectorData(updated);

      if (this.callbacks.onInventoryChanged) {
        this.callbacks.onInventoryChanged();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  static handleSwapBoxContents(sourceBoxId) {
    StorageService.setRole("ADMIN");

    const boxes = StorageService.getBoxes();
    const availableBoxes = boxes.filter(b => b.id !== sourceBoxId).map(b => b.id).join(", ");

    const targetBoxId = prompt(
      `Swap All Contents of '${sourceBoxId}':\n\nEnter Target Box ID to swap contents with (e.g. BOX A-002, BOX B-001):\n\nAvailable Boxes:\n${availableBoxes}`,
      ""
    );

    if (!targetBoxId) return;
    const cleanTarget = targetBoxId.trim().toUpperCase();

    if (cleanTarget === sourceBoxId) {
      alert("Target box must be different from source box.");
      return;
    }

    try {
      StorageService.swapBoxContents(sourceBoxId, cleanTarget);
      alert(`Success! All contents between ${sourceBoxId} and ${cleanTarget} have been swapped!`);
      this.renderBoxList();

      if (this.callbacks.onInventoryChanged) {
        this.callbacks.onInventoryChanged();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  static handleRenameOrRelocateBox(oldBoxId) {
    StorageService.setRole("ADMIN");

    const cleanOldId = oldBoxId.trim().toUpperCase();
    const box = StorageService.ensureBoxExists(cleanOldId);

    const newBoxIdInput = prompt(`Rename / Relocate Physical Box '${cleanOldId}':\n\nEnter New Box ID:`, cleanOldId);
    if (!newBoxIdInput) return;

    const rackStr = prompt(`Select Target Rack (1 or 2):`, box.rackId || 1);
    if (!rackStr) return;
    const newRackId = parseInt(rackStr);

    const shelfStr = prompt(`Select Target Shelf Number (1=Shelf A, 2=Shelf B, 3=Shelf C, 4=Shelf D, 5=Shelf E, 6=Shelf F):`, box.shelfId || 1);
    if (!shelfStr) return;
    const newShelfId = parseInt(shelfStr);

    try {
      StorageService.renameOrMoveBox(cleanOldId, newBoxIdInput, newRackId, newShelfId);
      alert(`Success! Physical box updated to '${newBoxIdInput.trim().toUpperCase()}' (Rack ${newRackId}, Shelf ${String.fromCharCode(64 + newShelfId)}). All stored component IDs and location paths updated!`);
      this.renderBoxList();

      if (this.callbacks.onInventoryChanged) {
        this.callbacks.onInventoryChanged();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  static renderBoxList() {
    const boxes = StorageService.getBoxes();
    const components = StorageService.getComponents();
    const container = document.getElementById("box-list-container");
    if (!container) return;

    container.innerHTML = "";
    boxes.forEach(box => {
      const boxComponents = components.filter(c => c.boxId === box.id);
      const card = document.createElement("div");
      card.className = "box-manage-card";
      card.style.cssText = "display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:var(--bg-dark); border-radius:10px; border:1px solid var(--border-color); margin-bottom:10px; cursor:pointer;";

      let compPreviewsHtml = "";
      if (boxComponents.length > 0) {
        compPreviewsHtml = boxComponents.map((c, idx) => `
          <div style="display:flex; align-items:center; gap:8px; background:var(--bg-card); padding:4px 8px; border-radius:6px; border:1px solid var(--border-color); margin-top:4px;">
            <img src="${ComponentsView.getAccurateImageForComponent ? ComponentsView.getAccurateImageForComponent(c.name, c.category, c.imageUrl) : c.imageUrl}" alt="${c.name}" referrerpolicy="no-referrer" loading="lazy" style="width:36px; height:36px; object-fit:cover; border-radius:6px; border:1px solid var(--border-color); background:#0f172a;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80';" />
            <div>
              <div style="font-size:0.8rem; font-weight:700; color:var(--text-main);">${c.name}</div>
              <div style="font-size:0.7rem; color:var(--text-muted);">PN: ${c.partNumber || 'N/A'} &bull; ${c.manufacturer || 'N/A'}</div>
            </div>
            <span style="font-size:0.75rem; font-weight:700; color:var(--primary); font-family:var(--font-mono); margin-left:auto; background:rgba(56,189,248,0.1); padding:2px 6px; border-radius:4px;">${c.quantity} ${c.unit || 'pcs'}</span>
          </div>
        `).join('');
      } else {
        compPreviewsHtml = `<span class="text-muted" style="font-size:0.75rem; font-style:italic;">Empty Box</span>`;
      }

      card.innerHTML = `
        <div class="box-info" style="flex:1; margin-right:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="box-badge mono" style="font-weight:800; color:var(--primary); font-size:0.95rem;">📦 ${box.id}</span>
            <span class="box-path text-muted" style="font-size:0.8rem;">📍 Rack ${box.rackId} &rsaquo; Shelf ${String.fromCharCode(64 + Number(box.shelfId))}</span>
            <span class="badge" style="background:var(--primary); color:#0f172a; font-weight:700; font-size:0.7rem; margin-left:auto;">${boxComponents.length} Stored Component${boxComponents.length === 1 ? '' : 's'}</span>
          </div>
          <div style="margin-top:6px; display:flex; flex-direction:column; gap:4px;">
            ${compPreviewsHtml}
          </div>
        </div>

        <div class="box-count-info" style="display:flex; flex-direction:column; gap:6px;">
          <button class="btn btn-primary btn-sm btn-inspect-box" title="Inspect all components inside this box side-by-side">
            <i data-lucide="eye"></i> Inspect Box (${boxComponents.length})
          </button>
          <button class="btn btn-secondary btn-sm btn-print-box-qr" title="Print QR Code Sticker for this Box">
            <i data-lucide="printer"></i> Print Box QR
          </button>
          <button class="btn btn-secondary btn-sm btn-edit-box-id" title="Rename or change Rack/Shelf location for this box">
            <i data-lucide="edit-2"></i> Rename/Move
          </button>
          <button class="btn btn-secondary btn-sm btn-swap-box" title="Swap box contents with another box">
            <i data-lucide="arrow-left-right"></i> Swap Box
          </button>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        this.closeBoxModal();
        this.openBoxInspectorModal(box.id, boxComponents);
      });

      card.querySelector(".btn-inspect-box").addEventListener("click", () => {
        this.closeBoxModal();
        this.openBoxInspectorModal(box.id, boxComponents);
      });

      card.querySelector(".btn-print-box-qr").addEventListener("click", () => {
        let hostOrigin = window.location.origin;
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
          hostOrigin = `http://192.168.82.40:${window.location.port || 3000}`;
        }
        const qrTargetUrl = `${hostOrigin}${window.location.pathname}?box=${encodeURIComponent(box.id)}`;
        this.printBoxQrCode(box.id, encodeURIComponent(qrTargetUrl));
      });

      card.querySelector(".btn-edit-box-id").addEventListener("click", () => {
        this.handleRenameOrRelocateBox(box.id);
      });

      card.querySelector(".btn-swap-box").addEventListener("click", () => {
        this.handleSwapBoxContents(box.id);
      });

      container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  static handleCreateBox() {
    const boxId = document.getElementById("new-box-name").value.trim().toUpperCase();
    const rackId = Number(document.getElementById("new-box-rack").value);
    const shelfId = Number(document.getElementById("new-box-shelf").value);

    if (!boxId) {
      alert("Please enter a Box ID (e.g. BOX A-016)");
      return;
    }

    const boxes = StorageService.getBoxes();
    if (boxes.some(b => b.id === boxId)) {
      alert(`Box ID '${boxId}' already exists!`);
      return;
    }

    boxes.push({
      id: boxId,
      rackId,
      shelfId,
      label: `${boxId}: New Custom Box`
    });

    StorageService.saveBoxes(boxes);
    document.getElementById("new-box-name").value = "";
    this.renderBoxList();

    if (this.callbacks.onInventoryChanged) {
      this.callbacks.onInventoryChanged();
    }
  }

  static openBoxInspectorModal(boxIdInput, passedComponents = null) {
    let backdrop = document.getElementById("box-inspector-modal");
    if (!backdrop) return;

    if (backdrop.parentNode !== document.body) {
      document.body.appendChild(backdrop);
    }
    backdrop.classList.remove("hidden");
    backdrop.style.cssText = "display:flex !important; position:fixed !important; inset:0 !important; width:100vw !important; height:100vh !important; z-index:9999999 !important; background:rgba(15,23,42,0.92) !important; backdrop-filter:blur(8px) !important; align-items:center !important; justify-content:center !important; visibility:visible !important; opacity:1 !important;";

    backdrop.onclick = (e) => {
      if (e.target === backdrop) {
        ModalManager.closeBoxInspectorModal();
      }
    };

    if (!boxIdInput) {
      console.warn("openBoxInspectorModal called with empty boxIdInput");
      return;
    }

    const cleanBoxId = (boxIdInput || "").trim().toUpperCase();
    const allComponents = StorageService.getComponents();
    const allBoxes = StorageService.getBoxes();

    const components = allComponents.filter(c => (c.boxId || "").trim().toUpperCase() === cleanBoxId);
    const box = allBoxes.find(b => (b.id || "").trim().toUpperCase() === cleanBoxId);

    const titleEl = document.getElementById("box-insp-modal-title");
    const pathEl = document.getElementById("box-insp-location-path");
    const cardsContainer = document.getElementById("box-insp-cards-container");

    const rackId = box ? box.rackId : (components[0] ? components[0].rackId : 1);
    const shelfId = box ? box.shelfId : (components[0] ? components[0].shelfId : 1);
    const shelfChar = String.fromCharCode(64 + Number(shelfId));

    let hostOrigin = window.location.origin;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      hostOrigin = `http://192.168.82.40:${window.location.port || 3000}`;
    }

    const mainCompId = components[0] ? components[0].id : cleanBoxId;
    const qrTargetUrl = `${hostOrigin}${window.location.pathname}?comp=${encodeURIComponent(mainCompId)}&box=${encodeURIComponent(cleanBoxId)}`;
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrTargetUrl)}`;

    if (titleEl) titleEl.innerHTML = `📦 Physical Storage Footprint: <span class="mono" style="color:var(--primary); font-weight:800;">${cleanBoxId}</span>`;

    if (pathEl) {
      pathEl.innerHTML = `
        <div style="background:var(--bg-dark); padding:14px; border-radius:10px; border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-size:0.95rem; font-weight:700; color:var(--primary);">
              📍 Rack ${rackId} &rsaquo; Shelf ${shelfChar} (Shelf ${shelfId}) &rsaquo; Box ${cleanBoxId}
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
              Main Robotics & Embedded Systems Lab &bull; Room 101 &bull; ${components.length} Item(s) Stored
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:12px; background:var(--bg-card); padding:8px 12px; border-radius:8px; border:1px solid var(--border-color);">
            <img src="${qrImgUrl}" alt="${cleanBoxId} QR Code" style="width:54px; height:54px; border-radius:4px; background:#fff; padding:2px;" />
            <div>
              <div style="font-size:0.75rem; font-weight:700; color:var(--success);">📱 Scan with Phone Camera</div>
              <button class="btn btn-secondary btn-sm" onclick="ModalManager.printBoxQrCode('${cleanBoxId}', '${encodeURIComponent(qrTargetUrl)}')" style="margin-top:4px; font-size:0.7rem; padding:2px 8px;">
                <i data-lucide="printer"></i> Print QR Label
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (cardsContainer) {
      cardsContainer.innerHTML = "";
      cardsContainer.style.cssText = "display:flex; flex-direction:column; gap:16px; width:100%; max-width:680px; margin:0 auto;";

      if (components.length === 0) {
        cardsContainer.innerHTML = `<p class="empty-hint" style="grid-column: 1 / -1;">📦 Box ${boxId} is currently empty.</p>`;
      } else {
        components.forEach((c, index) => {
          const card = document.createElement("div");
          card.className = "component-card";
          card.style.cssText = "background:var(--bg-card); border:2px solid var(--border-color); border-radius:14px; padding:18px; display:flex; flex-direction:column; gap:12px; width:100%; box-sizing:border-box; box-shadow:0 4px 12px rgba(0,0,0,0.15);";

          const compImg = ComponentsView.getAccurateImageForComponent ? ComponentsView.getAccurateImageForComponent(c) : (c.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80');

          let stockBadge = `<span class="stock-tag IN_STOCK">IN STOCK</span>`;
          if (c.quantity === 0) stockBadge = `<span class="stock-tag OUT_OF_STOCK">OUT OF STOCK</span>`;
          else if (c.quantity <= c.minQuantity) stockBadge = `<span class="stock-tag LOW_STOCK">LOW STOCK</span>`;

          const unitPrice = c.unitPrice || 450;

          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:4px;">
              <span style="font-size:0.75rem; font-weight:800; color:var(--primary); background:rgba(56,189,248,0.12); padding:2px 8px; border-radius:6px;">COMPONENT #${index + 1} OF ${components.length}</span>
              ${stockBadge}
            </div>

            <div style="display:flex; gap:14px; align-items:flex-start; flex-wrap:wrap;">
              <div style="position:relative; width:120px; height:120px; border-radius:10px; overflow:hidden; background:#0f172a; flex-shrink:0;">
                <img src="${compImg}" alt="${c.name}" referrerpolicy="no-referrer" loading="lazy" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80';" />
              </div>

              <div style="flex:1; min-width:200px;">
                <div style="font-size:1.15rem; font-weight:800; color:var(--text-main); line-height:1.3; margin-bottom:4px;">${c.name}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">PN: <span class="mono" style="color:var(--primary); font-weight:700;">${c.partNumber || 'N/A'}</span> &bull; 🏭 ${c.manufacturer || 'Lab Vendor'} &bull; 🏷️ ${c.category}</div>
                <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">
                  <strong>Purpose:</strong> ${c.purpose || 'Standard electronic component stored inside ' + boxId}
                </div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; background:var(--bg-dark); padding:10px 14px; border-radius:10px; border:1px solid var(--border-color);">
              <div>
                <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Quantity Available</div>
                <div style="font-size:1.15rem; font-weight:800; color:var(--primary); font-family:var(--font-mono);">${c.quantity} <span style="font-size:0.8rem; font-weight:600;">${c.unit || 'pcs'}</span></div>
              </div>
              <div>
                <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Unit Rate / Price</div>
                <div style="font-size:1.15rem; font-weight:800; color:var(--success); font-family:var(--font-mono);">₹${unitPrice.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
              <strong>Purpose:</strong> ${c.purpose || 'Standard electronic component.'}
            </div>

            <div style="margin-top:auto; display:grid; grid-template-columns:1fr 1fr; gap:6px; padding-top:8px; border-top:1px solid var(--border-color);">
              <button class="btn btn-primary btn-sm btn-edit-comp-item" onclick="event.stopPropagation(); if (window.closeBoxInspectorModal) window.closeBoxInspectorModal(); window.openComponentEditDialog('${c.id}');" style="font-weight:700;" title="Edit Name, Quantity, Price, Location">
                ✏️ Edit Details
              </button>
              <button class="btn btn-secondary btn-sm btn-move-comp-item" onclick="event.stopPropagation(); if (window.openMoveBoxDialog) window.openMoveBoxDialog('${c.id}');" title="Move this component to another box">
                📦 Move Item
              </button>
              <button class="btn btn-secondary btn-sm btn-inspect-comp-item" title="View Full Technical Passport">
                👁️ Passport Info
              </button>
              <button class="btn btn-secondary btn-sm btn-delete-comp-item" style="border-color:var(--danger); color:var(--danger);" title="Delete this component entry permanently">
                🗑️ Delete
              </button>
            </div>
          `;

          card.querySelector(".btn-edit-comp-item").addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            ModalManager.closeBoxInspectorModal();
            if (window.openComponentEditDialog) {
              window.openComponentEditDialog(c.id);
            }
          });

          card.querySelector(".btn-move-comp-item").addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.openMoveBoxDialog) {
              window.openMoveBoxDialog(c.id);
            }
          });

          card.querySelector(".btn-inspect-comp-item").addEventListener("click", () => {
            ModalManager.closeBoxInspectorModal();
            ModalManager.openComponentInspector(c);
          });

          card.querySelector(".btn-delete-comp-item").addEventListener("click", () => {
            if (confirm(`Are you sure you want to permanently delete '${c.name}' (${c.boxId}) from inventory?`)) {
              StorageService.setRole("ADMIN");
              StorageService.deleteComponent(c.id);
              const msg = `🗑️ Successfully deleted '${c.name}'!`;
              alert(msg);
              ModalManager.showToast(msg, "success");
              ModalManager.closeBoxInspectorModal();
              if (ModalManager.callbacks.onInventoryChanged) ModalManager.callbacks.onInventoryChanged();
            }
          });

          cardsContainer.appendChild(card);
        });
      }
    }

    if (window.lucide) window.lucide.createIcons();
    backdrop.classList.remove("hidden");
  }

  static closeBoxInspectorModal() {
    document.body.classList.remove("qr-scan-mode");
    const backdrop = document.getElementById("box-inspector-modal");
    if (backdrop) {
      backdrop.classList.add("hidden");
      backdrop.style.cssText = "display:none !important; visibility:hidden !important; opacity:0 !important; z-index:-1 !important;";
    }
  }

  static printBoxQrCode(boxIdInput, encodedQrUrl) {
    const cleanBoxId = (boxIdInput || "").trim().toUpperCase();
    let hostOrigin = window.location.origin;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      hostOrigin = `http://192.168.82.40:${window.location.port || 3000}`;
    }
    const components = StorageService.getComponents().filter(c => (c.boxId || "").trim().toUpperCase() === cleanBoxId);
    const box = StorageService.getBoxes().find(b => (b.id || "").trim().toUpperCase() === cleanBoxId);
    const mainCompId = components[0] ? components[0].id : cleanBoxId;

    const targetUrl = encodedQrUrl ? decodeURIComponent(encodedQrUrl) : `${hostOrigin}${window.location.pathname}?comp=${encodeURIComponent(mainCompId)}&box=${encodeURIComponent(cleanBoxId)}`;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl)}`;
    const rackId = box ? box.rackId : (components[0] ? components[0].rackId : 1);
    const shelfId = box ? box.shelfId : (components[0] ? components[0].shelfId : 1);
    const shelfChar = String.fromCharCode(64 + Number(shelfId));

    let compNamesHtml = components.map(c => `<div class="comp-title-line">&bull; ${c.name}</div>`).join("");
    if (!compNamesHtml) compNamesHtml = `<div class="comp-title-line">Box ${cleanBoxId}</div>`;

    const printWin = window.open("", "_blank", "width=450,height=570");
    printWin.document.write(`
      <html>
        <head>
          <title>Print Box Sticker - ${cleanBoxId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 20px; color: #0f172a; background: #fff; }
            .label-box { border: 3px solid #0f172a; border-radius: 16px; padding: 20px; display: inline-block; width: 100%; max-width: 320px; box-sizing: border-box; background: #fff; }
            .comp-name-container { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; text-align: center; }
            .comp-title-line { font-size: 16px; font-weight: 800; color: #0f172a; line-height: 1.2; word-break: break-word; }
            .box-tag { font-size: 13px; font-weight: 700; font-family: monospace; color: #0284c7; margin-bottom: 12px; }
            img { width: 220px; height: 220px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px; background: #fff; }
          </style>
        </head>
        <body>
          <div class="label-box">
            <div class="comp-name-container">
              ${compNamesHtml}
            </div>
            <div class="box-tag">📦 ${cleanBoxId} &bull; Rack ${rackId} Shelf ${shelfChar}</div>
            <img src="${qrImg}" alt="Box ${cleanBoxId} QR Code" />
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  }

  static printComponentQrCode(componentId) {
    const components = StorageService.getComponents();
    const c = components.find(item => item.id === componentId);
    if (!c) return;

    let hostOrigin = window.location.origin;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      hostOrigin = `http://192.168.82.40:${window.location.port || 3000}`;
    }

    const qrTargetUrl = `${hostOrigin}${window.location.pathname}?comp=${encodeURIComponent(c.id)}`;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrTargetUrl)}`;

    const shelfChar = String.fromCharCode(64 + Number(c.shelfId || 1));

    const printWin = window.open("", "_blank", "width=450,height=570");
    printWin.document.write(`
      <html>
        <head>
          <title>Print Label - ${c.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 20px; color: #0f172a; background: #fff; }
            .label-box { border: 3px solid #0f172a; border-radius: 16px; padding: 20px; display: inline-block; width: 100%; max-width: 320px; box-sizing: border-box; background: #fff; }
            .comp-name { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 6px; line-height: 1.2; }
            .box-tag { font-size: 13px; font-weight: 700; font-family: monospace; color: #0284c7; margin-bottom: 12px; }
            img { width: 220px; height: 220px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px; background: #fff; }
          </style>
        </head>
        <body>
          <div class="label-box">
            <div class="comp-name">${c.name}</div>
            <div class="box-tag">📦 ${c.boxId} &bull; Rack ${c.rackId} Shelf ${shelfChar}</div>
            <img src="${qrImg}" alt="QR Code" />
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  }

  static printBatchBoxQrSheet() {
    const boxes = StorageService.getBoxes();
    const components = StorageService.getComponents();

    const activeBoxes = boxes.filter(box => {
      const cleanBoxId = (box.id || "").trim().toUpperCase();
      return components.some(c => (c.boxId || "").trim().toUpperCase() === cleanBoxId);
    });

    if (activeBoxes.length === 0) {
      alert("No occupied physical boxes containing components are available to print.");
      return;
    }

    let hostOrigin = window.location.origin;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      hostOrigin = `http://192.168.82.40:${window.location.port || 3000}`;
    }

    let pagesHtml = "";
    const LABELS_PER_PAGE = 16;
    const totalPages = Math.ceil(activeBoxes.length / LABELS_PER_PAGE);

    for (let p = 0; p < totalPages; p++) {
      const pageBoxes = activeBoxes.slice(p * LABELS_PER_PAGE, (p + 1) * LABELS_PER_PAGE);

      let cardsHtml = pageBoxes.map(box => {
        const cleanBoxId = (box.id || "").trim().toUpperCase();
        const boxComps = components.filter(c => (c.boxId || "").trim().toUpperCase() === cleanBoxId);
        let compLinesHtml = boxComps.map(c => `<div class="comp-line">&bull; ${c.name}</div>`).join("");
        if (!compLinesHtml) compLinesHtml = `<div class="comp-line">Empty Box (${cleanBoxId})</div>`;

        const qrTargetUrl = `${hostOrigin}${window.location.pathname}?box=${encodeURIComponent(cleanBoxId)}`;
        const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrTargetUrl)}`;

        return `
          <div class="sticker-card">
            <div class="comp-name-container">
              ${compLinesHtml}
            </div>
            <div class="box-id-badge">📦 ${cleanBoxId}</div>
            <img src="${qrImgUrl}" alt="${cleanBoxId} Box QR Code" />
          </div>
        `;
      }).join("");

      pagesHtml += `
        <div class="print-page">
          <div class="grid-container">
            ${cardsHtml}
          </div>
        </div>
      `;
    }

    const printWin = window.open("", "_blank", "width=900,height=1000");
    printWin.document.write(`
      <html>
        <head>
          <title>Batch Print All Box QR Labels (16 per page)</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #0f172a;
              -webkit-print-color-adjust: exact;
            }
            .header-banner {
              text-align: center;
              font-size: 16px;
              font-weight: 800;
              color: #0284c7;
              margin-bottom: 12px;
              padding-bottom: 6px;
              border-bottom: 2px solid #0f172a;
            }
            .print-page {
              page-break-after: always;
              box-sizing: border-box;
              margin-bottom: 20px;
            }
            .grid-container {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              grid-template-rows: repeat(4, 1fr);
              gap: 6mm;
              width: 100%;
              box-sizing: border-box;
            }
            .sticker-card {
              border: 2px dashed #0f172a;
              border-radius: 8px;
              padding: 6px 4px;
              text-align: center;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              height: 58mm;
              background: #fff;
            }
            .comp-name-container {
              display: flex;
              flex-direction: column;
              gap: 2px;
              width: 100%;
              max-height: 28px;
              overflow: hidden;
            }
            .comp-line {
              font-size: 10px;
              font-weight: 800;
              color: #0f172a;
              line-height: 1.1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .box-id-badge {
              font-size: 10px;
              font-weight: 800;
              font-family: monospace;
              color: #0284c7;
              margin: 2px 0;
            }
            img {
              width: 34mm;
              height: 34mm;
              border: 1px solid #cbd5e1;
              border-radius: 4px;
              padding: 2px;
              background: #fff;
            }
          </style>
        </head>
        <body>
          <div class="header-banner">🏢 PRINTING ALL BOX STICKERS (${activeBoxes.length} OCCUPIED BOXES)</div>
          ${pagesHtml}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  }

  static printBatchShelfComponentQrSheet(rackIdInput, shelfIdInput) {
    const targetRack = parseInt(rackIdInput) || 1;
    const targetShelf = this.parseShelfId(shelfIdInput);
    const shelfChar = String.fromCharCode(64 + targetShelf);

    const allComponents = StorageService.getComponents();
    const boxes = StorageService.getBoxes();

    const shelfBoxesMap = new Map();
    boxes.filter(b => (parseInt(b.rackId) || 1) === targetRack && this.parseShelfId(b.shelfId) === targetShelf).forEach(b => {
      shelfBoxesMap.set((b.id || "").trim().toUpperCase(), b);
    });

    allComponents.filter(c => (parseInt(c.rackId) || 1) === targetRack && this.parseShelfId(c.shelfId) === targetShelf).forEach(c => {
      const cleanBoxId = (c.boxId || "").trim().toUpperCase();
      if (!shelfBoxesMap.has(cleanBoxId)) {
        shelfBoxesMap.set(cleanBoxId, { id: cleanBoxId, rackId: targetRack, shelfId: targetShelf });
      }
    });

    const shelfBoxes = Array.from(shelfBoxesMap.values());

    const activeShelfBoxes = shelfBoxes.filter(box => {
      const cleanBoxId = (box.id || "").trim().toUpperCase();
      return allComponents.some(c => (c.boxId || "").trim().toUpperCase() === cleanBoxId);
    });

    if (activeShelfBoxes.length === 0) {
      alert(`No occupied physical boxes containing components found on Rack ${targetRack}, Shelf ${shelfChar}.`);
      return;
    }

    let hostOrigin = window.location.origin;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      hostOrigin = `http://192.168.82.40:${window.location.port || 3000}`;
    }

    let pagesHtml = "";
    const LABELS_PER_PAGE = 16;
    const totalPages = Math.ceil(activeShelfBoxes.length / LABELS_PER_PAGE);

    for (let p = 0; p < totalPages; p++) {
      const pageBoxes = activeShelfBoxes.slice(p * LABELS_PER_PAGE, (p + 1) * LABELS_PER_PAGE);

      let cardsHtml = pageBoxes.map(box => {
        const cleanBoxId = (box.id || "").trim().toUpperCase();
        const boxComps = allComponents.filter(c => (c.boxId || "").trim().toUpperCase() === cleanBoxId);
        let compLinesHtml = boxComps.map(c => `<div class="comp-line">&bull; ${c.name}</div>`).join("");
        if (!compLinesHtml) compLinesHtml = `<div class="comp-line">Empty Box (${cleanBoxId})</div>`;

        const qrTargetUrl = `${hostOrigin}${window.location.pathname}?box=${encodeURIComponent(cleanBoxId)}`;
        const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrTargetUrl)}`;

        return `
          <div class="sticker-card">
            <div class="comp-name-container">
              ${compLinesHtml}
            </div>
            <div class="box-id-badge">📦 ${cleanBoxId} &bull; R${targetRack}S${shelfChar}</div>
            <img src="${qrImgUrl}" alt="${cleanBoxId} Box QR Code" />
          </div>
        `;
      }).join("");

      pagesHtml += `
        <div class="print-page">
          <div class="grid-container">
            ${cardsHtml}
          </div>
        </div>
      `;
    }

    const printWin = window.open("", "_blank", "width=900,height=1000");
    printWin.document.write(`
      <html>
        <head>
          <title>Print Shelf Box QR Labels - Rack ${targetRack} Shelf ${shelfChar}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #0f172a;
              -webkit-print-color-adjust: exact;
            }
            .header-banner {
              text-align: center;
              font-size: 16px;
              font-weight: 800;
              color: #0284c7;
              margin-bottom: 12px;
              padding-bottom: 6px;
              border-bottom: 2px solid #0f172a;
            }
            .print-page {
              page-break-after: always;
              box-sizing: border-box;
              margin-bottom: 20px;
            }
            .grid-container {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              grid-template-rows: repeat(4, 1fr);
              gap: 6mm;
              width: 100%;
              box-sizing: border-box;
            }
            .sticker-card {
              border: 2px dashed #0f172a;
              border-radius: 8px;
              padding: 6px 4px;
              text-align: center;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              height: 58mm;
              background: #fff;
            }
            .comp-name-container {
              display: flex;
              flex-direction: column;
              gap: 2px;
              width: 100%;
              max-height: 28px;
              overflow: hidden;
            }
            .comp-line {
              font-size: 10px;
              font-weight: 800;
              color: #0f172a;
              line-height: 1.1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .box-id-badge {
              font-size: 10px;
              font-weight: 800;
              font-family: monospace;
              color: #0284c7;
              margin: 2px 0;
            }
            img {
              width: 34mm;
              height: 34mm;
              border: 1px solid #cbd5e1;
              border-radius: 4px;
              padding: 2px;
              background: #fff;
            }
          </style>
        </head>
        <body>
          <div class="header-banner">🏢 PRINTING SHELF BOX STICKERS: RACK ${targetRack} - SHELF ${shelfChar} (${activeShelfBoxes.length} BOXES)</div>
          ${pagesHtml}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  }

  static openShelfQrSelectorPrompt() {
    const shelfStr = prompt(
      "🏢 PRINT SHELF BOX QR STICKERS (16/Page):\n\n" +
      "Enter Target Shelf Letter or Number:\n" +
      "• Type 'A', 'B', 'C', 'D', 'E', or 'F'\n" +
      "• Type 'ALL' to print all boxes across all shelves\n\n" +
      "Target Shelf:",
      "A"
    );
    if (!shelfStr) return;

    const cleanInput = shelfStr.trim().toUpperCase();
    if (cleanInput === "ALL" || cleanInput === "ALL SHELVES" || cleanInput === "*") {
      this.printBatchBoxQrSheet();
    } else {
      const rackStr = prompt("Select Target Rack Number (1 or 2):", "2");
      if (!rackStr) return;
      this.printBatchShelfComponentQrSheet(rackStr, cleanInput);
    }
  }

  // --- COMPREHENSIVE PROJECT WORKSPACE DASHBOARD ---
  static openProjectModal() {
    const backdrop = document.getElementById("project-modal");
    const container = document.getElementById("project-list-container");
    const projects = StorageService.getProjects();

    if (container) {
      container.innerHTML = "";
      projects.forEach(p => {
        const card = document.createElement("div");
        card.className = "project-card";

        let membersHtml = (p.members || ["Team Member"]).map(m => `<span class="tag-item">👤 ${m}</span>`).join(" ");

        let bomHtml = (p.bom || []).map(b => `<li>• <strong>${b.name}</strong> (${b.qtyNeeded} needed)</li>`).join("");
        if (!bomHtml) bomHtml = `<li class="text-muted">No BOM items added.</li>`;

        let consumablesHtml = (p.consumables || []).map(c => `<li>⚡ ${c.name} (${c.qty}) - ₹${c.costRupees}</li>`).join("");

        let reusableHtml = (p.reusableAssets || []).map(r => `<li>🔧 ${r.name} (${r.qty} pcs) - ₹${r.costRupees}</li>`).join("");

        card.innerHTML = `
          <div class="project-header">
            <h3><i data-lucide="folder-kanban"></i> ${p.projectName}</h3>
            <span class="project-date">Created: ${p.createdAt}</span>
          </div>
          <p class="project-leader"><strong>Leader / Team:</strong> ${p.leaderName}</p>
          <p class="project-desc">${p.description}</p>

          <div style="margin-top:10px;">
            <h4 style="font-size:0.8rem; color:var(--primary);">👥 Team Members Workspace</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">${membersHtml}</div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
            <div class="project-items-box">
              <h4>📋 Project BOM List</h4>
              <ul>${bomHtml}</ul>
            </div>
            <div class="project-items-box">
              <h4>🧪 Consumables & Reusable Assets</h4>
              <ul style="font-size:0.75rem;">${consumablesHtml} ${reusableHtml}</ul>
            </div>
          </div>

          <div style="margin-top:10px; padding:8px 12px; background:var(--bg-dark); border-radius:6px; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <span>Estimated Project Cost Valuation:</span>
            <span class="primary-text font-bold" style="font-size:1.05rem;">₹${(p.estimatedCostRupees || 3500).toLocaleString('en-IN')}</span>
          </div>
        `;
        container.appendChild(card);
      });
    }

    if (window.lucide) window.lucide.createIcons();
    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeProjectModal() {
    const backdrop = document.getElementById("project-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static handleCreateProject() {
    const name = document.getElementById("new-proj-name").value.trim();
    const leader = document.getElementById("new-proj-leader").value.trim();
    const desc = document.getElementById("new-proj-desc").value.trim();

    if (!name || !leader) {
      alert("Please enter Project Name and Leader Name.");
      return;
    }

    StorageService.createProject(name, leader, desc);
    document.getElementById("new-proj-name").value = "";
    document.getElementById("new-proj-leader").value = "";
    document.getElementById("new-proj-desc").value = "";

    this.openProjectModal();
  }

  static openProcurementModal() {
    const backdrop = document.getElementById("procurement-modal");
    const report = StorageService.getProcurementReport();

    document.getElementById("procure-total-low").innerText = report.totalLowStockCount;
    document.getElementById("procure-total-out").innerText = report.totalOutCount;
    document.getElementById("procure-total-items").innerText = report.totalItemsNeeded;

    const tbody = document.getElementById("procurement-table-body");
    if (tbody) {
      tbody.innerHTML = "";
      report.itemsToProcure.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${item.name}</strong></td>
          <td class="mono">${item.partNumber}</td>
          <td class="mono">${item.boxId}</td>
          <td><span class="stock-tag ${item.status}">${item.status.replace("_", " ")} (${item.currentQty} ${item.unit})</span></td>
          <td>${item.minQuantity} ${item.unit}</td>
          <td><strong class="highlight-qty">+${item.suggestedReorder} ${item.unit}</strong></td>
        `;
        tbody.appendChild(tr);
      });
    }

    if (backdrop) backdrop.classList.remove("hidden");
  }

  static closeProcurementModal() {
    const backdrop = document.getElementById("procurement-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static exportProcurementCSV() {
    const report = StorageService.getProcurementReport();
    if (report.itemsToProcure.length === 0) {
      alert("No procurement restock needed at this time.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Component Name,Part Number,Box ID,Current Stock,Min Threshold,Suggested Reorder Qty,Unit\n";
    report.itemsToProcure.forEach(i => {
      csvContent += `"${i.name}","${i.partNumber}","${i.boxId}",${i.currentQty},${i.minQuantity},${i.suggestedReorder},"${i.unit}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `labsphere_procurement_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static openStorageSnapshotsModal() {
    const backdrop = document.getElementById("storage-snapshots-modal");
    const container = document.getElementById("snapshots-list-container");
    if (!backdrop || !container) return;

    const snapshots = StorageService.getAvailableLocalStorageSnapshots();
    container.innerHTML = "";

    if (snapshots.length === 0) {
      container.innerHTML = `<p class="empty-hint">No browser memory snapshots found in LocalStorage.</p>`;
    } else {
      snapshots.forEach(s => {
        const card = document.createElement("div");
        card.style.cssText = "background:var(--bg-dark); border:1px solid var(--border-color); border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; gap:12px;";

        card.innerHTML = `
          <div style="flex:1;">
            <div style="font-weight:700; color:var(--primary); font-size:0.85rem; font-family:var(--font-mono);">${s.key}</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${s.count} stored items &bull; Type: ${s.type}</div>
            <div style="font-size:0.7rem; color:var(--text-main); margin-top:4px; font-style:italic;">Sample: ${s.sample}</div>
          </div>
          <button class="btn btn-primary btn-sm btn-restore-this-snap" data-key="${s.key}">
            <i data-lucide="upload-cloud"></i> Restore Setup
          </button>
        `;

        card.querySelector(".btn-restore-this-snap").addEventListener("click", () => {
          try {
            StorageService.restoreSpecificSnapshot(s.key);
            alert(`🎉 Successfully restored snapshot '${s.key}' into active lab memory!`);
            this.closeStorageSnapshotsModal();
            window.location.reload();
          } catch (err) {
            alert(err.message);
          }
        });

        container.appendChild(card);
      });
    }

    if (window.lucide) window.lucide.createIcons();
    backdrop.classList.remove("hidden");
  }

  static closeStorageSnapshotsModal() {
    const backdrop = document.getElementById("storage-snapshots-modal");
    if (backdrop) backdrop.classList.add("hidden");
  }

  static openUndoTimelineModal() {
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.style.zIndex = "999999";

    const snapshots = [
      {
        step: 4,
        title: "Step 4: Current Live System (All 64 Items + QR Scanner & Printable Stickers)",
        desc: "Includes full custom backup (64 components, 65 boxes, 16 transaction logs), QR camera scanner, box inspector modal, and batch 16-per-page shelf sticker printing.",
        compCount: 64,
        boxCount: 65,
        action: () => {
          StorageService.restoreFullLabCatalog();
          window.location.href = window.location.pathname + '?step=4&t=' + Date.now();
        }
      },
      {
        step: 3,
        title: "Step 3: State Before QR Scanner Update (64 Items + 6-Tier Hierarchy)",
        desc: "Restores your 64 custom components and 65 storage boxes with the 6-Tier Storage Hierarchy Explorer view.",
        compCount: 64,
        boxCount: 65,
        action: () => {
          StorageService.restoreFullLabCatalog();
          window.location.href = window.location.pathname + '?step=3&t=' + Date.now();
        }
      },
      {
        step: 2,
        title: "Step 2: Base Custom Catalog (64 Items Loaded)",
        desc: "Loads the exact custom backup payload with 64 components and 65 storage boxes without custom search overrides.",
        compCount: 64,
        boxCount: 65,
        action: () => {
          StorageService.restoreFullLabCatalog();
          window.location.href = window.location.pathname + '?step=2&t=' + Date.now();
        }
      },
      {
        step: 1,
        title: "Step 1: Original Sample Catalog (59 Default Items)",
        desc: "Resets inventory data back to the default 59 sample laboratory components and initial box setup.",
        compCount: 59,
        boxCount: 59,
        action: () => {
          StorageService.resetToDefaults();
          window.location.href = window.location.pathname + '?step=1&t=' + Date.now();
        }
      }
    ];

    let stepsHtml = snapshots.map(s => `
      <div style="background:var(--bg-dark); border:1px solid var(--border-color); border-radius:10px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; gap:16px;">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:var(--primary); color:#0f172a; font-weight:800; padding:2px 8px; border-radius:6px; font-size:0.75rem;">STEP ${s.step}</span>
            <h4 style="margin:0; font-size:0.95rem; color:var(--text-main);">${s.title}</h4>
          </div>
          <p style="margin:6px 0 0 0; font-size:0.8rem; color:var(--text-muted);">${s.desc}</p>
          <div style="margin-top:6px; font-size:0.75rem; color:var(--primary); font-weight:700;">
            📦 ${s.compCount} Components &bull; 🗄️ ${s.boxCount} Boxes
          </div>
        </div>
        <button class="btn btn-primary btn-sm btn-rollback-step" data-step="${s.step}" style="font-weight:700; white-space:nowrap; padding:8px 16px;">
          ⏪ Rollback to Step ${s.step}
        </button>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="modal-container" style="max-width:720px;">
        <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:16px;">
          <h2 style="margin:0; color:var(--primary); font-size:1.2rem; display:flex; align-items:center; gap:8px;">
            ⏪ Interactive Timeline & Step-by-Step Undo
          </h2>
          <button class="btn-close-modal" style="background:none; border:none; color:var(--text-muted); font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body" style="max-height:70vh; overflow-y:auto;">
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">
            Select any historical step below to instantly undo or preview how the site looked at that specific stage:
          </p>
          ${stepsHtml}
        </div>
      </div>
    `;

    modal.querySelector(".btn-close-modal").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelectorAll(".btn-rollback-step").forEach(btn => {
      btn.addEventListener("click", () => {
        const stepNum = Number(btn.getAttribute("data-step"));
        const target = snapshots.find(x => x.step === stepNum);
        if (target) {
          target.action();
        }
      });
    });

    document.body.appendChild(modal);
  }
}

console.log('[ModalManager] File loaded. ModalManager defined:', typeof ModalManager);
window.ModalManager = ModalManager;

window.openComponentEditDialog = function (compId) {
  if (document.body.classList.contains("qr-scan-mode")) {
    alert("ℹ️ Read-Only QR View: Component details are displayed for viewing only. Editing is disabled when scanning via QR code.");
    return;
  }

  const oldModal = document.getElementById("direct-edit-dialog");
  if (oldModal) oldModal.remove();

  const comps = StorageService.getComponents();
  const c = comps.find(x => x.id === compId || (x.name && x.name.toLowerCase() === String(compId).toLowerCase()));
  if (!c) {
    alert("Component not found for ID: " + compId);
    return;
  }

  const backdrop = document.createElement("div");
  backdrop.id = "direct-edit-dialog";
  backdrop.style.cssText = `
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100vw !important; height: 100vh !important;
    background: rgba(15, 23, 42, 0.9) !important;
    backdrop-filter: blur(8px) !important;
    z-index: 99999999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 16px !important;
    box-sizing: border-box !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  `;

  const content = document.createElement("div");
  content.style.cssText = `
    background: #0f172a !important;
    border: 2px solid #38bdf8 !important;
    border-radius: 14px !important;
    width: 100% !important;
    max-width: 680px !important;
    max-height: 90vh !important;
    display: flex !important;
    flex-direction: column !important;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.9) !important;
    overflow: hidden !important;
    color: white !important;
  `;

  const catOptions = [
    "Microcontrollers & Dev Boards",
    "Sensors & Modules",
    "Power & Energy",
    "Connectors & Cabling",
    "Passive Components",
    "Switches & Controls",
    "Wireless & Comms",
    "Hardware & Tools",
    "Actuators & Motors",
    "Displays & Indicators",
    "IC & Semiconductors",
    "Prototyping & Breadboards"
  ];
  if (c.category && !catOptions.includes(c.category)) {
    catOptions.push(c.category);
  }

  const catHtml = catOptions.map(cat => `<option value="${cat}" ${c.category === cat ? 'selected' : ''}>${cat}</option>`).join('');

  content.innerHTML = `
    <div style="padding: 14px 20px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; background: #1e293b;">
      <h3 style="margin: 0; font-size: 1.15rem; color: #38bdf8; font-weight: 800; display: flex; align-items: center; gap: 8px;">
        ✏️ Edit Details & Location: <span style="color: white;">${c.name}</span>
      </h3>
      <button id="close-edit-dialog" style="background: none; border: none; color: #94a3b8; font-size: 1.6rem; cursor: pointer; line-height: 1;">&times;</button>
    </div>

    <form id="direct-edit-form" style="padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; margin: 0;">
      <!-- Row 1: Name & Part Number -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 220px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Component Name *</label>
          <input type="text" id="dedit-name" value="${c.name || ''}" required style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; font-size: 0.9rem; box-sizing: border-box; outline: none;" />
        </div>
        <div style="flex: 1; min-width: 180px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Part Number / SKU</label>
          <input type="text" id="dedit-part-no" value="${c.partNumber || ''}" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; font-size: 0.9rem; box-sizing: border-box; outline: none;" />
        </div>
      </div>

      <!-- Row 2: Quantity & Unit Rate/Price (₹) -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 130px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #10b981; margin-bottom: 4px;">Stock Quantity *</label>
          <input type="number" id="dedit-qty" min="0" value="${c.quantity}" required style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #10b981; background: #1e293b; color: #10b981; font-weight: 800; font-size: 1rem; box-sizing: border-box; outline: none;" />
        </div>
        <div style="flex: 1; min-width: 130px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #38bdf8; margin-bottom: 4px;">Unit Rate / Price (₹) *</label>
          <input type="number" id="dedit-price" min="0" value="${c.unitPrice || 450}" required style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #0ea5e9; background: #1e293b; color: #38bdf8; font-weight: 800; font-size: 1rem; box-sizing: border-box; outline: none;" />
        </div>
        <div style="flex: 1; min-width: 130px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">Min Stock Threshold</label>
          <input type="number" id="dedit-min-qty" min="0" value="${c.minQuantity || 1}" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: #f59e0b; font-weight: 700; font-size: 0.9rem; box-sizing: border-box; outline: none;" />
        </div>
      </div>

      <!-- Row 3: Move Box & Location (Rack #, Shelf #, Stack Layer) -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap; background: #1e293b; padding: 12px; border-radius: 8px; border: 1px solid #334155;">
        <div style="flex: 1; min-width: 140px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #38bdf8; margin-bottom: 4px;">📦 Relocate Box ID *</label>
          <input type="text" id="dedit-box" value="${c.boxId}" required style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #38bdf8; background: #0f172a; color: #38bdf8; font-weight: 800; font-size: 0.9rem; box-sizing: border-box; outline: none;" />
        </div>
        <div style="width: 85px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Rack #</label>
          <input type="number" id="dedit-rack" min="1" max="2" value="${c.rackId}" required style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.9rem; box-sizing: border-box; outline: none;" />
        </div>
        <div style="width: 85px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Shelf #</label>
          <input type="number" id="dedit-shelf" min="1" max="6" value="${c.shelfId}" required style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.9rem; box-sizing: border-box; outline: none;" />
        </div>
        <div style="flex: 1; min-width: 150px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Sub-location / Layer</label>
          <input type="text" id="dedit-stack" value="${c.stackLayer || 'Layer 1'}" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.9rem; box-sizing: border-box; outline: none;" />
        </div>
      </div>

      <!-- Row 4: Category & Manufacturer -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 200px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Category *</label>
          <select id="dedit-category" required style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; font-size: 0.9rem; box-sizing: border-box; outline: none;">
            ${catHtml}
          </select>
        </div>
        <div style="flex: 1; min-width: 200px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Manufacturer</label>
          <input type="text" id="dedit-mfg" value="${c.manufacturer || ''}" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; font-size: 0.9rem; box-sizing: border-box; outline: none;" />
        </div>
      </div>

      <!-- Row 5: Purpose / Description -->
      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Purpose / Description</label>
        <textarea id="dedit-purpose" rows="2" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; font-size: 0.85rem; box-sizing: border-box; outline: none; resize: vertical;">${c.purpose || ''}</textarea>
      </div>

      <!-- Row 6: Specs -->
      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Technical Specifications</label>
        <textarea id="dedit-specs" rows="2" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; font-size: 0.85rem; box-sizing: border-box; outline: none; resize: vertical;">${c.specifications || ''}</textarea>
      </div>

      <!-- Footer Buttons -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 10px; padding-top: 12px; border-top: 1px solid #1e293b;">
        <button type="button" id="delete-edit-dialog" style="padding: 10px 18px; background: rgba(248, 113, 113, 0.2); color: #f87171; border: 1px solid #f87171; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
          🗑️ Delete Component
        </button>
        <div style="display: flex; gap: 10px;">
          <button type="button" id="cancel-edit-dialog" style="padding: 10px 18px; background: #334155; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.85rem;">Cancel</button>
          <button type="submit" style="padding: 10px 24px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(14,165,233,0.4);">
            ✔ Save All Component Details
          </button>
        </div>
      </div>
    </form>
  `;

  backdrop.appendChild(content);
  document.body.appendChild(backdrop);

  const closeBtn = content.querySelector("#close-edit-dialog");
  const cancelBtn = content.querySelector("#cancel-edit-dialog");
  const deleteDialogBtn = content.querySelector("#delete-edit-dialog");
  const form = content.querySelector("#direct-edit-form");

  const closeDialog = () => backdrop.remove();
  closeBtn.addEventListener("click", closeDialog);
  cancelBtn.addEventListener("click", closeDialog);

  if (deleteDialogBtn) {
    deleteDialogBtn.addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete '${c.name}' (${c.boxId})?`)) {
        StorageService.setRole("ADMIN");
        let allComps = StorageService.getComponents();
        allComps = allComps.filter(item => item.id !== c.id);
        StorageService.saveComponents(allComps);
        StorageService.logTransaction(c.id, c.name, "DELETE", -c.quantity, c.quantity, 0, `Deleted component entry from ${c.boxId}.`);
        backdrop.remove();
        alert(`🗑️ Component '${c.name}' has been deleted.`);
        if (window.app && window.app.refreshApp) window.app.refreshApp();
      }
    });
  }

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeDialog();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      StorageService.setRole("ADMIN");
      const allComps = StorageService.getComponents();
      const target = allComps.find(x => x.id === c.id);

      if (target) {
        const prevQty = target.quantity;
        target.name = document.getElementById("dedit-name").value.trim() || target.name;
        target.partNumber = document.getElementById("dedit-part-no").value.trim();
        target.quantity = Number(document.getElementById("dedit-qty").value) || 0;
        target.unitPrice = Number(document.getElementById("dedit-price").value) || 0;
        target.minQuantity = Number(document.getElementById("dedit-min-qty").value) || 1;

        const newBox = (document.getElementById("dedit-box").value.trim() || target.boxId).toUpperCase();
        const newRack = Number(document.getElementById("dedit-rack").value) || 1;
        const newShelf = Number(document.getElementById("dedit-shelf").value) || 1;

        target.boxId = newBox;
        target.rackId = newRack;
        target.shelfId = newShelf;
        target.stackLayer = document.getElementById("dedit-stack").value.trim() || target.stackLayer;

        target.category = document.getElementById("dedit-category").value;
        target.manufacturer = document.getElementById("dedit-mfg").value.trim();
        target.purpose = document.getElementById("dedit-purpose").value.trim();
        target.specifications = document.getElementById("dedit-specs").value.trim();
        target.lastUpdated = new Date().toISOString().slice(0, 10);

        StorageService.ensureBoxExists(newBox, newRack, newShelf);
        StorageService.saveComponents(allComps);
        StorageService.logTransaction(target.id, target.name, "EDIT_DETAILS", target.quantity - prevQty, prevQty, target.quantity, "Updated details, stock qty, rate, and box location.");

        backdrop.remove();
        alert(`🎉 Successfully updated '${target.name}'!\n\nNew Box: ${target.boxId} (Rack ${target.rackId}, Shelf ${target.shelfId})\nStock Qty: ${target.quantity}\nUnit Rate: ₹${target.unitPrice}`);

        if (window.app && window.app.refreshApp) window.app.refreshApp();
      }
    } catch (err) {
      alert("Error saving component details: " + err.message);
    }
  });
};

window.openEditModal = window.openComponentEditDialog;
window.closeComponentModal = function () {
  if (window.ModalManager && window.ModalManager.closeComponentModal) {
    window.ModalManager.closeComponentModal();
  }
};
window.openMoveBoxDialog = function (compId) {
  if (document.body.classList.contains("qr-scan-mode")) {
    alert("ℹ️ Read-Only QR View: Relocating box items is disabled when viewing via QR code scan.");
    return;
  }

  const comps = StorageService.getComponents();
  const c = comps.find(x => x.id === compId || (x.name && x.name.toLowerCase() === String(compId).toLowerCase()));
  if (!c) {
    alert("Component not found for ID: " + compId);
    return;
  }

  const targetBox = prompt(
    `📦 RELOCATE COMPONENT '${c.name}'\n\n` +
    `Current Box Location: ${c.boxId} (Rack ${c.rackId}, Shelf ${c.shelfId})\n\n` +
    `Enter target Box ID to move '${c.name}' into (e.g. BOX A-006, BOX B-012, BOX C-001):`,
    c.boxId
  );

  if (!targetBox || !targetBox.trim() || targetBox.trim().toUpperCase() === c.boxId.toUpperCase()) {
    return;
  }

  const newBoxId = targetBox.trim().toUpperCase();
  try {
    StorageService.setRole("ADMIN");
    StorageService.moveSingleComponentToBox(c.id, newBoxId);

    if (window.closeBoxInspectorModal) window.closeBoxInspectorModal();
    if (window.closeComponentModal) window.closeComponentModal();

    alert(`🎉 Successfully moved '${c.name}' to Box ${newBoxId}!`);

    if (window.app && window.app.refreshApp) {
      window.app.refreshApp();
    }
  } catch (err) {
    alert(`Move Box Failed: ${err.message}`);
  }
};

ModalManager.openPrintableInventorySheet = function() {
  let modal = document.getElementById("printable-sheet-modal");
  if (modal) modal.remove();

  const components = StorageService.getComponents();
  let totalQty = 0;
  let totalValuation = 0;

  components.forEach(c => {
    const price = c.unitPrice || 450;
    const qty = c.quantity || 0;
    totalQty += qty;
    totalValuation += (qty * price);
  });

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  let rowsHtml = "";
  components.forEach((c, idx) => {
    const price = c.unitPrice || 450;
    const qty = c.quantity || 0;
    const itemVal = qty * price;
    const locText = c.boxId ? `${c.boxId} (Rack ${c.rackId || 1}, Shelf ${c.shelfId || 1})` : 'Unassigned';

    rowsHtml += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
        <td style="padding: 10px 8px; text-align: center; font-weight: 600; color:#94a3b8;">${idx + 1}</td>
        <td style="padding: 10px 12px;">
          <strong style="color:var(--text-bright); font-size:0.9rem;">${c.name || 'N/A'}</strong>
          <div style="font-size:0.75rem; color:#64748b; font-family:monospace; margin-top:2px;">${c.id}</div>
        </td>
        <td style="padding: 10px 8px; font-family:monospace; font-size:0.85rem; color:#cbd5e1;">${c.partNumber || '-'}</td>
        <td style="padding: 10px 8px;"><span class="stock-tag" style="background:rgba(56,189,248,0.12); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;">${c.category || 'General'}</span></td>
        <td style="padding: 10px 8px; font-size:0.85rem; color:#cbd5e1;">${locText}</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: 700; font-size:0.9rem; ${qty <= (c.minQuantity || 5) ? 'color:#f87171;' : 'color:#f8fafc;'}">${qty} ${c.unit || 'pcs'}</td>
        <td style="padding: 10px 8px; text-align: right; font-family: monospace; color:#cbd5e1;">₹${price.toLocaleString('en-IN')}</td>
        <td style="padding: 10px 12px; text-align: right; font-weight: 700; font-family: monospace; color:#4ade80;">₹${itemVal.toLocaleString('en-IN')}</td>
      </tr>
    `;
  });

  const modalHtml = `
    <div id="printable-sheet-modal" class="modal-overlay show" style="position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:999999; display:flex; align-items:center; justify-content:center; background:rgba(15,23,42,0.92); backdrop-filter:blur(12px);">
      <div class="modal-container printable-report-container" style="max-width:1150px; width:95%; max-height:92vh; overflow-y:auto; background:#0f172a; border:1px solid rgba(56,189,248,0.3); border-radius:16px; padding:28px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);">
        
        <!-- Screen Action Bar (Hidden when Printing) -->
        <div class="print-hide" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; padding-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.12);">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.3); border-radius:10px; width:42px; height:42px; display:flex; align-items:center; justify-content:center; color:#38bdf8;">
              <i data-lucide="printer" style="width:22px; height:22px;"></i>
            </div>
            <div>
              <h2 style="margin:0; font-size:1.25rem; font-weight:700; color:#f8fafc;">Printable Component Inventory Sheet & Valuation Ledger</h2>
              <p style="margin:2px 0 0 0; font-size:0.8rem; color:#94a3b8;">Generate and print official hardware inventory datasheets with quantities and rates</p>
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" onclick="window.triggerInventoryPrint()" style="background:#0284c7; color:#fff; font-weight:600; padding:10px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; border:none; box-shadow:0 4px 14px rgba(2,132,199,0.4);">
              <i data-lucide="printer" style="width:18px; height:18px;"></i> Print / Save as PDF
            </button>
            <button class="btn btn-secondary" onclick="ModalManager.exportInventoryCSV()" style="padding:10px 16px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; background:rgba(255,255,255,0.08); color:#f8fafc; border:1px solid rgba(255,255,255,0.15);">
              <i data-lucide="download" style="width:18px; height:18px;"></i> Export CSV
            </button>
            <button class="btn btn-secondary" onclick="document.getElementById('printable-sheet-modal').remove()" style="padding:10px 16px; border-radius:8px; cursor:pointer; background:rgba(255,255,255,0.08); color:#94a3b8; border:1px solid rgba(255,255,255,0.15);">
              ✕ Close
            </button>
          </div>
        </div>

        <!-- Printable Document Area -->
        <div id="printable-area" class="printable-document">
          <div style="text-align:center; margin-bottom:24px; border-bottom:2px solid #38bdf8; padding-bottom:16px;">
            <h1 style="margin:0 0 6px 0; font-size:1.6rem; color:#f8fafc; font-weight:800; letter-spacing:0.5px;">LABSPHERE ENTERPRISE LABORATORY SYSTEM</h1>
            <h3 style="margin:0 0 10px 0; font-size:1.1rem; color:#38bdf8; font-weight:600;">MASTER HARDWARE INVENTORY & RATE LEDGER SHEET</h3>
            <div style="font-size:0.85rem; color:#94a3b8;">
              <span><strong>Report Generated Date:</strong> ${dateFormatted}</span> &nbsp;|&nbsp;
              <span><strong>System Scope:</strong> Physical Stock Valuation & Itemized Catalog</span>
            </div>
          </div>

          <!-- Report Summary KPI Cards -->
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; margin-bottom:24px;">
            <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:14px 18px; text-align:center;">
              <div style="font-size:0.75rem; text-transform:uppercase; color:#94a3b8; letter-spacing:0.5px; font-weight:600;">Total Component Types</div>
              <div style="font-size:1.6rem; font-weight:800; color:#38bdf8; margin-top:4px;">${components.length} Items</div>
            </div>
            <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:14px 18px; text-align:center;">
              <div style="font-size:0.75rem; text-transform:uppercase; color:#94a3b8; letter-spacing:0.5px; font-weight:600;">Total Physical Quantity</div>
              <div style="font-size:1.6rem; font-weight:800; color:#a855f7; margin-top:4px;">${totalQty.toLocaleString('en-IN')} pcs</div>
            </div>
            <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:14px 18px; text-align:center;">
              <div style="font-size:0.75rem; text-transform:uppercase; color:#94a3b8; letter-spacing:0.5px; font-weight:600;">Total Stock Valuation</div>
              <div style="font-size:1.6rem; font-weight:800; color:#4ade80; margin-top:4px;">₹${totalValuation.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <!-- Component Inventory Data Table -->
          <table class="report-table" style="width:100%; border-collapse:collapse; font-size:0.85rem; margin-top:10px;">
            <thead>
              <tr style="background:rgba(30,41,59,0.9); color:#f8fafc; border-bottom:2px solid #38bdf8;">
                <th style="padding:12px 8px; text-align:center;">#</th>
                <th style="padding:12px; text-align:left;">Component Name & ID</th>
                <th style="padding:12px 8px; text-align:left;">Part Number</th>
                <th style="padding:12px 8px; text-align:left;">Category</th>
                <th style="padding:12px 8px; text-align:left;">Storage Location</th>
                <th style="padding:12px 8px; text-align:right;">Quantity</th>
                <th style="padding:12px 8px; text-align:right;">Unit Rate (₹)</th>
                <th style="padding:12px; text-align:right;">Total Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              <tr class="grand-total-row" style="background:rgba(30,41,59,0.95); font-weight:800; border-top:2px solid #38bdf8; color:#f8fafc; page-break-inside:avoid; break-inside:avoid;">
                <td colspan="5" style="padding:14px; text-align:right; font-size:0.9rem;">GRAND TOTAL INVENTORY SUMMARY:</td>
                <td style="padding:14px 8px; text-align:right; color:#38bdf8; font-size:0.95rem;">${totalQty.toLocaleString('en-IN')} pcs</td>
                <td style="padding:14px 8px; text-align:right;">-</td>
                <td style="padding:14px; text-align:right; color:#4ade80; font-size:1.05rem; font-family:monospace;">₹${totalValuation.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top:32px; font-size:0.75rem; color:#64748b; display:flex; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.1); padding-top:14px;">
            <span>Verified by Lab Controller Signature: _______________________</span>
            <span>LabSphere Official Hardware Inventory Sheet</span>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  if (window.lucide) window.lucide.createIcons();
};

ModalManager.exportInventoryCSV = function() {
  const components = StorageService.getComponents();
  let csvContent = "data:text/csv;charset=utf-8,#,Component Name,Component ID,Part Number,Category,Location,Quantity,Unit Rate (INR),Total Value (INR)\n";

  components.forEach((c, idx) => {
    const price = c.unitPrice || 450;
    const qty = c.quantity || 0;
    const itemVal = qty * price;
    const locText = c.boxId ? `${c.boxId} (Rack ${c.rackId || 1} Shelf ${c.shelfId || 1})` : 'Unassigned';
    const cleanName = `"${(c.name || '').replace(/"/g, '""')}"`;
    const cleanCat = `"${(c.category || '').replace(/"/g, '""')}"`;
    const cleanLoc = `"${locText.replace(/"/g, '""')}"`;

    csvContent += `${idx + 1},${cleanName},${c.id},${c.partNumber || ''},${cleanCat},${cleanLoc},${qty},${price},${itemVal}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `LabSphere_Inventory_Sheet_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

window.openPrintableInventorySheet = function() {
  ModalManager.openPrintableInventorySheet();
};

window.triggerInventoryPrint = function() {
  const container = document.querySelector('.printable-report-container');
  if (container) container.scrollTop = 0;
  setTimeout(() => {
    window.print();
  }, 100);
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (window.closeComponentModal) window.closeComponentModal();
    if (window.closeBoxInspectorModal) window.closeBoxInspectorModal();
    const sheetModal = document.getElementById("printable-sheet-modal");
    if (sheetModal) sheetModal.remove();
    const directEdit = document.getElementById("direct-edit-dialog");
    if (directEdit) directEdit.remove();
  }
});
