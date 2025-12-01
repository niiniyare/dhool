#!/bin/bash
# =============================================================================
# dhool-implement.sh - Dhool ERP Implementation with Audit System
# =============================================================================
#
# Version 2.0 - Added audit/review capabilities for existing work
#
# New Features:
#   --audit         Verify all completed tasks have actual files
#   --audit-task    Audit specific task
#   --fix-task      Re-run a specific task
#   --report        Generate detailed implementation report
#
# Usage:
#   ./dhool-implement.sh --audit           # Check what was actually created
#   ./dhool-implement.sh --resume          # Resume from T3.2 (failed)
#   ./dhool-implement.sh --fix-task T3.2   # Retry failed task
#   ./dhool-implement.sh --status          # Show current progress with audit info
#
# =============================================================================

set -o pipefail

# =============================================================================
# Configuration
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${PROJECT_ROOT:-.}"

# Directory paths
SRC_DIR="${SRC_DIR:-$PROJECT_ROOT/src}"
COMPONENTS_DIR="$SRC_DIR/components"
MOLECULES_DIR="$COMPONENTS_DIR/molecules"
ORGANISMS_DIR="$COMPONENTS_DIR/organisms"
TEMPLATES_DIR="$COMPONENTS_DIR/templates"
RENDERERS_DIR="$COMPONENTS_DIR/renderers"
EXTENDED_DIR="$COMPONENTS_DIR/extended"
VIEWS_DIR="$SRC_DIR/views"
STORES_DIR="$SRC_DIR/stores"
SERVICES_DIR="$SRC_DIR/services"
COMPOSABLES_DIR="$SRC_DIR/composables"
TYPES_DIR="$SRC_DIR/types"
SCHEMAS_DIR="$SRC_DIR/schemas"
UTILS_DIR="$SRC_DIR/utils"
ROUTER_DIR="$SRC_DIR/router"

# State files
STATE_FILE="${STATE_FILE:-.dhool-state}"
LOG_FILE="${LOG_FILE:-./dhool-implement.log}"
AUDIT_REPORT="${AUDIT_REPORT:-./dhool-audit-report.md}"

# Dev server
DEV_PORT="${DEV_PORT:-5173}"
MAX_FIX_ATTEMPTS=3

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# =============================================================================
# Task Registry with Expected Files
# =============================================================================

declare -A TASK_STATUS
declare -A TASK_DESC
declare -A TASK_PHASE
declare -A TASK_FILES    # Expected files for each task
declare -A AUDIT_RESULTS # Audit results
declare -a TASK_ORDER

register_task() {
	local id="$1" phase="$2" desc="$3" files="$4"
	TASK_ORDER+=("$id")
	TASK_DESC[$id]="$desc"
	TASK_PHASE[$id]="$phase"
	TASK_FILES[$id]="$files"
	TASK_STATUS[$id]="${TASK_STATUS[$id]:-pending}"
}

