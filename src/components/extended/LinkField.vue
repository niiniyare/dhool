<template>
  <FormField
    :label="label"
    :description="description"
    :error="error"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :size="size"
    :variant="variant"
    v-slot="{ fieldId, ariaDescribedby }"
  >
    <!-- Single Link Mode -->
    <div v-if="!multiple" class="link-field-single">
      <div class="relative">
        <Dropdown
          v-if="linkType === 'select'"
          v-model="singleValue"
          :options="linkOptions"
          :optionLabel="optionLabel"
          :optionValue="optionValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :id="fieldId"
          :aria-describedby="ariaDescribedby"
          :filter="searchable"
          :showClear="!required"
          class="w-full"
          @change="onSingleChange"
        />
        
        <AutoComplete
          v-else
          v-model="singleValue"
          :suggestions="filteredSuggestions"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :id="fieldId"
          :aria-describedby="ariaDescribedby"
          :field="displayField"
          :minLength="minSearchLength"
          :loading="loading"
          class="w-full"
          @complete="onSearch"
          @select="onSingleSelect"
          @clear="onClear"
        >
          <template #option="{ option }">
            <div class="flex items-center gap-2 p-2">
              <i v-if="option.icon" :class="option.icon" class="text-gray-500"></i>
              <div class="flex flex-col">
                <span class="font-medium">{{ getOptionDisplay(option) }}</span>
                <small v-if="option.description" class="text-gray-500">{{ option.description }}</small>
              </div>
            </div>
          </template>
        </AutoComplete>
        
        <Button 
          v-if="allowCreate && !disabled && !readonly"
          type="button"
          icon="pi pi-plus"
          severity="secondary"
          size="small"
          class="absolute right-1 top-1/2 transform -translate-y-1/2"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Multiple Links Mode -->
    <div v-else class="link-field-multiple">
      <!-- Selected Items Display -->
      <div v-if="multipleValue && multipleValue.length > 0" class="mb-2">
        <div class="flex flex-wrap gap-2">
          <Chip
            v-for="(item, index) in multipleValue"
            :key="getItemKey(item, index)"
            :label="getOptionDisplay(item)"
            :removable="!disabled && !readonly"
            @remove="removeItem(index)"
          >
            <template v-if="item.icon" #icon>
              <i :class="item.icon" class="mr-1"></i>
            </template>
          </Chip>
        </div>
      </div>

      <!-- Search Input -->
      <div class="relative">
        <AutoComplete
          v-model="searchValue"
          :suggestions="filteredSuggestions"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :id="fieldId"
          :aria-describedby="ariaDescribedby"
          :field="displayField"
          :minLength="minSearchLength"
          :loading="loading"
          class="w-full"
          @complete="onSearch"
          @select="onMultipleSelect"
          @keydown="onKeyDown"
        >
          <template #option="{ option }">
            <div class="flex items-center gap-2 p-2">
              <i v-if="option.icon" :class="option.icon" class="text-gray-500"></i>
              <div class="flex flex-col flex-1">
                <span class="font-medium">{{ getOptionDisplay(option) }}</span>
                <small v-if="option.description" class="text-gray-500">{{ option.description }}</small>
              </div>
              <i v-if="isSelected(option)" class="pi pi-check text-green-500"></i>
            </div>
          </template>
        </AutoComplete>
        
        <Button 
          v-if="allowCreate && !disabled && !readonly"
          type="button"
          icon="pi pi-plus"
          severity="secondary"
          size="small"
          class="absolute right-1 top-1/2 transform -translate-y-1/2"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Create New Item Dialog -->
    <Dialog 
      v-model:visible="showCreateDialog" 
      modal 
      :header="`Create New ${linkTypeLabel}`"
      class="w-[90vw] max-w-md"
    >
      <div class="flex flex-col gap-4">
        <InputText
          v-model="newItemName"
          :placeholder="`Enter ${linkTypeLabel} name`"
          class="w-full"
          @keydown.enter="createNewItem"
        />
        
        <div class="flex gap-2 justify-end">
          <Button 
            label="Cancel" 
            severity="secondary" 
            @click="showCreateDialog = false"
          />
          <Button 
            label="Create" 
            :disabled="!newItemName.trim()"
            @click="createNewItem"
          />
        </div>
      </div>
    </Dialog>
  </FormField>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import FormField from '../molecules/FormField.vue'

