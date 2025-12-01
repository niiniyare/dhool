<template>
  <div class="demo-access">
    <div class="surface-0 p-6">
      <div class="flex align-items-center justify-content-between mb-4">
        <h1 class="text-3xl font-bold text-900 m-0">Access Control Demo</h1>
        <div class="flex gap-2">
          <Button
            icon="pi pi-refresh"
            label="Refresh Data"
            @click="refreshData"
            :loading="loading"
            size="small"
          />
        </div>
      </div>
      
      <div class="text-600 mb-6">
        This demo shows how the three-layer access control system works in Dhool.
      </div>

      <!-- Role/Plan Simulator -->
      <Card class="mb-4">
        <template #title>
          <i class="pi pi-cog mr-2"></i>
          Access Simulator
        </template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6">
              <label class="block text-sm font-medium mb-2">Subscription Plan</label>
              <Dropdown
                v-model="selectedPlan"
                :options="demoPlans"
                option-label="name"
                option-value="id"
                placeholder="Select a plan"
                class="w-full"
                @change="updateDemoAccess"
              />
            </div>
            <div class="col-12 md:col-6">
              <label class="block text-sm font-medium mb-2">User Role</label>
              <Dropdown
                v-model="selectedRole"
                :options="demoRoles"
                option-label="name"
                option-value="id"
                placeholder="Select a role"
                class="w-full"
                @change="updateDemoAccess"
              />
            </div>
          </div>
        </template>
      </Card>

      <div class="grid">
        <!-- Subscription Info -->
        <div class="col-12 lg:col-4">
          <Card>
            <template #title>
              <i class="pi pi-crown mr-2"></i>
              Subscription Info
            </template>
            <template #content>
              <div class="space-y-3">
                <div class="flex justify-content-between">
                  <span class="text-600">Plan:</span>
                  <Tag :severity="subscription?.plan.name === 'Enterprise' ? 'success' : subscription?.plan.name === 'Pro' ? 'info' : 'secondary'">
                    {{ subscription?.plan.name || 'Free' }}
                  </Tag>
                </div>
                <div class="flex justify-content-between">
                  <span class="text-600">Status:</span>
                  <Tag :severity="subscription?.status === 'active' ? 'success' : 'danger'">
                    {{ subscription?.status || 'inactive' }}
                  </Tag>
                </div>
                <div class="flex justify-content-between">
                  <span class="text-600">Users Limit:</span>
                  <span>{{ subscription?.plan.limits?.users || 'N/A' }}</span>
                </div>
                <div class="flex justify-content-between">
                  <span class="text-600">Storage:</span>
                  <span>{{ subscription?.plan.limits?.storage || 'N/A' }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Enabled Modules -->
        <div class="col-12 lg:col-8">
          <Card>
            <template #title>
              <i class="pi pi-th-large mr-2"></i>
              Enabled Modules
            </template>
            <template #content>
              <div class="grid">
                <div v-for="module in allModules" :key="module" class="col-6 md:col-4 lg:col-3">
                  <div class="flex align-items-center gap-2">
                    <i 
                      :class="hasModule(module) ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"
                    ></i>
                    <span :class="hasModule(module) ? 'text-900' : 'text-400'">
                      {{ module }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Permission Matrix -->
        <div class="col-12">
          <Card>
            <template #title>
              <i class="pi pi-shield mr-2"></i>
              Document Type Permissions
            </template>
            <template #content>
              <DataTable :value="permissionMatrix" class="p-datatable-sm">
                <Column field="docType" header="Document Type" class="font-medium">
                  <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                      <i :class="getDocTypeIcon(data.docType)"></i>
                      {{ data.docType }}
                    </div>
                  </template>
                </Column>
                <Column header="Create" class="text-center" style="width: 100px">
                  <template #body="{ data }">
                    <Tag :severity="data.permissions.canCreate ? 'success' : 'danger'" class="w-full">
                      {{ data.permissions.canCreate ? 'Yes' : 'No' }}
                    </Tag>
                  </template>
                </Column>
                <Column header="Read" class="text-center" style="width: 100px">
                  <template #body="{ data }">
                    <Tag :severity="data.permissions.canRead ? 'success' : 'danger'" class="w-full">
                      {{ data.permissions.canRead ? 'Yes' : 'No' }}
                    </Tag>
                  </template>
                </Column>
                <Column header="Update" class="text-center" style="width: 100px">
                  <template #body="{ data }">
                    <Tag :severity="data.permissions.canUpdate ? 'success' : 'danger'" class="w-full">
                      {{ data.permissions.canUpdate ? 'Yes' : 'No' }}
                    </Tag>
                  </template>
                </Column>
                <Column header="Delete" class="text-center" style="width: 100px">
                  <template #body="{ data }">
                    <Tag :severity="data.permissions.canDelete ? 'success' : 'danger'" class="w-full">
                      {{ data.permissions.canDelete ? 'Yes' : 'No' }}
                    </Tag>
                  </template>
                </Column>
                <Column field="scope" header="Data Scope" class="text-center" style="width: 120px">
                  <template #body="{ data }">
                    <Tag :severity="getScopeSeverity(data.scope)" class="w-full">
                      {{ data.scope }}
                    </Tag>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Field-Level Access Demo -->
        <div class="col-12">
          <Card>
            <template #title>
              <i class="pi pi-eye mr-2"></i>
              Field-Level Access Demo
            </template>
            <template #content>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-2">Select Document Type:</label>
                <Dropdown
                  v-model="selectedDocType"
                  :options="documentTypes"
                  placeholder="Choose document type"
                  class="w-full md:w-20rem"
                  @change="updateFieldAccess"
                />
              </div>
              
              <div v-if="fieldAccess.length > 0" class="grid">
                <div v-for="field in fieldAccess" :key="field.name" class="col-12 md:col-6 lg:col-4">
                  <div class="border-1 border-200 border-round p-3">
                    <div class="flex justify-content-between align-items-center mb-2">
                      <span class="font-medium">{{ field.name }}</span>
                      <div class="flex gap-1">
                        <Tag
                          v-if="field.access.readable"
                          severity="info"
                          value="Read"
                          class="text-xs"
                        />
                        <Tag
                          v-if="field.access.writable"
                          severity="success"
                          value="Write"
                          class="text-xs"
                        />
                        <Tag
                          v-if="!field.access.readable && !field.access.writable"
                          severity="danger"
                          value="No Access"
                          class="text-xs"
                        />
                      </div>
                    </div>
                    <div class="text-sm text-600">
                      Type: {{ field.type }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-600 text-center p-4">
                Select a document type to see field-level access controls
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAccess } from '@/composables/useAccess'
import type { SubscriptionPlan, UserRole, DataScope } from '@/types/access'

const { 
  subscription, 
  hasModule, 
  getDocumentPermissions, 
  canAccessField,
  store 
} = useAccess()

const loading = ref(false)
const selectedPlan = ref('free')
const selectedRole = ref('user')
const selectedDocType = ref('')

// Demo data
const demoPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    modules: ['users', 'dashboard'],
    limits: { users: 3, storage: 1 },
    features: ['basic-support']
  },
  {
    id: 'pro',
    name: 'Pro',
    modules: ['users', 'dashboard', 'projects', 'tasks', 'reports'],
    limits: { users: 25, storage: 10 },
    features: ['priority-support', 'integrations']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    modules: ['users', 'dashboard', 'projects', 'tasks', 'reports', 'admin', 'billing', 'analytics'],
    limits: { users: 500, storage: 100 },
    features: ['dedicated-support', 'sso', 'custom-fields']
  }
]

