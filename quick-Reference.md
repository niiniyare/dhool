# Dhool ERP - Quick Reference Card

## PrimeVue 4 Changes from v3

### Import Paths
```typescript
// ❌ OLD (PrimeVue 3)
import { FilterMatchMode } from 'primevue/api'

// ✅ NEW (PrimeVue 4)
import { FilterMatchMode } from '@primevue/core/api'
```

### Button Styling
```vue
<!-- ❌ OLD: CSS classes -->
<Button class="p-button-rounded p-button-text p-button-danger" />

<!-- ✅ NEW: Props -->
<Button rounded text severity="danger" />
```

### Component Naming
```vue
<!-- ❌ OLD -->
<Dropdown />

<!-- ✅ NEW (preferred) -->
<Select />
```

### DataTable
```vue
<!-- ❌ OLD: responsiveLayout -->
<DataTable responsiveLayout="scroll">

<!-- ✅ NEW: scrollable props -->
<DataTable scrollable scrollHeight="flex">
```

### Tag Severity
```vue
<!-- Both work, but prefer: -->
<Tag severity="warning" />  <!-- Instead of "warn" -->
```

---

## Schema Structure Quick Reference

### Document Schema
```json
{
  "name": "doctype",
  "label": "Single Label",
  "labelPlural": "Plural Label",
  "module": "module_name",
  "api": { "baseEndpoint": "/api/v1/..." },
  "listView": { "columns": [], "toolbarActions": [], "rowActions": [] },
  "formView": { "sections": [], "fields": [] },
  "access": { "permissions": {} }
}
```

### Field Schema
```json
{
  "name": "field_name",
  "label": "Field Label",
  "type": "text|select|date|number|...",
  "section": "section_name",
  "width": "full|half|third|quarter",
  "required": true,
  "access": { "requiredPlan": ["pro"], "readRoles": ["admin"] }
}
```

### Action Schema
```json
{
  "name": "action_name",
  "label": "Action Label",
  "icon": "pi pi-icon",
  "action": "create|edit|delete|api|navigate|custom",
  "confirm": { "title": "...", "message": "..." }
}
```

---

## Access Control Layers

```
┌─────────────────────────────────────────┐
│ Layer 1: SUBSCRIPTION (Tenant Level)    │
│ - Which modules are enabled?            │
│ - Which features within modules?        │
│ - What limits apply?                    │
├─────────────────────────────────────────┤
│ Layer 2: ROLE (Module Level)            │
│ - Which modules can role access?        │
│ - What actions (CRUD)?                  │
│ - What data scope (own/team/all)?       │
├─────────────────────────────────────────┤
│ Layer 3: ABAC (Field Level)             │
│ - Which fields visible?                 │
│ - Which fields editable?                │
│ - What conditions apply?                │
└─────────────────────────────────────────┘
```

---

## Component Hierarchy

```
Renderers (DocumentPage, DashboardPage)
    └── Templates (MainLayout, AuthLayout)
        └── Organisms (DataTableCrud, FormBuilder)
            └── Molecules (FormField, StatCard, ActionMenu)
                └── Atoms (Use PrimeVue directly)
```

---

## Field Types

| Type | Component | Notes |
|------|-----------|-------|
| `text` | InputText | Basic text input |
| `textarea` | Textarea | Multi-line text |
| `number` | InputNumber | Numeric input |
| `currency` | InputNumber | With currency format |
| `percent` | InputNumber | With % suffix |
| `date` | DatePicker | Date only |
| `datetime` | DatePicker | Date and time |
| `time` | DatePicker | Time only |
| `select` | Select | Single selection |
| `multiselect` | MultiSelect | Multiple selection |
| `checkbox` | Checkbox | Boolean |
| `switch` | ToggleSwitch | Boolean toggle |
| `radio` | RadioButton | Single from options |
| `link` | AutoComplete | Reference to other doc |
| `table` | Custom | Child table rows |
| `email` | InputText | Email validation |
| `phone` | InputMask | Phone format |
| `url` | InputText | URL validation |
| `tags` | Chips | Tag input |
| `rating` | Rating | Star rating |
| `color` | ColorPicker | Color selection |
| `html` | Editor | Rich text |
| `readonly` | Div | Display only |