interface LinkOption {
  id: string | number
  name: string
  label?: string
  value?: any
  icon?: string
  description?: string
  [key: string]: any
}

interface Props {
  modelValue?: any
  label?: string
  description?: string
  error?: string | string[]
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'filled' | 'outlined'
  placeholder?: string
  multiple?: boolean
  linkType?: 'tag' | 'document' | 'user' | 'select' | 'custom'
  linkTarget?: string
  searchable?: boolean
  allowCreate?: boolean
  minSearchLength?: number
  optionLabel?: string
  optionValue?: string
  displayField?: string
  searchField?: string
  api?: {
    search?: string
    create?: string
    endpoint?: string
  }
  options?: LinkOption[]
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: '',
  description: '',
  error: '',
  required: false,
  disabled: false,
  readonly: false,
  size: 'medium',
  variant: 'default',
  placeholder: 'Search and select...',
  multiple: false,
  linkType: 'document',
  searchable: true,
  allowCreate: false,
  minSearchLength: 1,
  optionLabel: 'name',
  optionValue: 'id',
  displayField: 'name',
  searchField: 'name',
  options: () => [],
  maxItems: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'search': [query: string]
  'create': [name: string]
  'change': [value: any]
}>()

// Reactive state
const searchValue = ref('')
const suggestions = ref<LinkOption[]>([])
const loading = ref(false)
const showCreateDialog = ref(false)
const newItemName = ref('')

// Computed values
const linkTypeLabel = computed(() => {
  const labels = {
    tag: 'Tag',
    document: 'Document',
    user: 'User',
    select: 'Option',
    custom: 'Item'
  }
  return labels[props.linkType] || 'Item'
})

const singleValue = computed({
  get: () => {
    if (props.multiple) return undefined
    return props.modelValue
  },
  set: (value) => {
    if (!props.multiple) {
      emit('update:modelValue', value)
      emit('change', value)
    }
  }
})

const multipleValue = computed({
  get: () => {
    if (!props.multiple) return []
    return Array.isArray(props.modelValue) ? props.modelValue : []
  },
  set: (value) => {
    if (props.multiple) {
      emit('update:modelValue', value)
      emit('change', value)
    }
  }
})

const linkOptions = computed(() => {
  if (props.linkType === 'select' && props.options) {
    return props.options
  }
  return suggestions.value
})

const filteredSuggestions = computed(() => {
  if (props.linkType === 'select') {
    return suggestions.value
  }
  
  // Filter out already selected items in multiple mode
  if (props.multiple) {
    const selectedIds = multipleValue.value.map(item => 
      typeof item === 'object' ? item[props.optionValue] : item
    )
    return suggestions.value.filter(item => 
      !selectedIds.includes(item[props.optionValue])
    )
  }
  
  return suggestions.value
})

// Methods
const getOptionDisplay = (option: any): string => {
  if (!option) return ''
  if (typeof option === 'string') return option
  return option[props.displayField] || option[props.optionLabel] || option.name || String(option)
}

const getItemKey = (item: any, index: number): string => {
  if (typeof item === 'object' && item[props.optionValue]) {
    return String(item[props.optionValue])
  }
  return `item-${index}`
}

const isSelected = (option: LinkOption): boolean => {
  if (!props.multiple) return false
  const selectedIds = multipleValue.value.map(item => 
    typeof item === 'object' ? item[props.optionValue] : item
  )
  return selectedIds.includes(option[props.optionValue])
}

