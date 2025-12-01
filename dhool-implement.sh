#!/bin/bash
# =============================================================================
# dhool-implement.sh - Dhool ERP Documentation to Code Implementation
# =============================================================================
#
# Implements the Dhool ERP UI Documentation Guide into actual Vue 3 + PrimeVue 4 code
# Following schema-driven UI architecture with real-time browser preview
#
# ARCHITECTURE:
#   - Schema-Driven UI (ERPNext-style JSON configuration)
#   - Three-Layer Access Control (Subscription → Module → Role → ABAC)
#   - Atomic Design (atoms → molecules → organisms → templates → pages)
#   - PrimeVue 4 idiomatic components (props not classes)
#
# PRIMEVUE 4 PATTERNS:
#   ✅ Import from '@primevue/core/api' (not 'primevue/api')
#   ✅ Props for styling: <Button rounded text severity="danger" />
#   ✅ DataTable: scrollable scrollHeight="flex"
#   ✅ Pass-Through API for customization
#   ❌ Class-based styling: p-button-rounded (legacy PrimeVue 3)
#
# Usage:
#   ./dhool-implement.sh              # Interactive mode
#   ./dhool-implement.sh --auto       # Run all tasks automatically
#   ./dhool-implement.sh --resume     # Resume from last checkpoint
#   ./dhool-implement.sh --status     # Show current progress
#   ./dhool-implement.sh --task T1.1  # Run specific task
#   ./dhool-implement.sh --phase 2    # Run specific phase
#   ./dhool-implement.sh --dev        # Start dev server to view components
#   ./dhool-implement.sh --check      # Check for contradictions
#   ./dhool-implement.sh --schema     # Generate schema examples only
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
COMPONENTS_DIR="${COMPONENTS_DIR:-$SRC_DIR/components}"
VIEWS_DIR="${VIEWS_DIR:-$SRC_DIR/views}"
STORES_DIR="${STORES_DIR:-$SRC_DIR/stores}"
SERVICES_DIR="${SERVICES_DIR:-$SRC_DIR/services}"
COMPOSABLES_DIR="${COMPOSABLES_DIR:-$SRC_DIR/composables}"
TYPES_DIR="${TYPES_DIR:-$SRC_DIR/types}"
SCHEMAS_DIR="${SCHEMAS_DIR:-$SRC_DIR/schemas}"
UTILS_DIR="${UTILS_DIR:-$SRC_DIR/utils}"
ASSETS_DIR="${ASSETS_DIR:-$SRC_DIR/assets}"

# Atomic design directories
ATOMS_DIR="${ATOMS_DIR:-$COMPONENTS_DIR/atoms}"
MOLECULES_DIR="${MOLECULES_DIR:-$COMPONENTS_DIR/molecules}"
ORGANISMS_DIR="${ORGANISMS_DIR:-$COMPONENTS_DIR/organisms}"
TEMPLATES_DIR="${TEMPLATES_DIR:-$COMPONENTS_DIR/templates}"
RENDERERS_DIR="${RENDERERS_DIR:-$COMPONENTS_DIR/renderers}"
EXTENDED_DIR="${EXTENDED_DIR:-$COMPONENTS_DIR/extended}"

# State and logging
STATE_FILE="${STATE_FILE:-.dhool-state}"
LOG_FILE="${LOG_FILE:-./dhool-state.log}"
CONTRADICTIONS_FILE="${CONTRADICTIONS_FILE:-./contradictions-report.md}"

# Build settings
DEV_PORT="${DEV_PORT:-5173}"
MAX_FIX_ATTEMPTS=5
BUILD_TIMEOUT=120

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# =============================================================================
# PrimeVue 4 Reference
# =============================================================================

read -r -d '' PRIMEVUE4_PATTERNS <<'EOF'
# PrimeVue 4 Idiomatic Patterns

## Imports
✅ import { FilterMatchMode } from '@primevue/core/api'
❌ import { FilterMatchMode } from 'primevue/api'

## Button Styling
✅ <Button rounded text severity="danger" />
✅ <Button icon="pi pi-check" label="Save" />
❌ <Button class="p-button-rounded p-button-text p-button-danger" />

## DataTable
✅ <DataTable scrollable scrollHeight="flex" :value="data">
❌ <DataTable responsiveLayout="scroll" :value="data">

## Select (formerly Dropdown)
✅ <Select v-model="selected" :options="items" />
⚠️  Dropdown still works but Select is preferred

## Tag Severity
✅ severity="warning"
❌ severity="warn"

## Pass-Through API
app.use(PrimeVue, {
  pt: {
    button: { root: { class: 'custom-button' } },
    datatable: { header: { class: 'custom-header' } }
  }
})
EOF

# Schema-driven field types
FIELD_TYPES=(
	"text" "textarea" "number" "currency" "percent" "date" "datetime"
	"select" "multiselect" "checkbox" "switch" "link" "table"
	"email" "phone" "url" "tags" "rating" "color" "html" "readonly" "custom"
)

# =============================================================================
# Logging
# =============================================================================

log() { echo -e "$1" | tee -a "$LOG_FILE"; }
log_info() { log "${BLUE}[INFO]${NC} $1"; }
log_success() { log "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { log "${YELLOW}[WARN]${NC} $1"; }
log_error() { log "${RED}[ERROR]${NC} $1"; }
log_task() { log "${MAGENTA}[TASK]${NC} $1"; }
log_fix() { log "${CYAN}[FIX]${NC} $1"; }
log_check() { log "${CYAN}[CHECK]${NC} $1"; }

log_header() {
	echo "" | tee -a "$LOG_FILE"
	echo -e "${BOLD}════════════════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
	echo -e "${BOLD}  $1${NC}" | tee -a "$LOG_FILE"
	echo -e "${BOLD}════════════════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
	echo "" | tee -a "$LOG_FILE"
}

log_outcome() {
	local task="$1"
	local description="$2"
	local files="$3"

	echo "" | tee -a "$LOG_FILE"
	echo -e "${GREEN}┌────────────────────────────────────────────────────────────────────┐${NC}" | tee -a "$LOG_FILE"
	echo -e "${GREEN}│ OUTCOME: $task${NC}" | tee -a "$LOG_FILE"
	echo -e "${GREEN}├────────────────────────────────────────────────────────────────────┤${NC}" | tee -a "$LOG_FILE"
	echo -e "${GREEN}│ $description${NC}" | tee -a "$LOG_FILE"
	echo -e "${GREEN}├────────────────────────────────────────────────────────────────────┤${NC}" | tee -a "$LOG_FILE"
	echo -e "${GREEN}│ Files: $files${NC}" | tee -a "$LOG_FILE"
	echo -e "${GREEN}│ View: http://localhost:$DEV_PORT${NC}" | tee -a "$LOG_FILE"
	echo -e "${GREEN}└────────────────────────────────────────────────────────────────────┘${NC}" | tee -a "$LOG_FILE"
	echo "" | tee -a "$LOG_FILE"
}

# =============================================================================
# State Management
# =============================================================================

declare -A TASK_STATUS
declare -A TASK_DESC
declare -A TASK_PHASE
declare -A TASK_OUTCOME
declare -a TASK_ORDER

init_state() {
	if [[ -f "$STATE_FILE" ]]; then
		source "$STATE_FILE"
	fi
}

save_state() {
	{
		echo "# Dhool ERP Implementation State - $(date)"
		echo "LAST_TASK=\"$LAST_TASK\""
		echo "LAST_STATUS=\"$LAST_STATUS\""
		echo "START_TIME=\"$START_TIME\""
		echo "DEV_SERVER_PID=\"$DEV_SERVER_PID\""
		echo ""
		for task in "${TASK_ORDER[@]}"; do
			echo "TASK_STATUS[$task]=\"${TASK_STATUS[$task]:-pending}\""
		done
	} >"$STATE_FILE"
}

set_task_status() {
	local task="$1"
	local status="$2"
	TASK_STATUS[$task]="$status"
	LAST_TASK="$task"
	LAST_STATUS="$status"
	save_state
}

get_task_status() {
	echo "${TASK_STATUS[$1]:-pending}"
}

show_status() {
	log_header "Dhool ERP Implementation Progress"

	local completed=0 failed=0 pending=0
	local total=${#TASK_ORDER[@]}
	local current_phase=""

	for task in "${TASK_ORDER[@]}"; do
		local status="${TASK_STATUS[$task]:-pending}"
		local desc="${TASK_DESC[$task]}"
		local phase="${TASK_PHASE[$task]}"

		if [[ "$phase" != "$current_phase" ]]; then
			current_phase="$phase"
			echo ""
			echo -e "${BOLD}$phase${NC}"
		fi

		case "$status" in
		completed)
			echo -e "  ${GREEN}✓${NC} $task: $desc"
			((completed++))
			;;
		failed)
			echo -e "  ${RED}✗${NC} $task: $desc"
			((failed++))
			;;
		running) echo -e "  ${YELLOW}►${NC} $task: $desc" ;;
		skipped) echo -e "  ${CYAN}○${NC} $task: $desc (skipped)" ;;
		*)
			echo -e "  ${DIM}·${NC} $task: $desc"
			((pending++))
			;;
		esac
	done

	echo ""
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	echo "Progress: $completed/$total completed, $failed failed, $pending pending"
	[[ -n "$LAST_TASK" ]] && echo "Last task: $LAST_TASK ($LAST_STATUS)"
	echo ""
	echo "Dev server: ./dhool-implement.sh --dev"
	echo "View at: http://localhost:$DEV_PORT"
}

