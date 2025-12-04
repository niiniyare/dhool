<template>
  <form 
    :class="formClasses"
    @submit.prevent="handleSubmit"
    novalidate
  >
    <!-- Form Sections -->
    <div 
      v-for="section in visibleSections" 
      :key="section.title"
      class="form-section"
      :class="sectionClasses(section)"
    >
      <!-- Section Header -->
      <div v-if="section.title || section.description" class="form-section__header mb-4">
        <h3 v-if="section.title" class="form-section__title text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ section.title }}
        </h3>
        <p v-if="section.description" class="form-section__description text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ section.description }}
        </p>
      </div>

      <!-- Section Fields Grid -->
      <div 
        class="form-section__fields grid gap-4"
        :style="{ gridTemplateColumns: `repeat(${section.columns || 1}, 1fr)` }"
      >
        <FormField
          v-for="fieldName in section.fields"
          :key="fieldName"
          :field="getFieldSchema(fieldName)"
          :label="getFieldSchema(fieldName)?.label"
          :description="getFieldSchema(fieldName)?.description"
          :error="fieldErrors[fieldName]"
          :required="getFieldSchema(fieldName)?.required"
          :disabled="isFieldDisabled(fieldName)"
          :readonly="isFieldReadonly(fieldName)"
          :size="size"
          :variant="variant"
          :class="getFieldClasses(fieldName)"
        >
          <FieldRenderer
            :field="getFieldSchema(fieldName)"
            :model-value="formData[fieldName]"
            :errors="fieldErrors[fieldName] ? [fieldErrors[fieldName]] : []"
            :invalid="!!fieldErrors[fieldName]"
            :size="size"
            :variant="variant"
            @update:model-value="updateField(fieldName, $event)"
          />
        </FormField>
      </div>
    </div>

    <!-- Form Actions -->
    <div v-if="showActions" class="form-actions flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
      <Button
        v-if="showCancelButton"
        type="button"
        label="Cancel"
        severity="secondary"
        :disabled="loading"
        @click="handleCancel"
      />
      <Button
        v-if="showResetButton"
        type="button"
        label="Reset"
        severity="secondary"
        :disabled="loading || !isDirty"
        @click="handleReset"
      />
      <Button
        type="submit"
        :label="submitLabel"
        :loading="loading"
        :disabled="!isValid || loading"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import FormField from '@/components/molecules/FormField.vue'
import FieldRenderer from '@/components/renderers/FieldRenderer.vue'
import Button from 'primevue/button'
import { useAccess } from '@/composables/useAccess'

interface FieldSchema {
  name: string
  label: string
  type: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  description?: string
  default?: any
  options?: Array<{ label: string; value: any }>
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    message?: string
    required?: boolean
  }
  dependencies?: {
    field: string
    value: any
    operator?: 'equals' | 'not_equals' | 'in' | 'not_in'
  }
  access?: {
    subscription?: string[]
    roles?: string[]
    conditions?: any
  }
  [key: string]: any
}

interface FormSection {
  title?: string
  description?: string
  columns?: number
  fields: string[]
  conditions?: {
    field: string
    operator: string
    value: any
  }[]
}

interface FormSchema {
  name: string
  sections: FormSection[]
  fields: FieldSchema[]
  access?: {
    permissions?: Record<string, string[]>
    fieldAccess?: Record<string, any>
    conditions?: Record<string, any>
  }
}

interface Props {
  schema: FormSchema
  modelValue?: Record<string, any>
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'filled' | 'outlined'
  showActions?: boolean
  showCancelButton?: boolean
  showResetButton?: boolean
  submitLabel?: string
  autoValidate?: boolean
  validateOnChange?: boolean
  dense?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  mode: 'create',
  loading: false,
  size: 'medium',
  variant: 'default',
  showActions: true,
  showCancelButton: true,
  showResetButton: false,
  submitLabel: 'Save',
  autoValidate: true,
  validateOnChange: true,
  dense: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  'submit': [data: Record<string, any>]
  'cancel': []
  'reset': []
  'field-change': [field: string, value: any]
  'validation-change': [isValid: boolean, errors: Record<string, string>]
}>()

const { canAccess, canAccessField } = useAccess()

