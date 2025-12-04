# PrimeVue Component Library - Enhanced ERP System Development Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Atomic Design Levels](#atomic-design-levels)
4. [Configuration & Theming](#configuration--theming)
5. [Forms & Validation](#forms--validation)
6. [ERP Development Roadmap](#erp-development-roadmap)
7. [Best Practices](#best-practices)
8. [Advanced Features](#advanced-features)

---

## Overview

PrimeVue is a comprehensive UI component library for Vue.js applications with **WCAG 2.1 AA level compliance**. This guide categorizes components using Atomic Design principles and provides specific guidance for ERP (Enterprise Resource Planning) system development.

### Key Features for ERP Development

- ✅ **250+ PrimeIcons** built-in icon library
- ✅ **Accessibility First** with keyboard and screen reader support
- ✅ **Theming Flexibility** - Styled or Unstyled modes
- ✅ **Pass Through API** for unlimited customization
- ✅ **Form Management** with built-in validation
- ✅ **Responsive Design** mobile-ready components
- ✅ **TypeScript Support** full type definitions

---

## Getting Started

### Installation

#### Vite/Vue CLI Projects

```bash
# Using npm
npm install primevue @primeuix/themes primeicons

# Using yarn
yarn add primevue @primeuix/themes primeicons

# Using pnpm
pnpm add primevue @primeuix/themes primeicons
```

#### Nuxt Projects

```bash
npm install primevue @primeuix/themes primeicons
npm install --save-dev @primevue/nuxt-module
```

### Basic Configuration

#### Vite/Vue CLI Setup

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

#### Nuxt Configuration

```javascript
// nuxt.config.ts
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
    modules: ['@primevue/nuxt-module'],
    primevue: {
        options: {
            theme: {
                preset: Aura
            },
            ripple: true
        }
    }
});
```

### Auto Import Setup (Optional but Recommended)

```bash
npm install --save-dev unplugin-vue-components @primevue/auto-import-resolver
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

---

## 🔬 Atomic Design Levels

### Level 1: Atoms

Fundamental, indivisible UI elements that serve as building blocks.

#### Basic Form Elements

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
| **ColorPicker** | Color selection | ⚠️ Optional | Late | Inline/overlay modes |
| **Knob** | Circular dial input | ⚠️ Optional | Late | Touch-enabled, custom ranges |
| **Rating** | Star rating input | ⚠️ Optional | Late | Custom icons, read-only mode |
| **Slider** | Range slider | 🔹 Useful | Mid | Single/range, vertical/horizontal |

**ERP Implementation Tips:**
- Use `InputNumber` with `currency` mode for financial inputs
- Apply `InputMask` for standardized data entry (SSN, phone, tax IDs)
- Leverage `Password` strength indicators for security compliance
- Combine `Checkbox` with `DataTable` for bulk operations

#### Button Elements

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Button** | Standard button | ✅ Essential | Early (MVP) | Icons, badges, loading state |
| **ToggleButton** | Two-state toggle | 🔹 Useful | Mid | Icon-only mode |
| **SplitButton** | Button with dropdown | 🔹 Useful | Mid | Contextual actions |
| **SpeedDial** | Floating action button | ⚠️ Optional | Late | Circular/linear/quarter modes |

**Code Example - Enhanced Button:**

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

#### Display Elements

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Badge** | Status indicator | ✅ Essential | Mid | Overlap mode, custom values |
| **Chip** | Compact info display | 🔹 Useful | Mid | Removable, icons, images |
| **Tag** | Categorization label | 🔹 Useful | Mid | Rounded, severity colors |
| **Avatar** | User profile image | ✅ Essential | Early | Initials, images, groups |
| **Image** | Enhanced image display | 🔹 Useful | Mid | Preview, lazy loading |
| **ProgressBar** | Linear progress | ✅ Essential | Early | Determinate/indeterminate |
| **ProgressSpinner** | Circular loading | ✅ Essential | Early | Custom size/color |
| **Skeleton** | Loading placeholder | 🔹 Useful | Mid | Various shapes, animations |
| **Divider** | Content separator | ✅ Essential | Early | Horizontal/vertical, content |

**ERP Use Cases:**
- **Badge**: Show notification counts, pending approvals
- **Tag**: Display order status, priority levels
- **Avatar**: User identification in activity logs
- **ProgressBar**: File upload, batch processing progress

---

### Level 2: Molecules

Simple combinations of atoms forming functional, reusable components.

#### Advanced Form Components

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **AutoComplete** | Search with suggestions | ✅ Essential | Early | Remote search, templates, virtual scroll |
| **Dropdown** | Single selection | ✅ Essential | Early (MVP) | Filter, lazy loading, grouping |
| **MultiSelect** | Multiple selection | ✅ Essential | Early | Select all, chip display, filter |
| **Listbox** | Scrollable list | 🔹 Useful | Mid | Multiple selection, grouping |
| **SelectButton** | Button group selector | 🔹 Useful | Mid | Multiple/single mode |
| **Calendar/DatePicker** | Date selection | ✅ Essential | Early | Range, time, multiple, restrictions |
| **TimePicker** | Time selection | ✅ Essential | Early | 12/24 hour, step intervals |
| **Chips** | Multi-value input | 🔹 Useful | Mid | Add on blur, separator key |
| **Editor** | Rich text editor | 🔹 Useful | Mid | Quill-based, custom toolbar |
| **FileUpload** | File upload interface | ✅ Essential | Early | Multiple, drag-drop, preview, validation |
| **CascadeSelect** | Nested options | 🔹 Useful | Mid | Hierarchical data |
| **TreeSelect** | Tree-based selection | ✅ Essential | Mid | Checkbox selection, lazy loading |

**Code Example - Advanced Dropdown:**

```vue
<Dropdown 
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
</Dropdown>
```

**ERP Best Practices:**
- Use `AutoComplete` for customer/product lookups with large datasets
- Implement `MultiSelect` for batch filtering and report parameters
- Apply `Calendar` with `selectionMode="range"` for date range filters
- Utilize `FileUpload` with validation for document management

#### Message Components

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Message** | Inline message | ✅ Essential | Early | Severity levels, closable |
| **InlineMessage** | Contextual message | ✅ Essential | Early | Compact, severity icons |
| **Toast** | Notification popup | ✅ Essential | Early | Positions, life time, sticky |

**Code Example - Toast Service:**

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

#### Panel Components

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Card** | Content container | ✅ Essential | Early | Header, footer, templates |
| **Panel** | Collapsible container | ✅ Essential | Early | Toggle, header template |
| **Fieldset** | Form field grouping | ✅ Essential | Early | Legend, toggleable |
| **ScrollPanel** | Custom scrollbar | ⚠️ Optional | Late | Native scrolling option |
| **Toolbar** | Action container | ✅ Essential | Early | Start/center/end slots |
| **TabView** | Tabbed panels | ✅ Essential | Early | Closable, lazy load, templates |
| **Accordion** | Collapsible panels | 🔹 Useful | Mid | Multiple/single active, lazy |
| **Splitter** | Resizable panels | 🔹 Useful | Mid | Horizontal/vertical, nested |

**ERP Layout Example:**

```vue
<Card>
    <template #title>Customer Information</template>
    <template #content>
        <TabView>
            <TabPanel header="Details">
                <Fieldset legend="Contact Information">
                    <!-- Form fields -->
                </Fieldset>
            </TabPanel>
            <TabPanel header="Orders">
                <DataTable :value="orders" />
            </TabPanel>
            <TabPanel header="Documents">
                <FileUpload mode="basic" />
            </TabPanel>
        </TabView>
    </template>
    <template #footer>
        <Toolbar>
            <template #start>
                <Button label="Save" icon="pi pi-check" />
            </template>
            <template #end>
                <Button label="Cancel" icon="pi pi-times" severity="secondary" />
            </template>
        </Toolbar>
    </template>
</Card>
```

---

### Level 3: Organisms

Complex components composed of molecules and atoms forming distinct interface sections.

#### Navigation Components

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Menu** | Standard menu | ✅ Essential | Early | Vertical/horizontal, templates |
| **ContextMenu** | Right-click menu | 🔹 Useful | Mid | Global/local, ref-based |
| **TieredMenu** | Nested menu | ✅ Essential | Early | Popup/inline mode |
| **MegaMenu** | Large dropdown menu | ⚠️ Optional | Late | Grid layout, orientation |
| **Menubar** | Horizontal menu bar | ✅ Essential | Early | Start/end templates |
| **PanelMenu** | Accordion-style menu | ✅ Essential | Early | Multiple expand |
| **Breadcrumb** | Navigation trail | ✅ Essential | Early | Home icon, separator |
| **Steps** | Process indicator | ✅ Essential | Mid | Clickable, readonly |
| **TabMenu** | Tab navigation | ✅ Essential | Early | Active highlighting |
| **Dock** | macOS-style dock | ⚠️ Optional | Late | Magnification effect |

**Code Example - ERP Navigation:**

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

#### Data Display Components ⭐

**Most Critical for ERP Systems**

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **DataTable** ⭐ | Advanced data grid | ✅ **CRITICAL** | Early | See detailed section below |
| **Tree** | Hierarchical tree | ✅ Essential | Early | Drag-drop, templates, filtering |
| **TreeTable** | Tree in table format | 🔹 Useful | Mid | Combines Tree + DataTable features |
| **OrganizationChart** | Org chart display | 🔹 Useful | Mid | Collapsible nodes, templates |
| **DataView** | Flexible data display | 🔹 Useful | Mid | List/grid layouts, pagination |
| **VirtualScroller** | Efficient large lists | 🔹 Useful | Mid | Lazy loading, both directions |
| **Timeline** | Chronological events | 🔹 Useful | Mid | Horizontal/vertical, custom content |
| **Chart** | Data visualization | ✅ Essential | Mid | Chart.js integration |

##### DataTable - The Heart of ERP 💓

**Essential Features for ERP:**

1. **Pagination & Lazy Loading**
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

2. **Advanced Filtering**
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
            <Dropdown
                v-model="filterModel.value"
                :options="categories"
                @change="filterCallback()"
                placeholder="Select Category"
            />
        </template>
    </Column>
</DataTable>
```

3. **Selection & Bulk Operations**
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

4. **Export Functionality**
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
            <Button 
                label="Export PDF" 
                icon="pi pi-file-pdf" 
                severity="danger"
                @click="exportPDF" 
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

5. **Row Editing**
```vue
<DataTable 
    :value="products"
    editMode="row"
    v-model:editingRows="editingRows"
    @row-edit-save="onRowEditSave"
>
    <Column field="code" header="Code" style="width: 20%">
        <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
        </template>
    </Column>
    
    <Column field="price" header="Price" style="width: 20%">
        <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
        </template>
        <template #editor="{ data, field }">
            <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" />
        </template>
    </Column>
    
    <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center" />
</DataTable>
```

6. **Frozen Columns**
```vue
<DataTable :value="sales" scrollable scrollHeight="400px">
    <Column field="orderDate" header="Date" frozen />
    <Column field="customer" header="Customer" frozen />
    <Column field="product" header="Product" />
    <Column field="quantity" header="Quantity" />
    <Column field="price" header="Price" />
    <Column field="total" header="Total" />
    <!-- Many more columns... -->
</DataTable>
```

7. **Row Grouping**
```vue
<DataTable 
    :value="sales"
    rowGroupMode="subheader"
    groupRowsBy="category"
    sortMode="single"
    sortField="category"
    :sortOrder="1"
>
    <Column field="category" header="Category" />
    <Column field="product" header="Product" />
    <Column field="quantity" header="Quantity" />
    
    <template #groupheader="slotProps">
        <div class="flex items-center gap-2">
            <span class="font-bold">{{ slotProps.data.category }}</span>
            <Badge :value="getCategoryCount(slotProps.data.category)" />
        </div>
    </template>
    
    <template #groupfooter="slotProps">
        <div class="text-right font-bold">
            Total: {{ calculateCategoryTotal(slotProps.data.category) }}
        </div>
    </template>
</DataTable>
```

**DataTable Performance Tips:**
- Always use `:lazy="true"` for datasets > 1000 records
- Implement server-side pagination, sorting, and filtering
- Use `virtualScrollerOptions` for very large datasets
- Freeze important columns for better UX
- Cache filter configurations in localStorage

#### Overlay Components

| Component | Description | ERP Required | Dev Stage | Key Features |
|-----------|-------------|--------------|-----------|--------------|
| **Dialog** | Modal dialog | ✅ Essential | Early | Draggable, resizable, templates |
| **ConfirmDialog** | Confirmation dialog | ✅ Essential | Early | Service-based, positions |
| **ConfirmPopup** | Lightweight confirm | ✅ Essential | Early | Inline positioning |
| **Sidebar** | Sliding panel | 🔹 Useful | Mid | Positions, fullscreen |
| **OverlayPanel** | Floating content | 🔹 Useful | Mid | Dismissable, target-based |
| **Drawer** | Slide-in panel | 🔹 Useful | Mid | Multiple positions |

**Code Example - Confirm Dialog Service:**

```vue
<template>
    <Button @click="confirmDelete" label="Delete" icon="pi pi-trash" severity="danger" />
    <ConfirmDialog />
</template>

<script setup>
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();

const confirmDelete = () => {
    confirm.require({
        message: 'Are you sure you want to delete this order?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary',
        acceptClass: 'p-button-danger',
        accept: () => {
            // Delete logic
            toast.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Order has been deleted',
                life: 3000
            });
        }
    });
};
</script>
```

---

### Level 4: Templates

Page-level layouts combining organisms to create structural blueprints.

#### PrimeFlex Utilities

| Feature | Description | ERP Usage |
|---------|-------------|-----------|
| **Grid System** | 12-column responsive grid | Dashboard layouts, forms |
| **Flexbox** | Flex utilities | Navigation, toolbars |
| **Spacing** | Margin/padding classes | Consistent spacing |
| **Typography** | Text utilities | Headers, labels |
| **Display** | Show/hide utilities | Responsive visibility |

**Code Example - ERP Layout Grid:**

```vue
<div class="grid">
    <!-- KPI Cards - Full width on mobile, 3 columns on desktop -->
    <div class="col-12 md:col-6 lg:col-3">
        <Card>
            <template #title>Total Revenue</template>
            <template #content>
                <div class="text-3xl font-bold">$125,430</div>
                <div class="text-green-500">↑ 12% from last month</div>
            </template>
        </Card>
    </div>
    <div class="col-12 md:col-6 lg:col-3">
        <Card>
            <template #title>Orders</template>
            <template #content>
                <div class="text-3xl font-bold">1,257</div>
                <div class="text-green-500">↑ 8% from last month</div>
            </template>
        </Card>
    </div>
    <!-- More KPI cards... -->
    
    <!-- Main Content - 8 columns -->
    <div class="col-12 lg:col-8">
        <Card>
            <template #title>Sales Chart</template>
            <template #content>
                <Chart type="line" :data="chartData" />
            </template>
        </Card>
    </div>
    
    <!-- Sidebar - 4 columns -->
    <div class="col-12 lg:col-4">
        <Card>
            <template #title>Recent Activity</template>
            <template #content>
                <Timeline :value="activities" />
            </template>
        </Card>
    </div>
</div>
```

#### ERP Template Recommendations

**1. Dashboard Template**
- **Components**: Card + Chart + DataTable + KPI Widgets
- **Layout**: Grid-based, responsive
- **Features**: Real-time data, drill-down capabilities

**2. Master-Detail Template**
- **Components**: DataTable + Sidebar/Dialog + Forms
- **Pattern**: List → Detail view → Edit
- **Features**: CRUD operations, validation

**3. Form Template**
- **Components**: Panel + Fieldset + Form Components + Toolbar
- **Layout**: Multi-step or single page
- **Features**: Validation, auto-save

**4. Report Template**
- **Components**: Toolbar + Filters + DataTable + Chart + Export
- **Features**: Advanced filtering, export options

**5. Workflow Template**
- **Components**: Steps + Forms + Validation + Navigation
- **Pattern**: Multi-step process
- **Features**: Progress tracking, validation per step

---

### Level 5: Pages

Specific ERP page implementations with real content and data.

#### Early Stage (MVP) - Weeks 1-4

##### 1. Login/Authentication Page

```vue
<template>
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900">
        <Card class="w-full max-w-md">
            <template #title>
                <div class="text-center">
                    <img src="logo.png" alt="Logo" class="h-16 mx-auto mb-4" />
                    <h1 class="text-2xl">Sign In</h1>
                </div>
            </template>
            <template #content>
                <Form :resolver @submit="onLogin" class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="email">Email</label>
                        <InputText 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="Enter your email"
                            class="w-full"
                        />
                        <Message v-if="$form.email?.invalid" severity="error" size="small">
                            {{ $form.email.error?.message }}
                        </Message>
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="password">Password</label>
                        <Password 
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            :feedback="false"
                            toggleMask
                            class="w-full"
                        />
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Checkbox inputId="remember" v-model="rememberMe" binary />
                            <label for="remember">Remember me</label>
                        </div>
                        <a href="#" class="text-primary">Forgot password?</a>
                    </div>
                    
                    <Button 
                        type="submit" 
                        label="Sign In" 
                        class="w-full"
                        :loading="isLoading"
                    />
                </Form>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { zodResolver } from '@primevue/forms/resolvers';
import { z } from 'zod';

const router = useRouter();
const isLoading = ref(false);
const rememberMe = ref(false);

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

const resolver = zodResolver(schema);

const onLogin = async (values) => {
    isLoading.value = true;
    try {
        // Authentication logic
        await authService.login(values.email, values.password);
        router.push('/dashboard');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error.message
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
```

##### 2. Dashboard Page

```vue
<template>
    <div class="p-4">
        <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
        
        <!-- KPI Cards -->
        <div class="grid mb-4">
            <div v-for="kpi in kpis" :key="kpi.title" class="col-12 md:col-6 lg:col-3">
                <Card>
                    <template #content>
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-muted-color text-sm mb-2">{{ kpi.title }}</div>
                                <div class="text-3xl font-bold">{{ kpi.value }}</div>
                                <div :class="['text-sm', kpi.trend > 0 ? 'text-green-500' : 'text-red-500']">
                                    <i :class="kpi.trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" />
                                    {{ Math.abs(kpi.trend) }}% vs last month
                                </div>
                            </div>
                            <div :class="['w-16 h-16 rounded-full flex items-center justify-center', kpi.bgColor]">
                                <i :class="['text-3xl', kpi.icon, kpi.iconColor]" />
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        
        <!-- Charts -->
        <div class="grid mb-4">
            <div class="col-12 lg:col-8">
                <Card>
                    <template #title>Sales Overview</template>
                    <template #content>
                        <Chart type="line" :data="salesChartData" :options="chartOptions" />
                    </template>
                </Card>
            </div>
            <div class="col-12 lg:col-4">
                <Card>
                    <template #title>Sales by Category</template>
                    <template #content>
                        <Chart type="doughnut" :data="categoryChartData" />
                    </template>
                </Card>
            </div>
        </div>
        
        <!-- Recent Orders -->
        <Card>
            <template #title>Recent Orders</template>
            <template #content>
                <DataTable 
                    :value="recentOrders"
                    :rows="10"
                    paginator
                    responsiveLayout="scroll"
                >
                    <Column field="orderNumber" header="Order #" />
                    <Column field="customer" header="Customer" />
                    <Column field="date" header="Date">
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.date) }}
                        </template>
                    </Column>
                    <Column field="amount" header="Amount">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.amount) }}
                        </template>
                    </Column>
                    <Column field="status" header="Status">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" text rounded @click="viewOrder(slotProps.data)" />
                            <Button icon="pi pi-pencil" text rounded severity="success" @click="editOrder(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </div>
</template>
```

##### 3. Master Data Page - Products

```vue
<template>
    <div class="p-4">
        <Toolbar class="mb-4">
            <template #start>
                <h1 class="text-2xl font-bold">Products</h1>
            </template>
            <template #end>
                <Button label="New Product" icon="pi pi-plus" @click="openDialog" />
            </template>
        </Toolbar>
        
        <DataTable 
            v-model:filters="filters"
            v-model:selection="selectedProducts"
            :value="products"
            :lazy="true"
            :paginator="true"
            :rows="20"
            :totalRecords="totalRecords"
            :loading="loading"
            dataKey="id"
            filterDisplay="row"
            @page="onPage"
            @sort="onSort"
            @filter="onFilter"
        >
            <template #header>
                <div class="flex justify-between">
                    <Button 
                        type="button" 
                        icon="pi pi-filter-slash" 
                        label="Clear Filters" 
                        outlined 
                        @click="clearFilters"
                    />
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText 
                            v-model="filters['global'].value" 
                            placeholder="Search products..." 
                        />
                    </IconField>
                </div>
            </template>
            
            <Column selectionMode="multiple" style="width: 3rem" />
            
            <Column field="code" header="Code" sortable>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText 
                        v-model="filterModel.value" 
                        @keydown.enter="filterCallback()" 
                        placeholder="Search by code"
                    />
                </template>
            </Column>
            
            <Column field="name" header="Name" sortable>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText 
                        v-model="filterModel.value" 
                        @keydown.enter="filterCallback()" 
                        placeholder="Search by name"
                    />
                </template>
            </Column>
            
            <Column field="category" header="Category" sortable>
                <template #filter="{ filterModel, filterCallback }">
                    <Dropdown
                        v-model="filterModel.value"
                        :options="categories"
                        placeholder="Select Category"
                        @change="filterCallback()"
                        showClear
                    />
                </template>
            </Column>
            
            <Column field="price" header="Price" sortable>
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.price) }}
                </template>
            </Column>
            
            <Column field="stock" header="Stock" sortable>
                <template #body="slotProps">
                    <Tag 
                        :value="slotProps.data.stock" 
                        :severity="getStockSeverity(slotProps.data.stock)" 
                    />
                </template>
            </Column>
            
            <Column header="Actions" style="width: 10rem">
                <template #body="slotProps">
                    <Button 
                        icon="pi pi-pencil" 
                        text 
                        rounded 
                        severity="success" 
                        @click="editProduct(slotProps.data)" 
                    />
                    <Button 
                        icon="pi pi-trash" 
                        text 
                        rounded 
                        severity="danger" 
                        @click="confirmDelete(slotProps.data)" 
                    />
                </template>
            </Column>
        </DataTable>
        
        <!-- Product Dialog -->
        <Dialog 
            v-model:visible="dialogVisible" 
            :header="editMode ? 'Edit Product' : 'New Product'"
            :modal="true"
            :style="{ width: '50rem' }"
        >
            <Form :resolver @submit="saveProduct" class="grid gap-4">
                <div class="col-12 md:col-6">
                    <label for="code">Product Code *</label>
                    <InputText 
                        id="code" 
                        name="code" 
                        v-model="product.code"
                        class="w-full"
                    />
                </div>
                
                <div class="col-12 md:col-6">
                    <label for="name">Product Name *</label>
                    <InputText 
                        id="name" 
                        name="name" 
                        v-model="product.name"
                        class="w-full"
                    />
                </div>
                
                <div class="col-12 md:col-6">
                    <label for="category">Category *</label>
                    <Dropdown
                        id="category"
                        name="category"
                        v-model="product.category"
                        :options="categories"
                        placeholder="Select"
                        class="w-full"
                    />
                </div>
                
                <div class="col-12 md:col-6">
                    <label for="price">Price *</label>
                    <InputNumber
                        id="price"
                        name="price"
                        v-model="product.price"
                        mode="currency"
                        currency="USD"
                        locale="en-US"
                        class="w-full"
                    />
                </div>
                
                <div class="col-12 md:col-6">
                    <label for="stock">Stock Quantity *</label>
                    <InputNumber
                        id="stock"
                        name="stock"
                        v-model="product.stock"
                        class="w-full"
                    />
                </div>
                
                <div class="col-12">
                    <label for="description">Description</label>
                    <Textarea
                        id="description"
                        v-model="product.description"
                        rows="4"
                        class="w-full"
                    />
                </div>
                
                <div class="col-12 flex justify-end gap-2">
                    <Button 
                        type="button" 
                        label="Cancel" 
                        severity="secondary" 
                        @click="dialogVisible = false" 
                    />
                    <Button 
                        type="submit" 
                        label="Save" 
                        :loading="saving"
                    />
                </div>
            </Form>
        </Dialog>
    </div>
</template>
```

##### 4. Transaction Entry Form - Order Management

```vue
<template>
    <div class="p-4">
        <Steps :model="steps" :activeStep="activeStep" class="mb-4" />
        
        <Card>
            <template #content>
                <!-- Step 1: Customer Selection -->
                <div v-if="activeStep === 0">
                    <h2 class="text-xl font-bold mb-4">Customer Information</h2>
                    <div class="grid gap-4">
                        <div class="col-12 md:col-6">
                            <label for="customer">Customer *</label>
                            <AutoComplete
                                id="customer"
                                v-model="order.customer"
                                :suggestions="filteredCustomers"
                                @complete="searchCustomers"
                                field="name"
                                placeholder="Search customer"
                                class="w-full"
                            >
                                <template #item="slotProps">
                                    <div class="flex items-center gap-2">
                                        <Avatar :label="slotProps.item.name.charAt(0)" shape="circle" />
                                        <div>
                                            <div>{{ slotProps.item.name }}</div>
                                            <small class="text-muted-color">{{ slotProps.item.email }}</small>
                                        </div>
                                    </div>
                                </template>
                            </AutoComplete>
                        </div>
                        
                        <div class="col-12 md:col-6">
                            <label for="orderDate">Order Date *</label>
                            <DatePicker
                                id="orderDate"
                                v-model="order.date"
                                dateFormat="mm/dd/yy"
                                class="w-full"
                            />
                        </div>
                        
                        <div class="col-12">
                            <label for="shippingAddress">Shipping Address</label>
                            <Textarea
                                id="shippingAddress"
                                v-model="order.shippingAddress"
                                rows="3"
                                class="w-full"
                            />
                        </div>
                    </div>
                </div>
                
                <!-- Step 2: Products Selection -->
                <div v-if="activeStep === 1">
                    <h2 class="text-xl font-bold mb-4">Order Items</h2>
                    
                    <DataTable 
                        v-model:editingRows="editingRows"
                        :value="order.items"
                        editMode="row"
                        dataKey="id"
                        @row-edit-save="onRowEditSave"
                        class="mb-4"
                    >
                        <template #header>
                            <div class="flex justify-end">
                                <Button 
                                    label="Add Item" 
                                    icon="pi pi-plus" 
                                    @click="addOrderItem" 
                                />
                            </div>
                        </template>
                        
                        <Column field="product" header="Product">
                            <template #editor="{ data }">
                                <AutoComplete
                                    v-model="data.product"
                                    :suggestions="filteredProducts"
                                    @complete="searchProducts"
                                    field="name"
                                />
                            </template>
                        </Column>
                        
                        <Column field="quantity" header="Quantity">
                            <template #editor="{ data }">
                                <InputNumber v-model="data.quantity" :min="1" />
                            </template>
                        </Column>
                        
                        <Column field="price" header="Unit Price">
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.price) }}
                            </template>
                            <template #editor="{ data }">
                                <InputNumber 
                                    v-model="data.price" 
                                    mode="currency" 
                                    currency="USD"
                                />
                            </template>
                        </Column>
                        
                        <Column field="total" header="Total">
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.quantity * slotProps.data.price) }}
                            </template>
                        </Column>
                        
                        <Column :rowEditor="true" />
                        
                        <Column>
                            <template #body="slotProps">
                                <Button 
                                    icon="pi pi-trash" 
                                    text 
                                    rounded 
                                    severity="danger"
                                    @click="removeOrderItem(slotProps.index)" 
                                />
                            </template>
                        </Column>
                    </DataTable>
                    
                    <div class="flex justify-end">
                        <div class="text-right">
                            <div class="text-lg mb-2">
                                <span class="font-semibold">Subtotal:</span>
                                {{ formatCurrency(calculateSubtotal()) }}
                            </div>
                            <div class="text-lg mb-2">
                                <span class="font-semibold">Tax (10%):</span>
                                {{ formatCurrency(calculateTax()) }}
                            </div>
                            <div class="text-2xl font-bold text-primary">
                                <span>Total:</span>
                                {{ formatCurrency(calculateTotal()) }}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Step 3: Review & Confirm -->
                <div v-if="activeStep === 2">
                    <h2 class="text-xl font-bold mb-4">Review Order</h2>
                    
                    <div class="grid gap-4">
                        <div class="col-12 md:col-6">
                            <Panel header="Customer Information">
                                <div class="flex flex-col gap-2">
                                    <div><strong>Name:</strong> {{ order.customer?.name }}</div>
                                    <div><strong>Email:</strong> {{ order.customer?.email }}</div>
                                    <div><strong>Order Date:</strong> {{ formatDate(order.date) }}</div>
                                </div>
                            </Panel>
                        </div>
                        
                        <div class="col-12 md:col-6">
                            <Panel header="Shipping Address">
                                <div>{{ order.shippingAddress || 'N/A' }}</div>
                            </Panel>
                        </div>
                        
                        <div class="col-12">
                            <Panel header="Order Items">
                                <DataTable :value="order.items">
                                    <Column field="product.name" header="Product" />
                                    <Column field="quantity" header="Quantity" />
                                    <Column field="price" header="Unit Price">
                                        <template #body="slotProps">
                                            {{ formatCurrency(slotProps.data.price) }}
                                        </template>
                                    </Column>
                                    <Column header="Total">
                                        <template #body="slotProps">
                                            {{ formatCurrency(slotProps.data.quantity * slotProps.data.price) }}
                                        </template>
                                    </Column>
                                </DataTable>
                                
                                <div class="flex justify-end mt-4">
                                    <div class="text-right">
                                        <div class="text-xl font-bold text-primary">
                                            Order Total: {{ formatCurrency(calculateTotal()) }}
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </div>
                    </div>
                </div>
            </template>
            
            <template #footer>
                <div class="flex justify-between">
                    <Button 
                        label="Previous" 
                        icon="pi pi-chevron-left"
                        :disabled="activeStep === 0"
                        severity="secondary"
                        @click="activeStep--" 
                    />
                    
                    <Button 
                        v-if="activeStep < 2"
                        label="Next" 
                        icon="pi pi-chevron-right"
                        iconPos="right"
                        @click="activeStep++" 
                    />
                    
                    <Button 
                        v-else
                        label="Submit Order" 
                        icon="pi pi-check"
                        :loading="submitting"
                        @click="submitOrder" 
                    />
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
const activeStep = ref(0);
const submitting = ref(false);

const steps = ref([
    { label: 'Customer' },
    { label: 'Items' },
    { label: 'Review' }
]);

const order = ref({
    customer: null,
    date: new Date(),
    shippingAddress: '',
    items: []
});

const submitOrder = async () => {
    submitting.value = true;
    try {
        await orderService.createOrder(order.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order created successfully',
            life: 3000
        });
        router.push('/orders');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
        });
    } finally {
        submitting.value = false;
    }
};
</script>
```

---

## 📊 Forms & Validation

### PrimeVue Forms Library

PrimeVue provides a comprehensive forms library with built-in validation support.

#### Installation

```bash
npm install @primevue/forms
```

#### Built-in Resolvers

The forms library provides resolvers for popular validation libraries:

- **Zod** - TypeScript-first schema validation
- **Yup** - JavaScript schema builder
- **Joi** - Object schema validation
- **Valibot** - Lightweight validation
- **Superstruct** - Composable validation

#### Zod Integration Example

```vue
<template>
    <Form v-slot="$form" :resolver @submit="onSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <label for="email">Email</label>
            <InputText 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Enter email"
                class="w-full"
            />
            <Message 
                v-if="$form.email?.invalid" 
                severity="error" 
                size="small" 
                variant="simple"
            >
                {{ $form.email.error?.message }}
            </Message>
        </div>
        
        <div class="flex flex-col gap-1">
            <label for="password">Password</label>
            <Password 
                id="password" 
                name="password"
                placeholder="Enter password"
                toggleMask
                class="w-full"
            />
            <Message 
                v-if="$form.password?.invalid" 
                severity="error" 
                size="small" 
                variant="simple"
            >
                <ul class="my-0 px-4">
                    <li v-for="(error, index) of $form.password.errors" :key="index">
                        {{ error.message }}
                    </li>
                </ul>
            </Message>
        </div>
        
        <Button type="submit" label="Submit" />
    </Form>
</template>

<script setup>
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase letter')
        .regex(/[a-z]/, 'Must contain lowercase letter')
        .regex(/[0-9]/, 'Must contain number')
});

const resolver = zodResolver(schema);

const onSubmit = ({ valid, errors, states }) => {
    if (valid) {
        // Process form data
        console.log('Form is valid:', states);
    } else {
        console.log('Form has errors:', errors);
    }
};
</script>
```

#### Validation Triggers

Control when validation occurs:

```vue
<Form 
    :validateOnValueUpdate="true"  // Validate on input
    :validateOnBlur="true"          // Validate on blur
    :validateOnMount="['email']"    // Validate specific fields on mount
    :validateOnSubmit="true"        // Validate on submit
>
    <!-- Form fields -->
</Form>
```

---

## 📊 ERP Development Priority Matrix

### Phase 1: Foundation (Weeks 1-4)
**Budget**: $25,000 | **Team**: 2-3 developers

**Focus:** Core data entry and display

| Priority | Component | Reason | Hours |
|----------|-----------|--------|-------|
| 🔴 **CRITICAL** | DataTable | Heart of ERP - master data display | 40 |
| 🔴 **CRITICAL** | Form Components | Data entry foundation | 32 |
| 🔴 **CRITICAL** | Dialog/Toast | User feedback system | 16 |
| 🔴 **CRITICAL** | Navigation | Menubar, Breadcrumb, Sidebar | 24 |
| 🟡 **HIGH** | Card/Panel | Layout containers | 16 |
| 🟡 **HIGH** | Toolbar | Action organization | 8 |

**Deliverables:**
- Basic CRUD operations
- Master data management (2-3 entities)
- Authentication/authorization
- Dashboard skeleton

### Phase 2: Core Features (Weeks 5-12)
**Budget**: $50,000 | **Team**: 3-4 developers

**Focus:** Business logic and workflows

| Priority | Component | Reason | Hours |
|----------|-----------|--------|-------|
| 🟡 **HIGH** | Advanced Filtering | Essential for data discovery | 24 |
| 🟡 **HIGH** | Charts | Analytics and reporting | 32 |
| 🟡 **HIGH** | Tree/TreeTable | Hierarchical data | 24 |
| 🟡 **HIGH** | Steps | Workflow processes | 16 |
| 🟡 **HIGH** | FileUpload | Document management | 20 |
| 🟢 **MEDIUM** | Sidebar/Timeline | Enhanced UX | 16 |

**Deliverables:**
- Transaction processing
- Approval workflows
- Basic reporting
- Document management

### Phase 3: Enhancement (Weeks 13-20)
**Budget**: $40,000 | **Team**: 2-3 developers

**Focus:** User experience and efficiency

| Priority | Component | Reason | Hours |
|----------|-----------|--------|-------|
| 🟢 **MEDIUM** | VirtualScroller | Performance optimization | 16 |
| 🟢 **MEDIUM** | PickList/OrderList | Assignment management | 20 |
| 🟢 **MEDIUM** | DataView | Flexible displays | 16 |
| 🟢 **MEDIUM** | ContextMenu | Power user features | 12 |
| 🟢 **MEDIUM** | OrganizationChart | HR module | 16 |
| 🔵 **LOW** | Animations | Polish | 8 |

**Deliverables:**
- Performance optimizations
- Advanced user features
- Mobile responsiveness
- Custom dashboards

### Phase 4: Polish (Weeks 21+)
**Budget**: $20,000 | **Team**: 1-2 developers

**Focus:** Optional enhancements

| Priority | Component | Reason | Hours |
|----------|-----------|--------|-------|
| 🔵 **LOW** | SpeedDial | Quick actions | 8 |
| 🔵 **LOW** | MegaMenu | Complex navigation | 12 |
| 🔵 **LOW** | Galleria | Product showcases | 12 |
| 🔵 **LOW** | Terminal | Admin tools | 16 |
| 🔵 **LOW** | Custom Themes | Branding | 24 |

---

## 🎯 Best Practices for ERP Development

### 1. Data Table Mastery

```vue
// ✅ GOOD: CSRF protection
<Form @submit="onSubmit" :headers="{ 'X-CSRF-Token': csrfToken }">
```

### 8. Error Handling

```vue
// ✅ GOOD: Comprehensive error handling
const saveProduct = async () => {
    try {
        await productService.save(product.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product saved successfully'
        });
    } catch (error) {
        if (error.response?.status === 422) {
            // Validation errors
            Object.keys(error.response.data.errors).forEach(field => {
                toast.add({
                    severity: 'error',
                    summary: `Validation Error: ${field}`,
                    detail: error.response.data.errors[field][0],
                    life: 5000
                });
            });
        } else {
            // Generic error
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save product. Please try again.'
            });
        }
    }
};
```

### 9. Responsive Design

```vue
// ✅ GOOD: Mobile-responsive layout
<div class="grid">
    <div class="col-12 md:col-6 lg:col-4">
        <Card><!-- KPI --></Card>
    </div>
</div>

<DataTable 
    :value="products"
    responsiveLayout="stack"
    breakpoint="960px"
>
```

### 10. Code Organization

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── forms/           # Form components
│   └── layouts/         # Layout components
├── composables/         # Reusable composition functions
│   ├── useApi.js
│   ├── useAuth.js
│   └── useDataTable.js
├── stores/              # Pinia stores
│   ├── products.js
│   ├── orders.js
│   └── auth.js
├── services/            # API services
│   ├── productService.js
│   └── orderService.js
├── utils/               # Utility functions
│   ├── formatters.js
│   └── validators.js
└── views/               # Page components
    ├── Products.vue
    └── Orders.vue
```

---

## 🚀 Advanced Features

### 1. DataTable State Management

```vue
<script setup>
import { useDataTable } from '@/composables/useDataTable';

const {
    data,
    loading,
    filters,
    pagination,
    sorting,
    selectedItems,
    loadData,
    exportCSV,
    exportExcel,
    clearFilters
} = useDataTable('/api/products', {
    defaultFilters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        category: { value: null, matchMode: FilterMatchMode.EQUALS }
    },
    defaultSorting: { sortField: 'name', sortOrder: 1 }
});

// Auto-save filter preferences
watch(filters, (newFilters) => {
    localStorage.setItem('productFilters', JSON.stringify(newFilters));
}, { deep: true });

onMounted(() => {
    const savedFilters = localStorage.getItem('productFilters');
    if (savedFilters) {
        filters.value = JSON.parse(savedFilters);
    }
    loadData();
});
</script>

<template>
    <DataTable 
        v-model:filters="filters"
        v-model:selection="selectedItems"
        :value="data"
        :loading="loading"
        @page="loadData"
        @sort="loadData"
        @filter="loadData"
    >
        <!-- columns -->
    </DataTable>
</template>
```

### 2. Dynamic Form Builder

```vue
<template>
    <Form :resolver @submit="onSubmit">
        <div class="grid">
            <div 
                v-for="field in formFields" 
                :key="field.name"
                :class="field.colClass || 'col-12 md:col-6'"
            >
                <component 
                    :is="field.component"
                    :name="field.name"
                    v-bind="field.props"
                    class="w-full"
                />
            </div>
        </div>
        <Button type="submit" label="Submit" />
    </Form>
</template>

<script setup>
const formFields = [
    {
        name: 'productName',
        component: InputText,
        props: {
            placeholder: 'Enter product name',
            required: true
        },
        colClass: 'col-12 md:col-6'
    },
    {
        name: 'category',
        component: Dropdown,
        props: {
            options: categories,
            placeholder: 'Select category',
            required: true
        },
        colClass: 'col-12 md:col-6'
    },
    {
        name: 'price',
        component: InputNumber,
        props: {
            mode: 'currency',
            currency: 'USD',
            required: true
        },
        colClass: 'col-12 md:col-4'
    }
];
</script>
```

### 3. Advanced Search with Filters

```vue
<template>
    <Card>
        <template #title>Advanced Search</template>
        <template #content>
            <div class="grid">
                <div class="col-12 md:col-3">
                    <label>Product Name</label>
                    <InputText 
                        v-model="searchFilters.name" 
                        placeholder="Search..."
                        class="w-full"
                    />
                </div>
                
                <div class="col-12 md:col-3">
                    <label>Category</label>
                    <MultiSelect 
                        v-model="searchFilters.categories"
                        :options="categories"
                        placeholder="Select categories"
                        class="w-full"
                    />
                </div>
                
                <div class="col-12 md:col-3">
                    <label>Price Range</label>
                    <div class="flex gap-2">
                        <InputNumber 
                            v-model="searchFilters.priceMin"
                            placeholder="Min"
                            mode="currency"
                            currency="USD"
                        />
                        <InputNumber 
                            v-model="searchFilters.priceMax"
                            placeholder="Max"
                            mode="currency"
                            currency="USD"
                        />
                    </div>
                </div>
                
                <div class="col-12 md:col-3">
                    <label>Date Range</label>
                    <DatePicker 
                        v-model="searchFilters.dateRange"
                        selectionMode="range"
                        placeholder="Select range"
                        class="w-full"
                    />
                </div>
                
                <div class="col-12 md:col-3">
                    <label>Status</label>
                    <SelectButton 
                        v-model="searchFilters.status"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        multiple
                        class="w-full"
                    />
                </div>
            </div>
            
            <div class="flex justify-end gap-2 mt-4">
                <Button 
                    label="Clear" 
                    icon="pi pi-filter-slash" 
                    severity="secondary"
                    @click="clearSearch" 
                />
                <Button 
                    label="Search" 
                    icon="pi pi-search"
                    @click="performSearch" 
                />
            </div>
        </template>
    </Card>
    
    <Card class="mt-4">
        <template #content>
            <DataTable :value="searchResults" :loading="searching">
                <!-- columns -->
            </DataTable>
        </template>
    </Card>
</template>
```

### 4. Batch Operations

```vue
<template>
    <Toolbar v-if="selectedItems.length > 0" class="mb-4">
        <template #start>
            <span class="text-lg font-semibold">
                {{ selectedItems.length }} item(s) selected
            </span>
        </template>
        <template #end>
            <SplitButton 
                label="Batch Actions" 
                :model="batchActions"
                icon="pi pi-cog"
            />
        </template>
    </Toolbar>
    
    <DataTable 
        v-model:selection="selectedItems"
        :value="items"
        dataKey="id"
    >
        <Column selectionMode="multiple" />
        <!-- other columns -->
    </DataTable>
</template>

<script setup>
const batchActions = ref([
    {
        label: 'Change Status',
        icon: 'pi pi-tag',
        items: [
            {
                label: 'Active',
                command: () => batchUpdateStatus('active')
            },
            {
                label: 'Inactive',
                command: () => batchUpdateStatus('inactive')
            }
        ]
    },
    {
        label: 'Change Category',
        icon: 'pi pi-folder',
        command: () => showCategoryDialog()
    },
    {
        separator: true
    },
    {
        label: 'Export Selected',
        icon: 'pi pi-download',
        command: () => exportSelected()
    },
    {
        label: 'Delete Selected',
        icon: 'pi pi-trash',
        command: () => confirmBatchDelete()
    }
]);

const batchUpdateStatus = async (status) => {
    try {
        const ids = selectedItems.value.map(item => item.id);
        await productService.batchUpdate(ids, { status });
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `${ids.length} items updated`
        });
        loadData();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
        });
    }
};
</script>
```

### 5. Real-time Updates with WebSockets

```vue
<script setup>
import { useWebSocket } from '@/composables/useWebSocket';