register_all_tasks() {
	# PHASE 0: Pre-flight
	register_task "T0.1" "PHASE 0: Pre-flight" "Check contradictions" ""
	register_task "T0.2" "PHASE 0: Pre-flight" "Verify PrimeVue 4" "package.json"
	register_task "T0.3" "PHASE 0: Pre-flight" "Create directories" "$SRC_DIR/components $SRC_DIR/types $SRC_DIR/services"

	# PHASE 1: Core Setup
	register_task "T1.1" "PHASE 1: Core Setup" "TypeScript types" "$TYPES_DIR/schema.ts $TYPES_DIR/access.ts $TYPES_DIR/api.ts $TYPES_DIR/index.ts"
	register_task "T1.2" "PHASE 1: Core Setup" "PrimeVue 4 setup" "$SRC_DIR/main.ts"
	register_task "T1.3" "PHASE 1: Core Setup" "Tailwind config" "$PROJECT_ROOT/tailwind.config.ts"
	register_task "T1.4" "PHASE 1: Core Setup" "Auto-imports" "$PROJECT_ROOT/vite.config.ts"
	register_task "T1.5" "PHASE 1: Core Setup" "API service" "$SERVICES_DIR/api.ts"
	register_task "T1.6" "PHASE 1: Core Setup" "Component showcase" "$VIEWS_DIR/showcase/index.vue"

	# PHASE 2: Access & Schema
	register_task "T2.1" "PHASE 2: Access & Schema" "AccessService" "$SERVICES_DIR/access.ts"
	register_task "T2.2" "PHASE 2: Access & Schema" "SchemaService" "$SERVICES_DIR/schema.ts"
	register_task "T2.3" "PHASE 2: Access & Schema" "Access store" "$STORES_DIR/access.ts"
	register_task "T2.4" "PHASE 2: Access & Schema" "useAccess" "$COMPOSABLES_DIR/useAccess.ts"
	register_task "T2.5" "PHASE 2: Access & Schema" "useSchema" "$COMPOSABLES_DIR/useSchema.ts"
	register_task "T2.6" "PHASE 2: Access & Schema" "useCrud" "$COMPOSABLES_DIR/useCrud.ts"
	register_task "T2.7" "PHASE 2: Access & Schema" "Access demo" "$VIEWS_DIR/demo/access.vue"

	# PHASE 3: Schemas
	register_task "T3.1" "PHASE 3: Schemas" "customer.json" "$SCHEMAS_DIR/customer.json"
	register_task "T3.2" "PHASE 3: Schemas" "invoice.json" "$SCHEMAS_DIR/invoice.json"
	register_task "T3.3" "PHASE 3: Schemas" "product.json" "$SCHEMAS_DIR/product.json"
	register_task "T3.4" "PHASE 3: Schemas" "dashboard.json" "$SCHEMAS_DIR/dashboard.json"
	register_task "T3.5" "PHASE 3: Schemas" "Schema validator" "$UTILS_DIR/schemaValidator.ts"
	register_task "T3.6" "PHASE 3: Schemas" "Schema viewer" "$VIEWS_DIR/demo/schemas.vue"

	# PHASE 4: Molecules
	register_task "T4.1" "PHASE 4: Molecules" "FormField" "$MOLECULES_DIR/FormField.vue"
	register_task "T4.2" "PHASE 4: Molecules" "StatCard" "$MOLECULES_DIR/StatCard.vue"
	register_task "T4.3" "PHASE 4: Molecules" "ActionMenu" "$MOLECULES_DIR/ActionMenu.vue"
	register_task "T4.4" "PHASE 4: Molecules" "EmptyState" "$MOLECULES_DIR/EmptyState.vue"
	register_task "T4.5" "PHASE 4: Molecules" "Molecules showcase" "$VIEWS_DIR/showcase/molecules.vue"

	# PHASE 5: Organisms
	register_task "T5.1" "PHASE 5: Organisms" "DataTableCrud" "$ORGANISMS_DIR/DataTableCrud.vue"
	register_task "T5.2" "PHASE 5: Organisms" "FormBuilder" "$ORGANISMS_DIR/FormBuilder.vue"
	register_task "T5.3" "PHASE 5: Organisms" "FormDrawer" "$ORGANISMS_DIR/FormDrawer.vue"
	register_task "T5.4" "PHASE 5: Organisms" "Organisms showcase" "$VIEWS_DIR/showcase/organisms.vue"

	# PHASE 6: Renderers
	register_task "T6.1" "PHASE 6: Renderers" "FieldRenderer" "$RENDERERS_DIR/FieldRenderer.vue"
	register_task "T6.2" "PHASE 6: Renderers" "DocumentPage" "$RENDERERS_DIR/DocumentPage.vue"
	register_task "T6.3" "PHASE 6: Renderers" "DashboardPage" "$RENDERERS_DIR/DashboardPage.vue"
	register_task "T6.4" "PHASE 6: Renderers" "Renderer demo" "$VIEWS_DIR/demo/renderer.vue"

	# PHASE 7: Extended
	register_task "T7.1" "PHASE 7: Extended" "LinkField" "$EXTENDED_DIR/LinkField.vue"
	register_task "T7.2" "PHASE 7: Extended" "AppDataTable" "$EXTENDED_DIR/AppDataTable.vue"
	register_task "T7.3" "PHASE 7: Extended" "CurrencyInput" "$EXTENDED_DIR/CurrencyInput.vue"
	register_task "T7.4" "PHASE 7: Extended" "Extended showcase" "$VIEWS_DIR/showcase/extended.vue"

	# PHASE 8: Templates
	register_task "T8.1" "PHASE 8: Templates" "MainLayout" "$TEMPLATES_DIR/MainLayout.vue"
	register_task "T8.2" "PHASE 8: Templates" "AuthLayout" "$TEMPLATES_DIR/AuthLayout.vue"
	register_task "T8.3" "PHASE 8: Templates" "AppSidebar" "$TEMPLATES_DIR/AppSidebar.vue"
	register_task "T8.4" "PHASE 8: Templates" "AppTopbar" "$TEMPLATES_DIR/AppTopbar.vue"

	# PHASE 9: Stores
	register_task "T9.1" "PHASE 9: Stores" "authStore" "$STORES_DIR/auth.ts"
	register_task "T9.2" "PHASE 9: Stores" "tenantStore" "$STORES_DIR/tenant.ts"
	register_task "T9.3" "PHASE 9: Stores" "uiStore" "$STORES_DIR/ui.ts"
	register_task "T9.4" "PHASE 9: Stores" "schemaStore" "$STORES_DIR/schema.ts"

	# PHASE 10: Router
	register_task "T10.1" "PHASE 10: Router" "Router setup" "$ROUTER_DIR/index.ts"
	register_task "T10.2" "PHASE 10: Router" "Dynamic routes" "$ROUTER_DIR/dynamicRoutes.ts"
	register_task "T10.3" "PHASE 10: Router" "Auth guard" "$ROUTER_DIR/guards/auth.ts"
	register_task "T10.4" "PHASE 10: Router" "Access guard" "$ROUTER_DIR/guards/access.ts"

	# PHASE 11: Integration
	register_task "T11.1" "PHASE 11: Integration" "App.vue" "$SRC_DIR/App.vue"
	register_task "T11.2" "PHASE 11: Integration" "CustomerList" "$VIEWS_DIR/customers/index.vue"
	register_task "T11.3" "PHASE 11: Integration" "InvoiceList" "$VIEWS_DIR/invoices/index.vue"
	register_task "T11.4" "PHASE 11: Integration" "Dashboard" "$VIEWS_DIR/dashboard/index.vue"
	register_task "T11.5" "PHASE 11: Integration" "Demo index" "$VIEWS_DIR/demo/index.vue"

	# PHASE 12: Validation
	register_task "T12.1" "PHASE 12: Validation" "TypeScript check" ""
	register_task "T12.2" "PHASE 12: Validation" "PrimeVue 4 patterns" ""
	register_task "T12.3" "PHASE 12: Validation" "Schema validation" ""
	register_task "T12.4" "PHASE 12: Validation" "Final report" ""
}

