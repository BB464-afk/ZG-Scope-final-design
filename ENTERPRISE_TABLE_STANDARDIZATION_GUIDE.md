# Enterprise Table Standardization Guide
## ZG-CMP Application

## ✅ COMPLETED
1. **EnterpriseTable Component** - `/src/app/components/EnterpriseTable.tsx`
2. **Discipline Master** - `/src/app/pages/DisciplineList.tsx`

---

## 📋 STANDARDIZATION CHECKLIST

### Design System Applied
- ✅ **Color System**: Soft blue alternate rows (#F7FAFB / #FFFFFF)
- ✅ **No Vertical Grid Lines**: Only horizontal 1px dividers (#E5E7EB)
- ✅ **Column Headers**: "Capitalize Each Word" format
- ✅ **Row Height**: 52px enterprise density
- ✅ **Header Background**: #E4EEF8
- ✅ **Container Background**: #FAFAFA
- ✅ **Selected Row**: #FFF5F2 with #FD431426 border
- ✅ **Hover State**: #EFF6FF

### Control Layout (ALL Screens)
```
TOP ROW:
[Search Bar ..................] [Spacer] [Filters] [Bulk Actions] [Primary Action] [View Toggle]

BOTTOM ROW:
[Total Records: X]                                              [Pagination ◀ Page 1 of 10 ▶]
```

### Bulk Actions Pattern
- Always trigger confirmation modal
- Modal shows: Action name + count + warning message
- Example: "Delete 5 Selected Records?"

### Date Format
- Standard: **DD/MM/YYYY**
- Function: `formatDate()` from EnterpriseTable.tsx

---

## 🔄 SCREENS TO UPDATE

### 1. All Tasks Listing - Structured View
**File**: `/src/app/pages/TasksListing.tsx`

**Current State**: Custom grouped table with edit mode
**Required Changes**:
- Remove vertical borders from PROJECT CODE column
- Apply alternating row colors (#F7FAFB / #FFFFFF)
- Update header text: "TASK" → "Task", "SCOPE" → "Scope", etc.
- Move Edit Mode toggle to right side of controls row
- Add Total Records count (bottom left)
- Add pagination (bottom right)
- Keep existing Edit Mode functionality intact

**Column Headers** (Structured View):
- Task
- Scope  
- Subcontractor
- Project Code
- Status
- Actions

---

### 2. All Tasks Listing - Flat View
**File**: `/src/app/pages/TasksListing.tsx`

**Current State**: Spreadsheet-style with selection column
**Required Changes**:
- Apply blue zebra striping
- Remove vertical gridlines
- Update all column headers to sentence case:
  - "TASK CODE" → "Task Code"
  - "TASK NAME" → "Task Name"
  - "ACTIVITY NAME" → "Activity Name"
  - "CREATED AT" → "Created At"
- Add Total Records at bottom
- Ensure bulk action confirmation modals

**Column Headers** (Flat View):
- ☑ (selection)
- Task Code
- Task Name
- Activity Name
- Phase
- Discipline
- Trade Package
- Sub-Contractor
- Delivery Package
- Area
- Building
- Tranche
- SPA
- Cost Type
- Budget Cost (€)
- Budget Quantity
- Budget Man-Hours
- Status
- Created At

---

### 3. Sub-Contractor Master
**File**: `/src/app/pages/SubContractorList.tsx`

**Integration Pattern**:
```tsx
import { EnterpriseTable, ConfirmationModal, ENTERPRISE_TABLE_THEME, formatDate } from '../components/EnterpriseTable';

<EnterpriseTable
  searchPlaceholder="Search sub-contractors..."
  bulkActions={[
    { label: 'Activate', value: 'activate' },
    { label: 'Deactivate', value: 'deactivate' },
    { label: 'Delete', value: 'delete' }
  ]}
  selectedCount={selectedRows.size}
  onBulkAction={handleBulkAction}
  primaryAction={{
    label: 'Add Sub-Contractor',
    onClick: () => navigate('/app/general-settings/subcontractor/add'),
    icon: <Plus size={16} />
  }}
  totalRecords={MOCK_DATA.length}
  currentPage={1}
  totalPages={1}
>
  {/* Table content */}
</EnterpriseTable>
```

**Column Headers**:
- ☑ (selection)
- Code
- Name
- Contact Person
- Email
- Phone
- Status
- Created At

---

### 4. UOM Master
**File**: `/src/app/pages/UOMList.tsx`

**Column Headers**:
- ☑
- Code
- Name  
- Symbol
- Type
- Created At
- Status

**Bulk Actions**:
- Activate
- Deactivate
- Delete

---

### 5. Location Master (Country)
**File**: `/src/app/pages/LocationList.tsx`

**Column Headers**:
- ☑
- Country Code
- Country Name
- Region
- Currency
- Created At
- Status

---

### 6. Currency Master
**File**: `/src/app/pages/CurrencyList.tsx` (if exists)

**Column Headers**:
- ☑
- Code
- Name
- Symbol
- Exchange Rate
- Created At
- Status

---

### 7. Client Master
**File**: `/src/app/pages/ClientList.tsx` (if exists)

**Column Headers**:
- ☑
- Code
- Client Name
- Contact Person
- Email
- Phone
- Country
- Created At
- Status

---

### 8. TP Master
**File**: Path to be identified

**Column Headers**:
- ☑
- Code
- Name
- Discipline
- Description
- Created At
- Status

---

### 9. Project Users
**File**: Path to be identified

**Column Headers**:
- ☑
- User Name
- Email
- Role
- Discipline
- Access Level
- Added On
- Status

---

### 10. User Management
**File**: Path to be identified

**Column Headers**:
- ☑
- User ID
- Name
- Email
- Role
- Department
- Last Login
- Status

---

## 🎨 VISUAL REFERENCE

### Row States
```
┌─────────────────────────────────────────────────┐
│ Header Row         │ #E4EEF8                    │
├─────────────────────────────────────────────────┤
│ Row 1 (Even)       │ #FFFFFF                    │
│ Row 2 (Odd)        │ #F7FAFB  ← Soft blue tint │
│ Row 3 (Even)       │ #FFFFFF                    │
│ Row 4 (Selected)   │ #FFF5F2                    │
│ Row 5 (Hover)      │ #EFF6FF                    │
└─────────────────────────────────────────────────┘
```

### Borders
```
─────────────────  ← Horizontal only (1px #E5E7EB)
Row Content
─────────────────
Row Content
─────────────────
```

### Control Layout
```
┌──────────────────────────────────────────────────────────────────────┐
│  [🔍 Search...]          [Filters▼] [Bulk▼] [+Primary Action]       │
└──────────────────────────────────────────────────────────────────────┘
│                        TABLE CONTENT                                  │
┌──────────────────────────────────────────────────────────────────────┐
│  Total Records: 124                      [◀] Page 1 of 10 [▶]       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTATION CHECKLIST

For each listing screen:

- [ ] Import EnterpriseTable, ConfirmationModal, ENTERPRISE_TABLE_THEME, formatDate
- [ ] Wrap table in `<EnterpriseTable>` component
- [ ] Update all column headers to "Capitalize Each Word"
- [ ] Remove all vertical borders/gridlines
- [ ] Apply alternating row colors (rowEven/rowOdd)
- [ ] Update date format to DD/MM/YYYY using formatDate()
- [ ] Set row height to 52px
- [ ] Add confirmation modals for all bulk actions
- [ ] Verify hover states (#EFF6FF)
- [ ] Verify selected states (#FFF5F2)
- [ ] Test pagination if applicable
- [ ] Test search functionality
- [ ] Test bulk selection and actions

---

## 📦 REUSABLE COMPONENTS

### EnterpriseTable Props
```typescript
interface EnterpriseTableProps {
  children: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showFilters?: boolean;
  onFilterClick?: () => void;
  bulkActions?: Array<{ label: string; value: string; }>;
  selectedCount?: number;
  onBulkAction?: (action: string) => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  totalRecords?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  viewToggle?: ReactNode;
}
```

### ConfirmationModal Props
```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}
```

### Theme Constants
```typescript
export const ENTERPRISE_TABLE_THEME = {
  containerBg: '#FAFAFA',
  headerBg: '#E4EEF8',
  rowEven: '#FFFFFF',
  rowOdd: '#F7FAFB',
  rowHover: '#EFF6FF',
  rowSelected: '#FFF5F2',
  borderColor: '#C8D9EE',
  dividerColor: '#E5E7EB',
  headerText: '#272721',
  bodyText: '#1F2937',
  mutedText: '#6B7280',
  rowHeight: '52px',
  cellPadding: '12px 16px',
  headerPadding: '14px 16px',
  headerWeight: '600',
  bodyWeight: '400'
};
```

---

## ✨ BENEFITS

1. **Consistency**: All tables look and behave identically
2. **Maintainability**: Single source of truth for styling
3. **Scalability**: Easy to add new listing screens
4. **UX**: Predictable user experience across all masters
5. **AG Grid Ready**: Structure supports advanced grid features
6. **Enterprise Grade**: Professional, dense, scannable design

---

## 🚀 NEXT STEPS

1. Update TasksListing.tsx (both Structured and Flat views)
2. Update SubContractorList.tsx
3. Update UOMList.tsx
4. Update LocationList.tsx
5. Update remaining master listing screens
6. Document any exceptions or custom requirements
7. Add sorting/filtering logic integration points
8. Performance test with large datasets (1000+ rows)

---

**Last Updated**: February 25, 2026
**Status**: In Progress - Discipline Master ✅ Complete
