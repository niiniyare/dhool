<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">PrimeVue 4 Component Showcase</h1>
      <p class="text-gray-600 dark:text-gray-300">Explore all PrimeVue 4 components with proper usage patterns</p>
    </div>

    <TabView>
      <TabPanel header="Forms">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Buttons -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold mb-3">Buttons</h3>
            <div class="flex flex-wrap gap-3">
              <Button label="Default" />
              <Button label="Primary" severity="primary" />
              <Button label="Success" severity="success" />
              <Button label="Warning" severity="warn" />
              <Button label="Danger" severity="danger" />
              <Button label="Secondary" severity="secondary" />
            </div>
            <div class="flex flex-wrap gap-3">
              <Button label="Rounded" rounded />
              <Button label="Text" text />
              <Button label="Outlined" outlined />
              <Button label="Raised" raised />
              <Button icon="pi pi-check" />
              <Button icon="pi pi-check" label="Icon" />
            </div>
          </div>

          <!-- Input Components -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold mb-3">Input Components</h3>
            <div class="space-y-3">
              <div class="flex flex-col gap-2">
                <label class="font-medium">InputText</label>
                <InputText v-model="formData.text" placeholder="Enter text" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium">Password</label>
                <Password v-model="formData.password" placeholder="Enter password" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium">Textarea</label>
                <Textarea v-model="formData.textarea" placeholder="Enter description" rows="3" />
              </div>
            </div>
          </div>

          <!-- Select Components -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold mb-3">Selection</h3>
            <div class="space-y-3">
              <div class="flex flex-col gap-2">
                <label class="font-medium">Select</label>
                <Select 
                  v-model="formData.selectedCity" 
                  :options="cities" 
                  optionLabel="name" 
                  placeholder="Select a City" 
                  class="w-full"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium">MultiSelect</label>
                <MultiSelect 
                  v-model="formData.selectedCities" 
                  :options="cities" 
                  optionLabel="name" 
                  placeholder="Select Cities" 
                  :maxSelectedLabels="3" 
                  class="w-full"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium">AutoComplete</label>
                <AutoComplete 
                  v-model="formData.selectedCountry" 
                  :suggestions="filteredCountries" 
                  @complete="searchCountry" 
                  placeholder="Search countries"
                />
              </div>
            </div>
          </div>

          <!-- Date and Numbers -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold mb-3">Date & Numbers</h3>
            <div class="space-y-3">
              <div class="flex flex-col gap-2">
                <label class="font-medium">DatePicker</label>
                <DatePicker v-model="formData.date" showIcon placeholder="Select date" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium">InputNumber</label>
                <InputNumber v-model="formData.number" placeholder="Enter number" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium">Slider</label>
                <Slider v-model="formData.slider" />
                <div class="text-center text-sm text-gray-600">Value: {{ formData.slider }}</div>
              </div>
            </div>
          </div>

          <!-- Toggle Components -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold mb-3">Toggles</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <InputSwitch v-model="formData.switch" />
                <label>InputSwitch</label>
              </div>
              <div class="flex items-center gap-3">
                <Checkbox v-model="formData.checkbox" binary />
                <label>Checkbox</label>
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium">RadioButton</label>
                <div class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <RadioButton v-model="formData.radio" inputId="option1" value="Option 1" />
                    <label for="option1">Option 1</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton v-model="formData.radio" inputId="option2" value="Option 2" />
                    <label for="option2">Option 2</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- File Upload -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold mb-3">File Upload</h3>
            <FileUpload mode="basic" name="demo" accept="image/*" :maxFileSize="1000000" />
          </div>
        </div>
      </TabPanel>

      <TabPanel header="Data">
        <div class="space-y-6">
          <!-- DataTable -->
          <div>
            <h3 class="text-xl font-semibold mb-4">DataTable</h3>
            <DataTable 
              :value="customers" 
              :paginator="true" 
              :rows="5" 
              :rowsPerPageOptions="[5, 10, 20]"
              scrollable 
              scrollHeight="400px"
              :globalFilterFields="['name', 'country.name', 'representative.name', 'status']"
            >
              <template #header>
                <div class="flex justify-between">
                  <Button icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                  <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                    <InputText v-model="filters.global.value" placeholder="Keyword Search" class="pl-10" />
                  </span>
                </div>
              </template>
              <Column field="name" header="Name" sortable></Column>
              <Column field="country.name" header="Country" sortable>
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <img :alt="slotProps.data.country.name" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" class="w-6" />
                    <span>{{ slotProps.data.country.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="representative.name" header="Agent" sortable>
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <img :alt="slotProps.data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.representative.image}`" class="w-8 h-8 rounded-full" />
                    <span>{{ slotProps.data.representative.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- TreeTable -->
          <div>
            <h3 class="text-xl font-semibold mb-4">TreeTable</h3>
            <TreeTable :value="treeNodes" :paginator="true" :rows="5">
              <Column field="name" header="Name" :expander="true"></Column>
              <Column field="size" header="Size"></Column>
              <Column field="type" header="Type"></Column>
            </TreeTable>
          </div>

          <!-- DataView -->
          <div>
            <h3 class="text-xl font-semibold mb-4">DataView</h3>
            <DataView :value="products" layout="grid">
              <template #grid="slotProps">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="item in slotProps.items" :key="item.id" class="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
                    <div class="flex flex-col items-center gap-3">
                      <img class="w-24 h-24 object-cover rounded" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                      <div class="text-lg font-semibold">{{ item.name }}</div>
                      <div class="text-xl font-bold">${{ item.price }}</div>
                      <Button label="Add to Cart" icon="pi pi-shopping-cart" />
                    </div>
                  </div>
                </div>
              </template>
            </DataView>
          </div>
        </div>
      </TabPanel>

      <TabPanel header="Feedback">
        <div class="space-y-6">
          <!-- Messages -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Messages</h3>
            <div class="space-y-3">
              <Message severity="success" text="Success Message" />
              <Message severity="info" text="Info Message" />
              <Message severity="warn" text="Warning Message" />
              <Message severity="error" text="Error Message" />
            </div>
          </div>

          <!-- Toast Triggers -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Toast Notifications</h3>
            <div class="flex flex-wrap gap-3">
              <Button label="Success Toast" severity="success" @click="showToast('success', 'Success!', 'Operation completed successfully')" />
              <Button label="Info Toast" severity="info" @click="showToast('info', 'Information', 'Here is some information')" />
              <Button label="Warning Toast" severity="warn" @click="showToast('warn', 'Warning!', 'Please be careful')" />
              <Button label="Error Toast" severity="error" @click="showToast('error', 'Error!', 'Something went wrong')" />
            </div>
          </div>

          <!-- Dialogs -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Dialogs</h3>
            <div class="flex flex-wrap gap-3">
              <Button label="Show Dialog" @click="showDialog = true" />
              <Button label="Confirmation" severity="warn" @click="confirm()" />
              <Button label="Delete Confirmation" severity="danger" @click="confirmDelete()" />
            </div>
          </div>

          <!-- Progress -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Progress</h3>
            <div class="space-y-4">
              <div>
                <label class="block mb-2 font-medium">ProgressBar</label>
                <ProgressBar :value="progressValue" />
              </div>
              <div>
                <label class="block mb-2 font-medium">ProgressSpinner</label>
                <ProgressSpinner />
              </div>
            </div>
          </div>

          <!-- Skeleton -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Skeleton</h3>
            <div class="space-y-2">
              <Skeleton height="2rem" />
              <Skeleton height="1rem" width="70%" />
              <Skeleton height="1rem" width="50%" />
            </div>
          </div>
        </div>

        <!-- Dialog Component -->
        <Dialog v-model:visible="showDialog" modal header="Sample Dialog" :style="{ width: '25rem' }">
          <span class="text-surface-500 dark:text-surface-400 block mb-8">This is a sample dialog content.</span>
          <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="showDialog = false"></Button>
            <Button type="button" label="Save" @click="showDialog = false"></Button>
          </div>
        </Dialog>
      </TabPanel>

      <TabPanel header="Navigation">
        <div class="space-y-6">
          <!-- Menu -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Menu</h3>
            <Menu :model="menuItems" />
          </div>

          <!-- Breadcrumb -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Breadcrumb</h3>
            <Breadcrumb :model="breadcrumbItems" />
          </div>

          <!-- Steps -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Steps</h3>
            <Steps :model="stepItems" :readonly="false" />
          </div>

          <!-- TabMenu -->
          <div>
            <h3 class="text-xl font-semibold mb-4">TabMenu</h3>
            <TabMenu :model="tabMenuItems" />
          </div>

          <!-- Dock -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Dock</h3>
            <Dock :model="dockItems" />
          </div>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { FilterMatchMode } from '@primevue/core/api'

const toast = useToast()
const confirm = useConfirm()

// Form data
const formData = ref({
  text: '',
  password: '',
  textarea: '',
  selectedCity: null,
  selectedCities: [],
  selectedCountry: null,
  date: null,
  number: null,
  slider: 50,
  switch: false,
  checkbox: false,
  radio: 'Option 1'
})

// Dialog state
const showDialog = ref(false)
const progressValue = ref(60)

// Select options
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
])

const countries = ref(['Australia', 'Brazil', 'China', 'Egypt', 'France', 'Germany', 'India', 'Japan', 'Spain', 'United States'])
const filteredCountries = ref([])

// DataTable data
const customers = ref([
  {
    id: 1000,
    name: 'James Butt',
    country: { name: 'Algeria', code: 'dz' },
    representative: { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    status: 'qualified'
  },
  {
    id: 1001,
    name: 'Josephine Darakjy',
    country: { name: 'Egypt', code: 'eg' },
    representative: { name: 'Amy Elsner', image: 'amyelsner.png' },
    status: 'unqualified'
  },
  {
    id: 1002,
    name: 'Art Venere',
    country: { name: 'Panama', code: 'pa' },
    representative: { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    status: 'negotiation'
  }
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// TreeTable data
const treeNodes = ref([
  {
    key: '0',
    data: { name: 'Applications', size: '100kb', type: 'Folder' },
    children: [
      { key: '0-0', data: { name: 'Vue', size: '25kb', type: 'Folder' } },
      { key: '0-1', data: { name: 'Angular', size: '75kb', type: 'Folder' } }
    ]
  },
  {
    key: '1',
    data: { name: 'Documents', size: '75kb', type: 'Folder' },
    children: [
      { key: '1-0', data: { name: 'Work', size: '55kb', type: 'Folder' } },
      { key: '1-1', data: { name: 'Home', size: '20kb', type: 'Folder' } }
    ]
  }
])

// Products for DataView
const products = ref([
  { id: '1000', name: 'Bamboo Watch', price: 65, image: 'bamboo-watch.jpg' },
  { id: '1001', name: 'Black Watch', price: 72, image: 'black-watch.jpg' },
  { id: '1002', name: 'Blue Band', price: 79, image: 'blue-band.jpg' }
])

// Navigation items
const menuItems = ref([
  { label: 'Home', icon: 'pi pi-home' },
  { label: 'Features', icon: 'pi pi-star' },
  { label: 'Projects', icon: 'pi pi-search', items: [
    { label: 'Components', icon: 'pi pi-bolt' },
    { label: 'Blocks', icon: 'pi pi-server' }
  ]},
  { label: 'Contact', icon: 'pi pi-envelope' }
])

const breadcrumbItems = ref([
  { label: 'Home' },
  { label: 'Components' },
  { label: 'Showcase' }
])

const stepItems = ref([
  { label: 'Personal' },
  { label: 'Seat' },
  { label: 'Payment' },
  { label: 'Confirmation' }
])

const tabMenuItems = ref([
  { label: 'Dashboard', icon: 'pi pi-home' },
  { label: 'Transactions', icon: 'pi pi-chart-line' },
  { label: 'Products', icon: 'pi pi-list' },
  { label: 'Messages', icon: 'pi pi-inbox' }
])

const dockItems = ref([
  { label: 'Finder', icon: 'https://primefaces.org/cdn/primevue/images/dock/finder.svg' },
  { label: 'App Store', icon: 'https://primefaces.org/cdn/primevue/images/dock/appstore.svg' },
  { label: 'Photos', icon: 'https://primefaces.org/cdn/primevue/images/dock/photos.svg' },
  { label: 'Trash', icon: 'https://primefaces.org/cdn/primevue/images/dock/trash.png' }
])

// Methods
const searchCountry = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCountries.value = [...countries.value]
    } else {
      filteredCountries.value = countries.value.filter((country) => {
        return country.toLowerCase().startsWith(event.query.toLowerCase())
      })
    }
  }, 250)
}

const clearFilter = () => {
  filters.value.global.value = null
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'qualified':
      return 'success'
    case 'unqualified':
      return 'danger'
    case 'negotiation':
      return 'warn'
    case 'new':
      return 'info'
    default:
      return null
  }
}

const showToast = (severity: string, summary: string, detail: string) => {
  toast.add({ severity, summary, detail, life: 3000 })
}

const confirmDialog = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Save'
    },
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    }
  })
}

const confirmDelete = () => {
  confirm.require({
    message: 'Do you want to delete this record?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    }
  })
}

onMounted(() => {
  // Initialize progress animation
  const interval = setInterval(() => {
    progressValue.value = progressValue.value + Math.floor(Math.random() * 10) + 1
    if (progressValue.value >= 100) {
      progressValue.value = 0
    }
  }, 2000)
})
</script>

<style scoped>
.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>