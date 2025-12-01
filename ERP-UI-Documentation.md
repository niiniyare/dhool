# DhoolUI - Complete Documentation V1.0

> A comprehensive Vue 3 + PrimeVue 4 enterprise UI framework with schema-driven UI generation, multi-tenant theming, ABAC security, subscription-based feature access, and module-level permissions. Designed to integrate seamlessly with Go backend condition evaluation engine.

---

## Table of Contents

### Part 1: Philosophy & Architecture
1. [Why Schema-Driven UI?](#why-schema-driven-ui)
2. [Architecture Overview](#architecture-overview)
3. [Backend vs Frontend Processing](#backend-vs-frontend-processing)
4. [Multi-Level Access Control](#multi-level-access-control)
5. [Component Architecture (Atomic Design)](#component-architecture-atomic-design)

### Part 2: Schema System Design V1.0
6. [Schema Design Principles](#schema-design-principles)
7. [Go Backend Condition Package Alignment](#go-backend-condition-package-alignment)
8. [Type System with Full Documentation](#type-system-with-full-documentation)

### Part 3: Project Setup & Configuration
9. [Project Setup](#project-setup)
10. [PrimeVue 4 Configuration](#primevue-4-configuration)
11. [Tailwind Configuration](#tailwind-configuration)

### Part 4: Services & State Management
12. [Access Control System](#access-control-system)
13. [Schema Engine](#schema-engine)
14. [Composables](#composables)
15. [Stores](#stores)

### Part 5: Component Library
16. [PrimeVue Component Integration Strategy](#primevue-component-integration-strategy)
17. [Required PrimeVue Components](#required-primevue-components)
18. [Molecules](#molecules)
19. [Organisms](#organisms)
20. [Schema Renderers](#schema-renderers)

### Part 6: Advanced Features
21. [JSON Schema Examples](#json-schema-examples)
22. [Schema Builder UI](#schema-builder-ui)
23. [Dynamic Route Generation](#dynamic-route-generation)
24. [Multi-Tenant Theming](#multi-tenant-theming)

### Part 7: Application Shell
25. [Layout Components](#layout-components)
26. [API Service](#api-service)
27. [Router Configuration](#router-configuration)
28. [App Initialization](#app-initialization)

### Part 8: Best Practices
29. [Schema Design Best Practices](#schema-design-best-practices)
30. [Component Organization Best Practices](#component-organization-best-practices)
31. [Performance Optimization](#performance-optimization)
32. [Testing Strategy](#testing-strategy)

---

# Part 1: Philosophy & Architecture

## Why Schema-Driven UI?

In enterprise ERP systems, you'll encounter hundreds of similar pages:
- **Document Lists**: Invoices, Orders, Transactions, Users, Products
- **Document Forms**: Create/Edit dialogs with validation
- **Dashboards**: KPIs, charts, activity feeds
- **Reports**: Filtered data exports

Writing individual Vue components for each is:
- **Time-consuming**: 80% of code is repetitive CRUD boilerplate
- **Error-prone**: Inconsistent implementations across developers
- **Hard to maintain**: Changes require touching many files
- **Inflexible**: Backend developers can't modify UI without frontend expertise

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

---

## Architecture Overview

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
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

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

### Condition Evaluation Split

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

### What the Frontend Condition Evaluator Should NOT Do

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

## Multi-Level Access Control

Your SaaS needs three layers of access control:

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

---

## Component Architecture (Atomic Design)

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

---

# Part 2: Schema System Design V1.0

## Schema Design Principles

### V1.0 Design Goals

1. **Parseable**: Schema Builder can easily read/write schemas
2. **Typed**: Clear discriminated unions for type-specific properties
3. **Grouped**: Related properties organized into logical groups
4. **Aligned**: Condition structures match Go backend exactly
5. **Minimal**: Start with essential features, add complexity later
6. **Documented**: Every property has clear purpose and constraints

### Schema Structure Overview

```typescript
/**
 * Schema V1.0 Structure:
 * 
 * DocumentSchema
 * ├── identity (name, label, icon, module)
 * ├── api (endpoints, pagination, response format)
 * ├── listView
 * │   ├── columns[]
 * │   ├── filters[]
 * │   ├── actions (toolbar, row, bulk)
 * │   └── features (search, select, export)
 * ├── formView
 * │   ├── sections[]
 * │   ├── fields[]
 * │   └── actions[]
 * ├── access (permissions by action)
 * ├── workflow (optional state machine)
 * └── meta (version, timestamps)
 */
```

---

## Go Backend Condition Package Alignment

Your Go condition package uses specific operators and structures. The frontend schema MUST align exactly.

### Operator Mapping

```typescript
/**
 * These operators MUST match your Go condition package exactly.
 * See: github.com/niiniyare/erp/pkg/condition
 * 
 * The frontend uses these for UI conditions (field dependencies).
 * The backend uses these for ABAC policies and business rules.
 */
export type ConditionOperator =
  // Comparison Operators
  | 'eq'              // Equal (exact match)
  | 'neq'             // Not equal
  | 'gt'              // Greater than
  | 'gte'             // Greater than or equal (alias: greater_or_equal)
  | 'lt'              // Less than
  | 'lte'             // Less than or equal (alias: less_or_equal)
  
  // Range Operators
  | 'between'         // Within range (inclusive): [min, max]
  | 'not_between'     // Outside range
  
  // String Operators
  | 'contains'        // Substring match
  | 'not_contains'    // Substring not present
  | 'starts_with'     // Prefix match
  | 'ends_with'       // Suffix match
  | 'match_regexp'    // Regex pattern match (use sparingly - ReDoS risk)
  
  // Membership Operators
  | 'in'              // Value in array (alias: select_any_in)
  | 'nin'             // Value not in array (alias: select_not_any_in)
  
  // Null/Empty Operators
  | 'is_empty'        // Value is null, undefined, or empty string
  | 'is_not_empty'    // Value has content
```

### Condition Structure (Aligned with Go)

```typescript
/**
 * Single condition matching Go's ConditionRule structure.
 * 
 * Go equivalent:
 * type ConditionRule struct {
 *     ID    string
 *     Left  Expression
 *     Op    OperatorType
 *     Right any
 * }
 */
export interface Condition {
  /**
   * The field or attribute to evaluate.
   * - For UI conditions: field name in form (e.g., "customerType")
   * - For ABAC: dot-notation path (e.g., "user.department", "resource.status")
   */
  field: string;
  
  /**
   * Comparison operator from ConditionOperator type.
   * Must match Go backend's supported operators exactly.
   */
  operator: ConditionOperator;
  
  /**
   * Value to compare against.
   * Type depends on operator:
   * - 'eq', 'neq': any single value
   * - 'gt', 'gte', 'lt', 'lte': number or date string
   * - 'between': [min, max] tuple
   * - 'in', 'nin': array of values
   * - 'is_empty', 'is_not_empty': value ignored
   */
  value?: unknown;
  
  /**
   * Optional: Reference another field instead of literal value.
   * Matches Go's ValueTypeField expression type.
   * Example: { field: "salary", operator: "lte", fieldRef: "budget" }
   */
  fieldRef?: string;
}

/**
 * Condition group with logical conjunction.
 * 
 * Go equivalent:
 * type ConditionGroup struct {
 *     Conjunction ConjunctionType // AND or OR
 *     Not         bool            // Negate result
 *     Conditions  []ConditionRule
 *     SubGroups   []ConditionGroup
 * }
 */
export interface ConditionGroup {
  /**
   * How to combine conditions in this group.
   * - 'and': All conditions must be true (default)
   * - 'or': At least one condition must be true
   */
  conjunction: 'and' | 'or';
  
  /**
   * Negate the entire group result.
   * Equivalent to wrapping in NOT().
   */
  not?: boolean;
  
  /**
   * List of conditions to evaluate.
   */
  conditions: Condition[];
  
  /**
   * Nested condition groups for complex logic.
   * Example: (A AND B) OR (C AND D)
   */
  groups?: ConditionGroup[];
}
```

### UI-Specific Condition Actions

```typescript
/**
 * Actions that can be triggered by conditions in the UI.
 * These are FRONTEND-ONLY and do not affect security.
 */
export type UIConditionAction = 
  | 'show'        // Make field visible
  | 'hide'        // Hide field
  | 'enable'      // Enable input
  | 'disable'     // Disable input
  | 'require'     // Make field required
  | 'unrequire'   // Make field optional
  | 'set_value';  // Set field to specific value

/**
 * Field dependency for conditional UI behavior.
 * Evaluated entirely on frontend for UX.
 */
export interface FieldDependency {
  /**
   * Conditions that trigger this dependency.
   * Can be single condition or complex group.
   */
  conditions: Condition[] | ConditionGroup;
  
  /**
   * How to combine conditions if array is provided.
   * @default 'and'
   */
  logic?: 'and' | 'or';
  
  /**
   * What action to take when conditions are met.
   */
  action: UIConditionAction;
  
  /**
   * Value to set when action is 'set_value'.
   */
  actionValue?: unknown;
}
```

---

## Type System with Full Documentation

### Core Field Types

```typescript
// src/types/schema.ts

/**
 * =============================================================================
 * FIELD TYPES
 * =============================================================================
 * 
 * V1.0 includes 15 essential field types. Additional types can be added
 * in future versions as needed. Each type maps to specific PrimeVue
 * components and validation rules.
 */

/**
 * Essential field types for V1.0.
 * Each type determines:
 * - Which PrimeVue component to render
 * - What validation rules apply
 * - How data is formatted for display
 * - How data is serialized for API
 */
export type FieldType =
  // Text Input Types
  | 'text'          // Single-line text → InputText
  | 'textarea'      // Multi-line text → Textarea
  | 'email'         // Email with validation → InputText + pattern
  | 'phone'         // Phone with mask → InputMask
  | 'password'      // Masked input → Password
  
  // Numeric Types
  | 'number'        // Integer/float → InputNumber
  | 'currency'      // Money with formatting → InputNumber (mode=currency)
  
  // Date/Time Types
  | 'date'          // Date only → DatePicker
  | 'datetime'      // Date and time → DatePicker (showTime)
  
  // Selection Types
  | 'select'        // Single selection → Select
  | 'multiselect'   // Multiple selection → MultiSelect
  
  // Boolean Types
  | 'checkbox'      // Checkbox with label → Checkbox
  | 'switch'        // Toggle switch → ToggleSwitch
  
  // Reference Types
  | 'link'          // Reference to another document → AutoComplete/Select
  | 'table'         // Child table (one-to-many) → DataTable (editable)
  
  // Display Types
  | 'readonly';     // Computed/display only → static text
```

### Field Schema (Core Interface)

```typescript
/**
 * =============================================================================
 * FIELD SCHEMA
 * =============================================================================
 * 
 * Defines a single field in a document form. Organized into logical groups
 * for easier parsing by Schema Builder.
 */
export interface FieldSchema {
  // ─────────────────────────────────────────────────────────────────────────
  // IDENTITY (Required)
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Unique field identifier within the document.
   * Used as form data key and API payload key.
   * Convention: snake_case (e.g., "customer_name", "billing_address")
   * 
   * @pattern ^[a-z][a-z0-9_]*$
   * @minLength 1
   * @maxLength 64
   */
  name: string;
  
  /**
   * Human-readable label displayed in UI.
   * Should be concise but descriptive.
   * 
   * @minLength 1
   * @maxLength 100
   */
  label: string;
  
  /**
   * Field data type determining component and validation.
   * See FieldType for available options.
   */
  type: FieldType;
  
  // ─────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Layout configuration for form display.
   * Determines field positioning and visibility.
   */
  layout?: {
    /**
     * Field width in form grid.
     * - 'full': Spans entire row (12 columns)
     * - 'half': Spans half row (6 columns)
     * - 'third': Spans one-third (4 columns)
     * - 'quarter': Spans quarter (3 columns)
     * 
     * @default 'half'
     */
    width?: 'full' | 'half' | 'third' | 'quarter';
    
    /**
     * Section this field belongs to.
     * Must match a section.name in formView.sections.
     * Fields without section go to 'default'.
     */
    section?: string;
    
    /**
     * Display order within section.
     * Lower numbers appear first.
     * 
     * @default 0
     */
    order?: number;
    
    /**
     * Always hide this field in forms.
     * Use for computed fields that shouldn't be shown.
     * Different from conditional hiding via dependencies.
     * 
     * @default false
     */
    hidden?: boolean;
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Validation rules for this field.
   * Validated on both frontend (UX) and backend (authoritative).
   */
  validation?: {
    /**
     * Field must have a value.
     * Empty string, null, undefined, and empty array fail.
     * 
     * @default false
     */
    required?: boolean;
    
    /**
     * Minimum value for numbers.
     * For dates, use ISO string.
     */
    min?: number;
    
    /**
     * Maximum value for numbers.
     * For dates, use ISO string.
     */
    max?: number;
    
    /**
     * Minimum string length.
     */
    minLength?: number;
    
    /**
     * Maximum string length.
     */
    maxLength?: number;
    
    /**
     * Regex pattern for validation.
     * Used for custom formats (e.g., postal codes).
     * 
     * WARNING: Keep patterns simple to avoid ReDoS.
     * Backend will enforce timeout on pattern matching.
     */
    pattern?: string;
    
    /**
     * Custom error message when validation fails.
     * If not provided, generates default message.
     */
    message?: string;
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // BEHAVIOR
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Behavioral configuration affecting interactivity.
   */
  behavior?: {
    /**
     * Field is read-only (visible but not editable).
     * Different from disabled (which is often visually different).
     * 
     * @default false
     */
    readonly?: boolean;
    
    /**
     * Field is disabled (greyed out, not interactive).
     * 
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Placeholder text shown when field is empty.
     */
    placeholder?: string;
    
    /**
     * Conditional dependencies that affect this field.
     * Evaluated on frontend for immediate UI response.
     */
    dependsOn?: FieldDependency[];
    
    /**
     * Name of handler function to call on value change.
     * Must be registered in component's handler registry.
     * Used for cascading updates, calculations, etc.
     */
    onChange?: string;
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Data-related configuration.
   */
  data?: {
    /**
     * Default value when creating new document.
     * Type should match field type.
     * Special values:
     * - "{{today}}": Current date
     * - "{{now}}": Current datetime
     * - "{{user.id}}": Current user's ID
     */
    defaultValue?: unknown;
    
    /**
     * Static options for select/multiselect fields.
     * For dynamic options, use optionsSource.
     */
    options?: FieldOption[];
    
    /**
     * Dynamic options configuration.
     * Fetches options from API or store.
     */
    optionsSource?: OptionsSource;
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // DISPLAY
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Display formatting configuration.
   */
  display?: {
    /**
     * Prefix shown before value (e.g., "$" for currency).
     */
    prefix?: string;
    
    /**
     * Suffix shown after value (e.g., "%" for percent).
     */
    suffix?: string;
    
    /**
     * Format string for dates/numbers.
     * Dates: "yyyy-MM-dd", "MMM dd, yyyy", etc.
     * Numbers: "0,0.00", etc.
     */
    format?: string;
    
    /**
     * Help text shown below field.
     */
    description?: string;
    
    /**
     * Tooltip shown on hover/focus.
     */
    tooltip?: string;
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // TYPE-SPECIFIC CONFIG
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Configuration specific to certain field types.
   * Use discriminated union pattern for type safety.
   */
  typeConfig?: FieldTypeConfig;
  
  // ─────────────────────────────────────────────────────────────────────────
  // ACCESS CONTROL
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Field-level access control.
   * This is SUPPLEMENTARY to backend access control.
   * Backend is authoritative - this is for UI hints.
   */
  access?: FieldAccessControl;
}
```

### Field Type-Specific Configuration

```typescript
/**
 * =============================================================================
 * TYPE-SPECIFIC CONFIGURATION
 * =============================================================================
 * 
 * Discriminated union for type-specific properties.
 * This pattern provides type safety when accessing type-specific config.
 */

/**
 * Configuration for 'link' field type.
 * References another document type.
 */
export interface LinkFieldConfig {
  type: 'link';
  
  /**
   * Target document type to link to.
   * Must be a valid document name in the system.
   */
  linkTo: string;
  
  /**
   * Filters to apply when fetching link options.
   * Example: { status: "active" } to only show active customers.
   */
  filters?: Record<string, unknown>;
  
  /**
   * Field to display in dropdown/autocomplete.
   * @default "name"
   */
  displayField?: string;
  
  /**
   * Fields to search when typing in autocomplete.
   * @default ["name"]
   */
  searchFields?: string[];
  
  /**
   * Allow creating new linked document inline.
   * Shows "+" button to open quick-create dialog.
   * 
   * @default false
   */
  allowCreate?: boolean;
}

/**
 * Configuration for 'table' field type.
 * Child table for one-to-many relationships.
 */
export interface TableFieldConfig {
  type: 'table';
  
  /**
   * Schema for rows in the table.
   * Each row follows this field structure.
   */
  rowSchema: FieldSchema[];
  
  /**
   * Minimum number of rows required.
   * @default 0
   */
  minRows?: number;
  
  /**
   * Maximum number of rows allowed.
   * null = unlimited
   */
  maxRows?: number | null;
  
  /**
   * Allow reordering rows via drag-and-drop.
   * @default false
   */
  reorderable?: boolean;
  
  /**
   * Show row numbers in first column.
   * @default true
   */
  showRowNumbers?: boolean;
}

/**
 * Configuration for 'select' and 'multiselect' field types.
 */
export interface SelectFieldConfig {
  type: 'select' | 'multiselect';
  
  /**
   * Allow searching/filtering options.
   * @default true for more than 10 options
   */
  searchable?: boolean;
  
  /**
   * Allow clearing selection.
   * @default true unless field is required
   */
  clearable?: boolean;
  
  /**
   * For multiselect: max number of selections shown.
   * Beyond this, shows "+N more".
   * @default 3
   */
  maxSelectedLabels?: number;
  
  /**
   * Group options by this field.
   * Options must have this property.
   */
  groupBy?: string;
}

/**
 * Configuration for 'currency' field type.
 */
export interface CurrencyFieldConfig {
  type: 'currency';
  
  /**
   * Currency code (ISO 4217).
   * @default "USD"
   */
  currency?: string;
  
  /**
   * Locale for formatting.
   * @default "en-US"
   */
  locale?: string;
  
  /**
   * Number of decimal places.
   * @default 2
   */
  precision?: number;
}

/**
 * Union type for all type-specific configs.
 * Add new config types here as field types are added.
 */
export type FieldTypeConfig =
  | LinkFieldConfig
  | TableFieldConfig
  | SelectFieldConfig
  | CurrencyFieldConfig;
```

### Options and Options Source

```typescript
/**
 * =============================================================================
 * OPTIONS CONFIGURATION
 * =============================================================================
 */

/**
 * Static option for select/multiselect/radio fields.
 */
export interface FieldOption {
  /**
   * Value stored when option is selected.
   */
  value: string | number | boolean;
  
  /**
   * Text displayed to user.
   */
  label: string;
  
  /**
   * Disable this specific option.
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Icon to show before label (PrimeIcon name).
   */
  icon?: string;
  
  /**
   * Color indicator (for status-like options).
   */
  color?: string;
  
  /**
   * Group this option belongs to.
   * Used with groupBy in SelectFieldConfig.
   */
  group?: string;
}

/**
 * Dynamic options configuration.
 * Fetches options from API or store at runtime.
 */
export interface OptionsSource {
  /**
   * Source type:
   * - 'api': Fetch from REST endpoint
   * - 'store': Read from Pinia store
   * - 'static': Use options array (for completeness)
   */
  type: 'api' | 'store' | 'static';
  
  /**
   * API endpoint to fetch options.
   * Required when type is 'api'.
   */
  endpoint?: string;
  
  /**
   * Store path for Pinia store.
   * Required when type is 'store'.
   * Format: "storeName.propertyPath" (e.g., "settings.currencies")
   */
  storePath?: string;
  
  /**
   * Field in response to use as option value.
   * @default "id"
   */
  valueField?: string;
  
  /**
   * Field in response to use as option label.
   * @default "name"
   */
  labelField?: string;
  
  /**
   * Query parameters to send with API request.
   */
  params?: Record<string, unknown>;
  
  /**
   * Field names that, when changed, trigger re-fetch.
   * Used for cascading dropdowns.
   * 
   * Example: Country field changes → reload states
   */
  dependsOn?: string[];
  
  /**
   * Cache configuration.
   * - true: Cache forever (until page refresh)
   * - false: No caching
   * - number: Cache duration in seconds
   * 
   * @default true
   */
  cache?: boolean | number;
  
  /**
   * Text to show when no options found.
   */
  emptyText?: string;
  
  /**
   * Enable server-side search.
   * Sends search query to API.
   * 
   * @default false
   */
  searchable?: boolean;
  
  /**
   * Minimum characters before triggering search.
   * Only applies when searchable is true.
   * 
   * @default 2
   */
  minSearchLength?: number;
}
```

### Field Access Control

```typescript
/**
 * =============================================================================
 * FIELD ACCESS CONTROL
 * =============================================================================
 * 
 * IMPORTANT: This is for UI hints only.
 * Backend is authoritative for all access decisions.
 * These settings help the frontend hide/disable fields
 * without making unnecessary API calls.
 */
export interface FieldAccessControl {
  /**
   * Plans required to see this field.
   * Field hidden if user's plan not in list.
   * 
   * Example: ["professional", "enterprise"]
   */
  requiredPlan?: string[];
  
  /**
   * Module required to see this field.
   * Field hidden if module not enabled for tenant.
   */
  requiredModule?: string;
  
  /**
   * Roles that can view this field.
   * Empty array = no role restriction.
   */
  readRoles?: string[];
  
  /**
   * Roles that can edit this field.
   * If user can read but not write, field is readonly.
   */
  writeRoles?: string[];
  
  /**
   * Additional ABAC conditions for field access.
   * Sent to backend for evaluation.
   * Frontend uses these as hints only.
   */
  conditions?: Condition[];
}
```

### Document Schema (Top Level)

```typescript
/**
 * =============================================================================
 * DOCUMENT SCHEMA
 * =============================================================================
 * 
 * Top-level schema defining a document type (e.g., Invoice, Customer).
 * This is what the Schema Builder creates and edits.
 */
export interface DocumentSchema {
  // ─────────────────────────────────────────────────────────────────────────
  // IDENTITY
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Unique document type identifier.
   * Convention: snake_case singular (e.g., "sales_invoice", "customer")
   * 
   * @pattern ^[a-z][a-z0-9_]*$
   * @minLength 1
   * @maxLength 64
   */
  name: string;
  
  /**
   * Singular display name.
   * Example: "Sales Invoice", "Customer"
   */
  label: string;
  
  /**
   * Plural display name.
   * Example: "Sales Invoices", "Customers"
   */
  labelPlural: string;
  
  /**
   * PrimeIcon name for this document type.
   * Example: "pi pi-file", "pi pi-users"
   */
  icon?: string;
  
  /**
   * Description of this document type.
   * Shown in documentation and Schema Builder.
   */
  description?: string;
  
  /**
   * Module this document belongs to.
   * Users must have access to this module to see the document.
   */
  module: string;
  
  // ─────────────────────────────────────────────────────────────────────────
  // API CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * API endpoint configuration.
   */
  api: ApiConfig;
  
  // ─────────────────────────────────────────────────────────────────────────
  // LIST VIEW
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Configuration for list/table view of documents.
   */
  listView: ListViewConfig;
  
  // ─────────────────────────────────────────────────────────────────────────
  // FORM VIEW
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Configuration for create/edit form view.
   */
  formView: FormViewConfig;
  
  // ─────────────────────────────────────────────────────────────────────────
  // ACCESS CONTROL
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Document-level access control configuration.
   */
  access: DocumentAccessControl;
  
  // ─────────────────────────────────────────────────────────────────────────
  // WORKFLOW (Optional)
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * State machine configuration for documents with status workflow.
   */
  workflow?: WorkflowConfig;
  
  // ─────────────────────────────────────────────────────────────────────────
  // METADATA
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Schema version for migrations.
   * Increment when making breaking changes.
   */
  version: string;
  
  /**
   * Last update timestamp (ISO 8601).
   */
  updatedAt: string;
  
  /**
   * Handler functions referenced by this schema.
   * Documents which handlers exist for validation.
   */
  handlers?: {
    [name: string]: {
      /**
       * Description of what handler does.
       */
      description: string;
      
      /**
       * Parameters handler expects.
       */
      params?: string[];
    };
  };
}
```

### API Configuration

```typescript
/**
 * =============================================================================
 * API CONFIGURATION
 * =============================================================================
 */
export interface ApiConfig {
  /**
   * Base endpoint for CRUD operations.
   * Example: "/api/v1/invoices"
   */
  baseEndpoint: string;
  
  /**
   * Override default endpoint patterns.
   * Default patterns use baseEndpoint with standard REST conventions.
   */
  endpoints?: {
    /**
     * List endpoint.
     * @default "{baseEndpoint}"
     */
    list?: string;
    
    /**
     * Get single item endpoint.
     * Use :id as placeholder.
     * @default "{baseEndpoint}/:id"
     */
    get?: string;
    
    /**
     * Create endpoint.
     * @default "{baseEndpoint}"
     */
    create?: string;
    
    /**
     * Update endpoint.
     * Use :id as placeholder.
     * @default "{baseEndpoint}/:id"
     */
    update?: string;
    
    /**
     * Delete endpoint.
     * Use :id as placeholder.
     * @default "{baseEndpoint}/:id"
     */
    delete?: string;
    
    /**
     * Custom endpoints for specific actions.
     */
    [key: string]: string | undefined;
  };
  
  /**
   * Default query parameters for all requests.
   */
  defaultParams?: Record<string, unknown>;
  
  /**
   * Field name for document ID.
   * @default "id"
   */
  idField?: string;
  
  /**
   * Pagination configuration.
   */
  pagination?: {
    /**
     * Query parameter for page number.
     * @default "page"
     */
    pageParam?: string;
    
    /**
     * Query parameter for page size.
     * @default "limit"
     */
    limitParam?: string;
    
    /**
     * Default items per page.
     * @default 20
     */
    defaultLimit?: number;
  };
  
  /**
   * Response format mapping.
   * Configure how to extract data from Go backend responses.
   */
  responseFormat?: {
    /**
     * JSON path to data array in list response.
     * @default "data"
     */
    dataPath?: string;
    
    /**
     * JSON path to pagination metadata.
     * @default "meta"
     */
    metaPath?: string;
    
    /**
     * Field name for total count in meta.
     * @default "total"
     */
    totalField?: string;
  };
  
  /**
   * Error response format mapping.
   */
  errorFormat?: {
    /**
     * JSON path to error message.
     * @default "error.message"
     */
    messagePath?: string;
    
    /**
     * JSON path to validation errors object.
     * @default "errors"
     */
    validationPath?: string;
  };
}
```

### List View Configuration

```typescript
/**
 * =============================================================================
 * LIST VIEW CONFIGURATION
 * =============================================================================
 */
export interface ListViewConfig {
  /**
   * Column definitions for DataTable.
   */
  columns: ColumnSchema[];
  
  /**
   * Default sort configuration.
   */
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  
  /**
   * Enable global search across searchFields.
   * @default true
   */
  searchable?: boolean;
  
  /**
   * Fields to include in global search.
   * @default First text column
   */
  searchFields?: string[];
  
  /**
   * Filter definitions for filter panel.
   */
  filters?: FilterConfig[];
  
  /**
   * Enable row selection checkboxes.
   * @default false
   */
  selectable?: boolean;
  
  /**
   * Actions for bulk operations on selected rows.
   */
  bulkActions?: ActionSchema[];
  
  /**
   * Actions shown in toolbar.
   */
  toolbarActions?: ActionSchema[];
  
  /**
   * Actions shown for each row.
   */
  rowActions?: ActionSchema[];
  
  /**
   * Enable export functionality.
   * @default false
   */
  exportable?: boolean;
  
  /**
   * Enable print functionality.
   * @default false
   */
  printable?: boolean;
}
```

### Column Schema

```typescript
/**
 * =============================================================================
 * COLUMN SCHEMA
 * =============================================================================
 */
export interface ColumnSchema {
  /**
   * Data field path (supports dot notation).
   * Example: "customer.name", "status"
   */
  field: string;
  
  /**
   * Column header text.
   */
  header: string;
  
  /**
   * Field type for rendering and formatting.
   */
  type: FieldType;
  
  /**
   * CSS width (e.g., "120px", "10%").
   */
  width?: string;
  
  /**
   * Text alignment.
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Freeze column during horizontal scroll.
   * @default false
   */
  frozen?: boolean;
  
  /**
   * Enable sorting on this column.
   * @default true
   */
  sortable?: boolean;
  
  /**
   * Enable filtering on this column.
   * @default false
   */
  filterable?: boolean;
  
  /**
   * Filter input type.
   */
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean';
  
  /**
   * Filter options for select filter type.
   */
  filterOptions?: FieldOption[];
  
  /**
   * Format string for dates/numbers.
   */
  format?: string;
  
  /**
   * Custom template name for cell rendering.
   * Must be registered in component.
   */
  template?: string;
  
  /**
   * Make column value a link.
   * Navigates to this document type's detail page.
   */
  linkTo?: string;
  
  /**
   * Route pattern for links.
   * Use :id as placeholder.
   * @default "/{linkTo}/:id"
   */
  linkRoute?: string;
  
  /**
   * Column-level access control.
   */
  access?: FieldAccessControl;
}
```

### Action Schema

```typescript
/**
 * =============================================================================
 * ACTION SCHEMA
 * =============================================================================
 */

/**
 * Action types available in the system.
 */
export type ActionType =
  | 'create'      // Open create form
  | 'edit'        // Open edit form
  | 'delete'      // Delete document(s)
  | 'duplicate'   // Copy document
  | 'export'      // Export data
  | 'import'      // Import data
  | 'print'       // Print document
  | 'email'       // Send email
  | 'api'         // Generic API call
  | 'navigate'    // Route navigation
  | 'workflow'    // Workflow transition
  | 'custom';     // Custom handler

/**
 * Action definition for buttons, menus, and context actions.
 */
export interface ActionSchema {
  /**
   * Unique action identifier within the document.
   */
  name: string;
  
  /**
   * Display label for button/menu item.
   */
  label: string;
  
  /**
   * PrimeIcon name.
   */
  icon?: string;
  
  /**
   * How to render this action:
   * - 'button': Standalone button
   * - 'menu': Item in dropdown menu
   * - 'split': Primary action with dropdown for secondary
   */
  type: 'button' | 'menu' | 'split';
  
  /**
   * Button severity/color.
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'outlined';
  
  /**
   * What this action does.
   */
  action: ActionType;
  
  /**
   * Confirmation dialog before executing.
   */
  confirm?: {
    title: string;
    message: string;
    acceptLabel?: string;
    rejectLabel?: string;
    severity?: 'warning' | 'danger' | 'info';
  };
  
  /**
   * Conditions that must be met to show this action.
   * Evaluated against current row data.
   */
  showWhen?: Condition[];
  
  /**
   * Conditions that disable this action.
   * Action visible but not clickable.
   */
  disableWhen?: Condition[];
  
  /**
   * Access control for this action.
   */
  access?: {
    requiredPlan?: string[];
    requiredModule?: string;
    requiredPermissions?: string[];
    requiredRoles?: string[];
  };
  
  // Action-type-specific properties
  
  /**
   * API endpoint for 'api' and 'workflow' actions.
   * Use :id as placeholder.
   */
  endpoint?: string;
  
  /**
   * HTTP method for API actions.
   * @default "POST"
   */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  
  /**
   * Static payload for API actions.
   */
  payload?: Record<string, unknown>;
  
  /**
   * Route path for 'navigate' actions.
   */
  route?: string;
  
  /**
   * Route params for navigation.
   */
  routeParams?: Record<string, string>;
  
  /**
   * Handler function name for 'custom' actions.
   * Must be registered in component's handler registry.
   */
  handler?: string;
  
  /**
   * Child actions for 'split' type.
   */
  children?: ActionSchema[];
}
```

### Form View Configuration

```typescript
/**
 * =============================================================================
 * FORM VIEW CONFIGURATION
 * =============================================================================
 */
export interface FormViewConfig {
  /**
   * Form sections for organizing fields.
   */
  sections: FormSection[];
  
  /**
   * Field definitions.
   */
  fields: FieldSchema[];
  
  /**
   * Form layout style.
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal' | 'grid';
  
  /**
   * Form-level actions (Save, Cancel, etc.).
   */
  actions?: ActionSchema[];
  
  /**
   * Validate fields on blur.
   * @default true
   */
  validateOnBlur?: boolean;
  
  /**
   * Validate fields on change.
   * @default false
   */
  validateOnChange?: boolean;
}

/**
 * Form section for grouping related fields.
 */
export interface FormSection {
  /**
   * Unique section identifier.
   * Referenced by field.layout.section.
   */
  name: string;
  
  /**
   * Section header text.
   */
  label: string;
  
  /**
   * Section description/help text.
   */
  description?: string;
  
  /**
   * Allow collapsing this section.
   * @default false
   */
  collapsible?: boolean;
  
  /**
   * Start collapsed.
   * Only applies if collapsible is true.
   * @default false
   */
  collapsed?: boolean;
  
  /**
   * Number of columns in this section's grid.
   * @default 2
   */
  columns?: 1 | 2 | 3 | 4;
  
  /**
   * Section-level access control.
   * Hide entire section if not accessible.
   */
  access?: FieldAccessControl;
}
```

### Filter Configuration

```typescript
/**
 * =============================================================================
 * FILTER CONFIGURATION
 * =============================================================================
 */
export interface FilterConfig {
  /**
   * Field to filter on.
   */
  field: string;
  
  /**
   * Filter label.
   */
  label: string;
  
  /**
   * Filter input type.
   */
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean' | 'text';
  
  /**
   * Static options for select filters.
   */
  options?: FieldOption[];
  
  /**
   * Dynamic options source.
   */
  optionsSource?: OptionsSource;
  
  /**
   * Default filter value.
   */
  defaultValue?: unknown;
  
  /**
   * Operator to use for this filter.
   * @default 'eq'
   */
  operator?: ConditionOperator;
}
```

### Document Access Control

```typescript
/**
 * =============================================================================
 * DOCUMENT ACCESS CONTROL
 * =============================================================================
 */
export interface DocumentAccessControl {
  /**
   * Plan required to access this document type.
   */
  requiredPlan?: string[];
  
  /**
   * Module required for this document.
   */
  requiredModule?: string;
  
  /**
   * Permission configuration by action.
   */
  permissions: {
    create?: PermissionConfig;
    read?: PermissionConfig;
    update?: PermissionConfig;
    delete?: PermissionConfig;
    export?: PermissionConfig;
    import?: PermissionConfig;
    [key: string]: PermissionConfig | undefined;
  };
}

/**
 * Permission configuration for a specific action.
 */
export interface PermissionConfig {
  /**
   * Roles allowed to perform this action.
   */
  roles?: string[];
  
  /**
   * Owner of document always has this permission.
   * @default false
   */
  owner?: boolean;
  
  /**
   * Additional ABAC conditions.
   * Evaluated by backend condition engine.
   */
  conditions?: Condition[];
}
```

### Workflow Configuration

```typescript
/**
 * =============================================================================
 * WORKFLOW CONFIGURATION
 * =============================================================================
 */
export interface WorkflowConfig {
  /**
   * Field that stores current status.
   */
  statusField: string;
  
  /**
   * Available workflow states.
   */
  states: WorkflowState[];
  
  /**
   * Valid transitions between states.
   */
  transitions: WorkflowTransition[];
}

/**
 * Workflow state definition.
 */
export interface WorkflowState {
  /**
   * State identifier (stored in statusField).
   */
  name: string;
  
  /**
   * Display label.
   */
  label: string;
  
  /**
   * Color for status badges.
   * Can be named color (green, red) or hex (#00FF00).
   */
  color: string;
  
  /**
   * Is this a terminal state?
   * Terminal states often have different behavior.
   */
  isFinal?: boolean;
}

/**
 * Workflow transition definition.
 */
export interface WorkflowTransition {
  /**
   * States from which this transition is available.
   */
  from: string[];
  
  /**
   * Target state.
   */
  to: string;
  
  /**
   * Button label for this transition.
   */
  label: string;
  
  /**
   * Roles allowed to make this transition.
   */
  roles?: string[];
  
  /**
   * Conditions that must be met for transition.
   * Evaluated by backend condition engine.
   */
  conditions?: ConditionGroup;
  
  /**
   * API action to call on transition.
   */
  action?: {
    endpoint: string;
    method: 'POST' | 'PUT' | 'PATCH';
    payload?: Record<string, unknown>;
  };
}
```

### Dashboard Schema

```typescript
/**
 * =============================================================================
 * DASHBOARD SCHEMA
 * =============================================================================
 */
export interface DashboardSchema {
  /**
   * Unique dashboard identifier.
   */
  name: string;
  
  /**
   * Display name.
   */
  label: string;
  
  /**
   * Grid layout configuration.
   */
  layout: {
    type: 'grid';
    columns: number;
    gap?: string;
  };
  
  /**
   * Widget definitions.
   */
  widgets: WidgetSchema[];
  
  /**
   * Dashboard access control.
   */
  access?: {
    requiredPlan?: string[];
    requiredModule?: string;
    roles?: string[];
  };
}

/**
 * Dashboard widget definition.
 */
export interface WidgetSchema {
  /**
   * Unique widget ID within dashboard.
   */
  id: string;
  
  /**
   * Widget type.
   */
  type: 'stat' | 'chart' | 'table' | 'list' | 'calendar' | 'custom';
  
  /**
   * Widget title.
   */
  title: string;
  
  /**
   * Position in grid.
   */
  position: {
    row: number;
    col: number;
    width: number;  // columns to span
    height: number; // rows to span
  };
  
  /**
   * Data source configuration.
   */
  dataSource: {
    type: 'api' | 'store' | 'static';
    endpoint?: string;
    params?: Record<string, unknown>;
    refreshInterval?: number; // seconds
  };
  
  /**
   * Widget-type-specific configuration.
   */
  config: StatWidgetConfig | ChartWidgetConfig | TableWidgetConfig | CustomWidgetConfig;
  
  /**
   * Widget access control.
   */
  access?: FieldAccessControl;
}

export interface StatWidgetConfig {
  valueField: string;
  format?: 'number' | 'currency' | 'percent';
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  trend?: {
    field: string;
    compareLabel?: string;
  };
}

export interface ChartWidgetConfig {
  chartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  xField: string;
  yField: string | string[];
  colors?: string[];
}

export interface TableWidgetConfig {
  columns: ColumnSchema[];
  limit?: number;
  linkTo?: string;
}

export interface CustomWidgetConfig {
  component: string;
  props?: Record<string, unknown>;
}
```

---

# Part 3: Project Setup & Configuration

## Project Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- Go 1.22+ (backend)
- PostgreSQL 15+ (backend)

### Installation

```bash
# Create Vue 3 project
pnpm create vue@latest dhool-erp -- --typescript

cd dhool-erp

# Core dependencies
pnpm add vue@^3.5 vue-router@^4 pinia

# PrimeVue 4 ecosystem
pnpm add primevue@^4 @primevue/themes @primevue/core
pnpm add @primevue/auto-import-resolver
pnpm add primeicons

# Data fetching & caching
pnpm add @tanstack/vue-query axios

# Utilities
pnpm add @vueuse/core zod uuid dayjs lodash-es
pnpm add ajv  # JSON Schema validation

# Dev dependencies
pnpm add -D typescript@^5
pnpm add -D vite@^6 @vitejs/plugin-vue
pnpm add -D unplugin-vue-components unplugin-auto-import
pnpm add -D tailwindcss@^3 postcss autoprefixer
pnpm add -D @types/lodash-es @types/uuid
pnpm add -D vitest @vue/test-utils

# Initialize Tailwind
pnpm dlx tailwindcss init -p
```

### Project Structure

```
dhool-erp/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── main.css              # Entry CSS
│   │       └── components.css        # Component-specific styles
│   │
│   ├── components/
│   │   ├── molecules/                # Simple compositions
│   │   │   ├── FormField.vue
│   │   │   ├── StatCard.vue
│   │   │   ├── ActionMenu.vue
│   │   │   └── EmptyState.vue
│   │   ├── organisms/                # Complex components
│   │   │   ├── DataTableCrud.vue
│   │   │   ├── FormBuilder.vue
│   │   │   ├── FormDrawer.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── AppTopbar.vue
│   │   ├── templates/                # Page layouts
│   │   │   ├── MainLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   └── BlankLayout.vue
│   │   └── renderers/                # Schema renderers
│   │       ├── DocumentPage.vue
│   │       ├── DashboardPage.vue
│   │       └── FieldRenderer.vue
│   │
│   ├── composables/
│   │   ├── useAccess.ts
│   │   ├── useSchema.ts
│   │   ├── useCrud.ts
│   │   ├── useCondition.ts           # Frontend condition evaluator
│   │   ├── useDrawer.ts
│   │   └── useNotification.ts
│   │
│   ├── schemas/                      # JSON UI Schemas
│   │   ├── documents/
│   │   │   ├── invoice.json
│   │   │   ├── customer.json
│   │   │   └── product.json
│   │   ├── dashboards/
│   │   │   └── main.json
│   │   └── meta/
│   │       └── modules.json
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── schemaService.ts
│   │   ├── accessService.ts
│   │   └── conditionService.ts       # Frontend condition evaluator
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── tenantStore.ts
│   │   ├── accessStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/
│   │   ├── schema.ts                 # All schema types
│   │   ├── access.ts                 # Access control types
│   │   ├── api.ts                    # API types
│   │   └── tenant.ts                 # Tenant & subscription
│   │
│   ├── router/
│   │   ├── index.ts
│   │   └── guards.ts
│   │
│   ├── App.vue
│   └── main.ts
│
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## PrimeVue 4 Configuration

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

export default defineConfig({
  plugins: [
    vue(),
    
    // Auto-import PrimeVue components - no manual imports needed
    Components({
      resolvers: [PrimeVueResolver()],
      dirs: ['src/components'],
      dts: 'src/components.d.ts',
    }),
    
    // Auto-import Vue APIs & composables
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables', 'src/stores'],
    }),
  ],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### Main Entry Point

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

// PrimeVue Services - these provide app-wide functionality
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'

// PrimeVue Directives
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import BadgeDirective from 'primevue/badgedirective'
import FocusTrap from 'primevue/focustrap'

import App from './App.vue'
import router from './router'

// Styles
import 'primeicons/primeicons.css'
import './assets/styles/main.css'

async function bootstrap() {
  const app = createApp(App)

  // ============================================
  // PINIA (State Management)
  // ============================================
  const pinia = createPinia()
  app.use(pinia)

  // ============================================
  // PRIMEVUE 4 CONFIGURATION
  // ============================================

  /**
   * Custom theme preset extending Aura.
   * Defines semantic color tokens that cascade throughout the app.
   */
  const DhoolPreset = definePreset(Aura, {
    semantic: {
      // Primary color palette - used for buttons, links, active states
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
        950: '{blue.950}',
      },
      
      // Color scheme tokens for light/dark mode
      colorScheme: {
        light: {
          primary: {
            color: '{primary.500}',
            contrastColor: '#ffffff',
            hoverColor: '{primary.600}',
            activeColor: '{primary.700}',
          },
          surface: {
            0: '#ffffff',
            50: '{slate.50}',
            100: '{slate.100}',
            200: '{slate.200}',
            300: '{slate.300}',
            400: '{slate.400}',
            500: '{slate.500}',
            600: '{slate.600}',
            700: '{slate.700}',
            800: '{slate.800}',
            900: '{slate.900}',
            950: '{slate.950}',
          },
        },
        dark: {
          primary: {
            color: '{primary.400}',
            contrastColor: '{surface.900}',
            hoverColor: '{primary.300}',
            activeColor: '{primary.200}',
          },
          surface: {
            0: '{slate.950}',
            50: '{slate.900}',
            100: '{slate.800}',
            200: '{slate.700}',
            300: '{slate.600}',
            400: '{slate.500}',
            500: '{slate.400}',
            600: '{slate.300}',
            700: '{slate.200}',
            800: '{slate.100}',
            900: '{slate.50}',
            950: '#ffffff',
          },
        },
      },
    },
  })

  app.use(PrimeVue, {
    theme: {
      preset: DhoolPreset,
      options: {
        prefix: 'p',
        darkModeSelector: '.dark',
        cssLayer: {
          name: 'primevue',
          // This order ensures Tailwind utilities can override PrimeVue
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
    ripple: true,
    
    /**
     * Pass-Through (PT) API for global component customization.
     * This applies to ALL instances of these components.
     * For component-specific styling, use :pt prop on the component.
     */
    pt: {
      // DataTable global styling
      datatable: {
        root: { 
          class: 'border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden' 
        },
        header: { 
          class: 'bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700' 
        },
        tbody: { 
          class: 'divide-y divide-surface-200 dark:divide-surface-700' 
        },
      },
      
      // Card global styling
      card: {
        root: { 
          class: 'border border-surface-200 dark:border-surface-700 shadow-sm' 
        },
      },
      
      // Button global styling
      button: {
        root: { 
          class: 'font-medium' 
        },
      },
      
      // Dialog global styling
      dialog: {
        root: { 
          class: 'border border-surface-200 dark:border-surface-700' 
        },
        header: { 
          class: 'border-b border-surface-200 dark:border-surface-700' 
        },
        footer: { 
          class: 'border-t border-surface-200 dark:border-surface-700' 
        },
      },
    },
  })

  // Register services
  app.use(ToastService)
  app.use(ConfirmationService)
  app.use(DialogService)

  // Register directives
  app.directive('tooltip', Tooltip)
  app.directive('ripple', Ripple)
  app.directive('badge', BadgeDirective)
  app.directive('focustrap', FocusTrap)

  // ============================================
  // VUE QUERY (Data Fetching)
  // ============================================
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 1,
        },
      },
    },
  })

  // ============================================
  // ROUTER
  // ============================================
  app.use(router)

  // ============================================
  // INITIALIZE APP
  // ============================================
  // Load user, tenant, access policies before mounting
  const { initializeApp } = await import('./init')
  await initializeApp()

  app.mount('#app')
}

bootstrap()
```

---

## Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  
  // PrimeVue 4 uses .dark class for dark mode
  darkMode: 'class',
  
  theme: {
    extend: {
      /**
       * Map Tailwind colors to PrimeVue CSS variables.
       * This allows using Tailwind utilities with PrimeVue's semantic colors.
       * Example: bg-primary, text-surface-500
       */
      colors: {
        primary: {
          DEFAULT: 'var(--p-primary-color)',
          hover: 'var(--p-primary-hover-color)',
          active: 'var(--p-primary-active-color)',
          contrast: 'var(--p-primary-contrast-color)',
        },
        surface: {
          0: 'var(--p-surface-0)',
          50: 'var(--p-surface-50)',
          100: 'var(--p-surface-100)',
          200: 'var(--p-surface-200)',
          300: 'var(--p-surface-300)',
          400: 'var(--p-surface-400)',
          500: 'var(--p-surface-500)',
          600: 'var(--p-surface-600)',
          700: 'var(--p-surface-700)',
          800: 'var(--p-surface-800)',
          900: 'var(--p-surface-900)',
          950: 'var(--p-surface-950)',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  
  plugins: [],
} satisfies Config
```

### Base CSS

```css
/* src/assets/styles/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================
   BASE STYLES
   ============================================ */
@layer base {
  :root {
    /* Custom app variables */
    --app-sidebar-width: 280px;
    --app-sidebar-collapsed-width: 64px;
    --app-topbar-height: 64px;
  }
  
  body {
    @apply bg-surface-50 text-surface-900;
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  .dark body {
    @apply bg-surface-950 text-surface-50;
  }
}

/* ============================================
   COMPONENT LAYER - Custom patterns
   ============================================ */
@layer components {
  /* Page layouts */
  .page-header {
    @apply flex items-center justify-between mb-6;
  }
  
  .page-title {
    @apply text-2xl font-semibold text-surface-900 dark:text-surface-50;
  }
  
  /* Form layouts */
  .form-grid {
    @apply grid grid-cols-1 md:grid-cols-2 gap-4;
  }
  
  .form-field {
    @apply flex flex-col gap-2;
  }
  
  .form-label {
    @apply text-sm font-medium text-surface-700 dark:text-surface-300;
  }
  
  /* Card variants */
  .stat-card {
    @apply p-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0;
  }
}

/* ============================================
   PRIMEVUE OVERRIDES
   ============================================ */

/* DataTable row hover */
.p-datatable .p-datatable-tbody > tr:hover {
  @apply bg-surface-50 dark:bg-surface-800;
}

/* Drawer/Sidebar styling */
.p-drawer {
  @apply border-l border-surface-200 dark:border-surface-700;
}

.p-drawer-header {
  @apply border-b border-surface-200 dark:border-surface-700 px-6 py-4;
}

.p-drawer-content {
  @apply p-6;
}

/* ============================================
   TRANSITIONS
   ============================================ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
```

---

# Part 4: Services & State Management

## Access Control System

### Condition Service (Frontend)

```typescript
// src/services/conditionService.ts
/**
 * Frontend condition evaluator - a SUBSET of Go backend's capability.
 * Used ONLY for UI state (show/hide/enable/disable fields).
 * 
 * NEVER use this for security decisions - backend is authoritative.
 */

import type { Condition, ConditionGroup, ConditionOperator } from '@/types/schema'

/**
 * Evaluate a single condition against data.
 * Matches Go backend's condition package operators.
 */
export function evaluateCondition(
  condition: Condition,
  data: Record<string, unknown>
): boolean {
  // Get the value to test
  const value = getNestedValue(data, condition.field)
  
  // Get the compare value (literal or field reference)
  const compareValue = condition.fieldRef
    ? getNestedValue(data, condition.fieldRef)
    : condition.value

  // Apply operator
  return applyOperator(condition.operator, value, compareValue)
}

/**
 * Evaluate a condition group (with AND/OR logic).
 */
export function evaluateConditionGroup(
  group: ConditionGroup,
  data: Record<string, unknown>
): boolean {
  // Evaluate all conditions
  const conditionResults = group.conditions.map(c => evaluateCondition(c, data))
  
  // Evaluate nested groups
  const groupResults = (group.groups || []).map(g => evaluateConditionGroup(g, data))
  
  // Combine all results
  const allResults = [...conditionResults, ...groupResults]
  
  // Apply conjunction
  let result: boolean
  if (group.conjunction === 'or') {
    result = allResults.some(r => r)
  } else {
    result = allResults.every(r => r)
  }
  
  // Apply negation if set
  return group.not ? !result : result
}

/**
 * Apply comparison operator.
 * Must match Go backend's operator implementations.
 */
function applyOperator(
  operator: ConditionOperator,
  value: unknown,
  compareValue: unknown
): boolean {
  switch (operator) {
    // Equality
    case 'eq':
      return value === compareValue
    case 'neq':
      return value !== compareValue
    
    // Numeric comparison
    case 'gt':
      return toNumber(value) > toNumber(compareValue)
    case 'gte':
      return toNumber(value) >= toNumber(compareValue)
    case 'lt':
      return toNumber(value) < toNumber(compareValue)
    case 'lte':
      return toNumber(value) <= toNumber(compareValue)
    
    // Range
    case 'between':
      if (!Array.isArray(compareValue) || compareValue.length !== 2) return false
      const num = toNumber(value)
      return num >= toNumber(compareValue[0]) && num <= toNumber(compareValue[1])
    case 'not_between':
      if (!Array.isArray(compareValue) || compareValue.length !== 2) return true
      const n = toNumber(value)
      return n < toNumber(compareValue[0]) || n > toNumber(compareValue[1])
    
    // String operations
    case 'contains':
      return String(value).includes(String(compareValue))
    case 'not_contains':
      return !String(value).includes(String(compareValue))
    case 'starts_with':
      return String(value).startsWith(String(compareValue))
    case 'ends_with':
      return String(value).endsWith(String(compareValue))
    case 'match_regexp':
      try {
        return new RegExp(String(compareValue)).test(String(value))
      } catch {
        return false
      }
    
    // Membership
    case 'in':
      return Array.isArray(compareValue) && compareValue.includes(value)
    case 'nin':
      return !Array.isArray(compareValue) || !compareValue.includes(value)
    
    // Null/Empty
    case 'is_empty':
      return isEmpty(value)
    case 'is_not_empty':
      return !isEmpty(value)
    
    default:
      console.warn(`Unknown operator: ${operator}`)
      return false
  }
}

/**
 * Get nested value using dot notation.
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj)
}

/**
 * Convert value to number for comparison.
 */
function toNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  if (value instanceof Date) return value.getTime()
  return 0
}

/**
 * Check if value is empty.
 */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
```

### Access Service

```typescript
// src/services/accessService.ts
/**
 * Access control service implementing three-layer access model.
 * 
 * Layer 1: Subscription (tenant capabilities)
 * Layer 2: Role (user permissions)
 * Layer 3: ABAC (attribute-based conditions)
 * 
 * IMPORTANT: This is for UI hints. Backend is authoritative.
 */

import type {
  AccessContext,
  AccessResult,
  User,
  Subscription,
  Role,
  DataScope,
} from '@/types/access'
import type { FieldSchema, ActionSchema, Condition } from '@/types/schema'
import { evaluateCondition } from './conditionService'

class AccessService {
  private roles: Map<string, Role> = new Map()
  
  // Cache for performance
  private cache = new Map<string, { result: AccessResult; timestamp: number }>()
  private cacheTimeout = 60 * 1000 // 1 minute

  /**
   * Load roles from API response.
   */
  loadRoles(roles: Role[]) {
    this.roles.clear()
    for (const role of roles) {
      this.roles.set(role.name, role)
    }
    this.clearCache()
  }

  /**
   * Main access check - evaluates all layers.
   */
  checkAccess(context: AccessContext): AccessResult {
    const cacheKey = this.getCacheKey(context)
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.result
    }

    let result: AccessResult

    // Layer 1: Subscription check
    const subscriptionResult = this.checkSubscription(context)
    if (!subscriptionResult.allowed) {
      result = subscriptionResult
    } else {
      // Layer 2: Role check
      const roleResult = this.checkRole(context)
      if (!roleResult.allowed) {
        result = roleResult
      } else {
        // Layer 3: Basic client-side conditions (UI hints only)
        result = {
          allowed: true,
          scope: roleResult.scope,
          hiddenFields: roleResult.hiddenFields || [],
          readonlyFields: roleResult.readonlyFields || [],
        }
      }
    }

    this.cache.set(cacheKey, { result, timestamp: Date.now() })
    return result
  }

  /**
   * Layer 1: Check subscription/tenant capabilities.
   */
  private checkSubscription(context: AccessContext): AccessResult {
    const { subscription } = context

    // Check subscription status
    if (subscription.status === 'expired' || subscription.status === 'canceled') {
      return { allowed: false, reason: 'subscription_expired' }
    }

    return { allowed: true }
  }

  /**
   * Layer 2: Check role-based permissions.
   */
  private checkRole(context: AccessContext): AccessResult {
    const { user, resource, action } = context

    // Super admin bypasses role checks
    if (user.roles.includes('super_admin')) {
      return { allowed: true, scope: 'all' }
    }

    if (!resource?.type || !action) {
      return { allowed: true }
    }

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

  private getActionScope(docAccess: any, action: string): DataScope | null {
    switch (action) {
      case 'create':
        return docAccess.create ? 'all' : 'none'
      case 'read':
      case 'list':
        return docAccess.read
      case 'update':
      case 'edit':
        return docAccess.update
      case 'delete':
        return docAccess.delete
      default:
        return null
    }
  }

  private isBetterScope(newScope: DataScope, currentScope: DataScope): boolean {
    const order: DataScope[] = ['none', 'own', 'team', 'department', 'all']
    return order.indexOf(newScope) > order.indexOf(currentScope)
  }

  /**
   * Check field-level access (UI hints).
   */
  checkFieldAccess(
    field: FieldSchema,
    context: AccessContext,
    mode: 'read' | 'write' = 'read'
  ): { visible: boolean; editable: boolean; reason?: string } {
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

### Schema Service

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
      const response = await api.get<DocumentSchema>(`/api/v1/schemas/documents/${docType}`)
      const schema = response.data
      
      this.documentCache.set(docType, schema)
      setTimeout(() => this.documentCache.delete(docType), this.cacheTimeout)
      
      return schema
    } catch (error) {
      // Fallback to local JSON file
      const schema = await import(`@/schemas/documents/${docType}.json`)
      
      this.documentCache.set(docType, schema.default)
      return schema.default
    }
  }

  /**
   * Get dashboard schema.
   */
  async getDashboardSchema(dashboardId: string): Promise<DashboardSchema> {
    const cached = this.dashboardCache.get(dashboardId)
    if (cached) {
      return cached
    }

    try {
      const response = await api.get<DashboardSchema>(`/api/v1/schemas/dashboards/${dashboardId}`)
      const schema = response.data
      
      this.dashboardCache.set(dashboardId, schema)
      setTimeout(() => this.dashboardCache.delete(dashboardId), this.cacheTimeout)
      
      return schema
    } catch (error) {
      const schema = await import(`@/schemas/dashboards/${dashboardId}.json`)
      
      this.dashboardCache.set(dashboardId, schema.default)
      return schema.default
    }
  }

  /**
   * Get fields grouped by section.
   */
  getFieldsBySection(schema: DocumentSchema): Map<string, FieldSchema[]> {
    const sections = new Map<string, FieldSchema[]>()
    
    // Initialize sections
    for (const section of schema.formView.sections) {
      sections.set(section.name, [])
    }
    sections.set('default', [])

    // Group fields
    for (const field of schema.formView.fields) {
      const sectionName = field.layout?.section || 'default'
      const sectionFields = sections.get(sectionName) || []
      sectionFields.push(field)
      sections.set(sectionName, sectionFields)
    }

    // Sort fields by order
    for (const [key, fields] of sections) {
      sections.set(
        key,
        fields.sort((a, b) => (a.layout?.order || 0) - (b.layout?.order || 0))
      )
    }

    return sections
  }

  /**
   * Get default values for form initialization.
   */
  getDefaultValues(fields: FieldSchema[]): Record<string, unknown> {
    const defaults: Record<string, unknown> = {}
    
    for (const field of fields) {
      if (field.data?.defaultValue !== undefined) {
        // Handle special default values
        const defaultValue = field.data.defaultValue
        if (typeof defaultValue === 'string') {
          if (defaultValue === '{{today}}') {
            defaults[field.name] = new Date().toISOString().split('T')[0]
          } else if (defaultValue === '{{now}}') {
            defaults[field.name] = new Date().toISOString()
          } else {
            defaults[field.name] = defaultValue
          }
        } else {
          defaults[field.name] = defaultValue
        }
      } else {
        // Set type-appropriate defaults
        switch (field.type) {
          case 'text':
          case 'textarea':
          case 'email':
          case 'phone':
          case 'password':
            defaults[field.name] = ''
            break
          case 'number':
          case 'currency':
            defaults[field.name] = null
            break
          case 'checkbox':
          case 'switch':
            defaults[field.name] = false
            break
          case 'select':
          case 'link':
            defaults[field.name] = null
            break
          case 'multiselect':
          case 'table':
            defaults[field.name] = []
            break
          case 'date':
          case 'datetime':
            defaults[field.name] = null
            break
          default:
            defaults[field.name] = null
        }
      }
    }
    
    return defaults
  }

  /**
   * Validate a single field.
   */
  validateField(field: FieldSchema, value: unknown): string | null {
    const validation = field.validation
    
    // Required check
    if (validation?.required) {
      if (value === null || value === undefined || value === '') {
        return validation.message || `${field.label} is required`
      }
      if (Array.isArray(value) && value.length === 0) {
        return validation.message || `${field.label} is required`
      }
    }

    if (value === null || value === undefined || value === '') {
      return null
    }

    // String validations
    if (typeof value === 'string') {
      if (validation?.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`
      }
      if (validation?.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be at most ${validation.maxLength} characters`
      }
      if (validation?.pattern) {
        const regex = new RegExp(validation.pattern)
        if (!regex.test(value)) {
          return validation.message || `${field.label} format is invalid`
        }
      }

      // Email validation
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return `${field.label} must be a valid email`
        }
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (validation?.min !== undefined && value < validation.min) {
        return `${field.label} must be at least ${validation.min}`
      }
      if (validation?.max !== undefined && value > validation.max) {
        return `${field.label} must be at most ${validation.max}`
      }
    }

    // Array validations (for table fields)
    if (Array.isArray(value) && field.typeConfig?.type === 'table') {
      const tableConfig = field.typeConfig
      if (tableConfig.minRows && value.length < tableConfig.minRows) {
        return `${field.label} must have at least ${tableConfig.minRows} items`
      }
      if (tableConfig.maxRows && value.length > tableConfig.maxRows) {
        return `${field.label} must have at most ${tableConfig.maxRows} items`
      }
    }

    return null
  }

  /**
   * Validate entire form.
   */
  validateForm(
    fields: FieldSchema[],
    values: Record<string, unknown>
  ): Record<string, string> {
    const errors: Record<string, string> = {}

    for (const field of fields) {
      const error = this.validateField(field, values[field.name])
      if (error) {
        errors[field.name] = error
      }
    }

    return errors
  }

  clearCache() {
    this.documentCache.clear()
    this.dashboardCache.clear()
  }

  clearDocumentCache(docType: string) {
    this.documentCache.delete(docType)
  }
}

export const schemaService = new SchemaService()
```

---

## Composables

### useCondition Composable

```typescript
// src/composables/useCondition.ts
/**
 * Composable for evaluating UI conditions (field dependencies).
 * Used to show/hide/enable/disable fields based on form values.
 */

import { computed } from 'vue'
import type { FieldDependency, Condition, ConditionGroup } from '@/types/schema'
import { evaluateCondition, evaluateConditionGroup } from '@/services/conditionService'

export function useCondition() {
  /**
   * Evaluate field dependencies to determine visibility.
   */
  const isFieldVisible = (
    dependencies: FieldDependency[] | undefined,
    formData: Record<string, unknown>,
    defaultVisible = true
  ): boolean => {
    if (!dependencies || dependencies.length === 0) {
      return defaultVisible
    }

    for (const dep of dependencies) {
      if (dep.action !== 'show' && dep.action !== 'hide') continue

      const conditionsMet = evaluateDependencyConditions(dep, formData)

      if (dep.action === 'hide' && conditionsMet) return false
      if (dep.action === 'show' && !conditionsMet) return false
    }

    return defaultVisible
  }

  /**
   * Evaluate field dependencies to determine if field is enabled.
   */
  const isFieldEnabled = (
    dependencies: FieldDependency[] | undefined,
    formData: Record<string, unknown>,
    defaultEnabled = true
  ): boolean => {
    if (!dependencies || dependencies.length === 0) {
      return defaultEnabled
    }

    for (const dep of dependencies) {
      if (dep.action !== 'enable' && dep.action !== 'disable') continue

      const conditionsMet = evaluateDependencyConditions(dep, formData)

      if (dep.action === 'disable' && conditionsMet) return false
      if (dep.action === 'enable' && !conditionsMet) return false
    }

    return defaultEnabled
  }

  /**
   * Evaluate field dependencies to determine if field is required.
   */
  const isFieldRequired = (
    baseRequired: boolean,
    dependencies: FieldDependency[] | undefined,
    formData: Record<string, unknown>
  ): boolean => {
    if (!dependencies || dependencies.length === 0) {
      return baseRequired
    }

    for (const dep of dependencies) {
      if (dep.action !== 'require' && dep.action !== 'unrequire') continue

      const conditionsMet = evaluateDependencyConditions(dep, formData)

      if (dep.action === 'require' && conditionsMet) return true
      if (dep.action === 'unrequire' && conditionsMet) return false
    }

    return baseRequired
  }

  /**
   * Get value to set from set_value dependencies.
   */
  const getSetValue = (
    dependencies: FieldDependency[] | undefined,
    formData: Record<string, unknown>
  ): { shouldSet: boolean; value: unknown } => {
    if (!dependencies || dependencies.length === 0) {
      return { shouldSet: false, value: undefined }
    }

    for (const dep of dependencies) {
      if (dep.action !== 'set_value') continue

      const conditionsMet = evaluateDependencyConditions(dep, formData)

      if (conditionsMet) {
        return { shouldSet: true, value: dep.actionValue }
      }
    }

    return { shouldSet: false, value: undefined }
  }

  /**
   * Evaluate dependency conditions.
   */
  const evaluateDependencyConditions = (
    dep: FieldDependency,
    formData: Record<string, unknown>
  ): boolean => {
    const conditions = dep.conditions

    // If it's a condition group, use group evaluator
    if ('conjunction' in conditions) {
      return evaluateConditionGroup(conditions as ConditionGroup, formData)
    }

    // If it's an array of conditions
    if (Array.isArray(conditions)) {
      const logic = dep.logic || 'and'
      
      if (logic === 'or') {
        return conditions.some(c => evaluateCondition(c, formData))
      } else {
        return conditions.every(c => evaluateCondition(c, formData))
      }
    }

    return false
  }

  return {
    isFieldVisible,
    isFieldEnabled,
    isFieldRequired,
    getSetValue,
    evaluateCondition,
    evaluateConditionGroup,
  }
}
```

### useAccess Composable

```typescript
// src/composables/useAccess.ts
/**
 * Composable for access control checks.
 * Provides reactive access to permission checking.
 */

import { computed } from 'vue'
import { useAccessStore } from '@/stores/accessStore'
import type { FieldSchema, ActionSchema } from '@/types/schema'
import type { AccessResult } from '@/types/access'

export function useAccess() {
  const accessStore = useAccessStore()

  /**
   * Check if user can perform action on resource.
   */
  const can = (
    action: string,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return accessStore.can(action, resourceType, resourceAttributes)
  }

  /**
   * Check multiple actions (OR logic).
   */
  const canAny = (
    actions: string[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return accessStore.canAny(actions, resourceType, resourceAttributes)
  }

  /**
   * Check multiple actions (AND logic).
   */
  const canAll = (
    actions: string[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return accessStore.canAll(actions, resourceType, resourceAttributes)
  }

  /**
   * Get full access result with scope.
   */
  const getAccess = (
    action: string,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): AccessResult => {
    return accessStore.getAccess(action, resourceType, resourceAttributes)
  }

  /**
   * Check field visibility/editability.
   */
  const fieldAccess = (
    field: FieldSchema,
    resourceType: string,
    mode: 'read' | 'write' = 'read',
    resourceAttributes?: Record<string, unknown>
  ) => {
    return accessStore.canAccessField(field, resourceType, mode, resourceAttributes)
  }

  /**
   * Check if action is available.
   */
  const actionAvailable = (
    action: ActionSchema,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return accessStore.canPerformAction(action, resourceType, resourceAttributes)
  }

  /**
   * Filter fields based on access.
   */
  const filterFields = (
    fields: FieldSchema[],
    resourceType: string,
    mode: 'read' | 'write' = 'read',
    resourceAttributes?: Record<string, unknown>
  ): FieldSchema[] => {
    return accessStore.filterFields(fields, resourceType, mode, resourceAttributes)
  }

  /**
   * Filter actions based on access.
   */
  const filterActions = (
    actions: ActionSchema[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): ActionSchema[] => {
    return accessStore.filterActions(actions, resourceType, resourceAttributes)
  }

  /**
   * Check module access.
   */
  const hasModule = (moduleId: string): boolean => {
    return accessStore.hasModuleAccess(moduleId)
  }

  /**
   * Check feature flag.
   */
  const hasFeature = (featureId: string): boolean => {
    return accessStore.hasFeature(featureId)
  }

  return {
    can,
    canAny,
    canAll,
    getAccess,
    fieldAccess,
    actionAvailable,
    filterFields,
    filterActions,
    hasModule,
    hasFeature,
    isLoading: computed(() => accessStore.isLoading),
  }
}
```

### useSchema Composable

```typescript
// src/composables/useSchema.ts
/**
 * Composable for loading and working with document schemas.
 */

import { ref, computed, watch } from 'vue'
import { schemaService } from '@/services/schemaService'
import { useAccess } from './useAccess'
import type { 
  DocumentSchema, 
  FieldSchema, 
  ColumnSchema, 
  ActionSchema, 
  FormSection 
} from '@/types/schema'

export function useSchema(docType: string) {
  const { filterFields, filterActions } = useAccess()

  // State
  const schema = ref<DocumentSchema | null>(null)
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  // Load schema
  const loadSchema = async () => {
    isLoading.value = true
    error.value = null

    try {
      schema.value = await schemaService.getDocumentSchema(docType)
    } catch (err) {
      error.value = err as Error
      console.error(`Failed to load schema for ${docType}:`, err)
    } finally {
      isLoading.value = false
    }
  }

  // Initial load
  loadSchema()

  // Computed properties
  const allFields = computed<FieldSchema[]>(() => {
    if (!schema.value) return []
    return schema.value.formView.fields
  })

  const visibleFields = computed<FieldSchema[]>(() => {
    if (!schema.value) return []
    return filterFields(schema.value.formView.fields, docType, 'read')
  })

  const editableFields = computed<FieldSchema[]>(() => {
    if (!schema.value) return []
    return filterFields(schema.value.formView.fields, docType, 'write')
  })

  const sections = computed<FormSection[]>(() => {
    if (!schema.value) return []
    return schema.value.formView.sections
  })

  const fieldsBySection = computed(() => {
    if (!schema.value) return new Map<string, FieldSchema[]>()
    return schemaService.getFieldsBySection(schema.value)
  })

  const columns = computed<ColumnSchema[]>(() => {
    if (!schema.value) return []
    return schema.value.listView.columns
  })

  const toolbarActions = computed<ActionSchema[]>(() => {
    if (!schema.value) return []
    return filterActions(schema.value.listView.toolbarActions || [], docType)
  })

  const rowActions = computed<ActionSchema[]>(() => {
    if (!schema.value) return []
    return filterActions(schema.value.listView.rowActions || [], docType)
  })

  const bulkActions = computed<ActionSchema[]>(() => {
    if (!schema.value) return []
    return filterActions(schema.value.listView.bulkActions || [], docType)
  })

  const formActions = computed<ActionSchema[]>(() => {
    if (!schema.value) return []
    return filterActions(schema.value.formView.actions || [], docType)
  })

  const filters = computed(() => {
    if (!schema.value) return []
    return schema.value.listView.filters || []
  })

  const apiConfig = computed(() => {
    if (!schema.value) return null
    return schema.value.api
  })

  const defaultValues = computed(() => {
    if (!schema.value) return {}
    return schemaService.getDefaultValues(schema.value.formView.fields)
  })

  // Validation
  const validateField = (fieldName: string, value: unknown): string | null => {
    const field = allFields.value.find(f => f.name === fieldName)
    if (!field) return null
    return schemaService.validateField(field, value)
  }

  const validateForm = (values: Record<string, unknown>): Record<string, string> => {
    if (!schema.value) return {}
    return schemaService.validateForm(visibleFields.value, values)
  }

  // Refresh schema
  const refresh = async () => {
    schemaService.clearDocumentCache(docType)
    await loadSchema()
  }

  return {
    // State
    schema,
    isLoading,
    error,

    // Fields
    allFields,
    visibleFields,
    editableFields,
    sections,
    fieldsBySection,

    // List view
    columns,
    toolbarActions,
    rowActions,
    bulkActions,
    filters,

    // Form view
    formActions,
    defaultValues,

    // API config
    apiConfig,

    // Methods
    validateField,
    validateForm,
    refresh,
  }
}
```

### useCrud Composable

```typescript
// src/composables/useCrud.ts
/**
 * Composable for CRUD operations with Vue Query.
 */

import { ref, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAccess } from './useAccess'
import { useNotification } from './useNotification'
import type { ApiConfig } from '@/types/schema'
import api from '@/services/api'

interface CrudOptions<T> {
  docType: string
  apiConfig: ApiConfig
  idField?: string
}

interface ListParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, unknown>
}

interface ListResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useCrud<T extends Record<string, unknown>>(options: CrudOptions<T>) {
  const { docType, apiConfig, idField = 'id' } = options
  const { can } = useAccess()
  const notify = useNotification()
  const queryClient = useQueryClient()

  // State
  const listParams = ref<ListParams>({
    page: 1,
    limit: apiConfig.pagination?.defaultLimit || 20,
  })

  // Query keys
  const listQueryKey = computed(() => ['documents', docType, 'list', listParams.value])
  const getQueryKey = (id: string) => ['documents', docType, 'detail', id]

  // Build URL with params
  const buildListUrl = (): string => {
    const baseUrl = apiConfig.endpoints?.list || apiConfig.baseEndpoint
    const params = new URLSearchParams()

    const pageParam = apiConfig.pagination?.pageParam || 'page'
    const limitParam = apiConfig.pagination?.limitParam || 'limit'

    params.set(pageParam, String(listParams.value.page || 1))
    params.set(limitParam, String(listParams.value.limit || 20))

    if (listParams.value.sort) {
      params.set('sort', listParams.value.sort)
      params.set('order', listParams.value.order || 'asc')
    }

    if (listParams.value.search) {
      params.set('search', listParams.value.search)
    }

    if (listParams.value.filters) {
      for (const [key, value] of Object.entries(listParams.value.filters)) {
        if (value !== null && value !== undefined && value !== '') {
          params.set(key, String(value))
        }
      }
    }

    if (apiConfig.defaultParams) {
      for (const [key, value] of Object.entries(apiConfig.defaultParams)) {
        if (!params.has(key)) {
          params.set(key, String(value))
        }
      }
    }

    return `${baseUrl}?${params.toString()}`
  }

  // List query
  const {
    data: listData,
    isLoading: isListLoading,
    error: listError,
    refetch: refetchList,
  } = useQuery({
    queryKey: listQueryKey,
    queryFn: async (): Promise<ListResponse<T>> => {
      const response = await api.get<ListResponse<T>>(buildListUrl())
      return response.data
    },
    enabled: computed(() => can('list', docType)),
  })

  const items = computed(() => listData.value?.data || [])
  const pagination = computed(() => listData.value?.meta)

  // Get single item
  const getItem = (id: string) => {
    return useQuery({
      queryKey: getQueryKey(id),
      queryFn: async (): Promise<T> => {
        const url = apiConfig.endpoints?.get?.replace(':id', id) ||
          `${apiConfig.baseEndpoint}/${id}`
        const response = await api.get<T>(url)
        return response.data
      },
      enabled: computed(() => can('read', docType)),
    })
  }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<T>): Promise<T> => {
      const url = apiConfig.endpoints?.create || apiConfig.baseEndpoint
      const response = await api.post<T>(url, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', docType, 'list'] })
      notify.success('Created successfully')
    },
    onError: (error: any) => {
      notify.error('Failed to create', error.response?.data?.message || error.message)
    },
  })

  const create = async (data: Partial<T>): Promise<T> => {
    if (!can('create', docType)) {
      throw new Error('Permission denied')
    }
    return createMutation.mutateAsync(data)
  }

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }): Promise<T> => {
      const url = apiConfig.endpoints?.update?.replace(':id', id) ||
        `${apiConfig.baseEndpoint}/${id}`
      const response = await api.put<T>(url, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', docType, 'list'] })
      queryClient.invalidateQueries({ queryKey: getQueryKey(variables.id) })
      notify.success('Updated successfully')
    },
    onError: (error: any) => {
      notify.error('Failed to update', error.response?.data?.message || error.message)
    },
  })

  const update = async (id: string, data: Partial<T>): Promise<T> => {
    if (!can('update', docType)) {
      throw new Error('Permission denied')
    }
    return updateMutation.mutateAsync({ id, data })
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const url = apiConfig.endpoints?.delete?.replace(':id', id) ||
        `${apiConfig.baseEndpoint}/${id}`
      await api.delete(url)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['documents', docType, 'list'] })
      queryClient.removeQueries({ queryKey: getQueryKey(id) })
      notify.success('Deleted successfully')
    },
    onError: (error: any) => {
      notify.error('Failed to delete', error.response?.data?.message || error.message)
    },
  })

  const remove = async (id: string): Promise<void> => {
    if (!can('delete', docType)) {
      throw new Error('Permission denied')
    }
    return deleteMutation.mutateAsync(id)
  }

  // Bulk delete
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]): Promise<void> => {
      const url = `${apiConfig.baseEndpoint}/bulk-delete`
      await api.post(url, { ids })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', docType, 'list'] })
      notify.success('Deleted successfully')
    },
    onError: (error: any) => {
      notify.error('Failed to delete', error.response?.data?.message || error.message)
    },
  })

  const bulkDelete = async (ids: string[]): Promise<void> => {
    if (!can('delete', docType)) {
      throw new Error('Permission denied')
    }
    return bulkDeleteMutation.mutateAsync(ids)
  }

  // List management
  const setPage = (page: number) => {
    listParams.value = { ...listParams.value, page }
  }

  const setLimit = (limit: number) => {
    listParams.value = { ...listParams.value, limit, page: 1 }
  }

  const setSort = (field: string, order: 'asc' | 'desc' = 'asc') => {
    listParams.value = { ...listParams.value, sort: field, order }
  }

  const setSearch = (search: string) => {
    listParams.value = { ...listParams.value, search, page: 1 }
  }

  const setFilters = (filters: Record<string, unknown>) => {
    listParams.value = { ...listParams.value, filters, page: 1 }
  }

  const resetFilters = () => {
    listParams.value = {
      page: 1,
      limit: apiConfig.pagination?.defaultLimit || 20,
    }
  }

  return {
    // List
    items,
    pagination,
    isListLoading,
    listError,
    refetchList,

    // Detail
    getItem,

    // Mutations
    create,
    update,
    remove,
    bulkDelete,

    // Mutation states
    isCreating: computed(() => createMutation.isPending.value),
    isUpdating: computed(() => updateMutation.isPending.value),
    isDeleting: computed(() => deleteMutation.isPending.value),

    // List params
    listParams,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilters,
    resetFilters,
  }
}
```

### useNotification Composable

```typescript
// src/composables/useNotification.ts
/**
 * Composable for toast notifications using PrimeVue ToastService.
 */

import { useToast } from 'primevue/usetoast'

export function useNotification() {
  const toast = useToast()

  const success = (summary: string, detail?: string, life?: number) => {
    toast.add({
      severity: 'success',
      summary,
      detail,
      life: life || 3000,
    })
  }

  const info = (summary: string, detail?: string, life?: number) => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: life || 3000,
    })
  }

  const warn = (summary: string, detail?: string, life?: number) => {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life: life || 5000,
    })
  }

  const error = (summary: string, detail?: string, life?: number) => {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life: life || 5000,
    })
  }

  const clear = () => {
    toast.removeAllGroups()
  }

  return {
    success,
    info,
    warn,
    error,
    clear,
  }
}
```

### useDrawer Composable

```typescript
// src/composables/useDrawer.ts
/**
 * Composable for managing drawer/dialog state.
 */

import { ref, computed } from 'vue'

export type DrawerMode = 'create' | 'edit' | 'view'

interface DrawerState<T = unknown> {
  isOpen: boolean
  mode: DrawerMode
  data: T | null
  title: string
}

export function useDrawer<T = unknown>() {
  const state = ref<DrawerState<T>>({
    isOpen: false,
    mode: 'view',
    data: null,
    title: '',
  })

  const isOpen = computed(() => state.value.isOpen)
  const mode = computed(() => state.value.mode)
  const data = computed(() => state.value.data)
  const title = computed(() => state.value.title)
  const isCreateMode = computed(() => state.value.mode === 'create')
  const isEditMode = computed(() => state.value.mode === 'edit')
  const isViewMode = computed(() => state.value.mode === 'view')

  const open = (options: { mode: DrawerMode; data?: T | null; title?: string }) => {
    state.value = {
      isOpen: true,
      mode: options.mode,
      data: options.data || null,
      title: options.title || getDefaultTitle(options.mode),
    }
  }

  const openCreate = (title?: string) => {
    open({ mode: 'create', title })
  }

  const openEdit = (data: T, title?: string) => {
    open({ mode: 'edit', data, title })
  }

  const openView = (data: T, title?: string) => {
    open({ mode: 'view', data, title })
  }

  const close = () => {
    state.value = {
      ...state.value,
      isOpen: false,
    }
  }

  const reset = () => {
    state.value = {
      isOpen: false,
      mode: 'view',
      data: null,
      title: '',
    }
  }

  const setData = (newData: T) => {
    state.value = {
      ...state.value,
      data: newData,
    }
  }

  function getDefaultTitle(mode: DrawerMode): string {
    switch (mode) {
      case 'create':
        return 'Create New'
      case 'edit':
        return 'Edit'
      case 'view':
        return 'View Details'
    }
  }

  return {
    isOpen,
    mode,
    data,
    title,
    isCreateMode,
    isEditMode,
    isViewMode,
    open,
    openCreate,
    openEdit,
    openView,
    close,
    reset,
    setData,
  }
}
```

---

# Part 5: Component Library

## PrimeVue Component Integration Strategy

### Core Principles

1. **Don't Wrap Atoms**: Use PrimeVue components directly. Don't create `<AppButton>` wrappers.
2. **Compose Molecules**: Create small compositions that combine atoms with business logic.
3. **Build Organisms**: Create complex, reusable components from molecules.
4. **Use PT API**: Style globally via PrimeVue configuration, not component wrappers.
5. **Leverage Slots**: Use PrimeVue's extensive slot system for customization.

### When to Create Custom Components

```typescript
/**
 * DECISION TREE FOR CUSTOM COMPONENTS
 * 
 * Q1: Are you just styling a PrimeVue component?
 *     → NO custom component. Use PT API or :pt prop.
 * 
 * Q2: Are you combining 2+ components with specific behavior?
 *     → YES, create a molecule (e.g., FormField = label + input + error)
 * 
 * Q3: Are you creating a complex, self-contained feature?
 *     → YES, create an organism (e.g., DataTableCrud = table + pagination + actions)
 * 
 * Q4: Are you rendering from schema?
 *     → YES, create a renderer (e.g., FieldRenderer, DocumentPage)
 */
```

---

## Required PrimeVue Components

### Form Components

| Component | Usage | Notes |
|-----------|-------|-------|
| `InputText` | Text, email, URL inputs | Use `type` prop for variants |
| `InputNumber` | Numbers, currency, percent | Use `mode` prop for formatting |
| `Textarea` | Multi-line text | Use `autoResize` for dynamic height |
| `Password` | Password input | Has built-in strength indicator |
| `InputMask` | Phone, formatted inputs | Pattern-based masking |
| `Select` | Single selection dropdown | Replaces Dropdown in v4 |
| `MultiSelect` | Multiple selection | Supports chips display |
| `AutoComplete` | Search-as-you-type | Use for link fields |
| `DatePicker` | Date/datetime selection | Replaces Calendar in v4 |
| `Checkbox` | Boolean checkbox | Can have label |
| `ToggleSwitch` | Boolean toggle | Replaces InputSwitch in v4 |
| `RadioButton` | Single choice from group | Use with v-for |
| `Rating` | Star rating | Configurable stars |
| `Chips` | Tag input | For tags field type |
| `ColorPicker` | Color selection | Inline or popup |
| `Editor` | Rich text editing | Quill-based |

### Data Components

| Component | Usage | Notes |
|-----------|-------|-------|
| `DataTable` | List views, child tables | Core component for lists |
| `Column` | DataTable columns | Used with DataTable |
| `Paginator` | Standalone pagination | DataTable has built-in |
| `Tree` | Hierarchical data | For navigation, categories |
| `TreeTable` | Hierarchical table | Tree + table combined |

### Panel Components

| Component | Usage | Notes |
|-----------|-------|-------|
| `Card` | Content containers | Basic wrapper |
| `Panel` | Collapsible sections | For form sections |
| `Fieldset` | Grouped form fields | Alternative to Panel |
| `Accordion` | Multiple collapsible | Use AccordionPanel children |
| `TabView` | Tabbed content | Use TabPanel children |
| `Divider` | Visual separator | Horizontal or vertical |

### Overlay Components

| Component | Usage | Notes |
|-----------|-------|-------|
| `Dialog` | Modal dialogs | For forms, confirmations |
| `Drawer` | Side panels | For create/edit forms |
| `Popover` | Contextual content | Replaces OverlayPanel in v4 |
| `ConfirmDialog` | Confirmation prompts | Use with ConfirmationService |
| `Toast` | Notifications | Use with ToastService |
| `Tooltip` | Hover hints | Use as directive |

### Button Components

| Component | Usage | Notes |
|-----------|-------|-------|
| `Button` | Actions | Many severity/style options |
| `SplitButton` | Primary + menu | For action groups |
| `SpeedDial` | Floating action menu | Mobile-style FAB |
| `ButtonGroup` | Grouped buttons | Visual grouping |

### Menu Components

| Component | Usage | Notes |
|-----------|-------|-------|
| `Menu` | Popup menu | For action menus |
| `Menubar` | Horizontal navbar | Main navigation |
| `Breadcrumb` | Navigation path | Page hierarchy |
| `ContextMenu` | Right-click menu | Table row actions |
| `TieredMenu` | Nested menu | Complex menus |

### Feedback Components

| Component | Usage | Notes |
|-----------|-------|-------|
| `Message` | Inline messages | Static alerts |
| `InlineMessage` | Form validation | Compact alerts |
| `Tag` | Status badges | For status display |
| `Badge` | Count indicators | Notifications count |
| `ProgressBar` | Progress indication | Upload, process |
| `ProgressSpinner` | Loading spinner | Async operations |
| `Skeleton` | Loading placeholder | Content loading |

### Form Layout

| Component | Usage | Notes |
|-----------|-------|-------|
| `FloatLabel` | Floating label inputs | Modern form style |
| `IconField` | Input with icon | Search fields |
| `InputIcon` | Icon inside input | Used with IconField |
| `InputGroup` | Input addons | Prefix/suffix |

---

## Molecules

### FormField Component

```vue
<!-- src/components/molecules/FormField.vue -->
<script setup lang="ts">
/**
 * FormField wraps any input with:
 * - Label with required indicator
 * - Error message display
 * - Description/help text
 * - Consistent spacing
 * 
 * Use this for all form inputs to ensure consistent styling.
 */
import { computed } from 'vue'

interface Props {
  /** Field label text */
  label: string
  /** Field name for accessibility */
  name: string
  /** Show required indicator */
  required?: boolean
  /** Validation error message */
  error?: string
  /** Help text below input */
  description?: string
  /** Tooltip on hover */
  tooltip?: string
  /** Horizontal layout (label beside input) */
  horizontal?: boolean
  /** Label width for horizontal layout */
  labelWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  horizontal: false,
  labelWidth: '120px',
})

const hasError = computed(() => !!props.error)

const fieldClasses = computed(() => ({
  'form-field': true,
  'form-field--horizontal': props.horizontal,
  'form-field--error': hasError.value,
}))
</script>

<template>
  <div :class="fieldClasses">
    <label 
      :for="name" 
      class="form-field__label"
      :style="horizontal ? { width: labelWidth } : undefined"
    >
      {{ label }}
      <span v-if="required" class="form-field__required" aria-hidden="true">*</span>
      <i 
        v-if="tooltip" 
        class="pi pi-info-circle form-field__tooltip-icon"
        v-tooltip.top="tooltip"
      />
    </label>
    
    <div class="form-field__content">
      <!-- Input slot -->
      <slot />
      
      <!-- Description (when no error) -->
      <small v-if="description && !error" class="form-field__description">
        {{ description }}
      </small>
      
      <!-- Error message -->
      <small v-if="error" class="form-field__error" role="alert">
        <i class="pi pi-exclamation-circle" />
        {{ error }}
      </small>
    </div>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-field--horizontal {
  flex-direction: row;
  align-items: flex-start;
}

.form-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-text-color);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-field--horizontal .form-field__label {
  padding-top: 0.625rem;
  flex-shrink: 0;
}

.form-field__required {
  color: var(--p-red-500);
}

.form-field__tooltip-icon {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  cursor: help;
}

.form-field__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Make all inputs full width */
.form-field__content :deep(input),
.form-field__content :deep(.p-inputtext),
.form-field__content :deep(.p-select),
.form-field__content :deep(.p-textarea),
.form-field__content :deep(.p-autocomplete),
.form-field__content :deep(.p-datepicker),
.form-field__content :deep(.p-inputnumber) {
  width: 100%;
}

/* Error state for inputs */
.form-field--error :deep(.p-inputtext),
.form-field--error :deep(.p-select),
.form-field--error :deep(.p-textarea) {
  border-color: var(--p-red-500);
}

.form-field__description {
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
}

.form-field__error {
  color: var(--p-red-500);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
```

### StatCard Component

```vue
<!-- src/components/molecules/StatCard.vue -->
<script setup lang="ts">
/**
 * StatCard displays a single KPI/metric with:
 * - Large value with optional formatting
 * - Icon in colored container
 * - Optional trend indicator
 * 
 * Used in dashboards for key metrics.
 */
import { computed } from 'vue'

interface Props {
  /** Card title */
  title: string
  /** Value to display */
  value: string | number
  /** PrimeIcon name */
  icon?: string
  /** Trend percentage (positive/negative) */
  trend?: number
  /** Label for trend comparison */
  trendLabel?: string
  /** Value formatting */
  format?: 'number' | 'currency' | 'percent'
  /** Icon background color */
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
  /** Show loading skeleton */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  format: 'number',
  loading: false,
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(props.value)
    case 'percent':
      return `${props.value}%`
    default:
      return new Intl.NumberFormat('en-US').format(props.value)
  }
})

const trendDirection = computed(() => {
  if (!props.trend) return 'neutral'
  return props.trend > 0 ? 'up' : 'down'
})

const trendIcon = computed(() => {
  if (trendDirection.value === 'up') return 'pi pi-arrow-up'
  if (trendDirection.value === 'down') return 'pi pi-arrow-down'
  return 'pi pi-minus'
})

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
}
</script>

<template>
  <div class="stat-card">
    <div class="stat-card__content">
      <span class="stat-card__title">{{ title }}</span>
      
      <!-- Loading state -->
      <div v-if="loading" class="stat-card__skeleton">
        <Skeleton height="2rem" width="120px" />
      </div>
      
      <!-- Value -->
      <div v-else class="stat-card__value">{{ formattedValue }}</div>
      
      <!-- Trend -->
      <div v-if="trend !== undefined && !loading" class="stat-card__trend">
        <span 
          :class="[
            'stat-card__trend-value',
            trendDirection === 'up' && 'text-green-600',
            trendDirection === 'down' && 'text-red-600',
          ]"
        >
          <i :class="trendIcon" />
          {{ Math.abs(trend) }}%
        </span>
        <span v-if="trendLabel" class="stat-card__trend-label">
          {{ trendLabel }}
        </span>
      </div>
    </div>
    
    <!-- Icon -->
    <div v-if="icon" :class="['stat-card__icon', colorClasses[color]]">
      <i :class="icon" />
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: 0.75rem;
}

.dark .stat-card {
  border-color: var(--p-surface-700);
}

.stat-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-card__title {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.stat-card__value {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.stat-card__skeleton {
  height: 2rem;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.stat-card__trend-value {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-card__trend-label {
  color: var(--p-text-muted-color);
}

.stat-card__icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}
</style>
```

### ActionMenu Component

```vue
<!-- src/components/molecules/ActionMenu.vue -->
<script setup lang="ts">
/**
 * ActionMenu renders action buttons/menus based on schema.
 * Supports:
 * - Individual buttons
 * - Dropdown menu
 * - Split button (primary + dropdown)
 * 
 * Evaluates showWhen/disableWhen conditions.
 */
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import SplitButton from 'primevue/splitbutton'
import type { ActionSchema, Condition } from '@/types/schema'
import { evaluateCondition } from '@/services/conditionService'

interface Props {
  /** Actions to render */
  actions: ActionSchema[]
  /** Row data for condition evaluation */
  data?: Record<string, unknown>
  /** Render style */
  type?: 'button' | 'menu' | 'split'
  /** Button size */
  size?: 'small' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'menu',
  size: 'small',
})

const emit = defineEmits<{
  action: [action: ActionSchema, data: Record<string, unknown> | undefined]
}>()

const menu = ref()

// Filter actions based on showWhen conditions
const visibleActions = computed(() => {
  return props.actions.filter(action => {
    if (!action.showWhen || !props.data) return true
    return action.showWhen.every(condition => 
      evaluateCondition(condition, props.data!)
    )
  })
})

// Build menu items
const menuItems = computed(() => {
  return visibleActions.value.map(action => ({
    label: action.label,
    icon: action.icon,
    command: () => emit('action', action, props.data),
    disabled: isDisabled(action),
    class: action.variant === 'danger' ? 'text-red-600' : undefined,
  }))
})

// Build split button items (excluding first)
const splitItems = computed(() => {
  if (visibleActions.value.length <= 1) return []
  return visibleActions.value.slice(1).map(action => ({
    label: action.label,
    icon: action.icon,
    command: () => emit('action', action, props.data),
    disabled: isDisabled(action),
  }))
})

const primaryAction = computed(() => visibleActions.value[0])

// Check if action is disabled based on disableWhen
const isDisabled = (action: ActionSchema): boolean => {
  if (!action.disableWhen || !props.data) return false
  
  return action.disableWhen.some(condition => 
    evaluateCondition(condition, props.data!)
  )
}

const toggle = (event: Event) => {
  menu.value?.toggle(event)
}
</script>

<template>
  <!-- No actions -->
  <template v-if="visibleActions.length === 0">
    <span />
  </template>
  
  <!-- Single Button -->
  <template v-else-if="type === 'button' && visibleActions.length === 1">
    <Button
      :label="primaryAction?.label"
      :icon="primaryAction?.icon"
      :severity="(primaryAction?.variant as any) || 'secondary'"
      :size="size"
      text
      @click="emit('action', primaryAction!, data)"
    />
  </template>
  
  <!-- Button Group -->
  <template v-else-if="type === 'button'">
    <div class="flex gap-1">
      <Button
        v-for="action in visibleActions"
        :key="action.name"
        :icon="action.icon"
        :severity="(action.variant as any) || 'secondary'"
        :size="size"
        :disabled="isDisabled(action)"
        text
        rounded
        v-tooltip.top="action.label"
        @click="emit('action', action, data)"
      />
    </div>
  </template>
  
  <!-- Menu (default) -->
  <template v-else-if="type === 'menu'">
    <Button
      icon="pi pi-ellipsis-v"
      severity="secondary"
      :size="size"
      text
      rounded
      aria-label="Actions menu"
      @click="toggle"
    />
    <Menu ref="menu" :model="menuItems" popup />
  </template>
  
  <!-- Split Button -->
  <template v-else-if="type === 'split' && primaryAction">
    <SplitButton
      :label="primaryAction.label"
      :icon="primaryAction.icon"
      :model="splitItems"
      :severity="(primaryAction.variant as any) || 'primary'"
      :size="size"
      @click="emit('action', primaryAction, data)"
    />
  </template>
</template>
```

### EmptyState Component

```vue
<!-- src/components/molecules/EmptyState.vue -->
<script setup lang="ts">
/**
 * EmptyState shows when lists/tables have no data.
 * Provides visual feedback and optional call-to-action.
 */
import Button from 'primevue/button'

interface Props {
  /** Icon to display */
  icon?: string
  /** Main message */
  title: string
  /** Additional description */
  description?: string
  /** CTA button label */
  actionLabel?: string
  /** CTA button icon */
  actionIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'pi pi-inbox',
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <i :class="icon" />
    </div>
    
    <h3 class="empty-state__title">{{ title }}</h3>
    
    <p v-if="description" class="empty-state__description">
      {{ description }}
    </p>
    
    <Button
      v-if="actionLabel"
      :label="actionLabel"
      :icon="actionIcon"
      @click="emit('action')"
    />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.empty-state__icon {
  font-size: 3rem;
  color: var(--p-text-muted-color);
  margin-bottom: 1rem;
}

.empty-state__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin: 0 0 0.5rem;
}

.empty-state__description {
  color: var(--p-text-muted-color);
  margin: 0 0 1.5rem;
  max-width: 400px;
}
</style>
```

---

## Organisms

### DataTableCrud Component

```vue
<!-- src/components/organisms/DataTableCrud.vue -->
<script setup lang="ts">
/**
 * DataTableCrud is the main list component.
 * Schema-driven with built-in:
 * - Pagination
 * - Sorting
 * - Filtering
 * - Search
 * - Row selection
 * - Actions (toolbar, row, bulk)
 * - Empty state
 * - Loading skeletons
 */
import { ref, computed, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import ActionMenu from '@/components/molecules/ActionMenu.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import type { ColumnSchema, ActionSchema, FilterConfig } from '@/types/schema'
import { useAccess } from '@/composables/useAccess'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  /** Data items to display */
  items: Record<string, unknown>[]
  /** Loading state */
  loading?: boolean
  /** Column definitions from schema */
  columns: ColumnSchema[]
  /** Document type for access checks */
  docType: string
  /** Total records for pagination */
  totalRecords?: number
  /** Current page (1-indexed) */
  page?: number
  /** Rows per page */
  rows?: number
  /** Page size options */
  rowsPerPageOptions?: number[]
  /** Enable global search */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Enable row selection */
  selectable?: boolean
  /** Toolbar actions */
  toolbarActions?: ActionSchema[]
  /** Per-row actions */
  rowActions?: ActionSchema[]
  /** Bulk actions for selected rows */
  bulkActions?: ActionSchema[]
  /** Filter definitions */
  filters?: FilterConfig[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  page: 1,
  rows: 20,
  rowsPerPageOptions: () => [10, 20, 50, 100],
  searchable: true,
  searchPlaceholder: 'Search...',
  selectable: false,
})

const emit = defineEmits<{
  'page-change': [page: number]
  'rows-change': [rows: number]
  'sort-change': [field: string, order: 'asc' | 'desc']
  'search': [query: string]
  'filter-change': [filters: Record<string, unknown>]
  'action': [action: ActionSchema, data?: Record<string, unknown>]
  'row-click': [data: Record<string, unknown>]
  'selection-change': [selection: Record<string, unknown>[]]
}>()

const { can, filterActions } = useAccess()
const confirm = useConfirm()

// State
const selection = ref<Record<string, unknown>[]>([])
const searchQuery = ref('')
const activeFilters = ref<Record<string, unknown>>({})

// Computed
const availableToolbarActions = computed(() => {
  if (!props.toolbarActions) return []
  return filterActions(props.toolbarActions, props.docType)
})

const availableRowActions = computed(() => {
  if (!props.rowActions) return []
  return filterActions(props.rowActions, props.docType)
})

const availableBulkActions = computed(() => {
  if (!props.bulkActions) return []
  return filterActions(props.bulkActions, props.docType)
})

const hasSelection = computed(() => selection.value.length > 0)

// Debounced search
const debouncedSearch = useDebounceFn((query: string) => {
  emit('search', query)
}, 300)

watch(searchQuery, (query) => {
  debouncedSearch(query)
})

// Methods
const onPage = (event: any) => {
  emit('page-change', event.page + 1)
  emit('rows-change', event.rows)
}

const onSort = (event: any) => {
  const order = event.sortOrder === 1 ? 'asc' : 'desc'
  emit('sort-change', event.sortField, order)
}

const onRowClick = (event: any) => {
  emit('row-click', event.data)
}

const onSelectionChange = (event: any) => {
  selection.value = event
  emit('selection-change', event)
}

const handleAction = (action: ActionSchema, data?: Record<string, unknown>) => {
  if (action.confirm) {
    confirm.require({
      message: action.confirm.message,
      header: action.confirm.title,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: action.confirm.acceptLabel || 'Yes',
      rejectLabel: action.confirm.rejectLabel || 'No',
      acceptClass: action.confirm.severity === 'danger' ? 'p-button-danger' : undefined,
      accept: () => emit('action', action, data),
    })
  } else {
    emit('action', action, data)
  }
}

const handleBulkAction = (action: ActionSchema) => {
  const data = { ids: selection.value.map((item: any) => item.id) }
  handleAction(action, data)
}

const clearSelection = () => {
  selection.value = []
  emit('selection-change', [])
}

// Get nested value with dot notation
const getColumnValue = (data: Record<string, unknown>, field: string) => {
  return field.split('.').reduce((obj: any, key) => obj?.[key], data)
}

// Format cell value based on column type
const formatCellValue = (column: ColumnSchema, value: unknown): string => {
  if (value === null || value === undefined) return '-'
  
  switch (column.type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(value))
    case 'date':
      return new Intl.DateTimeFormat('en-US').format(new Date(String(value)))
    case 'datetime':
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(String(value)))
    case 'number':
      return new Intl.NumberFormat('en-US').format(Number(value))
    default:
      return String(value)
  }
}

// Get tag severity for status-like columns
const getTagSeverity = (value: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' => {
  const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
    active: 'success',
    completed: 'success',
    approved: 'success',
    paid: 'success',
    inactive: 'secondary',
    pending: 'warn',
    draft: 'warn',
    partial: 'warn',
    cancelled: 'danger',
    rejected: 'danger',
    overdue: 'danger',
    error: 'danger',
  }
  return map[value.toLowerCase()] || 'info'
}
</script>

<template>
  <div class="datatable-crud">
    <!-- Toolbar -->
    <div class="datatable-crud__toolbar">
      <div class="datatable-crud__toolbar-start">
        <!-- Bulk Actions (when items selected) -->
        <template v-if="hasSelection">
          <span class="text-sm text-surface-600 mr-3">
            {{ selection.length }} selected
          </span>
          <div class="flex gap-2">
            <Button
              v-for="action in availableBulkActions"
              :key="action.name"
              :label="action.label"
              :icon="action.icon"
              :severity="(action.variant as any) || 'secondary'"
              size="small"
              outlined
              @click="handleBulkAction(action)"
            />
            <Button
              label="Clear"
              icon="pi pi-times"
              severity="secondary"
              size="small"
              text
              @click="clearSelection"
            />
          </div>
        </template>
        
        <!-- Toolbar Actions (when no selection) -->
        <template v-else>
          <Button
            v-for="action in availableToolbarActions"
            :key="action.name"
            :label="action.label"
            :icon="action.icon"
            :severity="(action.variant as any) || 'primary'"
            @click="handleAction(action)"
          />
        </template>
      </div>
      
      <div class="datatable-crud__toolbar-end">
        <!-- Filters -->
        <template v-if="filters && filters.length > 0">
          <Select
            v-for="filter in filters"
            :key="filter.field"
            v-model="activeFilters[filter.field]"
            :options="filter.options"
            optionLabel="label"
            optionValue="value"
            :placeholder="filter.label"
            showClear
            class="w-40"
            @change="emit('filter-change', activeFilters)"
          />
        </template>
        
        <!-- Search -->
        <IconField v-if="searchable">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            class="w-64"
          />
        </IconField>
      </div>
    </div>
    
    <!-- DataTable -->
    <DataTable
      :value="items"
      :loading="loading"
      :paginator="totalRecords !== undefined"
      :rows="rows"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="rowsPerPageOptions"
      :lazy="true"
      :first="(page - 1) * rows"
      :selection="selectable ? selection : undefined"
      :selectionMode="selectable ? 'multiple' : undefined"
      dataKey="id"
      stripedRows
      scrollable
      scrollHeight="flex"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      @page="onPage"
      @sort="onSort"
      @row-click="onRowClick"
      @update:selection="onSelectionChange"
    >
      <!-- Empty State -->
      <template #empty>
        <EmptyState
          icon="pi pi-inbox"
          title="No records found"
          :description="searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating a new record'"
          :actionLabel="can('create', docType) ? 'Create New' : undefined"
          actionIcon="pi pi-plus"
          @action="handleAction(availableToolbarActions.find(a => a.action === 'create')!)"
        />
      </template>
      
      <!-- Loading State -->
      <template #loading>
        <div class="p-4">
          <Skeleton v-for="i in 5" :key="i" class="mb-2" height="2.5rem" />
        </div>
      </template>
      
      <!-- Selection Column -->
      <Column
        v-if="selectable"
        selectionMode="multiple"
        headerStyle="width: 3rem"
      />
      
      <!-- Data Columns -->
      <Column
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :header="column.header"
        :sortable="column.sortable"
        :style="{ width: column.width }"
        :frozen="column.frozen"
      >
        <template #body="{ data }">
          <!-- Custom slot override -->
          <slot :name="`cell-${column.field}`" :data="data" :value="getColumnValue(data, column.field)">
            <!-- Status/Tag columns -->
            <template v-if="column.type === 'select' && column.field.includes('status')">
              <Tag
                :value="getColumnValue(data, column.field)"
                :severity="getTagSeverity(String(getColumnValue(data, column.field)))"
              />
            </template>
            
            <!-- Link columns -->
            <template v-else-if="column.linkTo">
              <router-link
                :to="`/${column.linkRoute || column.linkTo}/${data.id}`"
                class="text-primary hover:underline font-medium"
              >
                {{ getColumnValue(data, column.field) }}
              </router-link>
            </template>
            
            <!-- Standard columns -->
            <template v-else>
              {{ formatCellValue(column, getColumnValue(data, column.field)) }}
            </template>
          </slot>
        </template>
      </Column>
      
      <!-- Actions Column -->
      <Column
        v-if="availableRowActions.length > 0"
        header="Actions"
        headerStyle="width: 8rem"
        frozen
        alignFrozen="right"
      >
        <template #body="{ data }">
          <ActionMenu
            :actions="availableRowActions"
            :data="data"
            type="button"
            @action="(action) => handleAction(action, data)"
          />
        </template>
      </Column>
    </DataTable>
    
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.datatable-crud {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: 0.75rem;
  overflow: hidden;
}

.dark .datatable-crud {
  border-color: var(--p-surface-700);
}

.datatable-crud__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--p-surface-200);
  background: var(--p-surface-50);
  flex-wrap: wrap;
  gap: 1rem;
}

.dark .datatable-crud__toolbar {
  background: var(--p-surface-800);
  border-color: var(--p-surface-700);
}

.datatable-crud__toolbar-start {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.datatable-crud__toolbar-end {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .datatable-crud__toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .datatable-crud__toolbar-end {
    flex-direction: column;
  }
}
</style>
```

### FormBuilder Component

```vue
<!-- src/components/organisms/FormBuilder.vue -->
<script setup lang="ts">
/**
 * FormBuilder generates forms from schema.
 * Handles:
 * - Field rendering based on type
 * - Section organization
 * - Field dependencies (show/hide/enable)
 * - Validation
 * - Access control filtering
 */
import { ref, computed, watch, onMounted } from 'vue'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import FormField from '@/components/molecules/FormField.vue'
import FieldRenderer from '@/components/renderers/FieldRenderer.vue'
import type { FieldSchema, FormSection } from '@/types/schema'
import { useAccess } from '@/composables/useAccess'
import { useCondition } from '@/composables/useCondition'
import { schemaService } from '@/services/schemaService'

interface Props {
  /** Field definitions */
  fields: FieldSchema[]
  /** Section definitions */
  sections?: FormSection[]
  /** Document type for access checks */
  docType: string
  /** Form data (v-model) */
  modelValue: Record<string, unknown>
  /** Form mode */
  mode?: 'create' | 'edit' | 'view'
  /** Loading state */
  loading?: boolean
  /** Resource attributes for access checks */
  resourceAttributes?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'edit',
  loading: false,
  sections: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  'submit': [value: Record<string, unknown>]
  'cancel': []
  'field-change': [field: string, value: unknown]
}>()

const { canAccessField, filterFields } = useAccess()
const { isFieldVisible, isFieldEnabled, isFieldRequired, getSetValue } = useCondition()

// State
const formData = ref<Record<string, unknown>>({})
const errors = ref<Record<string, string>>({})
const touched = ref<Set<string>>(new Set())
const isSubmitting = ref(false)

// Initialize form data
onMounted(() => {
  formData.value = { ...props.modelValue }
})

watch(() => props.modelValue, (newValue) => {
  formData.value = { ...newValue }
}, { deep: true })

// Computed
const isReadonly = computed(() => props.mode === 'view')

const visibleFields = computed(() => {
  return filterFields(
    props.fields, 
    props.docType, 
    isReadonly.value ? 'read' : 'write', 
    props.resourceAttributes
  )
})

const fieldsBySection = computed(() => {
  const map = new Map<string, FieldSchema[]>()
  
  // Initialize with sections
  for (const section of props.sections) {
    map.set(section.name, [])
  }
  map.set('default', [])
  
  // Group fields
  for (const field of visibleFields.value) {
    const sectionName = field.layout?.section || 'default'
    const sectionFields = map.get(sectionName) || []
    sectionFields.push(field)
    map.set(sectionName, sectionFields)
  }
  
  // Sort by order
  for (const [key, fields] of map) {
    map.set(key, fields.sort((a, b) => (a.layout?.order || 0) - (b.layout?.order || 0)))
  }
  
  return map
})

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

// Methods
const updateField = (fieldName: string, value: unknown) => {
  formData.value = { ...formData.value, [fieldName]: value }
  emit('update:modelValue', formData.value)
  emit('field-change', fieldName, value)
  
  // Validate on change if touched
  if (touched.value.has(fieldName)) {
    validateField(fieldName)
  }
  
  // Check for set_value dependencies in other fields
  evaluateSetValueDependencies(fieldName)
}

const evaluateSetValueDependencies = (changedField: string) => {
  for (const field of props.fields) {
    if (!field.behavior?.dependsOn) continue
    
    // Check if any dependency watches the changed field
    const watchesChanged = field.behavior.dependsOn.some(dep => {
      const conditions = Array.isArray(dep.conditions) ? dep.conditions : []
      return conditions.some(c => c.field === changedField)
    })
    
    if (!watchesChanged) continue
    
    const { shouldSet, value } = getSetValue(field.behavior.dependsOn, formData.value)
    if (shouldSet) {
      formData.value = { ...formData.value, [field.name]: value }
      emit('update:modelValue', formData.value)
    }
  }
}

const onFieldBlur = (fieldName: string) => {
  touched.value.add(fieldName)
  validateField(fieldName)
}

const validateField = (fieldName: string) => {
  const field = props.fields.find(f => f.name === fieldName)
  if (!field) return
  
  const error = schemaService.validateField(field, formData.value[fieldName])
  if (error) {
    errors.value = { ...errors.value, [fieldName]: error }
  } else {
    const { [fieldName]: _, ...rest } = errors.value
    errors.value = rest
  }
}

const validateAll = (): boolean => {
  errors.value = schemaService.validateForm(visibleFields.value, formData.value)
  return Object.keys(errors.value).length === 0
}

// Check field visibility based on dependencies
const checkFieldVisibility = (field: FieldSchema): boolean => {
  if (field.layout?.hidden) return false
  return isFieldVisible(field.behavior?.dependsOn, formData.value, true)
}

// Check if field is disabled
const checkFieldDisabled = (field: FieldSchema): boolean => {
  if (isReadonly.value) return true
  if (field.behavior?.disabled) return true
  if (field.behavior?.readonly) return true
  
  // Check access
  const access = canAccessField(field, props.docType, 'write', props.resourceAttributes)
  if (!access.editable) return true
  
  return !isFieldEnabled(field.behavior?.dependsOn, formData.value, true)
}

// Check if field is required
const checkFieldRequired = (field: FieldSchema): boolean => {
  const baseRequired = field.validation?.required || false
  return isFieldRequired(baseRequired, field.behavior?.dependsOn, formData.value)
}

// Get field width class
const getFieldWidth = (field: FieldSchema): string => {
  const width = field.layout?.width || 'half'
  switch (width) {
    case 'full': return 'col-span-12'
    case 'half': return 'col-span-12 md:col-span-6'
    case 'third': return 'col-span-12 md:col-span-4'
    case 'quarter': return 'col-span-12 md:col-span-3'
    default: return 'col-span-12 md:col-span-6'
  }
}

const submit = async () => {
  if (!validateAll()) return
  
  isSubmitting.value = true
  try {
    emit('submit', formData.value)
  } finally {
    isSubmitting.value = false
  }
}

const reset = () => {
  formData.value = { ...props.modelValue }
  errors.value = {}
  touched.value.clear()
}

// Expose methods
defineExpose({
  validate: validateAll,
  reset,
  submit,
})
</script>

<template>
  <form @submit.prevent="submit" class="form-builder">
    <!-- Sections -->
    <template v-if="sections.length > 0">
      <Panel
        v-for="section in sections"
        :key="section.name"
        :header="section.label"
        :toggleable="section.collapsible"
        :collapsed="section.collapsed"
        class="form-builder__section"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <span class="font-semibold">{{ section.label }}</span>
            <span v-if="section.description" class="text-sm text-surface-500 font-normal">
              — {{ section.description }}
            </span>
          </div>
        </template>
        
        <div 
          class="form-builder__fields" 
          :style="{ '--columns': section.columns || 2 }"
        >
          <template v-for="field in fieldsBySection.get(section.name)" :key="field.name">
            <div
              v-if="checkFieldVisibility(field)"
              :class="getFieldWidth(field)"
            >
              <FormField
                :label="field.label"
                :name="field.name"
                :required="checkFieldRequired(field)"
                :error="errors[field.name]"
                :description="field.display?.description"
                :tooltip="field.display?.tooltip"
              >
                <FieldRenderer
                  :field="field"
                  :value="formData[field.name]"
                  :disabled="checkFieldDisabled(field)"
                  :invalid="!!errors[field.name]"
                  @update:value="updateField(field.name, $event)"
                  @blur="onFieldBlur(field.name)"
                />
              </FormField>
            </div>
          </template>
        </div>
      </Panel>
    </template>
    
    <!-- Fields without sections -->
    <template v-else>
      <div class="form-builder__fields">
        <template v-for="field in visibleFields" :key="field.name">
          <div
            v-if="checkFieldVisibility(field)"
            :class="getFieldWidth(field)"
          >
            <FormField
              :label="field.label"
              :name="field.name"
              :required="checkFieldRequired(field)"
              :error="errors[field.name]"
              :description="field.display?.description"
              :tooltip="field.display?.tooltip"
            >
              <FieldRenderer
                :field="field"
                :value="formData[field.name]"
                :disabled="checkFieldDisabled(field)"
                :invalid="!!errors[field.name]"
                @update:value="updateField(field.name, $event)"
                @blur="onFieldBlur(field.name)"
              />
            </FormField>
          </div>
        </template>
      </div>
    </template>
    
    <!-- Actions -->
    <div v-if="!isReadonly" class="form-builder__actions">
      <slot name="actions">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          outlined
          @click="emit('cancel')"
        />
        <Button
          type="submit"
          label="Save"
          :loading="isSubmitting || loading"
          :disabled="hasErrors"
        />
      </slot>
    </div>
  </form>
</template>

<style scoped>
.form-builder {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-builder__section {
  margin-bottom: 0;
}

.form-builder__fields {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.form-builder__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--p-surface-200);
}

.dark .form-builder__actions {
  border-color: var(--p-surface-700);
}
</style>
```

### FormDrawer Component

```vue
<!-- src/components/organisms/FormDrawer.vue -->
<script setup lang="ts">
/**
 * FormDrawer wraps FormBuilder in a side drawer.
 * Used for create/edit operations without full page navigation.
 */
import { ref, computed, watch } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import FormBuilder from './FormBuilder.vue'
import type { FieldSchema, FormSection } from '@/types/schema'

interface Props {
  /** Drawer visibility (v-model) */
  visible: boolean
  /** Drawer title */
  title: string
  /** Form mode */
  mode: 'create' | 'edit' | 'view'
  /** Document type */
  docType: string
  /** Field definitions */
  fields: FieldSchema[]
  /** Section definitions */
  sections?: FormSection[]
  /** Form data */
  data?: Record<string, unknown>
  /** Loading state */
  loading?: boolean
  /** Drawer position */
  position?: 'left' | 'right' | 'top' | 'bottom'
  /** Drawer width */
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view',
  loading: false,
  position: 'right',
  width: '600px',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'save': [data: Record<string, unknown>]
  'cancel': []
}>()

const formBuilder = ref<InstanceType<typeof FormBuilder>>()
const formData = ref<Record<string, unknown>>({})

// Initialize form data when drawer opens
watch(() => props.visible, (visible) => {
  if (visible) {
    formData.value = props.data ? { ...props.data } : {}
  }
})

// Computed
const drawerTitle = computed(() => {
  const modeLabels = {
    create: 'Create',
    edit: 'Edit',
    view: 'View',
  }
  return props.title || modeLabels[props.mode]
})

const isReadonly = computed(() => props.mode === 'view')

// Methods
const handleClose = () => {
  emit('update:visible', false)
  emit('cancel')
}

const handleSave = async () => {
  if (!formBuilder.value) return
  
  const isValid = formBuilder.value.validate()
  if (!isValid) return
  
  emit('save', formData.value)
}
</script>

<template>
  <Drawer
    :visible="visible"
    :header="drawerTitle"
    :position="position"
    :modal="true"
    :style="{ width }"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <span class="font-semibold text-lg">{{ drawerTitle }}</span>
      </div>
    </template>
    
    <div class="form-drawer__content">
      <FormBuilder
        ref="formBuilder"
        v-model="formData"
        :fields="fields"
        :sections="sections"
        :doc-type="docType"
        :mode="mode"
        :loading="loading"
        @submit="handleSave"
        @cancel="handleClose"
      >
        <template #actions>
          <Button
            v-if="!isReadonly"
            type="button"
            label="Cancel"
            severity="secondary"
            outlined
            @click="handleClose"
          />
          <Button
            v-if="!isReadonly"
            type="submit"
            :label="mode === 'create' ? 'Create' : 'Save'"
            :loading="loading"
          />
          <Button
            v-if="isReadonly"
            type="button"
            label="Close"
            @click="handleClose"
          />
        </template>
      </FormBuilder>
    </div>
  </Drawer>
</template>

<style scoped>
.form-drawer__content {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
}
</style>
```

---

## Schema Renderers

### FieldRenderer Component

```vue
<!-- src/components/renderers/FieldRenderer.vue -->
<script setup lang="ts">
/**
 * FieldRenderer maps field types to PrimeVue components.
 * This is the core of schema-driven form rendering.
 */
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import DatePicker from 'primevue/datepicker'
import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'
import Password from 'primevue/password'
import Chips from 'primevue/chips'
import InputMask from 'primevue/inputmask'
import AutoComplete from 'primevue/autocomplete'
import type { FieldSchema } from '@/types/schema'

interface Props {
  /** Field definition */
  field: FieldSchema
  /** Current value */
  value: unknown
  /** Disabled state */
  disabled?: boolean
  /** Invalid state (has error) */
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{
  'update:value': [value: unknown]
  'blur': []
}>()

// Get options from field definition
const options = computed(() => {
  return props.field.data?.options || []
})

// Common input class
const inputClass = computed(() => ({
  'w-full': true,
  'p-invalid': props.invalid,
}))

// Get placeholder
const placeholder = computed(() => {
  return props.field.behavior?.placeholder || ''
})
</script>

<template>
  <!-- Text Input -->
  <InputText
    v-if="field.type === 'text'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="placeholder"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Email Input -->
  <InputText
    v-else-if="field.type === 'email'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="placeholder || 'email@example.com'"
    type="email"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Phone Input -->
  <InputMask
    v-else-if="field.type === 'phone'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    mask="(999) 999-9999"
    :placeholder="placeholder || '(999) 999-9999'"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Password Input -->
  <Password
    v-else-if="field.type === 'password'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="placeholder"
    :feedback="false"
    toggleMask
    :class="inputClass"
    inputClass="w-full"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Textarea -->
  <Textarea
    v-else-if="field.type === 'textarea'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="placeholder"
    :rows="5"
    :autoResize="true"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Number Input -->
  <InputNumber
    v-else-if="field.type === 'number'"
    :modelValue="(value as number) ?? null"
    :disabled="disabled"
    :placeholder="placeholder"
    :min="field.validation?.min"
    :max="field.validation?.max"
    :class="inputClass"
    inputClass="w-full"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Currency Input -->
  <InputNumber
    v-else-if="field.type === 'currency'"
    :modelValue="(value as number) ?? null"
    :disabled="disabled"
    :placeholder="placeholder"
    mode="currency"
    :currency="(field.typeConfig as any)?.currency || 'USD'"
    :locale="(field.typeConfig as any)?.locale || 'en-US'"
    :min="field.validation?.min"
    :max="field.validation?.max"
    :class="inputClass"
    inputClass="w-full"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Select -->
  <Select
    v-else-if="field.type === 'select'"
    :modelValue="value"
    :disabled="disabled"
    :options="options"
    optionLabel="label"
    optionValue="value"
    :placeholder="placeholder || 'Select...'"
    :showClear="!field.validation?.required"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- MultiSelect -->
  <MultiSelect
    v-else-if="field.type === 'multiselect'"
    :modelValue="(value as unknown[]) || []"
    :disabled="disabled"
    :options="options"
    optionLabel="label"
    optionValue="value"
    :placeholder="placeholder || 'Select...'"
    :maxSelectedLabels="3"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Date -->
  <DatePicker
    v-else-if="field.type === 'date'"
    :modelValue="value ? new Date(value as string) : null"
    :disabled="disabled"
    :placeholder="placeholder || 'Select date'"
    dateFormat="mm/dd/yy"
    :showIcon="true"
    :showButtonBar="true"
    :class="inputClass"
    inputClass="w-full"
    @update:modelValue="emit('update:value', $event?.toISOString().split('T')[0])"
    @blur="emit('blur')"
  />
  
  <!-- DateTime -->
  <DatePicker
    v-else-if="field.type === 'datetime'"
    :modelValue="value ? new Date(value as string) : null"
    :disabled="disabled"
    :placeholder="placeholder"
    :showTime="true"
    :showIcon="true"
    :showButtonBar="true"
    :class="inputClass"
    inputClass="w-full"
    @update:modelValue="emit('update:value', $event?.toISOString())"
    @blur="emit('blur')"
  />
  
  <!-- Checkbox -->
  <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2">
    <Checkbox
      :modelValue="value as boolean"
      :disabled="disabled"
      :binary="true"
      :inputId="field.name"
      @update:modelValue="emit('update:value', $event)"
    />
    <label :for="field.name" class="cursor-pointer">
      {{ field.label }}
    </label>
  </div>
  
  <!-- Switch -->
  <ToggleSwitch
    v-else-if="field.type === 'switch'"
    :modelValue="value as boolean"
    :disabled="disabled"
    @update:modelValue="emit('update:value', $event)"
  />
  
  <!-- Link (AutoComplete) -->
  <AutoComplete
    v-else-if="field.type === 'link'"
    :modelValue="value"
    :disabled="disabled"
    :placeholder="placeholder"
    :dropdown="true"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
  
  <!-- Readonly -->
  <div
    v-else-if="field.type === 'readonly'"
    class="p-3 bg-surface-100 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-700"
  >
    {{ value || '-' }}
  </div>
  
  <!-- Default: Text Input -->
  <InputText
    v-else
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="placeholder"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="emit('blur')"
  />
</template>
```

### DocumentPage Renderer

```vue
<!-- src/components/renderers/DocumentPage.vue -->
<script setup lang="ts">
/**
 * DocumentPage is the top-level renderer for document schemas.
 * Combines DataTableCrud and FormDrawer for complete CRUD functionality.
 */
import { ref, computed } from 'vue'
import DataTableCrud from '@/components/organisms/DataTableCrud.vue'
import FormDrawer from '@/components/organisms/FormDrawer.vue'
import { useSchema } from '@/composables/useSchema'
import { useCrud } from '@/composables/useCrud'
import { useDrawer } from '@/composables/useDrawer'
import type { ActionSchema } from '@/types/schema'

interface Props {
  /** Document type to render */
  docType: string
}

const props = defineProps<Props>()

// Load schema
const {
  schema,
  isLoading: schemaLoading,
  columns,
  visibleFields,
  sections,
  toolbarActions,
  rowActions,
  bulkActions,
  filters,
  apiConfig,
  defaultValues,
} = useSchema(props.docType)

// CRUD operations (reactive to apiConfig)
const crud = computed(() => {
  if (!apiConfig.value) return null
  return useCrud({
    docType: props.docType,
    apiConfig: apiConfig.value,
  })
})

// Drawer state
const drawer = useDrawer<Record<string, unknown>>()

// Current item being edited
const currentItem = ref<Record<string, unknown> | null>(null)

// Page title
const pageTitle = computed(() => schema.value?.labelPlural || props.docType)

// Handle toolbar actions
const handleToolbarAction = (action: ActionSchema) => {
  switch (action.action) {
    case 'create':
      currentItem.value = { ...defaultValues.value }
      drawer.openCreate(`New ${schema.value?.label || props.docType}`)
      break
    case 'export':
      // Handle export
      break
    case 'import':
      // Handle import
      break
  }
}

// Handle row actions
const handleRowAction = (action: ActionSchema, data: Record<string, unknown>) => {
  switch (action.action) {
    case 'edit':
      currentItem.value = { ...data }
      drawer.openEdit(data, `Edit ${schema.value?.label || props.docType}`)
      break
    case 'delete':
      crud.value?.remove(String(data.id))
      break
    case 'duplicate':
      const { id, ...rest } = data
      currentItem.value = { ...rest }
      drawer.openCreate(`Duplicate ${schema.value?.label || props.docType}`)
      break
  }
}

// Handle action dispatch
const handleAction = (action: ActionSchema, data?: Record<string, unknown>) => {
  if (data && 'ids' in data) {
    // Bulk action
    if (action.action === 'delete') {
      crud.value?.bulkDelete(data.ids as string[])
    }
  } else if (data) {
    handleRowAction(action, data)
  } else {
    handleToolbarAction(action)
  }
}

// Handle form save
const handleSave = async (data: Record<string, unknown>) => {
  try {
    if (drawer.isCreateMode.value) {
      await crud.value?.create(data)
    } else {
      await crud.value?.update(String(currentItem.value?.id), data)
    }
    drawer.close()
    currentItem.value = null
  } catch (error) {
    // Error handled by useCrud
  }
}

// Handle row click for view
const handleRowClick = (data: Record<string, unknown>) => {
  currentItem.value = { ...data }
  drawer.openView(data, schema.value?.label || props.docType)
}
</script>

<template>
  <div class="document-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    
    <!-- Data Table -->
    <DataTableCrud
      v-if="crud"
      :items="crud.items.value"
      :loading="crud.isListLoading.value || schemaLoading"
      :columns="columns"
      :doc-type="docType"
      :total-records="crud.pagination.value?.total"
      :page="crud.listParams.value.page"
      :rows="crud.listParams.value.limit"
      :toolbar-actions="toolbarActions"
      :row-actions="rowActions"
      :bulk-actions="bulkActions"
      :filters="filters"
      selectable
      @page-change="crud.setPage($event)"
      @rows-change="crud.setLimit($event)"
      @sort-change="crud.setSort"
      @search="crud.setSearch($event)"
      @filter-change="crud.setFilters($event)"
      @action="handleAction"
      @row-click="handleRowClick"
    />
    
    <!-- Form Drawer -->
    <FormDrawer
      v-model:visible="drawer.isOpen.value"
      :title="drawer.title.value"
      :mode="drawer.mode.value"
      :doc-type="docType"
      :fields="visibleFields"
      :sections="sections"
      :data="currentItem || undefined"
      :loading="crud?.isCreating.value || crud?.isUpdating.value"
      @save="handleSave"
      @cancel="drawer.close"
    />
  </div>
</template>

<style scoped>
.document-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}
</style>
```

---

# Part 6: Advanced Features

## JSON Schema Examples

### Complete Customer Schema

```json
{
  "name": "customer",
  "label": "Customer",
  "labelPlural": "Customers",
  "icon": "pi pi-users",
  "description": "Customer master data",
  "module": "sales",
  "version": "1.0.0",
  "updatedAt": "2024-01-15T10:30:00Z",

  "api": {
    "baseEndpoint": "/api/v1/customers",
    "pagination": {
      "defaultLimit": 20
    },
    "responseFormat": {
      "dataPath": "data",
      "metaPath": "meta",
      "totalField": "total"
    }
  },

  "listView": {
    "columns": [
      {
        "field": "code",
        "header": "Code",
        "type": "text",
        "width": "120px",
        "sortable": true,
        "frozen": true,
        "linkTo": "customer"
      },
      {
        "field": "name",
        "header": "Name",
        "type": "text",
        "sortable": true,
        "filterable": true
      },
      {
        "field": "type",
        "header": "Type",
        "type": "select",
        "sortable": true
      },
      {
        "field": "email",
        "header": "Email",
        "type": "email"
      },
      {
        "field": "status",
        "header": "Status",
        "type": "select",
        "sortable": true
      }
    ],
    "defaultSort": {
      "field": "name",
      "order": "asc"
    },
    "searchable": true,
    "searchFields": ["code", "name", "email"],
    "selectable": true,
    "toolbarActions": [
      {
        "name": "create",
        "label": "New Customer",
        "icon": "pi pi-plus",
        "type": "button",
        "variant": "primary",
        "action": "create"
      }
    ],
    "rowActions": [
      {
        "name": "edit",
        "label": "Edit",
        "icon": "pi pi-pencil",
        "type": "button",
        "action": "edit"
      },
      {
        "name": "delete",
        "label": "Delete",
        "icon": "pi pi-trash",
        "type": "button",
        "variant": "danger",
        "action": "delete",
        "confirm": {
          "title": "Delete Customer",
          "message": "Are you sure?",
          "severity": "danger"
        }
      }
    ]
  },

  "formView": {
    "sections": [
      {
        "name": "basic",
        "label": "Basic Information",
        "columns": 2
      },
      {
        "name": "contact",
        "label": "Contact Details",
        "columns": 2
      }
    ],
    "fields": [
      {
        "name": "code",
        "label": "Customer Code",
        "type": "text",
        "layout": {
          "section": "basic",
          "width": "half",
          "order": 1
        },
        "behavior": {
          "readonly": true
        },
        "display": {
          "description": "Auto-generated"
        }
      },
      {
        "name": "type",
        "label": "Customer Type",
        "type": "select",
        "layout": {
          "section": "basic",
          "width": "half",
          "order": 2
        },
        "validation": {
          "required": true
        },
        "data": {
          "defaultValue": "individual",
          "options": [
            { "value": "individual", "label": "Individual" },
            { "value": "company", "label": "Company" }
          ]
        }
      },
      {
        "name": "name",
        "label": "Customer Name",
        "type": "text",
        "layout": {
          "section": "basic",
          "width": "half",
          "order": 3
        },
        "validation": {
          "required": true,
          "minLength": 2,
          "maxLength": 100
        }
      },
      {
        "name": "company_name",
        "label": "Company Name",
        "type": "text",
        "layout": {
          "section": "basic",
          "width": "half",
          "order": 4
        },
        "behavior": {
          "dependsOn": [
            {
              "conditions": [
                { "field": "type", "operator": "eq", "value": "company" }
              ],
              "action": "show"
            }
          ]
        }
      },
      {
        "name": "email",
        "label": "Email",
        "type": "email",
        "layout": {
          "section": "contact",
          "width": "half",
          "order": 1
        },
        "validation": {
          "required": true
        }
      },
      {
        "name": "phone",
        "label": "Phone",
        "type": "phone",
        "layout": {
          "section": "contact",
          "width": "half",
          "order": 2
        }
      },
      {
        "name": "status",
        "label": "Status",
        "type": "select",
        "layout": {
          "section": "basic",
          "width": "half",
          "order": 5
        },
        "validation": {
          "required": true
        },
        "data": {
          "defaultValue": "active",
          "options": [
            { "value": "active", "label": "Active", "color": "green" },
            { "value": "inactive", "label": "Inactive", "color": "gray" }
          ]
        }
      }
    ]
  },

  "access": {
    "requiredModule": "sales",
    "permissions": {
      "create": { "roles": ["admin", "sales_manager"] },
      "read": { "roles": ["admin", "sales_manager", "sales_rep"] },
      "update": { "roles": ["admin", "sales_manager"] },
      "delete": { "roles": ["admin"] }
    }
  }
}
```

---

# Part 7: Application Shell

## API Service

```typescript
// src/services/api.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add tenant header if available
    const tenantId = localStorage.getItem('tenantId')
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { useAuthStore } = await import('@/stores/authStore')
        const authStore = useAuthStore()
        const success = await authStore.refreshSession()
        if (success) {
          originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`
          return api(originalRequest)
        }
      } catch {
        window.location.href = '/auth/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
```

---

# Part 8: Best Practices

## Schema Design Best Practices

1. **Use snake_case for field names** - Matches Go conventions
2. **Group related properties** - Use layout.section for organization
3. **Define explicit types** - Avoid 'custom' type unless necessary
4. **Set appropriate defaults** - Reduce user input burden
5. **Include descriptions** - Help Schema Builder users
6. **Plan access control** - Define permissions early
7. **Keep conditions simple** - Complex logic belongs on backend

## Component Organization Best Practices

1. **Don't wrap PrimeVue atoms** - Use directly with PT API
2. **Create molecules for patterns** - FormField, StatCard, etc.
3. **Create organisms for features** - DataTableCrud, FormBuilder
4. **Use renderers for schema** - DocumentPage, FieldRenderer
5. **Leverage slots** - Let parent customize

## Performance Optimization

1. **Cache schemas** - Use Vue Query with staleTime
2. **Lazy load routes** - Dynamic imports
3. **Debounce search** - 300ms minimum
4. **Virtual scroll** - For large lists
5. **Memoize computed** - Avoid recalculation

---

## Summary

This documentation provides a complete architecture for a schema-driven ERP system:

1. **Schema V1.0** - Clean, parseable structure aligned with Go backend
2. **Condition Alignment** - Operators match Go condition package exactly
3. **Backend/Frontend Split** - Clear separation of responsibilities
4. **PrimeVue Integration** - Proper component patterns, no unnecessary wrappers
5. **Access Control** - Three-layer model with ABAC support
6. **Type Safety** - Full TypeScript with detailed documentation

### Key Benefits

- **Rapid Development**: Define documents in JSON, not code
- **Consistency**: All pages share the same components
- **Backend Integration**: Schema structures match Go backend
- **Security**: Frontend conditions are hints, backend is authoritative
- **Maintainability**: Changes in schema affect all instances

<function_calls>
<invoke name="view">
<parameter name="path">/home/claude/dhoolui-complete-documentation.md
