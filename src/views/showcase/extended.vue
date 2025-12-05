<template>
  <div class="extended-showcase">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Extended Components Showcase
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Specialized components for advanced functionality - LinkField, CurrencyInput, DateRangePicker
      </p>
    </div>

    <!-- LinkField Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        LinkField
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Single Selection -->
        <Card>
          <template #title>Single Selection</template>
          <template #content>
            <LinkField
              v-model="singleLink"
              label="Customer"
              description="Select a customer"
              link-type="document"
              :options="customerOptions"
              placeholder="Search customers..."
            />
            <div v-if="singleLink" class="mt-2 text-sm text-muted-color">
              Selected: {{ getCustomerName(singleLink) }}
            </div>
          </template>
        </Card>

        <!-- Multiple Selection -->
        <Card>
          <template #title>Multiple Selection</template>
          <template #content>
            <LinkField
              v-model="multipleLinks"
              label="Tags"
              description="Select multiple tags"
              link-type="tag"
              :multiple="true"
              :options="tagOptions"
              placeholder="Add tags..."
            />
            <div v-if="multipleLinks && multipleLinks.length > 0" class="mt-2 text-sm text-muted-color">
              Selected {{ multipleLinks.length }} tag(s)
            </div>
          </template>
        </Card>

        <!-- Dropdown Mode -->
        <Card>
          <template #title>Dropdown Select</template>
          <template #content>
            <LinkField
              v-model="dropdownValue"
              label="Status"
              description="Select status from list"
              link-type="select"
              :options="statusOptions"
              :searchable="false"
              placeholder="Select status..."
            />
          </template>
        </Card>

        <!-- With Create Option -->
        <Card>
          <template #title>With Create New</template>
          <template #content>
            <LinkField
              v-model="creatableLink"
              label="Category"
              description="Select or create new category"
              link-type="custom"
              :options="categoryOptions"
              :allow-create="true"
              placeholder="Search or create..."
              @create="handleCreateCategory"
            />
          </template>
        </Card>

        <!-- Multiple with Limit -->
        <Card>
          <template #title>Limited Selection</template>
          <template #content>
            <LinkField
              v-model="limitedLinks"
              label="Team Members"
              description="Select up to 3 members"
              link-type="user"
              :multiple="true"
              :max-items="3"
              :options="userOptions"
              placeholder="Select team members..."
            />
            <div class="mt-2 text-xs text-muted-color">
              {{ limitedLinks?.length || 0 }} / 3 selected
            </div>
          </template>
        </Card>

        <!-- Disabled State -->
        <Card>
          <template #title>Disabled State</template>
          <template #content>
            <LinkField
              v-model="disabledLink"
              label="Locked Selection"
              description="This field is disabled"
              link-type="document"
              :options="customerOptions"
              :disabled="true"
            />
          </template>
        </Card>
      </div>
    </section>

    <!-- CurrencyInput Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        CurrencyInput
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- USD Currency -->
        <Card>
          <template #title>USD Currency</template>
          <template #content>
            <FormField label="Price" description="US Dollar amount">
              <CurrencyInput
                v-model="usdAmount"
                currency-code="USD"
                locale="en-US"
                placeholder="Enter amount"
              />
            </FormField>
            <div v-if="usdAmount" class="mt-2 text-sm text-muted-color">
              Value: {{ formatCurrency(usdAmount, 'USD') }}
            </div>
          </template>
        </Card>

        <!-- EUR Currency -->
        <Card>
          <template #title>EUR Currency</template>
          <template #content>
            <FormField label="Betrag" description="Euro amount">
              <CurrencyInput
                v-model="eurAmount"
                currency-code="EUR"
                locale="de-DE"
                placeholder="Betrag eingeben"
              />
            </FormField>
            <div v-if="eurAmount" class="mt-2 text-sm text-muted-color">
              Value: {{ formatCurrency(eurAmount, 'EUR', 'de-DE') }}
            </div>
          </template>
        </Card>

        <!-- GBP Currency -->
        <Card>
          <template #title>GBP Currency</template>
          <template #content>
            <FormField label="Amount" description="British Pound">
              <CurrencyInput
                v-model="gbpAmount"
                currency-code="GBP"
                locale="en-GB"
                placeholder="Enter amount"
              />
            </FormField>
          </template>
        </Card>

        <!-- With Min/Max -->
        <Card>
          <template #title>With Limits</template>
          <template #content>
            <FormField label="Budget" description="Min $100, Max $10,000">
              <CurrencyInput
                v-model="budgetAmount"
                currency-code="USD"
                :min="100"
                :max="10000"
                placeholder="Enter budget"
              />
            </FormField>
          </template>
        </Card>

        <!-- Different Sizes -->
        <Card>
          <template #title>Size Variants</template>
          <template #content>
            <div class="space-y-3">
              <FormField label="Small" size="small">
                <CurrencyInput
                  v-model="smallAmount"
                  size="small"
                  placeholder="Small input"
                />
              </FormField>
              <FormField label="Medium">
                <CurrencyInput
                  v-model="mediumAmount"
                  size="medium"
                  placeholder="Medium input"
                />
              </FormField>
              <FormField label="Large">
                <CurrencyInput
                  v-model="largeAmount"
                  size="large"
                  placeholder="Large input"
                />
              </FormField>
            </div>
          </template>
        </Card>

        <!-- Disabled/Readonly -->
        <Card>
          <template #title>States</template>
          <template #content>
            <div class="space-y-3">
              <FormField label="Read-only">
                <CurrencyInput
                  v-model="readonlyAmount"
                  :readonly="true"
                />
              </FormField>
              <FormField label="Disabled">
                <CurrencyInput
                  v-model="disabledAmount"
                  :disabled="true"
                />
              </FormField>
            </div>
          </template>
        </Card>
      </div>
    </section>

    <!-- AppDataTable Example -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        AppDataTable
      </h2>
      <Card>
        <template #title>Advanced Data Table</template>
        <template #content>
          <AppDataTable
            title="Customer List"
            description="Browse and manage customers with advanced features"
            :columns="tableColumns"
            :data="tableData"
            :loading="tableLoading"
            :toolbar-actions="tableToolbarActions"
            :row-actions="tableRowActions"
            :bulk-actions="tableBulkActions"
            :refreshable="true"
            :searchable="true"
            :filterable="true"
            :column-toggle="true"
            :exportable="true"
            selection-mode="multiple"
            @action="handleTableAction"
            @refresh="handleTableRefresh"
          />
        </template>
      </Card>
    </section>

    <!-- DateRangePicker Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        DateRangePicker
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <template #title>Basic Date Range</template>
          <template #content>
            <DateRangePicker
              v-model="basicDateRange"
              placeholder="Select date range"
            />
            <div v-if="basicDateRange" class="mt-2 text-sm text-muted-color">
              Selected: {{ formatRange(basicDateRange) }}
            </div>
          </template>
        </Card>

        <Card>
          <template #title>With Quick Select</template>
          <template #content>
            <DateRangePicker
              v-model="quickSelectRange"
              :show-quick-select="true"
              placeholder="Select or use presets"
            />
            <div v-if="quickSelectRange" class="mt-2 text-sm text-muted-color">
              Selected: {{ formatRange(quickSelectRange) }}
            </div>
          </template>
        </Card>

        <Card>
          <template #title>Inline Calendar</template>
          <template #content>
            <DateRangePicker
              v-model="inlineRange"
              :inline="true"
              :show-quick-select="false"
            />
          </template>
        </Card>

        <Card>
          <template #title>Custom Presets</template>
          <template #content>
            <DateRangePicker
              v-model="customPresetRange"
              :custom-presets="customPresets"
              placeholder="Select with custom presets"
            />
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import DateRangePicker from '@/components/extended/DateRangePicker.vue'
import LinkField from '@/components/extended/LinkField.vue'
import CurrencyInput from '@/components/extended/CurrencyInput.vue'
import AppDataTable from '@/components/extended/AppDataTable.vue'
import FormField from '@/components/molecules/FormField.vue'
import type { ActionSchema } from '@/types/schema'

