<template>
  <div class="organisms-showcase">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Organisms Showcase
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Complex components built from molecules and atoms - DataTableCrud, FormBuilder, FormDrawer, and data cells
      </p>
    </div>

    <!-- DataTableCrud Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        DataTableCrud
      </h2>
      <div class="grid grid-cols-1 gap-6">
        <!-- Basic DataTable -->
        <Card>
          <template #title>Basic Customer DataTable</template>
          <template #content>
            <DataTableCrud
              :schema="customerSchema"
              :data="mockCustomers"
              :loading="false"
              @action="handleTableAction"
            />
          </template>
        </Card>

        <!-- Loading State -->
        <Card>
          <template #title>Loading State</template>
          <template #content>
            <DataTableCrud
              :schema="customerSchema"
              :data="[]"
              :loading="true"
            />
          </template>
        </Card>

        <!-- Empty State -->
        <Card>
          <template #title>Empty State</template>
          <template #content>
            <DataTableCrud
              :schema="customerSchema"
              :data="[]"
              :loading="false"
              @action="handleTableAction"
            />
          </template>
        </Card>
      </div>
    </section>

    <!-- FormBuilder Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        FormBuilder
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Customer Form -->
        <Card>
          <template #title>Customer Form</template>
          <template #content>
            <FormBuilder
              :schema="customerFormSchema"
              v-model="customerFormData"
              mode="create"
              @submit="handleFormSubmit"
              @cancel="handleFormCancel"
            />
          </template>
        </Card>

        <!-- Product Form -->
        <Card>
          <template #title>Product Form (Edit Mode)</template>
          <template #content>
            <FormBuilder
              :schema="productFormSchema"
              v-model="productFormData"
              mode="edit"
              @submit="handleFormSubmit"
              @cancel="handleFormCancel"
            />
          </template>
        </Card>

        <!-- Read-only Form -->
        <Card>
          <template #title>Read-only View</template>
          <template #content>
            <FormBuilder
              :schema="customerFormSchema"
              v-model="customerViewData"
              mode="view"
            />
          </template>
        </Card>

        <!-- Compact Form -->
        <Card>
          <template #title>Compact Layout</template>
          <template #content>
            <FormBuilder
              :schema="compactFormSchema"
              v-model="compactFormData"
              mode="create"
              layout="compact"
              @submit="handleFormSubmit"
              @cancel="handleFormCancel"
            />
          </template>
        </Card>
      </div>
    </section>

    <!-- FormDrawer Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        FormDrawer
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Create Form Drawer -->
        <Button
          label="Create Customer"
          icon="pi pi-plus"
          @click="showCreateDrawer = true"
        />

        <!-- Edit Form Drawer -->
        <Button
          label="Edit Customer"
          icon="pi pi-pencil"
          severity="secondary"
          @click="showEditDrawer = true"
        />

        <!-- View Form Drawer -->
        <Button
          label="View Customer"
          icon="pi pi-eye"
          severity="help"
          @click="showViewDrawer = true"
        />

        <!-- Large Form Drawer -->
        <Button
          label="Large Form"
          icon="pi pi-window-maximize"
          severity="warn"
          @click="showLargeDrawer = true"
        />
      </div>

      <!-- Form Drawers -->
      <FormDrawer
        v-model:visible="showCreateDrawer"
        title="Create Customer"
        :schema="customerFormSchema"
        v-model:data="newCustomerData"
        mode="create"
        @save="handleDrawerSave"
        @cancel="handleDrawerCancel"
      />

      <FormDrawer
        v-model:visible="showEditDrawer"
        title="Edit Customer"
        :schema="customerFormSchema"
        v-model:data="editCustomerData"
        mode="edit"
        @save="handleDrawerSave"
        @cancel="handleDrawerCancel"
      />

      <FormDrawer
        v-model:visible="showViewDrawer"
        title="Customer Details"
        :schema="customerFormSchema"
        v-model:data="viewCustomerData"
        mode="view"
      />

      <FormDrawer
        v-model:visible="showLargeDrawer"
        title="Large Form"
        :schema="largeFormSchema"
        v-model:data="largeFormData"
        mode="create"
        size="large"
        @save="handleDrawerSave"
        @cancel="handleDrawerCancel"
      />
    </section>

    <!-- Data Cells Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Data Cells
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Text Cell -->
        <Card>
          <template #title>TextCell</template>
          <template #content>
            <div class="space-y-4">
              <TextCell :value="'Simple text'" />
              <TextCell 
                :value="'Very long text that might need truncation to fit properly in the cell'"
                :max-length="30"
              />
              <TextCell :value="''" empty-text="No data" />
            </div>
          </template>
        </Card>

        <!-- Number Cell -->
        <Card>
          <template #title>NumberCell</template>
          <template #content>
            <div class="space-y-4">
              <NumberCell :value="1234.56" />
              <NumberCell :value="1234567.89" format="currency" currency="USD" />
              <NumberCell :value="0.75" format="percentage" />
              <NumberCell :value="1024" format="bytes" />
            </div>
          </template>
        </Card>

        <!-- Date Cell -->
        <Card>
          <template #title>DateCell</template>
          <template #content>
            <div class="space-y-4">
              <DateCell :value="new Date()" />
              <DateCell :value="new Date()" format="short" />
              <DateCell :value="new Date()" format="relative" />
              <DateCell :value="new Date('2024-01-01')" format="relative" />
            </div>
          </template>
        </Card>

        <!-- Email Cell -->
        <Card>
          <template #title>EmailCell</template>
          <template #content>
            <div class="space-y-4">
              <EmailCell value="user@example.com" />
              <EmailCell value="very.long.email.address@subdomain.example.com" />
              <EmailCell value="" empty-text="No email" />
            </div>
          </template>
        </Card>

        <!-- Phone Cell -->
        <Card>
          <template #title>PhoneCell</template>
          <template #content>
            <div class="space-y-4">
              <PhoneCell value="+1-555-123-4567" />
              <PhoneCell value="5551234567" format="+1 (###) ###-####" />
              <PhoneCell value="" empty-text="No phone" />
            </div>
          </template>
        </Card>

        <!-- Badge Cell -->
        <Card>
          <template #title>BadgeCell</template>
          <template #content>
            <div class="space-y-4">
              <BadgeCell value="active" variant="success" />
              <BadgeCell value="pending" variant="warning" />
              <BadgeCell value="inactive" variant="danger" />
              <BadgeCell value="draft" variant="secondary" />
              <BadgeCell value="premium" variant="info" />
            </div>
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTableCrud from '@/components/organisms/DataTableCrud.vue'
import FormBuilder from '@/components/organisms/FormBuilder.vue'
import FormDrawer from '@/components/organisms/FormDrawer.vue'
import TextCell from '@/components/organisms/cells/TextCell.vue'
import NumberCell from '@/components/organisms/cells/NumberCell.vue'
import DateCell from '@/components/organisms/cells/DateCell.vue'
import EmailCell from '@/components/organisms/cells/EmailCell.vue'
import PhoneCell from '@/components/organisms/cells/PhoneCell.vue'
import BadgeCell from '@/components/organisms/cells/BadgeCell.vue'
import type { DocumentSchema, FormSection, FieldSchema } from '@/types/schema'

