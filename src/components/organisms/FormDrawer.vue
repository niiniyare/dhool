<template>
  <Drawer
    v-model:visible="isVisible"
    :header="title"
    :position="position"
    :modal="modal"
    :show-close-icon="showCloseIcon"
    :blockScroll="blockScroll"
    :dismissable-mask="dismissableMask"
    class="form-drawer"
    :class="drawerClasses"
    @hide="handleHide"
    @show="handleShow"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <div class="form-drawer__content">
      <FormBuilder
        ref="formBuilderRef"
        :schema="schema"
        :model-value="modelValue"
        :mode="mode"
        :loading="loading"
        :size="size"
        :variant="variant"
        :show-actions="showFormActions"
        :show-cancel-button="false"
        :show-reset-button="showResetButton"
        :submit-label="submitLabel"
        :auto-validate="autoValidate"
        :validate-on-change="validateOnChange"
        :dense="dense"
        @update:model-value="handleModelUpdate"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @reset="handleReset"
        @field-change="handleFieldChange"
        @validation-change="handleValidationChange"
      />
    </div>

    <template v-if="showActions" #footer>
      <div class="form-drawer__actions flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          v-if="showCancelButton"
          type="button"
          label="Cancel"
          severity="secondary"
          :disabled="loading"
          @click="handleCancel"
        />
        <Button
          v-if="showResetButton && isDirty"
          type="button"
          label="Reset"
          severity="secondary"
          :disabled="loading"
          @click="handleReset"
        />
        <Button
          type="button"
          :label="submitLabel"
          :loading="loading"
          :disabled="!isValid || loading"
          @click="handleSubmitClick"
        />
      </div>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import FormBuilder from './FormBuilder.vue'
import type { FormSchema } from './FormBuilder.vue'

interface Props {
  visible?: boolean
  schema: FormSchema
  modelValue?: Record<string, any>
  title?: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'filled' | 'outlined'
  width?: string
  height?: string
  modal?: boolean
  showCloseIcon?: boolean
  blockScroll?: boolean
  dismissableMask?: boolean
  showActions?: boolean
  showCancelButton?: boolean
  showResetButton?: boolean
  submitLabel?: string
  autoValidate?: boolean
  validateOnChange?: boolean
  dense?: boolean
  closeOnSubmit?: boolean
  closeOnCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  modelValue: () => ({}),
  title: 'Form',
  position: 'right',
  mode: 'create',
  loading: false,
  size: 'medium',
  variant: 'default',
  width: '32rem',
  height: 'auto',
  modal: true,
  showCloseIcon: true,
  blockScroll: true,
  dismissableMask: true,
  showActions: true,
  showCancelButton: true,
  showResetButton: false,
  submitLabel: 'Save',
  autoValidate: true,
  validateOnChange: true,
  dense: false,
  closeOnSubmit: true,
  closeOnCancel: true
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:modelValue': [value: Record<string, any>]
  'submit': [data: Record<string, any>]
  'cancel': []
  'reset': []
  'show': []
  'hide': []
  'field-change': [field: string, value: any]
  'validation-change': [isValid: boolean, errors: Record<string, string>]
}>()

// Refs
const formBuilderRef = ref<InstanceType<typeof FormBuilder>>()
const isValid = ref(true)
const isDirty = ref(false)

// Computed
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const drawerClasses = computed(() => [
  'form-drawer',
  {
    'form-drawer--dense': props.dense,
    'form-drawer--readonly': props.mode === 'view',
    [`form-drawer--${props.size}`]: props.size !== 'medium',
    [`form-drawer--${props.position}`]: true
  }
])

const showFormActions = computed(() => {
  // Hide FormBuilder actions if drawer has its own actions
  return props.showActions ? false : true
})

// Event Handlers
const handleModelUpdate = (value: Record<string, any>) => {
  emit('update:modelValue', value)
}

const handleSubmit = (data: Record<string, any>) => {
  emit('submit', data)
  if (props.closeOnSubmit) {
    isVisible.value = false
  }
}

const handleSubmitClick = () => {
  if (formBuilderRef.value) {
    const isFormValid = formBuilderRef.value.validate()
    if (isFormValid) {
      const formData = { ...props.modelValue }
      handleSubmit(formData)
    }
  }
}

const handleCancel = () => {
  emit('cancel')
  if (props.closeOnCancel) {
    isVisible.value = false
  }
}

const handleReset = () => {
  if (formBuilderRef.value) {
    formBuilderRef.value.reset()
  }
  emit('reset')
}

const handleShow = () => {
  emit('show')
}

const handleHide = () => {
  emit('hide')
}

const handleFieldChange = (field: string, value: any) => {
  if (formBuilderRef.value) {
    isDirty.value = formBuilderRef.value.isDirty()
  }
  emit('field-change', field, value)
}

const handleValidationChange = (valid: boolean, errors: Record<string, string>) => {
  isValid.value = valid
  emit('validation-change', valid, errors)
}

// Watchers
watch(() => props.visible, (newVisible) => {
  if (newVisible && formBuilderRef.value) {
    // Reset dirty state when drawer opens
    isDirty.value = false
  }
})

// Expose methods for parent component
defineExpose({
  validate: () => formBuilderRef.value?.validate(),
  reset: () => formBuilderRef.value?.reset(),
  close: () => { isVisible.value = false },
  open: () => { isVisible.value = true },
  getFormBuilder: () => formBuilderRef.value
})
</script>

<style scoped>
.form-drawer {
  --drawer-width: v-bind(width);
  --drawer-height: v-bind(height);
}

.form-drawer :deep(.p-drawer) {
  width: var(--drawer-width);
  height: var(--drawer-height);
}

.form-drawer--right :deep(.p-drawer) {
  max-width: min(90vw, var(--drawer-width));
}

.form-drawer--left :deep(.p-drawer) {
  max-width: min(90vw, var(--drawer-width));
}

.form-drawer--top :deep(.p-drawer) {
  max-height: min(90vh, var(--drawer-height));
}

.form-drawer--bottom :deep(.p-drawer) {
  max-height: min(90vh, var(--drawer-height));
}

.form-drawer__content {
  @apply p-4 pb-0;
  min-height: 0;
  flex: 1;
  overflow-y: auto;
}

.form-drawer--dense .form-drawer__content {
  @apply p-3 pb-0;
}

.form-drawer--small .form-drawer__content {
  @apply text-sm;
}

.form-drawer--large .form-drawer__content {
  @apply text-base;
}

.form-drawer__actions {
  background-color: var(--surface-50);
  border-top: 1px solid var(--surface-200);
}

.dark .form-drawer__actions {
  background-color: var(--surface-800);
  border-top-color: var(--surface-600);
}

.form-drawer--readonly .form-drawer__actions {
  @apply hidden;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-drawer :deep(.p-drawer) {
    width: 100vw !important;
    max-width: 100vw !important;
  }

  .form-drawer--top :deep(.p-drawer),
  .form-drawer--bottom :deep(.p-drawer) {
    height: 80vh !important;
    max-height: 80vh !important;
  }
}

/* Custom drawer animations for better UX */
.form-drawer :deep(.p-drawer-enter-active),
.form-drawer :deep(.p-drawer-leave-active) {
  transition: transform 0.3s ease-in-out;
}

.form-drawer :deep(.p-drawer-mask-enter-active),
.form-drawer :deep(.p-drawer-mask-leave-active) {
  transition: background-color 0.3s ease-in-out;
}
</style>