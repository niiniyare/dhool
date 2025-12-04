<template>
  <div class="demo-index">
    <div class="demo-header mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Dhool Component Demos
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Explore comprehensive demonstrations of Dhool's schema-driven components and features.
        These demos use real schemas and data to show the complete functionality.
      </p>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">4</div>
          <div class="text-sm text-blue-700 dark:text-blue-300">Interactive Demos</div>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
          <div class="text-sm text-green-700 dark:text-green-300">Real Schemas</div>
        </div>
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">15+</div>
          <div class="text-sm text-purple-700 dark:text-purple-300">Components</div>
        </div>
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">100%</div>
          <div class="text-sm text-orange-700 dark:text-orange-300">Interactive</div>
        </div>
      </div>
    </div>

    <!-- Main Demos Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- DocumentPage Demo -->
      <Card class="demo-card">
        <template #header>
          <div class="demo-card-header">
            <i class="pi pi-file text-2xl text-blue-500"></i>
          </div>
        </template>
        <template #title>DocumentPage Demo</template>
        <template #subtitle>Complete CRUD Experience</template>
        <template #content>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Experience the full DocumentPage component with real customer data, forms, and CRUD operations.
          </p>
          <ul class="text-sm space-y-1 mb-6">
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Schema-driven UI generation</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Real-time form validation</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Access control integration</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Multiple view modes</span>
            </li>
          </ul>
        </template>
        <template #footer>
          <div class="flex gap-2">
            <Button 
              label="Try Demo" 
              icon="pi pi-play" 
              @click="navigateToComprehensiveDemo('document-page')"
              class="flex-1"
            />
            <Button 
              icon="pi pi-info-circle" 
              severity="secondary" 
              outlined 
              @click="showDemoInfo('document-page')"
            />
          </div>
        </template>
      </Card>

      <!-- DataTableCrud Demo -->
      <Card class="demo-card">
        <template #header>
          <div class="demo-card-header">
            <i class="pi pi-table text-2xl text-green-500"></i>
          </div>
        </template>
        <template #title>DataTableCrud Demo</template>
        <template #subtitle>Advanced Table Features</template>
        <template #content>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Explore the powerful DataTableCrud component with configurable options and real data.
          </p>
          <ul class="text-sm space-y-1 mb-6">
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Dynamic column configuration</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Advanced filtering & search</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Bulk operations</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Live configuration panel</span>
            </li>
          </ul>
        </template>
        <template #footer>
          <div class="flex gap-2">
            <Button 
              label="Try Demo" 
              icon="pi pi-play" 
              @click="navigateToComprehensiveDemo('data-table')"
              class="flex-1"
            />
            <Button 
              icon="pi pi-info-circle" 
              severity="secondary" 
              outlined 
              @click="showDemoInfo('data-table-crud')"
            />
          </div>
        </template>
      </Card>

      <!-- FormBuilder Demo -->
      <Card class="demo-card">
        <template #header>
          <div class="demo-card-header">
            <i class="pi pi-list-check text-2xl text-purple-500"></i>
          </div>
        </template>
        <template #title>FormBuilder Demo</template>
        <template #subtitle>Dynamic Form Generation</template>
        <template #content>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            See how FormBuilder creates dynamic forms from JSON schemas with validation and modes.
          </p>
          <ul class="text-sm space-y-1 mb-6">
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Schema-driven form generation</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Real-time validation</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Multiple form modes</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Field dependency handling</span>
            </li>
          </ul>
        </template>
        <template #footer>
          <div class="flex gap-2">
            <Button 
              label="Try Demo" 
              icon="pi pi-play" 
              @click="navigateToComprehensiveDemo('form-builder')"
              class="flex-1"
            />
            <Button 
              icon="pi pi-info-circle" 
              severity="secondary" 
              outlined 
              @click="showDemoInfo('form-builder')"
            />
          </div>
        </template>
      </Card>

      <!-- Access Control Demo -->
      <Card class="demo-card">
        <template #header>
          <div class="demo-card-header">
            <i class="pi pi-shield text-2xl text-orange-500"></i>
          </div>
        </template>
        <template #title>Access Control Demo</template>
        <template #subtitle>Three-Layer Security</template>
        <template #content>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Understand how Dhool's three-layer access control system works with live examples.
          </p>
          <ul class="text-sm space-y-1 mb-6">
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Subscription-level access</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Role-based permissions</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Field-level ABAC</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>Interactive simulation</span>
            </li>
          </ul>
        </template>
        <template #footer>
          <div class="flex gap-2">
            <Button 
              label="Try Demo" 
              icon="pi pi-play" 
              @click="navigateToComprehensiveDemo('access-control')"
              class="flex-1"
            />
            <Button 
              icon="pi pi-info-circle" 
              severity="secondary" 
              outlined 
              @click="showDemoInfo('access')"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Additional Showcases -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Additional Showcases
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Schemas Browser -->
        <Card class="showcase-card">
          <template #content>
            <div class="flex items-center gap-3 mb-2">
              <i class="pi pi-database text-lg text-blue-500"></i>
              <h3 class="font-medium">Schema Browser</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Explore available schemas with syntax highlighting and previews.
            </p>
            <Button 
              label="View Schemas" 
              icon="pi pi-external-link" 
              severity="secondary" 
              outlined 
              size="small" 
              @click="navigateToDemo('schemas')"
              class="w-full"
            />
          </template>
        </Card>

        <!-- Component Showcase -->
        <Card class="showcase-card">
          <template #content>
            <div class="flex items-center gap-3 mb-2">
              <i class="pi pi-objects-column text-lg text-green-500"></i>
              <h3 class="font-medium">Organisms Showcase</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              See all organism components with real data and interactions.
            </p>
            <Button 
              label="View Components" 
              icon="pi pi-external-link" 
              severity="secondary" 
              outlined 
              size="small" 
              @click="navigateToShowcase('organisms')"
              class="w-full"
            />
          </template>
        </Card>

        <!-- PrimeVue Showcase -->
        <Card class="showcase-card">
          <template #content>
            <div class="flex items-center gap-3 mb-2">
              <i class="pi pi-palette text-lg text-purple-500"></i>
              <h3 class="font-medium">PrimeVue Components</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Complete PrimeVue 4 component showcase with examples.
            </p>
            <Button 
              label="View PrimeVue" 
              icon="pi pi-external-link" 
              severity="secondary" 
              outlined 
              size="small" 
              @click="navigateToShowcase('index')"
              class="w-full"
            />
          </template>
        </Card>
      </div>
    </div>

    <!-- Getting Started -->
    <Card class="mt-8">
      <template #title>
        <i class="pi pi-lightbulb mr-2"></i>
        Getting Started with the Demos
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium mb-3">Demo Features</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500"></i>
                <span><strong>Real Data:</strong> All demos use actual schema files and realistic data</span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500"></i>
                <span><strong>Interactive:</strong> Full CRUD operations and real-time updates</span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500"></i>
                <span><strong>Configurable:</strong> Change settings and see immediate effects</span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500"></i>
                <span><strong>Educational:</strong> Event logs and detailed information panels</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-3">Best Demo Experience</h4>
            <ul class="space-y-2 text-sm">
              <li><strong>1.</strong> Start with the DocumentPage demo for the complete experience</li>
              <li><strong>2.</strong> Try the DataTableCrud demo to understand table configurations</li>
              <li><strong>3.</strong> Explore FormBuilder to see dynamic form generation</li>
              <li><strong>4.</strong> Check Access Control to understand the security model</li>
              <li><strong>5.</strong> Browse schemas to see the JSON structure behind it all</li>
            </ul>
          </div>
        </div>
      </template>
    </Card>

    <!-- Demo Info Dialog -->
    <Dialog v-model:visible="showInfoDialog" modal :header="selectedDemoInfo?.title" :style="{ width: '500px' }">
      <div v-if="selectedDemoInfo" class="space-y-4">
        <p>{{ selectedDemoInfo.description }}</p>
        <div>
          <h4 class="font-medium mb-2">Key Features:</h4>
          <ul class="space-y-1 text-sm">
            <li v-for="feature in selectedDemoInfo.features" :key="feature" class="flex items-center gap-2">
              <i class="pi pi-check text-green-500"></i>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2">
          <Button label="Close" severity="secondary" @click="showInfoDialog = false" />
          <Button label="Try Demo" @click="navigateAndCloseInfo" />
        </div>
      </template>
    </Dialog>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