---

## Composable Usage

### useAccess
```typescript
const { can, canAny, getAccess, filterFields, filterActions, hasModule, hasFeature } = useAccess()

// Check permission
if (can('create', 'customer')) { ... }

// Filter visible fields
const visibleFields = filterFields(fields, 'customer', 'read')
```

### useSchema
```typescript
const { 
  schema, columns, visibleFields, sections,
  toolbarActions, rowActions, defaultValues,
  validateField, validateForm 
} = useSchema('customer')
```

### useCrud
```typescript
const { 
  items, pagination, isListLoading,
  create, update, remove, bulkDelete,
  setPage, setSearch, setFilters 
} = useCrud({ docType: 'customer', apiConfig })
```

### useDrawer
```typescript
const { 
  isOpen, mode, data, title,
  openCreate, openEdit, openView, close 
} = useDrawer()
```

---

## Key Files

```
src/
├── components/
│   ├── organisms/
│   │   ├── DataTableCrud.vue    # Main list component
│   │   ├── FormBuilder.vue      # Schema-driven form
│   │   └── FormDrawer.vue       # Form in drawer
│   └── renderers/
│       ├── DocumentPage.vue     # Full document page
│       └── FieldRenderer.vue    # Field type renderer
├── composables/
│   ├── useAccess.ts             # Permission checks
│   ├── useSchema.ts             # Schema loading
│   └── useCrud.ts               # CRUD operations
├── services/
│   ├── accessService.ts         # ABAC engine
│   └── schemaService.ts         # Schema parsing
├── stores/
│   ├── authStore.ts
│   ├── tenantStore.ts
│   └── accessStore.ts
├── types/
│   ├── schema.ts                # Schema types
│   └── access.ts                # Access types
└── schemas/
    └── documents/               # JSON schemas
```

---

## Common Patterns

### Create Button with Permission Check
```vue
<Button
  v-if="can('create', docType)"
  label="New"
  icon="pi pi-plus"
  @click="drawer.openCreate()"
/>
```

### Conditional Field
```json
{
  "name": "companyName",
  "depends_on": [{
    "field": "type",
    "operator": "eq",
    "value": "company",
    "action": "show"
  }]
}
```

### Field Access Control
```json
{
  "name": "creditLimit",
  "access": {
    "requiredPlan": ["professional", "enterprise"],
    "writeRoles": ["admin", "accountant"]
  }
}
```

### Row Action with Confirmation
```json
{
  "name": "delete",
  "action": "delete",
  "confirm": {
    "title": "Delete?",
    "message": "This cannot be undone.",
    "severity": "danger"
  }
}
```

---

## Theme Customization

### PrimeVue 4 Theme Preset
```typescript
const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      // ... 100-950
    }
  }
})
```

### Dark Mode
```typescript
// Toggle
document.documentElement.classList.toggle('dark')

// CSS selector in PrimeVue config
darkModeSelector: '.dark'
```

### Pass-Through API
```typescript
app.use(PrimeVue, {
  pt: {
    button: { root: { class: 'custom-button' } },
    datatable: { header: { class: 'custom-header' } }
  }
})
```

---

## API Patterns

### Standard List Response
```typescript
interface ListResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### API Config in Schema
```json
{
  "api": {
    "baseEndpoint": "/api/v1/customers",
    "endpoints": {
      "list": "/api/v1/customers",
      "get": "/api/v1/customers/:id",
      "create": "/api/v1/customers",
      "update": "/api/v1/customers/:id",
      "delete": "/api/v1/customers/:id"
    },
    "pagination": {
      "pageParam": "page",
      "limitParam": "limit",
      "defaultLimit": 20
    }
  }
}
```