# =============================================================================
# Logging
# =============================================================================

log() { echo -e "$1" | tee -a "$LOG_FILE"; }
log_info() { log "${BLUE}[INFO]${NC} $1"; }
log_success() { log "${GREEN}[✓]${NC} $1"; }
log_warn() { log "${YELLOW}[!]${NC} $1"; }
log_error() { log "${RED}[✗]${NC} $1"; }
log_audit() { log "${CYAN}[AUDIT]${NC} $1"; }

log_header() {
	echo "" | tee -a "$LOG_FILE"
	echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE"
	echo -e "${BOLD}  $1${NC}" | tee -a "$LOG_FILE"
	echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE"
}

# =============================================================================
# State Management
# =============================================================================

init_state() {
	if [[ -f "$STATE_FILE" ]]; then
		source "$STATE_FILE"
	fi
}

save_state() {
	{
		echo "# Dhool ERP State - $(date)"
		echo "LAST_TASK=\"$LAST_TASK\""
		echo "LAST_STATUS=\"$LAST_STATUS\""
		echo "DEV_SERVER_PID=\"$DEV_SERVER_PID\""
		echo ""
		echo "# Task Status"
		for task in "${TASK_ORDER[@]}"; do
			echo "TASK_STATUS[$task]=\"${TASK_STATUS[$task]:-pending}\""
		done
		echo ""
		echo "# Audit Results"
		for task in "${!AUDIT_RESULTS[@]}"; do
			echo "AUDIT_RESULTS[$task]=\"${AUDIT_RESULTS[$task]}\""
		done
	} >"$STATE_FILE"
}

set_task_status() {
	TASK_STATUS[$1]="$2"
	LAST_TASK="$1"
	LAST_STATUS="$2"
	save_state
}

# =============================================================================
# Audit System
# =============================================================================

audit_task() {
	local task_id="$1"
	local expected_files="${TASK_FILES[$task_id]}"
	local status="${TASK_STATUS[$task_id]}"

	# Skip pending tasks
	if [[ "$status" == "pending" ]]; then
		AUDIT_RESULTS[$task_id]="pending"
		return 0
	fi

	# No files to check
	if [[ -z "$expected_files" ]]; then
		AUDIT_RESULTS[$task_id]="no_files"
		return 0
	fi

	local missing=""
	local found=""
	local total=0
	local found_count=0

	for file in $expected_files; do
		((total++))
		if [[ -f "$file" || -d "$file" ]]; then
			((found_count++))
			found+="$file "
		else
			missing+="$file "
		fi
	done

	if [[ $found_count -eq $total ]]; then
		AUDIT_RESULTS[$task_id]="pass:$found_count/$total"
		return 0
	elif [[ $found_count -gt 0 ]]; then
		AUDIT_RESULTS[$task_id]="partial:$found_count/$total:missing=$missing"
		return 1
	else
		AUDIT_RESULTS[$task_id]="fail:0/$total:missing=$missing"
		return 1
	fi
}

audit_all() {
	log_header "Auditing Completed Tasks"

	local pass=0 partial=0 fail=0 pending=0

	for task in "${TASK_ORDER[@]}"; do
		local status="${TASK_STATUS[$task]}"

		if [[ "$status" == "completed" || "$status" == "needs_audit" ]]; then
			if audit_task "$task"; then
				log_success "$task: ${TASK_DESC[$task]} - ${AUDIT_RESULTS[$task]}"
				((pass++))
				# Upgrade needs_audit to completed if files exist
				[[ "$status" == "needs_audit" ]] && set_task_status "$task" "completed"
			else
				local result="${AUDIT_RESULTS[$task]}"
				if [[ "$result" == partial* ]]; then
					log_warn "$task: ${TASK_DESC[$task]} - $result"
					((partial++))
					set_task_status "$task" "partial"
				else
					log_error "$task: ${TASK_DESC[$task]} - $result"
					((fail++))
					set_task_status "$task" "failed"
				fi
			fi
		elif [[ "$status" == "failed" ]]; then
			audit_task "$task"
			log_error "$task: ${TASK_DESC[$task]} - failed (${AUDIT_RESULTS[$task]})"
			((fail++))
		else
			((pending++))
		fi
	done

	echo ""
	log_header "Audit Summary"
	echo -e "${GREEN}Pass:${NC} $pass  ${YELLOW}Partial:${NC} $partial  ${RED}Fail:${NC} $fail  ${DIM}Pending:${NC} $pending"

	# Generate report
	generate_audit_report

	return $((fail + partial))
}