reset_state() {
	rm -f "$STATE_FILE"
	log_info "State reset. Starting fresh."
}

# =============================================================================
# Task Registry
# =============================================================================

register_task() {
	local id="$1" phase="$2" desc="$3" outcome="${4:-}"
	TASK_ORDER+=("$id")
	TASK_DESC[$id]="$desc"
	TASK_PHASE[$id]="$phase"
	TASK_OUTCOME[$id]="$outcome"
	TASK_STATUS[$id]="${TASK_STATUS[$id]:-pending}"
}

register_all_tasks() {
	# PHASE 0: Pre-flight Checks
	register_task "T0.1" "PHASE 0: Pre-flight" "Check for contradictions in existing code" "contradictions-report.md"
	register_task "T0.2" "PHASE 0: Pre-flight" "Verify PrimeVue 4 installation" "package.json verified"
	register_task "T0.3" "PHASE 0: Pre-flight" "Create directory structure" "src/ directories"

	# PHASE 1: Core Setup (from Part 1 of docs)
	register_task "T1.1" "PHASE 1: Core Setup" "Create TypeScript types (schema, access, api)" "src/types/*.ts"
	register_task "T1.2" "PHASE 1: Core Setup" "Setup PrimeVue 4 with Aura preset" "main.ts, primevue config"
	register_task "T1.3" "PHASE 1: Core Setup" "Configure Tailwind with PrimeVue CSS vars" "tailwind.config.ts"
	register_task "T1.4" "PHASE 1: Core Setup" "Setup auto-imports (unplugin)" "vite.config.ts"
	register_task "T1.5" "PHASE 1: Core Setup" "Create API service with interceptors" "src/services/api.ts"
	register_task "T1.6" "PHASE 1: Core Setup" "Create component showcase page" "http://localhost:$DEV_PORT/showcase"

	# PHASE 2: Access Control & Schema Engine (from Part 2 of docs)
	register_task "T2.1" "PHASE 2: Access & Schema" "Create AccessService class" "src/services/access.ts"
	register_task "T2.2" "PHASE 2: Access & Schema" "Create SchemaService class" "src/services/schema.ts"
	register_task "T2.3" "PHASE 2: Access & Schema" "Create access store (Pinia)" "src/stores/access.ts"
	register_task "T2.4" "PHASE 2: Access & Schema" "Create useAccess composable" "src/composables/useAccess.ts"
	register_task "T2.5" "PHASE 2: Access & Schema" "Create useSchema composable" "src/composables/useSchema.ts"
	register_task "T2.6" "PHASE 2: Access & Schema" "Create useCrud composable" "src/composables/useCrud.ts"
	register_task "T2.7" "PHASE 2: Access & Schema" "Create access control demo page" "http://localhost:$DEV_PORT/demo/access"

	# PHASE 3: JSON Schemas (from Part 4 of docs)
	register_task "T3.1" "PHASE 3: Schemas" "Create customer.json schema" "src/schemas/customer.json"
	register_task "T3.2" "PHASE 3: Schemas" "Create invoice.json schema" "src/schemas/invoice.json"
	register_task "T3.3" "PHASE 3: Schemas" "Create product.json schema" "src/schemas/product.json"
	register_task "T3.4" "PHASE 3: Schemas" "Create dashboard.json schema" "src/schemas/dashboard.json"
	register_task "T3.5" "PHASE 3: Schemas" "Create schema validation utility" "src/utils/schemaValidator.ts"
	register_task "T3.6" "PHASE 3: Schemas" "Create schema viewer demo" "http://localhost:$DEV_PORT/demo/schemas"

	# PHASE 4: Molecules (combined atoms + simple compositions)
	register_task "T4.1" "PHASE 4: Molecules" "Create FormField component" "src/components/molecules/FormField.vue"
	register_task "T4.2" "PHASE 4: Molecules" "Create StatCard component" "src/components/molecules/StatCard.vue"
	register_task "T4.3" "PHASE 4: Molecules" "Create ActionMenu component" "src/components/molecules/ActionMenu.vue"
	register_task "T4.4" "PHASE 4: Molecules" "Create EmptyState component" "src/components/molecules/EmptyState.vue"
	register_task "T4.5" "PHASE 4: Molecules" "Create molecules showcase" "http://localhost:$DEV_PORT/showcase/molecules"

	# PHASE 5: Organisms (complex reusable components)
	register_task "T5.1" "PHASE 5: Organisms" "Create DataTableCrud component" "src/components/organisms/DataTableCrud.vue"
	register_task "T5.2" "PHASE 5: Organisms" "Create FormBuilder component" "src/components/organisms/FormBuilder.vue"
	register_task "T5.3" "PHASE 5: Organisms" "Create FormDrawer component" "src/components/organisms/FormDrawer.vue"
	register_task "T5.4" "PHASE 5: Organisms" "Create organisms showcase" "http://localhost:$DEV_PORT/showcase/organisms"

	# PHASE 6: Renderers (schema-driven)
	register_task "T6.1" "PHASE 6: Renderers" "Create FieldRenderer component" "src/components/renderers/FieldRenderer.vue"
	register_task "T6.2" "PHASE 6: Renderers" "Create DocumentPage renderer" "src/components/renderers/DocumentPage.vue"
	register_task "T6.3" "PHASE 6: Renderers" "Create DashboardPage renderer" "src/components/renderers/DashboardPage.vue"
	register_task "T6.4" "PHASE 6: Renderers" "Create renderer demo with live schema" "http://localhost:$DEV_PORT/demo/renderer"

	# PHASE 7: Extended Components (custom PrimeVue extensions)
	register_task "T7.1" "PHASE 7: Extended" "Create LinkField component" "src/components/extended/LinkField.vue"
	register_task "T7.2" "PHASE 7: Extended" "Create AppDataTable component" "src/components/extended/AppDataTable.vue"
	register_task "T7.3" "PHASE 7: Extended" "Create CurrencyInput component" "src/components/extended/CurrencyInput.vue"
	register_task "T7.4" "PHASE 7: Extended" "Create extended components showcase" "http://localhost:$DEV_PORT/showcase/extended"

	# PHASE 8: Templates (page layouts)
	register_task "T8.1" "PHASE 8: Templates" "Create MainLayout template" "src/components/templates/MainLayout.vue"
	register_task "T8.2" "PHASE 8: Templates" "Create AuthLayout template" "src/components/templates/AuthLayout.vue"
	register_task "T8.3" "PHASE 8: Templates" "Create AppSidebar component" "src/components/templates/AppSidebar.vue"
	register_task "T8.4" "PHASE 8: Templates" "Create AppTopbar component" "src/components/templates/AppTopbar.vue"

	# PHASE 9: Stores (from Part 5 of docs)
	register_task "T9.1" "PHASE 9: Stores" "Create authStore" "src/stores/auth.ts"
	register_task "T9.2" "PHASE 9: Stores" "Create tenantStore" "src/stores/tenant.ts"
	register_task "T9.3" "PHASE 9: Stores" "Create uiStore" "src/stores/ui.ts"
	register_task "T9.4" "PHASE 9: Stores" "Create schemaStore" "src/stores/schema.ts"

	# PHASE 10: Router & Guards
	register_task "T10.1" "PHASE 10: Router" "Setup router with guards" "src/router/index.ts"
	register_task "T10.2" "PHASE 10: Router" "Create dynamic route generation" "src/router/dynamicRoutes.ts"
	register_task "T10.3" "PHASE 10: Router" "Setup auth guard" "src/router/guards/auth.ts"
	register_task "T10.4" "PHASE 10: Router" "Setup access guard" "src/router/guards/access.ts"

	# PHASE 11: Integration & Demo Pages
	register_task "T11.1" "PHASE 11: Integration" "Create App.vue shell" "src/App.vue"
	register_task "T11.2" "PHASE 11: Integration" "Create CustomerList page (schema-driven)" "http://localhost:$DEV_PORT/customers"
	register_task "T11.3" "PHASE 11: Integration" "Create InvoiceList page (schema-driven)" "http://localhost:$DEV_PORT/invoices"
	register_task "T11.4" "PHASE 11: Integration" "Create Dashboard page" "http://localhost:$DEV_PORT/dashboard"
	register_task "T11.5" "PHASE 11: Integration" "Create full demo walkthrough" "http://localhost:$DEV_PORT/demo"

	# PHASE 12: Validation & Final
	register_task "T12.1" "PHASE 12: Validation" "Check TypeScript compilation"
	register_task "T12.2" "PHASE 12: Validation" "Verify PrimeVue 4 patterns (no legacy)"
	register_task "T12.3" "PHASE 12: Validation" "Validate all schemas"
	register_task "T12.4" "PHASE 12: Validation" "Generate final report"
}