const { subscribe, unsubscribe } = useWebSocket();

onMounted(() => {
    // Subscribe to order updates
    subscribe('orders', (data) => {
        if (data.type === 'created') {
            orders.value.unshift(data.order);
            toast.add({
                severity: 'info',
                summary: 'New Order',
                detail: `Order #${data.order.number} received`,
                life: 5000
            });
        } else if (data.type === 'updated') {
            const index = orders.value.findIndex(o => o.id === data.order.id);
            if (index !== -1) {
                orders.value[index] = data.order;
            }
        }
    });
});

onUnmounted(() => {
    unsubscribe('orders');
});
</script>
```

### 6. Audit Trail Integration

```vue
<template>
    <Timeline :value="auditLogs" align="alternate" class="customized-timeline">
        <template #marker="slotProps">
            <span 
                class="flex w-8 h-8 items-center justify-center text-white rounded-full z-1"
                :style="{ backgroundColor: getActivityColor(slotProps.item.action) }"
            >
                <i :class="getActivityIcon(slotProps.item.action)" />
            </span>
        </template>
        
        <template #content="slotProps">
            <Card>
                <template #title>{{ slotProps.item.action }}</template>
                <template #subtitle>
                    {{ formatDate(slotProps.item.timestamp) }} by {{ slotProps.item.user }}
                </template>
                <template #content>
                    <div v-if="slotProps.item.changes">
                        <div v-for="(value, key) in slotProps.item.changes" :key="key">
                            <strong>{{ key }}:</strong>
                            <span class="text-red-500">{{ value.old }}</span>
                            →
                            <span class="text-green-500">{{ value.new }}</span>
                        </div>
                    </div>
                </template>
            </Card>
        </template>
    </Timeline>