generate_audit_report() {
	{
		echo "# Dhool ERP Audit Report"
		echo "Generated: $(date)"
		echo ""
		echo "## Summary"
		echo ""

		local current_phase=""
		for task in "${TASK_ORDER[@]}"; do
			local phase="${TASK_PHASE[$task]}"
			local status="${TASK_STATUS[$task]}"
			local audit="${AUDIT_RESULTS[$task]:-not_audited}"
			local files="${TASK_FILES[$task]}"

			if [[ "$phase" != "$current_phase" ]]; then
				current_phase="$phase"
				echo ""
				echo "### $phase"
				echo ""
			fi

			local icon="⬜"
			case "$status" in
			completed) icon="✅" ;;
			partial) icon="🟡" ;;
			failed) icon="❌" ;;
			needs_audit) icon="🔍" ;;
			pending) icon="⬜" ;;
			esac

			echo "- $icon **$task**: ${TASK_DESC[$task]}"
			if [[ -n "$files" ]]; then
				echo "  - Files: \`$files\`"
			fi
			if [[ "$audit" != "not_audited" && "$audit" != "pending" ]]; then
				echo "  - Audit: $audit"
			fi
		done

		echo ""
		echo "## Next Steps"
		echo ""

		# Find first incomplete task
		for task in "${TASK_ORDER[@]}"; do
			local status="${TASK_STATUS[$task]}"
			if [[ "$status" == "failed" || "$status" == "partial" ]]; then
				echo "1. Fix **$task**: ${TASK_DESC[$task]}"
				echo "   \`\`\`bash"
				echo "   ./dhool-implement.sh --fix-task $task"
				echo "   \`\`\`"
				break
			elif [[ "$status" == "pending" ]]; then
				echo "1. Continue from **$task**: ${TASK_DESC[$task]}"
				echo "   \`\`\`bash"
				echo "   ./dhool-implement.sh --resume"
				echo "   \`\`\`"
				break
			fi
		done

	} >"$AUDIT_REPORT"

	log_info "Report saved to: $AUDIT_REPORT"
}

# =============================================================================
# Status Display
# =============================================================================

show_status() {
	log_header "Dhool ERP Implementation Status"

	local completed=0 failed=0 partial=0 pending=0 needs_audit=0
	local current_phase=""

	for task in "${TASK_ORDER[@]}"; do
		local status="${TASK_STATUS[$task]:-pending}"
		local phase="${TASK_PHASE[$task]}"

		if [[ "$phase" != "$current_phase" ]]; then
			current_phase="$phase"
			echo ""
			echo -e "${BOLD}$phase${NC}"
		fi

		local audit_info=""
		if [[ -n "${AUDIT_RESULTS[$task]}" ]]; then
			audit_info=" [${AUDIT_RESULTS[$task]}]"
		fi

		case "$status" in
		completed)
			echo -e "  ${GREEN}✓${NC} $task: ${TASK_DESC[$task]}$audit_info"
			((completed++))
			;;
		failed)
			echo -e "  ${RED}✗${NC} $task: ${TASK_DESC[$task]}$audit_info"
			((failed++))
			;;
		partial)
			echo -e "  ${YELLOW}◐${NC} $task: ${TASK_DESC[$task]}$audit_info"
			((partial++))
			;;
		needs_audit)
			echo -e "  ${CYAN}?${NC} $task: ${TASK_DESC[$task]} (needs audit)"
			((needs_audit++))
			;;
		running)
			echo -e "  ${YELLOW}►${NC} $task: ${TASK_DESC[$task]}"
			;;
		*)
			echo -e "  ${DIM}·${NC} $task: ${TASK_DESC[$task]}"
			((pending++))
			;;
		esac
	done

	echo ""
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	echo -e "${GREEN}Completed:${NC} $completed  ${YELLOW}Partial:${NC} $partial  ${RED}Failed:${NC} $failed  ${CYAN}Needs Audit:${NC} $needs_audit  ${DIM}Pending:${NC} $pending"

	if [[ $needs_audit -gt 0 ]]; then
		echo ""
		echo -e "${CYAN}Tip:${NC} Run './dhool-implement.sh --audit' to verify completed tasks"
	fi

	if [[ $failed -gt 0 || $partial -gt 0 ]]; then
		echo ""
		echo -e "${YELLOW}Tip:${NC} Run './dhool-implement.sh --resume' to fix and continue"
	fi
}

# =============================================================================
# Task Execution
# =============================================================================