// Form state
const formData = reactive<Record<string, any>>({ ...props.modelValue })
const fieldErrors = ref<Record<string, string>>({})
const originalData = ref<Record<string, any>>({ ...props.modelValue })
const isDirty = ref(false)

// Computed properties
const formClasses = computed(() => [
  'form-builder',
  {
    'form-builder--dense': props.dense,
    'form-builder--readonly': props.mode === 'view',
    [`form-builder--${props.size}`]: props.size !== 'medium'
  }
])

const fieldsMap = computed(() => {
  const map: Record<string, FieldSchema> = {}
  props.schema.fields.forEach(field => {
    map[field.name] = field
  })
  return map
})

const visibleSections = computed(() => {
  return props.schema.sections.filter(section => {
    if (!section.conditions) return true
    
    return section.conditions.every(condition => {
      const fieldValue = formData[condition.field]
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value
        case 'not_equals':
          return fieldValue !== condition.value
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue)
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(fieldValue)
        default:
          return true
      }
    })
  }).filter(section => {
    // Filter sections based on field visibility
    return section.fields.some(fieldName => isFieldVisible(fieldName))
  })
})

const isValid = computed(() => {
  if (!props.autoValidate) return true
  return Object.keys(fieldErrors.value).length === 0
})

// Field methods
const getFieldSchema = (fieldName: string): FieldSchema | undefined => {
  return fieldsMap.value[fieldName]
}

const getFieldClasses = (fieldName: string) => {
  const field = getFieldSchema(fieldName)
  if (!field) return []
  
  return [
    `field-${field.type}`,
    {
      'field--required': field.required,
      'field--disabled': isFieldDisabled(fieldName),
      'field--readonly': isFieldReadonly(fieldName),
      'field--hidden': !isFieldVisible(fieldName)
    }
  ]
}

const sectionClasses = (section: FormSection) => [
  'form-section',
  {
    'form-section--single-column': (section.columns || 1) === 1,
    'form-section--multi-column': (section.columns || 1) > 1
  }
]

const isFieldVisible = (fieldName: string): boolean => {
  const field = getFieldSchema(fieldName)
  if (!field) return false

  // Check access control
  if (!canAccessField(fieldName, 'read', props.schema.access)) {
    return false
  }

  // Check dependencies
  if (field.dependencies) {
    const depField = field.dependencies.field
    const depValue = formData[depField]
    const expectedValue = field.dependencies.value
    const operator = field.dependencies.operator || 'equals'

    switch (operator) {
      case 'equals':
        return depValue === expectedValue
      case 'not_equals':
        return depValue !== expectedValue
      case 'in':
        return Array.isArray(expectedValue) && expectedValue.includes(depValue)
      case 'not_in':
        return Array.isArray(expectedValue) && !expectedValue.includes(depValue)
      default:
        return true
    }
  }

  return true
}

const isFieldDisabled = (fieldName: string): boolean => {
  const field = getFieldSchema(fieldName)
  if (!field) return true

  if (props.mode === 'view') return true
  if (field.disabled) return true
  if (props.loading) return true

  return !canAccessField(fieldName, 'write', props.schema.access)
}

const isFieldReadonly = (fieldName: string): boolean => {
  const field = getFieldSchema(fieldName)
  if (!field) return false

  return field.readonly || props.mode === 'view'
}

// Form methods
const updateField = (fieldName: string, value: any) => {
  formData[fieldName] = value
  isDirty.value = true

  if (props.validateOnChange) {
    validateField(fieldName)
  }

  emit('update:modelValue', { ...formData })
  emit('field-change', fieldName, value)
}