// PrimeVue Components
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'

const router = useRouter()
const toast = useToast()

// Dialog state
const showInfoDialog = ref(false)
const selectedDemo = ref('')
const selectedDemoInfo = ref(null)

// Demo information
const demoInfo = {
  'document-page': {
    title: 'DocumentPage Demo',
    description: 'The DocumentPage component is the cornerstone of Dhool\'s schema-driven architecture. It provides a complete CRUD interface that automatically generates UI based on JSON schemas.',
    features: [
      'Automatic list and form view generation from schemas',
      'Real-time validation with custom rules',
      'Access control integration with field-level permissions',
      'Multiple view modes (list, detail, form)',
      'Responsive design that works on all devices',
      'Error handling and loading states',
      'Toast notifications for user feedback'
    ]
  },
  'data-table-crud': {
    title: 'DataTableCrud Demo',
    description: 'The DataTableCrud component provides advanced table functionality with schema-driven column configuration, filtering, and actions.',
    features: [
      'Dynamic column configuration from schemas',
      'Advanced search and filtering capabilities',
      'Bulk operations and selection',
      'Customizable toolbar and row actions',
      'Sorting and pagination',
      'Live configuration panel',
      'Export functionality'
    ]
  },
  'form-builder': {
    title: 'FormBuilder Demo',
    description: 'The FormBuilder component dynamically generates forms from JSON schemas with comprehensive validation and multiple modes.',
    features: [
      'Schema-driven form generation',
      'Real-time validation with custom rules',
      'Multiple form modes (create, edit, view)',
      'Field dependencies and conditional logic',
      'Section-based layout organization',
      'Comprehensive field types support',
      'Accessibility features built-in'
    ]
  },
  'access': {
    title: 'Access Control Demo',
    description: 'Dhool implements a three-layer access control system that provides fine-grained security from subscription level down to individual fields.',
    features: [
      'Subscription-level module access',
      'Role-based CRUD permissions',
      'Field-level ABAC (Attribute-Based Access Control)',
      'Interactive permission simulation',
      'Data scope control (own/team/all)',
      'Real-time permission updates',
      'Visual permission matrix'
    ]
  }
}