execute_task() {
	local task_id="$1"
	local task_func="task_${task_id//./_}"

	log_header "Executing $task_id: ${TASK_DESC[$task_id]}"
	set_task_status "$task_id" "running"

	if type "$task_func" &>/dev/null; then
		if $task_func; then
			# Verify files were created
			if audit_task "$task_id"; then
				set_task_status "$task_id" "completed"
				log_success "Task $task_id completed"
				return 0
			else
				set_task_status "$task_id" "partial"
				log_warn "Task $task_id partially completed: ${AUDIT_RESULTS[$task_id]}"
				return 1
			fi
		fi
	else
		log_error "Task function $task_func not implemented"
	fi

	set_task_status "$task_id" "failed"
	return 1
}

fix_task() {
	local task_id="$1"
	log_header "Fixing Task $task_id: ${TASK_DESC[$task_id]}"

	# Reset status and re-run
	set_task_status "$task_id" "pending"
	execute_task "$task_id"
}

run_all() {
	for task in "${TASK_ORDER[@]}"; do
		local status="${TASK_STATUS[$task]:-pending}"

		if [[ "$status" == "completed" ]]; then
			log_info "Skipping completed: $task"
			continue
		fi

		if ! execute_task "$task"; then
			log_error "Stopped at: $task"
			echo ""
			echo "To retry this task:"
			echo "  ./dhool-implement.sh --fix-task $task"
			echo ""
			echo "To skip and continue:"
			echo "  ./dhool-implement.sh --from ${TASK_ORDER[$(($(printf '%s\n' "${TASK_ORDER[@]}" | grep -n "^$task$" | cut -d: -f1)))]}"
			return 1
		fi

		sleep 1
	done

	log_header "ALL TASKS COMPLETED"
	show_status
}

resume() {
	log_header "Resuming Implementation"

	local resume_from=""
	for task in "${TASK_ORDER[@]}"; do
		local status="${TASK_STATUS[$task]}"
		if [[ "$status" == "failed" || "$status" == "partial" || "$status" == "running" || "$status" == "pending" || "$status" == "needs_audit" ]]; then
			resume_from="$task"
			break
		fi
	done

	if [[ -z "$resume_from" ]]; then
		log_success "All tasks completed!"
		return 0
	fi

	log_info "Resuming from: $resume_from"

	local started=false
	for task in "${TASK_ORDER[@]}"; do
		[[ "$task" == "$resume_from" ]] && started=true

		if $started; then
			local status="${TASK_STATUS[$task]}"
			if [[ "$status" != "completed" ]]; then
				execute_task "$task" || return 1
			fi
		fi
	done
}

run_phase() {
	local phase_num="$1"

	log_header "Running Phase $phase_num"

	for task in "${TASK_ORDER[@]}"; do
		if [[ "$task" == T${phase_num}.* ]]; then
			local status="${TASK_STATUS[$task]}"
			if [[ "$status" != "completed" ]]; then
				execute_task "$task" || return 1
			fi
		fi
	done

	log_success "Phase $phase_num complete"
}

# =============================================================================
# Dev Server
# =============================================================================

start_dev() {
	log_info "Starting dev server..."

	if [[ -n "$DEV_SERVER_PID" ]] && kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
		log_info "Dev server already running (PID: $DEV_SERVER_PID)"
		return 0
	fi

	pnpm dev --port "$DEV_PORT" &
	DEV_SERVER_PID=$!
	save_state

	sleep 3

	if kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
		log_success "Dev server: http://localhost:$DEV_PORT"
	else
		log_error "Failed to start dev server"
		return 1
	fi
}

stop_dev() {
	if [[ -n "$DEV_SERVER_PID" ]] && kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
		kill "$DEV_SERVER_PID" 2>/dev/null
		DEV_SERVER_PID=""
		save_state
	fi
}

# =============================================================================
# Task Implementations (Phase 0-3 shown, others similar pattern)
# =============================================================================

task_T0_1() {
	log_info "Checking for contradictions..."
	# Check for legacy PrimeVue patterns
	local issues=$(grep -rln "p-button-\|responsiveLayout=\|from 'primevue/api'" "$SRC_DIR" 2>/dev/null || true)
	if [[ -n "$issues" ]]; then
		log_warn "Legacy patterns found in: $issues"
	fi
	return 0
}

task_T0_2() {
	log_info "Verifying PrimeVue 4..."
	[[ -f "package.json" ]] || {
		log_error "package.json not found"
		return 1
	}
	grep -q '"primevue"' package.json || pnpm install primevue @primevue/themes @primevue/core
	return 0
}

task_T0_3() {
	log_info "Creating directories..."
	mkdir -p "$COMPONENTS_DIR"/{atoms,molecules,organisms,templates,renderers,extended}
	mkdir -p "$VIEWS_DIR"/{demo,showcase,customers,invoices,dashboard}
	mkdir -p "$STORES_DIR" "$SERVICES_DIR" "$COMPOSABLES_DIR" "$TYPES_DIR" "$SCHEMAS_DIR" "$UTILS_DIR"
	mkdir -p "$ROUTER_DIR/guards"
	return 0
}

