# Component Migration Checklist

This checklist guides you through updating existing components to comply with the new compliance requirements.

---

## 🎯 General Steps for All Components

### 1. Add Offline Sync Provider (App Level)

**File**: `src/main.jsx` or `src/App.jsx`

```javascript
import { OfflineSyncProvider } from './context/OfflineSyncContext';

// Wrap your app
<OfflineSyncProvider>
    <AuthProvider>
        <App />
    </AuthProvider>
</OfflineSyncProvider>
```

### 2. Add Offline Indicator to Header

**Files**: All page components with headers

```javascript
import OfflineIndicator from '../components/OfflineIndicator';

// In header section
<div className="flex items-center gap-3">
    <OfflineIndicator />
    {/* Other header items */}
</div>
```

---

## 📄 POS Component (`src/pages/pos/POS.jsx`)

### Priority: 🔴 CRITICAL

### Changes Required:

#### 1. Add Imports

```javascript
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { allocateStockFEFO, canManuallySelectBatch, isBatchExpired } from '../../utils/batchManagement';
import { canEditPrice, canApplyDiscount, getUIRestrictions } from '../../utils/permissions';
import { DOCUMENT_STATES } from '../../utils/documentStates';
import ConfirmationModal from '../../components/ConfirmationModal';
import OfflineIndicator from '../../components/OfflineIndicator';
```

#### 2. Get User Restrictions

```javascript
const { user } = useAuth();
const restrictions = getUIRestrictions(user?.role);
const { isOnline, addToSyncQueue } = useOfflineSync();
```

#### 3. Disable Price Editing for Cashiers

**Find**: Price input fields
**Change**:
```javascript
<input
    type="number"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    disabled={!restrictions.canEditPrice}
    className={!restrictions.canEditPrice ? 'opacity-50 cursor-not-allowed' : ''}
    title={!restrictions.canEditPrice ? 'You do not have permission to edit prices' : ''}
/>
```

#### 4. Disable Discount for Cashiers

**Find**: Discount section
**Change**:
```javascript
{restrictions.canApplyDiscount ? (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        {/* Discount controls */}
    </div>
) : (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs text-slate-500 text-center">
            Discount not available for your role
        </p>
    </div>
)}
```

#### 5. Implement FEFO Batch Selection

**Find**: Product selection logic
**Add**:
```javascript
const addToCart = (product) => {
    // Get available batches for product
    const batches = product.batches || [];
    
    // Filter out expired batches
    const validBatches = batches.filter(b => !isBatchExpired(b.expiryDate));
    
    if (validBatches.length === 0) {
        alert('No valid batches available for this product');
        return;
    }
    
    // Auto-allocate using FEFO
    const result = allocateStockFEFO(validBatches, 1);
    
    if (!result.fullyAllocated) {
        alert('Insufficient stock');
        return;
    }
    
    // Add to cart with batch info
    const cartItem = {
        ...product,
        quantity: 1,
        allocatedBatches: result.allocations
    };
    
    setCart([...cart, cartItem]);
};
```

#### 6. Handle Offline Sales

**Find**: Checkout/payment completion
**Change**:
```javascript
const handlePaymentComplete = (paymentData) => {
    const transaction = {
        id: `INV-${Date.now()}`,
        type: 'sale',
        state: DOCUMENT_STATES.DRAFT,
        data: {
            items: cart,
            total: cartSummary.total,
            payment: paymentData,
            timestamp: new Date().toISOString()
        }
    };
    
    if (!isOnline) {
        // Add to sync queue
        addToSyncQueue(transaction);
        alert('Sale saved offline. Will sync when online.');
    } else {
        // Direct API call
        // await api.createSale(transaction);
    }
    
    // Clear cart and show receipt
    setCart([]);
    setIsReceiptModalOpen(true);
};
```

#### 7. Add Offline Indicator

**Find**: Header section
**Add**:
```javascript
<div className="flex items-center gap-3">
    <OfflineIndicator />
    {/* Existing header items */}
</div>
```

---

## 📦 GRN Component (`src/pages/grn/GRN.jsx`)

### Priority: 🔴 CRITICAL

### Changes Required:

#### 1. Add Imports

```javascript
import { DOCUMENT_STATES, canDeleteDocument, canReverseDocument, getAvailableActions } from '../../utils/documentStates';
import DocumentStateBadge from '../../components/DocumentStateBadge';
import ConfirmationModal from '../../components/ConfirmationModal';
```

#### 2. Add Document State to Mock Data

**Find**: MOCK_GRNS
**Change**:
```javascript
const MOCK_GRNS = [
    {
        id: 1,
        grnNumber: "GRN-2026-001",
        state: DOCUMENT_STATES.POSTED,  // Add state
        createdBy: "Ahmed Khan",  // Add creator
        // ... rest of fields
    },
    {
        id: 2,
        state: DOCUMENT_STATES.DRAFT,
        createdBy: "Fatima Ali",
        // ...
    }
];
```

