<template>
  <div class="mobile-header">
    <div class="mobile-header-content">
      <!-- Left Section: Menu & Logo -->
      <div class="header-left">
        <Button
          icon="pi pi-bars"
          severity="secondary"
          text
          @click="$emit('toggleSidebar')"
          class="menu-toggle"
        />
        <div class="logo-section">
          <img src="/logo.svg" alt="Dhool ERP" class="logo" />
          <span class="app-name">Dhool</span>
        </div>
      </div>

      <!-- Right Section: Actions & Profile -->
      <div class="header-right">
        <!-- Search Toggle -->
        <Button
          icon="pi pi-search"
          severity="secondary"
          text
          @click="toggleSearch"
          class="action-btn"
        />

        <!-- Notifications -->
        <Button
          icon="pi pi-bell"
          severity="secondary"
          text
          :badge="notificationsCount > 0 ? String(notificationsCount) : undefined"
          badge-severity="danger"
          @click="$emit('openNotifications')"
          class="action-btn"
        />

        <!-- Profile Avatar -->
        <Button
          type="button"
          class="profile-btn"
          @click="$emit('openProfile')"
        >
          <Avatar
            :label="userInitials"
            shape="circle"
            size="small"
            class="profile-avatar"
          />
        </Button>
      </div>
    </div>

    <!-- Expandable Search -->
    <Transition name="search-expand">
      <div v-if="searchExpanded" class="search-section">
        <div class="search-container">
          <IconField icon-position="left">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Search anything..."
              class="search-input"
              @keyup.enter="handleSearch"
              ref="searchInput"
            />
          </IconField>
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            @click="closeSearch"
            class="close-search-btn"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface Props {
  user: User
  notificationsCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  notificationsCount: 0
})

const emit = defineEmits<{
  'toggleSidebar': []
  'openNotifications': []
  'openProfile': []
  'search': [query: string]
}>()

// State
const searchExpanded = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement>()

// Computed
const userInitials = computed(() => {
  return props.user.name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
})

// Methods
const toggleSearch = async () => {
  searchExpanded.value = !searchExpanded.value
  
  if (searchExpanded.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const closeSearch = () => {
  searchExpanded.value = false
  searchQuery.value = ''
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    closeSearch()
  }
}

// Watch for search close on escape
watch(searchExpanded, (expanded) => {
  if (expanded) {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch()
        document.removeEventListener('keydown', handleEscape)
      }
    }
    document.addEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
.mobile-header {
  @apply bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 shadow-sm;
}

.mobile-header-content {
  @apply flex items-center justify-between px-4 py-3 h-16;
}

.header-left {
  @apply flex items-center gap-3;
}

.menu-toggle {
  @apply p-2;
}

.logo-section {
  @apply flex items-center gap-2;
}

.logo {
  @apply h-8 w-8;
}

.app-name {
  @apply font-semibold text-lg text-surface-900 dark:text-surface-0;
}

.header-right {
  @apply flex items-center gap-2;
}

.action-btn {
  @apply p-2;
}

.profile-btn {
  @apply p-0 w-10 h-10 rounded-full overflow-hidden;
}

.profile-avatar {
  @apply w-full h-full;
}

.search-section {
  @apply px-4 pb-3;
}

.search-container {
  @apply flex items-center gap-2;
}

.search-input {
  @apply flex-1;
}

.close-search-btn {
  @apply p-2;
}

/* Search expand animation */
.search-expand-enter-active,
.search-expand-leave-active {
  transition: all 0.3s ease;
  max-height: 80px;
  opacity: 1;
}

.search-expand-enter-from,
.search-expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-bottom: 0;
}

/* Button hover states */
.action-btn:hover,
.menu-toggle:hover,
.profile-btn:hover {
  @apply bg-surface-100 dark:bg-surface-800;
}

/* Badge positioning for notifications */
.action-btn :deep(.p-badge) {
  @apply min-w-[1.2rem] h-5 text-xs;
  top: -2px;
  right: -2px;
}

/* Responsive adjustments */
@media (max-width: 380px) {
  .app-name {
    @apply hidden;
  }
  
  .header-right {
    @apply gap-1;
  }
  
  .mobile-header-content {
    @apply px-3;
  }
}

/* Touch targets */
@media (pointer: coarse) {
  .action-btn,
  .menu-toggle,
  .profile-btn {
    @apply min-w-[44px] min-h-[44px];
  }
}
</style>