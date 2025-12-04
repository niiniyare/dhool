<template>
  <div v-if="isFieldVisible" class="field-renderer">
    <component
      :is="componentType"
      v-bind="componentProps"
      v-model="modelValue"
      :invalid="invalid || fieldErrors.length > 0"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    
    <!-- Field-level error display for non-LinkField components -->
    <div 
      v-if="fieldErrors.length > 0 && componentType !== LinkField" 
      class="field-errors mt-1"
    >
      <small 
        v-for="error in fieldErrors" 
        :key="error"
        class="text-red-600 dark:text-red-400 text-sm block"
      >
        <i class="pi pi-exclamation-triangle text-xs mr-1" />
        {{ error }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Calendar from 'primevue/calendar'
import InputSwitch from 'primevue/inputswitch'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Password from 'primevue/password'
import InputMask from 'primevue/inputmask'
import Chips from 'primevue/chips'
import Rating from 'primevue/rating'
import Slider from 'primevue/slider'
import Knob from 'primevue/knob'
import ColorPicker from 'primevue/colorpicker'
import Editor from 'primevue/editor'
import FileUpload from 'primevue/fileupload'
import ToggleSwitch from 'primevue/toggleswitch'
import LinkField from '../extended/LinkField.vue'

interface FieldSchema {
  name: string
  label: string
  type: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    message?: string
    format?: string
  }
  currency?: boolean
  multiple?: boolean
  rows?: number
  format?: string
  suffix?: string
  prefix?: string
  step?: number
  showButtons?: boolean
  mode?: string
  dateFormat?: string
  timeOnly?: boolean
  showTime?: boolean
  showIcon?: boolean
  selectionMode?: string
  accept?: string
  maxFileSize?: number
  auto?: boolean
  customUpload?: boolean
  linkType?: string
  linkTarget?: string
  allowCreate?: boolean
  searchable?: boolean
  dependencies?: {
    field: string
    value: any
    operator?: 'equals' | 'not_equals' | 'in' | 'not_in'
  }
  api?: {
    search?: string
    create?: string
    endpoint?: string
  }
}

interface Props {
  field: FieldSchema
  modelValue?: any
  errors?: string[]
  size?: 'small' | 'large'
  variant?: 'filled' | 'outlined'
  invalid?: boolean
  formData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  errors: () => [],
  size: undefined,
  variant: undefined,
  invalid: false,
  formData: () => ({})
})

defineEmits<{
  'update:modelValue': [value: any]
}>()

const componentType = computed((): Component => {
  switch (props.field.type) {
    case 'text':
    case 'email':
    case 'url':
    case 'search':
      return InputText
    case 'textarea':
    case 'longtext':
      return Textarea
    case 'number':
    case 'integer':
    case 'float':
    case 'currency':
      return InputNumber
    case 'select':
    case 'dropdown':
      return Dropdown
    case 'multiselect':
      return MultiSelect
    case 'date':
    case 'datetime':
    case 'time':
      return Calendar
    case 'boolean':
    case 'switch':
      return InputSwitch
    case 'checkbox':
      return Checkbox
    case 'radio':
      return RadioButton
    case 'password':
      return Password
    case 'phone':
    case 'mask':
      return InputMask
    case 'tags':
    case 'chips':
      return Chips
    case 'rating':
      return Rating
    case 'slider':
    case 'range':
      return Slider
    case 'knob':
      return Knob
    case 'color':
      return ColorPicker
    case 'editor':
    case 'html':
      return Editor
    case 'file':
    case 'upload':
      return FileUpload
    case 'toggle':
      return ToggleSwitch
    case 'link':
      return LinkField
    default:
      return InputText
  }
})