// Real schemas
import customerSchemaImport from '@/schemas/customer.json'
import productSchemaImport from '@/schemas/product.json'

const customerSchema: DocumentSchema = customerSchemaImport as DocumentSchema

const customerFormSchema: FormSection[] = customerSchemaImport.formView.sections as FormSection[]

const productFormSchema: FormSection[] = productSchemaImport.formView.sections as FormSection[]

const compactFormSchema: FormSection[] = [
  {
    title: 'Quick Entry',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, size: 'small' },
      { name: 'email', label: 'Email', type: 'email', required: true, size: 'small' },
      { name: 'status', label: 'Status', type: 'select', size: 'small',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ]
      }
    ]
  }
]

const largeFormSchema: FormSection[] = [
  {
    title: 'Personal Information',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true, size: 'medium' },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true, size: 'medium' },
      { name: 'email', label: 'Email', type: 'email', required: true, size: 'medium' },
      { name: 'phone', label: 'Phone', type: 'phone', size: 'medium' },
      { name: 'birthDate', label: 'Birth Date', type: 'date', size: 'medium' }
    ]
  },
  {
    title: 'Address Information',
    fields: [
      { name: 'address1', label: 'Address Line 1', type: 'text', size: 'large' },
      { name: 'address2', label: 'Address Line 2', type: 'text', size: 'large' },
      { name: 'city', label: 'City', type: 'text', size: 'medium' },
      { name: 'state', label: 'State/Province', type: 'text', size: 'medium' },
      { name: 'postalCode', label: 'Postal Code', type: 'text', size: 'small' },
      { name: 'country', label: 'Country', type: 'select', size: 'medium',
        options: [
          { label: 'United States', value: 'US' },
          { label: 'Canada', value: 'CA' },
          { label: 'United Kingdom', value: 'GB' }
        ]
      }
    ]
  },
  {
    title: 'Additional Information',
    fields: [
      { name: 'company', label: 'Company', type: 'text', size: 'medium' },
      { name: 'jobTitle', label: 'Job Title', type: 'text', size: 'medium' },
      { name: 'website', label: 'Website', type: 'url', size: 'medium' },
      { name: 'notes', label: 'Notes', type: 'textarea', size: 'large' }
    ]
  }
]

