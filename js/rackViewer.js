/**
 * LabSphere Rack Viewer - 2-Column Table Grid Rack Renderer
 * Laboratory -> Room -> Rack -> Shelf -> Storage Footprint -> Stack Layer
 */

class RackViewer {
  // Static set to persist expanded racks state across app re-renders (Collapsed by default on login)
  static expandedRackIds = new Set();
  // Static set to persist expanded shelves state across app re-renders (Collapsed by default on login)
  static expandedShelfKeys = new Set();

  static render(options) {
    const {
      racks,
      boxes,
      components,
      selectedRackId,
      selectedShelfId,
      selectedBoxId,
      highlightedBoxIds = [],
      onShelfClick,
      onBoxClick
    } = options;

    const container = document.getElementById("racks-container");
    if (!container) return;

    container.innerHTML = "";

    const activeRacks = (Array.isArray(racks) && racks.length > 0) ? racks : INITIAL_RACKS;
    const activeBoxes = (Array.isArray(boxes)) ? boxes : INITIAL_BOXES;
    const activeComps = (Array.isArray(components)) ? components : INITIAL_COMPONENTS;

    // Ensure selectedRackId is expanded if specified
    if (selectedRackId && !this.expandedRackIds.has(Number(selectedRackId))) {
      this.expandedRackIds.add(Number(selectedRackId));
    }

    // Ensure selectedShelfId is expanded if specified
    if (selectedRackId && selectedShelfId) {
      this.expandedShelfKeys.add(`${selectedRackId}_${selectedShelfId}`);
    }

    // Ensure racks containing highlighted boxes (from search) are expanded
    if (highlightedBoxIds && highlightedBoxIds.length > 0) {
      activeBoxes.filter(b => highlightedBoxIds.includes(b.id)).forEach(b => {
        if (b.rackId) {
          this.expandedRackIds.add(Number(b.rackId));
          if (b.shelfId) this.expandedShelfKeys.add(`${b.rackId}_${b.shelfId}`);
        }
      });
      activeComps.filter(c => highlightedBoxIds.includes(c.boxId)).forEach(c => {
        if (c.rackId) {
          this.expandedRackIds.add(Number(c.rackId));
          if (c.shelfId) this.expandedShelfKeys.add(`${c.rackId}_${c.shelfId}`);
        }
      });
    }

    const racksGrid = document.createElement("div");
    racksGrid.className = "racks-wrapper racks-table-grid";

    activeRacks.forEach(rack => {
      const rackIdNum = Number(rack.id);
      const isExpanded = this.expandedRackIds.has(rackIdNum);
      const isRackActive = Number(selectedRackId) === rackIdNum;

      const rackCard = document.createElement("div");
      rackCard.className = `rack-card vertical-cabinet-frame nested-rack-accordion ${isExpanded ? 'is-expanded' : 'is-collapsed'}`;
      rackCard.setAttribute("data-rack-id", rack.id);

      const roomLabel = rack.id === 1 ? "Room 101 Prototyping" : (rack.id === 2 ? "Room 102 Storage Bay" : `Room ${100 + rack.id}`);
      const shelfLabels = [
        "Shelf A (Top Shelf)",
        "Shelf B (Upper Shelf)",
        "Shelf C (Middle Shelf)",
        "Shelf D (Lower Middle)",
        "Shelf E (Bottom Shelf)"
      ];

      let shelvesHtml = "";
      for (let shelfNum = 1; shelfNum <= (rack.shelvesCount || 5); shelfNum++) {
        const shelfKey = `${rack.id}_${shelfNum}`;
        const isShelfExpanded = this.expandedShelfKeys.has(shelfKey);
        const isShelfSelected = Number(selectedRackId) === rackIdNum && Number(selectedShelfId) === shelfNum;
        
        // Dynamic Rack Box Synthesis: Include boxes for this rack & shelf and any box with components
        const shelfComponents = activeComps.filter(c => Number(c.rackId) === rackIdNum && Number(c.shelfId) === shelfNum);

        const shelfBoxesMap = new Map();
        activeBoxes.filter(b => Number(b.rackId) === rackIdNum && Number(b.shelfId) === shelfNum).forEach(b => {
          shelfBoxesMap.set(b.id, b);
        });

        shelfComponents.forEach(c => {
          const bId = c.boxId || "Unassigned Box";
          if (!shelfBoxesMap.has(bId)) {
            shelfBoxesMap.set(bId, {
              id: bId,
              rackId: rack.id,
              shelfId: shelfNum,
              label: `${bId}: Storage Footprint`
            });
          }
        });

        const shelfBoxes = Array.from(shelfBoxesMap.values());

        let boxesPillsHtml = "";
        shelfBoxes.forEach(box => {
          const isBoxSelected = selectedBoxId === box.id;
          const isHighlighted = highlightedBoxIds.includes(box.id);
          const boxComponents = activeComps.filter(c => c.boxId === box.id && Number(c.rackId) === rackIdNum && Number(c.shelfId) === shelfNum);

          const compNames = boxComponents.map(c => c.name).join(" + ");

          let pillClass = "box-pill";
          if (isBoxSelected) pillClass += " selected";
          if (isHighlighted) pillClass += " search-highlight";

          const itemsListHtml = boxComponents.length > 0
            ? boxComponents.map(c => `<div style="font-size:0.75rem; color:var(--text-main); font-weight:600; display:flex; align-items:center; gap:4px;">&bull; ${c.name}</div>`).join('')
            : `<div style="font-size:0.7rem; color:var(--text-muted); font-style:italic;">Empty Box</div>`;

          boxesPillsHtml += `
            <div class="${pillClass}" data-box-id="${box.id}" data-rack-id="${rack.id}" data-shelf-id="${shelfNum}" title="${box.id}: ${compNames || 'Empty Box'}" style="cursor:pointer; display:inline-flex; flex-direction:column; background:var(--bg-dark); border:1px solid var(--border-color); padding:8px 12px; border-radius:8px; gap:4px; min-width:140px; margin-right:8px; margin-bottom:8px; transition:all 0.2s;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:4px; margin-bottom:2px;">
                <span style="font-weight:800; color:var(--primary); font-size:0.8rem;">📦 ${box.id}</span>
                <span style="background:rgba(56,189,248,0.15); color:var(--primary); padding:1px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">${boxComponents.length} ${boxComponents.length === 1 ? 'Item' : 'Items'}</span>
              </div>
              <div style="display:flex; flex-direction:column; gap:3px;">
                ${itemsListHtml}
              </div>
            </div>
          `;
        });

        const shelfLetter = String.fromCharCode(64 + shelfNum);
        const shelfNameLabel = `Shelf ${shelfLetter}`;
        const totalItemsInShelf = activeComps.filter(c => Number(c.rackId) === rackIdNum && Number(c.shelfId) === shelfNum).length;

        shelvesHtml += `
          <div class="shelf-row nested-shelf-accordion ${isShelfExpanded ? 'is-expanded' : 'is-collapsed'} ${isShelfSelected ? 'selected' : ''}" data-rack-id="${rack.id}" data-shelf-id="${shelfNum}" data-shelf-key="${shelfKey}">
            <div class="shelf-header shelf-accordion-trigger" style="cursor:pointer; user-select:none;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="shelf-chevron" style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:4px; background:rgba(56,189,248,0.12); color:var(--primary); font-size:0.75rem; transition:transform 0.2s ease; transform:${isShelfExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'};">
                  <i data-lucide="${isShelfExpanded ? 'chevron-down' : 'chevron-right'}"></i>
                </span>
                <span class="shelf-letter font-bold" style="font-size:0.85rem; color:var(--text-main);">🏢 ${shelfNameLabel}</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="shelf-count text-muted" style="font-size:0.7rem;">${shelfBoxes.length} Boxes &bull; ${totalItemsInShelf} Items</span>
                <button class="btn btn-secondary btn-sm btn-print-shelf-qr" data-rack="${rack.id}" data-shelf="${shelfNum}" style="padding:2px 8px; font-size:0.7rem;" title="Print QR Labels for all components on ${shelfNameLabel}">
                  <i data-lucide="printer"></i> 🖨️ Print Shelf QR
                </button>
                ${isShelfSelected ? '<span class="active-dot" title="Active Selected Shelf"></span>' : ''}
              </div>
            </div>
            <div class="boxes-grid shelf-accordion-content" style="display:${isShelfExpanded ? 'flex' : 'none'}; flex-wrap:wrap; margin-top:8px;">
              ${boxesPillsHtml || '<span class="text-muted" style="font-size:0.75rem; font-style:italic; padding:4px 0;">No active components on this shelf.</span>'}
            </div>
          </div>
        `;
      }

      const totalRackItems = activeComps.filter(c => Number(c.rackId) === rackIdNum).length;

      rackCard.innerHTML = `
        <div class="rack-cabinet-header rack-accordion-trigger" title="Click to ${isExpanded ? 'collapse' : 'expand'} ${rack.name}" style="cursor:pointer; user-select:none; ${isExpanded ? 'padding-bottom:12px; margin-bottom:14px; border-bottom:2px solid var(--border-color);' : 'padding-bottom:0; margin-bottom:0; border-bottom:none;'}">
          <div class="rack-cabinet-title" style="display:flex; align-items:center; gap:10px;">
            <span class="accordion-chevron" style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:6px; background:rgba(56,189,248,0.12); color:var(--primary); font-size:0.9rem; transition:transform 0.25s ease; transform:${isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'};">
              <i data-lucide="${isExpanded ? 'chevron-down' : 'chevron-right'}"></i>
            </span>
            <div>
              <span style="font-size:1rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:8px;">
                🗄️ ${rack.name.toUpperCase()}
                ${isRackActive ? '<span class="active-dot" title="Active Selected Rack"></span>' : ''}
              </span>
              <small class="text-muted" style="font-size:0.75rem; display:block;">📍 ${roomLabel}</small>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="layout-badge" style="background:var(--primary); color:#0f172a; font-weight:700;">${totalRackItems} Items</span>
            <span class="layout-badge">${rack.shelvesCount || 5} Shelves</span>
            <span class="expand-status-badge" style="font-size:0.7rem; color:var(--primary); background:rgba(56,189,248,0.1); padding:2px 8px; border-radius:4px; border:1px solid rgba(56,189,248,0.25);">
              ${isExpanded ? 'Expanded' : 'Click to Expand'}
            </span>
          </div>
        </div>
        
        <div class="vertical-shelves-stack rack-accordion-content" style="display:${isExpanded ? 'flex' : 'none'}; flex-direction:column; gap:12px;">
          ${shelvesHtml}
        </div>
      `;

      // Event listener for nested rack accordion expand/collapse toggle
      const headerTrigger = rackCard.querySelector(".rack-accordion-trigger");
      headerTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const currentlyExpanded = RackViewer.expandedRackIds.has(rackIdNum);
        const contentEl = rackCard.querySelector(".rack-accordion-content");
        const chevronEl = rackCard.querySelector(".accordion-chevron");
        const statusBadge = rackCard.querySelector(".expand-status-badge");

        if (currentlyExpanded) {
          RackViewer.expandedRackIds.delete(rackIdNum);
          rackCard.classList.remove("is-expanded");
          rackCard.classList.add("is-collapsed");
          contentEl.style.display = "none";
          headerTrigger.style.borderBottom = "none";
          headerTrigger.style.marginBottom = "0";
          headerTrigger.style.paddingBottom = "0";
          if (chevronEl) {
            chevronEl.style.transform = "rotate(-90deg)";
            chevronEl.innerHTML = `<i data-lucide="chevron-right"></i>`;
          }
          if (statusBadge) statusBadge.innerText = "Click to Expand";
        } else {
          RackViewer.expandedRackIds.add(rackIdNum);
          rackCard.classList.remove("is-collapsed");
          rackCard.classList.add("is-expanded");
          contentEl.style.display = "flex";
          headerTrigger.style.borderBottom = "2px solid var(--border-color)";
          headerTrigger.style.marginBottom = "14px";
          headerTrigger.style.paddingBottom = "12px";
          if (chevronEl) {
            chevronEl.style.transform = "rotate(0deg)";
            chevronEl.innerHTML = `<i data-lucide="chevron-down"></i>`;
          }
          if (statusBadge) statusBadge.innerText = "Expanded";

          // When expanding a rack, collapse all shelves inside it so only shelf headers are shown
          for (let s = 1; s <= 5; s++) {
            RackViewer.expandedShelfKeys.delete(`${rackIdNum}_${s}`);
          }
          rackCard.querySelectorAll(".shelf-row").forEach(shelfEl => {
            shelfEl.classList.remove("is-expanded");
            shelfEl.classList.add("is-collapsed");
            const shelfContent = shelfEl.querySelector(".shelf-accordion-content");
            const shelfChevron = shelfEl.querySelector(".shelf-chevron");
            if (shelfContent) shelfContent.style.display = "none";
            if (shelfChevron) {
              shelfChevron.style.transform = "rotate(-90deg)";
              shelfChevron.innerHTML = `<i data-lucide="chevron-right"></i>`;
            }
          });
          if (onShelfClick) {
            onShelfClick(rackIdNum, null);
          }
        }
        if (window.lucide) window.lucide.createIcons();
      });

      // Event Listeners for Shelves & Boxes inside the rack
      rackCard.querySelectorAll(".btn-print-shelf-qr").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const rId = Number(btn.getAttribute("data-rack"));
          const sId = Number(btn.getAttribute("data-shelf"));
          if (window.ModalManager && window.ModalManager.printBatchShelfComponentQrSheet) {
            window.ModalManager.printBatchShelfComponentQrSheet(rId, sId);
          }
        });
      });

      rackCard.querySelectorAll(".shelf-row").forEach(shelfEl => {
        const rId = Number(shelfEl.getAttribute("data-rack-id"));
        const sId = Number(shelfEl.getAttribute("data-shelf-id"));
        const sKey = shelfEl.getAttribute("data-shelf-key");
        const triggerEl = shelfEl.querySelector(".shelf-accordion-trigger");

        if (triggerEl) {
          triggerEl.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.closest(".btn-print-shelf-qr")) return;

            const contentEl = shelfEl.querySelector(".shelf-accordion-content");
            const chevronEl = shelfEl.querySelector(".shelf-chevron");
            const isCurrentlyExpanded = shelfEl.classList.contains("is-expanded") || RackViewer.expandedShelfKeys.has(sKey);

            if (isCurrentlyExpanded) {
              // Collapse Shelf
              RackViewer.expandedShelfKeys.delete(sKey);
              shelfEl.classList.remove("is-expanded");
              shelfEl.classList.add("is-collapsed");
              if (contentEl) contentEl.style.display = "none";
              if (chevronEl) {
                chevronEl.style.transform = "rotate(-90deg)";
                chevronEl.innerHTML = `<i data-lucide="chevron-right"></i>`;
              }
            } else {
              // Expand Shelf
              RackViewer.expandedShelfKeys.add(sKey);
              shelfEl.classList.remove("is-collapsed");
              shelfEl.classList.add("is-expanded");
              if (contentEl) contentEl.style.display = "flex";
              if (chevronEl) {
                chevronEl.style.transform = "rotate(0deg)";
                chevronEl.innerHTML = `<i data-lucide="chevron-down"></i>`;
              }
            }
            if (window.lucide) window.lucide.createIcons();
          });
        }
      });

      rackCard.querySelectorAll(".box-pill").forEach(boxEl => {
        boxEl.addEventListener("click", (e) => {
          e.stopPropagation();
          const bId = boxEl.getAttribute("data-box-id");
          const rId = Number(boxEl.getAttribute("data-rack-id"));
          const sId = Number(boxEl.getAttribute("data-shelf-id"));
          if (onBoxClick) onBoxClick(bId, rId, sId);
        });
      });

      racksGrid.appendChild(rackCard);
    });

    container.appendChild(racksGrid);

    if (window.lucide) window.lucide.createIcons();
  }
}