</template>
```

### 7. Custom Dashboard Widgets

```vue
<template>
    <div class="grid">
        <div 
            v-for="widget in userWidgets" 
            :key="widget.id"
            :class="widget.gridClass"
        >
            <Card>
                <template #title>
                    <div class="flex justify-between items-center">
                        <span>{{ widget.title }}</span>
                        <Button 
                            icon="pi pi-cog" 
                            text 
                            rounded
                            @click="configureWidget(widget)" 
                        />
                    </div>
                </template>
                <template #content>
                    <component 
                        :is="widget.component" 
                        :config="widget.config"
                    />
                </template>
            </Card>
        </div>
        
        <div class="col-12">
            <Button 
                label="Add Widget" 
                icon="pi pi-plus" 
                outlined
                @click="showWidgetGallery = true" 
            />
        </div>
    </div>
    
    <Dialog v-model:visible="showWidgetGallery" header="Widget Gallery" :modal="true">
        <div class="grid">
            <div 
                v-for="widget in availableWidgets"
                :key="widget.type"
                class="col-12 md:col-6 lg:col-4"
            >
                <Card @click="addWidget(widget)" class="cursor-pointer hover:bg-surface-100">
                    <template #header>
                        <img :src="widget.thumbnail" alt="widget preview" />
                    </template>
                    <template #title>{{ widget.name }}</template>
                    <template #content>{{ widget.description }}</template>
                </Card>
            </div>
        </div>
    </Dialog>