// LinkField States
const singleLink = ref(null)
const multipleLinks = ref([])
const dropdownValue = ref(null)
const creatableLink = ref(null)
const limitedLinks = ref([])
const disabledLink = ref({ id: 1, name: 'Locked Customer' })

// LinkField Options
const customerOptions = ref([
  { id: 1, name: 'Acme Corporation', icon: 'pi pi-building' },
  { id: 2, name: 'Tech Solutions Inc', icon: 'pi pi-building' },
  { id: 3, name: 'Global Industries', icon: 'pi pi-building' },
  { id: 4, name: 'Digital Ventures', icon: 'pi pi-building' }
])

const tagOptions = ref([
  { id: 1, name: 'Important', icon: 'pi pi-star', description: 'High priority' },
  { id: 2, name: 'Urgent', icon: 'pi pi-exclamation-circle', description: 'Needs immediate attention' },
  { id: 3, name: 'Follow-up', icon: 'pi pi-calendar', description: 'Requires follow-up' },
  { id: 4, name: 'Review', icon: 'pi pi-eye', description: 'Needs review' }
])

const statusOptions = ref([
  { id: 1, name: 'Active', value: 'active' },
  { id: 2, name: 'Inactive', value: 'inactive' },
  { id: 3, name: 'Pending', value: 'pending' },
  { id: 4, name: 'Archived', value: 'archived' }
])

const categoryOptions = ref([
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Furniture' },
  { id: 3, name: 'Software' },
  { id: 4, name: 'Services' }
])

const userOptions = ref([
  { id: 1, name: 'John Doe', icon: 'pi pi-user' },
  { id: 2, name: 'Jane Smith', icon: 'pi pi-user' },
  { id: 3, name: 'Bob Johnson', icon: 'pi pi-user' },
  { id: 4, name: 'Alice Williams', icon: 'pi pi-user' },
  { id: 5, name: 'Charlie Brown', icon: 'pi pi-user' }
])

