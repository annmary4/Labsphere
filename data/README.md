# LabSphere: Enterprise Laboratory Management & Workflow System

## Overview

**LabSphere** is an enterprise-grade digital laboratory management web application designed to track electronic hardware components, laboratory equipment, physical storage locations, project allocations, and issuance workflows in real time.

---

## Key Features

### 1. Multi-Tiered Physical Inventory Tracking
- **6-Tier Storage Hierarchy**: Organizes items systematically across physical locations (`Room` → `Rack` → `Shelf` → `Drawer` → `Box` → `Bin/Slot`).
- **5 Inventory Lifecycle States**: Tracks component availability and condition (`In-Stock`, `Issued`, `Reserved`, `Under Maintenance`, `Scrapped/Decommissioned`).
- **Rupee Valuation (₹)**: Financial tracking of total inventory value, unit prices, and asset depreciation across labs.

### 2. Request & Issuance Workflows
- **Equipment & Component Requests**: Streamlined checkout workflow for researchers and lab personnel.
- **Partial & Full Returns**: Supports returning partial quantities of issued items with automated stock reconciliation.
- **Approval Queue**: Administrative and managerial review tools for pending checkout requests.

### 3. Project Workspaces
- Group components and assets by specific research or engineering projects.
- Track resource utilization per project and enforce budget/item quotas.

### 4. Search & Filtering
- **Multi-Criteria Search**: Filter components by category, storage tier, status, project assignment, or stock thresholds.
- **Real-Time Notifications**: Automated alerts for low stock levels, pending approvals, and scheduled maintenance.

### 5. Role-Based Access Control (RBAC)
- Built-in session switcher and permission tiers (e.g., `Admin (Full Control)`, `Lab Manager`, `Researcher`).

---

## Technical Architecture

### Frontend
- **HTML5 / CSS3 / JavaScript (ES6+)**: Custom responsive UI built with modern styling guidelines, CSS variables, dark mode styling, and dynamic components.
- **Iconography & Fonts**: Powered by Lucide icons (`lucide-static`) and Google Fonts (`Inter`, `JetBrains Mono`).

### Backend & Data Layer
- **Server ([`server.py`](file:///c:/Users/annma/.gemini/antigravity/scratch/labsphere/server.py))**: Lightweight Python HTTP server implementing REST API endpoints (`/api/network-ip`, `/api/db`) for LAN sync and data persistence.
- **Database ([`data/db.json`](file:///c:/Users/annma/.gemini/antigravity/scratch/labsphere/data/db.json))**: Single-source-of-truth JSON store representing components, locations, user profiles, and active request workflows.

---

## Directory Structure

```
labsphere/
├── index.html                    # Primary SPA entry point
├── server.py                     # Python sync server & REST API
├── css/
│   └── styles.css                # Application styles and design system
├── js/                           # Frontend modules and UI logic
├── data/
│   ├── db.json                   # Main database file
│   └── README.md                 # Project documentation
└── labsphere_backup_v55.json     # Backup state snapshot
```

---

## Getting Started

1. **Start the Local Backend Server**:
   ```bash
   python server.py
   ```
2. **Access the Application**:
   Open `http://localhost:3000` (or your LAN IP address displayed in the console) in any modern web browser.