</template>
```

### 8. Multi-language Support

```vue
<template>
    <Dropdown 
        v-model="currentLocale"
        :options="locales"
        optionLabel="name"
        optionValue="code"
        @change="changeLocale"
    >
        <template #value="slotProps">
            <div class="flex items-center gap-2">
                <img 
                    :src="`/flags/${slotProps.value}.png`" 
                    :alt="slotProps.value"
                    class="w-5"
                />
                <span>{{ getLocaleName(slotProps.value) }}</span>
            </div>
        </template>
        
        <template #option="slotProps">
            <div class="flex items-center gap-2">
                <img 
                    :src="`/flags/${slotProps.option.code}.png`" 
                    :alt="slotProps.option.code"
                    class="w-5"
                />
                <span>{{ slotProps.option.name }}</span>
            </div>
        </template>
    </Dropdown>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const currentLocale = ref(locale.value);

const locales = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
];

const changeLocale = (event) => {
    locale.value = event.value;
    localStorage.setItem('userLocale', event.value);
    // Update PrimeVue locale
    primevue.config.locale = localeSettings[event.value];
};
</script>
```

---

## 🎨 Theming & Customization

### Using Theme Designer

PrimeVue offers a **Theme Designer** tool for visual theme customization:

1. **Visual Editor** - UI to edit complete token set
2. **Figma Integration** - Import tokens from Figma
3. **Cloud Storage** - Save themes in cloud
4. **Migration Assistant** - Update themes to latest version

### Custom Theme Example

```javascript
// mytheme.js
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '{indigo.200}',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '{indigo.500}',
            600: '{indigo.600}',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    // ... more surface colors
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    // ... more surface colors
                }
            }
        }
    }
});