// LinkField Methods
const getCustomerName = (value: any): string => {
  if (typeof value === 'object' && value.name) return value.name
  const customer = customerOptions.value.find(c => c.id === value)
  return customer?.name || String(value)
}

const handleCreateCategory = (name: string) => {
  const newCategory = {
    id: categoryOptions.value.length + 1,
    name
  }
  categoryOptions.value.push(newCategory)
  creatableLink.value = newCategory
}

// CurrencyInput States
const usdAmount = ref(1299.99)
const eurAmount = ref(999.50)
const gbpAmount = ref(799.00)
const budgetAmount = ref(5000)
const smallAmount = ref(null)
const mediumAmount = ref(null)
const largeAmount = ref(null)
const readonlyAmount = ref(1500)
const disabledAmount = ref(2500)

// CurrencyInput Methods
const formatCurrency = (amount: number | null, currency = 'USD', locale = 'en-US'): string => {
  if (amount === null) return ''
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

// AppDataTable States
const tableLoading = ref(false)
const tableColumns = ref([
  { field: 'name', header: 'Name', type: 'text', sortable: true, filterable: true },
  { field: 'email', header: 'Email', type: 'email', sortable: true },
  { field: 'status', header: 'Status', type: 'badge', sortable: true, filterable: true },
  { field: 'createdAt', header: 'Created', type: 'date', sortable: true }
])

const tableData = ref([
  { id: 1, name: 'Acme Corp', email: 'contact@acme.com', status: 'active', createdAt: new Date('2024-01-15') },
  { id: 2, name: 'Tech Solutions', email: 'info@techsolutions.com', status: 'active', createdAt: new Date('2024-02-01') },
  { id: 3, name: 'Global Industries', email: 'hello@global.com', status: 'inactive', createdAt: new Date('2024-01-20') },
  { id: 4, name: 'Digital Ventures', email: 'support@digital.com', status: 'pending', createdAt: new Date('2024-02-10') }
])

const tableToolbarActions = ref<ActionSchema[]>([
  { id: 'create', label: 'Add Customer', icon: 'pi pi-plus', variant: 'primary', type: 'button' },
  { id: 'import', label: 'Import', icon: 'pi pi-upload', variant: 'secondary', type: 'button' }
])

const tableRowActions = ref<ActionSchema[]>([
  { id: 'view', label: 'View', icon: 'pi pi-eye', type: 'button' },
  { id: 'edit', label: 'Edit', icon: 'pi pi-pencil', type: 'button' },
  { id: 'delete', label: 'Delete', icon: 'pi pi-trash', type: 'button', confirm: 'Are you sure?' }
])

const tableBulkActions = ref<ActionSchema[]>([
  { id: 'bulk-delete', label: 'Delete Selected', icon: 'pi pi-trash', variant: 'danger', type: 'button' },
  { id: 'bulk-export', label: 'Export Selected', icon: 'pi pi-download', variant: 'secondary', type: 'button' }
])

// AppDataTable Methods
const handleTableAction = (action: string, data?: any) => {
  console.log('Table action:', action, data)
}

const handleTableRefresh = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 1000)
}

// Date range states
const basicDateRange = ref<[Date, Date] | null>(null)
const quickSelectRange = ref<[Date, Date] | null>(null)
const inlineRange = ref<[Date, Date] | null>(null)
const customPresetRange = ref<[Date, Date] | null>(null)

// Custom presets for demonstration
const customPresets = [
  {
    label: 'Current Quarter',
    getValue: () => {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3)
      const start = new Date(now.getFullYear(), quarter * 3, 1)
      const end = new Date(now.getFullYear(), quarter * 3 + 3, 0)
      return [start, end] as [Date, Date]
    }
  },
  {
    label: 'Last Quarter',
    getValue: () => {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3) - 1
      const year = quarter < 0 ? now.getFullYear() - 1 : now.getFullYear()
      const adjustedQuarter = quarter < 0 ? 3 : quarter
      const start = new Date(year, adjustedQuarter * 3, 1)
      const end = new Date(year, adjustedQuarter * 3 + 3, 0)
      return [start, end] as [Date, Date]
    }
  },
  {
    label: 'Year to Date',
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1)
      const end = new Date()
      return [start, end] as [Date, Date]
    }
  }
]

// Format date range for display
const formatRange = (range: [Date, Date]): string => {
  if (!range || range.length !== 2) return ''

  const start = range[0]
  const end = range[1]

  if (start.getTime() === end.getTime()) {
    return start.toLocaleDateString()
  }

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}
</script>

<style scoped>
.extended-showcase {
  @apply max-w-7xl mx-auto p-6;
}

/* Custom card styling for better showcase presentation */
:deep(.p-card) {
  @apply h-full;
}

:deep(.p-card-body) {
  @apply h-full flex flex-col;
}

:deep(.p-card-content) {
  @apply flex-1 flex flex-col justify-center;
}
</style>