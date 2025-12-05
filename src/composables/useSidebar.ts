import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface SidebarState {
  visible: boolean
  collapsed: boolean
  position: 'left' | 'right'
  modal: boolean
}

export function useSidebar(initialState?: Partial<SidebarState>) {
  // Reactive state
  const windowWidth = ref(window.innerWidth)
  const visible = ref(initialState?.visible ?? true)
  const collapsed = ref(initialState?.collapsed ?? false)
  const position = ref(initialState?.position ?? 'left')

  // Breakpoints (following Tailwind CSS conventions)
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }

  // Computed responsive states
  const isMobile = computed(() => windowWidth.value < breakpoints.md)
  const isTablet = computed(() => 
    windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg
  )
  const isDesktop = computed(() => windowWidth.value >= breakpoints.lg)

  // Sidebar configuration
  const sidebarConfig = computed(() => ({
    visible: visible.value,
    collapsed: collapsed.value && !isMobile.value,
    position: position.value,
    modal: isMobile.value,
    dismissable: isMobile.value,
    closeOnEscape: isMobile.value,
    showCloseIcon: false,
    autoZIndex: true
  }))

  // CSS classes for sidebar
  const sidebarClasses = computed(() => [
    'app-sidebar',
    `sidebar-${position.value}`,
    {
      'sidebar-collapsed': collapsed.value && !isMobile.value,
      'sidebar-mobile': isMobile.value,
      'sidebar-tablet': isTablet.value,
      'sidebar-desktop': isDesktop.value
    }
  ])

  // Main content styles
  const mainContentStyles = computed(() => {
    const sidebarWidth = getSidebarWidth()
    
    if (isMobile.value) {
      return {}
    }

    return position.value === 'left'
      ? { marginLeft: `${sidebarWidth}px` }
      : { marginRight: `${sidebarWidth}px` }
  })

  // Get sidebar width based on state
  const getSidebarWidth = (): number => {
    if (isMobile.value || !visible.value) return 0
    return collapsed.value ? 80 : 280
  }

  // Event handlers
  const toggle = () => {
    visible.value = !visible.value
  }

  const show = () => {
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  const toggleCollapse = () => {
    if (!isMobile.value) {
      collapsed.value = !collapsed.value
      
      // Save state to localStorage
      localStorage.setItem('sidebar-collapsed', String(collapsed.value))
    }
  }

  const collapse = () => {
    if (!isMobile.value) {
      collapsed.value = true
      localStorage.setItem('sidebar-collapsed', 'true')
    }
  }

  const expand = () => {
    collapsed.value = false
    localStorage.setItem('sidebar-collapsed', 'false')
  }

  const setPosition = (newPosition: 'left' | 'right') => {
    position.value = newPosition
    localStorage.setItem('sidebar-position', newPosition)
  }

  // Handle window resize
  const handleResize = () => {
    windowWidth.value = window.innerWidth
    
    // Auto-manage sidebar visibility based on screen size
    if (isMobile.value) {
      // Hide sidebar on mobile by default
      if (visible.value) {
        visible.value = false
      }
      // Reset collapse state on mobile
      if (collapsed.value) {
        collapsed.value = false
      }
    } else {
      // Show sidebar on desktop/tablet
      if (!visible.value) {
        visible.value = true
      }
    }
  }

  // Handle sidebar hide event (for mobile)
  const onSidebarHide = () => {
    if (isMobile.value) {
      visible.value = false
    }
  }

  // Load saved state from localStorage
  const loadSavedState = () => {
    try {
      const savedCollapsed = localStorage.getItem('sidebar-collapsed')
      const savedPosition = localStorage.getItem('sidebar-position')
      
      if (savedCollapsed !== null && !isMobile.value) {
        collapsed.value = savedCollapsed === 'true'
      }
      
      if (savedPosition && ['left', 'right'].includes(savedPosition)) {
        position.value = savedPosition as 'left' | 'right'
      }
    } catch (error) {
      console.warn('Failed to load sidebar state from localStorage:', error)
    }
  }

  // Responsive sidebar management
  const setupResponsiveBehavior = () => {
    handleResize()
    loadSavedState()
  }

  // Lifecycle management
  onMounted(() => {
    window.addEventListener('resize', handleResize)
    setupResponsiveBehavior()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  // Public API
  return {
    // State
    visible,
    collapsed,
    position,
    windowWidth,
    
    // Computed
    isMobile,
    isTablet,
    isDesktop,
    sidebarConfig,
    sidebarClasses,
    mainContentStyles,
    sidebarWidth: computed(() => getSidebarWidth()),
    
    // Methods
    toggle,
    show,
    hide,
    toggleCollapse,
    collapse,
    expand,
    setPosition,
    onSidebarHide,
    
    // Utils
    getSidebarWidth
  }
}

// Sidebar store for global state management
export const sidebarStore = {
  state: ref({
    visible: true,
    collapsed: false,
    position: 'left' as const
  }),
  
  mutations: {
    setVisible: (visible: boolean) => {
      sidebarStore.state.value.visible = visible
    },
    setCollapsed: (collapsed: boolean) => {
      sidebarStore.state.value.collapsed = collapsed
    },
    setPosition: (position: 'left' | 'right') => {
      sidebarStore.state.value.position = position
    },
    toggle: () => {
      sidebarStore.state.value.visible = !sidebarStore.state.value.visible
    },
    toggleCollapse: () => {
      sidebarStore.state.value.collapsed = !sidebarStore.state.value.collapsed
    }
  }
}