export default MyTheme;
```

```javascript
// main.js
import MyTheme from './mytheme';

app.use(PrimeVue, {
    theme: {
        preset: MyTheme
    }
});
```

### Dark Mode Toggle

```vue
<template>
    <Button 
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        @click="toggleDarkMode"
        rounded
        text
    />
</template>

<script setup>
import { usePrimeVue } from 'primevue/config';

const $primevue = usePrimeVue();
const isDark = ref(false);

const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('app-dark');
};

onMounted(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true;
        document.documentElement.classList.add('app-dark');
    }
});

watch(isDark, (value) => {
    localStorage.setItem('theme', value ? 'dark' : 'light');
});
</script>
```

---

## 📚 Additional Resources

### Official Documentation
- **PrimeVue Docs**: https://primevue.org
- **GitHub**: https://github.com/primefaces/primevue
- **PrimeVue Examples**: https://github.com/primefaces/primevue-examples
- **Discord Community**: https://discord.gg/primevue

### Learning Resources
- **Video Tutorials**: PrimeTV YouTube Channel
- **Blog**: PrimeTek Blog
- **Figma UI Kit**: Figma Community

### Support
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Community support
- **Stack Overflow**: Tag `primevue`
- **Professional Support**: Available via PrimeTek

---

## 🎯 Summary: Key Takeaways for ERP Development

### Must-Have Components (Week 1-4)
1. ✅ **DataTable** - The foundation of any ERP
2. ✅ **Form Components** - InputText, Dropdown, Calendar, InputNumber
3. ✅ **Dialog & Toast** - User feedback
4. ✅ **Navigation** - Menubar, Breadcrumb, PanelMenu
5. ✅ **Button & Toolbar** - Actions and organization

### Critical Features to Implement
1. 📊 **Server-side pagination** for DataTable
2. 🔍 **Advanced filtering** with saved preferences
3. ✅ **Form validation** with Zod/Yup
4. 📤 **Export functionality** (CSV, Excel, PDF)
5. 🔐 **Role-based access control**
6. 📱 **Mobile responsiveness**
7. ♿ **Accessibility compliance**

### Performance Optimization
- Use lazy loading for large datasets
- Implement virtual scrolling when needed
- Cache filter configurations
- Debounce search inputs
- Optimize API calls with proper pagination

### Code Quality
- Use TypeScript for type safety
- Implement comprehensive error handling
- Follow Vue 3 Composition API patterns
- Use Pinia for state management
- Write reusable composables

### Testing Strategy
- Unit tests for composables
- Component tests with Vitest
- E2E tests with Playwright/Cypress
- Accessibility testing with axe-core

---

## 📖 Legend

- ✅ **Essential** - Required for basic ERP functionality
- 🔹 **Useful** - Enhances functionality significantly  
- ⚠️ **Optional** - Nice to have, not critical for core operations
- 🔴 **CRITICAL** - Absolute must-have, highest priority
- 🟡 **HIGH** - Very important, implement early
- 🟢 **MEDIUM** - Important for complete system
- 🔵 **LOW** - Enhancement, can be deferred

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**PrimeVue Version**: 4.x  
**Author**: ERP Development Team: Server-side processing with lazy loading
<DataTable 
    :value="products"
    :lazy="true"
    :paginator="true"
    :rows="20"
    :totalRecords="totalRecords"
    :loading="loading"
    @page="loadProducts"
    @sort="loadProducts"
    @filter="loadProducts"
>
```