task_T1_1() {
	log_info "Creating TypeScript types..."
	claude --dangerously-skip-permissions "Create TypeScript types for Dhool ERP.

Create these files in $TYPES_DIR:

1. schema.ts - FieldType, FieldSchema, ColumnSchema, ActionSchema, DocumentSchema, DashboardSchema
2. access.ts - SubscriptionPlan, Permission, DataScope, ABACCondition, AccessContext
3. api.ts - ApiResponse<T>, PaginatedResponse<T>, ApiError
4. index.ts - Re-export all

Use proper TypeScript with JSDoc comments. Follow PrimeVue 4 naming conventions."
}

task_T1_2() {
	log_info "Setting up PrimeVue 4..."
	claude --dangerously-skip-permissions "Setup PrimeVue 4 in $SRC_DIR/main.ts.

Use:
- Aura theme from '@primevue/themes/aura'
- definePreset to create DhoolPreset
- ToastService, ConfirmationService, DialogService
- Pinia, Vue Router
- Dark mode selector: '.dark'

This is PrimeVue 4, not 3. Use modern patterns."
}

task_T1_3() {
	log_info "Configuring Tailwind..."
	claude --dangerously-skip-permissions "Create/update $PROJECT_ROOT/tailwind.config.ts.

Map Tailwind colors to PrimeVue CSS variables:
- primary → var(--p-primary-color)
- surface.ground → var(--p-surface-ground)
etc.

Also ensure $SRC_DIR/assets/main.css imports tailwind layers."
}

task_T1_4() {
	log_info "Setting up auto-imports..."
	claude --dangerously-skip-permissions "Update $PROJECT_ROOT/vite.config.ts for auto-imports.

Use:
- unplugin-vue-components with PrimeVueResolver
- unplugin-auto-import for vue, vue-router, pinia
- Auto-import composables from ./src/composables"
}

task_T1_5() {
	log_info "Creating API service..."
	claude --dangerously-skip-permissions "Create $SERVICES_DIR/api.ts.

Features:
- Axios instance
- Auth token interceptor
- Tenant ID header
- Token refresh on 401
- Typed CRUD methods
- Error handling"
}

task_T1_6() {
	log_info "Creating showcase page..."
	claude --dangerously-skip-permissions "Create $VIEWS_DIR/showcase/index.vue.

Show PrimeVue 4 components:
- Buttons with severity props (not classes)
- DataTable with scrollable (not responsiveLayout)
- Select (not Dropdown)
- Form inputs
- Dialogs, Toast

Add route /showcase to router."
}

task_T2_1() {
	log_info "Creating AccessService..."
	claude --dangerously-skip-permissions "Create $SERVICES_DIR/access.ts.

Three-layer access control:
1. Subscription check
2. Role permissions with DataScope
3. ABAC field-level policies

Methods: checkSubscription, checkPermission, evaluateABAC, filterFields, filterActions"
}

task_T2_2() {
	log_info "Creating SchemaService..."
	claude --dangerously-skip-permissions "Create $SERVICES_DIR/schema.ts.

Features:
- loadSchema(docType) with caching
- validateSchema
- generateDefaults
- getFieldDependencies"
}

task_T2_3() {
	log_info "Creating access store..."
	claude --dangerously-skip-permissions "Create $STORES_DIR/access.ts.

Pinia store with:
- subscription, roles, policies state
- loadAccessData action
- hasPermission, canAccessModule helpers"
}

task_T2_4() {
	log_info "Creating useAccess..."
	claude --dangerously-skip-permissions "Create $COMPOSABLES_DIR/useAccess.ts.

Composable returning:
- canCreate, canRead, canUpdate, canDelete
- canAccessField
- hasModule
- subscription ref"
}

task_T2_5() {
	log_info "Creating useSchema..."
	claude --dangerously-skip-permissions "Create $COMPOSABLES_DIR/useSchema.ts.

Composable for loading document schemas:
- schema, loading, error refs
- fields, columns, actions computed
- reload method"
}

task_T2_6() {
	log_info "Creating useCrud..."
	claude --dangerously-skip-permissions "Create $COMPOSABLES_DIR/useCrud.ts.

Generic CRUD composable:
- items, loading, selectedItem
- fetchList, fetchOne
- create, update, remove
- bulkDelete"
}

task_T2_7() {
	log_info "Creating access demo..."
	claude --dangerously-skip-permissions "Create $VIEWS_DIR/demo/access.vue.

Demo page showing:
- Current subscription info
- Module access
- Permission matrix
- Field-level access demo

Add route /demo/access"
}

task_T3_1() {
	log_info "Creating customer.json..."
	claude --dangerously-skip-permissions "Create $SCHEMAS_DIR/customer.json.

Complete customer schema with:
- name, label, labelPlural, icon, module
- api config with endpoints
- listView with columns, filters, actions
- formView with sections and fields
- access control
- Field types: text, email, phone, select, link"
}