#### 3. Replace Status with State Badge

**Find**: Status badge rendering
**Replace**:
```javascript
// OLD:
<span className={`inline-flex items-center ...`}>
    {grn.status}
</span>

// NEW:
<DocumentStateBadge state={grn.state} />
```

#### 4. Add State-Based Actions

**Find**: Actions column
**Replace**:
```javascript
<td className="px-6 py-4 text-right">
    <div className="flex items-center justify-end gap-2">
        {/* View always available */}
        <button
            onClick={() => handleViewGRN(grn)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors"
        >
            <Eye className="h-3.5 w-3.5" />
            View
        </button>
        
        {/* Delete only for drafts */}
        {canDeleteDocument(grn.state, user?.role, grn.createdBy, user?.id) && (
            <button
                onClick={() => handleDelete(grn)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
            >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
            </button>
        )}
        
        {/* Reverse for posted/synced */}
        {canReverseDocument(grn.state, user?.role) && (
            <button
                onClick={() => handleReverse(grn)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-semibold transition-colors"
            >
                <RotateCcw className="h-3.5 w-3.5" />
                Reverse
            </button>
        )}
    </div>
</td>
```

#### 5. Add Confirmation Modals

**Add state**:
```javascript
const [confirmAction, setConfirmAction] = useState(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);
```

**Add handlers**:
```javascript
const handleDelete = (grn) => {
    setConfirmAction({ type: 'delete', grn });
    setShowConfirmModal(true);
};

const handleReverse = (grn) => {
    setConfirmAction({ type: 'reverse', grn });
    setShowConfirmModal(true);
};

const handleConfirm = (reason) => {
    if (confirmAction.type === 'delete') {
        // Delete logic
        console.log('Deleting GRN:', confirmAction.grn.id);
    } else if (confirmAction.type === 'reverse') {
        // Reverse logic with reason
        console.log('Reversing GRN:', confirmAction.grn.id, 'Reason:', reason);
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
};
```

**Add modal**:
```javascript
{showConfirmModal && confirmAction && (
    <ConfirmationModal
        isOpen={true}
        onClose={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
        }}
        onConfirm={handleConfirm}
        title={confirmAction.type === 'delete' ? 'Delete GRN' : 'Reverse GRN'}
        message={
            confirmAction.type === 'delete'
                ? 'Are you sure you want to delete this draft GRN?'
                : 'This will reverse the GRN and adjust inventory. This action cannot be undone.'
        }
        confirmText={confirmAction.type === 'delete' ? 'Delete' : 'Reverse'}
        type="danger"
        requiresReason={confirmAction.type === 'reverse'}
    />
)}
```

---

## 📊 Inventory Component (`src/pages/inventory/Inventory.jsx`)

### Priority: 🟡 HIGH

### Changes Required:

#### 1. Add Imports

```javascript
import { 
    calculateBatchStatus, 
    isBatchExpired, 
    isBatchNearExpiry,
    getBatchStatusBadge,
    formatExpiryDate
} from '../../utils/batchManagement';
```

#### 2. Update Batch Status Display

**Find**: Batch status rendering in expanded rows
**Replace**:
```javascript
{item.batches.map((batch, idx) => {
    const status = calculateBatchStatus(batch.expiryDate);
    const badge = getBatchStatusBadge(batch.expiryDate);
    const isExpired = isBatchExpired(batch.expiryDate);
    const isNearExpiry = isBatchNearExpiry(batch.expiryDate);
    
    return (
        <div
            key={idx}
            className={`flex items-center justify-between p-3 rounded-lg border ${
                isExpired ? 'bg-red-50 border-red-200' :
                isNearExpiry ? 'bg-amber-50 border-amber-200' :
                'bg-white border-slate-200'
            }`}
        >
            <div className="flex items-center gap-4">
                <div className="text-sm">
                    <span className="font-semibold text-slate-900">Batch: </span>
                    <span className="text-slate-700">{batch.batchNo}</span>
                </div>
                <div className="text-sm">
                    <span className="font-semibold text-slate-900">Qty: </span>
                    <span className="text-slate-700">{batch.qty}</span>
                </div>
                <div className="text-sm">
                    <span className="font-semibold text-slate-900">Expiry: </span>
                    <span className={isExpired ? 'text-red-700 font-semibold' : 'text-slate-700'}>
                        {formatExpiryDate(batch.expiryDate)}
                    </span>
                </div>
            </div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${badge.color}`}>
                {badge.label}
            </span>
        </div>
    );
})}
```

#### 3. Add Expiry Warnings

**Add after stats cards**:
```javascript
{stats.expired > 0 && (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 mb-6">
        <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
                <p className="text-sm font-semibold text-red-900">
                    {stats.expired} Expired Batch{stats.expired > 1 ? 'es' : ''} Found
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                    These batches cannot be sold and should be removed from inventory
                </p>
            </div>
        </div>
    </div>
)}
```

---

## 🛍️ Products Component (`src/pages/products/Products.jsx`)

### Priority: 🟢 MEDIUM

### Changes Required:

#### 1. Add Imports

```javascript
import { canEditPrice, getUIRestrictions } from '../../utils/permissions';
```

#### 2. Disable Price Editing

**Find**: Price input in ProductModal
**Change**:
```javascript
const { user } = useAuth();
const restrictions = getUIRestrictions(user?.role);