// Mock data based on real schemas
const mockCustomers = [
  {
    id: 1,
    name: 'Acme Corporation',
    email: 'contact@acme.corp',
    phone: '+1-555-123-4567',
    type: 'company',
    status: 'active',
    contact_person: 'John Smith',
    website: 'https://acme.corp',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1-555-987-6543',
    type: 'individual',
    status: 'active',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 3,
    name: 'TechStart Inc',
    email: 'info@techstart.com',
    phone: '+1-555-456-7890',
    type: 'company',
    status: 'inactive',
    contact_person: 'Sarah Wilson',
    website: 'https://techstart.com',
    createdAt: new Date('2024-01-10')
  }
]

// Form data based on real schemas
const customerFormData = reactive({
  type: 'individual',
  name: '',
  email: '',
  phone: '',
  status: 'active',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US'
})

const productFormData = reactive({
  name: 'Sample Product',
  sku: 'SP-001',
  price: 99.99,
  category: 'electronics',
  description: 'A sample product for demonstration',
  status: 'active'
})

const customerViewData = reactive({
  type: 'company',
  name: 'Acme Corporation',
  email: 'contact@acme.corp',
  phone: '+1-555-123-4567',
  status: 'active',
  contact_person: 'John Smith',
  website: 'https://acme.corp',
  address_line1: '123 Business Ave',
  city: 'New York',
  state: 'NY',
  postal_code: '10001',
  country: 'US'
})

const compactFormData = reactive({
  name: '',
  email: '',
  status: 'active'
})

const largeFormData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: null,
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  company: '',
  jobTitle: '',
  website: '',
  notes: ''
})

// Form drawer states
const showCreateDrawer = ref(false)
const showEditDrawer = ref(false)
const showViewDrawer = ref(false)
const showLargeDrawer = ref(false)

const newCustomerData = reactive({
  type: 'individual',
  name: '',
  email: '',
  phone: '',
  status: 'active',
  address_line1: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US'
})

const editCustomerData = reactive({
  type: 'individual',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  status: 'active',
  address_line1: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  postal_code: '12345',
  country: 'US'
})

const viewCustomerData = reactive({
  type: 'individual',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '+1-555-987-6543',
  status: 'active',
  address_line1: '456 Oak Ave',
  city: 'Springfield',
  state: 'IL',
  postal_code: '62701',
  country: 'US'
})

// Event handlers
const handleTableAction = (action: any, row?: any) => {
  console.log('Table action:', action.id, row)
}

const handleFormSubmit = (data: any) => {
  console.log('Form submitted:', data)
}

const handleFormCancel = () => {
  console.log('Form cancelled')
}

const handleDrawerSave = (data: any) => {
  console.log('Drawer saved:', data)
  showCreateDrawer.value = false
  showEditDrawer.value = false
  showLargeDrawer.value = false
}

const handleDrawerCancel = () => {
  console.log('Drawer cancelled')
  showCreateDrawer.value = false
  showEditDrawer.value = false
  showLargeDrawer.value = false
}
</script>

<style scoped>
.organisms-showcase {
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
  @apply flex-1;
}

/* Ensure proper spacing in cell examples */
.space-y-4 > * + * {
  @apply mt-4;
}
</style>