task_T3_2() {
	log_info "Creating invoice.json..."
	claude --dangerously-skip-permissions "Create $SCHEMAS_DIR/invoice.json.

Invoice schema with:
- Workflow: draft → submitted → approved → paid
- Line items as child table
- Calculated fields: subtotal, tax, total
- Status transitions
- Actions: Submit, Approve, Mark Paid"
}

task_T3_3() {
	log_info "Creating product.json..."
	claude --dangerously-skip-permissions "Create $SCHEMAS_DIR/product.json.

Product schema with:
- name, sku, description, category
- Pricing: price, cost, margin
- Inventory: stock_qty, reorder_level
- Status: active, discontinued"
}

task_T3_4() {
	log_info "Creating dashboard.json..."
	claude --dangerously-skip-permissions "Create $SCHEMAS_DIR/dashboard.json.

Dashboard schema with widgets:
- stat: KPI cards
- chart: Line, bar, pie
- table: Mini data tables
- list: Recent items
- Grid layout config"
}

task_T3_5() {
	log_info "Creating schema validator..."
	claude --dangerously-skip-permissions "Create $UTILS_DIR/schemaValidator.ts.

Validate JSON schemas:
- Structure validation
- Required fields
- Field type validation
- Action definitions"
}

task_T3_6() {
	log_info "Creating schema viewer..."
	claude --dangerously-skip-permissions "Create $VIEWS_DIR/demo/schemas.vue.

Schema browser demo:
- List available schemas
- View JSON with syntax highlighting
- Preview generated form/list
- Add route /demo/schemas"
}

# Additional task implementations follow same pattern...
# For brevity, showing placeholder for remaining phases

task_T4_1() { claude --dangerously-skip-permissions "Create $MOLECULES_DIR/FormField.vue - Form field wrapper with label, error, description"; }
task_T4_2() { claude --dangerously-skip-permissions "Create $MOLECULES_DIR/StatCard.vue - KPI stat card with title, value, trend, icon"; }
task_T4_3() { claude --dangerously-skip-permissions "Create $MOLECULES_DIR/ActionMenu.vue - Action buttons/menu from ActionSchema[]"; }
task_T4_4() { claude --dangerously-skip-permissions "Create $MOLECULES_DIR/EmptyState.vue - Empty state with icon, title, description, action"; }
task_T4_5() { claude --dangerously-skip-permissions "Create $VIEWS_DIR/showcase/molecules.vue - Showcase all molecules, route /showcase/molecules"; }

task_T5_1() { claude --dangerously-skip-permissions "Create $ORGANISMS_DIR/DataTableCrud.vue - Schema-driven DataTable with CRUD. Use PrimeVue 4: scrollable scrollHeight='flex'"; }
task_T5_2() { claude --dangerously-skip-permissions "Create $ORGANISMS_DIR/FormBuilder.vue - Schema-driven form generator using FieldRenderer"; }
task_T5_3() { claude --dangerously-skip-permissions "Create $ORGANISMS_DIR/FormDrawer.vue - Slide-out drawer with FormBuilder"; }
task_T5_4() { claude --dangerously-skip-permissions "Create $VIEWS_DIR/showcase/organisms.vue - Showcase organisms, route /showcase/organisms"; }

task_T6_1() { claude --dangerously-skip-permissions "Create $RENDERERS_DIR/FieldRenderer.vue - Render PrimeVue 4 components by field.type"; }
task_T6_2() { claude --dangerously-skip-permissions "Create $RENDERERS_DIR/DocumentPage.vue - Main schema-driven CRUD page component"; }
task_T6_3() { claude --dangerously-skip-permissions "Create $RENDERERS_DIR/DashboardPage.vue - Schema-driven dashboard with widgets"; }
task_T6_4() { claude --dangerously-skip-permissions "Create $VIEWS_DIR/demo/renderer.vue - Live schema editor with preview, route /demo/renderer"; }

task_T7_1() { claude --dangerously-skip-permissions "Create $EXTENDED_DIR/LinkField.vue - Document link field with search"; }
task_T7_2() { claude --dangerously-skip-permissions "Create $EXTENDED_DIR/AppDataTable.vue - Extended DataTable with extras"; }
task_T7_3() { claude --dangerously-skip-permissions "Create $EXTENDED_DIR/CurrencyInput.vue - Currency input with formatting"; }
task_T7_4() { claude --dangerously-skip-permissions "Create $VIEWS_DIR/showcase/extended.vue - Extended components showcase"; }

task_T8_1() { claude --dangerously-skip-permissions "Create $TEMPLATES_DIR/MainLayout.vue - Main app layout with sidebar, topbar"; }
task_T8_2() { claude --dangerously-skip-permissions "Create $TEMPLATES_DIR/AuthLayout.vue - Auth pages layout"; }
task_T8_3() { claude --dangerously-skip-permissions "Create $TEMPLATES_DIR/AppSidebar.vue - Navigation sidebar"; }
task_T8_4() { claude --dangerously-skip-permissions "Create $TEMPLATES_DIR/AppTopbar.vue - Top bar with search, user menu"; }

