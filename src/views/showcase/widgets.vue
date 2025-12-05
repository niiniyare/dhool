<template>
  <div class="widgets-showcase">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Widgets Showcase
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Dashboard widgets for data visualization - StatWidget, ChartWidget, TableWidget, ListWidget
      </p>
    </div>

    <!-- StatWidget Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        StatWidget
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget
          title="Total Users"
          :value="1234"
          :trend="12.5"
          trend-label="vs last month"
          icon="pi pi-users"
          :config="{
            format: 'number',
            variant: 'primary'
          }"
        />

        <StatWidget
          title="Revenue"
          :value="45600"
          :trend="8.2"
          trend-label="vs last month"
          icon="pi pi-dollar"
          :config="{
            format: 'currency',
            currency: 'USD',
            variant: 'success'
          }"
        />

        <StatWidget
          title="Conversion Rate"
          :value="0.342"
          :trend="-2.1"
          trend-label="vs last week"
          icon="pi pi-percentage"
          :config="{
            format: 'percentage',
            variant: 'warning'
          }"
        />

        <StatWidget
          title="Data Storage"
          :value="1048576000"
          :trend="15.7"
          trend-label="vs last month"
          icon="pi pi-database"
          :config="{
            format: 'bytes',
            variant: 'info'
          }"
        />
      </div>
    </section>

    <!-- ChartWidget Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        ChartWidget
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Line Chart -->
        <Card>
          <template #title>Sales Trend</template>
          <template #content>
            <ChartWidget
              chart-type="line"
              :data="lineChartData"
              :config="{
                height: '300px',
                showLegend: true
              }"
            />
          </template>
        </Card>

        <!-- Bar Chart -->
        <Card>
          <template #title>Monthly Revenue</template>
          <template #content>
            <ChartWidget
              chart-type="bar"
              :data="barChartData"
              :config="{
                height: '300px',
                showLegend: true
              }"
            />
          </template>
        </Card>

        <!-- Pie Chart -->
        <Card>
          <template #title>Customer Segments</template>
          <template #content>
            <ChartWidget
              chart-type="pie"
              :data="pieChartData"
              :config="{
                height: '300px',
                showLegend: true
              }"
            />
          </template>
        </Card>

        <!-- Doughnut Chart -->
        <Card>
          <template #title>Sales by Category</template>
          <template #content>
            <ChartWidget
              chart-type="doughnut"
              :data="doughnutChartData"
              :config="{
                height: '300px',
                showLegend: true
              }"
            />
          </template>
        </Card>
      </div>
    </section>

    <!-- TableWidget Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        TableWidget
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <Card>
          <template #title>Recent Orders</template>
          <template #content>
            <TableWidget
              :data="ordersData"
              :columns="ordersColumns"
              :config="{
                paginator: true,
                rows: 5,
                striped: true
              }"
            />
          </template>
        </Card>

        <!-- Top Products -->
        <Card>
          <template #title>Top Products</template>
          <template #content>
            <TableWidget
              :data="productsData"
              :columns="productsColumns"
              :config="{
                paginator: false,
                rows: 5,
                striped: true
              }"
            />
          </template>
        </Card>
      </div>
    </section>

    <!-- ListWidget Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        ListWidget
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Activity Feed -->
        <Card>
          <template #title>Recent Activity</template>
          <template #content>
            <ListWidget
              :items="activityData"
              :config="{
                showAvatar: true,
                showTimestamp: true,
                avatarField: 'avatar',
                titleField: 'title',
                subtitleField: 'subtitle',
                timestampField: 'timestamp',
                maxItems: 5
              }"
            />
          </template>
        </Card>

        <!-- Notifications -->
        <Card>
          <template #title>Notifications</template>
          <template #content>
            <ListWidget
              :items="notificationsData"
              :config="{
                showAvatar: false,
                showStatus: true,
                titleField: 'message',
                subtitleField: 'detail',
                statusField: 'status',
                timestampField: 'time',
                maxItems: 6
              }"
            />
          </template>
        </Card>

        <!-- Team Members -->
        <Card>
          <template #title>Team Members</template>
          <template #content>
            <ListWidget
              :items="teamData"
              :config="{
                showAvatar: true,
                avatarField: 'avatar',
                titleField: 'name',
                subtitleField: 'role',
                descriptionField: 'email',
                maxItems: 5
              }"
            />
          </template>
        </Card>
      </div>
    </section>

    <!-- Combined Dashboard Example -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Combined Dashboard Example
      </h2>
      <Card>
        <template #title>Sales Dashboard</template>
        <template #content>
          <div class="dashboard-grid">
            <!-- Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatWidget
                title="Today's Sales"
                :value="8250"
                :trend="5.2"
                icon="pi pi-shopping-cart"
                :config="{ format: 'currency', currency: 'USD', variant: 'primary' }"
              />
              <StatWidget
                title="New Customers"
                :value="42"
                :trend="12.1"
                icon="pi pi-user-plus"
                :config="{ format: 'number', variant: 'success' }"
              />
              <StatWidget
                title="Pending Orders"
                :value="18"
                :trend="-3.5"
                icon="pi pi-clock"
                :config="{ format: 'number', variant: 'warning' }"
              />
              <StatWidget
                title="Satisfaction"
                :value="0.947"
                :trend="2.3"
                icon="pi pi-star"
                :config="{ format: 'percentage', variant: 'info' }"
              />
            </div>

            <!-- Charts Row -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="dashboard-chart-container">
                <h3 class="text-lg font-semibold mb-3">Revenue Trend</h3>
                <ChartWidget
                  chart-type="line"
                  :data="lineChartData"
                  :config="{ height: '250px', showLegend: false }"
                />
              </div>
              <div class="dashboard-chart-container">
                <h3 class="text-lg font-semibold mb-3">Sales by Category</h3>
                <ChartWidget
                  chart-type="doughnut"
                  :data="doughnutChartData"
                  :config="{ height: '250px', showLegend: true }"
                />
              </div>
            </div>

            <!-- Tables and Lists Row -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="dashboard-table-container">
                <h3 class="text-lg font-semibold mb-3">Latest Orders</h3>
                <TableWidget
                  :data="ordersData"
                  :columns="ordersColumns"
                  :config="{ paginator: false, rows: 5, striped: true }"
                />
              </div>
              <div class="dashboard-list-container">
                <h3 class="text-lg font-semibold mb-3">Recent Activity</h3>
                <ListWidget
                  :items="activityData"
                  :config="{
                    showAvatar: true,
                    showTimestamp: true,
                    titleField: 'title',
                    subtitleField: 'subtitle',
                    timestampField: 'timestamp',
                    maxItems: 5
                  }"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import StatWidget from '@/components/widgets/StatWidget.vue'