const demoRoles: UserRole[] = [
  {
    id: 'user',
    name: 'User',
    permissions: {},
    dataScope: 'own'
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: {},
    dataScope: 'team'
  },
  {
    id: 'admin',
    name: 'Admin',
    permissions: {},
    dataScope: 'all'
  }
]

const allModules = [
  'users', 'dashboard', 'projects', 'tasks', 'reports', 
  'admin', 'billing', 'analytics', 'crm', 'inventory'
]

const documentTypes = [
  'User', 'Project', 'Task', 'Report', 'Company', 'Invoice'
]

const permissionMatrix = computed(() => {
  const docTypes = ['User', 'Project', 'Task', 'Report', 'Company']
  return docTypes.map(docType => ({
    docType,
    permissions: getDocumentPermissions(docType.toLowerCase()),
    scope: getDataScope(docType.toLowerCase())
  }))
})

const fieldAccess = ref<Array<{
  name: string
  type: string
  access: { readable: boolean; writable: boolean; required: boolean }
}>>([])

function getDataScope(docType: string): DataScope {
  if (selectedRole.value === 'admin') return 'all'
  if (selectedRole.value === 'manager') return 'team'
  return 'own'
}

function getDocTypeIcon(docType: string): string {
  const icons: Record<string, string> = {
    'User': 'pi pi-users',
    'Project': 'pi pi-briefcase',
    'Task': 'pi pi-check-square',
    'Report': 'pi pi-chart-bar',
    'Company': 'pi pi-building'
  }
  return icons[docType] || 'pi pi-file'
}

