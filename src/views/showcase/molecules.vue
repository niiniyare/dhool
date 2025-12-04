<template>
  <div class="molecules-showcase">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Molecules Showcase
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Composite components built from multiple atoms - FormField, StatCard, ActionMenu, EmptyState
      </p>
    </div>

    <!-- FormField Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        FormField
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Basic FormField -->
        <Card>
          <template #title>Basic Field</template>
          <template #content>
            <FormField
              label="Email Address"
              description="Enter your email address"
              required
            >
              <InputText 
                v-model="email"
                placeholder="Enter email"
                class="w-full"
              />
            </FormField>
          </template>
        </Card>

        <!-- Field with Error -->
        <Card>
          <template #title>Field with Error</template>
          <template #content>
            <FormField
              label="Password"
              error="Password must be at least 8 characters"
              required
            >
              <Password 
                v-model="password"
                placeholder="Enter password"
                class="w-full"
                :feedback="false"
              />
            </FormField>
          </template>
        </Card>

        <!-- Disabled Field -->
        <Card>
          <template #title>Disabled Field</template>
          <template #content>
            <FormField
              label="Read-only Field"
              description="This field is read-only"
              disabled
            >
              <InputText 
                value="Read-only value"
                disabled
                class="w-full"
              />
            </FormField>
          </template>
        </Card>

        <!-- Small Size -->
        <Card>
          <template #title>Small Size</template>
          <template #content>
            <FormField
              label="Small Field"
              description="Compact field layout"
              size="small"
            >
              <InputText 
                v-model="smallField"
                placeholder="Small field"
                class="w-full"
                size="small"
              />
            </FormField>
          </template>
        </Card>

        <!-- Large Size -->
        <Card>
          <template #title>Large Size</template>
          <template #content>
            <FormField
              label="Large Field"
              description="Spacious field layout"
              size="large"
            >
              <InputText 
                v-model="largeField"
                placeholder="Large field"
                class="w-full"
              />
            </FormField>
          </template>
        </Card>

        <!-- Dropdown Field -->
        <Card>
          <template #title>Dropdown Field</template>
          <template #content>
            <FormField
              label="Select Option"
              description="Choose from the list"
            >
              <Dropdown
                v-model="selectedOption"
                :options="dropdownOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select an option"
                class="w-full"
              />
            </FormField>
          </template>
        </Card>
      </div>
    </section>

    <!-- StatCard Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        StatCard
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Basic StatCard -->
        <StatCard
          title="Total Users"
          :value="1234"
          icon="pi pi-users"
          variant="primary"
        />

        <!-- StatCard with Positive Trend -->
        <StatCard
          title="Revenue"
          value="$45,600"
          :trend="12.5"
          trend-label="vs last month"
          icon="pi pi-dollar"
          variant="success"
        />

        <!-- StatCard with Negative Trend -->
        <StatCard
          title="Active Sessions"
          :value="89"
          :trend="-5.2"
          trend-label="vs yesterday"
          icon="pi pi-chart-line"
          variant="warning"
        />

        <!-- Loading StatCard -->
        <StatCard
          title="Processing"
          value="..."
          icon="pi pi-spin pi-spinner"
          variant="info"
          :loading="true"
        />

        <!-- Custom Formatted Value -->
        <StatCard
          title="Data Usage"
          :value="1024000"
          :formatter="formatBytes"
          icon="pi pi-database"
          variant="danger"
        />

        <!-- Without Trend -->
        <StatCard
          title="Total Orders"
          :value="567"
          icon="pi pi-shopping-cart"
        />

        <!-- Custom Colors -->
        <StatCard
          title="Custom Colors"
          :value="42"
          icon="pi pi-star"
          icon-color="#f59e0b"
          icon-bg-color="#fef3c7"
        />

        <!-- Zero Trend -->
        <StatCard
          title="Stable Metric"
          :value="100"
          :trend="0"
          trend-label="no change"
          icon="pi pi-minus-circle"
        />
      </div>
    </section>

    <!-- ActionMenu Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        ActionMenu
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Single Action -->
        <Card>
          <template #title>Single Action</template>
          <template #content>
            <ActionMenu
              :actions="singleAction"
              @action="handleAction"
            />
          </template>
        </Card>

        <!-- Multiple Buttons -->
        <Card>
          <template #title>Multiple Buttons</template>
          <template #content>
            <ActionMenu
              :actions="multipleActions"
              layout="buttons"
              @action="handleAction"
            />
          </template>
        </Card>

        <!-- Dropdown Menu -->
        <Card>
          <template #title>Dropdown Menu</template>
          <template #content>
            <ActionMenu
              :actions="dropdownActions"
              layout="dropdown"
              @action="handleAction"
            />
          </template>
        </Card>

        <!-- Auto Layout -->
        <Card>
          <template #title>Auto Layout</template>
          <template #content>
            <ActionMenu
              :actions="autoLayoutActions"
              layout="auto"
              :max-buttons="2"
              @action="handleAction"
            />
          </template>
        </Card>

        <!-- Different Alignments -->
        <Card>
          <template #title>Center Aligned</template>
          <template #content>
            <ActionMenu
              :actions="alignmentActions"
              align="center"
              @action="handleAction"
            />
          </template>
        </Card>

        <!-- Right Aligned -->
        <Card>
          <template #title>Right Aligned</template>
          <template #content>
            <ActionMenu
              :actions="alignmentActions"
              align="right"
              @action="handleAction"
            />
          </template>
        </Card>
      </div>
    </section>

    <!-- EmptyState Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        EmptyState
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Default Empty State -->
        <Card class="h-80">
          <template #title>Default Empty State</template>
          <template #content>
            <EmptyState
              title="No data found"
              description="There are no items to display at the moment."
              action-label="Add Item"
              action-icon="pi pi-plus"
              @action="handleEmptyAction"
            />
          </template>
        </Card>

        <!-- Custom Icon and Colors -->
        <Card class="h-80">
          <template #title>Custom Empty State</template>
          <template #content>
            <EmptyState
              icon="pi pi-search"
              icon-color="#3b82f6"
              title="No search results"
              description="Try adjusting your search criteria or browse available categories."
              action-label="Clear Filters"
              action-icon="pi pi-filter-slash"
              variant="primary"
              @action="handleEmptyAction"
            />
          </template>
        </Card>

        <!-- Error State -->
        <Card class="h-80">
          <template #title>Error State</template>
          <template #content>
            <EmptyState
              icon="pi pi-exclamation-triangle"
              title="Something went wrong"
              description="An error occurred while loading the data. Please try again."
              action-label="Retry"
              action-icon="pi pi-refresh"
              variant="danger"
              @action="handleEmptyAction"
            />
          </template>
        </Card>

        <!-- Success State -->
        <Card class="h-80">
          <template #title>Success State</template>
          <template #content>
            <EmptyState
              icon="pi pi-check-circle"
              title="All done!"
              description="You have completed all tasks. Great job!"
              action-label="Start New"
              action-icon="pi pi-plus-circle"
              variant="success"
              @action="handleEmptyAction"
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
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import FormField from '@/components/molecules/FormField.vue'
import StatCard from '@/components/molecules/StatCard.vue'
import ActionMenu from '@/components/molecules/ActionMenu.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import type { ActionSchema } from '@/types/schema'

