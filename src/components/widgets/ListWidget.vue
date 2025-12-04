<template>
  <Card class="list-widget h-full">
    <template #content>
      <div class="list-content h-full flex flex-col">
        <!-- List Header -->
        <div v-if="widget.title" class="list-header mb-4">
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ widget.title }}
            </h4>
            <div v-if="totalItems > maxItems" class="text-sm text-gray-500 dark:text-gray-400">
              {{ maxItems }} of {{ totalItems }}
            </div>
          </div>
        </div>

        <!-- List Container -->
        <div class="list-container flex-1 overflow-hidden">
          <!-- Loading State -->
          <div v-if="loading" class="list-loading">
            <div class="space-y-3">
              <div v-for="i in 3" :key="i" class="list-item-skeleton">
                <div class="flex items-center gap-3">
                  <div v-if="showAvatar" class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                  </div>
                  <div class="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <!-- No Data State -->
          <div v-else-if="!hasData" class="list-empty">
            <div class="flex flex-col items-center justify-center py-8">
              <i class="pi pi-list text-4xl text-gray-400 mb-2" />
              <span class="text-sm text-gray-600 dark:text-gray-400">No items available</span>
            </div>
          </div>

          <!-- List Items -->
          <div v-else class="list-items space-y-2 overflow-y-auto max-h-full">
            <div
              v-for="(item, index) in displayItems"
              :key="getItemKey(item, index)"
              class="list-item"
              :class="getItemClasses(item)"
              @click="onItemClick(item)"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div v-if="showAvatar" class="list-item-avatar flex-shrink-0">
                  <Avatar
                    v-if="getAvatarValue(item)"
                    :image="isImageUrl(getAvatarValue(item)) ? getAvatarValue(item) : undefined"
                    :label="!isImageUrl(getAvatarValue(item)) ? getAvatarValue(item) : undefined"
                    shape="circle"
                    size="normal"
                    class="w-10 h-10"
                  />
                  <div v-else class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <i class="pi pi-user text-gray-500 dark:text-gray-400 text-sm" />
                  </div>
                </div>

                <!-- Content -->
                <div class="list-item-content flex-1 min-w-0">
                  <!-- Title -->
                  <div class="list-item-title">
                    <h5 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ getTitleValue(item) }}
                    </h5>
                  </div>

                  <!-- Subtitle -->
                  <div v-if="getSubtitleValue(item)" class="list-item-subtitle mt-1">
                    <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {{ getSubtitleValue(item) }}
                    </p>
                  </div>

                  <!-- Description -->
                  <div v-if="getDescriptionValue(item)" class="list-item-description mt-2">
                    <p class="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                      {{ getDescriptionValue(item) }}
                    </p>
                  </div>

                  <!-- Status Badge -->
                  <div v-if="getStatusValue(item)" class="list-item-status mt-2">
                    <Badge
                      :value="getStatusValue(item)"
                      :severity="getStatusSeverity(getStatusValue(item))"
                      size="small"
                    />
                  </div>
                </div>

                <!-- Metadata -->
                <div class="list-item-meta flex-shrink-0 text-right">
                  <!-- Timestamp -->
                  <div v-if="getTimestampValue(item)" class="list-item-timestamp">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTimestamp(getTimestampValue(item)) }}
                    </span>
                  </div>

                  <!-- Actions -->
                  <div v-if="hasActions" class="list-item-actions mt-2">
                    <Button
                      icon="pi pi-ellipsis-v"
                      severity="secondary"
                      text
                      size="small"
                      @click.stop="onItemAction(item)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Show More Button -->
            <div v-if="hasMore" class="list-show-more pt-3">
              <Button
                label="Show More"
                severity="secondary"
                text
                size="small"
                class="w-full"
                @click="loadMore"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import Card from 'primevue/card'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'

interface ListItemTemplate {
  title: string
  subtitle?: string
  description?: string
  avatar?: string
  timestamp?: string
  status?: string
}

interface ListClickAction {
  type: 'navigate' | 'modal' | 'drawer' | 'none'
  url?: string
}

interface ListWidgetConfig {
  dataSource: string
  itemTemplate: ListItemTemplate
  maxItems?: number
  showAvatar?: boolean
  clickAction?: ListClickAction
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface ListWidget {
  id: string
  type: 'list'
  title: string
  config: ListWidgetConfig
  refreshInterval?: number
}

interface Props {
  widget: ListWidget
  data?: any[]
  loading?: boolean
  editMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  loading: false,
  editMode: false
})

const emit = defineEmits<{
  refresh: []
  configure: []
  itemClick: [item: any]
  itemAction: [item: any]
  loadMore: []
}>()

// Auto-refresh setup
let refreshTimer: NodeJS.Timeout | null = null

const setupAutoRefresh = () => {
  if (props.widget.refreshInterval && props.widget.refreshInterval > 0 && !props.editMode) {
    refreshTimer = setInterval(() => {
      emit('refresh')
    }, props.widget.refreshInterval * 1000)
  }
}

const clearAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// Computed properties
const listData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return []
  
  let data = [...props.data]
  
  // Apply sorting if configured
  if (props.widget.config.sortBy) {
    const sortField = props.widget.config.sortBy
    const sortOrder = props.widget.config.sortOrder || 'asc'
    
    data.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return data
})

const hasData = computed(() => {
  return listData.value.length > 0
})

const maxItems = computed(() => {
  return props.widget.config.maxItems || 10
})

const displayItems = computed(() => {
  return listData.value.slice(0, maxItems.value)
})

const totalItems = computed(() => {
  return listData.value.length
})

const hasMore = computed(() => {
  return totalItems.value > maxItems.value
})

const showAvatar = computed(() => {
  return props.widget.config.showAvatar !== false
})

const hasActions = computed(() => {
  return props.widget.config.clickAction?.type === 'modal' || 
         props.widget.config.clickAction?.type === 'drawer'
})

const itemTemplate = computed(() => {
  return props.widget.config.itemTemplate
})

// Methods
const getItemKey = (item: any, index: number): string => {
  return item.id || item._id || index.toString()
}

const getItemClasses = (item: any): string => {
  const classes = [
    'list-item-interactive',
    'border', 'border-gray-200', 'dark:border-gray-700',
    'rounded-lg', 'p-3',
    'hover:bg-gray-50', 'dark:hover:bg-gray-800/50',
    'transition-colors', 'duration-200',
    'cursor-pointer'
  ]
  
  return classes.join(' ')
}

const getTitleValue = (item: any): string => {
  return item[itemTemplate.value.title] || 'Untitled'
}

const getSubtitleValue = (item: any): string | undefined => {
  if (!itemTemplate.value.subtitle) return undefined
  return item[itemTemplate.value.subtitle]
}

const getDescriptionValue = (item: any): string | undefined => {
  if (!itemTemplate.value.description) return undefined
  return item[itemTemplate.value.description]
}

const getAvatarValue = (item: any): string | undefined => {
  if (!itemTemplate.value.avatar) return undefined
  return item[itemTemplate.value.avatar]
}

const getTimestampValue = (item: any): string | Date | undefined => {
  if (!itemTemplate.value.timestamp) return undefined
  return item[itemTemplate.value.timestamp]
}

const getStatusValue = (item: any): string | undefined => {
  if (!itemTemplate.value.status) return undefined
  return item[itemTemplate.value.status]
}

const isImageUrl = (value: string): boolean => {
  if (!value) return false
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value) || value.startsWith('http')
}

const formatTimestamp = (timestamp: string | Date): string => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 60) {
    return diffMins <= 1 ? 'just now' : `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const getStatusSeverity = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warn',
    error: 'danger',
    success: 'success',
    warning: 'warn',
    info: 'info'
  }
  
  return statusMap[status.toLowerCase()] || 'secondary'
}

const onItemClick = (item: any) => {
  const clickAction = props.widget.config.clickAction
  
  if (!clickAction || clickAction.type === 'none') {
    emit('itemClick', item)
    return
  }
  
  switch (clickAction.type) {
    case 'navigate':
      if (clickAction.url) {
        window.location.href = clickAction.url
      }
      break
    
    case 'modal':
    case 'drawer':
      emit('itemAction', item)
      break
    
    default:
      emit('itemClick', item)
  }
}

const onItemAction = (item: any) => {
  emit('itemAction', item)
}

const loadMore = () => {
  emit('loadMore')
}

// Lifecycle
onMounted(() => {
  setupAutoRefresh()
})

onUnmounted(() => {
  clearAutoRefresh()
})

// Watchers
watch(() => props.editMode, (isEditing) => {
  if (isEditing) {
    clearAutoRefresh()
  } else {
    setupAutoRefresh()
  }
})

watch(() => props.widget.refreshInterval, () => {
  clearAutoRefresh()
  setupAutoRefresh()
})
</script>

<style scoped>
.list-widget {
  @apply w-full h-full;
}

.list-content {
  min-height: 200px;
}

.list-container {
  min-height: 150px;
}

.list-loading,
.list-empty {
  @apply h-full flex items-center justify-center;
}

.list-items {
  max-height: calc(100% - 2rem);
}

.list-item-interactive:focus {
  @apply ring-2 ring-blue-500 ring-opacity-50 outline-none;
}

.list-item-skeleton {
  @apply p-3;
}

/* Line clamp utility for description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .list-item-interactive {
    @apply p-2;
  }
  
  .list-header h4 {
    @apply text-base;
  }
  
  .list-item-title h5 {
    @apply text-xs;
  }
  
  .list-item-subtitle p,
  .list-item-description p {
    @apply text-xs;
  }
  
  .list-item-timestamp span {
    @apply text-xs;
  }
}

/* Edit mode styling */
.list-widget:hover {
  @apply ring-2 ring-blue-500 ring-opacity-50 transition-all duration-200;
}

/* Scrollbar styling for list items */
.list-items::-webkit-scrollbar {
  width: 4px;
}

.list-items::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded;
}

.list-items::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded;
}

.list-items::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Focus ring for accessibility */
.list-widget:focus-within {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}
</style>