```vue
// ❌ BAD: Client-side processing with large dataset
<DataTable 
    :value="allProducts"  // 10,000+ records
    :paginator="true"
    :rows="20"
>
```

### 2. Form Validation

```vue
// ✅ GOOD: Structured validation with clear error messages
<Form :resolver="zodResolver(schema)" @submit="onSubmit">
    <InputText name="email" />
    <Message v-if="$form.email?.invalid" severity="error">
        {{ $form.email.error?.message }}
    </Message>
</Form>

// ❌ BAD: Manual validation logic scattered throughout
<InputText v-model="email" @blur="validateEmail" />
```

### 3. State Management

```vue
// ✅ GOOD: Centralized state with Pinia
const store = useProductStore();
const products = computed(() => store.products);
const loading = computed(() => store.loading);

// ❌ BAD: Local state everywhere
const products = ref([]);
const loading = ref(false);
```

### 4. API Integration

```vue
// ✅ GOOD: Composable for reusable API logic
const { data, loading, error, execute } = useApi('/api/products');

// ❌ BAD: Inline fetch calls
const loadData = async () => {
    const response = await fetch('/api/products');
    products.value = await response.json();
};
```

### 5. Accessibility

```vue
// ✅ GOOD: Proper labels and ARIA attributes
<label for="productName">Product Name</label>
<InputText 
    id="productName"
    aria-describedby="productName-help"
/>
<small id="productName-help">Enter the product name</small>

// ❌ BAD: No labels or context
<InputText v-model="name" />
```

### 6. Performance

```vue
// ✅ GOOD: Virtual scrolling for large lists
<DataTable 
    :value="products"
    :virtualScrollerOptions="{ itemSize: 46 }"
    scrollable
    scrollHeight="400px"
>

// ✅ GOOD: Lazy loading images
<Image src="product.jpg" preview :lazy="true" />

// ✅ GOOD: Debounced search
<InputText 
    v-model="searchTerm"
    @input="debounce(search, 300)"
/>
```

### 7. Security

```vue
// ✅ GOOD: Role-based access control
<Button 
    v-if="hasPermission('delete:product')"
    @click="deleteProduct"
/>

// ✅ GOOD: Input sanitization
<InputText 
    v-model="description"
    :maxLength="500"
/>

// ✅ GOOD
