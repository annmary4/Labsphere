/**
 * LabSphere App - Main Controller (Multi-Criteria Universal Search Edition)
 */

class App {
  constructor() {
    this.currentViewMode = "split";
    this.selectedRackId = null;
    this.selectedShelfId = null;
    this.selectedBoxId = null;
    this.searchQuery = "";
    this.categoryFilter = "ALL";
    this.stockFilter = "ALL";
    this.locationFilter = "ALL";
    this.currentSort = "name-asc";
  }

  async init() {
    console.log("Initializing LabSphere Multi-Criteria Search System...");

    await StorageService.init();

    // Ensure all 59 components are guaranteed loaded and retrieved
    let comps = StorageService.getComponents();
    if (!comps || comps.length < 50) {
      StorageService.restoreFullLabCatalog();
    }

    ModalManager.init({
      onInventoryChanged: () => this.refreshApp()
    });

    this.bindEvents();
    this.updateAuthUI();
    this.setViewMode("split");
    this.refreshApp();

    // Auto-bypass login overlay on startup if session is already active (e.g. switching to Desktop Mode)
    const activeSession = StorageService.getCurrentSession();
    if (activeSession && typeof redirectToDashboard === "function") {
      redirectToDashboard();
    }

    // Auto-open mobile passport if QR code URL parameters present (?box=BOX_A-003 or ?comp=COMP-001)
    this.checkUrlParamsForQrScan();

    console.log("LabSphere Search System Ready!");
  }

  checkUrlParamsForQrScan() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let boxParam = urlParams.get("box") || urlParams.get("boxId");
      let compParam = urlParams.get("comp") || urlParams.get("compId") || urlParams.get("id") || urlParams.get("q");
      const hashStr = window.location.hash.replace("#", "");

      if (!boxParam && hashStr.startsWith("box=")) {
        boxParam = hashStr.replace("box=", "");
      }
      if (!compParam && hashStr.startsWith("comp=")) {
        compParam = hashStr.replace("comp=", "");
      }

      const allComponents = StorageService.getComponents();
      const allBoxes = StorageService.getBoxes();

      // If user scanned CP2102, CP2104, or SERIAL inside box parameter
      if (boxParam && (boxParam.toUpperCase().includes("CP2102") || boxParam.toUpperCase().includes("CP2104") || boxParam.toUpperCase().includes("SERIAL") || boxParam.toUpperCase().includes("CONVERTER"))) {
        compParam = boxParam;
        boxParam = null;
      }

      if (compParam || boxParam) {
        document.body.classList.add("qr-scan-mode");
      }

      if (compParam) {
        const cleanQuery = decodeURIComponent(compParam).trim().toUpperCase();
        console.log("📱 QR Scan Searching Component:", cleanQuery);

        const comp = allComponents.find(c => 
          (c.name || "").trim().toUpperCase().includes(cleanQuery) ||
          (c.id || "").trim().toUpperCase() === cleanQuery ||
          (c.partNumber || "").trim().toUpperCase().includes(cleanQuery) ||
          (c.barcode || "").trim().toUpperCase() === cleanQuery
        );

        if (comp) {
          const cleanBoxId = (comp.boxId || "").trim().toUpperCase();
          this.selectedBoxId = comp.boxId;
          this.selectedRackId = comp.rackId;
          this.selectedShelfId = comp.shelfId;
          this.refreshApp();

          const boxComps = allComponents.filter(c => (c.boxId || "").trim().toUpperCase() === cleanBoxId);
          
          setTimeout(() => {
            if (boxComps.length > 1) {
              ModalManager.openBoxInspectorModal(comp.boxId, boxComps);
            } else {
              ModalManager.openComponentInspector(comp);
            }
          }, 150);
          return;
        }
      }