import ChartWidget from '@/components/widgets/ChartWidget.vue'
import TableWidget from '@/components/widgets/TableWidget.vue'
import ListWidget from '@/components/widgets/ListWidget.vue'

// Chart Data
const lineChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales 2024',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Sales 2023',
      data: [10000, 15000, 13000, 20000, 19000, 24000],
      borderColor: '#94a3b8',
      backgroundColor: 'rgba(148, 163, 184, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
})

const barChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [45000, 52000, 48000, 61000, 55000, 67000],
      backgroundColor: '#10b981'
    }
  ]
})

const pieChartData = ref({
  labels: ['Enterprise', 'Small Business', 'Individual', 'Non-Profit'],
  datasets: [
    {
      data: [42, 28, 22, 8],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    }
  ]
})

const doughnutChartData = ref({
  labels: ['Electronics', 'Furniture', 'Software', 'Services'],
  datasets: [
    {
      data: [35, 25, 25, 15],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
    }
  ]
})

// Table Data
const ordersColumns = ref([
  { field: 'id', header: 'Order #' },
  { field: 'customer', header: 'Customer' },
  { field: 'amount', header: 'Amount' },
  { field: 'status', header: 'Status' }
])

const ordersData = ref([
  { id: '#1234', customer: 'John Doe', amount: '$1,234.56', status: 'Completed' },
  { id: '#1235', customer: 'Jane Smith', amount: '$987.65', status: 'Pending' },
  { id: '#1236', customer: 'Bob Johnson', amount: '$2,345.67', status: 'Processing' },
  { id: '#1237', customer: 'Alice Williams', amount: '$543.21', status: 'Completed' },
  { id: '#1238', customer: 'Charlie Brown', amount: '$1,876.54', status: 'Shipped' }
])

