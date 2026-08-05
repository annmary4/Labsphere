/**
 * LabSphere Components View Renderer (With Multi-Criteria Search Data & PDF Datasheets)
 */

class ComponentsView {
  static render(options) {
    const { components, viewMode, onComponentClick } = options;

    const gridContainer = document.getElementById("components-grid");
    const tableContainer = document.getElementById("components-table-container");
    const emptyState = document.getElementById("empty-state");
    const resultsBadge = document.getElementById("results-count-badge");

    if (resultsBadge) {
      resultsBadge.innerText = `${components.length} item${components.length === 1 ? '' : 's'}`;
    }

    if (components.length === 0) {
      if (gridContainer) gridContainer.innerHTML = "";
      if (tableContainer) tableContainer.classList.add("hidden");
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    if (viewMode === "table") {
      if (gridContainer) gridContainer.classList.add("hidden");
      if (tableContainer) {
        tableContainer.classList.remove("hidden");
        this.renderTable(components, onComponentClick);
      }
    } else {
      if (tableContainer) tableContainer.classList.add("hidden");
      if (gridContainer) {
        gridContainer.classList.remove("hidden");
        this.renderGrid(components, onComponentClick);
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  static cleanImageUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== "string") return "";
    let url = rawUrl.trim();
    if (!url) return "";

    // Extract real image URL from Google Images redirect / imgres URLs
    if (url.includes("imgurl=")) {
      try {
        const match = url.match(/imgurl=([^&]+)/);
        if (match && match[1]) {
          url = decodeURIComponent(match[1]);
        }
      } catch (e) { }
    }

    return url;
  }

  static getAccurateImageForComponent(arg1, arg2, arg3) {
    let name = "";
    let category = "";
    let defaultUrl = "";
    let customImage = false;

    if (typeof arg1 === "object" && arg1 !== null) {
      name = arg1.name || "";
      category = arg1.category || "";
      defaultUrl = this.cleanImageUrl(arg1.imageUrl);
      customImage = arg1.customImage || false;
    } else {
      name = arg1 || "";
      category = arg2 || "";
      defaultUrl = this.cleanImageUrl(arg3);
    }

    if (customImage && defaultUrl) {
      return defaultUrl;
    }

    if (defaultUrl && (defaultUrl.startsWith("data:image/") || !defaultUrl.includes("images.unsplash.com"))) {
      return defaultUrl;
    }

    const n = name.toLowerCase();
    const c = category.toLowerCase();

    // 1. Microcontrollers & Development Boards
    if (n.includes("arduino nano")) return "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500&auto=format&fit=crop&q=80";
    if (n.includes("arduino uno")) return "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=500&auto=format&fit=crop&q=80";
    if (n.includes("arduino r4") || n.includes("mega 2560") || n.includes("arduino micro") || n.includes("pro mini")) return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80";
    if (n.includes("esp32")) return "https://images.unsplash.com/photo-1517420784982-f542d2003c20?w=500&auto=format&fit=crop&q=80";
    if (n.includes("esp8266") || n.includes("nodemcu") || n.includes("esp cam")) return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80";
    if (n.includes("pico")) return "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&auto=format&fit=crop&q=80";
    if (n.includes("raspberry pi")) return "https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?w=500&auto=format&fit=crop&q=80";
    if (n.includes("jetson")) return "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=80";
    if (n.includes("stm32") || n.includes("st-link") || n.includes("serial converter") || n.includes("cp2102")) return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80";
    if (n.includes("teensy")) return "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&auto=format&fit=crop&q=80";

    // 2. Wireless, Comms & Network
    if (n.includes("bluetooth") || n.includes("hc-05") || n.includes("hc-06") || n.includes("nrf24") || n.includes("lora") || n.includes("gsm") || n.includes("sim800") || n.includes("gps") || c.includes("wireless") || c.includes("comms")) return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80";

    // 3. Motors, Actuators & Motor Drivers
    if (n.includes("l298n") || n.includes("l293d") || n.includes("a4988") || n.includes("drv8825") || n.includes("motor driver") || n.includes("stepper") || n.includes("servo") || n.includes("sg90") || n.includes("mg995") || n.includes("dc motor") || n.includes("solenoid") || c.includes("actuators") || c.includes("motor")) return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80";

    // 4. Sensors & Sensing Modules
    if (n.includes("ultrasonic") || n.includes("hc-sr04") || n.includes("pir") || n.includes("dht11") || n.includes("dht22") || n.includes("bme280") || n.includes("ds18b20") || n.includes("mpu6050") || n.includes("gas") || n.includes("mq-") || n.includes("rfid") || n.includes("ldr") || n.includes("light") || n.includes("sound") || n.includes("current") || n.includes("voltage") || n.includes("pulse") || n.includes("moisture") || n.includes("sensor") || c.includes("sensor")) return "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80";

    // 5. Optoelectronics, Displays & Traffic Lights
    if (n.includes("oled") || n.includes("lcd") || n.includes("tft") || n.includes("display") || n.includes("7-segment") || n.includes("traffic light") || n.includes("led") || n.includes("matrix") || n.includes("neopixel") || c.includes("display") || c.includes("optoelectronics")) return "https://images.unsplash.com/photo-1517420784982-f542d2003c20?w=500&auto=format&fit=crop&q=80";

    // 6. Batteries, Power Supplies & Regulators
    if (n.includes("battery") || n.includes("lipo") || n.includes("18650") || n.includes("power") || n.includes("regulator") || n.includes("lm2596") || n.includes("xl6009") || n.includes("mt3608") || n.includes("tp4056") || n.includes("7805") || n.includes("ams1117") || n.includes("buck") || n.includes("boost") || n.includes("adapter") || n.includes("solar") || c.includes("power")) return "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=500&auto=format&fit=crop&q=80";

    // 7. Relays, Switches & Controls
    if (n.includes("relay") || n.includes("switch") || n.includes("button") || n.includes("tactile") || c.includes("switch")) return "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&auto=format&fit=crop&q=80";

    // 8. ICs, Timers & Semiconductors
    if (n.includes("ic ") || n.includes("timer") || n.includes("555") || n.includes("74hc") || n.includes("lm358") || n.includes("op-amp") || n.includes("transistor") || n.includes("mosfet") || n.includes("irfz44n") || n.includes("bc547") || n.includes("gate") || c.includes("integrated circuit") || c.includes("semiconductor")) return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80";

    // 9. Passive Components (Resistors, Capacitors, Diodes)
    if (n.includes("resistor") || n.includes("capacitor") || n.includes("diode") || n.includes("1n4007") || n.includes("zener") || n.includes("inductor") || n.includes("potentiometer") || c.includes("passive")) return "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=500&auto=format&fit=crop&q=80";

    // 10. Breadboards, Cabling, Hardware & Tools
    if (n.includes("breadboard") || n.includes("wire") || n.includes("cable") || n.includes("jumper") || n.includes("connector") || n.includes("header") || n.includes("barrel jack") || n.includes("screw terminal") || n.includes("tool") || n.includes("soldering") || n.includes("multimeter") || c.includes("connector") || c.includes("hardware") || c.includes("cabling")) return "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&auto=format&fit=crop&q=80";

    if (defaultUrl) return defaultUrl;

    return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80";
  }

  static renderGrid(components, onComponentClick) {
    const container = document.getElementById("components-grid");
    if (!container) return;

    container.innerHTML = "";

    components.forEach(c => {
      const card = document.createElement("div");
      card.className = "component-card";
      card.setAttribute("data-comp-id", c.id);
      card.style.cursor = "pointer";
      card.title = `Click to view or edit details for ${c.name}`;

      let stockTagClass = "IN_STOCK";
      let stockLabel = "In Stock";
      if (c.quantity === 0) {
        stockTagClass = "OUT_OF_STOCK";
        stockLabel = "Out of Stock";
      } else if (c.quantity <= c.minQuantity) {
        stockTagClass = "LOW_STOCK";
        stockLabel = "Low Stock";
      }

      const imgSrc = this.getAccurateImageForComponent(c);
      const manufacturer = c.manufacturer || "Lab Component Vendor";
      const siblingComps = components.filter(x => x.boxId === c.boxId);
      const boxBadgeText = siblingComps.length > 1 ? `${c.boxId} (${siblingComps.length} items)` : c.boxId;
      const siblingsText = siblingComps.length > 1 ? `<div style="font-size:0.7rem; color:var(--primary); font-weight:700; margin-top:2px;">📦 Multi-Item Box (${c.boxId}): ${siblingComps.map(x => x.name).join(" + ")}</div>` : '';

      card.innerHTML = `
        <div class="card-image-wrap" style="width:100%; height:120px; border-radius:8px; overflow:hidden; margin-bottom:10px; background:#0f172a; position:relative;">
          <img src="${imgSrc}" alt="${c.name}" referrerpolicy="no-referrer" loading="lazy" style="width:100%; height:100%; object-fit:contain; background:#0f172a; padding:6px;" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'" />
          ${c.datasheetUrl ? `<a href="${c.datasheetUrl}" target="_blank" onclick="event.stopPropagation();" title="View PDF Datasheet" style="position:absolute; top:8px; right:8px; background:rgba(15,23,42,0.85); color:var(--primary); padding:4px 8px; border-radius:4px; font-size:0.7rem; font-weight:700; text-decoration:none; display:flex; align-items:center; gap:4px; border:1px solid var(--border-color);"><i data-lucide="file-text"></i> PDF</a>` : ''}
          <button class="btn-edit-image" data-id="${c.id}" title="Change component image" onclick="event.stopPropagation();" style="position:absolute; bottom:6px; right:6px; background:rgba(15,23,42,0.85); color:#38bdf8; border:1px solid #38bdf8; border-radius:6px; padding:3px 8px; font-size:0.7rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px; opacity:0; transition:opacity 0.2s;">
            <i data-lucide="camera"></i> Edit Image
          </button>
        </div>

        <div class="card-top">
          <div class="card-title-group">
            <h3>${c.name}</h3>
            <span class="card-part-no">PN: ${c.partNumber || 'N/A'} &bull; <small style="color:var(--primary);">${manufacturer}</small></span>
          </div>
          <span class="card-box-badge">${boxBadgeText}</span>
        </div>

        <p class="card-desc">${c.purpose || 'No purpose description available.'}</p>
        ${siblingsText}

        <div class="card-meta-tags" style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
          📍 Rack ${c.rackId} &rsaquo; Shelf ${String.fromCharCode(64 + Number(c.shelfId))} ${c.subLocation || c.stackLayer ? `&rsaquo; ${c.subLocation || c.stackLayer}` : ''}
        </div>

        <div class="card-footer" style="display:flex; align-items:center; justify-content:space-between; gap:6px; flex-wrap:wrap; margin-top:10px;">
          <span class="stock-tag ${stockTagClass}">${stockLabel}</span>
          <span class="card-qty">${c.quantity} <small>${c.unit || 'pcs'}</small></span>
          
          <button class="btn btn-primary btn-sm btn-edit-direct" data-id="${c.id}" onclick="event.stopPropagation(); window.openComponentEditDialog('${c.id}');" title="Edit details, quantity, rate, and box location for ${c.name}" style="padding:6px 14px; font-size:0.8rem; font-weight:800; background:#0ea5e9; color:white; border:none; border-radius:6px; cursor:pointer; box-shadow:0 2px 8px rgba(14,165,233,0.5);">
            ✏️ Edit Details
          </button>
          <button class="btn btn-secondary btn-sm btn-inspect-direct" data-id="${c.id}" onclick="event.stopPropagation(); window.openViewModal('${c.id}');" title="View info for ${c.name}" style="padding:4px 8px; font-size:0.7rem; cursor:pointer;">
            👁️ View Info
          </button>
          <button class="btn btn-secondary btn-sm btn-print-qr-direct" data-id="${c.id}" onclick="event.stopPropagation(); if (window.ModalManager && window.ModalManager.printBoxQrCode) window.ModalManager.printBoxQrCode('${c.boxId}');" title="Print Box QR Code Label for ${c.boxId}" style="padding:4px 8px; font-size:0.7rem; cursor:pointer;">
            <i data-lucide="printer"></i> Box QR
          </button>
        </div>
      `;

      // Show/hide edit image button on hover
      const imgWrap = card.querySelector('.card-image-wrap');
      const editImgBtn = card.querySelector('.btn-edit-image');
      imgWrap.addEventListener('mouseenter', () => { editImgBtn.style.opacity = '1'; });
      imgWrap.addEventListener('mouseleave', () => { editImgBtn.style.opacity = '0'; });

      // Image edit button handler
      editImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.img-edit-popover').forEach(p => p.remove());

        const popover = document.createElement('div');
        popover.className = 'img-edit-popover';
        popover.style.cssText = `
          position:fixed; z-index:99999;
          background:#0f172a; border:2px solid #38bdf8; border-radius:10px;
          padding:14px 16px; width:340px;
          box-shadow:0 20px 60px rgba(0,0,0,0.8);
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        `;
        popover.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="color:#38bdf8; font-weight:800; font-size:0.85rem;">📷 Set Image for <em style="color:white;">${c.name}</em></span>
            <button id="close-img-popover" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:1.2rem; line-height:1;">&times;</button>
          </div>
          
          <div style="margin-bottom:10px;">
            <label style="font-size:0.75rem; color:#94a3b8; font-weight:700; display:block; margin-bottom:4px;">1. Upload Image from Computer:</label>
            <input id="img-file-input-${c.id}" type="file" accept="image/*" style="display:none;" />
            <button id="img-file-btn-${c.id}" style="width:100%; padding:8px; background:#1e293b; color:#38bdf8; border:1px dashed #38bdf8; border-radius:6px; font-weight:700; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; justify-content:center; gap:6px;">
              📁 Choose File from PC...
            </button>
          </div>

          <div style="margin-bottom:10px;">
            <label style="font-size:0.75rem; color:#94a3b8; font-weight:700; display:block; margin-bottom:4px;">2. Or Paste Image URL:</label>
            <input id="img-url-input-${c.id}" type="url" placeholder="Paste image URL (https://...)" value="${c.imageUrl && !c.imageUrl.includes('unsplash.com') ? c.imageUrl : ''}"
              style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #334155; background:#1e293b; color:white; font-size:0.82rem; box-sizing:border-box; outline:none;" />
          </div>

          <div style="margin-top:10px; display:flex; gap:6px;">
            <button id="save-img-btn-${c.id}" style="flex:1; padding:8px; background:#0ea5e9; color:white; border:none; border-radius:6px; font-weight:700; cursor:pointer; font-size:0.82rem;">✔ Save Image</button>
            <button id="clear-img-btn-${c.id}" style="padding:8px 12px; background:#334155; color:#94a3b8; border:none; border-radius:6px; cursor:pointer; font-size:0.82rem;" title="Reset to auto-detected image">↺ Reset</button>
          </div>

          <div id="img-preview-${c.id}" style="margin-top:10px; display:none; text-align:center;">
            <span style="font-size:0.7rem; color:#38bdf8; display:block; margin-bottom:4px;">Preview:</span>
            <img id="img-preview-img-${c.id}" style="width:100%; max-height:100px; object-fit:contain; border-radius:6px; background:#1e293b; border:1px solid #334155;" />
          </div>
        `;

        const rect = editImgBtn.getBoundingClientRect();
        popover.style.top = (rect.bottom + 6) + 'px';
        popover.style.left = Math.max(8, rect.left - 160) + 'px';
        document.body.appendChild(popover);

        const urlInput = popover.querySelector(`#img-url-input-${c.id}`);
        const fileInput = popover.querySelector(`#img-file-input-${c.id}`);
        const fileBtn = popover.querySelector(`#img-file-btn-${c.id}`);
        let selectedImageDataUrl = null;

        // Trigger file input
        fileBtn.addEventListener('click', () => fileInput.click());

        // File selection handler
        fileInput.addEventListener('change', (ev) => {
          const file = ev.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              selectedImageDataUrl = e.target.result;
              urlInput.value = "";
              fileBtn.innerHTML = `✅ Selected: ${file.name.slice(0, 20)}...`;
              fileBtn.style.borderColor = '#10b981';
              fileBtn.style.color = '#10b981';

              const prevDiv = popover.querySelector(`#img-preview-${c.id}`);
              const prevImg = popover.querySelector(`#img-preview-img-${c.id}`);
              prevImg.src = selectedImageDataUrl;
              prevDiv.style.display = 'block';
            };
            reader.readAsDataURL(file);
          }
        });

        // URL input handler
        urlInput.addEventListener('input', () => {
          selectedImageDataUrl = null;
          fileBtn.innerHTML = `📁 Choose File from PC...`;
          fileBtn.style.borderColor = '#38bdf8';
          fileBtn.style.color = '#38bdf8';

          const val = ComponentsView.cleanImageUrl(urlInput.value);
          const prevDiv = popover.querySelector(`#img-preview-${c.id}`);
          const prevImg = popover.querySelector(`#img-preview-img-${c.id}`);
          if (val.startsWith('http') || val.startsWith('data:')) {
            prevImg.src = val;
            prevDiv.style.display = 'block';
          } else {
            prevDiv.style.display = 'none';
          }
        });

        // Save button
        popover.querySelector(`#save-img-btn-${c.id}`).addEventListener('click', () => {
          let finalUrl = selectedImageDataUrl || ComponentsView.cleanImageUrl(urlInput.value);
          if (!finalUrl) { alert('Please choose an image file or enter a valid URL.'); return; }
          const comps = StorageService.getComponents();
          const target = comps.find(x => x.id === c.id);
          if (target) {
            target.imageUrl = finalUrl;
            target.customImage = true;
            target.lastUpdated = new Date().toISOString().slice(0, 10);
            StorageService.saveComponents(comps);
          }
          popover.remove();
          if (window.app && window.app.refreshApp) window.app.refreshApp();
        });

        // Reset to auto
        popover.querySelector(`#clear-img-btn-${c.id}`).addEventListener('click', () => {
          const comps = StorageService.getComponents();
          const target = comps.find(x => x.id === c.id);
          if (target) {
            target.imageUrl = '';
            target.customImage = false;
            StorageService.saveComponents(comps);
          }
          popover.remove();
          if (window.app && window.app.refreshApp) window.app.refreshApp();
        });

        popover.querySelector('#close-img-popover').addEventListener('click', () => popover.remove());
        setTimeout(() => {
          document.addEventListener('click', function closePop(ev) {
            if (!popover.contains(ev.target)) {
              popover.remove();
              document.removeEventListener('click', closePop);
            }
          });
        }, 100);
      });

      // Direct Edit Details Button -> Opens Standalone Edit Form!
      const editBtn = card.querySelector('.btn-edit-direct');
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.openComponentEditDialog) {
            window.openComponentEditDialog(c.id);
          }
        });
      }

      // Direct View Info Button -> Opens Read-only view
      const inspBtn = card.querySelector('.btn-inspect-direct');
      if (inspBtn) {
        inspBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.ModalManager && window.ModalManager.openComponentInspector) {
            window.ModalManager.openComponentInspector(c, false);
          }
        });
      }

      card.querySelector(".btn-print-qr-direct").addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.ModalManager && window.ModalManager.printBoxQrCode) {
          window.ModalManager.printBoxQrCode(c.boxId);
        }
      });

      card.addEventListener("click", () => {
        if (window.openComponentEditDialog) {
          window.openComponentEditDialog(c.id);
        } else if (onComponentClick) {
          onComponentClick(c);
        }
      });

      container.appendChild(card);
    });
  }


  static renderTable(components, onComponentClick) {
    const tbody = document.getElementById("components-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    components.forEach(c => {
      const tr = document.createElement("tr");

      let stockTagClass = "IN_STOCK";
      let stockLabel = "In Stock";
      if (c.quantity === 0) {
        stockTagClass = "OUT_OF_STOCK";
        stockLabel = "Out of Stock";
      } else if (c.quantity <= c.minQuantity) {
        stockTagClass = "LOW_STOCK";
        stockLabel = "Low Stock";
      }

      const imgSrc = c.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80";
      const manufacturer = c.manufacturer || "Lab Vendor";

      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${imgSrc}" style="width:36px; height:36px; border-radius:6px; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'">
            <div>
              <strong>${c.name}</strong><br>
              <span class="text-muted" style="font-size:0.75rem;">🏭 ${manufacturer} &bull; 🏷️ ${c.barcode || c.id}</span>
            </div>
          </div>
        </td>
        <td class="mono">${c.partNumber || 'N/A'}</td>
        <td class="mono">Rack ${c.rackId} &rsaquo; Shelf ${String.fromCharCode(64 + Number(c.shelfId))} &rsaquo; ${c.boxId}</td>
        <td>${c.category}</td>
        <td><span class="stock-tag ${stockTagClass}">${stockLabel}</span></td>
        <td class="mono"><strong>${c.quantity}</strong> ${c.unit || 'pcs'}</td>
        <td>
          <div style="display:flex; gap:6px;">
            ${c.datasheetUrl ? `<a href="${c.datasheetUrl}" target="_blank" class="btn btn-secondary btn-sm" title="View PDF Datasheet"><i data-lucide="file-text"></i> PDF</a>` : ''}
            <button class="btn btn-secondary btn-sm btn-print-table-qr" title="Print Box QR Label for ${c.boxId}">
              <i data-lucide="printer"></i> Box QR
            </button>
            <button class="btn btn-secondary btn-sm btn-delete-table-row" style="border-color:var(--danger); color:var(--danger);" title="Delete ${c.name}">
              <i data-lucide="trash-2"></i> Delete
            </button>
            <button class="btn btn-primary btn-sm btn-inspect-row" style="background:#0ea5e9; color:white; border:none; font-weight:700;">
              ✏️ Edit Details
            </button>
          </div>
        </td>
      `;

      const qrBtn = tr.querySelector(".btn-print-table-qr");
      if (qrBtn) {
        qrBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.ModalManager && window.ModalManager.printBoxQrCode) {
            window.ModalManager.printBoxQrCode(c.boxId);
          }
        });
      }

      const delBtn = tr.querySelector(".btn-delete-table-row");
      if (delBtn) {
        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm(`Are you sure you want to delete '${c.name}' (${c.boxId})?`)) {
            StorageService.setRole("ADMIN");
            StorageService.deleteComponent(c.id);
            alert(`🗑️ Deleted '${c.name}' from inventory.`);
            if (window.App && window.App.refreshApp) window.App.refreshApp();
          }
        });
      }

      tr.querySelector(".btn-inspect-row").addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.openComponentEditDialog) {
          window.openComponentEditDialog(c.id);
        } else if (onComponentClick) {
          onComponentClick(c);
        }
      });

      tbody.appendChild(tr);
    });
  }
}
