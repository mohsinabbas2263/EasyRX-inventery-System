# EazyRX Compliance - Quick Reference Guide

## 🎯 Quick Start

### 1. Check User Permissions

```javascript
import { hasPermission, PERMISSIONS, getUIRestrictions } from '../utils/permissions';

// Single permission check
if (hasPermission(userRole, PERMISSIONS.POS_DISCOUNT)) {
    // Show discount button
}

// Get all restrictions at once
const restrictions = getUIRestrictions(userRole);
// Returns: { canEditPrice, canApplyDiscount, canOverrideBatch, ... }
```

### 2. Display Document State

```javascript
import DocumentStateBadge from '../components/DocumentStateBadge';
import { DOCUMENT_STATES } from '../utils/documentStates';

<DocumentStateBadge state={document.state || DOCUMENT_STATES.DRAFT} />
```

### 3. Confirm Irreversible Actions

```javascript
import ConfirmationModal from '../components/ConfirmationModal';

<ConfirmationModal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    onConfirm={(reason) => handleAction(reason)}
    title="Confirm Action"
    message="This action cannot be undone."
    type="danger"  // 'warning', 'danger', 'info', 'success'
    requiresReason={true}  // For reversals
/>
```

### 4. Handle Batch Selection

```javascript
import { allocateStockFEFO, canManuallySelectBatch } from '../utils/batchManagement';

// Auto-allocate using FEFO
const result = allocateStockFEFO(availableBatches, requestedQuantity);
// Returns: { allocations, fullyAllocated, shortfall }

// Check if user can override
if (!canManuallySelectBatch(userRole)) {
    // Force FEFO, disable manual selection
}
```

### 5. Show Offline Status

```javascript
import { useOfflineSync } from '../context/OfflineSyncContext';
import OfflineIndicator from '../components/OfflineIndicator';

function MyComponent() {
    const { isOnline, addToSyncQueue } = useOfflineSync();
    
    return (
        <div>
            <OfflineIndicator />
            {/* Your component */}
        </div>
    );
}
```

---

## 🔐 Permission Checks

### Common Checks

```javascript
import { 
    canEditPrice,
    canApplyDiscount,
    canOverrideBatch,
    canDispenseControlled,
    canApproveDocuments,
    canPostDocuments,
    canReverseDocuments,
    canDeleteDrafts,
    isManagerOrHigher,
    isReadOnly
} from '../utils/permissions';

// Price editing
if (canEditPrice(userRole)) {
    // Enable price input
}

// Discounts
if (canApplyDiscount(userRole)) {
    // Show discount controls
}

// Batch override
if (canOverrideBatch(userRole)) {
    // Allow manual batch selection
} else {
    // Force FEFO
}

// Document operations
if (canApproveDocuments(userRole)) {
    // Show approve button
}

if (canReverseDocuments(userRole)) {
    // Show reverse button
}
```

### Disable UI Elements

```javascript
const restrictions = getUIRestrictions(userRole);

<input
    type="number"
    disabled={!restrictions.canEditPrice}
    className={!restrictions.canEditPrice ? 'opacity-50 cursor-not-allowed' : ''}
/>

<button
    disabled={!restrictions.canApplyDiscount}
    onClick={handleDiscount}
>
    Apply Discount
</button>
```

---

## 📋 Document States

### State Flow

```
DRAFT → APPROVED → POSTED → SYNCED
                      ↓
                  FAILED → EXCEPTION
                      ↓
                  REVERSED
```

### Check Document Actions

```javascript
import { 
    canEditDocument,
    canDeleteDocument,
    canPostDocument,
    canReverseDocument,
    getAvailableActions
} from '../utils/documentStates';

// Check if can edit
if (canEditDocument(document.state, userRole)) {
    // Show edit button
}

// Check if can delete (only drafts)
if (canDeleteDocument(document.state, userRole, document.createdBy, currentUser)) {
    // Show delete button
}

// Check if can reverse (only posted/synced)
if (canReverseDocument(document.state, userRole)) {
    // Show reverse button instead of delete
}

// Get all available actions
const actions = getAvailableActions(document, userRole, currentUser);
// Returns array of: { type, label, icon, requiresConfirmation, requiresReason }
```

### Create Audit Log

```javascript
import { createAuditLog } from '../utils/documentStates';

const auditEntry = createAuditLog(
    documentId,
    'sale',  // documentType
    'reverse',  // action
    currentUser,
    'Customer returned items',  // reason
    { originalAmount: 1500, reversedAmount: 1500 }  // metadata
);
```

---

## 🏷️ Batch Management

### Check Batch Status