// Form data
const email = ref('')
const password = ref('')
const smallField = ref('')
const largeField = ref('')
const selectedOption = ref(null)

// Dropdown options
const dropdownOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' }
]

// Action definitions
const singleAction: ActionSchema[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: 'pi pi-pencil',
    variant: 'primary',
    type: 'button'
  }
]

const multipleActions: ActionSchema[] = [
  {
    id: 'view',
    label: 'View',
    icon: 'pi pi-eye',
    variant: 'secondary',
    type: 'button'
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: 'pi pi-pencil',
    variant: 'primary',
    type: 'button'
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: 'pi pi-trash',
    variant: 'danger',
    type: 'button',
    confirm: 'Are you sure you want to delete this item?'
  }
]

const dropdownActions: ActionSchema[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: 'pi pi-eye',
    type: 'button'
  },
  {
    id: 'edit',
    label: 'Edit Item',
    icon: 'pi pi-pencil',
    type: 'button'
  },
  {
    id: 'sep1',
    type: 'separator'
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: 'pi pi-copy',
    type: 'button'
  },
  {
    id: 'export',
    label: 'Export',
    icon: 'pi pi-download',
    type: 'button'
  },
  {
    id: 'sep2',
    type: 'separator'
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: 'pi pi-trash',
    type: 'button',
    confirm: 'Are you sure?'
  }
]

const autoLayoutActions: ActionSchema[] = [
  {
    id: 'save',
    label: 'Save',
    icon: 'pi pi-save',
    variant: 'primary',
    type: 'button'
  },
  {
    id: 'cancel',
    label: 'Cancel',
    icon: 'pi pi-times',
    variant: 'secondary',
    type: 'button'
  },
  {
    id: 'more',
    label: 'More Options',
    icon: 'pi pi-ellipsis-h',
    type: 'button'
  }
]

const alignmentActions: ActionSchema[] = [
  {
    id: 'approve',
    label: 'Approve',
    icon: 'pi pi-check',
    variant: 'success',
    type: 'button'
  },
  {
    id: 'reject',
    label: 'Reject',
    icon: 'pi pi-times',
    variant: 'danger',
    type: 'button'
  }
]

// Event handlers
const handleAction = (action: ActionSchema) => {
  console.log('Action triggered:', action.id)
}

const handleEmptyAction = () => {
  console.log('Empty state action triggered')
}

// Custom formatter for StatCard
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.molecules-showcase {
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