task_T9_1() { claude --dangerously-skip-permissions "Create $STORES_DIR/auth.ts - Auth Pinia store"; }
task_T9_2() { claude --dangerously-skip-permissions "Create $STORES_DIR/tenant.ts - Tenant Pinia store"; }
task_T9_3() { claude --dangerously-skip-permissions "Create $STORES_DIR/ui.ts - UI state Pinia store"; }
task_T9_4() { claude --dangerously-skip-permissions "Create $STORES_DIR/schema.ts - Schema cache Pinia store"; }

task_T10_1() { claude --dangerously-skip-permissions "Create $ROUTER_DIR/index.ts - Vue Router setup with routes"; }
task_T10_2() { claude --dangerously-skip-permissions "Create $ROUTER_DIR/dynamicRoutes.ts - Generate routes from schemas"; }
task_T10_3() { claude --dangerously-skip-permissions "Create $ROUTER_DIR/guards/auth.ts - Auth guard"; }
task_T10_4() { claude --dangerously-skip-permissions "Create $ROUTER_DIR/guards/access.ts - Access control guard"; }

task_T11_1() { claude --dangerously-skip-permissions "Update $SRC_DIR/App.vue - App shell with router-view, toast, confirm"; }
task_T11_2() { claude --dangerously-skip-permissions "Create $VIEWS_DIR/customers/index.vue - <DocumentPage docType='customer' />"; }
task_T11_3() { claude --dangerously-skip-permissions "Create $VIEWS_DIR/invoices/index.vue - <DocumentPage docType='invoice' />"; }
task_T11_4() { claude --dangerously-skip-permissions "Create $VIEWS_DIR/dashboard/index.vue - <DashboardPage schemaName='dashboard' />"; }
task_T11_5() { claude --dangerously-skip-permissions "Create $VIEWS_DIR/demo/index.vue - Demo index with links"; }

task_T12_1() {
	log_info "Type checking..."
	pnpm dlx vue-tsc --noEmit 2>&1 || true
	return 0
}
task_T12_2() {
	log_info "Checking PrimeVue 4 patterns..."
	local bad=$(grep -rln "p-button-\|responsiveLayout=" "$SRC_DIR" 2>/dev/null || true)
	[[ -n "$bad" ]] && log_warn "Legacy patterns: $bad"
	return 0
}
task_T12_3() {
	log_info "Validating schemas..."
	for f in "$SCHEMAS_DIR"/*.json; do
		[[ -f "$f" ]] && jq empty "$f" 2>/dev/null || log_error "Invalid: $f"
	done
	return 0
}
task_T12_4() {
	generate_audit_report
	log_success "Implementation complete!"
	return 0
}

# =============================================================================
# Help
# =============================================================================

show_help() {
	cat <<'EOF'
Dhool ERP Implementation v2.0

Usage: ./dhool-implement.sh [OPTION]

Options:
  --status          Show task status with audit info
  --audit           Verify all completed tasks have files
  --audit-task ID   Audit specific task
  --fix-task ID     Re-run failed/partial task
  --resume          Continue from first incomplete task
  --phase N         Run specific phase (0-12)
  --from ID         Run from specific task
  --dev             Start dev server
  --reset           Reset all state
  --help            Show this help

Current Status:
  T0.1-T3.1: Completed (need audit)
  T3.2: Failed (invoice.json)
  T3.3+: Pending

Quick Start:
  ./dhool-implement.sh --audit      # Verify what was created
  ./dhool-implement.sh --resume     # Fix T3.2 and continue
EOF
}

# =============================================================================
# Main
# =============================================================================

main() {
	register_all_tasks
	init_state

	case "${1:-}" in
	--help | -h) show_help ;;
	--status) show_status ;;
	--audit) audit_all ;;
	--audit-task)
		[[ -z "$2" ]] && {
			log_error "Task ID required"
			exit 1
		}
		audit_task "$2"
		echo "${AUDIT_RESULTS[$2]}"
		;;
	--fix-task)
		[[ -z "$2" ]] && {
			log_error "Task ID required"
			exit 1
		}
		fix_task "$2"
		;;
	--resume) resume ;;
	--phase)
		[[ -z "$2" ]] && {
			log_error "Phase number required"
			exit 1
		}
		run_phase "$2"
		;;
	--from)
		[[ -z "$2" ]] && {
			log_error "Task ID required"
			exit 1
		}
		local started=false
		for task in "${TASK_ORDER[@]}"; do
			[[ "$task" == "$2" ]] && started=true
			$started && execute_task "$task"
		done
		;;
	--dev) start_dev ;;
	--reset)
		rm -f "$STATE_FILE" "$LOG_FILE"
		log_info "State reset"
		;;
	--auto)
		start_dev
		run_all
		;;
	"")
		show_status
		echo ""
		echo "Run with --help for options"
		;;
	*)
		log_error "Unknown: $1"
		show_help
		exit 1
		;;
	esac
}

trap 'stop_dev' EXIT
main "$@"