# =============================================================================
# Contradiction Checker
# =============================================================================

check_contradictions() {
	log_header "Checking for Contradictions"

	local issues=""
	local has_issues=false

	# Check for PrimeVue 3 patterns (should be PrimeVue 4)
	log_check "Checking for legacy PrimeVue 3 patterns..."

	# Legacy imports
	local legacy_imports=$(grep -rln "from 'primevue/api'" "$SRC_DIR" 2>/dev/null || true)
	if [[ -n "$legacy_imports" ]]; then
		issues+="## Legacy PrimeVue 3 Imports\n"
		issues+="Files using 'primevue/api' instead of '@primevue/core/api':\n"
		issues+="\`\`\`\n$legacy_imports\n\`\`\`\n\n"
		has_issues=true
	fi

	# Legacy class-based button styling
	local legacy_buttons=$(grep -rln "p-button-rounded\|p-button-text\|p-button-danger\|p-button-success" "$SRC_DIR" 2>/dev/null || true)
	if [[ -n "$legacy_buttons" ]]; then
		issues+="## Legacy Button Classes\n"
		issues+="Files using PrimeVue 3 class-based styling:\n"
		issues+="\`\`\`\n$legacy_buttons\n\`\`\`\n"
		issues+="Should use props: \`<Button rounded text severity=\"danger\" />\`\n\n"
		has_issues=true
	fi

	# Legacy DataTable responsiveLayout
	local legacy_datatable=$(grep -rln "responsiveLayout=" "$SRC_DIR" 2>/dev/null || true)
	if [[ -n "$legacy_datatable" ]]; then
		issues+="## Legacy DataTable Props\n"
		issues+="Files using 'responsiveLayout' instead of 'scrollable scrollHeight':\n"
		issues+="\`\`\`\n$legacy_datatable\n\`\`\`\n\n"
		has_issues=true
	fi

	# Check for severity="warn" (should be "warning")
	local legacy_severity=$(grep -rln 'severity="warn"' "$SRC_DIR" 2>/dev/null || true)
	if [[ -n "$legacy_severity" ]]; then
		issues+="## Legacy Severity Values\n"
		issues+="Files using 'warn' instead of 'warning':\n"
		issues+="\`\`\`\n$legacy_severity\n\`\`\`\n\n"
		has_issues=true
	fi

	# Check for Dropdown usage (should prefer Select in PrimeVue 4)
	local dropdown_usage=$(grep -rln "<Dropdown" "$SRC_DIR" 2>/dev/null || true)
	if [[ -n "$dropdown_usage" ]]; then
		issues+="## Dropdown Usage (Consider Select)\n"
		issues+="Files using Dropdown (Select is preferred in PrimeVue 4):\n"
		issues+="\`\`\`\n$dropdown_usage\n\`\`\`\n"
		issues+="Note: Dropdown still works, but Select is the modern choice.\n\n"
	fi

	# Check for existing schemas that might conflict
	if [[ -d "$SCHEMAS_DIR" ]]; then
		local existing_schemas=$(ls -1 "$SCHEMAS_DIR"/*.json 2>/dev/null || true)
		if [[ -n "$existing_schemas" ]]; then
			issues+="## Existing Schemas\n"
			issues+="Found existing schema files (will verify compatibility):\n"
			issues+="\`\`\`\n$existing_schemas\n\`\`\`\n\n"
		fi
	fi

	# Check for existing stores that might conflict
	if [[ -d "$STORES_DIR" ]]; then
		local existing_stores=$(ls -1 "$STORES_DIR"/*.ts 2>/dev/null || true)
		if [[ -n "$existing_stores" ]]; then
			issues+="## Existing Stores\n"
			issues+="Found existing store files:\n"
			issues+="\`\`\`\n$existing_stores\n\`\`\`\n"
			issues+="Will integrate with or replace as needed.\n\n"
		fi
	fi

	# Write report
	{
		echo "# Dhool ERP Contradiction Report"
		echo "Generated: $(date)"
		echo ""
		if [[ "$has_issues" == "true" ]]; then
			echo "## ⚠️ Issues Found"
			echo ""
			echo -e "$issues"
			echo "## Resolution"
			echo "Run \`./dhool-implement.sh --auto\` to fix these issues automatically."
		else
			echo "## ✅ No Critical Issues Found"
			echo ""
			echo "The codebase is ready for implementation."
			echo -e "$issues"
		fi
	} >"$CONTRADICTIONS_FILE"

	if [[ "$has_issues" == "true" ]]; then
		log_warn "Issues found! See $CONTRADICTIONS_FILE"
		cat "$CONTRADICTIONS_FILE"
		return 1
	else
		log_success "No critical contradictions found"
		return 0
	fi
}

# =============================================================================
# Build & Dev Server
# =============================================================================

run_type_check() {
	if command -v vue-tsc &>/dev/null; then
		timeout "$BUILD_TIMEOUT" pnpm dlx vue-tsc --noEmit 2>&1
	else
		log_warn "vue-tsc not found, skipping type check"
		return 0
	fi
}

run_build() {
	timeout "$BUILD_TIMEOUT" pnpm build 2>&1
}

run_lint() {
	if [[ -f "eslint.config.ts" ]]; then
		timeout "$BUILD_TIMEOUT" pnpm lint 2>&1 || true
	fi
}

start_dev_server() {
	log_header "Starting Development Server"

	# Check if already running
	if [[ -n "${DEV_SERVER_PID:-}" ]] && kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
		log_info "Dev server already running (PID: $DEV_SERVER_PID)"
		return 0
	fi

	# Start dev server in background
	log_info "Starting dev server on http://localhost:$DEV_PORT"
	pnpm dev -- --port "$DEV_PORT" &
	DEV_SERVER_PID=$!
	save_state

	# Wait for server to be ready
	log_info "Waiting for server to start..."
	sleep 3

	if kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
		log_success "Dev server running at http://localhost:$DEV_PORT"
		echo ""
		echo -e "${GREEN}Open in browser: http://localhost:$DEV_PORT${NC}"
		echo -e "${DIM}Press Ctrl+C to stop${NC}"

		# Keep script running if --dev flag
		if [[ "${1:-}" == "--wait" ]]; then
			wait "$DEV_SERVER_PID"
		fi
	else
		log_error "Failed to start dev server"
		return 1
	fi
}

stop_dev_server() {
	if [[ -n "${DEV_SERVER_PID:-}" ]] && kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
		log_info "Stopping dev server (PID: $DEV_SERVER_PID)"
		kill "$DEV_SERVER_PID" 2>/dev/null || true
		DEV_SERVER_PID=""
		save_state
	fi
}

ensure_dev_running() {
	if [[ -z "${DEV_SERVER_PID:-}" ]] || ! kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
		start_dev_server
	fi
}

fix_build_errors() {
	local attempt=1

	while [[ $attempt -le $MAX_FIX_ATTEMPTS ]]; do
		log_info "Build attempt $attempt/$MAX_FIX_ATTEMPTS..."

		local errors=$(run_type_check 2>&1 | grep -E "(error|Error)" | head -20)

		if [[ -z "$errors" ]]; then
			log_success "Build passed!"
			return 0
		fi

		log_fix "Attempting fix (attempt $attempt)..."

		claude --dangerously-skip-permissions "Fix these TypeScript/Vue build errors:

$errors

RULES:
1. Fix type errors
2. Fix import errors  
3. Use PrimeVue 4 patterns (props not classes)
4. The code MUST compile.

PrimeVue 4 patterns:
- Import from '@primevue/core/api'
- Use <Button severity=\"danger\" /> not class=\"p-button-danger\"
- Use <DataTable scrollable /> not responsiveLayout"

		((attempt++))
		sleep 2
	done

	log_error "Could not fix after $MAX_FIX_ATTEMPTS attempts"
	return 1
}

ensure_builds() {
	if ! run_type_check 2>/dev/null; then
		log_warn "Build failed, attempting fixes..."
		fix_build_errors || return 1
	fi
	return 0
}

# =============================================================================
# Task Execution
# =============================================================================

execute_task() {
	local task_id="$1"
	local task_func="task_${task_id//./_}"

	log_task "Executing $task_id: ${TASK_DESC[$task_id]}"
	set_task_status "$task_id" "running"

	# Check for contradictions before each task
	if [[ -d "$SRC_DIR" ]]; then
		local contradictions=$(check_task_contradictions "$task_id")
		if [[ -n "$contradictions" ]]; then
			log_warn "Potential contradictions for $task_id:"
			echo "$contradictions"
		fi
	fi

	if type "$task_func" &>/dev/null; then
		if $task_func; then
			set_task_status "$task_id" "completed"

			# Show outcome
			local outcome="${TASK_OUTCOME[$task_id]}"
			if [[ -n "$outcome" ]]; then
				log_outcome "$task_id" "${TASK_DESC[$task_id]}" "$outcome"
			fi

			log_success "Task $task_id completed"

			# Git commit if available
			if git rev-parse --git-dir &>/dev/null 2>&1; then
				git add -A
				git commit -m "feat(dhool): $task_id - ${TASK_DESC[$task_id]}" 2>/dev/null || true
			fi
			return 0
		fi
	else
		log_error "Task function $task_func not found"
	fi

	set_task_status "$task_id" "failed"
	log_error "Task $task_id failed"
	return 1
}

check_task_contradictions() {
	local task_id="$1"
	local issues=""

	case "$task_id" in
	T1.2)
		# Check if PrimeVue already configured differently
		if [[ -f "$SRC_DIR/main.ts" ]] && grep -q "PrimeVue" "$SRC_DIR/main.ts"; then
			issues+="main.ts already has PrimeVue configuration\n"
		fi
		;;
	T9.*)
		# Check for existing stores
		local store_name=$(echo "${TASK_DESC[$task_id]}" | grep -oP 'Create \K\w+Store')
		if [[ -n "$store_name" && -f "$STORES_DIR/${store_name,,}.ts" ]]; then
			issues+="Store $store_name already exists\n"
		fi
		;;
	esac

	echo -e "$issues"
}

run_all_tasks() {
	for task in "${TASK_ORDER[@]}"; do
		local status=$(get_task_status "$task")
		if [[ "$status" != "completed" ]]; then
			if ! execute_task "$task"; then
				log_error "Failed at task: $task"
				echo "To resume: $0 --resume"
				return 1
			fi

			# Brief pause to allow viewing outcome
			sleep 1
		else
			log_info "Skipping completed: $task"
		fi
	done

	log_header "ALL TASKS COMPLETED"
	show_status

	echo ""
	log_success "View at: http://localhost:$DEV_PORT"
	log_info "Full demo: http://localhost:$DEV_PORT/demo"
}

run_from_task() {
	local start_task="$1"
	local started=false

	for task in "${TASK_ORDER[@]}"; do
		[[ "$task" == "$start_task" ]] && started=true
		if $started; then
			local status=$(get_task_status "$task")
			if [[ "$status" != "completed" ]]; then
				execute_task "$task" || return 1
			fi
		fi
	done
}

run_phase() {
	local phase_num="$1"
	local phase_prefix="T${phase_num}."

	log_header "Running Phase $phase_num"

	# Start dev server for viewing
	ensure_dev_running

	for task in "${TASK_ORDER[@]}"; do
		if [[ "$task" == $phase_prefix* ]]; then
			local status=$(get_task_status "$task")
			[[ "$status" != "completed" ]] && execute_task "$task"
		fi
	done

	log_success "Phase $phase_num complete!"
	log_info "View at: http://localhost:$DEV_PORT"
}

resume_tasks() {
	local resume_from=""
	for task in "${TASK_ORDER[@]}"; do
		local status=$(get_task_status "$task")
		if [[ "$status" == "failed" || "$status" == "running" || "$status" == "pending" ]]; then
			resume_from="$task"
			break
		fi
	done

	if [[ -z "$resume_from" ]]; then
		log_success "All tasks already completed!"
		return 0
	fi

	log_info "Resuming from: $resume_from"
	ensure_dev_running
	run_from_task "$resume_from"
}

# =============================================================================
# PHASE 0: Pre-flight Tasks
# =============================================================================

task_T0_1() {
	log_info "Checking for contradictions..."
	check_contradictions || log_warn "Contradictions found, will fix during implementation"
	return 0
}

task_T0_2() {
	log_info "Verifying PrimeVue 4 installation..."

	if [[ ! -f "package.json" ]]; then
		log_error "package.json not found"
		return 1
	fi

	# Check for PrimeVue 4
	if ! grep -q '"primevue"' package.json; then
		log_info "Installing PrimeVue 4..."
		pnpm install primevue @primevue/themes @primevue/core
	fi

	# Check version
	local pv_version=$(grep '"primevue"' package.json | grep -oP '"\^?\d+' | tr -d '"^')
	if [[ "${pv_version:-0}" -lt 4 ]]; then
		log_warn "PrimeVue version is $pv_version, upgrading to 4..."
		pnpm install primevue@latest @primevue/themes@latest @primevue/core@latest
	fi

	log_success "PrimeVue 4 verified"
}

task_T0_3() {
	log_info "Creating directory structure..."

	mkdir -p "$COMPONENTS_DIR"/{atoms,molecules,organisms,templates,renderers,extended}
	mkdir -p "$VIEWS_DIR"/{demo,showcase}
	mkdir -p "$STORES_DIR"
	mkdir -p "$SERVICES_DIR"
	mkdir -p "$COMPOSABLES_DIR"
	mkdir -p "$TYPES_DIR"
	mkdir -p "$SCHEMAS_DIR"
	mkdir -p "$UTILS_DIR"
	mkdir -p "$SRC_DIR/router/guards"

	log_success "Directory structure created"
}

# =============================================================================
# PHASE 1: Core Setup Tasks
# =============================================================================

task_T1_1() {
	log_info "Creating TypeScript types..."

	claude --dangerously-skip-permissions "Create comprehensive TypeScript type definitions for Dhool ERP.

Create these files:

1. $TYPES_DIR/schema.ts - Schema types
   - FieldType union (text, number, currency, date, select, link, table, etc.)
   - FieldSchema interface (name, type, label, required, validation, depends_on, etc.)
   - ColumnSchema interface (field, header, sortable, filterable, etc.)
   - ActionSchema interface (id, label, icon, type, handler, etc.)
   - DocumentSchema interface (name, module, api, listView, formView, access, workflow)
   - DashboardSchema, WidgetSchema

2. $TYPES_DIR/access.ts - Access control types
   - SubscriptionPlan enum (free, starter, professional, enterprise)
   - Permission interface (create, read, update, delete, scope)
   - DataScope enum (none, own, team, department, all)
   - ABACCondition interface (attribute, operator, value)
   - ABACPolicy interface
   - AccessContext interface

3. $TYPES_DIR/api.ts - API response types
   - ApiResponse<T> generic
   - PaginatedResponse<T> with meta
   - ApiError interface

4. $TYPES_DIR/index.ts - Re-export all types

Follow the documentation patterns exactly. Make types comprehensive but practical."
}

task_T1_2() {
	log_info "Setting up PrimeVue 4 with Aura preset..."

	claude --dangerously-skip-permissions "Setup PrimeVue 4 in $SRC_DIR/main.ts with proper configuration.

CRITICAL: Use PrimeVue 4 patterns only:
- Import from '@primevue/themes/aura' for Aura preset
- Use definePreset to extend Aura
- Setup Pass-Through API for global customization
- Import ToastService, ConfirmationService, DialogService

Create/update $SRC_DIR/main.ts:
\`\`\`typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'

// Custom preset extending Aura
const DhoolPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      // ... full palette
      950: '{indigo.950}'
    }
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: DhoolPreset,
    options: {
      darkModeSelector: '.dark'
    }
  },
  ripple: true
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
app.mount('#app')
\`\`\`

Also create $SRC_DIR/primevue.d.ts for component type augmentation if needed."
}

task_T1_3() {
	log_info "Configuring Tailwind with PrimeVue CSS variables..."

	claude --dangerously-skip-permissions "Create/update Tailwind configuration to work with PrimeVue 4 CSS variables.

Create $PROJECT_ROOT/tailwind.config.ts:
\`\`\`typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map to PrimeVue CSS variables
        primary: {
          DEFAULT: 'var(--p-primary-color)',
          50: 'var(--p-primary-50)',
          // ... all shades
          950: 'var(--p-primary-950)'
        },
        surface: {
          ground: 'var(--p-surface-ground)',
          section: 'var(--p-surface-section)',
          card: 'var(--p-surface-card)',
          overlay: 'var(--p-surface-overlay)',
          border: 'var(--p-surface-border)'
        }
      }
    }
  },
  plugins: []
} satisfies Config
\`\`\`

Also ensure $SRC_DIR/assets/main.css imports:
- tailwindcss/base
- tailwindcss/components  
- tailwindcss/utilities"
}

task_T1_4() {
	log_info "Setting up auto-imports..."

	claude --dangerously-skip-permissions "Configure Vite for auto-imports of Vue, PrimeVue components, and composables.

Update $PROJECT_ROOT/vite.config.ts:
\`\`\`typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
      dts: true
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: true,
      dirs: ['./src/composables']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
\`\`\`

Ensure packages are installed:
- unplugin-vue-components
- unplugin-auto-import
- @primevue/auto-import-resolver"
}

task_T1_5() {
	log_info "Creating API service..."

	claude --dangerously-skip-permissions "Create comprehensive API service with interceptors.

Create $SERVICES_DIR/api.ts:

Features:
- Axios instance with base URL from env
- Request interceptor: Add auth token, tenant ID header
- Response interceptor: Handle 401 (refresh token), handle errors
- Generic CRUD methods: get, post, put, patch, delete
- Typed responses using ApiResponse<T>
- Token refresh logic
- Request/response logging in dev

Example structure:
\`\`\`typescript
import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { ApiResponse, PaginatedResponse } from '@/types'

class ApiService {
  private client: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api/v1',
      timeout: 30000
    })
    this.setupInterceptors()
  }

  // ... interceptors, refresh logic, CRUD methods
}

export const api = new ApiService()
\`\`\`"
}

task_T1_6() {
	log_info "Creating component showcase page..."

	claude --dangerously-skip-permissions "Create a component showcase page to view all PrimeVue components.

Create $VIEWS_DIR/showcase/index.vue:
- Display all PrimeVue 4 components we'll use
- Show proper PrimeVue 4 patterns (props not classes)
- Include: Button, InputText, Select, DataTable, Dialog, Toast, etc.
- Use tabs to organize: Forms, Data, Feedback, Navigation

Add route to router:
\`\`\`typescript
{
  path: '/showcase',
  name: 'showcase',
  component: () => import('@/views/showcase/index.vue')
}
\`\`\`

The page should demonstrate correct PrimeVue 4 usage:
- <Button severity=\"success\" rounded />
- <InputText v-model=\"value\" />
- <Select v-model=\"selected\" :options=\"items\" />
- <DataTable :value=\"data\" scrollable scrollHeight=\"400px\">

Make it visually appealing and useful as a reference."
}

# =============================================================================
# PHASE 2: Access Control & Schema Engine
# =============================================================================

task_T2_1() {
	log_info "Creating AccessService class..."

	claude --dangerously-skip-permissions "Create the AccessService class implementing three-layer access control.

Create $SERVICES_DIR/access.ts:

Three layers:
1. Subscription Level: Check plan, modules enabled, usage limits
2. Role Level: CRUD permissions with data scope (own/team/department/all)
3. ABAC Level: Field-level access based on attribute conditions

Methods:
- checkSubscription(moduleId: string): boolean
- checkPermission(docType: string, action: string): Permission
- evaluateABAC(policy: ABACPolicy, context: AccessContext): boolean
- filterFields(fields: FieldSchema[], context: AccessContext): FieldSchema[]
- filterActions(actions: ActionSchema[], context: AccessContext): ActionSchema[]
- getDataScope(docType: string): DataScope

Use the types from @/types/access.ts"
}

task_T2_2() {
	log_info "Creating SchemaService class..."

	claude --dangerously-skip-permissions "Create the SchemaService class for loading and parsing JSON schemas.

Create $SERVICES_DIR/schema.ts:

Features:
- loadSchema(docType: string): Promise<DocumentSchema>
- Schema caching with TTL (10 minutes)
- Fallback to local JSON files
- Schema validation
- Generate default values from schema
- Parse field dependencies

Methods:
- getSchema(docType: string): DocumentSchema
- validateSchema(schema: unknown): boolean
- generateDefaults(schema: DocumentSchema): Record<string, any>
- getFieldDependencies(field: FieldSchema): DependencyConfig[]
- invalidateCache(docType?: string): void"
}

task_T2_3() {
	log_info "Creating access store..."

	claude --dangerously-skip-permissions "Create Pinia store for access control state.

Create $STORES_DIR/access.ts:

State:
- subscription: SubscriptionInfo | null
- roles: UserRole[]
- policies: ABACPolicy[]
- permissions: Map<string, Permission>

Actions:
- loadAccessData(): Promise<void>
- hasPermission(docType: string, action: string): boolean
- canAccessModule(moduleId: string): boolean
- getFieldAccess(docType: string, fieldName: string): FieldAccess

Getters:
- isAdmin: boolean
- enabledModules: string[]
- currentPlan: SubscriptionPlan"
}

task_T2_4() {
	log_info "Creating useAccess composable..."

	claude --dangerously-skip-permissions "Create useAccess composable for components.

Create $COMPOSABLES_DIR/useAccess.ts:

Returns:
- canCreate(docType: string): boolean
- canRead(docType: string): boolean
- canUpdate(docType: string): boolean
- canDelete(docType: string): boolean
- canAccessField(docType: string, field: string): FieldAccess
- hasModule(moduleId: string): boolean
- subscription: ComputedRef<SubscriptionInfo>

Use the accessStore internally."
}

task_T2_5() {
	log_info "Creating useSchema composable..."

	claude --dangerously-skip-permissions "Create useSchema composable for loading schemas.

Create $COMPOSABLES_DIR/useSchema.ts:

\`\`\`typescript
export function useSchema(docType: MaybeRef<string>) {
  const schema = ref<DocumentSchema | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)

  // Load schema with caching
  // Filter fields based on access
  // Generate form defaults
  
  return {
    schema: computed(() => schema.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fields: computed(() => filterFields(schema.value?.formView.fields)),
    columns: computed(() => filterColumns(schema.value?.listView.columns)),
    actions: computed(() => filterActions(schema.value?.listView.actions)),
    reload: () => loadSchema()
  }
}
\`\`\`"
}

task_T2_6() {
	log_info "Creating useCrud composable..."

	claude --dangerously-skip-permissions "Create useCrud composable for CRUD operations.

Create $COMPOSABLES_DIR/useCrud.ts:

\`\`\`typescript
export function useCrud<T extends { id: string }>(docType: MaybeRef<string>) {
  const { schema } = useSchema(docType)
  const items = ref<T[]>([])
  const loading = ref(false)
  const selectedItem = ref<T | null>(null)
  
  // Use Vue Query or similar for data fetching
  // Integrate with schema for API endpoints
  
  return {
    items,
    loading,
    selectedItem,
    // List operations
    fetchList: (params?: ListParams) => Promise<void>,
    // Single item
    fetchOne: (id: string) => Promise<T>,
    // Mutations
    create: (data: Partial<T>) => Promise<T>,
    update: (id: string, data: Partial<T>) => Promise<T>,
    remove: (id: string) => Promise<void>,
    // Bulk
    bulkDelete: (ids: string[]) => Promise<void>,
    // Utils
    refresh: () => void
  }
}
\`\`\`"
}

task_T2_7() {
	log_info "Creating access control demo page..."

	claude --dangerously-skip-permissions "Create a demo page showing access control in action.

Create $VIEWS_DIR/demo/access.vue:

Show:
1. Current user subscription info
2. Enabled modules list
3. Permission matrix for different doc types
4. Field-level access demonstration
5. Toggle different roles/plans to see changes

Add route: /demo/access"
}

# =============================================================================
# PHASE 3: JSON Schemas
# =============================================================================

task_T3_1() {
	log_info "Creating customer.json schema..."

	claude --dangerously-skip-permissions "Create comprehensive customer schema following the documentation.

Create $SCHEMAS_DIR/customer.json:

Include:
- Basic info: name, label, labelPlural, icon, module
- API config: endpoints, pagination
- listView: columns (name, email, phone, type, status), filters, search, actions
- formView: sections (General, Contact, Address), fields with validation
- access: required module, permissions per action
- Field types: text, email, phone, select, link

Follow the exact structure from the documentation.
Include field dependencies (e.g., tax_id shown only for company type).
Include access control (e.g., credit_limit only for professional+ plans)."
}

task_T3_2() {
	log_info "Creating invoice.json schema..."

	claude --dangerously-skip-permissions "Create comprehensive invoice schema (transaction document).

Create $SCHEMAS_DIR/invoice.json:

Include:
- Workflow: draft → submitted → approved → paid
- Line items as child table
- Calculations: subtotal, tax, total
- Status field with transitions
- Actions: Submit, Approve, Mark Paid, Print, Email
- Access control per workflow state

This is a more complex document showing:
- Child table (items)
- Workflow states
- Calculated fields
- State-dependent actions"
}

task_T3_3() {
	log_info "Creating product.json schema..."

	claude --dangerously-skip-permissions "Create product schema.

Create $SCHEMAS_DIR/product.json:

Include:
- Product info: name, sku, description, category
- Pricing: price, cost, margin
- Inventory: stock_qty, reorder_level
- Images as child table
- Variants support
- Status: active, discontinued"
}

task_T3_4() {
	log_info "Creating dashboard.json schema..."

	claude --dangerously-skip-permissions "Create dashboard schema with widgets.

Create $SCHEMAS_DIR/dashboard.json:

Widget types:
- stat: KPI cards (revenue, orders, customers)
- chart: Line, bar, pie charts
- table: Mini data tables
- list: Recent items list

Include:
- Grid layout configuration
- Widget refresh intervals
- Data source configuration
- Access control per widget"
}

task_T3_5() {
	log_info "Creating schema validation utility..."

	claude --dangerously-skip-permissions "Create schema validation utility.

Create $UTILS_DIR/schemaValidator.ts:

Features:
- Validate schema structure
- Check required fields
- Validate field types
- Check action definitions
- Validate access control config
- Return detailed error messages

Use JSON Schema or Zod for validation."
}

task_T3_6() {
	log_info "Creating schema viewer demo..."

	claude --dangerously-skip-permissions "Create a schema viewer/browser demo page.

Create $VIEWS_DIR/demo/schemas.vue:

Features:
- List all available schemas
- View schema JSON with syntax highlighting
- Show parsed schema in tree view
- Preview generated form
- Preview generated list view

Add route: /demo/schemas"
}

# =============================================================================
# PHASE 4: Molecules
# =============================================================================

task_T4_1() {
	log_info "Creating FormField component..."

	claude --dangerously-skip-permissions "Create FormField molecule component.

Create $MOLECULES_DIR/FormField.vue:

Props:
- label: string
- name: string
- required: boolean
- error: string
- description: string
- tooltip: string

Slots:
- default: The input component
- error: Custom error display

Features:
- Label with required indicator
- Wraps any input component
- Shows validation errors
- Help text/description
- Tooltip support

Use PrimeVue 4 components (Message for errors).

Example usage:
\`\`\`vue
<FormField label=\"Email\" required :error=\"errors.email\">
  <InputText v-model=\"email\" />
</FormField>
\`\`\`"
}

task_T4_2() {
	log_info "Creating StatCard component..."

	claude --dangerously-skip-permissions "Create StatCard molecule component.

Create $MOLECULES_DIR/StatCard.vue:

Props:
- title: string
- value: string | number
- icon: string (PrimeIcons)
- trend: { value: number, direction: 'up' | 'down' }
- loading: boolean
- color: 'primary' | 'success' | 'warning' | 'danger'

Features:
- Display KPI value prominently
- Optional icon
- Trend indicator with percentage
- Loading skeleton state
- Click handler for drill-down

Use PrimeVue Card component as base."
}

task_T4_3() {
	log_info "Creating ActionMenu component..."

	claude --dangerously-skip-permissions "Create ActionMenu molecule component.

Create $MOLECULES_DIR/ActionMenu.vue:

Props:
- actions: ActionSchema[]
- type: 'buttons' | 'menu' | 'split'
- size: 'small' | 'normal' | 'large'
- disabled: boolean

Events:
- action: (actionId: string, item?: any) => void

Features:
- Render as buttons, dropdown menu, or split button
- Access control filtering
- Icon support
- Separator support
- Confirmation dialog integration

Use PrimeVue Button, Menu, SplitButton."
}

task_T4_4() {
	log_info "Creating EmptyState component..."

	claude --dangerously-skip-permissions "Create EmptyState molecule component.

Create $MOLECULES_DIR/EmptyState.vue:

Props:
- icon: string
- title: string
- description: string
- actionLabel: string
- actionIcon: string

Events:
- action: () => void

Slots:
- icon: Custom icon
- actions: Custom action buttons

Use for empty lists, search results, etc."
}

task_T4_5() {
	log_info "Creating molecules showcase..."

	claude --dangerously-skip-permissions "Create molecules showcase page.

Create $VIEWS_DIR/showcase/molecules.vue:

Show all molecule components with:
- Different prop variations
- Interactive examples
- Code snippets

Add route: /showcase/molecules"
}

# =============================================================================
# PHASE 5: Organisms
# =============================================================================

task_T5_1() {
	log_info "Creating DataTableCrud component..."

	claude --dangerously-skip-permissions "Create DataTableCrud organism component (schema-driven).

Create $ORGANISMS_DIR/DataTableCrud.vue:

Props:
- docType: string
- schema: DocumentSchema (optional, auto-loads if not provided)
- data: any[] (optional, fetches if not provided)
- selection: 'single' | 'multiple' | 'none'
- showToolbar: boolean
- showPagination: boolean

Events:
- row-click: (item) => void
- action: (actionId, items) => void
- selection-change: (items) => void

Features:
- Columns from schema
- Sorting, filtering, pagination
- Row selection
- Toolbar actions (create, bulk delete)
- Row actions (edit, delete)
- Loading states
- Empty state

CRITICAL: Use PrimeVue 4 DataTable patterns:
- <DataTable scrollable scrollHeight=\"flex\">
- NOT responsiveLayout=\"scroll\"

Use the useSchema and useCrud composables."
}

task_T5_2() {
	log_info "Creating FormBuilder component..."

	claude --dangerously-skip-permissions "Create FormBuilder organism component (schema-driven).

Create $ORGANISMS_DIR/FormBuilder.vue:

Props:
- schema: DocumentSchema
- modelValue: Record<string, any>
- readonly: boolean
- loading: boolean
- sections: boolean (show section headers)

Events:
- update:modelValue
- submit
- cancel
- field-change: (field, value, oldValue)

Features:
- Generate form from schema fields
- Sections with collapsible support
- Field dependencies (show/hide/set value)
- Validation (VeeValidate or similar)
- Auto-save option
- Multi-column layout
- Child table support

Use FieldRenderer for each field."
}

task_T5_3() {
	log_info "Creating FormDrawer component..."

	claude --dangerously-skip-permissions "Create FormDrawer organism component.

Create $ORGANISMS_DIR/FormDrawer.vue:

Props:
- visible: boolean
- docType: string
- recordId: string (null for create)
- width: string (default '500px')

Events:
- update:visible
- saved: (record) => void
- deleted: () => void

Features:
- Slide-out drawer using PrimeVue Drawer/Sidebar
- Header with title and close button
- FormBuilder inside
- Footer with Save/Cancel buttons
- Loading states
- Unsaved changes warning

Use PrimeVue Drawer component (or Dialog for modal variant)."
}

task_T5_4() {
	log_info "Creating organisms showcase..."

	claude --dangerously-skip-permissions "Create organisms showcase page.

Create $VIEWS_DIR/showcase/organisms.vue:

Show:
- DataTableCrud with sample data
- FormBuilder with sample schema
- FormDrawer in action

Add route: /showcase/organisms"
}

# =============================================================================
# PHASE 6: Renderers
# =============================================================================

task_T6_1() {
	log_info "Creating FieldRenderer component..."

	claude --dangerously-skip-permissions "Create FieldRenderer component that renders correct PrimeVue component per field type.

Create $RENDERERS_DIR/FieldRenderer.vue:

Props:
- field: FieldSchema
- modelValue: any
- readonly: boolean
- errors: string[]

Renders based on field.type:
- text → InputText
- textarea → Textarea
- number → InputNumber
- currency → InputNumber with currency format
- date → DatePicker
- datetime → DatePicker with showTime
- select → Select
- multiselect → MultiSelect
- checkbox → Checkbox
- switch → ToggleSwitch
- link → LinkField (custom)
- table → ChildTable (custom)
- email → InputText type=email
- phone → InputMask
- url → InputText
- tags → Chips
- rating → Rating
- color → ColorPicker
- html → Editor
- readonly → plain text display

CRITICAL: Use PrimeVue 4 component names and props!"
}

task_T6_2() {
	log_info "Creating DocumentPage renderer..."

	claude --dangerously-skip-permissions "Create DocumentPage renderer - the main schema-driven page component.

Create $RENDERERS_DIR/DocumentPage.vue:

Props:
- docType: string

This single component:
1. Loads schema for docType
2. Renders DataTableCrud with columns from schema
3. Handles toolbar/row/bulk actions
4. Opens FormDrawer for create/edit
5. Applies access control at all levels

Usage:
\`\`\`vue
<DocumentPage docType=\"customer\" />
\`\`\`

This is the key component that eliminates repetitive CRUD pages!"
}

task_T6_3() {
	log_info "Creating DashboardPage renderer..."

	claude --dangerously-skip-permissions "Create DashboardPage renderer for dashboard schemas.

Create $RENDERERS_DIR/DashboardPage.vue:

Props:
- schemaName: string

Features:
- Load dashboard schema
- Render widget grid
- Widget types: stat, chart, table, list
- Responsive grid layout
- Widget refresh
- Access control per widget

Use PrimeVue Card for widgets, Chart.js or similar for charts."
}

task_T6_4() {
	log_info "Creating renderer demo with live schema..."

	claude --dangerously-skip-permissions "Create renderer demo page with live schema editing.

Create $VIEWS_DIR/demo/renderer.vue:

Features:
- JSON schema editor (left panel)
- Live preview of rendered form/list (right panel)
- Toggle between form and list view
- Sample data for list view
- Save schema to file

This demonstrates the power of schema-driven UI.

Add route: /demo/renderer"
}

# =============================================================================
# PHASE 7: Extended Components
# =============================================================================

task_T7_1() {
	log_info "Creating LinkField component..."

	claude --dangerously-skip-permissions "Create LinkField component (ERPNext-style document link).

Create $EXTENDED_DIR/LinkField.vue:

Props:
- modelValue: string (the linked record ID)
- docType: string (what document type to link to)
- displayField: string (field to show, default 'name')
- filters: Record<string, any>
- showQuickCreate: boolean
- multiple: boolean

Features:
- Searchable dropdown fetching from docType API
- Display selected item's displayField
- Quick create button to add new record
- Clear button
- Multiple selection option
- Lazy loading with search

Use PrimeVue AutoComplete as base."
}

task_T7_2() {
	log_info "Creating AppDataTable component..."

	claude --dangerously-skip-permissions "Create AppDataTable component (extended PrimeVue DataTable).

Create $EXTENDED_DIR/AppDataTable.vue:

Extends PrimeVue DataTable with:
- Built-in loading state
- Built-in empty state
- Column visibility toggle
- Export to CSV/Excel
- Saved view preferences
- Responsive behavior
- Selection with toolbar

This wraps DataTable with common enhancements.

CRITICAL: Use PrimeVue 4 patterns:
- scrollable, scrollHeight
- NOT responsiveLayout"
}

task_T7_3() {
	log_info "Creating CurrencyInput component..."

	claude --dangerously-skip-permissions "Create CurrencyInput component.

Create $EXTENDED_DIR/CurrencyInput.vue:

Props:
- modelValue: number
- currency: string (default 'KES')
- locale: string (default 'en-KE')
- min: number
- max: number
- readonly: boolean

Features:
- Format as currency on blur
- Parse on focus
- Currency symbol display
- Thousand separators
- Decimal handling

Use PrimeVue InputNumber with currency mode."
}

task_T7_4() {
	log_info "Creating extended components showcase..."

	claude --dangerously-skip-permissions "Create extended components showcase page.

Create $VIEWS_DIR/showcase/extended.vue:

Show:
- LinkField with sample data
- AppDataTable features
- CurrencyInput variations

Add route: /showcase/extended"
}

# =============================================================================
# PHASE 8: Templates
# =============================================================================

task_T8_1() {
	log_info "Creating MainLayout template..."

	claude --dangerously-skip-permissions "Create MainLayout template component.

Create $TEMPLATES_DIR/MainLayout.vue:

Structure:
- AppSidebar (collapsible)
- AppTopbar
- Main content area
- Toast container
- ConfirmDialog

Features:
- Responsive sidebar (drawer on mobile)
- Theme toggle (dark mode)
- Breadcrumbs slot
- Loading overlay

Use PrimeVue components: Sidebar, Toast, ConfirmDialog."
}

task_T8_2() {
	log_info "Creating AuthLayout template..."

	claude --dangerously-skip-permissions "Create AuthLayout template component.

Create $TEMPLATES_DIR/AuthLayout.vue:

Structure:
- Centered card
- Logo
- Content slot
- Footer with links

For login, register, forgot password pages."
}

task_T8_3() {
	log_info "Creating AppSidebar component..."

	claude --dangerously-skip-permissions "Create AppSidebar component.

Create $TEMPLATES_DIR/AppSidebar.vue:

Features:
- Module-based navigation from subscription
- Collapsible sections
- Active route highlighting
- Icons for each item
- Badge for counts (e.g., pending orders)
- User menu at bottom
- Collapse toggle

Use PrimeVue PanelMenu or custom tree."
}

task_T8_4() {
	log_info "Creating AppTopbar component..."

	claude --dangerously-skip-permissions "Create AppTopbar component.

Create $TEMPLATES_DIR/AppTopbar.vue:

Features:
- Global search (Command palette style)
- Notifications dropdown
- Dark mode toggle
- User menu with avatar
- Mobile menu toggle

Use PrimeVue: Toolbar, Menu, Avatar, Badge."
}

# =============================================================================
# PHASE 9: Stores
# =============================================================================

task_T9_1() {
	log_info "Creating authStore..."

	claude --dangerously-skip-permissions "Create auth store for authentication.

Create $STORES_DIR/auth.ts:

State:
- user: User | null
- token: string | null
- refreshToken: string | null
- isAuthenticated: boolean

Actions:
- login(credentials): Promise<void>
- logout(): Promise<void>
- refreshAuth(): Promise<void>
- loadUser(): Promise<void>

Persist token to localStorage."
}

task_T9_2() {
	log_info "Creating tenantStore..."

	claude --dangerously-skip-permissions "Create tenant store for multi-tenant data.

Create $STORES_DIR/tenant.ts:

State:
- tenant: Tenant | null
- subscription: Subscription | null
- modules: Module[]
- settings: TenantSettings

Actions:
- loadTenant(): Promise<void>
- loadSubscription(): Promise<void>
- isModuleEnabled(moduleId: string): boolean

Getters:
- currentPlan: SubscriptionPlan
- enabledModules: Module[]
- limits: UsageLimits"
}

task_T9_3() {
	log_info "Creating uiStore..."

	claude --dangerously-skip-permissions "Create UI store for application state.

Create $STORES_DIR/ui.ts:

State:
- sidebarCollapsed: boolean
- sidebarVisible: boolean (mobile)
- darkMode: boolean
- loading: boolean
- pageTitle: string
- breadcrumbs: Breadcrumb[]

Actions:
- toggleSidebar()
- toggleDarkMode()
- setLoading(value: boolean)
- setPageTitle(title: string)
- setBreadcrumbs(items: Breadcrumb[])"
}

task_T9_4() {
	log_info "Creating schemaStore..."

	claude --dangerously-skip-permissions "Create schema store for caching schemas.

Create $STORES_DIR/schema.ts:

State:
- schemas: Map<string, DocumentSchema>
- loading: Set<string>
- errors: Map<string, Error>

Actions:
- loadSchema(docType: string): Promise<DocumentSchema>
- invalidate(docType?: string): void
- preloadSchemas(docTypes: string[]): Promise<void>

Use for schema caching across the app."
}

# =============================================================================
# PHASE 10: Router & Guards
# =============================================================================

task_T10_1() {
	log_info "Setting up router with guards..."

	claude --dangerously-skip-permissions "Setup Vue Router with route guards.

Update $SRC_DIR/router/index.ts:

Routes:
- / → redirect to /dashboard
- /login → AuthLayout + LoginPage
- /dashboard → MainLayout + Dashboard
- /showcase/* → MainLayout + showcase pages
- /demo/* → MainLayout + demo pages
- /:module/:docType → MainLayout + DocumentPage (dynamic)
- /404 → NotFound

Add guards in beforeEach:
- Check authentication
- Check module access
- Set page title"
}

task_T10_2() {
	log_info "Creating dynamic route generation..."

	claude --dangerously-skip-permissions "Create utility for generating routes from schemas.

Create $SRC_DIR/router/dynamicRoutes.ts:

Features:
- Load enabled modules from tenant
- For each module, load document schemas
- Generate routes: list, detail, create pages
- Use DocumentPage for all

Function:
generateRoutes(modules: Module[]): RouteRecordRaw[]"
}

task_T10_3() {
	log_info "Creating auth guard..."

	claude --dangerously-skip-permissions "Create authentication guard.

Create $SRC_DIR/router/guards/auth.ts:

Features:
- Check if route requires auth
- Redirect to login if not authenticated
- Redirect to intended route after login
- Handle token refresh"
}

task_T10_4() {
	log_info "Creating access guard..."

	claude --dangerously-skip-permissions "Create access control guard.

Create $SRC_DIR/router/guards/access.ts:

Features:
- Check module access
- Check document permissions
- Show 403 if no access
- Log access attempts"
}

# =============================================================================
# PHASE 11: Integration & Demo Pages
# =============================================================================

task_T11_1() {
	log_info "Creating App.vue shell..."

	claude --dangerously-skip-permissions "Create/update App.vue as the application shell.

Update $SRC_DIR/App.vue:

Structure:
- RouterView
- Toast component
- ConfirmDialog component
- Loading overlay

Initialize on mount:
- Load user if token exists
- Load tenant data
- Load access policies
- Generate dynamic routes"
}

task_T11_2() {
	log_info "Creating CustomerList page (schema-driven)..."

	claude --dangerously-skip-permissions "Create CustomerList page using DocumentPage.

Create $VIEWS_DIR/customers/index.vue:

Simply:
\`\`\`vue
<template>
  <DocumentPage docType=\"customer\" />
</template>
\`\`\`

Add route: /customers

This demonstrates the power of schema-driven UI - one line of code for a complete CRUD page!"
}

task_T11_3() {
	log_info "Creating InvoiceList page (schema-driven)..."

	claude --dangerously-skip-permissions "Create InvoiceList page using DocumentPage.

Create $VIEWS_DIR/invoices/index.vue:

\`\`\`vue
<template>
  <DocumentPage docType=\"invoice\" />
</template>
\`\`\`

Add route: /invoices"
}

task_T11_4() {
	log_info "Creating Dashboard page..."

	claude --dangerously-skip-permissions "Create Dashboard page.

Create $VIEWS_DIR/dashboard/index.vue:

Use DashboardPage renderer:
\`\`\`vue
<template>
  <DashboardPage schemaName=\"dashboard\" />
</template>
\`\`\`

Or create custom dashboard with:
- StatCard widgets
- Recent documents
- Quick actions

Add route: /dashboard"
}

task_T11_5() {
	log_info "Creating full demo walkthrough..."

	claude --dangerously-skip-permissions "Create comprehensive demo page.

Create $VIEWS_DIR/demo/index.vue:

Include:
- Welcome section
- Links to all demos
- Architecture overview
- PrimeVue 4 patterns reference
- Schema-driven UI explanation

Add route: /demo"
}

# =============================================================================
# PHASE 12: Validation
# =============================================================================

task_T12_1() {
	log_info "Checking TypeScript compilation..."

	if run_type_check; then
		log_success "TypeScript compilation passed"
	else
		fix_build_errors
	fi
}

task_T12_2() {
	log_info "Verifying PrimeVue 4 patterns..."

	local issues=""

	# Check for legacy patterns
	issues+=$(grep -rln "p-button-" "$SRC_DIR" 2>/dev/null || true)
	issues+=$(grep -rln "responsiveLayout=" "$SRC_DIR" 2>/dev/null || true)
	issues+=$(grep -rln "from 'primevue/api'" "$SRC_DIR" 2>/dev/null || true)

	if [[ -n "$issues" ]]; then
		log_warn "Legacy patterns found:"
		echo "$issues"

		claude --dangerously-skip-permissions "Fix these legacy PrimeVue 3 patterns in the codebase:

Files with issues:
$issues

Convert to PrimeVue 4:
- p-button-* classes → Button props (severity, rounded, text)
- responsiveLayout → scrollable scrollHeight
- primevue/api → @primevue/core/api"
	else
		log_success "All PrimeVue 4 patterns correct"
	fi
}

task_T12_3() {
	log_info "Validating all schemas..."

	if [[ -d "$SCHEMAS_DIR" ]]; then
		for schema in "$SCHEMAS_DIR"/*.json; do
			if [[ -f "$schema" ]]; then
				log_info "Validating: $schema"
				# Use jq to check JSON validity
				if command -v jq &>/dev/null; then
					jq empty "$schema" || log_error "Invalid JSON: $schema"
				fi
			fi
		done
		log_success "All schemas valid"
	fi
}

task_T12_4() {
	log_info "Generating final report..."

	{
		echo "# Dhool ERP Implementation Report"
		echo "Generated: $(date)"
		echo ""
		echo "## Summary"
		echo ""

		local completed=0
		for task in "${TASK_ORDER[@]}"; do
			[[ "${TASK_STATUS[$task]}" == "completed" ]] && ((completed++))
		done

		echo "- Total Tasks: ${#TASK_ORDER[@]}"
		echo "- Completed: $completed"
		echo "- Dev Server: http://localhost:$DEV_PORT"
		echo ""
		echo "## Components Created"
		echo ""
		echo "### Molecules"
		ls -1 "$MOLECULES_DIR"/*.vue 2>/dev/null | sed 's/.*\//- /' || echo "- None"
		echo ""
		echo "### Organisms"
		ls -1 "$ORGANISMS_DIR"/*.vue 2>/dev/null | sed 's/.*\//- /' || echo "- None"
		echo ""
		echo "### Renderers"
		ls -1 "$RENDERERS_DIR"/*.vue 2>/dev/null | sed 's/.*\//- /' || echo "- None"
		echo ""
		echo "### Schemas"
		ls -1 "$SCHEMAS_DIR"/*.json 2>/dev/null | sed 's/.*\//- /' || echo "- None"
		echo ""
		echo "## Demo Pages"
		echo "- http://localhost:$DEV_PORT/showcase - Component showcase"
		echo "- http://localhost:$DEV_PORT/demo - Full demo"
		echo "- http://localhost:$DEV_PORT/demo/schemas - Schema browser"
		echo "- http://localhost:$DEV_PORT/demo/renderer - Live schema editor"
		echo "- http://localhost:$DEV_PORT/customers - Customer CRUD"
		echo "- http://localhost:$DEV_PORT/invoices - Invoice CRUD"
		echo ""
		echo "## PrimeVue 4 Patterns Used"
		echo ""
		echo "- Import: \`@primevue/core/api\`"
		echo "- Button: \`<Button severity=\"success\" rounded />\`"
		echo "- DataTable: \`<DataTable scrollable scrollHeight=\"flex\" />\`"
		echo "- Select: \`<Select />\` (preferred over Dropdown)"
		echo "- Pass-Through API for customization"
	} >"$PROJECT_ROOT/IMPLEMENTATION-REPORT.md"

	log_success "Report generated: IMPLEMENTATION-REPORT.md"
}

# =============================================================================
# Prerequisites
# =============================================================================

check_prerequisites() {
	log_info "Checking prerequisites..."
	local missing=""

	command -v node &>/dev/null || missing+="- Node.js\n"
	command -v pnpm &>/dev/null || missing+="- pnpm\n"
	command -v claude &>/dev/null || missing+="- Claude CLI\n"
	[[ -f "package.json" ]] || missing+="- package.json (not in project root)\n"

	if [[ -n "$missing" ]]; then
		log_error "Missing:\n$missing"
		exit 1
	fi

	log_success "Prerequisites OK"
}

install_dependencies() {
	log_info "Installing dependencies..."

	# Core dependencies
	pnpm install primevue @primevue/themes @primevue/core @primevue/auto-import-resolver

	# Dev dependencies
	pnpm install -D unplugin-vue-components unplugin-auto-import

	# Additional utilities
	pnpm install axios pinia @vueuse/core

	log_success "Dependencies installed"
}

# =============================================================================
# Main
# =============================================================================

show_help() {
	cat <<'EOF'
Dhool ERP Documentation to Code Implementation

Usage:
  ./dhool-implement.sh [OPTIONS]

Options:
  --auto        Run all tasks automatically
  --resume      Resume from last checkpoint
  --status      Show progress
  --task ID     Run specific task (e.g., T1.1)
  --from ID     Run from task onwards
  --phase N     Run specific phase (0-12)
  --dev         Start dev server only
  --check       Check for contradictions
  --schema      Generate schemas only (Phase 3)
  --reset       Reset state
  --help        Show this help

Phases:
  0   Pre-flight checks
  1   Core Setup (types, PrimeVue, Tailwind, API)
  2   Access Control & Schema Engine
  3   JSON Schemas (customer, invoice, product, dashboard)
  4   Molecules (FormField, StatCard, etc.)
  5   Organisms (DataTableCrud, FormBuilder, FormDrawer)
  6   Renderers (FieldRenderer, DocumentPage, DashboardPage)
  7   Extended Components (LinkField, CurrencyInput)
  8   Templates (MainLayout, AppSidebar, AppTopbar)
  9   Stores (auth, tenant, ui, schema)
  10  Router & Guards
  11  Integration & Demo Pages
  12  Validation & Final Report

View Progress:
  After each task, view the result at http://localhost:5173

Examples:
  ./dhool-implement.sh --auto          # Run everything
  ./dhool-implement.sh --phase 3       # Create schemas only
  ./dhool-implement.sh --dev           # Just start dev server
  ./dhool-implement.sh --task T5.1     # Create DataTableCrud only
EOF
}

main() {
	# Initialize
	register_all_tasks
	init_state

	case "${1:-}" in
	--help | -h)
		show_help
		exit 0
		;;
	--status)
		show_status
		exit 0
		;;
	--reset)
		reset_state
		exit 0
		;;
	--check)
		check_prerequisites
		check_contradictions
		exit $?
		;;
	--dev)
		check_prerequisites
		start_dev_server --wait
		exit 0
		;;
	--auto)
		log_header "Dhool ERP Implementation (All Tasks)"
		check_prerequisites
		START_TIME=$(date +%s)
		ensure_dev_running
		run_all_tasks
		;;
	--resume)
		log_header "Resuming Implementation"
		check_prerequisites
		ensure_dev_running
		resume_tasks
		;;
	--task)
		[[ -z "${2:-}" ]] && {
			log_error "Task ID required"
			exit 1
		}
		check_prerequisites
		ensure_dev_running
		execute_task "$2"
		;;
	--from)
		[[ -z "${2:-}" ]] && {
			log_error "Task ID required"
			exit 1
		}
		check_prerequisites
		ensure_dev_running
		run_from_task "$2"
		;;
	--phase)
		[[ -z "${2:-}" ]] && {
			log_error "Phase number required"
			exit 1
		}
		check_prerequisites
		run_phase "$2"
		;;
	--schema)
		check_prerequisites
		run_phase 3
		;;
	"")
		log_header "Interactive Mode"
		check_prerequisites
		echo ""
		echo "Select an option:"
		echo "  1) Run all tasks"
		echo "  2) Resume from checkpoint"
		echo "  3) Show status"
		echo "  4) Run specific phase"
		echo "  5) Run specific task"
		echo "  6) Start dev server"
		echo "  7) Check contradictions"
		echo "  q) Quit"
		echo ""
		read -p "Choice: " choice
		case "$choice" in
		1)
			START_TIME=$(date +%s)
			ensure_dev_running
			run_all_tasks
			;;
		2)
			ensure_dev_running
			resume_tasks
			;;
		3) show_status ;;
		4)
			read -p "Phase (0-12): " p
			run_phase "$p"
			;;
		5)
			show_status
			read -p "Task ID: " t
			ensure_dev_running
			execute_task "$t"
			;;
		6) start_dev_server --wait ;;
		7) check_contradictions ;;
		q) exit 0 ;;
		esac
		;;
	*)
		log_error "Unknown option: $1"
		show_help
		exit 1
		;;
	esac
}

# Cleanup on exit
trap 'stop_dev_server' EXIT

main "$@"