function getScopeSeverity(scope: DataScope): string {
  switch (scope) {
    case 'all': return 'success'
    case 'team': return 'info'
    case 'department': return 'warning'
    default: return 'secondary'
  }
}

async function updateDemoAccess(): Promise<void> {
  loading.value = true
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const plan = demoPlans.find(p => p.id === selectedPlan.value)
  const role = demoRoles.find(r => r.id === selectedRole.value)
  
  if (plan && role) {
    // Update store with demo data
    store.subscription = {
      plan,
      status: 'active',
      usage: { users: 5, storage: 2.5 }
    }
    store.roles = [role]
  }
  
  loading.value = false
}

function updateFieldAccess(): void {
  if (!selectedDocType.value) {
    fieldAccess.value = []
    return
  }

  // Demo field definitions
  const fieldDefs: Record<string, Array<{ name: string; type: string }>> = {
    'User': [
      { name: 'email', type: 'email' },
      { name: 'password', type: 'password' },
      { name: 'firstName', type: 'text' },
      { name: 'lastName', type: 'text' },
      { name: 'role', type: 'select' },
      { name: 'department', type: 'select' },
      { name: 'salary', type: 'number' },
      { name: 'phone', type: 'tel' }
    ],
    'Project': [
      { name: 'name', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'status', type: 'select' },
      { name: 'budget', type: 'number' },
      { name: 'startDate', type: 'date' },
      { name: 'endDate', type: 'date' }
    ],
    'Task': [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'priority', type: 'select' },
      { name: 'assignee', type: 'select' },
      { name: 'dueDate', type: 'date' },
      { name: 'estimatedHours', type: 'number' }
    ]
  }

  const fields = fieldDefs[selectedDocType.value] || []
  
  fieldAccess.value = fields.map(field => ({
    ...field,
    access: getFieldAccess(field.name)
  }))
}

function getFieldAccess(fieldName: string) {
  // Demo field-level access logic using the actual canAccessField function
  const fieldAccess = canAccessField(selectedDocType.value.toLowerCase(), fieldName)
  
  // Override with demo logic for illustration
  const isAdmin = selectedRole.value === 'admin'
  const isManager = selectedRole.value === 'manager'
  
  // Sensitive fields
  if (['password', 'salary'].includes(fieldName)) {
    return {
      readable: isAdmin,
      writable: isAdmin,
      required: false
    }
  }
  
  // Management fields
  if (['role', 'budget', 'department'].includes(fieldName)) {
    return {
      readable: true,
      writable: isAdmin || isManager,
      required: false
    }
  }
  
  // Use actual field access if available, otherwise default
  return fieldAccess || {
    readable: true,
    writable: true,
    required: false
  }
}

async function refreshData(): Promise<void> {
  await updateDemoAccess()
  updateFieldAccess()
}

onMounted(async () => {
  await updateDemoAccess()
})
</script>

<style scoped>
.demo-access {
  min-height: 100vh;
  background: var(--surface-ground);
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
</style>