const productsColumns = ref([
  { field: 'name', header: 'Product' },
  { field: 'sales', header: 'Sales' },
  { field: 'revenue', header: 'Revenue' }
])

const productsData = ref([
  { name: 'Premium Widget', sales: 342, revenue: '$45,123' },
  { name: 'Standard Kit', sales: 289, revenue: '$38,567' },
  { name: 'Starter Pack', sales: 256, revenue: '$22,456' },
  { name: 'Professional Suite', sales: 198, revenue: '$51,234' },
  { name: 'Enterprise License', sales: 87, revenue: '$78,901' }
])

// List Data
const activityData = ref([
  {
    avatar: 'JD',
    title: 'John Doe',
    subtitle: 'Created new order #1234',
    timestamp: '2 minutes ago'
  },
  {
    avatar: 'JS',
    title: 'Jane Smith',
    subtitle: 'Updated customer profile',
    timestamp: '15 minutes ago'
  },
  {
    avatar: 'BJ',
    title: 'Bob Johnson',
    subtitle: 'Completed payment for order #1235',
    timestamp: '1 hour ago'
  },
  {
    avatar: 'AW',
    title: 'Alice Williams',
    subtitle: 'Submitted support ticket',
    timestamp: '2 hours ago'
  },
  {
    avatar: 'CB',
    title: 'Charlie Brown',
    subtitle: 'Requested refund for order #1230',
    timestamp: '3 hours ago'
  }
])

const notificationsData = ref([
  {
    message: 'New order received',
    detail: 'Order #1234 from Acme Corp',
    status: 'success',
    time: '5 minutes ago'
  },
  {
    message: 'Payment pending',
    detail: 'Invoice #5678 awaiting payment',
    status: 'warning',
    time: '30 minutes ago'
  },
  {
    message: 'Shipment delayed',
    detail: 'Order #1232 shipment delayed',
    status: 'danger',
    time: '1 hour ago'
  },
  {
    message: 'Customer feedback',
    detail: 'New 5-star review received',
    status: 'info',
    time: '2 hours ago'
  },
  {
    message: 'Inventory low',
    detail: 'Product SKU-123 running low',
    status: 'warning',
    time: '3 hours ago'
  },
  {
    message: 'Report generated',
    detail: 'Monthly sales report ready',
    status: 'success',
    time: '4 hours ago'
  }
])

const teamData = ref([
  {
    avatar: 'JD',
    name: 'John Doe',
    role: 'CEO',
    email: 'john@company.com'
  },
  {
    avatar: 'JS',
    name: 'Jane Smith',
    role: 'CTO',
    email: 'jane@company.com'
  },
  {
    avatar: 'BJ',
    name: 'Bob Johnson',
    role: 'Sales Manager',
    email: 'bob@company.com'
  },
  {
    avatar: 'AW',
    name: 'Alice Williams',
    role: 'Marketing Director',
    email: 'alice@company.com'
  },
  {
    avatar: 'CB',
    name: 'Charlie Brown',
    role: 'Support Lead',
    email: 'charlie@company.com'
  }
])
</script>

<style scoped>
.widgets-showcase {
  @apply max-w-7xl mx-auto p-6;
}

/* Dashboard grid layout */
.dashboard-grid {
  @apply space-y-6;
}

.dashboard-chart-container,
.dashboard-table-container,
.dashboard-list-container {
  @apply bg-gray-50 dark:bg-gray-800 p-4 rounded-lg;
}

/* Custom card styling */
:deep(.p-card) {
  @apply h-full;
}

:deep(.p-card-body) {
  @apply h-full flex flex-col;
}

:deep(.p-card-content) {
  @apply flex-1;
}
</style>