const componentProps = computed(() => {
  const baseProps: Record<string, any> = {
    id: props.field.name,
    placeholder: props.field.placeholder,
    disabled: props.field.disabled,
    readonly: props.field.readonly,
    required: props.field.required,
    invalid: props.invalid || props.errors.length > 0,
    size: props.size,
    variant: props.variant
  }

  // Type-specific props
  switch (props.field.type) {
    case 'textarea':
    case 'longtext':
      return {
        ...baseProps,
        rows: props.field.rows || 3,
        autoResize: true
      }

    case 'number':
    case 'integer':
    case 'float':
    case 'currency':
      return {
        ...baseProps,
        mode: props.field.currency ? 'currency' : 'decimal',
        currency: props.field.currency ? 'USD' : undefined,
        locale: 'en-US',
        min: props.field.validation?.min,
        max: props.field.validation?.max,
        step: props.field.step || (props.field.type === 'integer' ? 1 : 0.01),
        showButtons: props.field.showButtons,
        prefix: props.field.prefix,
        suffix: props.field.suffix
      }

    case 'select':
    case 'dropdown':
      return {
        ...baseProps,
        options: props.field.options || [],
        optionLabel: 'label',
        optionValue: 'value',
        showClear: !props.field.required,
        filter: (props.field.options?.length || 0) > 10,
        filterPlaceholder: 'Search...'
      }

    case 'multiselect':
      return {
        ...baseProps,
        options: props.field.options || [],
        optionLabel: 'label',
        optionValue: 'value',
        filter: true,
        filterPlaceholder: 'Search...',
        maxSelectedLabels: 3,
        selectionLimit: props.field.validation?.max
      }

    case 'date':
      return {
        ...baseProps,
        dateFormat: props.field.dateFormat || 'mm/dd/yy',
        showIcon: props.field.showIcon !== false,
        showButtonBar: true,
        selectionMode: props.field.selectionMode || 'single'
      }

    case 'datetime':
      return {
        ...baseProps,
        dateFormat: props.field.dateFormat || 'mm/dd/yy',
        showTime: true,
        showIcon: props.field.showIcon !== false,
        showButtonBar: true
      }

    case 'time':
      return {
        ...baseProps,
        timeOnly: true,
        showIcon: props.field.showIcon !== false
      }

    case 'phone':
      return {
        ...baseProps,
        mask: '(999) 999-9999',
        placeholder: '(999) 999-9999'
      }

    case 'password':
      return {
        ...baseProps,
        toggleMask: true,
        feedback: false,
        promptLabel: 'Enter a password',
        weakLabel: 'Weak',
        mediumLabel: 'Medium',
        strongLabel: 'Strong'
      }

    case 'tags':
    case 'chips':
      return {
        ...baseProps,
        separator: ',',
        addOnBlur: true,
        allowDuplicate: false,
        max: props.field.validation?.max
      }

    case 'rating':
      return {
        ...baseProps,
        stars: props.field.validation?.max || 5,
        cancel: !props.field.required
      }

    case 'slider':
    case 'range':
      return {
        ...baseProps,
        min: props.field.validation?.min || 0,
        max: props.field.validation?.max || 100,
        step: props.field.step || 1,
        orientation: 'horizontal'
      }

    case 'knob':
      return {
        ...baseProps,
        min: props.field.validation?.min || 0,
        max: props.field.validation?.max || 100,
        step: props.field.step || 1,
        size: 100,
        showValue: true,
        valueTemplate: props.field.suffix ? `{value}${props.field.suffix}` : undefined
      }

    case 'color':
      return {
        ...baseProps,
        format: props.field.format || 'hex',
        inline: false
      }

    case 'editor':
    case 'html':
      return {
        ...baseProps,
        editorStyle: 'height: 200px'
      }

    case 'file':
    case 'upload':
      return {
        ...baseProps,
        mode: 'basic',
        accept: props.field.accept || '*',
        maxFileSize: props.field.maxFileSize || 1000000,
        auto: props.field.auto || false,
        customUpload: props.field.customUpload || false,
        chooseLabel: 'Choose File',
        uploadLabel: 'Upload',
        cancelLabel: 'Cancel'
      }

    case 'email':
      return {
        ...baseProps,
        type: 'email'
      }

    case 'url':
      return {
        ...baseProps,
        type: 'url'
      }

    case 'search':
      return {
        ...baseProps,
        type: 'search'
      }

    case 'boolean':
    case 'switch':
    case 'toggle':
      return {
        ...baseProps,
        trueValue: true,
        falseValue: false
      }

    case 'checkbox':
      return {
        ...baseProps,
        binary: true,
        trueValue: true,
        falseValue: false
      }

    case 'radio':
      return {
        ...baseProps,
        name: props.field.name,
        value: props.field.options?.[0]?.value
      }

    case 'link':
      return {
        ...baseProps,
        label: props.field.label,
        linkType: props.field.linkType || 'document',
        linkTarget: props.field.linkTarget,
        multiple: props.field.multiple || false,
        allowCreate: props.field.allowCreate || false,
        searchable: props.field.searchable !== false,
        options: props.field.options || [],
        api: props.field.api,
        error: props.errors
      }

    default:
      return baseProps
  }
})

// Check field dependencies/conditional display
const isFieldVisible = computed(() => {
  if (!props.field.dependencies) return true
  
  const { field, value, operator = 'equals' } = props.field.dependencies
  const formValue = props.formData[field]
  
  switch (operator) {
    case 'equals':
      return formValue === value
    case 'not_equals':
      return formValue !== value
    case 'in':
      return Array.isArray(value) && value.includes(formValue)
    case 'not_in':
      return Array.isArray(value) && !value.includes(formValue)
    default:
      return formValue === value
  }
})

// Enhanced validation with better error handling
const fieldErrors = computed(() => {
  const errors = [...props.errors]
  
  // Add validation errors if any
  if (props.modelValue && props.field.validation) {
    const validation = props.field.validation
    const value = props.modelValue
    
    // Pattern validation
    if (validation.pattern && typeof value === 'string') {
      const regex = new RegExp(validation.pattern)
      if (!regex.test(value)) {
        errors.push(validation.message || 'Invalid format')
      }
    }
    
    // Email format validation
    if (props.field.type === 'email' && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errors.push('Please enter a valid email address')
      }
    }
    
    // URL format validation
    if (props.field.validation?.format === 'url' || props.field.type === 'url') {
      try {
        new URL(value)
      } catch {
        errors.push('Please enter a valid URL')
      }
    }
    
    // Length validation
    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        errors.push(`Must be at least ${validation.minLength} characters`)
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        errors.push(`Must not exceed ${validation.maxLength} characters`)
      }
    }
    
    // Number validation
    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        errors.push(`Must be at least ${validation.min}`)
      }
      if (validation.max !== undefined && value > validation.max) {
        errors.push(`Must not exceed ${validation.max}`)
      }
    }
  }
  
  return errors
})
</script>