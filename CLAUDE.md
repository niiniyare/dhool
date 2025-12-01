# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dhool is an ERP system built with Vue 3, TypeScript, and PrimeVue 4. It follows a schema-driven architecture where business documents and forms are defined through JSON schemas, enabling rapid development of CRUD interfaces with sophisticated access control.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server with hot reload
pnpm dev

# Build for production (runs type-check first)
pnpm build

# Type checking only
pnpm type-check

# Linting with auto-fix
pnpm lint

# Code formatting
pnpm format

# Unit tests with Vitest
pnpm test:unit

# E2E tests with Playwright
pnpm test:e2e

# Preview production build
pnpm preview
```

## Architecture Overview

### Schema-Driven Development
The system is built around JSON schemas that define:
- Document types (doctypes) with their fields, validation, and UI layout
- Access control rules at subscription, role, and field levels
- API endpoints and data operations
- Form layouts and field rendering

### Component Architecture
```
Renderers (DocumentPage, DashboardPage)
    └── Templates (MainLayout, AuthLayout)
        └── Organisms (DataTableCrud, FormBuilder)
            └── Molecules (FormField, StatCard, ActionMenu)
                └── Atoms (Use PrimeVue components directly)
```

### Key Directories Structure
```
src/
├── components/
│   ├── atoms/          # Basic UI elements (extend PrimeVue)
│   ├── molecules/      # Composite components (FormField, ActionMenu)
│   ├── organisms/      # Complex components (DataTableCrud, FormBuilder)
│   ├── templates/      # Layout components
│   └── renderers/      # Page-level components
├── composables/        # Vue composition functions
├── services/           # Business logic and API calls
├── stores/             # Pinia state management
├── types/              # TypeScript definitions
├── schemas/            # JSON schema definitions
└── utils/              # Helper functions
```

## PrimeVue 4 Integration

The project uses PrimeVue 4 with:
- Aura theme preset with custom color scheme
- Auto-import configuration via unplugin-vue-components
- Custom DhoolPreset extending Aura theme
- Dark mode support with `.dark` CSS selector
- Services: ToastService, ConfirmationService, DialogService

Import patterns for PrimeVue 4:
```typescript
// Theme and preset
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

// API imports (changed from v3)
import { FilterMatchMode } from '@primevue/core/api'
```

## Access Control System

Three-layer access control:
1. **Subscription Level**: Module and feature availability per tenant
2. **Role Level**: CRUD permissions and data scope (own/team/all)
3. **ABAC Level**: Field-level visibility and editability with conditions

## Key Patterns

### Schema Definition
Documents are defined in `/src/schemas/documents/` with structure:
```json
{
  "name": "doctype",
  "label": "Display Name",
  "module": "module_name",
  "api": { "baseEndpoint": "/api/v1/..." },
  "listView": { "columns": [], "toolbarActions": [], "rowActions": [] },
  "formView": { "sections": [], "fields": [] },
  "access": { "permissions": {} }
}
```

### Composables Usage
- `useAccess()`: Permission checking and field/action filtering
- `useSchema()`: Schema loading and validation
- `useCrud()`: CRUD operations with pagination and filtering
- `useDrawer()`: Form drawer state management

## Technology Stack

- **Frontend**: Vue 3 (Composition API), TypeScript, Vite
- **UI Framework**: PrimeVue 4 with Aura theme
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Testing**: Vitest (unit), Playwright (e2e)
- **Code Quality**: ESLint, Prettier
- **Build Tool**: Vite with auto-import for PrimeVue components

## Development Notes

- Node.js version: ^20.19.0 || >=22.12.0
- Package manager: pnpm
- Auto-import is configured for PrimeVue components
- TypeScript strict mode enabled
- ESLint configuration includes Vue, TypeScript, Vitest, and Playwright rules