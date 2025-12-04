/**
 * Dashboard Type Definitions
 * Comprehensive types for the dashboard system
 */

// Base Interfaces
export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

// Dashboard Configuration Types
export interface DashboardLayout {
  columns: number
  gap: number
  responsive: boolean
  breakpoints?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export interface DashboardWidget {
  id: string
  type: 'stat' | 'chart' | 'table' | 'list'
  title: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config: WidgetConfig
  refreshInterval?: number
  visible?: boolean
}

export interface DashboardFilter {
  field: string
  type: 'select' | 'multiselect' | 'text' | 'number' | 'date'
  label: string
  options?: Array<{
    label: string
    value: string
  }>
}

export interface DashboardFilters {
  dateRange?: {
    enabled: boolean
    defaultRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  }
  customFilters?: DashboardFilter[]
}

export interface DashboardAccess {
  roles?: string[]
  permissions?: {
    view?: string[]
    edit?: string[]
  }
}

export interface DashboardMetadata {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  tags?: string[]
  version?: string
}

export interface DashboardConfig {
  id: string
  name: string
  description?: string
  icon?: string
  layout: DashboardLayout
  widgets: DashboardWidget[]
  filters?: DashboardFilters
  access?: DashboardAccess
  metadata?: DashboardMetadata
}

// Widget Configuration Types
export type WidgetConfig = 
  | StatWidgetConfig 
  | ChartWidgetConfig 
  | TableWidgetConfig 
  | ListWidgetConfig

export interface StatWidgetConfig {
  value?: string | number
  label?: string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'
  format?: 'number' | 'currency' | 'percentage' | 'bytes'
  precision?: number
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    period?: string
  }
  dataSource?: string
}

export interface ChartSeries {
  field: string
  label: string
  color?: string
}

export interface ChartWidgetConfig {
  chartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter'
  dataSource: string
  xAxis?: string
  yAxis?: string
  series?: ChartSeries[]
  options?: {
    responsive?: boolean
    legend?: {
      display?: boolean
      position?: 'top' | 'bottom' | 'left' | 'right' | 'external'
    }
    animation?: boolean
    scales?: any
    plugins?: any
  }
}

export interface TableColumn {
  field: string
  header: string
  sortable?: boolean
  width?: string
  format?: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'datetime' | 'badge' | 'email' | 'phone'
  align?: 'left' | 'center' | 'right'
  class?: string
}

export interface TableWidgetConfig {
  dataSource: string
  columns: TableColumn[]
  pageSize?: number
  showHeader?: boolean
  striped?: boolean
  sortable?: boolean
  scrollable?: boolean
  height?: string
}

export interface ListItemTemplate {
  title: string
  subtitle?: string
  description?: string
  avatar?: string
  timestamp?: string
  status?: string
}

export interface ListClickAction {
  type: 'navigate' | 'modal' | 'drawer' | 'none'
  url?: string
}

export interface ListWidgetConfig {
  dataSource: string
  itemTemplate: ListItemTemplate
  maxItems?: number
  showAvatar?: boolean
  clickAction?: ListClickAction
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Dashboard State Types
export interface DashboardState {
  config: DashboardConfig | null
  loading: boolean
  saving: boolean
  error: Error | null
  editMode: boolean
  selectedWidget: DashboardWidget | null
}

export interface WidgetState {
  data: Record<string, any>
  loading: Record<string, boolean>
  errors: Record<string, string>
  lastRefresh: Record<string, Date>
}

export interface FilterState {
  dateRange: Date[] | null
  custom: Record<string, any>
  active: boolean
}

// Dashboard Events
export interface DashboardEvent {
  type: 'widget_added' | 'widget_updated' | 'widget_deleted' | 'layout_changed' | 'filter_applied'
  timestamp: Date
  data: any
  userId?: string
}

// Dashboard API Types
export interface DashboardApiResponse {
  success: boolean
  data?: DashboardConfig
  error?: string
  validation?: ValidationResult
}

export interface WidgetDataResponse {
  success: boolean
  data?: any
  error?: string
  meta?: {
    total: number
    page: number
    pageSize: number
    lastUpdated: string
  }
}

export interface DashboardListResponse {
  success: boolean
  data?: DashboardConfig[]
  meta?: {
    total: number
    page: number
    pageSize: number
  }
  error?: string
}

// Dashboard Template Types
export interface DashboardTemplate {
  id: string
  name: string
  description: string
  category: string
  thumbnail?: string
  config: Omit<DashboardConfig, 'id' | 'metadata'>
  tags: string[]
}

export interface DashboardTemplateCategory {
  id: string
  name: string
  description: string
  icon: string
  templates: DashboardTemplate[]
}

// Export/Import Types
export interface DashboardExportData {
  version: string
  exportedAt: string
  dashboard: DashboardConfig
  widgets: {
    [widgetId: string]: {
      sampleData?: any
      dataSchema?: any
    }
  }
}

export interface DashboardImportOptions {
  preserveIds: boolean
  overwriteExisting: boolean
  validateData: boolean
  importSampleData: boolean
}

export interface DashboardImportResult {
  success: boolean
  dashboard?: DashboardConfig
  errors: ValidationError[]
  warnings: ValidationError[]
  skippedWidgets: string[]
}

// Dashboard Permissions
export interface DashboardPermissions {
  canView: boolean
  canEdit: boolean
  canDelete: boolean
  canShare: boolean
  canExport: boolean
  canManageAccess: boolean
}

// Dashboard Analytics
export interface DashboardUsageStats {
  dashboardId: string
  views: number
  uniqueUsers: number
  averageSessionDuration: number
  lastAccessed: Date
  popularWidgets: Array<{
    widgetId: string
    title: string
    interactions: number
  }>
}

export interface WidgetPerformanceStats {
  widgetId: string
  type: string
  averageLoadTime: number
  errorRate: number
  refreshCount: number
  lastError?: string
}

// Theme and Styling
export interface DashboardTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    danger: string
    background: string
    surface: string
    text: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Type Guards
export const isStatWidget = (widget: DashboardWidget): widget is DashboardWidget & { config: StatWidgetConfig } => {
  return widget.type === 'stat'
}

export const isChartWidget = (widget: DashboardWidget): widget is DashboardWidget & { config: ChartWidgetConfig } => {
  return widget.type === 'chart'
}

export const isTableWidget = (widget: DashboardWidget): widget is DashboardWidget & { config: TableWidgetConfig } => {
  return widget.type === 'table'
}

export const isListWidget = (widget: DashboardWidget): widget is DashboardWidget & { config: ListWidgetConfig } => {
  return widget.type === 'list'
}

// Constants
export const WIDGET_TYPES = ['stat', 'chart', 'table', 'list'] as const
export const CHART_TYPES = ['line', 'bar', 'pie', 'doughnut', 'area', 'scatter'] as const
export const COLOR_SCHEMES = ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'] as const
export const COLUMN_FORMATS = ['text', 'number', 'currency', 'percentage', 'date', 'datetime', 'badge', 'email', 'phone'] as const

export const DEFAULT_GRID_COLUMNS = 12
export const MAX_GRID_COLUMNS = 24
export const MAX_GRID_ROWS = 20
export const MIN_WIDGET_SIZE = 1
export const MAX_WIDGET_HEIGHT = 10

export const DEFAULT_REFRESH_INTERVAL = 300 // 5 minutes
export const MIN_REFRESH_INTERVAL = 30 // 30 seconds
export const MAX_REFRESH_INTERVAL = 3600 // 1 hour