// Navigation functions
const navigateToComprehensiveDemo = (demoType: string) => {
  router.push(`/demo/comprehensive?demo=${demoType}`)
  toast.add({
    severity: 'info',
    summary: 'Demo Loading',
    detail: `Opening ${demoType} demo...`,
    life: 2000
  })
}

const navigateToShowcase = (showcase: string) => {
  router.push(`/showcase/${showcase}`)
  toast.add({
    severity: 'info',
    summary: 'Showcase Loading',
    detail: `Opening ${showcase} showcase...`,
    life: 2000
  })
}

const showDemoInfo = (demo: string) => {
  selectedDemo.value = demo
  selectedDemoInfo.value = demoInfo[demo]
  showInfoDialog.value = true
}

const navigateAndCloseInfo = () => {
  showInfoDialog.value = false
  navigateToComprehensiveDemo(selectedDemo.value === 'access' ? 'access-control' : selectedDemo.value)
}
</script>

<style scoped>
.demo-index {
  @apply max-w-7xl mx-auto p-6;
}

.demo-header {
  @apply bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-xl p-8;
}

.demo-card {
  @apply transition-all duration-200 hover:shadow-lg hover:scale-[1.02];
}

.demo-card-header {
  @apply bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-t-lg flex items-center justify-center;
}

.showcase-card {
  @apply transition-all duration-200 hover:shadow-md;
}

/* Ensure proper grid layouts */
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

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Custom styling for better presentation */
:deep(.p-card) {
  @apply h-full border border-gray-200 dark:border-gray-700;
}

:deep(.p-card-body) {
  @apply h-full flex flex-col;
}

:deep(.p-card-content) {
  @apply flex-1;
}

:deep(.p-card-footer) {
  @apply mt-auto;
}
</style>