      if (boxParam) {
        const cleanBoxId = decodeURIComponent(boxParam).trim().toUpperCase();
        console.log("📱 QR Scan Detected Box Parameter:", cleanBoxId);

        let targetBoxId = cleanBoxId;

        // 1. STRICT EXACT MATCH FIRST
        let matchingComps = allComponents.filter(c => (c.boxId || "").trim().toUpperCase() === cleanBoxId);

        // 2. Normalized Hyphen/Space Match (e.g. BOX A014 -> BOX A-014 or BOX A015 -> BOX A-015)
        if (matchingComps.length === 0) {
          const targetNorm = cleanBoxId.replace(/\s+/g, "").replace(/-/g, "");
          matchingComps = allComponents.filter(c => {
            const compBoxNorm = (c.boxId || "").trim().toUpperCase().replace(/\s+/g, "").replace(/-/g, "");
            return compBoxNorm === targetNorm;
          });
        }

        // 3. Exact Box Entry from Boxes List
        if (matchingComps.length === 0) {
          const exactBox = allBoxes.find(b => {
            const normB = (b.id || "").trim().toUpperCase().replace(/\s+/g, "").replace(/-/g, "");
            const targetNorm = cleanBoxId.replace(/\s+/g, "").replace(/-/g, "");
            return normB === targetNorm || (b.id || "").trim().toUpperCase() === cleanBoxId;
          });
          if (exactBox) {
            targetBoxId = exactBox.id;
            matchingComps = allComponents.filter(c => (c.boxId || "").trim().toUpperCase() === (exactBox.id || "").trim().toUpperCase());
          }
        }

        // 4. Numeric Extract Match (e.g. "15" or "BOX 15" -> matches "BOX A-015" or "BOX D-015")
        if (matchingComps.length === 0) {
          const numMatch = cleanBoxId.match(/\d+/);
          if (numMatch) {
            const numStr = numMatch[0];
            const paddedNum = numStr.padStart(3, '0'); // e.g. "15" -> "015"

            const matchedBox = allBoxes.find(b => 
              (b.id || "").toUpperCase().includes(`-${paddedNum}`) ||
              (b.id || "").toUpperCase().includes(`-${numStr}`) ||
              (b.id || "").toUpperCase().includes(numStr)
            );

            if (matchedBox) {
              targetBoxId = matchedBox.id;
              matchingComps = allComponents.filter(c => (c.boxId || "").trim().toUpperCase() === (matchedBox.id || "").trim().toUpperCase());
            }

            if (matchingComps.length === 0) {
              const comp = allComponents.find(c => 
                (c.id || "").toUpperCase().includes(`-${paddedNum}`) ||
                (c.id || "").toUpperCase().includes(`-${numStr}`)
              );
              if (comp) {
                targetBoxId = comp.boxId;
                matchingComps = allComponents.filter(c => (c.boxId || "").trim().toUpperCase() === (comp.boxId || "").trim().toUpperCase());
              }
            }
          }
        }

        // Ensure box exists in storage registry
        const box = StorageService.ensureBoxExists(targetBoxId);
        this.selectedBoxId = box.id;
        this.selectedRackId = box.rackId;
        this.selectedShelfId = box.shelfId;
        this.refreshApp();

        setTimeout(() => {
          ModalManager.openBoxInspectorModal(box.id, matchingComps);
        }, 150);
      }
    } catch (e) {
      console.warn("QR URL routing parse error:", e);
    }
  }

  bindEvents() {
    // QR / Barcode Scanner Button
    const btnScanQr = document.getElementById("btn-scan-qr");
    if (btnScanQr) btnScanQr.addEventListener("click", () => ModalManager.openScanQrModal());

    // Auth Login & Logout Buttons
    const btnNavLogin = document.getElementById("btn-nav-login");
    const btnNavLogout = document.getElementById("btn-nav-logout");

    if (btnNavLogin) btnNavLogin.addEventListener("click", () => ModalManager.openLoginModal());
    if (btnNavLogout) {
      btnNavLogout.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out of your session?")) {
          StorageService.logout();
          alert("Logged out successfully.");
          this.refreshApp();
        }
      });
    }

    // Top-Right Human Avatar Logo Click Listener to Toggle Profile Popover Menu
    const avatarBtn = document.getElementById("btn-user-profile-trigger");
    const userPopover = document.getElementById("user-profile-popover");

    if (avatarBtn && userPopover) {
      avatarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userPopover.classList.toggle("hidden");
      });

      document.addEventListener("click", (e) => {
        if (!userPopover.contains(e.target) && e.target !== avatarBtn && !avatarBtn.contains(e.target)) {
          userPopover.classList.add("hidden");
        }
      });
    }

    // Editable Signed-In User Name Click Listener
    const userNameEl = document.getElementById("user-profile-name");
    if (userNameEl) {
      userNameEl.style.cursor = "pointer";
      userNameEl.title = "Click to edit your display / signed-in name";
      userNameEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const session = StorageService.getCurrentSession();
        const currentName = session ? session.fullName : userNameEl.innerText;
        const newName = prompt("Edit your User / Signed-In Display Name:", currentName);
        if (newName && newName.trim()) {
          StorageService.updateProfileName(newName.trim());
          this.refreshApp();
          alert(`Your signed-in display name has been updated to: '${newName.trim()}'`);
        }
      });
    }

    // Admin User Manager Button
    const btnUserMgr = document.getElementById("btn-user-manager");
    if (btnUserMgr) {
      btnUserMgr.addEventListener("click", () => {
        if (StorageService.isRole("STUDENT")) {
          alert("User Management is restricted to Administrators.");
          return;
        }
        ModalManager.openUserManagerModal();
      });
    }

    // Universal Multi-Criteria Search Input
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("search-clear-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (clearSearchBtn) {
          if (this.searchQuery) clearSearchBtn.classList.remove("hidden");
          else clearSearchBtn.classList.add("hidden");
        }
        this.renderComponents();
        this.renderRacks();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        this.searchQuery = "";
        clearSearchBtn.classList.add("hidden");
        this.renderComponents();
        this.renderRacks();
      });
    }

    // Category Filter
    const catSelect = document.getElementById("filter-category");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        this.categoryFilter = e.target.value;
        this.renderComponents();
      });
    }

    // Stock Level Filter
    const stockSelect = document.getElementById("filter-stock");
    if (stockSelect) {
      stockSelect.addEventListener("change", (e) => {
        this.stockFilter = e.target.value;
        this.renderComponents();
      });
    }

    // Location Filter
    const locSelect = document.getElementById("filter-location");
    if (locSelect) {
      locSelect.addEventListener("change", (e) => {
        this.locationFilter = e.target.value;
        this.renderComponents();
      });
    }

    // Sort Select
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderComponents();
      });
    }

    // View Mode Toggles (Desktop & Mobile Drawer)
    const btnSplit = document.getElementById("view-mode-split");
    const btnRacks = document.getElementById("view-mode-racks");
    const btnTable = document.getElementById("view-mode-table");
    const btnComps = document.getElementById("view-mode-components");

    if (btnSplit) btnSplit.addEventListener("click", () => this.setViewMode("split"));
    if (btnRacks) btnRacks.addEventListener("click", () => this.setViewMode("racks"));
    if (btnTable) btnTable.addEventListener("click", () => this.setViewMode("table"));
    if (btnComps) btnComps.addEventListener("click", () => this.setViewMode("components"));

    // Mobile Slide-Out Side Panel Drawer Event Listeners
    const btnMenu = document.getElementById("btn-mobile-menu");
    const drawer = document.getElementById("mobile-view-drawer");
    const backdrop = document.getElementById("mobile-drawer-backdrop");
    const btnClose = document.getElementById("btn-close-mobile-drawer");

    const openDrawer = () => {
      if (drawer) drawer.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
    };

    const closeDrawer = () => {
      if (drawer) drawer.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
    };

    if (btnMenu) btnMenu.addEventListener("click", openDrawer);
    if (btnClose) btnClose.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    ["drawer-view-split", "drawer-view-racks", "drawer-view-table", "drawer-view-components"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", () => {
          const mode = btn.getAttribute("data-view");
          if (mode) this.setViewMode(mode);
          closeDrawer();
        });
      }
    });

    // Mobile Drawer Action Button Triggers (Approvals, Executive Report, Inventory Sheet, Audit Logs, Procurement, BOM, My Requests)
    const mapDrawerTrigger = (drawerId, targetId, directFn) => {
      const btn = document.getElementById(drawerId);
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          closeDrawer();
          if (directFn) {
            directFn();
          } else if (targetId) {
            const targetBtn = document.getElementById(targetId);
            if (targetBtn) targetBtn.click();
          }
        });
      }
    };

    mapDrawerTrigger("drawer-btn-approvals", "btn-admin-approve");
    mapDrawerTrigger("drawer-btn-student-reqs", "btn-student-reqs");
    mapDrawerTrigger("drawer-btn-engineer-bom", "btn-engineer-bom");
    mapDrawerTrigger("drawer-btn-mgmt-dashboard", "btn-mgmt-dashboard");
    mapDrawerTrigger("drawer-btn-print-inventory-sheet", null, () => {
      if (typeof openPrintableInventorySheet === "function") openPrintableInventorySheet();
    });
    mapDrawerTrigger("drawer-btn-audit-log", "btn-audit-log");
    mapDrawerTrigger("drawer-btn-procurement-insights", "btn-procurement-insights");

    // Add Component Button
    const btnAdd = document.getElementById("btn-add-component");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        if (!StorageService.isRole("ADMIN")) {
          StorageService.setRole("ADMIN");
        }
        ModalManager.openAddComponentModal(
          this.selectedRackId || 1,
          this.selectedShelfId || 1,
          this.selectedBoxId || ""
        );
      });
    }

    // PERSONA SPECIFIC BUTTONS:
    const btnStudentReqs = document.getElementById("btn-student-reqs");
    const btnAdminApprove = document.getElementById("btn-admin-approve");
    const btnEngineerBom = document.getElementById("btn-engineer-bom");
    const btnMgmtDashboard = document.getElementById("btn-mgmt-dashboard");

    if (btnStudentReqs) btnStudentReqs.addEventListener("click", () => ModalManager.openStudentRequestsModal());
    if (btnAdminApprove) btnAdminApprove.addEventListener("click", () => ModalManager.openAdminApprovalModal());
    if (btnEngineerBom) btnEngineerBom.addEventListener("click", () => ModalManager.openBomModal());
    if (btnMgmtDashboard) btnMgmtDashboard.addEventListener("click", () => ModalManager.openManagementModal());

    // General Action Buttons
    const btnAudit = document.getElementById("btn-audit-log");
    const btnProjects = document.getElementById("btn-projects-mgr");
    const btnProcurement = document.getElementById("btn-procurement-insights");
    const btnBoxes = document.getElementById("btn-manage-boxes");
    const btnRbac = document.getElementById("btn-rbac-switch");

    if (btnAudit) btnAudit.addEventListener("click", () => ModalManager.openAuditModal());
    if (btnProjects) btnProjects.addEventListener("click", () => ModalManager.openProjectModal());
    if (btnProcurement) btnProcurement.addEventListener("click", () => ModalManager.openProcurementModal());
    if (btnBoxes) btnBoxes.addEventListener("click", () => ModalManager.openBoxModal());

    if (btnRbac) {
      btnRbac.addEventListener("click", () => {
        const roles = ["STUDENT", "ENGINEER", "ADMIN", "MANAGEMENT"];
        const current = StorageService.getRole();
        const nextRole = roles[(roles.indexOf(current) + 1) % roles.length];
        StorageService.setRole(nextRole);
        this.updateAuthUI();
        this.refreshApp();
        alert(`Switched Active Account Session to: ${USER_ROLES[nextRole]}`);
      });
    }

    // Dropdown toggle
    const btnMore = document.getElementById("btn-more-options");
    const dropdownMenu = document.getElementById("options-dropdown");
    if (btnMore && dropdownMenu) {
      btnMore.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        dropdownMenu.classList.toggle("show");
      });
      document.addEventListener("click", () => dropdownMenu.classList.remove("show"));
    }

    const triggerRestoreFull = () => {
      StorageService.restoreFullLabCatalog();
      alert("🎉 Successfully restored all 59 laboratory components and physical box layouts (including Arduino Nano & ESP32 in BOX A-003)!");
      window.location.reload();
    };

    const triggerRecoverStorage = () => {
      ModalManager.openStorageSnapshotsModal();
    };

    const btnRestoreFullCatalog = document.getElementById("btn-restore-full-catalog");
    if (btnRestoreFullCatalog) btnRestoreFullCatalog.addEventListener("click", triggerRestoreFull);

    const btnRestoreFullDirect = document.getElementById("btn-restore-full-catalog-direct");
    if (btnRestoreFullDirect) btnRestoreFullDirect.addEventListener("click", triggerRestoreFull);

    const btnRestoreCustom = document.getElementById("btn-restore-custom-setup");
    if (btnRestoreCustom) btnRestoreCustom.addEventListener("click", triggerRecoverStorage);

    const btnRestoreCustomDirect = document.getElementById("btn-restore-custom-setup-direct");
    if (btnRestoreCustomDirect) btnRestoreCustomDirect.addEventListener("click", triggerRecoverStorage);

    const btnExport = document.getElementById("btn-export-data");
    if (btnExport) btnExport.addEventListener("click", () => StorageService.exportJSON());

    const btnReset = document.getElementById("btn-reset-data");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all data back to defaults?")) {
          StorageService.resetToDefaults();
          this.refreshApp();
          alert("Data reset to defaults.");
        }
      });
    }

    const clearLocFilter = document.getElementById("clear-location-filter");
    if (clearLocFilter) {
      clearLocFilter.addEventListener("click", () => this.resetAllFilters());
    }

    const btnResetSearch = document.getElementById("btn-reset-search");
    if (btnResetSearch) {
      btnResetSearch.addEventListener("click", () => this.resetAllFilters());
    }

    const btnUndoHistory = document.getElementById("btn-undo-history");
    if (btnUndoHistory) {
      btnUndoHistory.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        ModalManager.openUndoTimelineModal();
      });
    }

    // Component Details Dialog Box Close Listeners
    const btnCloseCompDialog = document.getElementById("btn-close-components-dialog");
    const compDialogBackdrop = document.getElementById("components-dialog-backdrop");
    const closeDialogFn = () => this.setViewMode("split");

    if (btnCloseCompDialog) btnCloseCompDialog.addEventListener("click", closeDialogFn);
    if (compDialogBackdrop) compDialogBackdrop.addEventListener("click", closeDialogFn);
  }

  resetAllFilters() {
    this.searchQuery = "";
    this.categoryFilter = "ALL";
    this.stockFilter = "ALL";
    this.locationFilter = "ALL";
    this.selectedRackId = null;
    this.selectedShelfId = null;
    this.selectedBoxId = null;

    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("search-clear-btn");
    const catSelect = document.getElementById("filter-category");
    const stockSelect = document.getElementById("filter-stock");
    const locSelect = document.getElementById("filter-location");

    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
    if (catSelect) catSelect.value = "ALL";
    if (stockSelect) stockSelect.value = "ALL";
    if (locSelect) locSelect.value = "ALL";

    this.refreshApp();
  }

  updateAuthUI() {
    const loginScreen = document.getElementById("login-screen");
    const mainApp = document.getElementById("app");
    const session = StorageService.getCurrentSession();

    if (!session) {
      if (loginScreen) loginScreen.style.display = "flex";
      if (mainApp) mainApp.style.display = "none";
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    if (loginScreen) loginScreen.style.display = "none";
    if (mainApp) mainApp.style.display = "block";

    const roleKey = StorageService.getRole();
    const roleBadge = document.getElementById("rbac-role-badge");
    const userChip = document.getElementById("user-profile-name");
    const userDesig = document.getElementById("user-profile-designation");

    const roleTitle = USER_ROLES[roleKey] || roleKey;

    if (roleBadge) {
      roleBadge.innerText = roleTitle;
      roleBadge.className = `role-badge role-${roleKey.toLowerCase()}`;
    }

    if (userDesig) {
      userDesig.innerText = roleTitle;
    }

    if (userChip && session) {
      const displayName = session.fullName || session.username || "Lab User";
      userChip.innerText = displayName;
      userChip.title = `@${session.username || 'user'} (${session.email || 'N/A'}) - Click to Edit Profile Name`;
    }

    const btnLogout = document.getElementById("btn-nav-logout");
    if (btnLogout) {
      btnLogout.style.display = "inline-flex";
      btnLogout.onclick = () => this.handleLogout();
    }

    // ALWAYS DISPLAY ALL FEATURE BUTTONS ON SCREEN AT ALL TIMES
    const btnAdd = document.getElementById("btn-add-component");
    const btnBoxes = document.getElementById("btn-manage-boxes");
    const btnUserMgr = document.getElementById("btn-user-manager");
    const btnAdminApprove = document.getElementById("btn-admin-approve");

    if (btnAdd) btnAdd.style.display = "inline-flex";
    if (btnBoxes) btnBoxes.style.display = "inline-flex";
    if (btnUserMgr) btnUserMgr.style.display = "inline-flex";
    if (btnAdminApprove) btnAdminApprove.style.display = "inline-flex";

    const pendingReqs = StorageService.getRequests().filter(r => r.status === "PENDING").length;
    const apprBadge = document.getElementById("admin-approval-count");
    const drawerApprBadge = document.getElementById("drawer-approvals-badge");
    if (apprBadge) {
      apprBadge.innerText = pendingReqs;
      if (pendingReqs > 0) apprBadge.classList.remove("hidden");
      else apprBadge.classList.add("hidden");
    }
    if (drawerApprBadge) {
      drawerApprBadge.innerText = pendingReqs;
      if (pendingReqs > 0) drawerApprBadge.classList.remove("hidden");
      else drawerApprBadge.classList.add("hidden");
    }
  }

  handleLogout() {
    StorageService.logout();
    if (window.ModalManager && window.ModalManager.showToast) {
      window.ModalManager.showToast("Logged out successfully.", "info");
    }
    this.updateAuthUI();
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    document.body.setAttribute("data-view-mode", mode);
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.className = `main-container view-${mode}`;

    const componentsPanel = document.getElementById("components-panel");
    const componentsBackdrop = document.getElementById("components-dialog-backdrop");
    const btnCloseDialog = document.getElementById("btn-close-components-dialog");

    if (mode === "components" && window.innerWidth > 1024) {
      if (componentsPanel) componentsPanel.classList.add("is-dialog-mode");
      if (componentsBackdrop) componentsBackdrop.classList.remove("hidden");
      if (btnCloseDialog) btnCloseDialog.classList.remove("hidden");
    } else {
      if (componentsPanel) componentsPanel.classList.remove("is-dialog-mode");
      if (componentsBackdrop) componentsBackdrop.classList.add("hidden");
      if (btnCloseDialog) btnCloseDialog.classList.add("hidden");
    }

    const btnSplit = document.getElementById("view-mode-split");
    const btnRacks = document.getElementById("view-mode-racks");
    const btnTable = document.getElementById("view-mode-table");
    const btnComps = document.getElementById("view-mode-components");

    [btnSplit, btnRacks, btnTable, btnComps].forEach(btn => btn && btn.classList.remove("active"));
    if (mode === "split" && btnSplit) btnSplit.classList.add("active");
    if (mode === "racks" && btnRacks) btnRacks.classList.add("active");
    if (mode === "table" && btnTable) btnTable.classList.add("active");
    if (mode === "components" && btnComps) btnComps.classList.add("active");

    // Sync Mobile Drawer View Mode Items
    const drawerSplit = document.getElementById("drawer-view-split");
    const drawerRacks = document.getElementById("drawer-view-racks");
    const drawerTable = document.getElementById("drawer-view-table");
    const drawerComps = document.getElementById("drawer-view-components");

    [drawerSplit, drawerRacks, drawerTable, drawerComps].forEach(btn => btn && btn.classList.remove("active"));
    if (mode === "split" && drawerSplit) drawerSplit.classList.add("active");
    if (mode === "racks" && drawerRacks) drawerRacks.classList.add("active");
    if (mode === "table" && drawerTable) drawerTable.classList.add("active");
    if (mode === "components" && drawerComps) drawerComps.classList.add("active");

    this.renderComponents();
  }

  refreshApp() {
    this.renderMetrics();
    this.renderRacks();
    this.renderComponents();
  }

  renderMetrics() {
    const components = StorageService.getComponents();
    const boxes = StorageService.getBoxes();

    document.getElementById("metric-total-components").innerText = components.length;
    document.getElementById("metric-total-boxes").innerText = boxes.length;
    document.getElementById("metric-low-stock").innerText = components.filter(c => c.quantity > 0 && c.quantity <= c.minQuantity).length;
    document.getElementById("metric-out-stock").innerText = components.filter(c => c.quantity === 0).length;
  }

  renderRacks() {
    const racks = StorageService.getRacks();
    const boxes = StorageService.getBoxes();
    const components = StorageService.getComponents();

    let highlightedBoxIds = [];
    if (this.searchQuery) {
      const q = this.searchQuery;
      const matchingComps = components.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.partNumber && c.partNumber.toLowerCase().includes(q)) ||
        (c.manufacturer && c.manufacturer.toLowerCase().includes(q)) ||
        (c.barcode && c.barcode.toLowerCase().includes(q)) ||
        (c.boxId && c.boxId.toLowerCase().includes(q)) ||
        (c.specifications && c.specifications.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q))) ||
        (c.compatibleComponents && c.compatibleComponents.some(cc => cc.toLowerCase().includes(q)))
      );
      highlightedBoxIds = [...new Set(matchingComps.map(c => c.boxId))];
    }

    RackViewer.render({
      racks,
      boxes,
      components,
      selectedRackId: this.selectedRackId,
      selectedShelfId: this.selectedShelfId,
      selectedBoxId: this.selectedBoxId,
      highlightedBoxIds,
      onShelfClick: (rackId, shelfId) => this.handleShelfSelect(rackId, shelfId),
      onBoxClick: (boxId, rackId, shelfId) => this.handleBoxSelect(boxId, rackId, shelfId)
    });
  }

  handleShelfSelect(rackId, shelfId) {
    if (shelfId === null) {
      this.selectedRackId = rackId;
      this.selectedShelfId = null;
      this.selectedBoxId = null;
    } else {
      this.selectedRackId = rackId;
      this.selectedShelfId = shelfId;
      this.selectedBoxId = null;
    }
    this.refreshApp();

    if (shelfId && window.innerWidth <= 768) {
      const compPanel = document.getElementById("components-panel");
      if (compPanel) {
        compPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  handleBoxSelect(boxId, rackId, shelfId) {
    this.selectedBoxId = boxId;
    this.selectedRackId = rackId;
    this.selectedShelfId = shelfId;
    this.refreshApp();

    // POP UP MULTI-COMPONENT BOX INSPECTOR FOR EXACT ITEMS IN THIS BOX AT THIS LOCATION
    const components = StorageService.getComponents().filter(c => 
      String(c.boxId || "").trim().toUpperCase() === String(boxId || "").trim().toUpperCase() &&
      (!rackId || Number(c.rackId) === Number(rackId)) &&
      (!shelfId || Number(c.shelfId) === Number(shelfId))
    );
    if (components.length > 0) {
      ModalManager.openBoxInspectorModal(boxId, components);
    } else {
      if (!StorageService.isRole("STUDENT")) {
        if (confirm(`Box '${boxId}' is currently empty. Would you like to add a new component to ${boxId}?`)) {
          ModalManager.openAddComponentModal(rackId, shelfId, boxId);
        }
      } else {
        alert(`Box '${boxId}' is currently empty.`);
      }
    }
  }

  // MULTI-CRITERIA SEARCH ENGINE FUNCTION
  renderComponents() {
    let components = StorageService.getComponents();
    const activeFiltersBar = document.getElementById("active-filters-bar");
    const activeLocText = document.getElementById("active-location-text");
    const viewTitle = document.getElementById("view-title");

    if (this.searchQuery) {
      const q = this.searchQuery;
      components = components.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.partNumber && c.partNumber.toLowerCase().includes(q)) ||
        (c.manufacturer && c.manufacturer.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.barcode && c.barcode.toLowerCase().includes(q)) ||
        (c.boxId && c.boxId.toLowerCase().includes(q)) ||
        (c.purpose && c.purpose.toLowerCase().includes(q)) ||
        (c.specifications && c.specifications.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q))) ||
        (c.compatibleComponents && c.compatibleComponents.some(cc => cc.toLowerCase().includes(q)))
      );

      if (viewTitle) viewTitle.innerHTML = `Search Results for "<span class="primary-text" style="color:var(--primary); font-weight:700;">${this.searchQuery}</span>"`;

      if (activeFiltersBar && activeLocText) {
        activeFiltersBar.classList.remove("hidden");
        activeLocText.innerText = `Global Search: "${this.searchQuery}" (Searching All Shelves & Boxes)`;
      }
    } else {
      if (viewTitle) {
        viewTitle.innerText = "All Components (59 Items)";
      }

      if (activeFiltersBar) {
        activeFiltersBar.classList.add("hidden");
      }
    }

    if (this.categoryFilter !== "ALL") {
      const targetCat = this.categoryFilter.trim().toLowerCase();
      components = components.filter(c => (c.category || "").trim().toLowerCase() === targetCat);
    }

    if (this.stockFilter !== "ALL") {
      if (this.stockFilter === "IN_STOCK") {
        components = components.filter(c => c.quantity > c.minQuantity);
      } else if (this.stockFilter === "LOW_STOCK") {
        components = components.filter(c => c.quantity > 0 && c.quantity <= c.minQuantity);
      } else if (this.stockFilter === "OUT_OF_STOCK") {
        components = components.filter(c => c.quantity === 0);
      }
    }

    if (this.locationFilter !== "ALL") {
      const rackNum = this.locationFilter === "RACK_1" ? 1 : 2;
      components = components.filter(c => Number(c.rackId) === Number(rackNum));
    }

    components.sort((a, b) => {
      if (this.currentSort === "name-asc") return a.name.localeCompare(b.name);
      if (this.currentSort === "location-asc") {
        if (a.rackId !== b.rackId) return a.rackId - b.rackId;
        if (a.shelfId !== b.shelfId) return a.shelfId - b.shelfId;
        return a.boxId.localeCompare(b.boxId);
      }
      if (this.currentSort === "qty-desc") return b.quantity - a.quantity;
      if (this.currentSort === "qty-asc") return a.quantity - b.quantity;
      return 0;
    });

    ComponentsView.render({
      components,
      viewMode: this.currentViewMode,
      onComponentClick: (component) => ModalManager.openComponentInspector(component)
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  window.app = new App();
  await StorageService.init();
  try {
    ModalManager.init({ onInventoryChanged: () => window.app.refreshApp() });
    console.log('[App] ModalManager.init() succeeded. isInitialized:', ModalManager.isInitialized);
  } catch(e) {
    console.error("[App] ModalManager.init FAILED:", e.message, e);
  }
  window.app.bindEvents();
  window.app.updateAuthUI();
  window.app.setViewMode("split");
  window.app.refreshApp();
  window.app.checkUrlParamsForQrScan();
  console.log("LabSphere Search System Ready!");
});