const onSearch = async (event: any) => {
  const query = event.query || ''
  
  if (query.length < props.minSearchLength) {
    suggestions.value = []
    return
  }

  loading.value = true
  
  try {
    // If using static options (select mode)
    if (props.linkType === 'select' && props.options) {
      const filtered = props.options.filter(option =>
        getOptionDisplay(option).toLowerCase().includes(query.toLowerCase())
      )
      suggestions.value = filtered
      return
    }

    // Emit search event for parent component to handle
    emit('search', query)
    
    // If API endpoint is provided, fetch data
    if (props.api?.search || props.api?.endpoint) {
      // This would be implemented based on your API service
      // For now, using static filtering as fallback
      const filtered = props.options?.filter(option =>
        getOptionDisplay(option).toLowerCase().includes(query.toLowerCase())
      ) || []
      suggestions.value = filtered
    }
  } catch (error) {
    console.error('Search error:', error)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

const onSingleChange = (event: any) => {
  singleValue.value = event.value
}

const onSingleSelect = (event: any) => {
  singleValue.value = event.value
}

const onMultipleSelect = (event: any) => {
  const newItem = event.value
  const currentValues = [...multipleValue.value]
  
  // Check if item is already selected
  const isAlreadySelected = currentValues.some(item =>
    (typeof item === 'object' ? item[props.optionValue] : item) === 
    (typeof newItem === 'object' ? newItem[props.optionValue] : newItem)
  )
  
  if (!isAlreadySelected) {
    // Check max items limit
    if (!props.maxItems || currentValues.length < props.maxItems) {
      currentValues.push(newItem)
      multipleValue.value = currentValues
    }
  }
  
  // Clear search
  searchValue.value = ''
}

const removeItem = (index: number) => {
  const currentValues = [...multipleValue.value]
  currentValues.splice(index, 1)
  multipleValue.value = currentValues
}

const onClear = () => {
  if (props.multiple) {
    multipleValue.value = []
  } else {
    singleValue.value = null
  }
}

const onKeyDown = (event: KeyboardEvent) => {
  // Handle backspace to remove last item in multiple mode
  if (event.key === 'Backspace' && props.multiple && !searchValue.value) {
    const currentValues = [...multipleValue.value]
    if (currentValues.length > 0) {
      currentValues.pop()
      multipleValue.value = currentValues
    }
  }
}

const openCreateDialog = () => {
  newItemName.value = ''
  showCreateDialog.value = true
}

const createNewItem = async () => {
  const name = newItemName.value.trim()
  if (!name) return
  
  try {
    // Emit create event for parent to handle
    emit('create', name)
    
    // For immediate feedback, create a temporary item
    const newItem = {
      id: `temp_${Date.now()}`,
      [props.displayField]: name,
      name: name,
      temporary: true
    }
    
    if (props.multiple) {
      const currentValues = [...multipleValue.value]
      currentValues.push(newItem)
      multipleValue.value = currentValues
    } else {
      singleValue.value = newItem
    }
    
    showCreateDialog.value = false
  } catch (error) {
    console.error('Create error:', error)
  }
}

// Initialize suggestions with options
watch(() => props.options, (newOptions) => {
  if (newOptions) {
    suggestions.value = newOptions
  }
}, { immediate: true })

// Initialize component
onMounted(() => {
  if (props.options) {
    suggestions.value = props.options
  }
})
</script>

<style scoped>
.link-field-single {
  @apply relative;
}

.link-field-multiple {
  @apply space-y-2;
}

/* Custom chip styling */
:deep(.p-chip) {
  @apply bg-blue-100 text-blue-800 border border-blue-200;
}

:deep(.dark .p-chip) {
  @apply bg-blue-900 text-blue-100 border-blue-700;
}

/* AutoComplete dropdown styling */
:deep(.p-autocomplete-panel) {
  @apply max-h-64 overflow-y-auto;
}

/* Loading state */
:deep(.p-autocomplete.p-autocomplete-loading .p-autocomplete-input) {
  background-image: url("data:image/svg+xml,%3csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='%236b7280' d='M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM2 10a8 8 0 1116 0 8 8 0 01-16 0z'/%3e%3cpath fill='%236b7280' d='M10 7a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1z'/%3e%3cpath fill='%236b7280' d='M10 13a1 1 0 100-2 1 1 0 000 2z'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>