const validateField = (fieldName: string): boolean => {
  const field = getFieldSchema(fieldName)
  if (!field) return true

  const value = formData[fieldName]
  const validation = field.validation || {}

  // Clear previous error
  delete fieldErrors.value[fieldName]

  // Required validation
  if (field.required && (value === undefined || value === null || value === '')) {
    fieldErrors.value[fieldName] = validation.message || `${field.label} is required`
    return false
  }

  // Skip further validation if field is empty and not required
  if (!field.required && (value === undefined || value === null || value === '')) {
    return true
  }

  // Type-specific validation
  if (typeof value === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      fieldErrors.value[fieldName] = validation.message || `${field.label} must be at least ${validation.minLength} characters`
      return false
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      fieldErrors.value[fieldName] = validation.message || `${field.label} must not exceed ${validation.maxLength} characters`
      return false
    }

    if (validation.pattern) {
      const regex = new RegExp(validation.pattern)
      if (!regex.test(value)) {
        fieldErrors.value[fieldName] = validation.message || `${field.label} format is invalid`
        return false
      }
    }
  }

  if (typeof value === 'number') {
    if (validation.min !== undefined && value < validation.min) {
      fieldErrors.value[fieldName] = validation.message || `${field.label} must be at least ${validation.min}`
      return false
    }

    if (validation.max !== undefined && value > validation.max) {
      fieldErrors.value[fieldName] = validation.message || `${field.label} must not exceed ${validation.max}`
      return false
    }
  }

  return true
}

const validateForm = (): boolean => {
  fieldErrors.value = {}
  
  let isFormValid = true
  
  for (const field of props.schema.fields) {
    if (isFieldVisible(field.name) && !isFieldDisabled(field.name)) {
      const fieldValid = validateField(field.name)
      if (!fieldValid) {
        isFormValid = false
      }
    }
  }

  emit('validation-change', isFormValid, { ...fieldErrors.value })
  return isFormValid
}

const initializeFormData = () => {
  const initialData: Record<string, any> = {}
  
  props.schema.fields.forEach(field => {
    if (props.modelValue && props.modelValue[field.name] !== undefined) {
      initialData[field.name] = props.modelValue[field.name]
    } else if (field.default !== undefined) {
      initialData[field.name] = field.default
    }
  })

  Object.assign(formData, initialData)
  originalData.value = { ...initialData }
  isDirty.value = false
}

// Event handlers
const handleSubmit = () => {
  if (props.mode === 'view') return
  
  if (validateForm()) {
    emit('submit', { ...formData })
  }
}

const handleCancel = () => {
  emit('cancel')
}

const handleReset = () => {
  Object.assign(formData, originalData.value)
  fieldErrors.value = {}
  isDirty.value = false
  emit('reset')
  emit('update:modelValue', { ...formData })
}

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      Object.assign(formData, newValue)
      originalData.value = { ...newValue }
      isDirty.value = false
    }
  },
  { deep: true }
)

watch(
  () => props.schema,
  () => {
    initializeFormData()
  },
  { immediate: false }
)

// Lifecycle
onMounted(() => {
  initializeFormData()
})

// Expose public methods
defineExpose({
  validate: validateForm,
  reset: handleReset,
  getFieldValue: (fieldName: string) => formData[fieldName],
  setFieldValue: updateField,
  getFieldError: (fieldName: string) => fieldErrors.value[fieldName],
  clearFieldError: (fieldName: string) => delete fieldErrors.value[fieldName],
  isFieldVisible,
  isFieldDisabled,
  isFieldReadonly,
  isDirty: () => isDirty.value,
  isValid: () => isValid.value
})
</script>

<style scoped>
.form-builder {
  @apply w-full;
}

.form-builder--dense .form-section {
  @apply mb-4;
}

.form-builder--dense .form-section__header {
  @apply mb-2;
}

.form-builder--dense .form-section__title {
  @apply text-base;
}

.form-builder--dense .form-section__fields {
  @apply gap-3;
}

.form-builder--small {
  @apply text-sm;
}

.form-builder--large {
  @apply text-base;
}

.form-section {
  @apply mb-6;
}

.form-section:last-child {
  @apply mb-0;
}

.form-section__header {
  @apply border-b border-gray-200 dark:border-gray-700 pb-2;
}

.form-section__title {
  @apply font-medium;
}

.form-section__description {
  @apply leading-relaxed;
}

.form-section--single-column .form-section__fields {
  @apply grid-cols-1;
}

.field--hidden {
  @apply hidden;
}

.form-actions {
  @apply mt-6;
}

.form-builder--readonly .form-actions {
  @apply hidden;
}

/* Responsive design */
@media (max-width: 768px) {
  .form-section__fields {
    @apply grid-cols-1 !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .form-section__fields[style*="repeat(3"] {
    @apply grid-cols-2 !important;
  }
  
  .form-section__fields[style*="repeat(4"] {
    @apply grid-cols-2 !important;
  }
}
</style>