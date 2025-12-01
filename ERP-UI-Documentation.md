# Dhool ERP UI - Complete Documentation

> A comprehensive Vue 3 + PrimeVue 4 enterprise ERP user interface with schema-driven UI generation, multi-tenant theming, ABAC security, subscription-based feature access, and module-level permissions.

## Table of Contents

### Part 1: Foundation & Architecture
1. [Philosophy & Architecture](#philosophy--architecture)
   - [Why Schema-Driven UI?](#why-schema-driven-ui)
   - [The Schema-Driven Solution](#the-schema-driven-solution)
   - [Multi-Level Access Control](#multi-level-access-control)
   - [Component Architecture (Atomic Design)](#component-architecture-atomic-design)
2. [Project Setup](#project-setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Project Structure](#project-structure)
3. [PrimeVue 4 Configuration](#primevue-4-configuration)
   - [Vite Configuration](#vite-configuration)
   - [Main Entry Point](#main-entry-point)
   - [Tailwind Configuration](#tailwind-configuration)
   - [Base CSS](#base-css)
4. [Type System](#type-system)
   - [Core Schema Types](#core-schema-types)
   - [Access Control Types](#access-control-types)

### Part 2: Access Control & Schema Engine
5. [Access Control System](#access-control-system)
   - [Access Service](#access-service)
   - [Access Store](#access-store)
6. [Schema Engine](#schema-engine)
   - [Schema Service](#schema-service)
7. [Composables](#composables)
   - [useAccess Composable](#useaccess-composable)
   - [useSchema Composable](#useschema-composable)
   - [useCrud Composable](#usecrud-composable)
   - [useNotification Composable](#usenotification-composable)
   - [useDrawer Composable](#usedrawer-composable)

### Part 3: Components
8. [Component Philosophy](#component-philosophy)
   - [When to Create Custom Components](#when-to-create-custom-components)
   - [PrimeVue 4 Component Patterns](#primevue-4-component-patterns)
9. [Molecules](#molecules)
   - [FormField Component](#formfield-component)
   - [StatCard Component](#statcard-component)
   - [ActionMenu Component](#actionmenu-component)
   - [EmptyState Component](#emptystate-component)
10. [Organisms](#organisms)
    - [DataTableCrud Component](#datatablecrud-component)
    - [FormBuilder Component](#formbuilder-component)
    - [FormDrawer Component](#formdrawer-component)
11. [Schema Renderers](#schema-renderers)
    - [FieldRenderer Component](#fieldrenderer-component)
    - [DocumentPage Renderer](#documentpage-renderer)
12. [Extending PrimeVue](#extending-primevue)
    - [When to Extend vs. Wrap](#when-to-extend-vs-wrap)
    - [Example: Extended DataTable](#example-extended-datatable)
    - [Example: Custom Field Component](#example-custom-field-component)

### Part 4: JSON Schemas & Advanced Patterns
13. [JSON Schema Structure](#json-schema-structure)
    - [Schema File Location Strategy](#schema-file-location-strategy)
14. [Complete Schema Examples](#complete-schema-examples)
    - [Customer Schema (Full Example)](#customer-schema-full-example)
    - [Invoice Schema (Transaction Document)](#invoice-schema-transaction-document)
    - [Dashboard Schema](#dashboard-schema)
15. [Schema Builder UI](#schema-builder-ui)
    - [Schema Builder Store](#schema-builder-store)
    - [Schema Builder Component (Simplified)](#schema-builder-component-simplified)
16. [Dynamic Route Generation](#dynamic-route-generation)
17. [Multi-Tenant Theming](#multi-tenant-theming)
    - [Theme Configuration Store](#theme-configuration-store)
    - [Tenant Theme Loader](#tenant-theme-loader)
18. [Best Practices](#best-practices)
    - [Schema Design Principles](#1-schema-design-principles)
    - [Component Organization](#2-component-organization)
    - [Access Control Strategy](#3-access-control-strategy)
    - [Performance Optimization](#4-performance-optimization)
    - [Error Handling](#5-error-handling)
    - [Testing Schema-Driven Components](#6-testing-schema-driven-components)

### Part 5: Integration & Deployment
19. [Application Shell](#application-shell)
    - [App.vue](#appvue)
20. [Layout Components](#layout-components)
    - [MainLayout](#mainlayout)
    - [AppTopbar](#apptopbar)
    - [AppSidebar](#appsidebar)
21. [Stores](#stores)
    - [Auth Store](#auth-store)
    - [Tenant Store](#tenant-store)
    - [UI Store](#ui-store)
22. [API Service](#api-service)
23. [Router Guards](#router-guards)
    - [Router Index](#router-index)
24. [App Initialization](#app-initialization)
    - [Updated main.ts](#updated-maints)
25. [Summary](#summary)

---

## Philosophy & Architecture

### Why Schema-Driven UI?

In enterprise ERP systems, you'll have hundreds of similar pages:
- **Document Lists**: Invoices, Orders, Transactions, Users, Products
- **Document Forms**: Create/Edit dialogs with validation
- **Dashboards**: KPIs, charts, activity feeds
- **Reports**: Filtered data exports

Writing individual Vue components for each is:
- **Time-consuming**: 80% of code is repetitive
- **Error-prone**: Inconsistent implementations
- **Hard to maintain**: Changes require touching many files
- **Inflexible**: Backend developers can't modify UI

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
│   │ - Fields     │     │ - Access     │     │ - DataTable  │            │
│   │ - Actions    │     │   Control    │     │ - Forms      │            │
│   │ - API Config │     │ - Feature    │     │ - Actions    │            │
│   │ - Permissions│     │   Flags      │     │ - Validation │            │
│   │ - Layout     │     │ - Theming    │     │              │            │
│   └──────────────┘     └──────────────┘     └──────────────┘            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Multi-Level Access Control

Your SaaS ERP needs three layers of access control:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ACCESS CONTROL HIERARCHY                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LAYER 1: SUBSCRIPTION (Tenant Level)                                   │
│  ├── Which MODULES are available?                                       │
│  ├── Which FEATURES within modules?                                     │
│  └── What LIMITS apply? (users, records, storage)                       │
│                                                                          │
│  LAYER 2: MODULE ACCESS (Role Level)                                    │
│  ├── Which modules can this ROLE access?                                │
│  ├── What ACTIONS within each module?                                   │
│  └── What DATA SCOPE? (own, department, all)                            │
│                                                                          │
│  LAYER 3: FIELD ACCESS (ABAC - Attribute Level)                         │
│  ├── Which FIELDS can user see?                                         │
│  ├── Which FIELDS can user edit?                                        │
│  └── What VALUES can user set?                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture (Atomic Design)

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
│  └── ListPageTemplate, FormPageTemplate, DashboardTemplate              │
│      └── Define regions: header, content, sidebar, footer               │
│                                                                          │
│  ORGANISMS (Complex Components - Composed of Molecules)                  │
│  └── DataTableCrud, FormBuilder, ChartWidget, TreeNav                   │
│      └── Full-featured, self-contained functionality                    │
│                                                                          │
│  MOLECULES (Simple Compositions - PrimeVue + Custom Logic)              │
│  └── FormField, SearchBar, StatCard, ActionMenu                         │
│      └── Combine atoms with specific behavior                           │
│                                                                          │
│  ATOMS (Base Elements - Mostly PrimeVue Wrappers)                       │
│  └── Usually just use PrimeVue directly, extend when needed             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Project Setup

### Prerequisites

- Node.js 20+
- pnpm 9+

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
│   │       ├── primevue-theme.css    # PrimeVue customizations
│   │       └── components.css        # Component-specific styles
│   │
│   ├── components/
│   │   ├── atoms/                    # Rarely needed - use PrimeVue
│   │   ├── molecules/
│   │   │   ├── FormField.vue
│   │   │   ├── SearchBar.vue
│   │   │   ├── StatCard.vue
│   │   │   ├── ActionMenu.vue
│   │   │   └── EmptyState.vue
│   │   ├── organisms/
│   │   │   ├── DataTableCrud.vue     # Schema-driven CRUD table
│   │   │   ├── FormBuilder.vue       # Schema-driven form
│   │   │   ├── FormDrawer.vue        # Form in drawer/dialog
│   │   │   ├── AppSidebar.vue
│   │   │   ├── AppTopbar.vue
│   │   │   └── ChartWidget.vue
│   │   ├── templates/
│   │   │   ├── MainLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   └── BlankLayout.vue
│   │   └── renderers/                # Schema renderers
│   │       ├── DocumentPage.vue      # Renders document list/form
│   │       ├── DashboardPage.vue     # Renders dashboard
│   │       └── FieldRenderer.vue     # Renders form fields
│   │
│   ├── composables/
│   │   ├── useAccess.ts              # Unified access control
│   │   ├── useSchema.ts              # Schema loading & parsing
│   │   ├── useCrud.ts                # CRUD operations
│   │   ├── useDrawer.ts              # Drawer state
│   │   └── useNotification.ts        # Toast notifications
│   │
│   ├── schemas/                      # JSON UI Schemas
│   │   ├── documents/
│   │   │   ├── invoice.json
│   │   │   ├── customer.json
│   │   │   ├── product.json
│   │   │   └── user.json
│   │   ├── dashboards/
│   │   │   └── main.json
│   │   └── meta/
│   │       └── field-types.json      # Field type definitions
│   │
│   ├── services/
│   │   ├── api.ts                    # Axios instance
│   │   ├── schemaService.ts          # Schema fetching
│   │   └── accessService.ts          # Access control engine
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── tenantStore.ts            # Subscription & modules
│   │   ├── accessStore.ts            # ABAC state
│   │   └── uiStore.ts                # UI state (sidebar, theme)
│   │
│   ├── types/
│   │   ├── schema.ts                 # Schema type definitions
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
├── schemas/                          # Source schemas (if using builder)
├── .env
├── .env.development
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
    
    // Auto-import PrimeVue components
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

// PrimeVue Services
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

const app = createApp(App)

// ============================================
// PRIMEVUE 4 CONFIGURATION
// ============================================

// Custom theme preset extending Aura
const DhoolPreset = definePreset(Aura, {
  semantic: {
    // Primary color palette
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
    
    // Color scheme tokens
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
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
  ripple: true,
  
  // Pass-Through (PT) API for global component customization
  pt: {
    // Global DataTable styling
    datatable: {
      root: { class: 'border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden' },
      header: { class: 'bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700' },
      tbody: { class: 'divide-y divide-surface-200 dark:divide-surface-700' },
    },
    
    // Global Card styling
    card: {
      root: { class: 'border border-surface-200 dark:border-surface-700 shadow-sm' },
    },
    
    // Global Button styling
    button: {
      root: { class: 'font-medium' },
    },
    
    // Global Dialog styling
    dialog: {
      root: { class: 'border border-surface-200 dark:border-surface-700' },
      header: { class: 'border-b border-surface-200 dark:border-surface-700' },
      footer: { class: 'border-t border-surface-200 dark:border-surface-700' },
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
// OTHER PLUGINS
// ============================================

// Pinia state management
const pinia = createPinia()
app.use(pinia)

// Vue Query
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
      },
    },
  },
})

// Router
app.use(router)

app.mount('#app')
```

### Tailwind Configuration

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
      // Use PrimeVue's CSS variables for consistency
      colors: {
        // These map to PrimeVue's semantic tokens
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
   COMPONENT LAYER - Custom component styles
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

/* Fix for icons in buttons */
.p-button .p-button-icon {
  font-size: 1rem;
}

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

## Type System

### Core Schema Types

```typescript
// src/types/schema.ts

// ============================================
// FIELD TYPES
// ============================================

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'link'          // Reference to another document
  | 'table'         // Child table
  | 'image'
  | 'file'
  | 'color'
  | 'rating'
  | 'tags'
  | 'password'
  | 'email'
  | 'phone'
  | 'url'
  | 'json'
  | 'html'
  | 'markdown'
  | 'signature'
  | 'geolocation'
  | 'duration'
  | 'readonly'      // Computed/display only
  | 'custom'        // Custom component

// ============================================
// FIELD SCHEMA
// ============================================

export interface FieldSchema {
  // Identity
  name: string                    // Field key (e.g., "customer_name")
  label: string                   // Display label
  type: FieldType
  
  // Data
  defaultValue?: unknown
  placeholder?: string
  options?: FieldOption[]         // For select/radio
  optionsSource?: OptionsSource   // Dynamic options from API
  
  // Layout
  width?: 'full' | 'half' | 'third' | 'quarter' | 'auto'
  section?: string                // Group fields into sections
  order?: number
  hidden?: boolean                // Always hidden (use for computed fields)
  
  // Validation
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string                // Regex pattern
  customValidator?: string        // Reference to custom validator function
  
  // Display
  prefix?: string                 // e.g., "$" for currency
  suffix?: string                 // e.g., "%" for percent
  format?: string                 // Date format, number format
  
  // Behavior
  readonly?: boolean              // Read-only (but visible)
  disabled?: boolean
  depends_on?: FieldDependency[]  // Conditional visibility/value
  onChange?: string               // Reference to change handler
  
  // Access Control (evaluated at runtime)
  access?: FieldAccessControl
  
  // Link field specific
  linkTo?: string                 // Target doctype for link fields
  linkFilters?: Record<string, unknown>  // Filters for linked records
  
  // Table field specific
  tableSchema?: FieldSchema[]     // Schema for child table rows
  minRows?: number
  maxRows?: number
  
  // Custom component
  component?: string              // Vue component name for custom type
  componentProps?: Record<string, unknown>
  
  // Help
  description?: string            // Help text
  tooltip?: string
}

export interface FieldOption {
  value: string | number | boolean
  label: string
  disabled?: boolean
  icon?: string
  color?: string
}

export interface OptionsSource {
  type: 'api' | 'store' | 'static'
  endpoint?: string               // For API type
  storePath?: string              // For store type
  valueField?: string             // Field to use as value
  labelField?: string             // Field to use as label
  params?: Record<string, unknown> // Query params
  dependsOn?: string[]            // Re-fetch when these fields change
}

export interface FieldDependency {
  field: string                   // Field to watch
  operator: 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'lt' | 'gte' | 'lte' | 'empty' | 'not_empty'
  value?: unknown                 // Value to compare
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'set_value'
  actionValue?: unknown           // Value to set (for set_value action)
}

export interface FieldAccessControl {
  // Subscription level - hide field if not in plan
  requiredPlan?: string[]         // ['pro', 'enterprise']
  requiredModule?: string         // Module that must be enabled
  
  // Permission level
  readRoles?: string[]            // Roles that can view
  writeRoles?: string[]           // Roles that can edit
  
  // ABAC conditions
  conditions?: AccessCondition[]
}

// ============================================
// ACTION SCHEMA
// ============================================

export interface ActionSchema {
  name: string                    // Action identifier
  label: string                   // Display label
  icon?: string                   // PrimeIcon name
  type: 'button' | 'menu' | 'split'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'outlined'
  
  // Behavior
  action: ActionType
  confirm?: ConfirmConfig         // Confirmation dialog
  
  // Conditions
  showWhen?: ActionCondition[]    // When to show this action
  disableWhen?: ActionCondition[] // When to disable
  
  // Access
  access?: ActionAccessControl
  
  // For API actions
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  payload?: Record<string, unknown>
  
  // For navigation
  route?: string
  routeParams?: Record<string, string>
  
  // For custom handlers
  handler?: string                // Reference to handler function
  
  // Children (for menu type)
  children?: ActionSchema[]
}

export type ActionType =
  | 'create'
  | 'edit'
  | 'delete'
  | 'duplicate'
  | 'export'
  | 'import'
  | 'print'
  | 'email'
  | 'api'           // Generic API call
  | 'navigate'
  | 'workflow'      // Workflow transition
  | 'custom'

export interface ConfirmConfig {
  title: string
  message: string
  acceptLabel?: string
  rejectLabel?: string
  severity?: 'warning' | 'danger' | 'info'
}

export interface ActionCondition {
  field: string
  operator: 'eq' | 'neq' | 'in' | 'nin' | 'empty' | 'not_empty'
  value?: unknown
}

export interface ActionAccessControl {
  requiredPlan?: string[]
  requiredModule?: string
  requiredPermissions?: string[]
  requiredRoles?: string[]
}

// ============================================
// COLUMN SCHEMA (DataTable)
// ============================================

export interface ColumnSchema {
  field: string                   // Data field path
  header: string                  // Column header
  type: FieldType                 // Affects rendering
  
  // Display
  width?: string                  // CSS width
  align?: 'left' | 'center' | 'right'
  frozen?: boolean
  
  // Features
  sortable?: boolean
  filterable?: boolean
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean'
  filterOptions?: FieldOption[]
  
  // Formatting
  format?: string                 // Date/number format
  template?: string               // Custom template name
  
  // Link behavior
  linkTo?: string                 // Make column a link
  linkRoute?: string              // Route for link
  
  // Actions column
  actions?: ActionSchema[]        // Row-level actions
  
  // Access
  access?: FieldAccessControl
}

// ============================================
// DOCUMENT SCHEMA
// ============================================

export interface DocumentSchema {
  // Identity
  name: string                    // Document type identifier
  label: string                   // Display name
  labelPlural: string             // Plural display name
  icon?: string
  description?: string
  
  // Module assignment
  module: string                  // Module this doc belongs to
  
  // API Configuration
  api: ApiConfig
  
  // List View
  listView: ListViewConfig
  
  // Form View
  formView: FormViewConfig
  
  // Access Control
  access: DocumentAccessControl
  
  // Workflow (optional)
  workflow?: WorkflowConfig
  
  // Versioning
  version: string
  updatedAt: string
}

export interface ApiConfig {
  baseEndpoint: string            // e.g., "/api/v1/invoices"
  
  // Override default endpoints if needed
  endpoints?: {
    list?: string
    get?: string
    create?: string
    update?: string
    delete?: string
    [key: string]: string | undefined
  }
  
  // Default query params
  defaultParams?: Record<string, unknown>
  
  // ID field name
  idField?: string                // Default: 'id'
  
  // Pagination
  pagination?: {
    pageParam?: string            // Default: 'page'
    limitParam?: string           // Default: 'limit'
    defaultLimit?: number         // Default: 20
  }
}

export interface ListViewConfig {
  // Columns
  columns: ColumnSchema[]
  
  // Default sorting
  defaultSort?: {
    field: string
    order: 'asc' | 'desc'
  }
  
  // Global search
  searchable?: boolean
  searchFields?: string[]         // Fields to search in
  
  // Filters
  filters?: FilterConfig[]
  
  // Bulk actions
  selectable?: boolean            // Enable row selection
  bulkActions?: ActionSchema[]
  
  // Toolbar actions
  toolbarActions?: ActionSchema[]
  
  // Row actions
  rowActions?: ActionSchema[]
  
  // Features
  exportable?: boolean
  printable?: boolean
}

export interface FilterConfig {
  field: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean' | 'text'
  options?: FieldOption[]
  optionsSource?: OptionsSource
  defaultValue?: unknown
}

export interface FormViewConfig {
  // Sections
  sections: FormSection[]
  
  // Fields (flat list, sections group them)
  fields: FieldSchema[]
  
  // Form layout
  layout?: 'vertical' | 'horizontal' | 'grid'
  
  // Actions
  actions?: ActionSchema[]
  
  // Validation
  validateOnBlur?: boolean
  validateOnChange?: boolean
}

export interface FormSection {
  name: string
  label: string
  description?: string
  collapsible?: boolean
  collapsed?: boolean
  columns?: 1 | 2 | 3 | 4         // Grid columns for this section
  access?: FieldAccessControl     // Section-level access
}

export interface DocumentAccessControl {
  // Required plan to access this document type
  requiredPlan?: string[]
  
  // Required module
  requiredModule?: string
  
  // Default permissions
  permissions: {
    create?: PermissionConfig
    read?: PermissionConfig
    update?: PermissionConfig
    delete?: PermissionConfig
    export?: PermissionConfig
    import?: PermissionConfig
    [key: string]: PermissionConfig | undefined
  }
}

export interface PermissionConfig {
  roles?: string[]                // Allowed roles
  owner?: boolean                 // Owner always has access
  conditions?: AccessCondition[]  // ABAC conditions
}

export interface AccessCondition {
  attribute: string               // user.department, resource.status
  operator: 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'lt' | 'contains'
  value: unknown
}

export interface WorkflowConfig {
  statusField: string             // Field that holds status
  states: WorkflowState[]
  transitions: WorkflowTransition[]
}

export interface WorkflowState {
  name: string
  label: string
  color: string
}

export interface WorkflowTransition {
  from: string[]
  to: string
  label: string
  roles?: string[]
  action?: ActionSchema
}

// ============================================
// DASHBOARD SCHEMA
// ============================================

export interface DashboardSchema {
  name: string
  label: string
  
  // Layout
  layout: DashboardLayout
  
  // Widgets
  widgets: WidgetSchema[]
  
  // Access
  access?: {
    requiredPlan?: string[]
    requiredModule?: string
    roles?: string[]
  }
}

export interface DashboardLayout {
  type: 'grid' | 'flex'
  columns?: number                // For grid
  gap?: string
}

export interface WidgetSchema {
  id: string
  type: 'stat' | 'chart' | 'table' | 'list' | 'calendar' | 'custom'
  title: string
  
  // Position
  position: {
    row: number
    col: number
    width: number                 // Columns to span
    height: number                // Rows to span
  }
  
  // Data source
  dataSource: WidgetDataSource
  
  // Type-specific config
  config: StatWidgetConfig | ChartWidgetConfig | TableWidgetConfig | CustomWidgetConfig
  
  // Access
  access?: FieldAccessControl
}

export interface WidgetDataSource {
  type: 'api' | 'store' | 'static'
  endpoint?: string
  params?: Record<string, unknown>
  refreshInterval?: number        // Auto-refresh in seconds
}

export interface StatWidgetConfig {
  valueField: string
  format?: 'number' | 'currency' | 'percent'
  icon?: string
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
  trend?: {
    field: string
    compareLabel?: string
  }
}

export interface ChartWidgetConfig {
  chartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  xField: string
  yField: string | string[]       // Multiple for stacked/grouped
  colors?: string[]
}

export interface TableWidgetConfig {
  columns: ColumnSchema[]
  limit?: number
  linkTo?: string                 // Link to full list
}

export interface CustomWidgetConfig {
  component: string
  props?: Record<string, unknown>
}
```

### Access Control Types

```typescript
// src/types/access.ts

// ============================================
// SUBSCRIPTION & TENANT
// ============================================

export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise'

export interface Subscription {
  id: string
  tenantId: string
  plan: PlanTier
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired'
  
  // What's included
  modules: string[]               // Enabled module IDs
  features: string[]              // Enabled feature flags
  
  // Limits
  limits: {
    users: number
    records: number | null        // null = unlimited
    storage: number               // In MB
    apiCalls: number | null       // Per month
    [key: string]: number | null | undefined
  }
  
  // Usage
  usage: {
    users: number
    records: number
    storage: number
    apiCalls: number
    [key: string]: number | undefined
  }
  
  // Dates
  startDate: string
  endDate: string | null
  trialEndsAt?: string
}

export interface Module {
  id: string
  name: string
  icon: string
  description: string
  requiredPlan: PlanTier[]
  documents: string[]             // Document types in this module
  features: string[]              // Features within module
  order: number
}

// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
  id: string
  tenantId: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  
  // Roles & Permissions
  roles: string[]
  permissions: string[]
  
  // Attributes for ABAC
  department?: string
  team?: string
  location?: string
  jobTitle?: string
  manager?: string
  clearanceLevel?: number
  
  // Custom attributes
  attributes?: Record<string, unknown>
  
  // Status
  status: 'active' | 'inactive' | 'pending'
  emailVerified: boolean
  lastLoginAt?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  displayName: string
  description?: string
  
  // Permissions bundled in this role
  permissions: string[]
  
  // Module access
  modules: {
    [moduleId: string]: ModuleAccess
  }
  
  // Is this a system role?
  isSystem: boolean
  
  // Hierarchy
  parentRole?: string             // For role inheritance
}

export interface ModuleAccess {
  enabled: boolean
  
  documents: {
    [docType: string]: DocumentAccess
  }
}

export interface DocumentAccess {
  create: boolean
  read: DataScope
  update: DataScope
  delete: DataScope
  export: boolean
  import: boolean
  
  // Field-level
  hiddenFields?: string[]
  readonlyFields?: string[]
}

export type DataScope = 
  | 'none'        // No access
  | 'own'         // Only own records
  | 'team'        // Own team's records
  | 'department'  // Own department's records
  | 'all'         // All records

// ============================================
// ACCESS EVALUATION
// ============================================

export interface AccessContext {
  user: User
  subscription: Subscription
  resource?: {
    type: string
    id?: string
    ownerId?: string
    department?: string
    status?: string
    [key: string]: unknown
  }
  action?: string
  field?: string
}

export interface AccessResult {
  allowed: boolean
  reason?: AccessDenialReason
  scope?: DataScope               // For read/update actions
  hiddenFields?: string[]
  readonlyFields?: string[]
}

export type AccessDenialReason =
  | 'subscription_expired'
  | 'module_not_enabled'
  | 'plan_upgrade_required'
  | 'limit_exceeded'
  | 'role_not_allowed'
  | 'permission_denied'
  | 'abac_condition_failed'
  | 'field_access_denied'

// ============================================
// ABAC POLICY
// ============================================

export interface ABACPolicy {
  id: string
  name: string
  description?: string
  priority: number                // Lower = higher priority
  effect: 'permit' | 'deny'
  
  // Target
  target: {
    actions?: string[]
    resources?: string[]
    subjects?: PolicyCondition[]
  }
  
  // Conditions
  conditions: PolicyCondition[]
}

export interface PolicyCondition {
  attribute: string               // Dot notation: user.department, resource.status
  operator: ConditionOperator
  value: unknown
  valueRef?: string               // Reference to another attribute
}

export type ConditionOperator =
  | 'eq' | 'neq'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'nin'
  | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with'
  | 'matches'                     // Regex
  | 'between'
  | 'is_null' | 'is_not_null'
```


## Access Control System

### Access Service

```typescript
// src/services/accessService.ts
import type {
  AccessContext,
  AccessResult,
  User,
  Subscription,
  Role,
  ABACPolicy,
  PolicyCondition,
  DataScope,
  AccessDenialReason,
} from '@/types/access'
import type { FieldSchema, ActionSchema, FieldAccessControl } from '@/types/schema'

class AccessService {
  private policies: ABACPolicy[] = []
  private roles: Map<string, Role> = new Map()
  
  // Cache for performance
  private cache = new Map<string, { result: AccessResult; timestamp: number }>()
  private cacheTimeout = 60 * 1000 // 1 minute

  // ============================================
  // INITIALIZATION
  // ============================================

  loadPolicies(policies: ABACPolicy[]) {
    this.policies = policies.sort((a, b) => a.priority - b.priority)
    this.clearCache()
  }

  loadRoles(roles: Role[]) {
    this.roles.clear()
    for (const role of roles) {
      this.roles.set(role.name, role)
    }
    this.clearCache()
  }

  // ============================================
  // MAIN ACCESS CHECK
  // ============================================

  /**
   * Main entry point for access checks
   * Evaluates all three layers: Subscription → Role → ABAC
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
        // Layer 3: ABAC check
        const abacResult = this.evaluateABAC(context)
        if (!abacResult.allowed) {
          result = abacResult
        } else {
          // Merge results
          result = {
            allowed: true,
            scope: roleResult.scope,
            hiddenFields: [...(roleResult.hiddenFields || []), ...(abacResult.hiddenFields || [])],
            readonlyFields: [...(roleResult.readonlyFields || []), ...(abacResult.readonlyFields || [])],
          }
        }
      }
    }

    this.cache.set(cacheKey, { result, timestamp: Date.now() })
    return result
  }

  // ============================================
  // LAYER 1: SUBSCRIPTION CHECK
  // ============================================

  private checkSubscription(context: AccessContext): AccessResult {
    const { subscription } = context

    // Check subscription status
    if (subscription.status === 'expired' || subscription.status === 'canceled') {
      return { allowed: false, reason: 'subscription_expired' }
    }

    // Check if resource requires a module
    if (context.resource?.type) {
      const modulesWithDoc = this.getModulesForDocType(context.resource.type)
      const hasModule = modulesWithDoc.some(m => subscription.modules.includes(m))
      
      if (modulesWithDoc.length > 0 && !hasModule) {
        return { allowed: false, reason: 'module_not_enabled' }
      }
    }

    return { allowed: true }
  }

  // ============================================
  // LAYER 2: ROLE CHECK
  // ============================================

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

      // Check document access in any module
      for (const moduleAccess of Object.values(role.modules)) {
        if (!moduleAccess.enabled) continue

        const docAccess = moduleAccess.documents[resource.type]
        if (!docAccess) continue

        // Map action to access property
        const actionScope = this.getActionScope(docAccess, action)
        if (actionScope && this.isBetterScope(actionScope, bestScope)) {
          bestScope = actionScope
        }

        // Collect field restrictions
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

    // Check data scope
    if (!this.isWithinScope(bestScope, context)) {
      return { allowed: false, reason: 'permission_denied' }
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
      case 'export':
        return docAccess.export ? 'all' : 'none'
      case 'import':
        return docAccess.import ? 'all' : 'none'
      default:
        return null
    }
  }

  private isBetterScope(newScope: DataScope, currentScope: DataScope): boolean {
    const order: DataScope[] = ['none', 'own', 'team', 'department', 'all']
    return order.indexOf(newScope) > order.indexOf(currentScope)
  }

  private isWithinScope(scope: DataScope, context: AccessContext): boolean {
    if (scope === 'all' || scope === 'none') {
      return scope === 'all'
    }

    const { user, resource } = context
    if (!resource) return true

    switch (scope) {
      case 'own':
        return resource.ownerId === user.id
      case 'team':
        return resource.ownerId === user.id || 
               (resource.team && resource.team === user.team)
      case 'department':
        return resource.ownerId === user.id ||
               (resource.department && resource.department === user.department)
      default:
        return false
    }
  }

  // ============================================
  // LAYER 3: ABAC EVALUATION
  // ============================================

  private evaluateABAC(context: AccessContext): AccessResult {
    for (const policy of this.policies) {
      // Check if policy applies to this request
      if (!this.policyApplies(policy, context)) {
        continue
      }

      // Evaluate conditions
      const conditionsMet = policy.conditions.every(
        condition => this.evaluateCondition(condition, context)
      )

      if (conditionsMet) {
        if (policy.effect === 'deny') {
          return { allowed: false, reason: 'abac_condition_failed' }
        }
        // Permit - continue to check other policies
      }
    }

    return { allowed: true }
  }

  private policyApplies(policy: ABACPolicy, context: AccessContext): boolean {
    const { target } = policy

    // Check actions
    if (target.actions && context.action) {
      if (!target.actions.includes(context.action) && !target.actions.includes('*')) {
        return false
      }
    }

    // Check resources
    if (target.resources && context.resource?.type) {
      if (!target.resources.includes(context.resource.type) && !target.resources.includes('*')) {
        return false
      }
    }

    // Check subject conditions
    if (target.subjects) {
      const subjectMatch = target.subjects.every(
        condition => this.evaluateCondition(condition, context)
      )
      if (!subjectMatch) return false
    }

    return true
  }

  private evaluateCondition(condition: PolicyCondition, context: AccessContext): boolean {
    const value = this.getAttributeValue(condition.attribute, context)
    const compareValue = condition.valueRef
      ? this.getAttributeValue(condition.valueRef, context)
      : condition.value

    switch (condition.operator) {
      case 'eq':
        return value === compareValue
      case 'neq':
        return value !== compareValue
      case 'gt':
        return Number(value) > Number(compareValue)
      case 'gte':
        return Number(value) >= Number(compareValue)
      case 'lt':
        return Number(value) < Number(compareValue)
      case 'lte':
        return Number(value) <= Number(compareValue)
      case 'in':
        return Array.isArray(compareValue) && compareValue.includes(value)
      case 'nin':
        return Array.isArray(compareValue) && !compareValue.includes(value)
      case 'contains':
        if (Array.isArray(value)) return value.includes(compareValue)
        if (typeof value === 'string') return value.includes(String(compareValue))
        return false
      case 'not_contains':
        if (Array.isArray(value)) return !value.includes(compareValue)
        if (typeof value === 'string') return !value.includes(String(compareValue))
        return true
      case 'starts_with':
        return typeof value === 'string' && value.startsWith(String(compareValue))
      case 'ends_with':
        return typeof value === 'string' && value.endsWith(String(compareValue))
      case 'matches':
        try {
          return new RegExp(String(compareValue)).test(String(value))
        } catch {
          return false
        }
      case 'between':
        if (Array.isArray(compareValue) && compareValue.length === 2) {
          const num = Number(value)
          return num >= compareValue[0] && num <= compareValue[1]
        }
        return false
      case 'is_null':
        return value === null || value === undefined
      case 'is_not_null':
        return value !== null && value !== undefined
      default:
        return false
    }
  }

  private getAttributeValue(path: string, context: AccessContext): unknown {
    const parts = path.split('.')
    let current: any = context

    // Map common prefixes
    if (parts[0] === 'user') {
      current = context.user
      parts.shift()
    } else if (parts[0] === 'resource') {
      current = context.resource
      parts.shift()
    } else if (parts[0] === 'subscription') {
      current = context.subscription
      parts.shift()
    }

    for (const part of parts) {
      if (current === null || current === undefined) return undefined
      current = current[part]
    }

    return current
  }

  // ============================================
  // FIELD-LEVEL ACCESS
  // ============================================

  /**
   * Check if a specific field is accessible
   */
  checkFieldAccess(
    field: FieldSchema,
    context: AccessContext,
    mode: 'read' | 'write' = 'read'
  ): { visible: boolean; editable: boolean; reason?: AccessDenialReason } {
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

    // Check ABAC conditions
    if (access.conditions && access.conditions.length > 0) {
      const conditionsMet = access.conditions.every(
        condition => this.evaluateCondition(condition as PolicyCondition, context)
      )
      if (!conditionsMet) {
        return { visible: false, editable: false, reason: 'abac_condition_failed' }
      }
    }

    return { visible: true, editable }
  }

  /**
   * Check if an action is available
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

  // ============================================
  // UTILITIES
  // ============================================

  private getModulesForDocType(docType: string): string[] {
    // This would typically come from your module registry
    // For now, return empty array
    return []
  }

  private getCacheKey(context: AccessContext): string {
    return JSON.stringify({
      userId: context.user.id,
      resourceType: context.resource?.type,
      resourceId: context.resource?.id,
      action: context.action,
      field: context.field,
    })
  }

  clearCache() {
    this.cache.clear()
  }
}

export const accessService = new AccessService()
```

### Access Store

```typescript
// src/stores/accessStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { accessService } from '@/services/accessService'
import { useAuthStore } from './authStore'
import { useTenantStore } from './tenantStore'
import type { AccessContext, AccessResult, ABACPolicy, Role } from '@/types/access'
import type { FieldSchema, ActionSchema } from '@/types/schema'
import api from '@/services/api'

export const useAccessStore = defineStore('access', () => {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  // State
  const policies = ref<ABACPolicy[]>([])
  const roles = ref<Role[]>([])
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // ============================================
  // COMPUTED CONTEXT
  // ============================================

  const currentContext = computed<Omit<AccessContext, 'resource' | 'action' | 'field'>>(() => ({
    user: authStore.user!,
    subscription: tenantStore.subscription!,
  }))

  // ============================================
  // INITIALIZATION
  // ============================================

  const initialize = async () => {
    if (isInitialized.value) return

    isLoading.value = true
    try {
      // Load policies and roles from API
      const [policiesRes, rolesRes] = await Promise.all([
        api.get<{ policies: ABACPolicy[] }>('/api/v1/access/policies'),
        api.get<{ roles: Role[] }>('/api/v1/access/roles'),
      ])

      policies.value = policiesRes.data.policies
      roles.value = rolesRes.data.roles

      accessService.loadPolicies(policies.value)
      accessService.loadRoles(roles.value)

      isInitialized.value = true
    } catch (error) {
      console.error('Failed to initialize access store:', error)
    } finally {
      isLoading.value = false
    }
  }

  // ============================================
  // ACCESS CHECKS
  // ============================================

  /**
   * Check if user can perform action on resource
   */
  const can = (
    action: string,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    if (!authStore.user || !tenantStore.subscription) {
      return false
    }

    const context: AccessContext = {
      ...currentContext.value,
      action,
      resource: {
        type: resourceType,
        ...resourceAttributes,
      },
    }

    return accessService.checkAccess(context).allowed
  }

  /**
   * Check if user can perform any of the given actions
   */
  const canAny = (
    actions: string[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return actions.some(action => can(action, resourceType, resourceAttributes))
  }

  /**
   * Check if user can perform all of the given actions
   */
  const canAll = (
    actions: string[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return actions.every(action => can(action, resourceType, resourceAttributes))
  }

  /**
   * Get full access result with scope and field restrictions
   */
  const getAccess = (
    action: string,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): AccessResult => {
    if (!authStore.user || !tenantStore.subscription) {
      return { allowed: false, reason: 'permission_denied' }
    }

    const context: AccessContext = {
      ...currentContext.value,
      action,
      resource: {
        type: resourceType,
        ...resourceAttributes,
      },
    }

    return accessService.checkAccess(context)
  }

  /**
   * Check field access
   */
  const canAccessField = (
    field: FieldSchema,
    resourceType: string,
    mode: 'read' | 'write' = 'read',
    resourceAttributes?: Record<string, unknown>
  ) => {
    if (!authStore.user || !tenantStore.subscription) {
      return { visible: false, editable: false }
    }

    const context: AccessContext = {
      ...currentContext.value,
      action: mode === 'read' ? 'read' : 'update',
      resource: {
        type: resourceType,
        ...resourceAttributes,
      },
      field: field.name,
    }

    return accessService.checkFieldAccess(field, context, mode)
  }

  /**
   * Check action access
   */
  const canPerformAction = (
    action: ActionSchema,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    if (!authStore.user || !tenantStore.subscription) {
      return false
    }

    const context: AccessContext = {
      ...currentContext.value,
      action: action.action,
      resource: {
        type: resourceType,
        ...resourceAttributes,
      },
    }

    return accessService.checkActionAccess(action, context)
  }

  /**
   * Filter fields based on access
   */
  const filterFields = (
    fields: FieldSchema[],
    resourceType: string,
    mode: 'read' | 'write' = 'read',
    resourceAttributes?: Record<string, unknown>
  ): FieldSchema[] => {
    return fields.filter(field => {
      const access = canAccessField(field, resourceType, mode, resourceAttributes)
      return access.visible
    })
  }

  /**
   * Filter actions based on access
   */
  const filterActions = (
    actions: ActionSchema[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): ActionSchema[] => {
    return actions.filter(action => canPerformAction(action, resourceType, resourceAttributes))
  }

  /**
   * Check if a module is accessible
   */
  const hasModuleAccess = (moduleId: string): boolean => {
    if (!tenantStore.subscription) return false
    return tenantStore.subscription.modules.includes(moduleId)
  }

  /**
   * Check if a feature is enabled
   */
  const hasFeature = (featureId: string): boolean => {
    if (!tenantStore.subscription) return false
    return tenantStore.subscription.features.includes(featureId)
  }

  /**
   * Get current user's role
   */
  const getUserRoles = (): Role[] => {
    if (!authStore.user) return []
    return roles.value.filter(role => authStore.user!.roles.includes(role.name))
  }

  return {
    // State
    policies,
    roles,
    isLoading,
    isInitialized,

    // Actions
    initialize,

    // Access checks
    can,
    canAny,
    canAll,
    getAccess,
    canAccessField,
    canPerformAction,
    filterFields,
    filterActions,
    hasModuleAccess,
    hasFeature,
    getUserRoles,
  }
})
```

---

## Schema Engine

### Schema Service

```typescript
// src/services/schemaService.ts
import type { DocumentSchema, DashboardSchema, FieldSchema, ColumnSchema } from '@/types/schema'
import api from './api'

class SchemaService {
  private documentCache = new Map<string, DocumentSchema>()
  private dashboardCache = new Map<string, DashboardSchema>()
  private cacheTimeout = 10 * 60 * 1000 // 10 minutes

  // ============================================
  // DOCUMENT SCHEMAS
  // ============================================

  async getDocumentSchema(docType: string): Promise<DocumentSchema> {
    // Check cache
    const cached = this.documentCache.get(docType)
    if (cached) {
      return cached
    }

    try {
      // Try to load from API first
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

  async getAllDocumentSchemas(): Promise<DocumentSchema[]> {
    const response = await api.get<{ schemas: DocumentSchema[] }>('/api/v1/schemas/documents')
    return response.data.schemas
  }

  // ============================================
  // DASHBOARD SCHEMAS
  // ============================================

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

  // ============================================
  // SCHEMA UTILITIES
  // ============================================

  /**
   * Get fields grouped by section
   */
  getFieldsBySection(schema: DocumentSchema): Map<string, FieldSchema[]> {
    const sections = new Map<string, FieldSchema[]>()
    
    // Initialize sections
    for (const section of schema.formView.sections) {
      sections.set(section.name, [])
    }
    sections.set('default', []) // For fields without section

    // Group fields
    for (const field of schema.formView.fields) {
      const sectionName = field.section || 'default'
      const sectionFields = sections.get(sectionName) || []
      sectionFields.push(field)
      sections.set(sectionName, sectionFields)
    }

    // Sort fields by order
    for (const [key, fields] of sections) {
      sections.set(
        key,
        fields.sort((a, b) => (a.order || 0) - (b.order || 0))
      )
    }

    return sections
  }

  /**
   * Build list columns from schema
   */
  getListColumns(schema: DocumentSchema): ColumnSchema[] {
    return schema.listView.columns
  }

  /**
   * Get default values for form
   */
  getDefaultValues(fields: FieldSchema[]): Record<string, unknown> {
    const defaults: Record<string, unknown> = {}
    
    for (const field of fields) {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue
      } else {
        // Set type-appropriate defaults
        switch (field.type) {
          case 'text':
          case 'textarea':
          case 'email':
          case 'phone':
          case 'url':
          case 'password':
            defaults[field.name] = ''
            break
          case 'number':
          case 'currency':
          case 'percent':
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
          case 'tags':
          case 'table':
            defaults[field.name] = []
            break
          case 'date':
          case 'datetime':
          case 'time':
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
   * Validate field value
   */
  validateField(field: FieldSchema, value: unknown): string | null {
    // Required check
    if (field.required) {
      if (value === null || value === undefined || value === '') {
        return `${field.label} is required`
      }
      if (Array.isArray(value) && value.length === 0) {
        return `${field.label} is required`
      }
    }

    if (value === null || value === undefined || value === '') {
      return null // Skip other validations if empty and not required
    }

    // String validations
    if (typeof value === 'string') {
      if (field.minLength && value.length < field.minLength) {
        return `${field.label} must be at least ${field.minLength} characters`
      }
      if (field.maxLength && value.length > field.maxLength) {
        return `${field.label} must be at most ${field.maxLength} characters`
      }
      if (field.pattern) {
        const regex = new RegExp(field.pattern)
        if (!regex.test(value)) {
          return `${field.label} format is invalid`
        }
      }

      // Email validation
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return `${field.label} must be a valid email`
        }
      }

      // URL validation
      if (field.type === 'url') {
        try {
          new URL(value)
        } catch {
          return `${field.label} must be a valid URL`
        }
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (field.min !== undefined && value < field.min) {
        return `${field.label} must be at least ${field.min}`
      }
      if (field.max !== undefined && value > field.max) {
        return `${field.label} must be at most ${field.max}`
      }
    }

    // Array validations
    if (Array.isArray(value)) {
      if (field.minRows && value.length < field.minRows) {
        return `${field.label} must have at least ${field.minRows} items`
      }
      if (field.maxRows && value.length > field.maxRows) {
        return `${field.label} must have at most ${field.maxRows} items`
      }
    }

    return null
  }

  /**
   * Validate entire form
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

  // ============================================
  // CACHE MANAGEMENT
  // ============================================

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

### useAccess Composable

```typescript
// src/composables/useAccess.ts
import { computed } from 'vue'
import { useAccessStore } from '@/stores/accessStore'
import type { FieldSchema, ActionSchema } from '@/types/schema'
import type { AccessResult } from '@/types/access'

export function useAccess() {
  const accessStore = useAccessStore()

  /**
   * Check if user can perform action on resource
   */
  const can = (
    action: string,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return accessStore.can(action, resourceType, resourceAttributes)
  }

  /**
   * Check multiple actions
   */
  const canAny = (
    actions: string[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return accessStore.canAny(actions, resourceType, resourceAttributes)
  }

  const canAll = (
    actions: string[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return accessStore.canAll(actions, resourceType, resourceAttributes)
  }

  /**
   * Get full access result
   */
  const getAccess = (
    action: string,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): AccessResult => {
    return accessStore.getAccess(action, resourceType, resourceAttributes)
  }

  /**
   * Check field visibility/editability
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
   * Check if action is available
   */
  const actionAvailable = (
    action: ActionSchema,
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): boolean => {
    return accessStore.canPerformAction(action, resourceType, resourceAttributes)
  }

  /**
   * Filter fields based on access
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
   * Filter actions based on access
   */
  const filterActions = (
    actions: ActionSchema[],
    resourceType: string,
    resourceAttributes?: Record<string, unknown>
  ): ActionSchema[] => {
    return accessStore.filterActions(actions, resourceType, resourceAttributes)
  }

  /**
   * Check module access
   */
  const hasModule = (moduleId: string): boolean => {
    return accessStore.hasModuleAccess(moduleId)
  }

  /**
   * Check feature flag
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
import { ref, computed, watch } from 'vue'
import { schemaService } from '@/services/schemaService'
import { useAccess } from './useAccess'
import type { DocumentSchema, FieldSchema, ColumnSchema, ActionSchema, FormSection } from '@/types/schema'

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
  const { can, getAccess } = useAccess()
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

  // ============================================
  // LIST QUERY
  // ============================================

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

    // Add default params
    if (apiConfig.defaultParams) {
      for (const [key, value] of Object.entries(apiConfig.defaultParams)) {
        if (!params.has(key)) {
          params.set(key, String(value))
        }
      }
    }

    return `${baseUrl}?${params.toString()}`
  }

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

  // ============================================
  // GET QUERY
  // ============================================

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

  // ============================================
  // CREATE MUTATION
  // ============================================

  const createMutation = useMutation({
    mutationFn: async (data: Partial<T>): Promise<T> => {
      const url = apiConfig.endpoints?.create || apiConfig.baseEndpoint
      const response = await api.post<T>(url, data)
      return response.data
    },
    onSuccess: (data) => {
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

  // ============================================
  // UPDATE MUTATION
  // ============================================

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }): Promise<T> => {
      const url = apiConfig.endpoints?.update?.replace(':id', id) ||
        `${apiConfig.baseEndpoint}/${id}`
      const response = await api.put<T>(url, data)
      return response.data
    },
    onSuccess: (data, variables) => {
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

  // ============================================
  // DELETE MUTATION
  // ============================================

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

  // ============================================
  // BULK OPERATIONS
  // ============================================

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

  // ============================================
  // LIST MANAGEMENT
  // ============================================

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
import { ref, computed, readonly } from 'vue'

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


## Component Philosophy

### When to Create Custom Components

**DON'T create custom atoms** - Use PrimeVue directly:
```vue
<!-- Just use PrimeVue -->
<Button label="Save" icon="pi pi-check" />
<InputText v-model="value" />
<Select v-model="selected" :options="options" />
```

**DO create molecules** when you need:
- Combined elements with specific behavior
- Consistent patterns across the app
- Business logic encapsulation

**DO create organisms** when you need:
- Complex, reusable sections
- Schema-driven rendering
- Self-contained functionality

### PrimeVue 4 Component Patterns

```vue
<script setup lang="ts">
// 1. Always use TypeScript
// 2. Define props with defaults
// 3. Use PrimeVue 4's prop-based styling

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

interface Props {
  label: string
  modelValue: string
  invalid?: boolean
  required?: boolean
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  invalid: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <!-- PrimeVue 4 uses props, not classes -->
  <Button 
    label="Save" 
    severity="primary"
    rounded
    raised
  />
  
  <!-- Not the old way: class="p-button-rounded p-button-raised" -->
</template>
```

---

## Molecules

### FormField Component

A wrapper that adds label, validation, and help text to any input.

```vue
<!-- src/components/molecules/FormField.vue -->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Message from 'primevue/message'

interface Props {
  label: string
  name: string
  required?: boolean
  error?: string
  helpText?: string
  description?: string
  horizontal?: boolean
  labelWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  horizontal: false,
  labelWidth: '120px',
})

const slots = useSlots()

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
      <span v-if="required" class="form-field__required">*</span>
    </label>
    
    <div class="form-field__content">
      <slot />
      
      <small v-if="description && !error" class="form-field__description">
        {{ description }}
      </small>
      
      <small v-if="error" class="form-field__error">
        {{ error }}
      </small>
      
      <small v-if="helpText" class="form-field__help">
        {{ helpText }}
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
}

.form-field--horizontal .form-field__label {
  padding-top: 0.625rem;
  flex-shrink: 0;
}

.form-field__required {
  color: var(--p-red-500);
  margin-left: 0.25rem;
}

.form-field__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-field__content :deep(input),
.form-field__content :deep(.p-inputtext),
.form-field__content :deep(.p-select),
.form-field__content :deep(.p-textarea) {
  width: 100%;
}

.form-field--error :deep(.p-inputtext),
.form-field--error :deep(.p-select),
.form-field--error :deep(.p-textarea) {
  border-color: var(--p-red-500);
}

.form-field__description {
  color: var(--p-text-muted-color);
}

.form-field__error {
  color: var(--p-red-500);
}

.form-field__help {
  color: var(--p-text-muted-color);
  font-style: italic;
}
</style>
```

### StatCard Component

```vue
<!-- src/components/molecules/StatCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  icon?: string
  trend?: number
  trendLabel?: string
  format?: 'number' | 'currency' | 'percent'
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
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

const colorClasses = {
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
      
      <div v-if="loading" class="stat-card__skeleton" />
      <div v-else class="stat-card__value">{{ formattedValue }}</div>
      
      <div v-if="trend !== undefined" class="stat-card__trend">
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
  width: 120px;
  height: 2rem;
  background: var(--p-surface-200);
  border-radius: 0.25rem;
  animation: pulse 1.5s infinite;
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
```

### ActionMenu Component

```vue
<!-- src/components/molecules/ActionMenu.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import SplitButton from 'primevue/splitbutton'
import type { ActionSchema } from '@/types/schema'

interface Props {
  actions: ActionSchema[]
  data?: Record<string, unknown>
  type?: 'button' | 'menu' | 'split'
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

const menuItems = computed(() => {
  return props.actions.map(action => ({
    label: action.label,
    icon: action.icon,
    command: () => emit('action', action, props.data),
    disabled: isDisabled(action),
    class: action.variant === 'danger' ? 'text-red-600' : undefined,
  }))
})

const splitItems = computed(() => {
  if (props.actions.length <= 1) return []
  return props.actions.slice(1).map(action => ({
    label: action.label,
    icon: action.icon,
    command: () => emit('action', action, props.data),
    disabled: isDisabled(action),
  }))
})

const primaryAction = computed(() => props.actions[0])

const isDisabled = (action: ActionSchema): boolean => {
  if (!action.disableWhen || !props.data) return false
  
  return action.disableWhen.some(condition => {
    const value = props.data![condition.field]
    switch (condition.operator) {
      case 'eq': return value === condition.value
      case 'neq': return value !== condition.value
      case 'empty': return !value
      case 'not_empty': return !!value
      default: return false
    }
  })
}

const toggle = (event: Event) => {
  menu.value?.toggle(event)
}
</script>

<template>
  <!-- Single Button -->
  <template v-if="type === 'button' && actions.length === 1">
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
        v-for="action in actions"
        :key="action.name"
        :icon="action.icon"
        :severity="(action.variant as any) || 'secondary'"
        :size="size"
        text
        rounded
        v-tooltip.top="action.label"
        @click="emit('action', action, data)"
      />
    </div>
  </template>
  
  <!-- Menu -->
  <template v-else-if="type === 'menu'">
    <Button
      icon="pi pi-ellipsis-v"
      severity="secondary"
      :size="size"
      text
      rounded
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
import Button from 'primevue/button'

interface Props {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
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

The main reusable list component. Schema-driven, with built-in CRUD operations.

```vue
<!-- src/components/organisms/DataTableCrud.vue -->
<script setup lang="ts">
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
import FieldRenderer from '@/components/renderers/FieldRenderer.vue'
import type { ColumnSchema, ActionSchema, FilterConfig } from '@/types/schema'
import { useAccess } from '@/composables/useAccess'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  // Data
  items: Record<string, unknown>[]
  loading?: boolean
  
  // Schema
  columns: ColumnSchema[]
  docType: string
  
  // Pagination
  totalRecords?: number
  page?: number
  rows?: number
  rowsPerPageOptions?: number[]
  
  // Features
  searchable?: boolean
  searchPlaceholder?: string
  
  // Selection
  selectable?: boolean
  
  // Actions
  toolbarActions?: ActionSchema[]
  rowActions?: ActionSchema[]
  bulkActions?: ActionSchema[]
  
  // Filters
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
const sortField = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// Computed
const visibleColumns = computed(() => {
  return props.columns.filter(col => {
    if (!col.access) return true
    // Check column access based on subscription/role
    return true // Simplified - use accessStore in real implementation
  })
})

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
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder === 1 ? 'asc' : 'desc'
  emit('sort-change', event.sortField, sortOrder.value)
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

const getColumnValue = (data: Record<string, unknown>, field: string) => {
  // Support nested fields with dot notation
  return field.split('.').reduce((obj: any, key) => obj?.[key], data)
}

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
    case 'percent':
      return `${value}%`
    case 'number':
      return new Intl.NumberFormat('en-US').format(Number(value))
    default:
      return String(value)
  }
}

const getTagSeverity = (value: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' => {
  const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
    active: 'success',
    completed: 'success',
    approved: 'success',
    inactive: 'secondary',
    pending: 'warn',
    draft: 'warn',
    cancelled: 'danger',
    rejected: 'danger',
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
            :optionLabel="'label'"
            :optionValue="'value'"
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
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      @page="onPage"
      @sort="onSort"
      @row-click="onRowClick"
      @update:selection="onSelectionChange"
    >
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
        v-for="column in visibleColumns"
        :key="column.field"
        :field="column.field"
        :header="column.header"
        :sortable="column.sortable"
        :style="{ width: column.width }"
        :frozen="column.frozen"
      >
        <template #body="{ data }">
          <!-- Custom template -->
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
            @action="handleAction($event, data)"
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

.datatable-crud__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--p-surface-200);
  background: var(--p-surface-50);
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
</style>
```

### FormBuilder Component

Schema-driven form generator.

```vue
<!-- src/components/organisms/FormBuilder.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Button from 'primevue/button'
import FormField from '@/components/molecules/FormField.vue'
import FieldRenderer from '@/components/renderers/FieldRenderer.vue'
import type { FieldSchema, FormSection } from '@/types/schema'
import { useAccess } from '@/composables/useAccess'
import { schemaService } from '@/services/schemaService'

interface Props {
  fields: FieldSchema[]
  sections?: FormSection[]
  docType: string
  modelValue: Record<string, unknown>
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
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
  return filterFields(props.fields, props.docType, isReadonly.value ? 'read' : 'write', props.resourceAttributes)
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
    const sectionName = field.section || 'default'
    const sectionFields = map.get(sectionName) || []
    sectionFields.push(field)
    map.set(sectionName, sectionFields)
  }
  
  // Sort by order
  for (const [key, fields] of map) {
    map.set(key, fields.sort((a, b) => (a.order || 0) - (b.order || 0)))
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
  
  // Evaluate dependencies
  evaluateDependencies(fieldName)
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

const evaluateDependencies = (changedField: string) => {
  for (const field of props.fields) {
    if (!field.depends_on) continue
    
    for (const dep of field.depends_on) {
      if (dep.field !== changedField) continue
      
      const value = formData.value[dep.field]
      let conditionMet = false
      
      switch (dep.operator) {
        case 'eq':
          conditionMet = value === dep.value
          break
        case 'neq':
          conditionMet = value !== dep.value
          break
        case 'in':
          conditionMet = Array.isArray(dep.value) && dep.value.includes(value)
          break
        case 'empty':
          conditionMet = !value
          break
        case 'not_empty':
          conditionMet = !!value
          break
      }
      
      if (dep.action === 'set_value' && conditionMet) {
        updateField(field.name, dep.actionValue)
      }
    }
  }
}

const isFieldVisible = (field: FieldSchema): boolean => {
  if (field.hidden) return false
  
  if (!field.depends_on) return true
  
  for (const dep of field.depends_on) {
    if (dep.action !== 'show' && dep.action !== 'hide') continue
    
    const value = formData.value[dep.field]
    let conditionMet = false
    
    switch (dep.operator) {
      case 'eq':
        conditionMet = value === dep.value
        break
      case 'neq':
        conditionMet = value !== dep.value
        break
      case 'in':
        conditionMet = Array.isArray(dep.value) && dep.value.includes(value)
        break
      case 'empty':
        conditionMet = !value
        break
      case 'not_empty':
        conditionMet = !!value
        break
    }
    
    if (dep.action === 'hide' && conditionMet) return false
    if (dep.action === 'show' && !conditionMet) return false
  }
  
  return true
}

const isFieldDisabled = (field: FieldSchema): boolean => {
  if (isReadonly.value) return true
  if (field.disabled) return true
  if (field.readonly) return true
  
  // Check access
  const access = canAccessField(field, props.docType, 'write', props.resourceAttributes)
  if (!access.editable) return true
  
  // Check dependencies
  if (!field.depends_on) return false
  
  for (const dep of field.depends_on) {
    if (dep.action !== 'disable' && dep.action !== 'enable') continue
    
    const value = formData.value[dep.field]
    let conditionMet = false
    
    switch (dep.operator) {
      case 'eq':
        conditionMet = value === dep.value
        break
      case 'neq':
        conditionMet = value !== dep.value
        break
    }
    
    if (dep.action === 'disable' && conditionMet) return true
    if (dep.action === 'enable' && !conditionMet) return true
  }
  
  return false
}

const getFieldWidth = (field: FieldSchema): string => {
  switch (field.width) {
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
      <div
        v-for="section in sections"
        :key="section.name"
        class="form-builder__section"
      >
        <div class="form-builder__section-header">
          <h3 class="form-builder__section-title">{{ section.label }}</h3>
          <p v-if="section.description" class="form-builder__section-description">
            {{ section.description }}
          </p>
        </div>
        
        <div class="form-builder__fields" :style="{ '--columns': section.columns || 2 }">
          <template v-for="field in fieldsBySection.get(section.name)" :key="field.name">
            <div
              v-if="isFieldVisible(field)"
              :class="getFieldWidth(field)"
            >
              <FormField
                :label="field.label"
                :name="field.name"
                :required="field.required"
                :error="errors[field.name]"
                :description="field.description"
                :helpText="field.tooltip"
              >
                <FieldRenderer
                  :field="field"
                  :value="formData[field.name]"
                  :disabled="isFieldDisabled(field)"
                  :invalid="!!errors[field.name]"
                  @update:value="updateField(field.name, $event)"
                  @blur="onFieldBlur(field.name)"
                />
              </FormField>
            </div>
          </template>
        </div>
      </div>
    </template>
    
    <!-- Fields without sections -->
    <template v-else>
      <div class="form-builder__fields">
        <template v-for="field in visibleFields" :key="field.name">
          <div
            v-if="isFieldVisible(field)"
            :class="getFieldWidth(field)"
          >
            <FormField
              :label="field.label"
              :name="field.name"
              :required="field.required"
              :error="errors[field.name]"
              :description="field.description"
              :helpText="field.tooltip"
            >
              <FieldRenderer
                :field="field"
                :value="formData[field.name]"
                :disabled="isFieldDisabled(field)"
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
  gap: 2rem;
}

.form-builder__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-builder__section-header {
  border-bottom: 1px solid var(--p-surface-200);
  padding-bottom: 0.75rem;
}

.form-builder__section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin: 0;
}

.form-builder__section-description {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
  margin: 0.25rem 0 0;
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
</style>
```

### FormDrawer Component

Wraps FormBuilder in a Drawer for create/edit operations.

```vue
<!-- src/components/organisms/FormDrawer.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import FormBuilder from './FormBuilder.vue'
import type { FieldSchema, FormSection } from '@/types/schema'

interface Props {
  visible: boolean
  title: string
  mode: 'create' | 'edit' | 'view'
  docType: string
  fields: FieldSchema[]
  sections?: FormSection[]
  data?: Record<string, unknown>
  loading?: boolean
  position?: 'left' | 'right' | 'top' | 'bottom'
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

Renders the appropriate PrimeVue component based on field type.

```vue
<!-- src/components/renderers/FieldRenderer.vue -->
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import DatePicker from 'primevue/datepicker'
import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'
import RadioButton from 'primevue/radiobutton'
import Password from 'primevue/password'
import Rating from 'primevue/rating'
import Chips from 'primevue/chips'
import ColorPicker from 'primevue/colorpicker'
import InputMask from 'primevue/inputmask'
import Editor from 'primevue/editor'
import FileUpload from 'primevue/fileupload'
import type { FieldSchema, FieldOption, OptionsSource } from '@/types/schema'
import api from '@/services/api'

interface Props {
  field: FieldSchema
  value: unknown
  disabled?: boolean
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

// Dynamic options loading
const loadOptions = async (source: OptionsSource): Promise<FieldOption[]> => {
  if (source.type === 'static') {
    return []
  }
  
  if (source.type === 'api' && source.endpoint) {
    try {
      const response = await api.get(source.endpoint, { params: source.params })
      const data = response.data.data || response.data
      
      return data.map((item: any) => ({
        value: item[source.valueField || 'id'],
        label: item[source.labelField || 'name'],
      }))
    } catch (error) {
      console.error('Failed to load options:', error)
      return []
    }
  }
  
  return []
}

// Computed options
const options = computed(() => {
  if (props.field.options) {
    return props.field.options
  }
  return []
})

// Input handlers
const onInput = (event: any) => {
  const value = event?.target?.value ?? event
  emit('update:value', value)
}

const onBlur = () => {
  emit('blur')
}

// Style classes
const inputClass = computed(() => ({
  'w-full': true,
  'p-invalid': props.invalid,
}))
</script>

<template>
  <!-- Text Input -->
  <InputText
    v-if="field.type === 'text'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Email Input -->
  <InputText
    v-else-if="field.type === 'email'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="field.placeholder || 'email@example.com'"
    type="email"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Phone Input -->
  <InputMask
    v-else-if="field.type === 'phone'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    mask="(999) 999-9999"
    :placeholder="field.placeholder || '(999) 999-9999'"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- URL Input -->
  <InputText
    v-else-if="field.type === 'url'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="field.placeholder || 'https://'"
    type="url"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Password Input -->
  <Password
    v-else-if="field.type === 'password'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :feedback="false"
    toggleMask
    :class="inputClass"
    :inputClass="'w-full'"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Textarea -->
  <Textarea
    v-else-if="field.type === 'textarea'"
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :rows="5"
    :autoResize="true"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Number Input -->
  <InputNumber
    v-else-if="field.type === 'number'"
    :modelValue="(value as number) ?? null"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :min="field.min"
    :max="field.max"
    :class="inputClass"
    :inputClass="'w-full'"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Currency Input -->
  <InputNumber
    v-else-if="field.type === 'currency'"
    :modelValue="(value as number) ?? null"
    :disabled="disabled"
    :placeholder="field.placeholder"
    mode="currency"
    currency="USD"
    locale="en-US"
    :min="field.min"
    :max="field.max"
    :class="inputClass"
    :inputClass="'w-full'"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Percent Input -->
  <InputNumber
    v-else-if="field.type === 'percent'"
    :modelValue="(value as number) ?? null"
    :disabled="disabled"
    :placeholder="field.placeholder"
    suffix="%"
    :min="0"
    :max="100"
    :class="inputClass"
    :inputClass="'w-full'"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Select -->
  <Select
    v-else-if="field.type === 'select'"
    :modelValue="value"
    :disabled="disabled"
    :options="options"
    optionLabel="label"
    optionValue="value"
    :placeholder="field.placeholder || 'Select...'"
    :showClear="!field.required"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- MultiSelect -->
  <MultiSelect
    v-else-if="field.type === 'multiselect'"
    :modelValue="(value as unknown[]) || []"
    :disabled="disabled"
    :options="options"
    optionLabel="label"
    optionValue="value"
    :placeholder="field.placeholder || 'Select...'"
    :maxSelectedLabels="3"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Date -->
  <DatePicker
    v-else-if="field.type === 'date'"
    :modelValue="value ? new Date(value as string) : null"
    :disabled="disabled"
    :placeholder="field.placeholder || 'Select date'"
    dateFormat="mm/dd/yy"
    :showIcon="true"
    :showButtonBar="true"
    :class="inputClass"
    :inputClass="'w-full'"
    @update:modelValue="emit('update:value', $event?.toISOString())"
    @blur="onBlur"
  />
  
  <!-- DateTime -->
  <DatePicker
    v-else-if="field.type === 'datetime'"
    :modelValue="value ? new Date(value as string) : null"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :showTime="true"
    :showIcon="true"
    :showButtonBar="true"
    :class="inputClass"
    :inputClass="'w-full'"
    @update:modelValue="emit('update:value', $event?.toISOString())"
    @blur="onBlur"
  />
  
  <!-- Time -->
  <DatePicker
    v-else-if="field.type === 'time'"
    :modelValue="value ? new Date(`1970-01-01T${value}`) : null"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :timeOnly="true"
    :showIcon="true"
    :class="inputClass"
    :inputClass="'w-full'"
    @update:modelValue="emit('update:value', $event?.toTimeString().slice(0, 5))"
    @blur="onBlur"
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
  
  <!-- Radio Group -->
  <div v-else-if="field.type === 'radio'" class="flex flex-col gap-2">
    <div
      v-for="option in options"
      :key="String(option.value)"
      class="flex items-center gap-2"
    >
      <RadioButton
        :modelValue="value"
        :inputId="`${field.name}-${option.value}`"
        :value="option.value"
        :disabled="disabled || option.disabled"
        @update:modelValue="emit('update:value', $event)"
      />
      <label :for="`${field.name}-${option.value}`" class="cursor-pointer">
        {{ option.label }}
      </label>
    </div>
  </div>
  
  <!-- Rating -->
  <Rating
    v-else-if="field.type === 'rating'"
    :modelValue="(value as number) || 0"
    :disabled="disabled"
    :cancel="false"
    @update:modelValue="emit('update:value', $event)"
  />
  
  <!-- Tags -->
  <Chips
    v-else-if="field.type === 'tags'"
    :modelValue="(value as string[]) || []"
    :disabled="disabled"
    :placeholder="field.placeholder || 'Add tag...'"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
  
  <!-- Color -->
  <ColorPicker
    v-else-if="field.type === 'color'"
    :modelValue="(value as string) || '#000000'"
    :disabled="disabled"
    @update:modelValue="emit('update:value', $event)"
  />
  
  <!-- HTML Editor -->
  <Editor
    v-else-if="field.type === 'html'"
    :modelValue="(value as string) || ''"
    :readonly="disabled"
    editorStyle="height: 200px"
    @update:modelValue="emit('update:value', $event)"
  />
  
  <!-- Readonly/Display -->
  <div
    v-else-if="field.type === 'readonly'"
    class="p-3 bg-surface-100 rounded border border-surface-200"
  >
    {{ value || '-' }}
  </div>
  
  <!-- Default: Text Input -->
  <InputText
    v-else
    :modelValue="(value as string) || ''"
    :disabled="disabled"
    :placeholder="field.placeholder"
    :class="inputClass"
    @update:modelValue="emit('update:value', $event)"
    @blur="onBlur"
  />
</template>
```

### DocumentPage Renderer

The main page renderer that combines DataTableCrud and FormDrawer.

```vue
<!-- src/components/renderers/DocumentPage.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Card from 'primevue/card'
import DataTableCrud from '@/components/organisms/DataTableCrud.vue'
import FormDrawer from '@/components/organisms/FormDrawer.vue'
import { useSchema } from '@/composables/useSchema'
import { useCrud } from '@/composables/useCrud'
import { useDrawer } from '@/composables/useDrawer'
import type { ActionSchema } from '@/types/schema'

interface Props {
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
  formActions,
} = useSchema(props.docType)

// CRUD operations
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
    default:
      // Custom action
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
    default:
      // Custom action
      break
  }
}

// Handle bulk actions
const handleBulkAction = (action: ActionSchema, data: { ids: string[] }) => {
  switch (action.action) {
    case 'delete':
      crud.value?.bulkDelete(data.ids)
      break
    default:
      // Custom bulk action
      break
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

// Determine action type for routing
const handleAction = (action: ActionSchema, data?: Record<string, unknown>) => {
  if (data) {
    handleRowAction(action, data)
  } else if (data && 'ids' in (data as any)) {
    handleBulkAction(action, data as { ids: string[] })
  } else {
    handleToolbarAction(action)
  }
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

## Extending PrimeVue

### When to Extend vs. Wrap

**Extend** when you need to:
- Add new props/slots to existing component
- Modify default behavior globally
- Create a component variant

**Wrap** when you need to:
- Combine multiple components
- Add business logic
- Standardize patterns

### Example: Extended DataTable

When PrimeVue's DataTable doesn't have exactly what you need:

```vue
<!-- src/components/extended/AppDataTable.vue -->
<script setup lang="ts">
import { computed, useSlots, useAttrs } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Skeleton from 'primevue/skeleton'
import EmptyState from '@/components/molecules/EmptyState.vue'

interface Props {
  // Extend PrimeVue DataTable props
  value: Record<string, unknown>[]
  loading?: boolean
  
  // Our custom additions
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: string
  showCreateButton?: boolean
  skeletonRows?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyTitle: 'No records found',
  emptyDescription: 'Try adjusting your filters or create a new record',
  emptyIcon: 'pi pi-inbox',
  showCreateButton: true,
  skeletonRows: 5,
})

const emit = defineEmits<{
  create: []
}>()

// Forward all other attrs to DataTable
const attrs = useAttrs()
const slots = useSlots()

// Computed
const tableProps = computed(() => ({
  ...attrs,
  value: props.value,
  loading: false, // We handle loading ourselves
}))

const isEmpty = computed(() => !props.loading && props.value.length === 0)
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="app-datatable__loading">
    <Skeleton v-for="i in skeletonRows" :key="i" class="mb-2" height="3rem" />
  </div>
  
  <!-- Empty State -->
  <EmptyState
    v-else-if="isEmpty"
    :icon="emptyIcon"
    :title="emptyTitle"
    :description="emptyDescription"
    :action-label="showCreateButton ? 'Create New' : undefined"
    action-icon="pi pi-plus"
    @action="emit('create')"
  />
  
  <!-- Data Table -->
  <DataTable v-else v-bind="tableProps">
    <!-- Forward all slots -->
    <template v-for="(_, slotName) in slots" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </DataTable>
</template>
```

### Example: Custom Field Component

When you need a field type PrimeVue doesn't have:

```vue
<!-- src/components/extended/LinkField.vue -->
<script setup lang="ts">
/**
 * A "Link" field that references another document type.
 * Like ERPNext's Link field - shows a searchable dropdown
 * that fetches from another doctype's API.
 */
import { ref, computed, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import api from '@/services/api'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  modelValue: string | null
  docType: string              // Target doctype to link to
  displayField?: string        // Field to display (default: 'name')
  searchFields?: string[]      // Fields to search
  filters?: Record<string, unknown>  // Additional filters
  disabled?: boolean
  placeholder?: string
  showQuickCreate?: boolean    // Show "+" button to create new
}

const props = withDefaults(defineProps<Props>(), {
  displayField: 'name',
  searchFields: () => ['name'],
  disabled: false,
  showQuickCreate: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'select': [item: Record<string, unknown>]
}>()

// State
const suggestions = ref<Record<string, unknown>[]>([])
const isLoading = ref(false)
const selectedItem = ref<Record<string, unknown> | null>(null)
const showCreateDialog = ref(false)

// Load initial value
watch(() => props.modelValue, async (newValue) => {
  if (newValue && !selectedItem.value) {
    await loadItem(newValue)
  }
}, { immediate: true })

// Methods
const loadItem = async (id: string) => {
  try {
    const response = await api.get(`/api/v1/${props.docType}/${id}`)
    selectedItem.value = response.data
  } catch (error) {
    console.error('Failed to load linked item:', error)
  }
}

const search = useDebounceFn(async (query: string) => {
  if (!query || query.length < 2) {
    suggestions.value = []
    return
  }
  
  isLoading.value = true
  try {
    const params: Record<string, unknown> = {
      search: query,
      limit: 20,
      ...props.filters,
    }
    
    const response = await api.get(`/api/v1/${props.docType}`, { params })
    suggestions.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to search:', error)
    suggestions.value = []
  } finally {
    isLoading.value = false
  }
}, 300)

const onSelect = (event: any) => {
  const item = event.value
  selectedItem.value = item
  emit('update:modelValue', item.id)
  emit('select', item)
}

const onClear = () => {
  selectedItem.value = null
  emit('update:modelValue', null)
}

const getDisplayValue = (item: Record<string, unknown>): string => {
  return String(item[props.displayField] || item.id || '')
}

const openQuickCreate = () => {
  showCreateDialog.value = true
}
</script>

<template>
  <div class="link-field">
    <AutoComplete
      :modelValue="selectedItem"
      :suggestions="suggestions"
      :field="displayField"
      :disabled="disabled"
      :placeholder="placeholder || `Search ${docType}...`"
      :loading="isLoading"
      :dropdown="true"
      :forceSelection="true"
      class="flex-1"
      @complete="search($event.query)"
      @item-select="onSelect"
      @clear="onClear"
    >
      <template #option="{ option }">
        <div class="flex items-center gap-2">
          <span>{{ getDisplayValue(option) }}</span>
          <span v-if="option.description" class="text-sm text-surface-500">
            - {{ option.description }}
          </span>
        </div>
      </template>
    </AutoComplete>
    
    <Button
      v-if="showQuickCreate && !disabled"
      icon="pi pi-plus"
      severity="secondary"
      outlined
      v-tooltip="'Create new'"
      @click="openQuickCreate"
    />
    
    <!-- Quick Create Dialog -->
    <Dialog
      v-model:visible="showCreateDialog"
      :header="`Create ${docType}`"
      modal
      :style="{ width: '500px' }"
    >
      <slot name="create-form" :close="() => showCreateDialog = false" />
    </Dialog>
  </div>
</template>

<style scoped>
.link-field {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}
</style>
```


## JSON Schema Structure

### Schema File Location Strategy

```
src/schemas/
├── documents/           # Document type schemas
│   ├── core/           # Core/system documents
│   │   ├── user.json
│   │   ├── role.json
│   │   └── tenant.json
│   ├── accounting/     # Accounting module
│   │   ├── invoice.json
│   │   ├── payment.json
│   │   └── journal-entry.json
│   ├── inventory/      # Inventory module
│   │   ├── product.json
│   │   ├── warehouse.json
│   │   └── stock-transfer.json
│   ├── sales/          # Sales module
│   │   ├── customer.json
│   │   ├── sales-order.json
│   │   └── quotation.json
│   └── hr/             # HR module
│       ├── employee.json
│       ├── leave-request.json
│       └── payroll.json
├── dashboards/
│   ├── main.json
│   ├── sales.json
│   └── accounting.json
├── reports/
│   ├── sales-summary.json
│   └── profit-loss.json
└── meta/
    ├── modules.json     # Module definitions
    ├── field-types.json # Field type metadata
    └── plans.json       # Subscription plans
```

---

## Complete Schema Examples

### Customer Schema (Full Example)

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
    "endpoints": {
      "list": "/api/v1/customers",
      "get": "/api/v1/customers/:id",
      "create": "/api/v1/customers",
      "update": "/api/v1/customers/:id",
      "delete": "/api/v1/customers/:id",
      "export": "/api/v1/customers/export",
      "import": "/api/v1/customers/import"
    },
    "defaultParams": {
      "include": "contacts,addresses"
    },
    "idField": "id",
    "pagination": {
      "pageParam": "page",
      "limitParam": "limit",
      "defaultLimit": 20
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
        "filterable": true,
        "frozen": true,
        "linkTo": "customer"
      },
      {
        "field": "name",
        "header": "Customer Name",
        "type": "text",
        "sortable": true,
        "filterable": true
      },
      {
        "field": "type",
        "header": "Type",
        "type": "select",
        "sortable": true,
        "filterable": true,
        "filterType": "select",
        "filterOptions": [
          { "value": "individual", "label": "Individual" },
          { "value": "company", "label": "Company" }
        ]
      },
      {
        "field": "email",
        "header": "Email",
        "type": "email"
      },
      {
        "field": "phone",
        "header": "Phone",
        "type": "phone"
      },
      {
        "field": "creditLimit",
        "header": "Credit Limit",
        "type": "currency",
        "align": "right",
        "access": {
          "requiredPlan": ["professional", "enterprise"],
          "readRoles": ["admin", "accountant", "sales_manager"]
        }
      },
      {
        "field": "outstandingBalance",
        "header": "Outstanding",
        "type": "currency",
        "align": "right"
      },
      {
        "field": "status",
        "header": "Status",
        "type": "select",
        "sortable": true,
        "filterable": true
      },
      {
        "field": "createdAt",
        "header": "Created",
        "type": "date",
        "sortable": true,
        "format": "MMM dd, yyyy"
      }
    ],

    "defaultSort": {
      "field": "name",
      "order": "asc"
    },

    "searchable": true,
    "searchFields": ["code", "name", "email", "phone"],

    "filters": [
      {
        "field": "status",
        "label": "Status",
        "type": "select",
        "options": [
          { "value": "active", "label": "Active" },
          { "value": "inactive", "label": "Inactive" },
          { "value": "blocked", "label": "Blocked" }
        ]
      },
      {
        "field": "type",
        "label": "Type",
        "type": "select",
        "options": [
          { "value": "individual", "label": "Individual" },
          { "value": "company", "label": "Company" }
        ]
      },
      {
        "field": "customerGroup",
        "label": "Group",
        "type": "select",
        "optionsSource": {
          "type": "api",
          "endpoint": "/api/v1/customer-groups",
          "valueField": "id",
          "labelField": "name"
        }
      }
    ],

    "selectable": true,

    "toolbarActions": [
      {
        "name": "create",
        "label": "New Customer",
        "icon": "pi pi-plus",
        "type": "button",
        "variant": "primary",
        "action": "create",
        "access": {
          "requiredPermissions": ["customer:create"]
        }
      },
      {
        "name": "export",
        "label": "Export",
        "icon": "pi pi-download",
        "type": "button",
        "variant": "secondary",
        "action": "export",
        "access": {
          "requiredPermissions": ["customer:export"],
          "requiredPlan": ["professional", "enterprise"]
        }
      },
      {
        "name": "import",
        "label": "Import",
        "icon": "pi pi-upload",
        "type": "button",
        "variant": "secondary",
        "action": "import",
        "access": {
          "requiredPermissions": ["customer:import"],
          "requiredPlan": ["enterprise"]
        }
      }
    ],

    "rowActions": [
      {
        "name": "edit",
        "label": "Edit",
        "icon": "pi pi-pencil",
        "type": "button",
        "action": "edit",
        "access": {
          "requiredPermissions": ["customer:update"]
        }
      },
      {
        "name": "duplicate",
        "label": "Duplicate",
        "icon": "pi pi-copy",
        "type": "button",
        "action": "duplicate",
        "access": {
          "requiredPermissions": ["customer:create"]
        }
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
          "message": "Are you sure you want to delete this customer? This action cannot be undone.",
          "acceptLabel": "Delete",
          "rejectLabel": "Cancel",
          "severity": "danger"
        },
        "disableWhen": [
          { "field": "outstandingBalance", "operator": "neq", "value": 0 }
        ],
        "access": {
          "requiredPermissions": ["customer:delete"]
        }
      }
    ],

    "bulkActions": [
      {
        "name": "bulkDelete",
        "label": "Delete Selected",
        "icon": "pi pi-trash",
        "type": "button",
        "variant": "danger",
        "action": "delete",
        "confirm": {
          "title": "Delete Customers",
          "message": "Are you sure you want to delete the selected customers?",
          "severity": "danger"
        },
        "access": {
          "requiredPermissions": ["customer:delete"]
        }
      },
      {
        "name": "bulkExport",
        "label": "Export Selected",
        "icon": "pi pi-download",
        "type": "button",
        "action": "export",
        "access": {
          "requiredPermissions": ["customer:export"]
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
      },
      {
        "name": "billing",
        "label": "Billing & Credit",
        "description": "Financial settings and credit limits",
        "columns": 2,
        "access": {
          "readRoles": ["admin", "accountant", "sales_manager"]
        }
      },
      {
        "name": "addresses",
        "label": "Addresses",
        "collapsible": true,
        "columns": 1
      },
      {
        "name": "notes",
        "label": "Notes & Attachments",
        "collapsible": true,
        "collapsed": true,
        "columns": 1
      }
    ],

    "fields": [
      {
        "name": "code",
        "label": "Customer Code",
        "type": "text",
        "section": "basic",
        "width": "half",
        "required": true,
        "readonly": true,
        "description": "Auto-generated unique identifier",
        "order": 1
      },
      {
        "name": "type",
        "label": "Customer Type",
        "type": "select",
        "section": "basic",
        "width": "half",
        "required": true,
        "defaultValue": "individual",
        "options": [
          { "value": "individual", "label": "Individual", "icon": "pi pi-user" },
          { "value": "company", "label": "Company", "icon": "pi pi-building" }
        ],
        "order": 2
      },
      {
        "name": "name",
        "label": "Customer Name",
        "type": "text",
        "section": "basic",
        "width": "half",
        "required": true,
        "minLength": 2,
        "maxLength": 100,
        "placeholder": "Enter customer name",
        "order": 3
      },
      {
        "name": "companyName",
        "label": "Company Name",
        "type": "text",
        "section": "basic",
        "width": "half",
        "depends_on": [
          { "field": "type", "operator": "eq", "value": "company", "action": "show" }
        ],
        "required": false,
        "order": 4
      },
      {
        "name": "taxId",
        "label": "Tax ID / VAT Number",
        "type": "text",
        "section": "basic",
        "width": "half",
        "depends_on": [
          { "field": "type", "operator": "eq", "value": "company", "action": "show" }
        ],
        "pattern": "^[A-Z0-9]{8,15}$",
        "order": 5
      },
      {
        "name": "customerGroup",
        "label": "Customer Group",
        "type": "link",
        "section": "basic",
        "width": "half",
        "linkTo": "customer-group",
        "order": 6
      },
      {
        "name": "status",
        "label": "Status",
        "type": "select",
        "section": "basic",
        "width": "half",
        "required": true,
        "defaultValue": "active",
        "options": [
          { "value": "active", "label": "Active", "color": "green" },
          { "value": "inactive", "label": "Inactive", "color": "gray" },
          { "value": "blocked", "label": "Blocked", "color": "red" }
        ],
        "order": 7
      },
      {
        "name": "email",
        "label": "Email",
        "type": "email",
        "section": "contact",
        "width": "half",
        "required": true,
        "order": 10
      },
      {
        "name": "phone",
        "label": "Phone",
        "type": "phone",
        "section": "contact",
        "width": "half",
        "order": 11
      },
      {
        "name": "mobile",
        "label": "Mobile",
        "type": "phone",
        "section": "contact",
        "width": "half",
        "order": 12
      },
      {
        "name": "website",
        "label": "Website",
        "type": "url",
        "section": "contact",
        "width": "half",
        "depends_on": [
          { "field": "type", "operator": "eq", "value": "company", "action": "show" }
        ],
        "order": 13
      },
      {
        "name": "currency",
        "label": "Currency",
        "type": "select",
        "section": "billing",
        "width": "half",
        "defaultValue": "USD",
        "options": [
          { "value": "USD", "label": "US Dollar (USD)" },
          { "value": "EUR", "label": "Euro (EUR)" },
          { "value": "GBP", "label": "British Pound (GBP)" },
          { "value": "KES", "label": "Kenyan Shilling (KES)" }
        ],
        "order": 20
      },
      {
        "name": "paymentTerms",
        "label": "Payment Terms",
        "type": "link",
        "section": "billing",
        "width": "half",
        "linkTo": "payment-terms",
        "order": 21
      },
      {
        "name": "creditLimit",
        "label": "Credit Limit",
        "type": "currency",
        "section": "billing",
        "width": "half",
        "min": 0,
        "defaultValue": 0,
        "access": {
          "requiredPlan": ["professional", "enterprise"],
          "writeRoles": ["admin", "accountant"]
        },
        "order": 22
      },
      {
        "name": "outstandingBalance",
        "label": "Outstanding Balance",
        "type": "currency",
        "section": "billing",
        "width": "half",
        "readonly": true,
        "order": 23
      },
      {
        "name": "addresses",
        "label": "Addresses",
        "type": "table",
        "section": "addresses",
        "width": "full",
        "tableSchema": [
          {
            "name": "type",
            "label": "Type",
            "type": "select",
            "width": "quarter",
            "required": true,
            "options": [
              { "value": "billing", "label": "Billing" },
              { "value": "shipping", "label": "Shipping" },
              { "value": "both", "label": "Both" }
            ]
          },
          {
            "name": "address1",
            "label": "Address Line 1",
            "type": "text",
            "required": true
          },
          {
            "name": "address2",
            "label": "Address Line 2",
            "type": "text"
          },
          {
            "name": "city",
            "label": "City",
            "type": "text",
            "required": true
          },
          {
            "name": "state",
            "label": "State/Province",
            "type": "text"
          },
          {
            "name": "postalCode",
            "label": "Postal Code",
            "type": "text"
          },
          {
            "name": "country",
            "label": "Country",
            "type": "select",
            "required": true,
            "optionsSource": {
              "type": "api",
              "endpoint": "/api/v1/countries",
              "valueField": "code",
              "labelField": "name"
            }
          },
          {
            "name": "isDefault",
            "label": "Default",
            "type": "checkbox"
          }
        ],
        "minRows": 0,
        "maxRows": 10,
        "order": 30
      },
      {
        "name": "notes",
        "label": "Internal Notes",
        "type": "textarea",
        "section": "notes",
        "width": "full",
        "maxLength": 2000,
        "order": 40
      },
      {
        "name": "tags",
        "label": "Tags",
        "type": "tags",
        "section": "notes",
        "width": "full",
        "order": 41
      }
    ],

    "layout": "vertical",
    "validateOnBlur": true,
    "validateOnChange": false,

    "actions": [
      {
        "name": "save",
        "label": "Save",
        "icon": "pi pi-check",
        "type": "button",
        "variant": "primary",
        "action": "api",
        "method": "POST"
      },
      {
        "name": "saveAndNew",
        "label": "Save & New",
        "icon": "pi pi-plus",
        "type": "button",
        "variant": "secondary",
        "action": "custom",
        "handler": "saveAndNew"
      }
    ]
  },

  "access": {
    "requiredModule": "sales",
    "permissions": {
      "create": {
        "roles": ["admin", "sales_manager", "sales_rep"],
        "conditions": []
      },
      "read": {
        "roles": ["admin", "sales_manager", "sales_rep", "accountant"],
        "owner": true
      },
      "update": {
        "roles": ["admin", "sales_manager"],
        "owner": true,
        "conditions": [
          {
            "attribute": "resource.status",
            "operator": "neq",
            "value": "blocked"
          }
        ]
      },
      "delete": {
        "roles": ["admin"],
        "conditions": [
          {
            "attribute": "resource.outstandingBalance",
            "operator": "eq",
            "value": 0
          }
        ]
      },
      "export": {
        "roles": ["admin", "sales_manager"]
      },
      "import": {
        "roles": ["admin"]
      }
    }
  },

  "workflow": {
    "statusField": "status",
    "states": [
      { "name": "active", "label": "Active", "color": "green" },
      { "name": "inactive", "label": "Inactive", "color": "gray" },
      { "name": "blocked", "label": "Blocked", "color": "red" }
    ],
    "transitions": [
      {
        "from": ["active"],
        "to": "inactive",
        "label": "Deactivate",
        "roles": ["admin", "sales_manager"]
      },
      {
        "from": ["inactive"],
        "to": "active",
        "label": "Activate",
        "roles": ["admin", "sales_manager"]
      },
      {
        "from": ["active", "inactive"],
        "to": "blocked",
        "label": "Block",
        "roles": ["admin"]
      },
      {
        "from": ["blocked"],
        "to": "active",
        "label": "Unblock",
        "roles": ["admin"]
      }
    ]
  }
}
```

### Invoice Schema (Transaction Document)

```json
{
  "name": "invoice",
  "label": "Invoice",
  "labelPlural": "Invoices",
  "icon": "pi pi-file",
  "description": "Sales invoices",
  "module": "accounting",
  "version": "1.0.0",
  "updatedAt": "2024-01-15T10:30:00Z",

  "api": {
    "baseEndpoint": "/api/v1/invoices",
    "endpoints": {
      "list": "/api/v1/invoices",
      "get": "/api/v1/invoices/:id",
      "create": "/api/v1/invoices",
      "update": "/api/v1/invoices/:id",
      "delete": "/api/v1/invoices/:id",
      "submit": "/api/v1/invoices/:id/submit",
      "cancel": "/api/v1/invoices/:id/cancel",
      "pdf": "/api/v1/invoices/:id/pdf"
    },
    "defaultParams": {
      "include": "customer,items,payments"
    },
    "pagination": {
      "defaultLimit": 20
    }
  },

  "listView": {
    "columns": [
      {
        "field": "number",
        "header": "Invoice #",
        "type": "text",
        "width": "140px",
        "sortable": true,
        "filterable": true,
        "frozen": true,
        "linkTo": "invoice"
      },
      {
        "field": "customer.name",
        "header": "Customer",
        "type": "text",
        "sortable": true,
        "filterable": true
      },
      {
        "field": "date",
        "header": "Date",
        "type": "date",
        "width": "120px",
        "sortable": true,
        "filterable": true,
        "filterType": "date"
      },
      {
        "field": "dueDate",
        "header": "Due Date",
        "type": "date",
        "width": "120px",
        "sortable": true
      },
      {
        "field": "total",
        "header": "Total",
        "type": "currency",
        "width": "140px",
        "align": "right",
        "sortable": true
      },
      {
        "field": "paidAmount",
        "header": "Paid",
        "type": "currency",
        "width": "140px",
        "align": "right"
      },
      {
        "field": "balance",
        "header": "Balance",
        "type": "currency",
        "width": "140px",
        "align": "right"
      },
      {
        "field": "status",
        "header": "Status",
        "type": "select",
        "width": "120px",
        "sortable": true,
        "filterable": true
      }
    ],

    "defaultSort": {
      "field": "date",
      "order": "desc"
    },

    "searchable": true,
    "searchFields": ["number", "customer.name"],

    "filters": [
      {
        "field": "status",
        "label": "Status",
        "type": "multiselect",
        "options": [
          { "value": "draft", "label": "Draft" },
          { "value": "submitted", "label": "Submitted" },
          { "value": "partial", "label": "Partially Paid" },
          { "value": "paid", "label": "Paid" },
          { "value": "overdue", "label": "Overdue" },
          { "value": "cancelled", "label": "Cancelled" }
        ]
      },
      {
        "field": "dateRange",
        "label": "Date Range",
        "type": "daterange"
      },
      {
        "field": "customerId",
        "label": "Customer",
        "type": "select",
        "optionsSource": {
          "type": "api",
          "endpoint": "/api/v1/customers",
          "valueField": "id",
          "labelField": "name",
          "params": { "status": "active" }
        }
      }
    ],

    "selectable": true,

    "toolbarActions": [
      {
        "name": "create",
        "label": "New Invoice",
        "icon": "pi pi-plus",
        "type": "button",
        "variant": "primary",
        "action": "create"
      }
    ],

    "rowActions": [
      {
        "name": "view",
        "label": "View",
        "icon": "pi pi-eye",
        "type": "button",
        "action": "navigate",
        "route": "/invoices/:id"
      },
      {
        "name": "edit",
        "label": "Edit",
        "icon": "pi pi-pencil",
        "type": "button",
        "action": "edit",
        "showWhen": [
          { "field": "status", "operator": "eq", "value": "draft" }
        ]
      },
      {
        "name": "submit",
        "label": "Submit",
        "icon": "pi pi-send",
        "type": "button",
        "variant": "success",
        "action": "workflow",
        "endpoint": "/api/v1/invoices/:id/submit",
        "method": "POST",
        "showWhen": [
          { "field": "status", "operator": "eq", "value": "draft" }
        ],
        "confirm": {
          "title": "Submit Invoice",
          "message": "Submit this invoice? You won't be able to edit it after submission.",
          "severity": "info"
        }
      },
      {
        "name": "pdf",
        "label": "Download PDF",
        "icon": "pi pi-file-pdf",
        "type": "button",
        "action": "api",
        "endpoint": "/api/v1/invoices/:id/pdf",
        "method": "GET"
      },
      {
        "name": "email",
        "label": "Send Email",
        "icon": "pi pi-envelope",
        "type": "button",
        "action": "custom",
        "handler": "sendInvoiceEmail",
        "showWhen": [
          { "field": "status", "operator": "neq", "value": "draft" }
        ]
      },
      {
        "name": "payment",
        "label": "Record Payment",
        "icon": "pi pi-dollar",
        "type": "button",
        "variant": "success",
        "action": "custom",
        "handler": "openPaymentDialog",
        "showWhen": [
          { "field": "status", "operator": "in", "value": ["submitted", "partial", "overdue"] }
        ]
      },
      {
        "name": "cancel",
        "label": "Cancel",
        "icon": "pi pi-times",
        "type": "button",
        "variant": "danger",
        "action": "workflow",
        "endpoint": "/api/v1/invoices/:id/cancel",
        "method": "POST",
        "showWhen": [
          { "field": "status", "operator": "in", "value": ["draft", "submitted"] }
        ],
        "confirm": {
          "title": "Cancel Invoice",
          "message": "Are you sure you want to cancel this invoice?",
          "severity": "danger"
        }
      }
    ]
  },

  "formView": {
    "sections": [
      {
        "name": "header",
        "label": "Invoice Details",
        "columns": 3
      },
      {
        "name": "items",
        "label": "Line Items",
        "columns": 1
      },
      {
        "name": "totals",
        "label": "Totals",
        "columns": 2
      },
      {
        "name": "notes",
        "label": "Notes",
        "collapsible": true,
        "columns": 1
      }
    ],

    "fields": [
      {
        "name": "number",
        "label": "Invoice Number",
        "type": "text",
        "section": "header",
        "width": "third",
        "readonly": true,
        "description": "Auto-generated",
        "order": 1
      },
      {
        "name": "customerId",
        "label": "Customer",
        "type": "link",
        "section": "header",
        "width": "third",
        "required": true,
        "linkTo": "customer",
        "linkFilters": { "status": "active" },
        "onChange": "onCustomerChange",
        "order": 2
      },
      {
        "name": "status",
        "label": "Status",
        "type": "readonly",
        "section": "header",
        "width": "third",
        "order": 3
      },
      {
        "name": "date",
        "label": "Invoice Date",
        "type": "date",
        "section": "header",
        "width": "third",
        "required": true,
        "defaultValue": "{{today}}",
        "order": 4
      },
      {
        "name": "dueDate",
        "label": "Due Date",
        "type": "date",
        "section": "header",
        "width": "third",
        "required": true,
        "order": 5
      },
      {
        "name": "reference",
        "label": "Reference / PO Number",
        "type": "text",
        "section": "header",
        "width": "third",
        "order": 6
      },
      {
        "name": "items",
        "label": "Line Items",
        "type": "table",
        "section": "items",
        "width": "full",
        "required": true,
        "minRows": 1,
        "tableSchema": [
          {
            "name": "productId",
            "label": "Product/Service",
            "type": "link",
            "linkTo": "product",
            "required": true,
            "width": "quarter",
            "onChange": "onProductSelect"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "text",
            "width": "quarter"
          },
          {
            "name": "quantity",
            "label": "Qty",
            "type": "number",
            "required": true,
            "min": 1,
            "defaultValue": 1,
            "onChange": "calculateLineTotal"
          },
          {
            "name": "unitPrice",
            "label": "Unit Price",
            "type": "currency",
            "required": true,
            "min": 0,
            "onChange": "calculateLineTotal"
          },
          {
            "name": "discount",
            "label": "Discount %",
            "type": "percent",
            "defaultValue": 0,
            "min": 0,
            "max": 100,
            "onChange": "calculateLineTotal",
            "access": {
              "requiredPlan": ["professional", "enterprise"]
            }
          },
          {
            "name": "taxRate",
            "label": "Tax %",
            "type": "percent",
            "defaultValue": 0,
            "onChange": "calculateLineTotal"
          },
          {
            "name": "total",
            "label": "Total",
            "type": "currency",
            "readonly": true
          }
        ],
        "order": 10
      },
      {
        "name": "subtotal",
        "label": "Subtotal",
        "type": "currency",
        "section": "totals",
        "width": "half",
        "readonly": true,
        "order": 20
      },
      {
        "name": "discountTotal",
        "label": "Total Discount",
        "type": "currency",
        "section": "totals",
        "width": "half",
        "readonly": true,
        "access": {
          "requiredPlan": ["professional", "enterprise"]
        },
        "order": 21
      },
      {
        "name": "taxTotal",
        "label": "Total Tax",
        "type": "currency",
        "section": "totals",
        "width": "half",
        "readonly": true,
        "order": 22
      },
      {
        "name": "total",
        "label": "Grand Total",
        "type": "currency",
        "section": "totals",
        "width": "half",
        "readonly": true,
        "order": 23
      },
      {
        "name": "notes",
        "label": "Notes (appears on invoice)",
        "type": "textarea",
        "section": "notes",
        "width": "full",
        "maxLength": 1000,
        "order": 30
      },
      {
        "name": "internalNotes",
        "label": "Internal Notes",
        "type": "textarea",
        "section": "notes",
        "width": "full",
        "maxLength": 1000,
        "description": "Only visible to staff",
        "order": 31
      }
    ]
  },

  "access": {
    "requiredModule": "accounting",
    "permissions": {
      "create": {
        "roles": ["admin", "accountant", "sales_manager", "sales_rep"]
      },
      "read": {
        "roles": ["admin", "accountant", "sales_manager", "sales_rep"],
        "owner": true
      },
      "update": {
        "roles": ["admin", "accountant"],
        "conditions": [
          { "attribute": "resource.status", "operator": "eq", "value": "draft" }
        ]
      },
      "delete": {
        "roles": ["admin"],
        "conditions": [
          { "attribute": "resource.status", "operator": "eq", "value": "draft" }
        ]
      }
    }
  },

  "workflow": {
    "statusField": "status",
    "states": [
      { "name": "draft", "label": "Draft", "color": "gray" },
      { "name": "submitted", "label": "Submitted", "color": "blue" },
      { "name": "partial", "label": "Partially Paid", "color": "orange" },
      { "name": "paid", "label": "Paid", "color": "green" },
      { "name": "overdue", "label": "Overdue", "color": "red" },
      { "name": "cancelled", "label": "Cancelled", "color": "gray" }
    ],
    "transitions": [
      {
        "from": ["draft"],
        "to": "submitted",
        "label": "Submit",
        "roles": ["admin", "accountant", "sales_manager"],
        "action": {
          "name": "submit",
          "endpoint": "/api/v1/invoices/:id/submit",
          "method": "POST"
        }
      },
      {
        "from": ["submitted", "partial", "overdue"],
        "to": "paid",
        "label": "Mark as Paid",
        "roles": ["admin", "accountant"]
      },
      {
        "from": ["draft", "submitted"],
        "to": "cancelled",
        "label": "Cancel",
        "roles": ["admin", "accountant"]
      }
    ]
  }
}
```

### Dashboard Schema

```json
{
  "name": "main-dashboard",
  "label": "Dashboard",

  "layout": {
    "type": "grid",
    "columns": 12,
    "gap": "1.5rem"
  },

  "widgets": [
    {
      "id": "revenue-stat",
      "type": "stat",
      "title": "Revenue (This Month)",
      "position": { "row": 1, "col": 1, "width": 3, "height": 1 },
      "dataSource": {
        "type": "api",
        "endpoint": "/api/v1/dashboard/stats/revenue",
        "refreshInterval": 300
      },
      "config": {
        "valueField": "total",
        "format": "currency",
        "icon": "pi pi-dollar",
        "color": "green",
        "trend": {
          "field": "percentChange",
          "compareLabel": "vs last month"
        }
      }
    },
    {
      "id": "invoices-stat",
      "type": "stat",
      "title": "Outstanding Invoices",
      "position": { "row": 1, "col": 4, "width": 3, "height": 1 },
      "dataSource": {
        "type": "api",
        "endpoint": "/api/v1/dashboard/stats/outstanding-invoices"
      },
      "config": {
        "valueField": "total",
        "format": "currency",
        "icon": "pi pi-file",
        "color": "orange"
      }
    },
    {
      "id": "customers-stat",
      "type": "stat",
      "title": "Total Customers",
      "position": { "row": 1, "col": 7, "width": 3, "height": 1 },
      "dataSource": {
        "type": "api",
        "endpoint": "/api/v1/dashboard/stats/customers"
      },
      "config": {
        "valueField": "count",
        "format": "number",
        "icon": "pi pi-users",
        "color": "blue",
        "trend": {
          "field": "newThisMonth",
          "compareLabel": "new this month"
        }
      }
    },
    {
      "id": "overdue-stat",
      "type": "stat",
      "title": "Overdue Amount",
      "position": { "row": 1, "col": 10, "width": 3, "height": 1 },
      "dataSource": {
        "type": "api",
        "endpoint": "/api/v1/dashboard/stats/overdue"
      },
      "config": {
        "valueField": "total",
        "format": "currency",
        "icon": "pi pi-exclamation-triangle",
        "color": "red"
      },
      "access": {
        "readRoles": ["admin", "accountant"]
      }
    },
    {
      "id": "revenue-chart",
      "type": "chart",
      "title": "Revenue Trend",
      "position": { "row": 2, "col": 1, "width": 8, "height": 2 },
      "dataSource": {
        "type": "api",
        "endpoint": "/api/v1/dashboard/charts/revenue-trend",
        "params": { "period": "12months" }
      },
      "config": {
        "chartType": "area",
        "xField": "month",
        "yField": "revenue",
        "colors": ["#3B82F6"]
      }
    },
    {
      "id": "top-customers",
      "type": "table",
      "title": "Top Customers",
      "position": { "row": 2, "col": 9, "width": 4, "height": 2 },
      "dataSource": {
        "type": "api",
        "endpoint": "/api/v1/dashboard/top-customers",
        "params": { "limit": 5 }
      },
      "config": {
        "columns": [
          { "field": "name", "header": "Customer" },
          { "field": "revenue", "header": "Revenue", "type": "currency" }
        ],
        "linkTo": "/customers"
      }
    },
    {
      "id": "recent-invoices",
      "type": "table",
      "title": "Recent Invoices",
      "position": { "row": 4, "col": 1, "width": 6, "height": 2 },
      "dataSource": {
        "type": "api",
        "endpoint": "/api/v1/invoices",
        "params": { "limit": 10, "sort": "-createdAt" }
      },
      "config": {
        "columns": [
          { "field": "number", "header": "#", "linkTo": "invoice" },
          { "field": "customer.name", "header": "Customer" },
          { "field": "total", "header": "Amount", "type": "currency" },
          { "field": "status", "header": "Status", "type": "tag" }
        ],
        "linkTo": "/invoices"
      }
    },
    {
      "id": "payment-breakdown",
      "type": "chart",
      "title": "Payment Status",
      "position": { "row": 4, "col": 7, "width": 6, "height": 2 },
      "dataSource": {
        "type": "api",
        "endpoint": "/api/v1/dashboard/charts/payment-breakdown"
      },
      "config": {
        "chartType": "doughnut",
        "xField": "status",
        "yField": "amount",
        "colors": ["#22C55E", "#F59E0B", "#EF4444", "#6B7280"]
      }
    }
  ],

  "access": {
    "requiredModule": "core"
  }
}
```

---

## Schema Builder UI

For complex ERPs, you might want a visual schema builder. Here's a simplified implementation:

### Schema Builder Store

```typescript
// src/stores/schemaBuilderStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DocumentSchema, FieldSchema, ColumnSchema, ActionSchema, FormSection } from '@/types/schema'
import { v4 as uuid } from 'uuid'

export const useSchemaBuilderStore = defineStore('schemaBuilder', () => {
  // Current schema being edited
  const schema = ref<Partial<DocumentSchema>>({
    name: '',
    label: '',
    labelPlural: '',
    module: '',
    version: '1.0.0',
    api: {
      baseEndpoint: '',
      pagination: { defaultLimit: 20 }
    },
    listView: {
      columns: [],
      toolbarActions: [],
      rowActions: [],
      bulkActions: [],
      filters: [],
      searchable: true,
      selectable: false
    },
    formView: {
      sections: [],
      fields: []
    },
    access: {
      permissions: {
        create: { roles: [] },
        read: { roles: [] },
        update: { roles: [] },
        delete: { roles: [] }
      }
    }
  })

  const isDirty = ref(false)
  const selectedFieldIndex = ref<number | null>(null)
  const selectedColumnIndex = ref<number | null>(null)

  // ============================================
  // FIELD OPERATIONS
  // ============================================

  const addField = (field: Partial<FieldSchema>) => {
    const newField: FieldSchema = {
      name: field.name || `field_${uuid().slice(0, 8)}`,
      label: field.label || 'New Field',
      type: field.type || 'text',
      section: field.section || 'default',
      order: schema.value.formView?.fields?.length || 0,
      ...field
    }
    
    if (!schema.value.formView) {
      schema.value.formView = { sections: [], fields: [] }
    }
    schema.value.formView.fields?.push(newField)
    isDirty.value = true
    
    return newField
  }

  const updateField = (index: number, updates: Partial<FieldSchema>) => {
    if (schema.value.formView?.fields?.[index]) {
      schema.value.formView.fields[index] = {
        ...schema.value.formView.fields[index],
        ...updates
      }
      isDirty.value = true
    }
  }

  const removeField = (index: number) => {
    schema.value.formView?.fields?.splice(index, 1)
    isDirty.value = true
  }

  const reorderFields = (fromIndex: number, toIndex: number) => {
    const fields = schema.value.formView?.fields
    if (!fields) return
    
    const [removed] = fields.splice(fromIndex, 1)
    fields.splice(toIndex, 0, removed)
    
    // Update order values
    fields.forEach((field, index) => {
      field.order = index
    })
    
    isDirty.value = true
  }

  // ============================================
  // SECTION OPERATIONS
  // ============================================

  const addSection = (section: Partial<FormSection>) => {
    const newSection: FormSection = {
      name: section.name || `section_${uuid().slice(0, 8)}`,
      label: section.label || 'New Section',
      columns: section.columns || 2,
      ...section
    }
    
    if (!schema.value.formView) {
      schema.value.formView = { sections: [], fields: [] }
    }
    schema.value.formView.sections?.push(newSection)
    isDirty.value = true
    
    return newSection
  }

  const updateSection = (index: number, updates: Partial<FormSection>) => {
    if (schema.value.formView?.sections?.[index]) {
      schema.value.formView.sections[index] = {
        ...schema.value.formView.sections[index],
        ...updates
      }
      isDirty.value = true
    }
  }

  const removeSection = (index: number) => {
    const sectionName = schema.value.formView?.sections?.[index]?.name
    schema.value.formView?.sections?.splice(index, 1)
    
    // Move fields in this section to default
    schema.value.formView?.fields?.forEach(field => {
      if (field.section === sectionName) {
        field.section = 'default'
      }
    })
    
    isDirty.value = true
  }

  // ============================================
  // COLUMN OPERATIONS
  // ============================================

  const addColumn = (column: Partial<ColumnSchema>) => {
    const newColumn: ColumnSchema = {
      field: column.field || '',
      header: column.header || 'New Column',
      type: column.type || 'text',
      sortable: column.sortable ?? true,
      filterable: column.filterable ?? false,
      ...column
    }
    
    if (!schema.value.listView) {
      schema.value.listView = { columns: [] }
    }
    schema.value.listView.columns?.push(newColumn)
    isDirty.value = true
    
    return newColumn
  }

  const updateColumn = (index: number, updates: Partial<ColumnSchema>) => {
    if (schema.value.listView?.columns?.[index]) {
      schema.value.listView.columns[index] = {
        ...schema.value.listView.columns[index],
        ...updates
      }
      isDirty.value = true
    }
  }

  const removeColumn = (index: number) => {
    schema.value.listView?.columns?.splice(index, 1)
    isDirty.value = true
  }

  // ============================================
  // ACTION OPERATIONS
  // ============================================

  const addToolbarAction = (action: Partial<ActionSchema>) => {
    const newAction: ActionSchema = {
      name: action.name || `action_${uuid().slice(0, 8)}`,
      label: action.label || 'New Action',
      type: 'button',
      action: action.action || 'custom',
      ...action
    }
    
    schema.value.listView?.toolbarActions?.push(newAction)
    isDirty.value = true
    
    return newAction
  }

  const addRowAction = (action: Partial<ActionSchema>) => {
    const newAction: ActionSchema = {
      name: action.name || `action_${uuid().slice(0, 8)}`,
      label: action.label || 'New Action',
      type: 'button',
      action: action.action || 'custom',
      ...action
    }
    
    schema.value.listView?.rowActions?.push(newAction)
    isDirty.value = true
    
    return newAction
  }

  // ============================================
  // SCHEMA OPERATIONS
  // ============================================

  const loadSchema = (newSchema: DocumentSchema) => {
    schema.value = JSON.parse(JSON.stringify(newSchema))
    isDirty.value = false
  }

  const newSchema = () => {
    schema.value = {
      name: '',
      label: '',
      labelPlural: '',
      module: '',
      version: '1.0.0',
      api: {
        baseEndpoint: '',
        pagination: { defaultLimit: 20 }
      },
      listView: {
        columns: [],
        toolbarActions: [],
        rowActions: [],
        bulkActions: [],
        filters: [],
        searchable: true,
        selectable: false
      },
      formView: {
        sections: [{ name: 'default', label: 'General', columns: 2 }],
        fields: []
      },
      access: {
        permissions: {
          create: { roles: ['admin'] },
          read: { roles: ['admin'] },
          update: { roles: ['admin'] },
          delete: { roles: ['admin'] }
        }
      }
    }
    isDirty.value = false
  }

  const exportSchema = (): string => {
    // Update timestamp
    const exportSchema = {
      ...schema.value,
      updatedAt: new Date().toISOString()
    }
    return JSON.stringify(exportSchema, null, 2)
  }

  const importSchema = (json: string) => {
    try {
      const parsed = JSON.parse(json)
      loadSchema(parsed)
      return true
    } catch (error) {
      console.error('Failed to parse schema:', error)
      return false
    }
  }

  // ============================================
  // AUTO-GENERATE COLUMNS FROM FIELDS
  // ============================================

  const generateColumnsFromFields = () => {
    const columns: ColumnSchema[] = []
    
    schema.value.formView?.fields
      ?.filter(f => !f.hidden && f.type !== 'table' && f.type !== 'textarea' && f.type !== 'html')
      ?.slice(0, 8) // Limit to 8 columns
      ?.forEach(field => {
        columns.push({
          field: field.name,
          header: field.label,
          type: field.type,
          sortable: true,
          filterable: ['select', 'date', 'text'].includes(field.type)
        })
      })
    
    if (schema.value.listView) {
      schema.value.listView.columns = columns
    }
    
    isDirty.value = true
  }

  return {
    schema,
    isDirty,
    selectedFieldIndex,
    selectedColumnIndex,
    
    // Field operations
    addField,
    updateField,
    removeField,
    reorderFields,
    
    // Section operations
    addSection,
    updateSection,
    removeSection,
    
    // Column operations
    addColumn,
    updateColumn,
    removeColumn,
    
    // Action operations
    addToolbarAction,
    addRowAction,
    
    // Schema operations
    loadSchema,
    newSchema,
    exportSchema,
    importSchema,
    generateColumnsFromFields,
  }
})
```

### Schema Builder Component (Simplified)

```vue
<!-- src/views/admin/SchemaBuilder.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import FormField from '@/components/molecules/FormField.vue'
import { useSchemaBuilderStore } from '@/stores/schemaBuilderStore'
import { useNotification } from '@/composables/useNotification'

const store = useSchemaBuilderStore()
const notify = useNotification()

// Field type options
const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'currency', label: 'Currency' },
  { value: 'percent', label: 'Percent' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date & Time' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'switch', label: 'Switch' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'link', label: 'Link (Reference)' },
  { value: 'table', label: 'Child Table' },
  { value: 'tags', label: 'Tags' },
  { value: 'rating', label: 'Rating' },
  { value: 'color', label: 'Color' },
  { value: 'html', label: 'Rich Text' },
]

const widthOptions = [
  { value: 'full', label: 'Full Width' },
  { value: 'half', label: 'Half' },
  { value: 'third', label: 'One Third' },
  { value: 'quarter', label: 'Quarter' },
]

const moduleOptions = [
  { value: 'core', label: 'Core' },
  { value: 'sales', label: 'Sales' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'crm', label: 'CRM' },
]

// Dialogs
const showFieldDialog = ref(false)
const showColumnDialog = ref(false)
const showExportDialog = ref(false)
const editingFieldIndex = ref<number | null>(null)
const editingField = ref<any>({})

// Methods
const openAddField = () => {
  editingFieldIndex.value = null
  editingField.value = {
    name: '',
    label: '',
    type: 'text',
    section: store.schema.formView?.sections?.[0]?.name || 'default',
    width: 'half',
    required: false,
  }
  showFieldDialog.value = true
}

const openEditField = (index: number) => {
  editingFieldIndex.value = index
  editingField.value = { ...store.schema.formView?.fields?.[index] }
  showFieldDialog.value = true
}

const saveField = () => {
  if (editingFieldIndex.value === null) {
    store.addField(editingField.value)
  } else {
    store.updateField(editingFieldIndex.value, editingField.value)
  }
  showFieldDialog.value = false
}

const deleteField = (index: number) => {
  store.removeField(index)
}

const exportSchema = () => {
  showExportDialog.value = true
}

const downloadSchema = () => {
  const json = store.exportSchema()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${store.schema.name || 'schema'}.json`
  a.click()
  URL.revokeObjectURL(url)
  notify.success('Schema downloaded')
}

const copyToClipboard = async () => {
  const json = store.exportSchema()
  await navigator.clipboard.writeText(json)
  notify.success('Copied to clipboard')
}

// Auto-generate API endpoint
const updateApiEndpoint = () => {
  if (store.schema.name && store.schema.api) {
    store.schema.api.baseEndpoint = `/api/v1/${store.schema.name.toLowerCase().replace(/\s+/g, '-')}s`
  }
}
</script>

<template>
  <div class="schema-builder">
    <div class="schema-builder__header">
      <h1 class="page-title">Schema Builder</h1>
      <div class="flex gap-2">
        <Button
          label="New"
          icon="pi pi-file"
          severity="secondary"
          @click="store.newSchema()"
        />
        <Button
          label="Export"
          icon="pi pi-download"
          @click="exportSchema"
        />
      </div>
    </div>

    <TabView>
      <!-- Basic Info -->
      <TabPanel header="Basic Info">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Document Name" name="name" required>
            <InputText
              v-model="store.schema.name"
              placeholder="e.g., customer"
              @blur="updateApiEndpoint"
            />
          </FormField>

          <FormField label="Label (Singular)" name="label" required>
            <InputText
              v-model="store.schema.label"
              placeholder="e.g., Customer"
            />
          </FormField>

          <FormField label="Label (Plural)" name="labelPlural" required>
            <InputText
              v-model="store.schema.labelPlural"
              placeholder="e.g., Customers"
            />
          </FormField>

          <FormField label="Module" name="module" required>
            <Select
              v-model="store.schema.module"
              :options="moduleOptions"
              optionValue="value"
              optionLabel="label"
              placeholder="Select module"
            />
          </FormField>

          <FormField label="Icon" name="icon">
            <InputText
              v-model="store.schema.icon"
              placeholder="e.g., pi pi-users"
            />
          </FormField>

          <FormField label="API Endpoint" name="endpoint">
            <InputText
              v-model="store.schema.api!.baseEndpoint"
              placeholder="/api/v1/documents"
            />
          </FormField>

          <FormField label="Description" name="description" class="col-span-2">
            <Textarea
              v-model="store.schema.description"
              rows="3"
              class="w-full"
            />
          </FormField>
        </div>
      </TabPanel>

      <!-- Fields -->
      <TabPanel header="Form Fields">
        <div class="mb-4">
          <Button
            label="Add Field"
            icon="pi pi-plus"
            @click="openAddField"
          />
        </div>

        <DataTable
          :value="store.schema.formView?.fields || []"
          stripedRows
          dataKey="name"
        >
          <Column field="name" header="Name" />
          <Column field="label" header="Label" />
          <Column field="type" header="Type" />
          <Column field="section" header="Section" />
          <Column field="required" header="Required">
            <template #body="{ data }">
              <i :class="data.required ? 'pi pi-check text-green-500' : 'pi pi-times text-gray-400'" />
            </template>
          </Column>
          <Column header="Actions" style="width: 120px">
            <template #body="{ data, index }">
              <div class="flex gap-1">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  @click="openEditField(index)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  @click="deleteField(index)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </TabPanel>

      <!-- List Columns -->
      <TabPanel header="List Columns">
        <div class="mb-4 flex gap-2">
          <Button
            label="Add Column"
            icon="pi pi-plus"
            @click="store.addColumn({})"
          />
          <Button
            label="Generate from Fields"
            icon="pi pi-refresh"
            severity="secondary"
            @click="store.generateColumnsFromFields()"
          />
        </div>

        <DataTable
          :value="store.schema.listView?.columns || []"
          stripedRows
        >
          <Column field="field" header="Field" />
          <Column field="header" header="Header" />
          <Column field="type" header="Type" />
          <Column field="sortable" header="Sortable">
            <template #body="{ data }">
              <i :class="data.sortable ? 'pi pi-check text-green-500' : 'pi pi-times text-gray-400'" />
            </template>
          </Column>
          <Column field="filterable" header="Filterable">
            <template #body="{ data }">
              <i :class="data.filterable ? 'pi pi-check text-green-500' : 'pi pi-times text-gray-400'" />
            </template>
          </Column>
          <Column header="Actions" style="width: 80px">
            <template #body="{ index }">
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                @click="store.removeColumn(index)"
              />
            </template>
          </Column>
        </DataTable>
      </TabPanel>

      <!-- Permissions -->
      <TabPanel header="Permissions">
        <div class="grid grid-cols-2 gap-4">
          <Panel header="Create">
            <FormField label="Allowed Roles" name="createRoles">
              <InputText
                :modelValue="store.schema.access?.permissions?.create?.roles?.join(', ')"
                placeholder="admin, manager"
                @update:modelValue="v => store.schema.access!.permissions!.create = { roles: v.split(',').map(s => s.trim()) }"
              />
            </FormField>
          </Panel>

          <Panel header="Read">
            <FormField label="Allowed Roles" name="readRoles">
              <InputText
                :modelValue="store.schema.access?.permissions?.read?.roles?.join(', ')"
                placeholder="admin, manager, user"
                @update:modelValue="v => store.schema.access!.permissions!.read = { roles: v.split(',').map(s => s.trim()) }"
              />
            </FormField>
          </Panel>

          <Panel header="Update">
            <FormField label="Allowed Roles" name="updateRoles">
              <InputText
                :modelValue="store.schema.access?.permissions?.update?.roles?.join(', ')"
                placeholder="admin, manager"
                @update:modelValue="v => store.schema.access!.permissions!.update = { roles: v.split(',').map(s => s.trim()) }"
              />
            </FormField>
          </Panel>

          <Panel header="Delete">
            <FormField label="Allowed Roles" name="deleteRoles">
              <InputText
                :modelValue="store.schema.access?.permissions?.delete?.roles?.join(', ')"
                placeholder="admin"
                @update:modelValue="v => store.schema.access!.permissions!.delete = { roles: v.split(',').map(s => s.trim()) }"
              />
            </FormField>
          </Panel>
        </div>
      </TabPanel>

      <!-- Preview JSON -->
      <TabPanel header="JSON Preview">
        <pre class="bg-surface-100 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">{{ store.exportSchema() }}</pre>
      </TabPanel>
    </TabView>

    <!-- Field Dialog -->
    <Dialog
      v-model:visible="showFieldDialog"
      :header="editingFieldIndex === null ? 'Add Field' : 'Edit Field'"
      modal
      :style="{ width: '600px' }"
    >
      <div class="grid grid-cols-2 gap-4">
        <FormField label="Field Name" name="fieldName" required>
          <InputText
            v-model="editingField.name"
            placeholder="field_name"
          />
        </FormField>

        <FormField label="Label" name="fieldLabel" required>
          <InputText
            v-model="editingField.label"
            placeholder="Field Label"
          />
        </FormField>

        <FormField label="Type" name="fieldType" required>
          <Select
            v-model="editingField.type"
            :options="fieldTypes"
            optionValue="value"
            optionLabel="label"
          />
        </FormField>

        <FormField label="Section" name="fieldSection">
          <Select
            v-model="editingField.section"
            :options="store.schema.formView?.sections?.map(s => ({ value: s.name, label: s.label })) || []"
            optionValue="value"
            optionLabel="label"
          />
        </FormField>

        <FormField label="Width" name="fieldWidth">
          <Select
            v-model="editingField.width"
            :options="widthOptions"
            optionValue="value"
            optionLabel="label"
          />
        </FormField>

        <FormField label="Placeholder" name="placeholder">
          <InputText v-model="editingField.placeholder" />
        </FormField>

        <div class="col-span-2 flex gap-4">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="editingField.required" />
            Required
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="editingField.readonly" />
            Read-only
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="editingField.hidden" />
            Hidden
          </label>
        </div>

        <FormField label="Description" name="description" class="col-span-2">
          <Textarea
            v-model="editingField.description"
            rows="2"
            class="w-full"
          />
        </FormField>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          @click="showFieldDialog = false"
        />
        <Button
          label="Save"
          @click="saveField"
        />
      </template>
    </Dialog>

    <!-- Export Dialog -->
    <Dialog
      v-model:visible="showExportDialog"
      header="Export Schema"
      modal
      :style="{ width: '500px' }"
    >
      <p class="mb-4">Export your schema as JSON:</p>
      <div class="flex gap-2">
        <Button
          label="Download JSON"
          icon="pi pi-download"
          @click="downloadSchema"
        />
        <Button
          label="Copy to Clipboard"
          icon="pi pi-copy"
          severity="secondary"
          @click="copyToClipboard"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.schema-builder {
  padding: 1.5rem;
}

.schema-builder__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
</style>
```

---

## Dynamic Route Generation

Automatically generate routes from schemas:

```typescript
// src/router/schemaRoutes.ts
import type { RouteRecordRaw } from 'vue-router'
import type { DocumentSchema } from '@/types/schema'
import { schemaService } from '@/services/schemaService'

// Dynamic import for document page
const DocumentPage = () => import('@/components/renderers/DocumentPage.vue')
const DocumentDetail = () => import('@/views/documents/DocumentDetail.vue')

export async function generateSchemaRoutes(): Promise<RouteRecordRaw[]> {
  const schemas = await schemaService.getAllDocumentSchemas()
  const routes: RouteRecordRaw[] = []

  for (const schema of schemas) {
    // Generate URL slug from name
    const slug = schema.name.toLowerCase().replace(/_/g, '-')
    
    // List route
    routes.push({
      path: `/${slug}`,
      name: `${schema.name}-list`,
      component: DocumentPage,
      props: { docType: schema.name },
      meta: {
        title: schema.labelPlural,
        icon: schema.icon,
        module: schema.module,
        permissions: ['read'],
      },
    })

    // Detail/Edit route
    routes.push({
      path: `/${slug}/:id`,
      name: `${schema.name}-detail`,
      component: DocumentDetail,
      props: route => ({
        docType: schema.name,
        id: route.params.id,
      }),
      meta: {
        title: schema.label,
        module: schema.module,
        permissions: ['read'],
      },
    })

    // Create route (optional - can use drawer instead)
    routes.push({
      path: `/${slug}/new`,
      name: `${schema.name}-create`,
      component: DocumentDetail,
      props: {
        docType: schema.name,
        mode: 'create',
      },
      meta: {
        title: `New ${schema.label}`,
        module: schema.module,
        permissions: ['create'],
      },
    })
  }

  return routes
}

// Use in router/index.ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { generateSchemaRoutes } from './schemaRoutes'

const staticRoutes = [
  {
    path: '/',
    component: () => import('@/components/templates/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      // Dynamic routes will be added here
    ],
  },
  {
    path: '/auth',
    component: () => import('@/components/templates/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('@/views/auth/Login.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
})

// Add schema routes after app initialization
export async function initializeRoutes() {
  const schemaRoutes = await generateSchemaRoutes()
  
  // Add to main layout's children
  schemaRoutes.forEach(route => {
    router.addRoute('main-layout', route) // Assuming main layout has this name
  })
}

export default router
```

---

## Multi-Tenant Theming

### Theme Configuration Store

```typescript
// src/stores/themeStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { updatePreset, updateSurfacePalette } from '@primevue/themes'

interface TenantTheme {
  primaryColor: string
  primaryPalette: Record<string, string>
  surfacePalette?: Record<string, string>
  logo?: string
  logoLight?: string
  favicon?: string
  fontFamily?: string
}

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  const tenantTheme = ref<TenantTheme | null>(null)

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    localStorage.setItem('darkMode', String(isDark.value))
  }

  // Initialize from localStorage
  const initTheme = () => {
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  }

  // Apply tenant theme
  const applyTenantTheme = (theme: TenantTheme) => {
    tenantTheme.value = theme

    // Update PrimeVue preset with tenant colors
    updatePreset({
      semantic: {
        primary: theme.primaryPalette,
      },
    })

    // Update surface palette if provided
    if (theme.surfacePalette) {
      updateSurfacePalette(theme.surfacePalette)
    }

    // Apply custom font
    if (theme.fontFamily) {
      document.documentElement.style.setProperty('--font-family', theme.fontFamily)
    }

    // Update favicon
    if (theme.favicon) {
      const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
      if (link) {
        link.href = theme.favicon
      }
    }
  }

  // Reset to default theme
  const resetTheme = () => {
    tenantTheme.value = null
    // Re-apply default preset
    // This would require storing the original preset
  }

  // CSS variables for custom styling
  const cssVariables = computed(() => {
    if (!tenantTheme.value) return {}
    
    return {
      '--tenant-primary': tenantTheme.value.primaryColor,
      '--tenant-logo': tenantTheme.value.logo ? `url(${tenantTheme.value.logo})` : 'none',
    }
  })

  return {
    isDark,
    tenantTheme,
    toggleDarkMode,
    initTheme,
    applyTenantTheme,
    resetTheme,
    cssVariables,
  }
})
```

### Tenant Theme Loader

```typescript
// src/services/themeService.ts
import { useThemeStore } from '@/stores/themeStore'
import api from './api'

interface TenantBranding {
  primaryColor: string
  secondaryColor?: string
  logo: string
  logoLight: string
  favicon: string
  fontFamily?: string
}

// Color palette generator
function generatePalette(baseColor: string): Record<string, string> {
  // Simple palette generation - in production use a library like chroma.js
  const adjustLightness = (color: string, amount: number): string => {
    // This is simplified - use proper color manipulation
    return color
  }

  return {
    50: adjustLightness(baseColor, 95),
    100: adjustLightness(baseColor, 90),
    200: adjustLightness(baseColor, 80),
    300: adjustLightness(baseColor, 70),
    400: adjustLightness(baseColor, 60),
    500: baseColor,
    600: adjustLightness(baseColor, 40),
    700: adjustLightness(baseColor, 30),
    800: adjustLightness(baseColor, 20),
    900: adjustLightness(baseColor, 10),
    950: adjustLightness(baseColor, 5),
  }
}

export async function loadTenantTheme(tenantId: string) {
  const themeStore = useThemeStore()

  try {
    const response = await api.get<TenantBranding>(`/api/v1/tenants/${tenantId}/branding`)
    const branding = response.data

    themeStore.applyTenantTheme({
      primaryColor: branding.primaryColor,
      primaryPalette: generatePalette(branding.primaryColor),
      logo: branding.logo,
      logoLight: branding.logoLight,
      favicon: branding.favicon,
      fontFamily: branding.fontFamily,
    })
  } catch (error) {
    console.error('Failed to load tenant theme:', error)
    // Use default theme
  }
}
```

---

## Best Practices

### 1. Schema Design Principles

```
DO:
✓ Use consistent naming conventions (snake_case for fields)
✓ Group related fields into sections
✓ Define explicit field types
✓ Set appropriate defaults
✓ Include validation rules
✓ Document fields with descriptions
✓ Plan access control from the start

DON'T:
✗ Over-complicate with too many field types
✗ Create deeply nested structures
✗ Forget about mobile responsiveness
✗ Skip validation
✗ Hardcode values that should be configurable
```

### 2. Component Organization

```typescript
// Good: Schema-driven, reusable
<DocumentPage docType="customer" />

// Bad: Hardcoded, single-use
<CustomerListPage />
```

### 3. Access Control Strategy

```typescript
// Always check at multiple levels:

// 1. Route level (guards)
router.beforeEach((to, from) => {
  const { can } = useAccess()
  if (to.meta.permissions && !can(to.meta.permissions, to.meta.resource)) {
    return { name: 'forbidden' }
  }
})

// 2. Component level
<Button v-if="can('create', 'customer')" />

// 3. Field level
const visibleFields = filterFields(fields, docType, 'read')

// 4. API level (backend)
// Always validate on server - never trust client
```

### 4. Performance Optimization

```typescript
// Cache schemas
const schemaCache = new Map<string, DocumentSchema>()

// Lazy load schemas
const schema = await schemaService.getDocumentSchema(docType)

// Debounce search
const debouncedSearch = useDebounceFn((query) => {
  emit('search', query)
}, 300)

// Virtual scrolling for large lists
<DataTable :virtualScrollerOptions="{ itemSize: 50 }" />
```

### 5. Error Handling

```typescript
// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  notify.error('An error occurred')
}

// API error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/auth/login')
    }
    return Promise.reject(error)
  }
)
```

### 6. Testing Schema-Driven Components

```typescript
// tests/components/DataTableCrud.spec.ts
import { mount } from '@vue/test-utils'
import DataTableCrud from '@/components/organisms/DataTableCrud.vue'

const mockSchema = {
  columns: [
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'status', header: 'Status', type: 'select' },
  ],
}

describe('DataTableCrud', () => {
  it('renders columns from schema', () => {
    const wrapper = mount(DataTableCrud, {
      props: {
        items: [{ id: 1, name: 'Test', status: 'active' }],
        columns: mockSchema.columns,
        docType: 'test',
      },
    })

    expect(wrapper.findAll('th').length).toBeGreaterThan(0)
  })

  it('filters actions based on permissions', () => {
    // Mock useAccess to return specific permissions
    // Test that only allowed actions are rendered
  })
})
```


## Application Shell

### App.vue

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <Toast position="top-right" />
  <ConfirmDialog />
  <RouterView />
</template>

<style>
/* Global styles that can't go in main.css */
</style>
```

---

## Layout Components

### MainLayout

```vue
<!-- src/components/templates/MainLayout.vue -->
<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/organisms/AppSidebar.vue'
import AppTopbar from '@/components/organisms/AppTopbar.vue'
import { useUiStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'

const uiStore = useUiStore()
const authStore = useAuthStore()

// Provide layout context to children
provide('layout', {
  isSidebarCollapsed: computed(() => uiStore.sidebarCollapsed),
  toggleSidebar: () => uiStore.toggleSidebar(),
})

const mainContentStyle = computed(() => ({
  marginLeft: uiStore.sidebarCollapsed 
    ? 'var(--app-sidebar-collapsed-width)' 
    : 'var(--app-sidebar-width)',
  transition: 'margin-left 0.3s ease',
}))
</script>

<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <AppSidebar 
      :collapsed="uiStore.sidebarCollapsed"
      @toggle="uiStore.toggleSidebar()"
    />
    
    <!-- Main Content Area -->
    <div class="main-layout__content" :style="mainContentStyle">
      <!-- Topbar -->
      <AppTopbar />
      
      <!-- Page Content -->
      <main class="main-layout__main">
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: var(--p-surface-50);
}

.dark .main-layout {
  background: var(--p-surface-950);
}

.main-layout__content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout__main {
  flex: 1;
  padding: 1.5rem;
  margin-top: var(--app-topbar-height);
  overflow-x: hidden;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### AppTopbar

```vue
<!-- src/components/organisms/AppTopbar.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import OverlayBadge from 'primevue/overlaybadge'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useTenantStore } from '@/stores/tenantStore'
import { useUiStore } from '@/stores/uiStore'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const tenantStore = useTenantStore()
const uiStore = useUiStore()

const userMenu = ref()
const notificationMenu = ref()

const user = computed(() => authStore.user)

const userMenuItems = computed(() => [
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => router.push('/settings/profile'),
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => router.push('/settings'),
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => handleLogout(),
  },
])

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}

const toggleUserMenu = (event: Event) => {
  userMenu.value?.toggle(event)
}

const toggleNotifications = (event: Event) => {
  notificationMenu.value?.toggle(event)
}

const userInitials = computed(() => {
  if (!user.value) return '?'
  return `${user.value.firstName?.[0] || ''}${user.value.lastName?.[0] || ''}`.toUpperCase()
})
</script>

<template>
  <header class="app-topbar">
    <div class="app-topbar__start">
      <!-- Sidebar Toggle -->
      <Button
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        @click="uiStore.toggleSidebar()"
      />
      
      <!-- Breadcrumb or Search -->
      <IconField class="app-topbar__search">
        <InputIcon class="pi pi-search" />
        <InputText 
          placeholder="Search..." 
          class="w-64"
        />
      </IconField>
    </div>
    
    <div class="app-topbar__end">
      <!-- Tenant/Company Name -->
      <span class="text-sm text-surface-500 mr-4">
        {{ tenantStore.tenant?.name }}
      </span>
      
      <!-- Dark Mode Toggle -->
      <Button
        :icon="themeStore.isDark ? 'pi pi-sun' : 'pi pi-moon'"
        severity="secondary"
        text
        rounded
        @click="themeStore.toggleDarkMode()"
        v-tooltip.bottom="themeStore.isDark ? 'Light Mode' : 'Dark Mode'"
      />
      
      <!-- Notifications -->
      <OverlayBadge value="3" severity="danger">
        <Button
          icon="pi pi-bell"
          severity="secondary"
          text
          rounded
          @click="toggleNotifications"
        />
      </OverlayBadge>
      <Menu ref="notificationMenu" popup>
        <template #start>
          <div class="px-4 py-3 border-b border-surface-200">
            <span class="font-semibold">Notifications</span>
          </div>
        </template>
        <template #end>
          <div class="px-4 py-2 border-t border-surface-200">
            <Button label="View All" text size="small" class="w-full" />
          </div>
        </template>
      </Menu>
      
      <!-- User Menu -->
      <div class="app-topbar__user" @click="toggleUserMenu">
        <Avatar
          v-if="user?.avatar"
          :image="user.avatar"
          shape="circle"
          size="normal"
        />
        <Avatar
          v-else
          :label="userInitials"
          shape="circle"
          size="normal"
          class="bg-primary text-white"
        />
        <div class="app-topbar__user-info">
          <span class="app-topbar__user-name">
            {{ user?.firstName }} {{ user?.lastName }}
          </span>
          <span class="app-topbar__user-role">
            {{ user?.roles?.[0] }}
          </span>
        </div>
        <i class="pi pi-chevron-down text-xs" />
      </div>
      <Menu ref="userMenu" :model="userMenuItems" popup />
    </div>
  </header>
</template>

<style scoped>
.app-topbar {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--app-sidebar-width);
  height: var(--app-topbar-height);
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 100;
  transition: left 0.3s ease;
}

.dark .app-topbar {
  background: var(--p-surface-900);
  border-color: var(--p-surface-700);
}

/* When sidebar is collapsed */
:global(.sidebar-collapsed) .app-topbar {
  left: var(--app-sidebar-collapsed-width);
}

.app-topbar__start {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-topbar__end {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-topbar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 0.5rem;
}

.app-topbar__user:hover {
  background: var(--p-surface-100);
}

.dark .app-topbar__user:hover {
  background: var(--p-surface-800);
}

.app-topbar__user-info {
  display: flex;
  flex-direction: column;
}

.app-topbar__user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-text-color);
}

.app-topbar__user-role {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .app-topbar__search {
    display: none;
  }
  
  .app-topbar__user-info {
    display: none;
  }
}
</style>
```

### AppSidebar

```vue
<!-- src/components/organisms/AppSidebar.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Ripple from 'primevue/ripple'
import { useTenantStore } from '@/stores/tenantStore'
import { useAccessStore } from '@/stores/accessStore'
import type { Module } from '@/types/access'

interface Props {
  collapsed: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggle: []
}>()

const route = useRoute()
const router = useRouter()
const tenantStore = useTenantStore()
const accessStore = useAccessStore()

// Expanded modules
const expandedModules = ref<Set<string>>(new Set())

// Navigation structure based on modules
const navigation = computed(() => {
  const modules = tenantStore.enabledModules
  
  return modules.map(module => ({
    id: module.id,
    label: module.name,
    icon: module.icon,
    expanded: expandedModules.value.has(module.id),
    items: getModuleItems(module),
  }))
})

const getModuleItems = (module: Module) => {
  // Get documents for this module that user has access to
  return module.documents
    .filter(docType => accessStore.can('list', docType))
    .map(docType => {
      const slug = docType.toLowerCase().replace(/_/g, '-')
      return {
        label: formatLabel(docType),
        route: `/${slug}`,
        icon: 'pi pi-circle',
      }
    })
}

const formatLabel = (name: string): string => {
  return name
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/')
}

const isModuleActive = (moduleId: string): boolean => {
  const module = navigation.value.find(m => m.id === moduleId)
  if (!module) return false
  return module.items.some(item => isActive(item.route))
}

const toggleModule = (moduleId: string) => {
  if (expandedModules.value.has(moduleId)) {
    expandedModules.value.delete(moduleId)
  } else {
    expandedModules.value.add(moduleId)
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

// Auto-expand active module
watch(() => route.path, () => {
  for (const module of navigation.value) {
    if (isModuleActive(module.id)) {
      expandedModules.value.add(module.id)
    }
  }
}, { immediate: true })

// Static items
const staticItems = [
  { label: 'Dashboard', icon: 'pi pi-home', route: '/' },
]

const bottomItems = [
  { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
  { label: 'Help', icon: 'pi pi-question-circle', route: '/help' },
]
</script>

<template>
  <aside :class="['app-sidebar', { 'app-sidebar--collapsed': collapsed }]">
    <!-- Logo -->
    <div class="app-sidebar__header">
      <img
        v-if="tenantStore.tenant?.logo"
        :src="tenantStore.tenant.logo"
        alt="Logo"
        class="app-sidebar__logo"
      />
      <span v-if="!collapsed" class="app-sidebar__brand">
        {{ tenantStore.tenant?.name || 'Dhool ERP' }}
      </span>
    </div>
    
    <!-- Navigation -->
    <nav class="app-sidebar__nav">
      <!-- Static Items -->
      <div class="app-sidebar__section">
        <div
          v-for="item in staticItems"
          :key="item.route"
          v-ripple
          :class="['app-sidebar__item', { 'app-sidebar__item--active': isActive(item.route) }]"
          @click="navigateTo(item.route)"
        >
          <i :class="[item.icon, 'app-sidebar__item-icon']" />
          <span v-if="!collapsed" class="app-sidebar__item-label">
            {{ item.label }}
          </span>
        </div>
      </div>
      
      <!-- Module Navigation -->
      <div class="app-sidebar__section">
        <div
          v-for="module in navigation"
          :key="module.id"
          class="app-sidebar__module"
        >
          <!-- Module Header -->
          <div
            v-ripple
            :class="[
              'app-sidebar__module-header',
              { 'app-sidebar__module-header--active': isModuleActive(module.id) }
            ]"
            @click="collapsed ? null : toggleModule(module.id)"
          >
            <i :class="[module.icon, 'app-sidebar__item-icon']" />
            <span v-if="!collapsed" class="app-sidebar__item-label flex-1">
              {{ module.label }}
            </span>
            <i
              v-if="!collapsed && module.items.length > 0"
              :class="[
                'pi',
                module.expanded ? 'pi-chevron-down' : 'pi-chevron-right',
                'text-xs transition-transform'
              ]"
            />
          </div>
          
          <!-- Module Items -->
          <Transition name="slide-down">
            <div
              v-if="!collapsed && module.expanded"
              class="app-sidebar__module-items"
            >
              <div
                v-for="item in module.items"
                :key="item.route"
                v-ripple
                :class="['app-sidebar__subitem', { 'app-sidebar__subitem--active': isActive(item.route) }]"
                @click="navigateTo(item.route)"
              >
                <span class="app-sidebar__subitem-label">
                  {{ item.label }}
                </span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      
      <!-- Spacer -->
      <div class="flex-1" />
      
      <!-- Bottom Items -->
      <div class="app-sidebar__section app-sidebar__section--bottom">
        <div
          v-for="item in bottomItems"
          :key="item.route"
          v-ripple
          :class="['app-sidebar__item', { 'app-sidebar__item--active': isActive(item.route) }]"
          @click="navigateTo(item.route)"
        >
          <i :class="[item.icon, 'app-sidebar__item-icon']" />
          <span v-if="!collapsed" class="app-sidebar__item-label">
            {{ item.label }}
          </span>
        </div>
      </div>
    </nav>
    
    <!-- Collapse Toggle -->
    <div class="app-sidebar__footer">
      <Button
        :icon="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
        severity="secondary"
        text
        rounded
        @click="emit('toggle')"
      />
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--app-sidebar-width);
  background: var(--p-surface-0);
  border-right: 1px solid var(--p-surface-200);
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: width 0.3s ease;
}

.dark .app-sidebar {
  background: var(--p-surface-900);
  border-color: var(--p-surface-700);
}

.app-sidebar--collapsed {
  width: var(--app-sidebar-collapsed-width);
}

.app-sidebar__header {
  height: var(--app-topbar-height);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  border-bottom: 1px solid var(--p-surface-200);
}

.dark .app-sidebar__header {
  border-color: var(--p-surface-700);
}

.app-sidebar__logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.app-sidebar__brand {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
  white-space: nowrap;
  overflow: hidden;
}

.app-sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.app-sidebar__section {
  padding: 0 0.75rem;
  margin-bottom: 1rem;
}

.app-sidebar__section--bottom {
  margin-top: auto;
  margin-bottom: 0;
  border-top: 1px solid var(--p-surface-200);
  padding-top: 1rem;
}

.dark .app-sidebar__section--bottom {
  border-color: var(--p-surface-700);
}

.app-sidebar__item,
.app-sidebar__module-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: var(--p-text-color);
  transition: background 0.2s, color 0.2s;
}

.app-sidebar__item:hover,
.app-sidebar__module-header:hover {
  background: var(--p-surface-100);
}

.dark .app-sidebar__item:hover,
.dark .app-sidebar__module-header:hover {
  background: var(--p-surface-800);
}

.app-sidebar__item--active,
.app-sidebar__module-header--active {
  background: var(--p-primary-50);
  color: var(--p-primary-color);
}

.dark .app-sidebar__item--active,
.dark .app-sidebar__module-header--active {
  background: var(--p-primary-900);
}

.app-sidebar__item-icon {
  font-size: 1.125rem;
  width: 1.25rem;
  text-align: center;
  flex-shrink: 0;
}

.app-sidebar__item-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-sidebar__module-items {
  margin-top: 0.25rem;
  margin-left: 2rem;
  border-left: 1px solid var(--p-surface-200);
}

.dark .app-sidebar__module-items {
  border-color: var(--p-surface-700);
}

.app-sidebar__subitem {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-left: -1px;
  border-left: 2px solid transparent;
  cursor: pointer;
  color: var(--p-text-muted-color);
  transition: all 0.2s;
}

.app-sidebar__subitem:hover {
  color: var(--p-text-color);
  background: var(--p-surface-50);
}

.dark .app-sidebar__subitem:hover {
  background: var(--p-surface-800);
}

.app-sidebar__subitem--active {
  color: var(--p-primary-color);
  border-color: var(--p-primary-color);
  background: var(--p-primary-50);
}

.dark .app-sidebar__subitem--active {
  background: var(--p-primary-900);
}

.app-sidebar__subitem-label {
  font-size: 0.8125rem;
  white-space: nowrap;
}

.app-sidebar__footer {
  display: flex;
  justify-content: center;
  padding: 0.75rem;
  border-top: 1px solid var(--p-surface-200);
}

.dark .app-sidebar__footer {
  border-color: var(--p-surface-700);
}

/* Collapsed state */
.app-sidebar--collapsed .app-sidebar__header {
  justify-content: center;
}

.app-sidebar--collapsed .app-sidebar__item,
.app-sidebar--collapsed .app-sidebar__module-header {
  justify-content: center;
  padding: 0.75rem;
}

.app-sidebar--collapsed .app-sidebar__item-icon {
  font-size: 1.25rem;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
```

---

## Stores

### Auth Store

```typescript
// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/access'
import api from '@/services/api'

interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const userRoles = computed(() => user.value?.roles || [])
  const userPermissions = computed(() => user.value?.permissions || [])

  // Actions
  const login = async (credentials: LoginCredentials): Promise<void> => {
    isLoading.value = true
    try {
      const response = await api.post<AuthResponse>('/api/v1/auth/login', credentials)
      const { user: userData, accessToken: access, refreshToken: refresh } = response.data

      user.value = userData
      accessToken.value = access
      refreshToken.value = refresh

      // Store tokens
      localStorage.setItem('accessToken', access)
      if (credentials.remember) {
        localStorage.setItem('refreshToken', refresh)
      } else {
        sessionStorage.setItem('refreshToken', refresh)
      }

      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await api.post('/api/v1/auth/logout')
    } catch {
      // Ignore logout errors
    }

    // Clear state
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    // Clear storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('refreshToken')

    // Clear auth header
    delete api.defaults.headers.common['Authorization']
  }

  const refreshSession = async (): Promise<boolean> => {
    const refresh = refreshToken.value || 
      localStorage.getItem('refreshToken') || 
      sessionStorage.getItem('refreshToken')

    if (!refresh) return false

    try {
      const response = await api.post<AuthResponse>('/api/v1/auth/refresh', {
        refreshToken: refresh,
      })

      accessToken.value = response.data.accessToken
      refreshToken.value = response.data.refreshToken
      user.value = response.data.user

      localStorage.setItem('accessToken', response.data.accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

      return true
    } catch {
      await logout()
      return false
    }
  }

  const loadUser = async (): Promise<void> => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    accessToken.value = token
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    try {
      const response = await api.get<User>('/api/v1/auth/me')
      user.value = response.data
    } catch {
      await logout()
    }
  }

  const hasRole = (role: string): boolean => {
    return userRoles.value.includes(role)
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => userRoles.value.includes(role))
  }

  const hasPermission = (permission: string): boolean => {
    return userPermissions.value.includes(permission)
  }

  return {
    // State
    user,
    accessToken,
    isLoading,

    // Computed
    isAuthenticated,
    userRoles,
    userPermissions,

    // Actions
    login,
    logout,
    refreshSession,
    loadUser,
    hasRole,
    hasAnyRole,
    hasPermission,
  }
})
```

### Tenant Store

```typescript
// src/stores/tenantStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Subscription, Module } from '@/types/access'
import api from '@/services/api'

interface Tenant {
  id: string
  name: string
  slug: string
  logo?: string
  logoLight?: string
  status: 'active' | 'suspended' | 'cancelled'
}

export const useTenantStore = defineStore('tenant', () => {
  // State
  const tenant = ref<Tenant | null>(null)
  const subscription = ref<Subscription | null>(null)
  const modules = ref<Module[]>([])
  const isLoading = ref(false)

  // Computed
  const enabledModules = computed(() => {
    if (!subscription.value) return []
    return modules.value
      .filter(m => subscription.value!.modules.includes(m.id))
      .sort((a, b) => a.order - b.order)
  })

  const currentPlan = computed(() => subscription.value?.plan)

  const hasModule = (moduleId: string): boolean => {
    return subscription.value?.modules.includes(moduleId) ?? false
  }

  const hasFeature = (featureId: string): boolean => {
    return subscription.value?.features.includes(featureId) ?? false
  }

  const isLimitReached = (limitKey: string): boolean => {
    if (!subscription.value) return true
    const limit = subscription.value.limits[limitKey]
    const usage = subscription.value.usage[limitKey]
    if (limit === null) return false // Unlimited
    return (usage || 0) >= limit
  }

  // Actions
  const loadTenant = async (): Promise<void> => {
    isLoading.value = true
    try {
      const [tenantRes, subscriptionRes, modulesRes] = await Promise.all([
        api.get<Tenant>('/api/v1/tenant'),
        api.get<Subscription>('/api/v1/tenant/subscription'),
        api.get<{ modules: Module[] }>('/api/v1/modules'),
      ])

      tenant.value = tenantRes.data
      subscription.value = subscriptionRes.data
      modules.value = modulesRes.data.modules
    } finally {
      isLoading.value = false
    }
  }

  const refreshSubscription = async (): Promise<void> => {
    const response = await api.get<Subscription>('/api/v1/tenant/subscription')
    subscription.value = response.data
  }

  return {
    // State
    tenant,
    subscription,
    modules,
    isLoading,

    // Computed
    enabledModules,
    currentPlan,

    // Methods
    hasModule,
    hasFeature,
    isLimitReached,

    // Actions
    loadTenant,
    refreshSubscription,
  }
})
```

### UI Store

```typescript
// src/stores/uiStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // Sidebar
  const sidebarCollapsed = ref(false)
  
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed.value))
  }

  const initSidebar = () => {
    const stored = localStorage.getItem('sidebarCollapsed')
    if (stored === 'true') {
      sidebarCollapsed.value = true
    }
  }

  // Loading overlay
  const isGlobalLoading = ref(false)
  const loadingMessage = ref('')

  const showLoading = (message = 'Loading...') => {
    loadingMessage.value = message
    isGlobalLoading.value = true
  }

  const hideLoading = () => {
    isGlobalLoading.value = false
    loadingMessage.value = ''
  }

  // Page title
  const pageTitle = ref('')
  
  const setPageTitle = (title: string) => {
    pageTitle.value = title
    document.title = title ? `${title} | Dhool ERP` : 'Dhool ERP'
  }

  return {
    // Sidebar
    sidebarCollapsed,
    toggleSidebar,
    initSidebar,

    // Loading
    isGlobalLoading,
    loadingMessage,
    showLoading,
    hideLoading,

    // Page
    pageTitle,
    setPageTitle,
  }
})
```

---

## API Service

```typescript
// src/services/api.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

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
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Import dynamically to avoid circular dependency
        const { useAuthStore } = await import('@/stores/authStore')
        const authStore = useAuthStore()
        
        const success = await authStore.refreshSession()
        if (success) {
          originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`
          return api(originalRequest)
        }
      } catch {
        // Refresh failed, redirect to login
        window.location.href = '/auth/login'
      }
    }

    // Handle 403 - forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data)
    }

    // Handle 404 - not found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config.url)
    }

    // Handle 422 - validation error
    if (error.response?.status === 422) {
      // Return validation errors for form handling
      return Promise.reject({
        ...error,
        validationErrors: error.response.data.errors,
      })
    }

    // Handle 500+ - server error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  }
)

export default api
```

---

## Router Guards

```typescript
// src/router/guards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAccessStore } from '@/stores/accessStore'
import { useTenantStore } from '@/stores/tenantStore'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  // Public routes
  if (to.meta.public) {
    return next()
  }

  // Check authentication
  if (!authStore.isAuthenticated) {
    // Try to restore session
    await authStore.loadUser()
    
    if (!authStore.isAuthenticated) {
      return next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
    }
  }

  next()
}

export async function accessGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const accessStore = useAccessStore()
  const tenantStore = useTenantStore()

  // Initialize stores if needed
  if (!accessStore.isInitialized) {
    await accessStore.initialize()
  }

  if (!tenantStore.tenant) {
    await tenantStore.loadTenant()
  }

  // Check module access
  if (to.meta.module) {
    if (!tenantStore.hasModule(to.meta.module as string)) {
      return next({ name: 'module-not-available' })
    }
  }

  // Check permissions
  if (to.meta.permissions) {
    const permissions = to.meta.permissions as string[]
    const resource = (to.meta.resource as string) || to.params.docType as string

    const hasAccess = permissions.some(perm => 
      accessStore.can(perm, resource)
    )

    if (!hasAccess) {
      return next({ name: 'forbidden' })
    }
  }

  next()
}

export function titleGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | Dhool ERP`
  } else {
    document.title = 'Dhool ERP'
  }
  next()
}
```

### Router Index

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, accessGuard, titleGuard } from './guards'

const routes = [
  // Auth routes
  {
    path: '/auth',
    component: () => import('@/components/templates/AuthLayout.vue'),
    meta: { public: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { title: 'Login' },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPassword.vue'),
        meta: { title: 'Forgot Password' },
      },
    ],
  },

  // Main app routes
  {
    path: '/',
    name: 'main-layout',
    component: () => import('@/components/templates/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: 'Dashboard' },
      },

      // Settings
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/settings/Settings.vue'),
        meta: { title: 'Settings' },
        children: [
          {
            path: 'profile',
            name: 'settings-profile',
            component: () => import('@/views/settings/Profile.vue'),
            meta: { title: 'Profile Settings' },
          },
          {
            path: 'company',
            name: 'settings-company',
            component: () => import('@/views/settings/Company.vue'),
            meta: { title: 'Company Settings' },
          },
        ],
      },

      // Admin routes
      {
        path: 'admin',
        name: 'admin',
        meta: { permissions: ['admin'] },
        children: [
          {
            path: 'schema-builder',
            name: 'schema-builder',
            component: () => import('@/views/admin/SchemaBuilder.vue'),
            meta: { title: 'Schema Builder' },
          },
          {
            path: 'users',
            name: 'admin-users',
            component: () => import('@/views/admin/Users.vue'),
            meta: { title: 'User Management' },
          },
          {
            path: 'roles',
            name: 'admin-roles',
            component: () => import('@/views/admin/Roles.vue'),
            meta: { title: 'Role Management' },
          },
        ],
      },

      // Dynamic document routes will be added here
    ],
  },

  // Error pages
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@/views/errors/Forbidden.vue'),
    meta: { public: true, title: 'Access Denied' },
  },
  {
    path: '/module-not-available',
    name: 'module-not-available',
    component: () => import('@/views/errors/ModuleNotAvailable.vue'),
    meta: { public: true, title: 'Module Not Available' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFound.vue'),
    meta: { public: true, title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Apply guards
router.beforeEach(authGuard)
router.beforeEach(accessGuard)
router.beforeEach(titleGuard)

export default router
```

---

## App Initialization

```typescript
// src/init.ts
import { useAuthStore } from '@/stores/authStore'
import { useTenantStore } from '@/stores/tenantStore'
import { useAccessStore } from '@/stores/accessStore'
import { useThemeStore } from '@/stores/themeStore'
import { useUiStore } from '@/stores/uiStore'
import { loadTenantTheme } from '@/services/themeService'
import { generateSchemaRoutes } from '@/router/schemaRoutes'
import router from '@/router'

export async function initializeApp(): Promise<boolean> {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  const accessStore = useAccessStore()
  const themeStore = useThemeStore()
  const uiStore = useUiStore()

  // Initialize theme from localStorage
  themeStore.initTheme()
  uiStore.initSidebar()

  // Check if user is logged in
  const token = localStorage.getItem('accessToken')
  if (!token) {
    return false
  }

  try {
    // Load user
    await authStore.loadUser()
    
    if (!authStore.isAuthenticated) {
      return false
    }

    // Load tenant & subscription
    await tenantStore.loadTenant()

    // Apply tenant theme
    if (tenantStore.tenant) {
      await loadTenantTheme(tenantStore.tenant.id)
    }

    // Load access policies
    await accessStore.initialize()

    // Generate dynamic routes from schemas
    const schemaRoutes = await generateSchemaRoutes()
    schemaRoutes.forEach(route => {
      router.addRoute('main-layout', route)
    })

    return true
  } catch (error) {
    console.error('Failed to initialize app:', error)
    await authStore.logout()
    return false
  }
}
```

### Updated main.ts

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

// Services
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'

// Directives
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import BadgeDirective from 'primevue/badgedirective'
import FocusTrap from 'primevue/focustrap'

import App from './App.vue'
import router from './router'
import { initializeApp } from './init'

// Styles
import 'primeicons/primeicons.css'
import './assets/styles/main.css'

async function bootstrap() {
  const app = createApp(App)

  // Pinia
  const pinia = createPinia()
  app.use(pinia)

  // PrimeVue configuration (same as before)
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
        950: '{blue.950}',
      },
      colorScheme: {
        light: {
          primary: {
            color: '{primary.500}',
            contrastColor: '#ffffff',
            hoverColor: '{primary.600}',
            activeColor: '{primary.700}',
          },
        },
        dark: {
          primary: {
            color: '{primary.400}',
            contrastColor: '{surface.900}',
            hoverColor: '{primary.300}',
            activeColor: '{primary.200}',
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
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
    ripple: true,
    pt: {
      datatable: {
        root: { class: 'border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden' },
      },
    },
  })

  // Services & Directives
  app.use(ToastService)
  app.use(ConfirmationService)
  app.use(DialogService)
  app.directive('tooltip', Tooltip)
  app.directive('ripple', Ripple)
  app.directive('badge', BadgeDirective)
  app.directive('focustrap', FocusTrap)

  // Vue Query
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          retry: 1,
        },
      },
    },
  })

  // Router
  app.use(router)

  // Initialize app (load user, tenant, etc.)
  // This runs before showing the app
  await initializeApp()

  app.mount('#app')
}

bootstrap()
```

---

## Summary

This guide provides a complete architecture for a schema-driven ERP system with:

1. **Schema-Driven UI**: JSON schemas define documents, forms, lists, and dashboards
2. **Multi-Level Access Control**: Subscription → Module → Role → ABAC
3. **Reusable Components**: Molecules and organisms built on PrimeVue 4
4. **Dynamic Routing**: Routes generated from schemas
5. **Multi-Tenant Theming**: Per-tenant customization
6. **Type Safety**: Full TypeScript throughout

### Key Benefits

- **Rapid Development**: Define new document types in JSON
- **Consistency**: All pages share the same components
- **Flexibility**: Backend can modify UI without deployments
- **Maintainability**: Changes in one place affect all instances
- **Security**: Access control at every level

### Next Steps

1. Start with core schemas (User, Customer, Invoice)
2. Build out the Schema Builder UI for admin users
3. Add more field types as needed
4. Implement the Report schema type
5. Add workflow engine for document states
6. Build mobile-responsive variants
