<template>
  <div class="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Schema Browser
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Explore available schemas with JSON syntax highlighting and form/list previews
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Schema List -->
        <div class="lg:col-span-1">
          <Card>
            <template #title>Available Schemas</template>
            <template #content>
              <div class="space-y-2">
                <div
                  v-for="schema in schemas"
                  :key="schema.name"
                  :class="[
                    'p-3 rounded border cursor-pointer transition-colors',
                    selectedSchema?.name === schema.name
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                  ]"
                  @click="selectSchema(schema)"
                >
                  <div class="flex items-center space-x-3">
                    <i :class="schema.icon || 'pi pi-file'" class="text-gray-600"></i>
                    <div>
                      <div class="font-medium">{{ schema.label }}</div>
                      <div class="text-sm text-gray-500">{{ schema.module }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Schema Details -->
        <div class="lg:col-span-2" v-if="selectedSchema">
          <TabView>
            <TabPanel header="JSON Schema">
              <Card>
                <template #content>
                  <ScrollPanel style="width: 100%; height: 500px">
                    <pre class="language-json"><code v-html="highlightedJson"></code></pre>
                  </ScrollPanel>
                </template>
              </Card>
            </TabPanel>
            
            <TabPanel header="Form Preview">
              <Card>
                <template #title>Form Layout Preview</template>
                <template #content>
                  <div class="space-y-4">
                    <div v-for="section in selectedSchema.formView?.sections" :key="section.title">
                      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {{ section.title }}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {{ section.description }}
                      </p>
                      <div :class="`grid grid-cols-${section.columns || 1} gap-4`">
                        <div 
                          v-for="fieldName in section.fields" 
                          :key="fieldName"
                          class="space-y-1"
                        >
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ getField(fieldName)?.label || fieldName }}
                            <span v-if="getField(fieldName)?.required" class="text-red-500">*</span>
                          </label>
                          <div class="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-sm">
                            {{ getField(fieldName)?.type || 'text' }}
                            <span v-if="getField(fieldName)?.placeholder" class="text-gray-400">
                              - {{ getField(fieldName).placeholder }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </TabPanel>
            
            <TabPanel header="List Preview">
              <Card>
                <template #title>List View Configuration</template>
                <template #content>
                  <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div 
                        v-for="column in selectedSchema.listView?.columns" 
                        :key="column.field"
                        class="border border-gray-200 dark:border-gray-700 rounded p-3"
                      >
                        <div class="font-medium text-gray-900 dark:text-white">
                          {{ column.header }}
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Field: {{ column.field }}
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                          Type: {{ column.type }}
                        </div>
                        <div class="flex gap-2 mt-2">
                          <Badge v-if="column.sortable" value="Sortable" severity="success" />
                          <Badge v-if="column.filter" value="Filterable" severity="info" />
                          <Badge v-if="column.searchable" value="Searchable" severity="warning" />
                        </div>
                      </div>
                    </div>
                    
                    <Divider />
                    
                    <div>
                      <h5 class="text-lg font-medium mb-3">Toolbar Actions</h5>
                      <div class="flex flex-wrap gap-2">
                        <Button 
                          v-for="action in selectedSchema.listView?.toolbarActions" 
                          :key="action.id"
                          :label="action.label"
                          :icon="action.icon"
                          :severity="action.variant"
                          size="small"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h5 class="text-lg font-medium mb-3">Row Actions</h5>
                      <div class="flex flex-wrap gap-2">
                        <Button 
                          v-for="action in selectedSchema.listView?.rowActions" 
                          :key="action.id"
                          :label="action.label"
                          :icon="action.icon"
                          :severity="action.severity"
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ScrollPanel from 'primevue/scrollpanel'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'

interface Schema {
  name: string
  label: string
  labelPlural?: string
  icon?: string
  module: string
  api: any
  listView: any
  formView: any
  access: any
}

const schemas = ref<Schema[]>([])
const selectedSchema = ref<Schema | null>(null)

const loadSchemas = async () => {
  try {
    const schemaModules = import.meta.glob('/src/schemas/*.json')
    const loadedSchemas = []
    
    for (const path in schemaModules) {
      const schemaModule = await schemaModules[path]() as { default: Schema }
      loadedSchemas.push(schemaModule.default)
    }
    
    schemas.value = loadedSchemas.sort((a, b) => a.label.localeCompare(b.label))
    
    if (schemas.value.length > 0) {
      selectedSchema.value = schemas.value[0]
    }
  } catch (error) {
    console.error('Error loading schemas:', error)
  }
}

const selectSchema = (schema: Schema) => {
  selectedSchema.value = schema
}

const getField = (fieldName: string) => {
  return selectedSchema.value?.formView?.fields?.find(field => field.name === fieldName)
}

const highlightedJson = computed(() => {
  if (!selectedSchema.value) return ''
  
  const json = JSON.stringify(selectedSchema.value, null, 2)
  
  // Simple syntax highlighting without external dependencies
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(".*?")(:)/g, '<span style="color: #0066cc;">$1</span>$2')
    .replace(/(".*?")(,|\n)/g, '<span style="color: #d73a49;">$1</span>$2')
    .replace(/(true|false)/g, '<span style="color: #005cc5;">$1</span>')
    .replace(/(\d+)/g, '<span style="color: #e36209;">$1</span>')
    .replace(/(\{|\}|\[|\])/g, '<span style="color: #24292e; font-weight: bold;">$1</span>')
})

onMounted(() => {
  loadSchemas()
})
</script>

<style scoped>
.language-json {
  background: #f6f8fa;
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 16px;
  overflow-x: auto;
}

.dark .language-json {
  background: #161b22;
  color: #c9d1d9;
}
</style>