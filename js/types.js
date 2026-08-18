/**
 * LabSphere Types & Enterprise Laboratory Workflows Data Models
 */

const USER_ROLES = {
  STUDENT: "Student / Intern (Search, Request & Return)",
  TEAM_LEAD: "Team Lead (Approve Student Requisitions)",
  ENGINEER: "Lab Engineer / Maintainer",
  ADMIN: "Lab Administrator (Fulfill & Issue Stock)",
  MANAGEMENT: "Research Lead (Reports & BOM)"
};

/**
 * @typedef {Object} SupplierInfo
 * @property {string} vendorName
 * @property {string} vendorSku
 * @property {string} vendorUrl
 * @property {number} unitPrice
 * @property {number} leadTimeDays
 */

/**
 * 5 Inventory States: AVAILABLE, RESERVED, BORROWED, DAMAGED, ARCHIVED
 * @typedef {"AVAILABLE" | "RESERVED" | "BORROWED" | "DAMAGED" | "ARCHIVED"} InventoryState
 */

/**
 * @typedef {Object} Component
 * @property {string} id
 * @property {string} name
 * @property {string} partNumber
 * @property {string} manufacturer
 * @property {string} barcode
 * @property {string} imageUrl
 * @property {string} labName
 * @property {string} roomName
 * @property {number} rackId
 * @property {number} shelfId
 * @property {string} boxId
 * @property {string} stackLayer
 * @property {string} category
 * @property {string} purpose
 * @property {string} specifications
 * @property {Array<string>} compatibleComponents
 * @property {Array<string>} alternatives
 * @property {InventoryState} inventoryState - State: AVAILABLE, RESERVED, BORROWED, DAMAGED, ARCHIVED
 * @property {number} quantity
 * @property {string} unit
 * @property {number} minQuantity
 * @property {number} unitPrice
 * @property {Array<string>} tags
 * @property {string} lastUpdated
 * @property {string} [datasheetUrl]
 * @property {string} [pinoutNotes]
 * @property {SupplierInfo} [supplierInfo]
 */

/**
 * @typedef {Object} UserAccount
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} passwordHash
 * @property {string} role
 * @property {string} fullName
 * @property {string} status
 * @property {string} createdAt
 * @property {string} [lastActive]
 */

/**
 * @typedef {Object} AppNotification
 * @property {string} id
 * @property {string} type - PENDING_APPROVAL | LOW_STOCK | RETURNED_ITEM | REQUEST_STATUS | PURCHASE_RECOMMENDATION
 * @property {string} title
 * @property {string} message
 * @property {string} timestamp
 * @property {boolean} read
 */

/**
 * @typedef {Object} ComponentRequest
 * @property {string} id
 * @property {string} componentId
 * @property {string} componentName
 * @property {string} requesterName
 * @property {string} role
 * @property {string} [projectId]
 * @property {string} [projectName]
 * @property {number} qtyRequested
 * @property {number} [qtyApproved] - Approved quantity (may be modified by Team Lead)
 * @property {number} returnedQty - Quantity returned so far (Partial return support)
 * @property {number} [damagedQty] - Quantity reported as damaged
 * @property {string} [dueDate] - Optional return due date
 * @property {string} [condition] - Item Condition: GOOD | FAIR | DAMAGED
 * @property {string} status - PENDING_LEAD_APPROVAL | PENDING_ADMIN_ISSUANCE | LEAD_APPROVED | LEAD_MODIFIED | ISSUED | PARTIALLY_ISSUED | REJECTED | PARTIAL_RETURN | RETURNED | DAMAGED
 * @property {string} requestedAt
 * @property {string} [leadName] - Name of Team Lead who reviewed request
 * @property {string} [leadApprovedAt] - Timestamp of Lead Approval
 * @property {string} [issuedBy] - Name of Inventory Administrator who issued materials
 * @property {string} [issuedAt] - Timestamp of Material Issuance
 * @property {string} [returnedAt]
 * @property {string} [damageReport] - Damage description & report details
 * @property {string} notes
 */

/**
 * @typedef {Object} ProjectWorkspace
 * @property {string} id
 * @property {string} projectName
 * @property {string} leaderName
 * @property {string} description
 * @property {Array<string>} members - Team Members
 * @property {Array<Object>} bom - Bill of Materials items
 * @property {Array<Object>} allocatedInventory - Reserved & Allocated components
 * @property {Array<Object>} consumables - Solder, wires, heatshrink, resistors
 * @property {Array<Object>} reusableAssets - Microcontrollers, test equipment, servos
 * @property {number} estimatedCostRupees - Total project cost estimate in ₹ INR
 * @property {string} createdAt
 */

/**
 * @typedef {Object} TransactionRecord
 * @property {string} id
 * @property {string} componentId
 * @property {string} componentName
 * @property {string} actionType
 * @property {number} qtyChanged
 * @property {number} previousQty
 * @property {number} newQty
 * @property {string} userRole
 * @property {string} timestamp
 * @property {string} notes
 */