<div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
        Selling Price
        {!restrictions.canEditPrice && (
            <span className="text-xs text-slate-500 ml-2">(Read-only)</span>
        )}
    </label>
    <input
        type="number"
        value={formData.sellingPrice}
        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
        disabled={!restrictions.canEditPrice}
        className={`w-full px-3 py-2 rounded-lg border ${
            !restrictions.canEditPrice 
                ? 'bg-slate-50 cursor-not-allowed opacity-75' 
                : 'bg-white'
        } border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
    />
</div>
```

---

## 📱 Dashboard Component (`src/pages/dashboard/Dashboard.jsx`)

### Priority: 🟢 LOW

### Changes Required:

#### 1. Add Offline Indicator

**Find**: Header
**Add**:
```javascript
import OfflineIndicator from '../../components/OfflineIndicator';

<div className="flex items-center gap-3">
    <OfflineIndicator />
    {/* Other header items */}
</div>
```

#### 2. Add Sync Queue Widget

**Add to dashboard**:
```javascript
import { useOfflineSync } from '../../context/OfflineSyncContext';

const { getSyncStats } = useOfflineSync();
const syncStats = getSyncStats();

{syncStats.total > 0 && (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-sm font-semibold text-amber-900 mb-2">
            Sync Queue
        </h3>
        <div className="grid grid-cols-4 gap-3">
            <div>
                <p className="text-xs text-amber-700">Pending</p>
                <p className="text-lg font-bold text-amber-900">{syncStats.pending}</p>
            </div>
            <div>
                <p className="text-xs text-amber-700">Synced</p>
                <p className="text-lg font-bold text-emerald-900">{syncStats.synced}</p>
            </div>
            <div>
                <p className="text-xs text-amber-700">Failed</p>
                <p className="text-lg font-bold text-red-900">{syncStats.failed}</p>
            </div>
            <div>
                <p className="text-xs text-amber-700">Exceptions</p>
                <p className="text-lg font-bold text-orange-900">{syncStats.exception}</p>
            </div>
        </div>
    </div>
)}
```

---

## ✅ Testing Checklist

After migrating each component, verify:

### POS Component
- [ ] Cashiers cannot edit prices
- [ ] Cashiers cannot apply discounts
- [ ] Batch selection is automatic (FEFO)
- [ ] Expired batches are blocked
- [ ] Offline sales are queued
- [ ] Offline indicator shows in header

### GRN Component
- [ ] Document state badges display correctly
- [ ] Delete button only shows for drafts
- [ ] Reverse button shows for posted/synced GRNs
- [ ] Confirmation modal appears for delete
- [ ] Confirmation modal with reason for reverse
- [ ] Only managers can reverse

### Inventory Component
- [ ] Expired batches highlighted in red
- [ ] Near-expiry batches show warning
- [ ] Expiry dates formatted with days remaining
- [ ] Batch status badges show correct colors
- [ ] Expired batch alert shows when present

### Products Component
- [ ] Price fields disabled for non-authorized roles
- [ ] Visual feedback for disabled fields
- [ ] Tooltips explain restrictions

### Dashboard Component
- [ ] Offline indicator visible
- [ ] Sync queue stats display when items present
- [ ] Stats update in real-time

---

## 🚀 Migration Priority

1. **Critical (Do First)**
   - POS Component
   - GRN Component
   - App-level OfflineSyncProvider

2. **High (Do Next)**
   - Inventory Component
   - Products Component

3. **Medium (Do After)**
   - Dashboard Component
   - Reports Component

4. **Low (Nice to Have)**
   - Settings Component
   - Suppliers Component

---

## 📝 Notes

- Always test with different roles (Admin, Manager, Pharmacist, Cashier)
- Test offline functionality by toggling network in DevTools
- Verify confirmation modals appear for critical actions
- Check that expired batches are completely blocked
- Ensure FEFO is working correctly for batch allocation

---

## 🆘 Common Issues

### Issue: Permissions not working
**Solution**: Ensure `useAuth()` returns user with role

### Issue: Offline sync not working
**Solution**: Check that `OfflineSyncProvider` wraps the app

### Issue: Batch allocation fails
**Solution**: Ensure batches have `expiryDate` and `quantity` fields

### Issue: Confirmation modal doesn't show
**Solution**: Check modal state management and `isOpen` prop

---

**Last Updated**: January 30, 2026  
**Status**: Ready for implementation