```javascript
import { 
    calculateBatchStatus,
    isBatchExpired,
    isBatchNearExpiry,
    canSellBatch,
    BATCH_STATUS
} from '../utils/batchManagement';

// Get status
const status = calculateBatchStatus(batch.expiryDate);
// Returns: 'good', 'near_expiry', 'expired', 'blocked'

// Quick checks
if (isBatchExpired(batch.expiryDate)) {
    // Block from sale
}

if (isBatchNearExpiry(batch.expiryDate)) {
    // Show warning
}

// Validate for sale
if (canSellBatch(batch)) {
    // Allow selection
}
```

### FEFO Allocation

```javascript
import { allocateStockFEFO, sortBatchesByFEFO } from '../utils/batchManagement';

// Auto-allocate
const result = allocateStockFEFO(batches, 100);

if (result.fullyAllocated) {
    // All quantity allocated
    result.allocations.forEach(allocation => {
        console.log(`Batch: ${allocation.batchNo}, Qty: ${allocation.quantity}`);
    });
} else {
    // Shortfall
    console.log(`Short by: ${result.shortfall} units`);
}

// Manual sort
const sortedBatches = sortBatchesByFEFO(batches);
```

### Validate Batch

```javascript
import { validateBatchForSale } from '../utils/batchManagement';

const validation = validateBatchForSale(batch, userRole);

if (!validation.isValid) {
    // Show errors
    validation.errors.forEach(error => console.error(error));
}

if (validation.warnings.length > 0) {
    // Show warnings
    validation.warnings.forEach(warning => console.warn(warning));
}
```

### Display Expiry Info

```javascript
import { 
    formatExpiryDate,
    getExpiryWarningLevel,
    getBatchStatusBadge
} from '../utils/batchManagement';

// Format with days remaining
const formatted = formatExpiryDate(batch.expiryDate);
// "Jan 15, 2026 (45 days left)"

// Get warning level
const level = getExpiryWarningLevel(batch.expiryDate);
// 'normal', 'warning', 'critical', 'expired'

// Get badge config
const badge = getBatchStatusBadge(batch.expiryDate);
// { label, color, icon }
```

---

## 🌐 Offline & Sync

### Setup (in App.jsx)

```javascript
import { OfflineSyncProvider } from './context/OfflineSyncContext';

function App() {
    return (
        <OfflineSyncProvider>
            {/* Your app */}
        </OfflineSyncProvider>
    );
}
```

### Use in Components

```javascript
import { useOfflineSync } from '../context/OfflineSyncContext';

function MyComponent() {
    const { 
        isOnline,
        syncQueue,
        syncStatus,
        addToSyncQueue,
        updateSyncStatus,
        getSyncStats,
        syncAll
    } = useOfflineSync();
    
    // Add to queue
    const handleSale = (saleData) => {
        if (!isOnline) {
            const queueId = addToSyncQueue({
                type: 'sale',
                data: saleData
            });
        }
    };
    
    // Get stats
    const stats = getSyncStats();
    // { pending, synced, failed, exception, total }
    
    // Manual sync
    const handleSync = () => {
        if (isOnline) {
            syncAll();
        }
    };
}
```

### Display Sync Status

```javascript
import { SyncStatusBadge } from '../components/OfflineIndicator';

<SyncStatusBadge status={transaction.syncStatus} />
// Shows: pending, synced, failed, exception
```

---

## 🎨 UI Components

### Document State Badge

```javascript
import DocumentStateBadge from '../components/DocumentStateBadge';

<DocumentStateBadge 
    state={document.state} 
    showDot={true}  // Optional, default true
    className="ml-2"  // Optional
/>
```

### Confirmation Modal

```javascript
import ConfirmationModal from '../components/ConfirmationModal';

const [showModal, setShowModal] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const handleConfirm = async (reason) => {
    setIsLoading(true);
    try {
        await performAction(reason);
        setShowModal(false);
    } finally {
        setIsLoading(false);
    }
};

<ConfirmationModal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    onConfirm={handleConfirm}
    title="Reverse Sale"
    message="This will reverse the sale and restore inventory. This action cannot be undone."
    confirmText="Reverse"
    cancelText="Cancel"
    type="danger"
    requiresReason={true}
    isLoading={isLoading}
/>
```

### Offline Indicator

```javascript
import OfflineIndicator from '../components/OfflineIndicator';

// In header or toolbar
<OfflineIndicator className="ml-auto" />
```

---

## 🚫 Common Patterns

### Disable Delete for Posted Documents

```javascript
import { canDeleteDocument, canReverseDocument } from '../utils/documentStates';

{canDeleteDocument(doc.state, userRole, doc.createdBy, currentUser) && (
    <button onClick={() => handleDelete(doc.id)}>
        Delete
    </button>
)}

{canReverseDocument(doc.state, userRole) && (
    <button onClick={() => handleReverse(doc.id)}>
        Reverse
    </button>
)}
```

### Restrict Price Editing

