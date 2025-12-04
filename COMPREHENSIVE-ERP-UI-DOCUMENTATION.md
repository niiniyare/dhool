# Comprehensive ERP UI Framework Documentation
## PrimeVue 4 + Vue 3 Schema-Driven Enterprise Architecture

> **Complete Guide**: A unified documentation combining theoretical architecture with practical implementation for building enterprise ERP systems using Vue 3, PrimeVue 4, and schema-driven UI generation.

---

## Table of Contents

### Part I: Foundation & Philosophy
1. [Introduction & Vision](#introduction--vision)
2. [Why Schema-Driven UI Architecture](#why-schema-driven-ui-architecture)
3. [PrimeVue 4 Foundation & Design System](#primevue-4-foundation--design-system)
4. [Atomic Design Methodology](#atomic-design-methodology)
5. [Multi-Level Access Control](#multi-level-access-control)

### Part II: Architecture & Design
6. [System Architecture Overview](#system-architecture-overview)
7. [Backend vs Frontend Processing](#backend-vs-frontend-processing)
8. [Component Hierarchy & Organization](#component-hierarchy--organization)
9. [Schema System Design](#schema-system-design)
10. [Type System & TypeScript Integration](#type-system--typescript-integration)

### Part III: PrimeVue Components & Implementation
11. [PrimeVue Component Library Strategy](#primevue-component-library-strategy)
12. [Atoms: Core UI Elements](#atoms-core-ui-elements)
13. [Molecules: Composite Components](#molecules-composite-components)
14. [Organisms: Complex Components](#organisms-complex-components)
15. [DataTable: The Heart of ERP Systems](#datatable-the-heart-of-erp-systems)

### Part IV: Project Setup & Configuration
16. [Project Setup & Installation](#project-setup--installation)
17. [PrimeVue 4 Configuration & Theming](#primevue-4-configuration--theming)
18. [Development Environment Setup](#development-environment-setup)

### Part V: Services & State Management
19. [Access Control Service](#access-control-service)
20. [Schema Engine Service](#schema-engine-service)
21. [Composables & State Management](#composables--state-management)

### Part VI: Advanced Features & Implementation
22. [Schema Builder & Dynamic UI](#schema-builder--dynamic-ui)
23. [Multi-Tenant Theming](#multi-tenant-theming)
24. [Performance Optimization](#performance-optimization)
25. [Testing Strategy](#testing-strategy)

### Part VII: Best Practices & Guidelines
26. [Development Best Practices](#development-best-practices)
27. [Schema Design Best Practices](#schema-design-best-practices)
28. [Component Development Guidelines](#component-development-guidelines)

---

# Part I: Foundation & Philosophy

## Introduction & Vision

This comprehensive documentation combines the theoretical framework of schema-driven UI architecture with the practical implementation guide for PrimeVue 4 components, creating a unified resource for building enterprise ERP systems.

### What This Documentation Covers

**Theoretical Framework:**
- Schema-driven UI architecture principles
- Multi-level access control systems
- Component design patterns
- Enterprise security considerations

**Practical Implementation:**
- Complete PrimeVue 4 component library
- Real-world code examples
- Implementation roadmaps and timelines
- Performance optimization techniques

### Why This Approach Was Chosen

**1. Schema-Driven Architecture Benefits:**
- **Rapid Development**: 80% reduction in boilerplate code
- **Consistency**: Unified UI patterns across all modules
- **Flexibility**: Backend teams can modify UI without frontend expertise
- **Maintenance**: Single source of truth for UI behavior

**2. PrimeVue 4 as Foundation:**
- **Enterprise-Ready**: WCAG 2.1 AA compliance built-in
- **Comprehensive**: 250+ components cover all ERP needs
- **Flexible Theming**: Design token architecture enables multi-tenancy
- **Vue 3 Native**: Composition API and modern Vue features

**3. Alternatives Considered:**
- **Traditional Component Development**: Rejected due to maintenance overhead
- **Headless UI Libraries**: Rejected due to styling complexity
- **Custom UI Framework**: Rejected due to development time investment
- **Other Enterprise Frameworks**: PrimeVue chosen for Vue ecosystem fit

---

## Why Schema-Driven UI Architecture

### The Enterprise ERP Challenge

In enterprise ERP systems, you'll encounter hundreds of similar pages:
- **Document Lists**: Invoices, Orders, Transactions, Users, Products
- **Document Forms**: Create/Edit dialogs with validation
- **Dashboards**: KPIs, charts, activity feeds
- **Reports**: Filtered data exports

### Problems with Traditional Approach

Writing individual Vue components for each is:

**Time-consuming:**
- 80% of code is repetitive CRUD boilerplate
- Each form requires similar validation logic
- Data tables need identical filtering/sorting/pagination

**Error-prone:**
- Inconsistent implementations across developers
- Different validation patterns for similar fields
- UI inconsistencies between modules

**Hard to maintain:**
- Changes require touching many files
- Security updates need implementation in multiple places
- Styling changes cascade through numerous components

**Inflexible:**
- Backend developers can't modify UI without frontend expertise
- Non-technical users can't customize layouts
- Deployment requires frontend rebuild for UI changes

### The Schema-Driven Solution

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SCHEMA-DRIVEN ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│   │  JSON Schema │────▶│ Schema Engine│────▶│  Vue Component│            │
│   │  (Document)  │     │  (Runtime)   │     │  (Rendered)  │            │
│   └──────────────┘     └──────────────┘     └──────────────┘            │
│          │                    │                    │                     │
│          ▼                    ▼                    ▼                     │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│   │ - Fields     │     │ - Condition  │     │ - DataTable  │            │
│   │ - Conditions │     │   Evaluation │     │ - Forms      │            │
│   │ - API Config │     │ - Access     │     │ - Actions    │            │
│   │ - Permissions│     │   Control    │     │ - Validation │            │
│   │ - Layout     │     │ - Theming    │     │              │            │
│   └──────────────┘     └──────────────┘     └──────────────┘            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Benefits of Schema-Driven Approach

**1. Rapid Development**
- Document types defined in JSON
- UI generated automatically
- Form validation derived from schema
- API endpoints configured declaratively

**2. Consistency**
- Single component renders all forms
- Unified styling across all tables
- Standard validation patterns
- Consistent error handling

**3. Flexibility**
- Backend teams modify UI via JSON
- Non-technical users customize layouts
- A/B testing through schema variations
- Runtime UI modifications

**4. Maintainability**
- Single source of truth for UI logic
- Schema versioning for migrations
- Component reuse across modules
- Centralized security controls

---

## PrimeVue 4 Foundation & Design System

### Why PrimeVue 4?

**Enterprise Requirements:**
- WCAG 2.1 AA accessibility compliance
- Comprehensive component library (250+ components)
- Professional design system
- Enterprise support available

**Technical Advantages:**
- Vue 3 Composition API native
- TypeScript support throughout
- Design token architecture
- Pass Through API for deep customization

**Business Benefits:**
- Reduced development time
- Lower maintenance costs
- Professional appearance
- Future-proof technology stack

### PrimeVue 4 Architecture

**Design Token System:**
```
Primitive Tokens (Colors, Sizes)
    ↓
Semantic Tokens (Primary, Surface, etc.)
    ↓
Component Tokens (Button.background, etc.)
    ↓
CSS Variables (--p-primary-color, etc.)
```

**Three-Tier Token Structure:**

1. **Primitive Tokens**: Raw values like `blue-500`, `spacing-4`
2. **Semantic Tokens**: Contextual values like `primary.color`, `surface.background`
3. **Component Tokens**: Specific values like `button.background`, `datatable.header.background`

### Key Features for ERP Development

**Accessibility:**
- WCAG 2.1 AA compliance built-in
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

**Theming:**
- Design token architecture
- Multi-tenant theme support
- Dark/light mode switching
- CSS-in-JS or traditional CSS

**Components:**
- 250+ pre-built components
- Form components with validation
- Advanced data tables
- Charts and visualizations

**Integration:**
- Auto-import support
- Vue 3 Composition API
- TypeScript definitions
- Nuxt module available

---

## Atomic Design Methodology

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT HIERARCHY                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  SCHEMA RENDERERS (Top Level - Consume JSON Schemas)                    │
│  └── DocumentPage, DashboardPage, ReportPage                            │
│      └── These read JSON and render appropriate components              │
│                                                                          │
│  TEMPLATES (Page Layouts)                                                │
│  └── MainLayout, AuthLayout, BlankLayout                                │
│      └── Define regions: header, content, sidebar, footer               │
│                                                                          │
│  ORGANISMS (Complex Components - Composed of Molecules)                  │
│  └── DataTableCrud, FormBuilder, FormDrawer, ChartWidget                │
│      └── Full-featured, self-contained functionality                    │
│      └── Use PrimeVue components internally                             │
│                                                                          │
│  MOLECULES (Simple Compositions - PrimeVue + Custom Logic)              │
│  └── FormField, SearchBar, StatCard, ActionMenu, EmptyState             │
│      └── Combine PrimeVue atoms with specific behavior                  │
│                                                                          │
│  ATOMS (Base Elements - USE PRIMEVUE DIRECTLY)                          │
│  └── Button, InputText, Select, DataTable, Dialog, etc.                 │
│      └── DON'T wrap PrimeVue atoms unless adding real value             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Design Principles

**1. Atom Level - Use PrimeVue Directly**
- Don't wrap PrimeVue components unnecessarily
- Use PrimeVue's theming and styling
- Leverage Pass Through API for customization

**2. Molecule Level - Add Business Logic**
- Combine atoms for specific use cases
- Add validation, formatting, or behavior
- Create reusable patterns

**3. Organism Level - Complete Features**
- Self-contained functional components
- Handle their own state and side effects
- Integrate with services and APIs

**4. Template Level - Layout Structure**
- Define page regions and navigation
- Handle responsive behavior
- Provide component slots

**5. Page Level - Complete Experiences**
- Route-level components
- Integrate with stores and services
- Handle page-specific logic

### Why This Approach Works

**Scalability:**
- Clear component boundaries
- Predictable component interfaces
- Easy to test and maintain

**Reusability:**
- Lower-level components used across pages
- Consistent patterns throughout application
- Easier onboarding for new developers

**Maintainability:**
- Single responsibility principle
- Clear dependency hierarchy
- Easier debugging and troubleshooting

---

## Multi-Level Access Control

Enterprise ERP systems require sophisticated access control at multiple levels:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ACCESS CONTROL HIERARCHY                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LAYER 1: SUBSCRIPTION (Tenant Level) ─────────────────────────────────│
│  ├── Which MODULES are available? (Evaluated on Backend)               │
│  ├── Which FEATURES within modules? (Evaluated on Backend)             │
│  └── What LIMITS apply? (users, records, storage)                      │
│                                                                          │
│  LAYER 2: MODULE ACCESS (Role Level) ──────────────────────────────────│
│  ├── Which modules can this ROLE access? (Evaluated on Backend)        │
│  ├── What ACTIONS within each module? (Evaluated on Backend)           │
│  └── What DATA SCOPE? (own, department, all)                           │
│                                                                          │
│  LAYER 3: FIELD ACCESS (ABAC - Attribute Level) ───────────────────────│
│  ├── Which FIELDS can user see? (Backend sends filtered schema)        │
│  ├── Which FIELDS can user edit? (Backend marks as readonly)           │
│  └── What VALUES can user set? (Backend validates on submit)           │
│                                                                          │
│  LAYER 4: UI CONDITIONS (Frontend Only) ───────────────────────────────│
│  ├── Which FIELDS are visible? (Based on form values)                  │
│  ├── Which FIELDS are enabled? (Based on form state)                   │
│  └── Which FIELDS are required? (Conditional requirements)             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Access Control Implementation

**Backend Responsibilities:**
- Subscription-level feature access
- Role-based module permissions
- Field-level data filtering
- Security policy enforcement

**Frontend Responsibilities:**
- UI state management
- Form field visibility
- User experience optimization
- Performance caching

**Security Principles:**
- Backend is authoritative for all security decisions
- Frontend provides UX hints only
- Never trust client-side access checks
- Always validate on server side

---

# Part II: Architecture & Design

## System Architecture Overview

### Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DHOOLUI ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                        GO BACKEND                                │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │    │
│  │  │   Schema    │  │  Condition  │  │       ABAC Policy       │  │    │
│  │  │   Storage   │  │   Engine    │  │       Evaluator         │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │    │
│  │         │                │                      │                │    │
│  │         └────────────────┼──────────────────────┘                │    │
│  │                          │                                       │    │
│  │                    REST API                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐│    │
│  │  │            JSON Schema + Access Metadata                   ││    │
│  │  └─────────────────────────────────────────────────────────────┘│    │
│  └──────────────────────────┼──────────────────────────────────────┘    │
│                             │                                            │
│  ┌──────────────────────────┼──────────────────────────────────────┐    │
│  │                    VUE FRONTEND                                  │    │
│  │                          │                                       │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │    │
│  │  │   Schema    │  │  Condition  │  │       Access            │  │    │
│  │  │   Service   │  │  Evaluator  │  │       Service           │  │    │
│  │  │  (Client)   │  │  (Client)   │  │                         │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │    │
│  │         │                │                      │                │    │
│  │         └────────────────┼──────────────────────┘                │    │
│  │                          │                                       │    │
│  │  ┌───────────────────────┴───────────────────────────────────┐  │    │
│  │  │                  SCHEMA RENDERERS                          │  │    │
│  │  │  DocumentPage | DashboardPage | FormBuilder | DataTable    │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  │                          │                                       │    │
│  │  ┌───────────────────────┴───────────────────────────────────┐  │    │
│  │  │                 PRIMEVUE COMPONENTS                        │  │    │
│  │  │     Button | DataTable | Form | Dialog | Chart             │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**1. Schema-First Design**
- JSON schemas define all UI behavior
- Runtime schema interpretation
- Backend-driven UI configuration

**2. PrimeVue Foundation**
- Use PrimeVue components as base atoms
- Extend with custom molecules and organisms
- Maintain design system consistency

**3. Service-Oriented Frontend**
- Access control service
- Schema management service
- Condition evaluation service

**4. Clear Separation of Concerns**
- Backend handles security and business logic
- Frontend focuses on UX and presentation
- Schema acts as contract between layers

---

## Backend vs Frontend Processing

Understanding what happens where is critical for proper implementation:

### Backend Responsibilities (Go)

| Concern | Backend Processing | Notes |
|---------|-------------------|-------|
| **Schema Storage** | Stores, versions, and retrieves schemas | PostgreSQL with JSON columns |
| **Schema Validation** | Validates schema structure on save | JSON Schema validation |
| **ABAC Policy Evaluation** | Evaluates complex access conditions | Uses condition package |
| **Data-Level Security** | Applies Row-Level Security | PostgreSQL RLS policies |
| **API Authorization** | Checks if user can perform action | Middleware layer |
| **Workflow Transitions** | Validates state machine transitions | Business logic layer |
| **Condition Evaluation** | Evaluates complex business rules | Full condition engine |
| **Field-Level Permissions** | Returns which fields user can see/edit | Part of API response |
| **Default Value Generation** | Server-generated defaults (IDs, codes) | Business logic layer |

### Frontend Responsibilities (Vue)

| Concern | Frontend Processing | Notes |
|---------|-------------------|-------|
| **Schema Parsing** | Reads and interprets schema | TypeScript types |
| **UI Rendering** | Generates components from schema | PrimeVue components |
| **Client Validation** | Real-time form validation | UX enhancement only |
| **Simple Conditions** | Field dependencies (show/hide/enable) | Local state only |
| **Optimistic UI** | Immediate UI updates | Rollback on error |
| **Caching** | Schema and data caching | Vue Query |
| **Theme Application** | CSS variable injection | Multi-tenant theming |
| **Layout Management** | Responsive grid, sections | CSS/Tailwind |

### Critical Security Principle

```typescript
/**
 * CRITICAL: Conditions are evaluated in TWO places
 * 
 * BACKEND (Authoritative):
 * - ABAC policy conditions (can user access this resource?)
 * - Workflow transition conditions (can this state change happen?)
 * - Complex business rules with database lookups
 * - Field-level access based on user attributes
 * 
 * FRONTEND (UX Enhancement Only):
 * - Field visibility (show/hide based on other field values)
 * - Field enabling (disable inputs based on form state)
 * - Required field toggling (make field required conditionally)
 * - Value setting (auto-fill based on selections)
 * 
 * The frontend condition evaluator is a SUBSET of the backend's
 * capability. Never trust frontend for security decisions.
 */
```

### What the Frontend Should NEVER Do

```typescript
// ❌ NEVER evaluate security conditions on frontend
const canDeleteInvoice = evaluateCondition({
  attribute: 'user.role',
  operator: 'eq',
  value: 'admin'
}); // WRONG - this should come from backend

// ✅ Frontend should only handle UI state
const showCompanyFields = evaluateCondition({
  field: 'customerType',
  operator: 'eq',
  value: 'company'
}); // CORRECT - simple UI logic
```

---

# Part III: PrimeVue Components & Implementation

## PrimeVue Component Library Strategy

### Component Integration Philosophy

**1. Use PrimeVue Directly for Atoms**
- Don't wrap basic components unnecessarily
- Leverage PrimeVue's theming system
- Use Pass Through API for customizations

**2. Extend for Business Logic**
- Create molecules that combine PrimeVue atoms
- Add validation, formatting, and behavior
- Build reusable patterns for ERP use cases

**3. Build Complex Organisms**
- DataTable with CRUD operations
- Form builders with validation
- Dashboard widgets

### Installation & Setup

#### Basic Installation

```bash
# Using pnpm (recommended)
pnpm add primevue @primeuix/themes primeicons

# Using npm
npm install primevue @primeuix/themes primeicons

# Using yarn
yarn add primevue @primeuix/themes primeicons
```

#### Auto-Import Setup (Recommended)

```bash
pnpm add --save-dev unplugin-vue-components @primevue/auto-import-resolver
```

```javascript
// vite.config.js
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default {
    plugins: [
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ]
};
```

#### PrimeVue Configuration

```javascript
// main.js
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import App from './App.vue';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    },
    ripple: true,
    inputVariant: 'outlined' // or 'filled'
});

app.mount('#app');
```

---

## Atoms: Core UI Elements

### Basic Form Elements

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **InputText** | Single-line text input | ✅ Essential | Early (MVP) | Fluid, validation, icons |
| **Textarea** | Multi-line text input | ✅ Essential | Early (MVP) | Auto-resize, char counter |
| **InputNumber** | Numeric input with controls | ✅ Essential | Early (MVP) | Min/max, step, locale formatting |
| **InputMask** | Formatted text input | ✅ Essential | Early (MVP) | Phone, date, custom patterns |
| **InputSwitch** | Toggle switch | ✅ Essential | Early (MVP) | True/false values |
| **Checkbox** | Selection checkbox | ✅ Essential | Early (MVP) | Single/multiple, indeterminate |
| **RadioButton** | Single selection | ✅ Essential | Early (MVP) | Group management |
| **Password** | Password input | ✅ Essential | Early (Security) | Strength indicator, toggle mask |

#### ERP Implementation Tips:
- Use `InputNumber` with `currency` mode for financial inputs
- Apply `InputMask` for standardized data entry (SSN, phone, tax IDs)
- Leverage `Password` strength indicators for security compliance
- Combine `Checkbox` with `DataTable` for bulk operations

### Button Elements

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Button** | Standard button | ✅ Essential | Early (MVP) | Icons, badges, loading state |
| **ToggleButton** | Two-state toggle | 🔹 Useful | Mid | Icon-only mode |
| **SplitButton** | Button with dropdown | 🔹 Useful | Mid | Contextual actions |
| **SpeedDial** | Floating action button | ⚠️ Optional | Late | Circular/linear/quarter modes |

#### Enhanced Button Example:

```vue
<Button 
    label="Save Order" 
    icon="pi pi-check" 
    severity="success"
    :loading="isSaving"
    @click="saveOrder"
/>

<SplitButton 
    label="Export" 
    :model="exportOptions" 
    icon="pi pi-download"
/>
```

### Display Elements

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Badge** | Status indicator | ✅ Essential | Mid | Overlap mode, custom values |
| **Chip** | Compact info display | 🔹 Useful | Mid | Removable, icons, images |
| **Tag** | Categorization label | 🔹 Useful | Mid | Rounded, severity colors |
| **Avatar** | User profile image | ✅ Essential | Early | Initials, images, groups |
| **ProgressBar** | Linear progress | ✅ Essential | Early | Determinate/indeterminate |
| **ProgressSpinner** | Circular loading | ✅ Essential | Early | Custom size/color |

#### ERP Use Cases:
- **Badge**: Show notification counts, pending approvals
- **Tag**: Display order status, priority levels
- **Avatar**: User identification in activity logs
- **ProgressBar**: File upload, batch processing progress

---

## Molecules: Composite Components

### Advanced Form Components

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **AutoComplete** | Search with suggestions | ✅ Essential | Early | Remote search, templates, virtual scroll |
| **Select (Dropdown)** | Single selection | ✅ Essential | Early (MVP) | Filter, lazy loading, grouping |
| **MultiSelect** | Multiple selection | ✅ Essential | Early | Select all, chip display, filter |
| **Calendar/DatePicker** | Date selection | ✅ Essential | Early | Range, time, multiple, restrictions |
| **FileUpload** | File upload interface | ✅ Essential | Early | Multiple, drag-drop, preview, validation |
| **TreeSelect** | Tree-based selection | ✅ Essential | Mid | Checkbox selection, lazy loading |

#### Advanced Dropdown Example:

```vue
<Select 
    v-model="selectedCustomer"
    :options="customers"
    optionLabel="name"
    optionValue="id"
    filter
    filterPlaceholder="Search customer"
    placeholder="Select Customer"
    :loading="loadingCustomers"
    class="w-full"
>
    <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center gap-2">
            <Avatar :label="slotProps.value.name.charAt(0)" shape="circle" />
            <span>{{ slotProps.value.name }}</span>
        </div>
    </template>
    
    <template #option="slotProps">
        <div class="flex items-center gap-2">
            <Avatar :label="slotProps.option.name.charAt(0)" shape="circle" />
            <div>
                <div>{{ slotProps.option.name }}</div>
                <small class="text-muted-color">{{ slotProps.option.email }}</small>
            </div>
        </div>
    </template>
</Select>
```

### ERP Best Practices:
- Use `AutoComplete` for customer/product lookups with large datasets
- Implement `MultiSelect` for batch filtering and report parameters
- Apply `Calendar` with `selectionMode="range"` for date range filters
- Utilize `FileUpload` with validation for document management

### Message Components

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Message** | Inline message | ✅ Essential | Early | Severity levels, closable |
| **InlineMessage** | Contextual message | ✅ Essential | Early | Compact, severity icons |
| **Toast** | Notification popup | ✅ Essential | Early | Positions, life time, sticky |

#### Toast Service Example:

```javascript
// Composition API
import { useToast } from 'primevue/usetoast';

const toast = useToast();

toast.add({
    severity: 'success',
    summary: 'Order Saved',
    detail: 'Order #12345 has been saved successfully',
    life: 3000
});
```

---

## Organisms: Complex Components

### Navigation Components

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Menu** | Standard menu | ✅ Essential | Early | Vertical/horizontal, templates |
| **TieredMenu** | Nested menu | ✅ Essential | Early | Popup/inline mode |
| **Menubar** | Horizontal menu bar | ✅ Essential | Early | Start/end templates |
| **PanelMenu** | Accordion-style menu | ✅ Essential | Early | Multiple expand |
| **Breadcrumb** | Navigation trail | ✅ Essential | Early | Home icon, separator |
| **Steps** | Process indicator | ✅ Essential | Mid | Clickable, readonly |

#### ERP Navigation Example:

```vue
<template>
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <div class="w-64 bg-surface-50 dark:bg-surface-900">
            <PanelMenu :model="menuItems" />
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <Menubar :model="topMenuItems">
                <template #start>
                    <img src="logo.png" height="40" />
                </template>
                <template #end>
                    <Avatar icon="pi pi-user" shape="circle" />
                </template>
            </Menubar>
            
            <Breadcrumb :home="home" :model="breadcrumbItems" class="p-3" />
            
            <div class="flex-1 p-4">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
const menuItems = ref([
    {
        label: 'Sales',
        icon: 'pi pi-shopping-cart',
        items: [
            { label: 'Orders', icon: 'pi pi-list', to: '/orders' },
            { label: 'Quotes', icon: 'pi pi-file', to: '/quotes' },
            { label: 'Invoices', icon: 'pi pi-money-bill', to: '/invoices' }
        ]
    },
    {
        label: 'Inventory',
        icon: 'pi pi-box',
        items: [
            { label: 'Products', icon: 'pi pi-tag', to: '/products' },
            { label: 'Warehouses', icon: 'pi pi-building', to: '/warehouses' }
        ]
    }
]);
</script>
```

---

## DataTable: The Heart of ERP Systems

**Most Critical Component for ERP Systems**

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **DataTable** ⭐ | Advanced data grid | ✅ **CRITICAL** | Early | See detailed implementation below |
| **Tree** | Hierarchical tree | ✅ Essential | Early | Drag-drop, templates, filtering |
| **TreeTable** | Tree in table format | 🔹 Useful | Mid | Combines Tree + DataTable features |
| **Chart** | Data visualization | ✅ Essential | Mid | Chart.js integration |

### Essential DataTable Features for ERP:

#### 1. Pagination & Lazy Loading

```vue
<DataTable 
    :value="products"
    :lazy="true"
    :paginator="true"
    :rows="10"
    :totalRecords="totalRecords"
    :loading="loading"
    @page="onPage"
    @sort="onSort"
    @filter="onFilter"
>
    <Column field="code" header="Code" sortable />
    <Column field="name" header="Name" sortable />
    <Column field="price" header="Price" sortable />
</DataTable>
```

#### 2. Advanced Filtering

```vue
<DataTable 
    :value="products"
    v-model:filters="filters"
    filterDisplay="row"
    :globalFilterFields="['name', 'code', 'category']"
>
    <template #header>
        <div class="flex justify-end">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
        </div>
    </template>
    
    <Column field="name" header="Name" :showFilterMenu="false">
        <template #filter="{ filterModel, filterCallback }">
            <InputText 
                v-model="filterModel.value" 
                @keydown.enter="filterCallback()" 
                placeholder="Search by name"
            />
        </template>
    </Column>
    
    <Column field="category" header="Category" :showFilterMenu="false">
        <template #filter="{ filterModel, filterCallback }">
            <Select
                v-model="filterModel.value"
                :options="categories"
                @change="filterCallback()"
                placeholder="Select Category"
            />
        </template>
    </Column>
</DataTable>
```

#### 3. Selection & Bulk Operations

```vue
<DataTable 
    :value="orders"
    v-model:selection="selectedOrders"
    dataKey="id"
    :selectAll="selectAll"
    @select-all-change="onSelectAllChange"
>
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column field="orderNumber" header="Order #" />
    <Column field="customer" header="Customer" />
    <Column field="status" header="Status">
        <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
        </template>
    </Column>
</DataTable>

<Toolbar v-if="selectedOrders.length > 0" class="mb-4">
    <template #start>
        <span class="text-lg">{{ selectedOrders.length }} items selected</span>
    </template>
    <template #end>
        <Button label="Approve All" icon="pi pi-check" severity="success" @click="approveSelected" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteSelected" />
    </template>
</Toolbar>
```

#### 4. Export Functionality

```vue
<DataTable ref="dt" :value="products" :exportFilename="exportFilename">
    <template #header>
        <div class="flex justify-end gap-2">
            <Button 
                label="Export CSV" 
                icon="pi pi-file" 
                severity="secondary"
                @click="exportCSV($event)" 
            />
            <Button 
                label="Export Excel" 
                icon="pi pi-file-excel" 
                severity="success"
                @click="exportExcel" 
            />
        </div>
    </template>
    <!-- columns -->
</DataTable>

<script setup>
const dt = ref();

const exportCSV = () => {
    dt.value.exportCSV();
};

const exportExcel = () => {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(products.value);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        saveAsExcelFile(excelBuffer, 'products');
    });
};
</script>
```

### DataTable Performance Tips:
- Always use `:lazy="true"` for datasets > 1000 records
- Implement server-side pagination, sorting, and filtering
- Use `virtualScrollerOptions` for very large datasets
- Freeze important columns for better UX
- Cache filter configurations in localStorage

---

# Part IV: Project Setup & Configuration

## Project Setup & Installation

### Prerequisites

```bash
# Node.js version requirements
node --version  # Should be ^20.19.0 || >=22.12.0

# Recommended package manager
npm install -g pnpm
```

### Create New Project

```bash
# Using Vue CLI
npm create vue@latest my-erp-system

# Or using Vite directly
pnpm create vue my-erp-system
```

### Install Dependencies

```bash
# Navigate to project
cd my-erp-system

# Install core dependencies
pnpm install

# Install PrimeVue and related packages
pnpm add primevue @primeuix/themes primeicons

# Install development dependencies
pnpm add --save-dev unplugin-vue-components @primevue/auto-import-resolver
```

---

## PrimeVue 4 Configuration & Theming

### Main Application Setup

```typescript
// src/main.ts
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'

// Import styles
import 'primeicons/primeicons.css'

import App from './App.vue'

// Custom theme preset
const DhoolPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    }
})

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: DhoolPreset,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark',
            cssLayer: false
        }
    },
    ripple: true,
    inputVariant: 'outlined'
})

// Services
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)

app.mount('#app')
```

### Auto-Import Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

### Tailwind CSS Integration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': 'rgb(var(--p-primary-500))',
        'surface': 'rgb(var(--p-surface-0))',
      }
    },
  },
  plugins: [require('tailwindcss-primeui')]
}
```

### Theme Customization Example

```typescript
// src/theme/custom.ts
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const CustomPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617'
                }
            },
            dark: {
                surface: {
                    0: '#020617',
                    50: '#0f172a',
                    100: '#1e293b',
                    200: '#334155',
                    300: '#475569',
                    400: '#64748b',
                    500: '#94a3b8',
                    600: '#cbd5e1',
                    700: '#e2e8f0',
                    800: '#f1f5f9',
                    900: '#f8fafc',
                    950: '#ffffff'
                }
            }
        }
    }
})
```

---

# Part V: Services & State Management

## Access Control Service

```typescript
// src/services/accessService.ts
/**
 * Access control service for UI-level permission checks.
 * IMPORTANT: This service provides UI hints only.
 * Backend is authoritative for all security decisions.
 */

import type { 
  FieldSchema, 
  ActionSchema, 
  DocumentSchema,
  AccessContext,
  DataScope 
} from '@/types/schema'

interface AccessCheckResult {
  allowed: boolean
  scope?: DataScope
  hiddenFields?: string[]
  readonlyFields?: string[]
  reason?: string
}

interface FieldAccessResult {
  visible: boolean
  editable: boolean
  reason?: string
}

class AccessService {
  private cache = new Map<string, AccessCheckResult>()

  /**
   * Check if user can perform action on resource.
   * This is a client-side hint - backend must verify.
   */
  async checkAccess(
    context: AccessContext,
    action: string
  ): Promise<AccessCheckResult> {
    const cacheKey = this.getCacheKey(context)
    
    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached) return cached

    // Check subscription level
    const subscriptionCheck = this.checkSubscriptionAccess(context)
    if (!subscriptionCheck.allowed) {
      this.cache.set(cacheKey, subscriptionCheck)
      return subscriptionCheck
    }

    // Check role level
    const roleCheck = this.checkRoleAccess(context, action)
    this.cache.set(cacheKey, roleCheck)
    
    return roleCheck
  }

  /**
   * Check subscription-level access.
   */
  private checkSubscriptionAccess(context: AccessContext): AccessCheckResult {
    const { subscription, resource } = context

    // Check if required module is enabled
    if (resource?.module) {
      if (!subscription.modules.includes(resource.module)) {
        return { 
          allowed: false, 
          reason: 'module_not_enabled' 
        }
      }
    }

    return { allowed: true }
  }

  /**
   * Check role-level access.
   */
  private checkRoleAccess(context: AccessContext, action: string): AccessCheckResult {
    const { user, resource } = context

    // Get effective permissions from all roles
    let bestScope: DataScope = 'none'
    const hiddenFields: string[] = []
    const readonlyFields: string[] = []

    for (const roleName of user.roles) {
      const role = this.roles.get(roleName)
      if (!role) continue

      for (const moduleAccess of Object.values(role.modules)) {
        if (!moduleAccess.enabled) continue

        const docAccess = moduleAccess.documents[resource.type]
        if (!docAccess) continue

        const actionScope = this.getActionScope(docAccess, action)
        if (actionScope && this.isBetterScope(actionScope, bestScope)) {
          bestScope = actionScope
        }

        if (docAccess.hiddenFields) {
          hiddenFields.push(...docAccess.hiddenFields)
        }
        if (docAccess.readonlyFields) {
          readonlyFields.push(...docAccess.readonlyFields)
        }
      }
    }

    if (bestScope === 'none') {
      return { allowed: false, reason: 'role_not_allowed' }
    }

    return {
      allowed: true,
      scope: bestScope,
      hiddenFields: [...new Set(hiddenFields)],
      readonlyFields: [...new Set(readonlyFields)],
    }
  }

  /**
   * Check field-level access (UI hints).
   */
  checkFieldAccess(
    field: FieldSchema,
    context: AccessContext,
    mode: 'read' | 'write' = 'read'
  ): FieldAccessResult {
    const access = field.access

    if (!access) {
      return { visible: true, editable: true }
    }

    // Check subscription plan
    if (access.requiredPlan && access.requiredPlan.length > 0) {
      if (!access.requiredPlan.includes(context.subscription.plan)) {
        return { visible: false, editable: false, reason: 'plan_upgrade_required' }
      }
    }

    // Check module
    if (access.requiredModule) {
      if (!context.subscription.modules.includes(access.requiredModule)) {
        return { visible: false, editable: false, reason: 'module_not_enabled' }
      }
    }

    // Check roles for read
    if (access.readRoles && access.readRoles.length > 0) {
      const hasReadRole = access.readRoles.some(role => context.user.roles.includes(role))
      if (!hasReadRole) {
        return { visible: false, editable: false, reason: 'role_not_allowed' }
      }
    }

    // Check roles for write
    let editable = true
    if (mode === 'write' && access.writeRoles && access.writeRoles.length > 0) {
      const hasWriteRole = access.writeRoles.some(role => context.user.roles.includes(role))
      if (!hasWriteRole) {
        editable = false
      }
    }

    return { visible: true, editable }
  }

  /**
   * Check action-level access.
   */
  checkActionAccess(action: ActionSchema, context: AccessContext): boolean {
    const access = action.access

    if (!access) return true

    // Check plan
    if (access.requiredPlan && access.requiredPlan.length > 0) {
      if (!access.requiredPlan.includes(context.subscription.plan)) {
        return false
      }
    }

    // Check module
    if (access.requiredModule) {
      if (!context.subscription.modules.includes(access.requiredModule)) {
        return false
      }
    }

    // Check permissions
    if (access.requiredPermissions && access.requiredPermissions.length > 0) {
      const hasPermission = access.requiredPermissions.some(
        perm => context.user.permissions.includes(perm)
      )
      if (!hasPermission) return false
    }

    // Check roles
    if (access.requiredRoles && access.requiredRoles.length > 0) {
      const hasRole = access.requiredRoles.some(role => context.user.roles.includes(role))
      if (!hasRole) return false
    }

    return true
  }

  private getCacheKey(context: AccessContext): string {
    return JSON.stringify({
      userId: context.user.id,
      resourceType: context.resource?.type,
      resourceId: context.resource?.id,
      action: context.action,
    })
  }

  clearCache() {
    this.cache.clear()
  }
}

export const accessService = new AccessService()
```

---

## Schema Engine Service

```typescript
// src/services/schemaService.ts
/**
 * Schema loading and management service.
 * Handles fetching, caching, and parsing document schemas.
 */

import type { 
  DocumentSchema, 
  DashboardSchema, 
  FieldSchema, 
  ColumnSchema 
} from '@/types/schema'
import api from './api'

class SchemaService {
  private documentCache = new Map<string, DocumentSchema>()
  private dashboardCache = new Map<string, DashboardSchema>()
  private cacheTimeout = 10 * 60 * 1000 // 10 minutes

  /**
   * Get document schema by type.
   * Tries API first, falls back to local JSON.
   */
  async getDocumentSchema(docType: string): Promise<DocumentSchema> {
    const cached = this.documentCache.get(docType)
    if (cached) {
      return cached
    }

    try {
      // Try API first
      const response = await api.get(`/schemas/documents/${docType}`)
      const schema = response.data as DocumentSchema
      
      // Validate schema
      this.validateDocumentSchema(schema)
      
      // Cache it
      this.documentCache.set(docType, schema)
      
      // Auto-expire cache
      setTimeout(() => {
        this.documentCache.delete(docType)
      }, this.cacheTimeout)
      
      return schema
    } catch (error) {
      // Fallback to local schema
      try {
        const module = await import(`@/schemas/${docType}.json`)
        const schema = module.default as DocumentSchema
        this.validateDocumentSchema(schema)
        return schema
      } catch (fallbackError) {
        throw new Error(`Schema not found: ${docType}`)
      }
    }
  }

  /**
   * Get dashboard schema by type.
   */
  async getDashboardSchema(dashboardType: string): Promise<DashboardSchema> {
    const cached = this.dashboardCache.get(dashboardType)
    if (cached) {
      return cached
    }

    try {
      const response = await api.get(`/schemas/dashboards/${dashboardType}`)
      const schema = response.data as DashboardSchema
      
      this.validateDashboardSchema(schema)
      this.dashboardCache.set(dashboardType, schema)
      
      setTimeout(() => {
        this.dashboardCache.delete(dashboardType)
      }, this.cacheTimeout)
      
      return schema
    } catch (error) {
      throw new Error(`Dashboard schema not found: ${dashboardType}`)
    }
  }

  /**
   * Extract fields from document schema.
   */
  getFields(schema: DocumentSchema): FieldSchema[] {
    return schema.formView.fields
  }

  /**
   * Extract columns from document schema.
   */
  getColumns(schema: DocumentSchema): ColumnSchema[] {
    return schema.listView.columns
  }

  /**
   * Extract toolbar actions from schema.
   */
  getToolbarActions(schema: DocumentSchema) {
    return schema.listView.toolbarActions || []
  }

  /**
   * Extract row actions from schema.
   */
  getRowActions(schema: DocumentSchema) {
    return schema.listView.rowActions || []
  }

  /**
   * Get field by name.
   */
  getField(schema: DocumentSchema, fieldName: string): FieldSchema | undefined {
    return schema.formView.fields.find(field => field.name === fieldName)
  }

  /**
   * Get API configuration from schema.
   */
  getApiConfig(schema: DocumentSchema) {
    return schema.api
  }

  /**
   * Validate document schema structure.
   */
  private validateDocumentSchema(schema: DocumentSchema): void {
    if (!schema.name) {
      throw new Error('Schema missing required field: name')
    }
    if (!schema.label) {
      throw new Error('Schema missing required field: label')
    }
    if (!schema.formView) {
      throw new Error('Schema missing required field: formView')
    }
    if (!schema.listView) {
      throw new Error('Schema missing required field: listView')
    }
    if (!schema.api) {
      throw new Error('Schema missing required field: api')
    }
  }

  /**
   * Validate dashboard schema structure.
   */
  private validateDashboardSchema(schema: DashboardSchema): void {
    if (!schema.name) {
      throw new Error('Dashboard schema missing required field: name')
    }
    if (!schema.widgets) {
      throw new Error('Dashboard schema missing required field: widgets')
    }
  }

  /**
   * Clear all caches.
   */
  clearCache(): void {
    this.documentCache.clear()
    this.dashboardCache.clear()
  }

  /**
   * Preload commonly used schemas.
   */
  async preloadSchemas(docTypes: string[]): Promise<void> {
    const promises = docTypes.map(docType => 
      this.getDocumentSchema(docType).catch(console.warn)
    )
    await Promise.all(promises)
  }
}

export const schemaService = new SchemaService()
```

---

## Composables & State Management

### useSchema Composable

```typescript
// src/composables/useSchema.ts
import { ref, computed, watch } from 'vue'
import type { DocumentSchema, FieldSchema, ColumnSchema } from '@/types/schema'
import { schemaService } from '@/services/schemaService'

export function useSchema(docType: string) {
  const schema = ref<DocumentSchema | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const fields = computed<FieldSchema[]>(() => {
    return schema.value?.formView.fields || []
  })

  const columns = computed<ColumnSchema[]>(() => {
    return schema.value?.listView.columns || []
  })

  const toolbarActions = computed(() => {
    return schema.value?.listView.toolbarActions || []
  })

  const rowActions = computed(() => {
    return schema.value?.listView.rowActions || []
  })

  const apiConfig = computed(() => {
    return schema.value?.api
  })

  // Methods
  const loadSchema = async (type?: string) => {
    const schemaType = type || docType
    loading.value = true
    error.value = null

    try {
      schema.value = await schemaService.getDocumentSchema(schemaType)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load schema'
      console.error('Schema loading error:', err)
    } finally {
      loading.value = false
    }
  }

  const getField = (fieldName: string): FieldSchema | undefined => {
    return fields.value.find(field => field.name === fieldName)
  }

  const getColumn = (fieldName: string): ColumnSchema | undefined => {
    return columns.value.find(column => column.field === fieldName)
  }

  // Auto-load schema when docType changes
  watch(() => docType, loadSchema, { immediate: true })

  return {
    schema,
    loading,
    error,
    fields,
    columns,
    toolbarActions,
    rowActions,
    apiConfig,
    loadSchema,
    getField,
    getColumn
  }
}
```

### useCrud Composable

```typescript
// src/composables/useCrud.ts
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { CrudOperations, PaginationParams } from '@/types/crud'
import api from '@/services/api'

export function useCrud<T = any>(docType: string): CrudOperations<T> {
  const items = ref<T[]>([])
  const loading = ref(false)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(25)
  const selectedItem = ref<T | null>(null)
  
  const toast = useToast()

  // Computed properties
  const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))
  const hasNext = computed(() => currentPage.value < totalPages.value)
  const hasPrev = computed(() => currentPage.value > 1)

  // CRUD Operations
  const fetchList = async (params?: PaginationParams) => {
    loading.value = true
    try {
      const response = await api.get(`/api/v1/${docType}`, { params })
      items.value = response.data.items || response.data
      totalItems.value = response.data.total || items.value.length
      currentPage.value = response.data.page || 1
    } catch (error) {
      console.error('Failed to fetch items:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load data'
      })
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Partial<T>): Promise<T> => {
    loading.value = true
    try {
      const response = await api.post(`/api/v1/${docType}`, data)
      const newItem = response.data
      items.value.unshift(newItem)
      totalItems.value++
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item created successfully'
      })
      
      return newItem
    } catch (error) {
      console.error('Failed to create item:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create item'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string | number, data: Partial<T>): Promise<T> => {
    loading.value = true
    try {
      const response = await api.put(`/api/v1/${docType}/${id}`, data)
      const updatedItem = response.data
      
      const index = items.value.findIndex((item: any) => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item updated successfully'
      })
      
      return updatedItem
    } catch (error) {
      console.error('Failed to update item:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update item'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: string | number): Promise<void> => {
    loading.value = true
    try {
      await api.delete(`/api/v1/${docType}/${id}`)
      
      items.value = items.value.filter((item: any) => item.id !== id)
      totalItems.value--
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item deleted successfully'
      })
    } catch (error) {
      console.error('Failed to delete item:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete item'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const bulkDelete = async (ids: (string | number)[]): Promise<void> => {
    loading.value = true
    try {
      await api.post(`/api/v1/${docType}/bulk-delete`, { ids })
      
      items.value = items.value.filter((item: any) => !ids.includes(item.id))
      totalItems.value -= ids.length
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `${ids.length} items deleted successfully`
      })
    } catch (error) {
      console.error('Failed to bulk delete items:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete items'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const selectItem = (item: T | null) => {
    selectedItem.value = item
  }

  const refresh = () => {
    fetchList({ page: currentPage.value, limit: pageSize.value })
  }

  // Permission checking (placeholder)
  const canPerform = (action: string): boolean => {
    // This would integrate with the access service
    return true
  }

  return {
    // State
    items,
    loading,
    totalItems,
    currentPage,
    totalPages,
    pageSize,
    hasNext,
    hasPrev,
    selectedItem,
    
    // Methods
    fetchList,
    create,
    update,
    remove,
    bulkDelete,
    selectItem,
    refresh,
    canPerform
  }
}
```

---

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Read complete components.md file in sections to understand all content", "status": "completed", "priority": "high", "id": "merge-1"}, {"content": "Read complete ERP-UI-Documentation.md file in sections to understand structure", "status": "completed", "priority": "high", "id": "merge-2"}, {"content": "Analyze llms-full.txt for authoritative PrimeVue component information", "status": "completed", "priority": "high", "id": "merge-3"}, {"content": "Design unified document structure combining both perspectives", "status": "completed", "priority": "high", "id": "merge-4"}, {"content": "Create comprehensive merged documentation file", "status": "completed", "priority": "high", "id": "merge-5"}]