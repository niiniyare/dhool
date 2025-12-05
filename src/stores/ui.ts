import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'auto'
export type SidebarState = 'expanded' | 'collapsed' | 'hidden'

export interface DrawerState {
  isOpen: boolean
  component: string | null
  props: Record<string, any>
  title?: string
}

export interface ToastMessage {
  id: string
  severity: 'success' | 'info' | 'warn' | 'error'
  summary: string
  detail?: string
  life?: number
}

export interface BreadcrumbItem {
  label: string
  url?: string
  icon?: string
}

export const useUiStore = defineStore('ui', () => {
  // State
  const theme = ref<ThemeMode>('auto')
  const isDarkMode = ref(false)
  const sidebarState = ref<SidebarState>('expanded')
  const isMobile = ref(false)
  const loading = ref(false)
  const globalLoading = ref(false)
  const drawer = ref<DrawerState>({
    isOpen: false,
    component: null,
    props: {}
  })
  const toasts = ref<ToastMessage[]>([])
  const breadcrumbs = ref<BreadcrumbItem[]>([])
  const pageTitle = ref<string>('')

  // Getters
  const effectiveTheme = computed(() => {
    if (theme.value === 'auto') {
      return isDarkMode.value ? 'dark' : 'light'
    }
    return theme.value
  })

  const isSidebarVisible = computed(() => {
    return sidebarState.value !== 'hidden'
  })

  const isSidebarExpanded = computed(() => {
    return sidebarState.value === 'expanded'
  })

  const isDrawerOpen = computed(() => {
    return drawer.value.isOpen
  })

  // Actions
  function setTheme(newTheme: ThemeMode): void {
    theme.value = newTheme
    localStorage.setItem('dhool_theme', newTheme)
    
    if (newTheme === 'auto') {
      detectSystemTheme()
    } else {
      isDarkMode.value = newTheme === 'dark'
      updateDocumentTheme()
    }
  }

  function toggleTheme(): void {
    if (theme.value === 'auto') {
      setTheme(isDarkMode.value ? 'light' : 'dark')
    } else {
      setTheme(theme.value === 'light' ? 'dark' : 'light')
    }
  }

  function setSidebarState(state: SidebarState): void {
    sidebarState.value = state
    localStorage.setItem('dhool_sidebar_state', state)
  }

  function toggleSidebar(): void {
    if (isMobile.value) {
      setSidebarState(sidebarState.value === 'hidden' ? 'expanded' : 'hidden')
    } else {
      setSidebarState(sidebarState.value === 'expanded' ? 'collapsed' : 'expanded')
    }
  }

  function setMobile(mobile: boolean): void {
    isMobile.value = mobile
    
    if (mobile && sidebarState.value === 'expanded') {
      setSidebarState('hidden')
    } else if (!mobile && sidebarState.value === 'hidden') {
      setSidebarState('expanded')
    }
  }

  function setLoading(isLoading: boolean): void {
    loading.value = isLoading
  }

  function setGlobalLoading(isLoading: boolean): void {
    globalLoading.value = isLoading
  }

  function openDrawer(component: string, props: Record<string, any> = {}, title?: string): void {
    drawer.value = {
      isOpen: true,
      component,
      props,
      title
    }
  }

  function closeDrawer(): void {
    drawer.value = {
      isOpen: false,
      component: null,
      props: {}
    }
  }

  function addToast(toast: Omit<ToastMessage, 'id'>): string {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastMessage = {
      id,
      life: 5000,
      ...toast
    }
    
    toasts.value.push(newToast)
    
    if (newToast.life && newToast.life > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.life)
    }
    
    return id
  }

  function removeToast(id: string): void {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clearToasts(): void {
    toasts.value = []
  }

  function showSuccess(summary: string, detail?: string): string {
    return addToast({
      severity: 'success',
      summary,
      detail
    })
  }

  function showError(summary: string, detail?: string): string {
    return addToast({
      severity: 'error',
      summary,
      detail
    })
  }

  function showInfo(summary: string, detail?: string): string {
    return addToast({
      severity: 'info',
      summary,
      detail
    })
  }

  function showWarning(summary: string, detail?: string): string {
    return addToast({
      severity: 'warn',
      summary,
      detail
    })
  }

  function setBreadcrumbs(items: BreadcrumbItem[]): void {
    breadcrumbs.value = items
  }

  function addBreadcrumb(item: BreadcrumbItem): void {
    breadcrumbs.value.push(item)
  }

  function clearBreadcrumbs(): void {
    breadcrumbs.value = []
  }

  function setPageTitle(title: string): void {
    pageTitle.value = title
    document.title = title ? `${title} - Dhool ERP` : 'Dhool ERP'
  }

  function detectSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    isDarkMode.value = mediaQuery.matches
    updateDocumentTheme()
    
    mediaQuery.addEventListener('change', (e) => {
      if (theme.value === 'auto') {
        isDarkMode.value = e.matches
        updateDocumentTheme()
      }
    })
  }

  function updateDocumentTheme(): void {
    const html = document.documentElement
    if (isDarkMode.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  function initializeUi(): void {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('dhool_theme') as ThemeMode
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      setTheme('auto')
    }

    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem('dhool_sidebar_state') as SidebarState
    if (savedSidebarState && ['expanded', 'collapsed', 'hidden'].includes(savedSidebarState)) {
      sidebarState.value = savedSidebarState
    }

    // Detect initial mobile state
    setMobile(window.innerWidth < 768)

    // Listen for window resize
    window.addEventListener('resize', () => {
      setMobile(window.innerWidth < 768)
    })
  }

  return {
    // State
    theme,
    isDarkMode,
    sidebarState,
    isMobile,
    loading,
    globalLoading,
    drawer,
    toasts,
    breadcrumbs,
    pageTitle,

    // Getters
    effectiveTheme,
    isSidebarVisible,
    isSidebarExpanded,
    isDrawerOpen,

    // Actions
    setTheme,
    toggleTheme,
    setSidebarState,
    toggleSidebar,
    setMobile,
    setLoading,
    setGlobalLoading,
    openDrawer,
    closeDrawer,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
    setPageTitle,
    detectSystemTheme,
    updateDocumentTheme,
    initializeUi
  }
})