```javascript
import { canEditPrice } from '../utils/permissions';

<input
    type="number"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    disabled={!canEditPrice(userRole)}
    className={!canEditPrice(userRole) ? 'opacity-50 cursor-not-allowed' : ''}
    title={!canEditPrice(userRole) ? 'You do not have permission to edit prices' : ''}
/>
```

### Force FEFO for Cashiers

```javascript
import { canManuallySelectBatch, allocateStockFEFO } from '../utils/batchManagement';

if (canManuallySelectBatch(userRole)) {
    // Show batch selection dropdown
    <select onChange={(e) => setSelectedBatch(e.target.value)}>
        {batches.map(batch => (
            <option key={batch.batchNo} value={batch.batchNo}>
                {batch.batchNo} - Exp: {batch.expiryDate}
            </option>
        ))}
    </select>
} else {
    // Auto-allocate using FEFO
    const result = allocateStockFEFO(batches, quantity);
    // Use result.allocations automatically
}
```

### Block Expired Stock

```javascript
import { canSellBatch, isBatchExpired } from '../utils/batchManagement';

const handleAddToCart = (product, batch) => {
    if (isBatchExpired(batch.expiryDate)) {
        alert('This batch is expired and cannot be sold');
        return;
    }
    
    if (!canSellBatch(batch)) {
        alert('This batch is blocked and cannot be sold');
        return;
    }
    
    // Proceed with adding to cart
};
```

### Require Prescription for Controlled Drugs

```javascript
import { canDispenseControlled } from '../utils/permissions';

const handleDispense = (product) => {
    if (product.isControlled) {
        if (!canDispenseControlled(userRole)) {
            alert('Only pharmacists can dispense controlled drugs');
            return;
        }
        
        if (!product.prescriptionRef) {
            alert('Prescription reference required for controlled drugs');
            return;
        }
    }
    
    // Proceed with dispensing
};
```

---

## 📱 Role-Specific UI Examples

### Cashier View

```javascript
const restrictions = getUIRestrictions('Cashier');

// Price: Read-only
<input type="number" value={price} disabled={true} />

// Discount: Hidden
{restrictions.canApplyDiscount && <DiscountInput />}  // Won't show

// Batch: Auto FEFO only
{!restrictions.canOverrideBatch && (
    <div className="text-xs text-slate-500">
        Batch automatically selected (FEFO)
    </div>
)}
```

### Pharmacist View

```javascript
const restrictions = getUIRestrictions('Pharmacist');

// Price: Read-only
<input type="number" value={price} disabled={!restrictions.canEditPrice} />

// Discount: Enabled
{restrictions.canApplyDiscount && <DiscountInput />}

// Batch: Can override
{restrictions.canOverrideBatch && <BatchSelector />}

// Controlled drugs: Can dispense
{restrictions.canDispenseControlled && <DispenseControlled />}
```

### Manager View

```javascript
const restrictions = getUIRestrictions('Manager');

// All controls enabled
<input type="number" value={price} disabled={false} />
<DiscountInput />
<BatchSelector />

// Additional actions
{restrictions.canApproveDocuments && <ApproveButton />}
{restrictions.canReverseDocuments && <ReverseButton />}
```

---

## 🐛 Debugging

### Check Current Permissions

```javascript
import { getRolePermissions, getUIRestrictions } from '../utils/permissions';

console.log('User role:', userRole);
console.log('Permissions:', getRolePermissions(userRole));
console.log('Restrictions:', getUIRestrictions(userRole));
```

### Validate Document State

```javascript
import { getStateBadge, getAvailableActions } from '../utils/documentStates';

console.log('Document state:', document.state);
console.log('State info:', getStateBadge(document.state));
console.log('Available actions:', getAvailableActions(document, userRole, currentUser));
```

### Check Batch Allocation

```javascript
import { allocateStockFEFO } from '../utils/batchManagement';

const result = allocateStockFEFO(batches, quantity);
console.log('Allocations:', result.allocations);
console.log('Fully allocated:', result.fullyAllocated);
console.log('Shortfall:', result.shortfall);
```

---

## ⚠️ Important Notes

1. **Always check permissions before showing UI elements** - Don't rely on backend errors
2. **Use FEFO for all batch allocations** - Especially for cashiers
3. **Block expired stock completely** - No exceptions
4. **Require reasons for reversals** - Audit trail compliance
5. **Show state badges everywhere** - Clear document status
6. **Handle offline gracefully** - Queue transactions when offline
7. **Validate before API calls** - Prevent invalid requests

---

## 📚 Further Reading

- Full implementation details: `COMPLIANCE_IMPLEMENTATION.md`
- Permission system: `src/utils/permissions.js`
- Document states: `src/utils/documentStates.js`
- Batch management: `src/utils/batchManagement.js`
- Offline sync: `src/context/OfflineSyncContext.jsx`
