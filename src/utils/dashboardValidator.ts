/**
 * Dashboard Schema Validation Utility
 * Validates dashboard configuration against the schema and business rules
 */

import type { DashboardConfig, DashboardWidget, ValidationResult, ValidationError } from '@/types/dashboard'

export interface DashboardValidationResult extends ValidationResult {
  widgets?: Record<string, ValidationResult>
}

export interface WidgetValidationContext {
  existingWidgets: DashboardWidget[]
  gridColumns: number
  maxGridRows: number
}

/**
 * Main dashboard configuration validator
 */
export class DashboardValidator {
  private errors: ValidationError[] = []
  private warnings: ValidationError[] = []

  /**
   * Validate a complete dashboard configuration
   */
  validateDashboard(config: DashboardConfig): DashboardValidationResult {
    this.errors = []
    this.warnings = []

    // Validate basic structure
    this.validateBasicStructure(config)
    
    // Validate layout configuration
    this.validateLayout(config.layout)
    
    // Validate widgets
    const widgetResults = this.validateWidgets(config.widgets, config.layout.columns)
    
    // Validate filters
    if (config.filters) {
      this.validateFilters(config.filters)
    }
    
    // Validate access control
    if (config.access) {
      this.validateAccess(config.access)
    }

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      widgets: widgetResults
    }
  }

  /**
   * Validate individual widget configuration
   */
  validateWidget(
    widget: DashboardWidget, 
    context: WidgetValidationContext
  ): ValidationResult {
    this.errors = []
    this.warnings = []

    // Validate basic widget structure
    this.validateWidgetStructure(widget)
    
    // Validate widget positioning
    this.validateWidgetPosition(widget, context)
    
    // Validate widget type-specific configuration
    this.validateWidgetConfig(widget)

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    }
  }

  /**
   * Validate basic dashboard structure
   */
  private validateBasicStructure(config: DashboardConfig): void {
    if (!config.id?.trim()) {
      this.errors.push({
        field: 'id',
        message: 'Dashboard ID is required',
        code: 'REQUIRED_FIELD'
      })
    }

    if (!config.name?.trim()) {
      this.errors.push({
        field: 'name',
        message: 'Dashboard name is required',
        code: 'REQUIRED_FIELD'
      })
    }

    if (config.name && config.name.length > 100) {
      this.errors.push({
        field: 'name',
        message: 'Dashboard name must be 100 characters or less',
        code: 'MAX_LENGTH'
      })
    }

    if (config.description && config.description.length > 500) {
      this.errors.push({
        field: 'description',
        message: 'Dashboard description must be 500 characters or less',
        code: 'MAX_LENGTH'
      })
    }
  }

  /**
   * Validate dashboard layout configuration
   */
  private validateLayout(layout: DashboardConfig['layout']): void {
    if (!layout) {
      this.errors.push({
        field: 'layout',
        message: 'Layout configuration is required',
        code: 'REQUIRED_FIELD'
      })
      return
    }

    // Validate columns
    if (!layout.columns || layout.columns < 1 || layout.columns > 24) {
      this.errors.push({
        field: 'layout.columns',
        message: 'Grid columns must be between 1 and 24',
        code: 'INVALID_RANGE'
      })
    }

    // Validate gap
    if (layout.gap !== undefined && (layout.gap < 0 || layout.gap > 50)) {
      this.errors.push({
        field: 'layout.gap',
        message: 'Grid gap must be between 0 and 50 pixels',
        code: 'INVALID_RANGE'
      })
    }

    // Validate breakpoints
    if (layout.breakpoints) {
      const breakpoints = layout.breakpoints
      const bpKeys = ['xs', 'sm', 'md', 'lg', 'xl']
      
      bpKeys.forEach(key => {
        if (breakpoints[key] && (breakpoints[key] < 320 || breakpoints[key] > 2560)) {
          this.errors.push({
            field: `layout.breakpoints.${key}`,
            message: `Breakpoint ${key} must be between 320 and 2560 pixels`,
            code: 'INVALID_RANGE'
          })
        }
      })

      // Check breakpoint ordering
      const values = bpKeys.map(key => breakpoints[key]).filter(Boolean).sort()
      if (values.length !== new Set(values).size) {
        this.warnings.push({
          field: 'layout.breakpoints',
          message: 'Breakpoint values should be unique and in ascending order',
          code: 'BREAKPOINT_ORDER'
        })
      }
    }
  }

  /**
   * Validate all widgets in the dashboard
   */
  private validateWidgets(
    widgets: DashboardWidget[], 
    gridColumns: number
  ): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {}
    
    if (!widgets || widgets.length === 0) {
      this.warnings.push({
        field: 'widgets',
        message: 'Dashboard has no widgets configured',
        code: 'EMPTY_WIDGETS'
      })
      return results
    }

    const context: WidgetValidationContext = {
      existingWidgets: widgets,
      gridColumns,
      maxGridRows: 20
    }

    // Validate each widget
    widgets.forEach(widget => {
      const validator = new DashboardValidator()
      results[widget.id] = validator.validateWidget(widget, context)
    })

    // Check for widget overlaps
    this.validateWidgetOverlaps(widgets, gridColumns)
    
    // Check for duplicate widget IDs
    this.validateWidgetIds(widgets)

    return results
  }

  /**
   * Validate basic widget structure
   */
  private validateWidgetStructure(widget: DashboardWidget): void {
    if (!widget.id?.trim()) {
      this.errors.push({
        field: 'id',
        message: 'Widget ID is required',
        code: 'REQUIRED_FIELD'
      })
    }

    if (!widget.type) {
      this.errors.push({
        field: 'type',
        message: 'Widget type is required',
        code: 'REQUIRED_FIELD'
      })
    } else if (!['stat', 'chart', 'table', 'list'].includes(widget.type)) {
      this.errors.push({
        field: 'type',
        message: 'Invalid widget type. Must be: stat, chart, table, or list',
        code: 'INVALID_VALUE'
      })
    }

    if (!widget.title?.trim()) {
      this.errors.push({
        field: 'title',
        message: 'Widget title is required',
        code: 'REQUIRED_FIELD'
      })
    } else if (widget.title.length > 100) {
      this.errors.push({
        field: 'title',
        message: 'Widget title must be 100 characters or less',
        code: 'MAX_LENGTH'
      })
    }

    if (!widget.position) {
      this.errors.push({
        field: 'position',
        message: 'Widget position is required',
        code: 'REQUIRED_FIELD'
      })
    }

    if (!widget.config) {
      this.errors.push({
        field: 'config',
        message: 'Widget configuration is required',
        code: 'REQUIRED_FIELD'
      })
    }
  }

  /**
   * Validate widget positioning within grid
   */
  private validateWidgetPosition(
    widget: DashboardWidget, 
    context: WidgetValidationContext
  ): void {
    const pos = widget.position
    if (!pos) return

    // Validate position values
    if (pos.x < 0 || pos.x >= context.gridColumns) {
      this.errors.push({
        field: 'position.x',
        message: `Widget X position must be between 0 and ${context.gridColumns - 1}`,
        code: 'INVALID_RANGE'
      })
    }

    if (pos.y < 0 || pos.y > context.maxGridRows) {
      this.errors.push({
        field: 'position.y',
        message: `Widget Y position must be between 0 and ${context.maxGridRows}`,
        code: 'INVALID_RANGE'
      })
    }

    if (pos.width < 1 || pos.width > context.gridColumns) {
      this.errors.push({
        field: 'position.width',
        message: `Widget width must be between 1 and ${context.gridColumns}`,
        code: 'INVALID_RANGE'
      })
    }

    if (pos.height < 1 || pos.height > 10) {
      this.errors.push({
        field: 'position.height',
        message: 'Widget height must be between 1 and 10',
        code: 'INVALID_RANGE'
      })
    }

    // Check if widget extends beyond grid
    if (pos.x + pos.width > context.gridColumns) {
      this.errors.push({
        field: 'position',
        message: 'Widget extends beyond grid width',
        code: 'GRID_OVERFLOW'
      })
    }
  }

  /**
   * Validate widget type-specific configuration
   */
  private validateWidgetConfig(widget: DashboardWidget): void {
    const config = widget.config
    if (!config) return

    switch (widget.type) {
      case 'stat':
        this.validateStatWidgetConfig(config)
        break
      case 'chart':
        this.validateChartWidgetConfig(config)
        break
      case 'table':
        this.validateTableWidgetConfig(config)
        break
      case 'list':
        this.validateListWidgetConfig(config)
        break
    }

    // Validate refresh interval
    if (widget.refreshInterval !== undefined) {
      if (widget.refreshInterval < 0 || widget.refreshInterval > 3600) {
        this.errors.push({
          field: 'refreshInterval',
          message: 'Refresh interval must be between 0 and 3600 seconds',
          code: 'INVALID_RANGE'
        })
      }
    }
  }

  /**
   * Validate stat widget configuration
   */
  private validateStatWidgetConfig(config: any): void {
    if (config.dataSource && !this.isValidUrl(config.dataSource)) {
      this.errors.push({
        field: 'config.dataSource',
        message: 'Invalid data source URL format',
        code: 'INVALID_URL'
      })
    }

    if (config.format && !['number', 'currency', 'percentage', 'bytes'].includes(config.format)) {
      this.errors.push({
        field: 'config.format',
        message: 'Invalid stat format',
        code: 'INVALID_VALUE'
      })
    }

    if (config.color && !['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'].includes(config.color)) {
      this.errors.push({
        field: 'config.color',
        message: 'Invalid color scheme',
        code: 'INVALID_VALUE'
      })
    }
  }

  /**
   * Validate chart widget configuration
   */
  private validateChartWidgetConfig(config: any): void {
    if (!config.chartType) {
      this.errors.push({
        field: 'config.chartType',
        message: 'Chart type is required',
        code: 'REQUIRED_FIELD'
      })
    } else if (!['line', 'bar', 'pie', 'doughnut', 'area', 'scatter'].includes(config.chartType)) {
      this.errors.push({
        field: 'config.chartType',
        message: 'Invalid chart type',
        code: 'INVALID_VALUE'
      })
    }

    if (!config.dataSource) {
      this.errors.push({
        field: 'config.dataSource',
        message: 'Data source URL is required for chart widgets',
        code: 'REQUIRED_FIELD'
      })
    } else if (!this.isValidUrl(config.dataSource)) {
      this.errors.push({
        field: 'config.dataSource',
        message: 'Invalid data source URL format',
        code: 'INVALID_URL'
      })
    }

    // Validate series configuration
    if (config.series && Array.isArray(config.series)) {
      config.series.forEach((series: any, index: number) => {
        if (!series.field) {
          this.errors.push({
            field: `config.series[${index}].field`,
            message: 'Series field name is required',
            code: 'REQUIRED_FIELD'
          })
        }
      })
    }
  }

  /**
   * Validate table widget configuration
   */
  private validateTableWidgetConfig(config: any): void {
    if (!config.dataSource) {
      this.errors.push({
        field: 'config.dataSource',
        message: 'Data source URL is required for table widgets',
        code: 'REQUIRED_FIELD'
      })
    } else if (!this.isValidUrl(config.dataSource)) {
      this.errors.push({
        field: 'config.dataSource',
        message: 'Invalid data source URL format',
        code: 'INVALID_URL'
      })
    }

    if (!config.columns || !Array.isArray(config.columns) || config.columns.length === 0) {
      this.errors.push({
        field: 'config.columns',
        message: 'At least one column is required for table widgets',
        code: 'REQUIRED_FIELD'
      })
    } else {
      config.columns.forEach((column: any, index: number) => {
        if (!column.field) {
          this.errors.push({
            field: `config.columns[${index}].field`,
            message: 'Column field name is required',
            code: 'REQUIRED_FIELD'
          })
        }
        
        if (!column.header) {
          this.errors.push({
            field: `config.columns[${index}].header`,
            message: 'Column header is required',
            code: 'REQUIRED_FIELD'
          })
        }

        if (column.format && !['text', 'number', 'currency', 'percentage', 'date', 'datetime', 'badge', 'email', 'phone'].includes(column.format)) {
          this.errors.push({
            field: `config.columns[${index}].format`,
            message: 'Invalid column format',
            code: 'INVALID_VALUE'
          })
        }
      })
    }

    if (config.pageSize && (config.pageSize < 1 || config.pageSize > 50)) {
      this.errors.push({
        field: 'config.pageSize',
        message: 'Page size must be between 1 and 50',
        code: 'INVALID_RANGE'
      })
    }
  }

  /**
   * Validate list widget configuration
   */
  private validateListWidgetConfig(config: any): void {
    if (!config.dataSource) {
      this.errors.push({
        field: 'config.dataSource',
        message: 'Data source URL is required for list widgets',
        code: 'REQUIRED_FIELD'
      })
    } else if (!this.isValidUrl(config.dataSource)) {
      this.errors.push({
        field: 'config.dataSource',
        message: 'Invalid data source URL format',
        code: 'INVALID_URL'
      })
    }

    if (!config.itemTemplate) {
      this.errors.push({
        field: 'config.itemTemplate',
        message: 'Item template is required for list widgets',
        code: 'REQUIRED_FIELD'
      })
    } else {
      if (!config.itemTemplate.title) {
        this.errors.push({
          field: 'config.itemTemplate.title',
          message: 'Title field is required for item template',
          code: 'REQUIRED_FIELD'
        })
      }
    }

    if (config.maxItems && (config.maxItems < 1 || config.maxItems > 100)) {
      this.errors.push({
        field: 'config.maxItems',
        message: 'Max items must be between 1 and 100',
        code: 'INVALID_RANGE'
      })
    }

    if (config.clickAction) {
      if (!['navigate', 'modal', 'drawer', 'none'].includes(config.clickAction.type)) {
        this.errors.push({
          field: 'config.clickAction.type',
          message: 'Invalid click action type',
          code: 'INVALID_VALUE'
        })
      }

      if (config.clickAction.type === 'navigate' && config.clickAction.url && !this.isValidUrl(config.clickAction.url)) {
        this.errors.push({
          field: 'config.clickAction.url',
          message: 'Invalid navigation URL format',
          code: 'INVALID_URL'
        })
      }
    }
  }

  /**
   * Validate dashboard filters configuration
   */
  private validateFilters(filters: DashboardConfig['filters']): void {
    if (!filters) return

    // Validate date range filter
    if (filters.dateRange) {
      if (filters.dateRange.defaultRange && 
          !['today', 'week', 'month', 'quarter', 'year', 'custom'].includes(filters.dateRange.defaultRange)) {
        this.errors.push({
          field: 'filters.dateRange.defaultRange',
          message: 'Invalid default date range value',
          code: 'INVALID_VALUE'
        })
      }
    }

    // Validate custom filters
    if (filters.customFilters && Array.isArray(filters.customFilters)) {
      filters.customFilters.forEach((filter: any, index: number) => {
        if (!filter.field) {
          this.errors.push({
            field: `filters.customFilters[${index}].field`,
            message: 'Filter field is required',
            code: 'REQUIRED_FIELD'
          })
        }

        if (!filter.type || !['select', 'multiselect', 'text', 'number', 'date'].includes(filter.type)) {
          this.errors.push({
            field: `filters.customFilters[${index}].type`,
            message: 'Invalid filter type',
            code: 'INVALID_VALUE'
          })
        }

        if (!filter.label) {
          this.errors.push({
            field: `filters.customFilters[${index}].label`,
            message: 'Filter label is required',
            code: 'REQUIRED_FIELD'
          })
        }
      })
    }
  }

  /**
   * Validate access control configuration
   */
  private validateAccess(access: DashboardConfig['access']): void {
    if (!access) return

    // Validate roles
    if (access.roles && !Array.isArray(access.roles)) {
      this.errors.push({
        field: 'access.roles',
        message: 'Roles must be an array of strings',
        code: 'INVALID_TYPE'
      })
    }

    // Validate permissions
    if (access.permissions) {
      ['view', 'edit'].forEach(permission => {
        const perms = access.permissions?.[permission as keyof typeof access.permissions]
        if (perms && !Array.isArray(perms)) {
          this.errors.push({
            field: `access.permissions.${permission}`,
            message: `${permission} permissions must be an array of strings`,
            code: 'INVALID_TYPE'
          })
        }
      })
    }
  }

  /**
   * Check for widget overlaps in the grid
   */
  private validateWidgetOverlaps(widgets: DashboardWidget[], gridColumns: number): void {
    for (let i = 0; i < widgets.length; i++) {
      for (let j = i + 1; j < widgets.length; j++) {
        const widget1 = widgets[i]
        const widget2 = widgets[j]

        if (this.doWidgetsOverlap(widget1.position, widget2.position)) {
          this.errors.push({
            field: 'widgets',
            message: `Widgets "${widget1.title}" and "${widget2.title}" overlap in the grid`,
            code: 'WIDGET_OVERLAP'
          })
        }
      }
    }
  }

  /**
   * Check for duplicate widget IDs
   */
  private validateWidgetIds(widgets: DashboardWidget[]): void {
    const ids = new Set<string>()
    
    widgets.forEach(widget => {
      if (ids.has(widget.id)) {
        this.errors.push({
          field: 'widgets',
          message: `Duplicate widget ID: ${widget.id}`,
          code: 'DUPLICATE_ID'
        })
      }
      ids.add(widget.id)
    })
  }

  /**
   * Check if two widget positions overlap
   */
  private doWidgetsOverlap(pos1: DashboardWidget['position'], pos2: DashboardWidget['position']): boolean {
    const x1End = pos1.x + pos1.width
    const y1End = pos1.y + pos1.height
    const x2End = pos2.x + pos2.width
    const y2End = pos2.y + pos2.height

    return !(x1End <= pos2.x || pos1.x >= x2End || y1End <= pos2.y || pos1.y >= y2End)
  }

  /**
   * Simple URL validation
   */
  private isValidUrl(url: string): boolean {
    try {
      // Allow relative URLs for API endpoints
      if (url.startsWith('/')) return true
      
      // Validate absolute URLs
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Quick validation functions for common use cases
 */
export const validateDashboard = (config: DashboardConfig): DashboardValidationResult => {
  const validator = new DashboardValidator()
  return validator.validateDashboard(config)
}

export const validateWidget = (
  widget: DashboardWidget, 
  context: WidgetValidationContext
): ValidationResult => {
  const validator = new DashboardValidator()
  return validator.validateWidget(widget, context)
}

/**
 * Validation result helpers
 */
export const hasErrors = (result: ValidationResult): boolean => {
  return !result.isValid || result.errors.length > 0
}

export const hasWarnings = (result: ValidationResult): boolean => {
  return result.warnings.length > 0
}

export const getErrorMessages = (result: ValidationResult): string[] => {
  return result.errors.map(error => error.message)
}

export const getWarningMessages = (result: ValidationResult): string[] => {
  return result.warnings.map(warning => warning.message)
}