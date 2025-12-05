<template>
  <div class="auth-layout">
    <!-- Background Pattern -->
    <div class="auth-background">
      <div class="auth-pattern"></div>
    </div>

    <!-- Main Content -->
    <div class="auth-content">
      <!-- Left Panel - Branding -->
      <div class="auth-branding">
        <div class="brand-content">
          <div class="brand-header">
            <img src="/logo.svg" alt="Dhool ERP" class="brand-logo" />
            <h1 class="brand-title">Dhool ERP</h1>
          </div>
          
          <div class="brand-description">
            <h2 class="welcome-title">Welcome to Dhool</h2>
            <p class="welcome-text">
              A comprehensive ERP solution designed to streamline your business operations 
              with intelligent automation and powerful analytics.
            </p>
          </div>

          <div class="feature-highlights">
            <div class="feature-item">
              <i class="pi pi-check-circle" />
              <span>Complete Business Management</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle" />
              <span>Real-time Analytics</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle" />
              <span>Secure & Scalable</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Auth Form -->
      <div class="auth-form-panel">
        <div class="auth-form-container">
          <!-- Theme Toggle -->
          <div class="auth-theme-toggle">
            <Button
              :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
              severity="secondary"
              text
              rounded
              @click="toggleTheme"
              v-tooltip.left="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            />
          </div>

          <!-- Form Content Slot -->
          <div class="auth-form-content">
            <slot />
          </div>

          <!-- Footer -->
          <div class="auth-footer">
            <div class="footer-links">
              <a href="/privacy" class="footer-link">Privacy Policy</a>
              <span class="footer-separator">•</span>
              <a href="/terms" class="footer-link">Terms of Service</a>
              <span class="footer-separator">•</span>
              <a href="/support" class="footer-link">Support</a>
            </div>
            <div class="footer-copyright">
              © {{ currentYear }} Dhool ERP. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="auth-loading-overlay">
      <div class="auth-loading-content">
        <ProgressSpinner />
        <span class="loading-text">{{ loadingMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props
interface Props {
  isLoading?: boolean
  loadingMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  loadingMessage: 'Please wait...'
})

// State
const isDark = ref(false)

// Computed
const currentYear = computed(() => new Date().getFullYear())

// Methods
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  
  // Save theme preference
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Lifecycle
onMounted(() => {
  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = savedTheme ? savedTheme === 'dark' : systemDark
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<style scoped>
.auth-layout {
  @apply min-h-screen relative overflow-hidden;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
}

.dark .auth-layout {
  background: linear-gradient(135deg, var(--surface-900) 0%, var(--surface-950) 100%);
}

.auth-background {
  @apply absolute inset-0 z-0;
}

.auth-pattern {
  @apply w-full h-full opacity-10;
  background-image: 
    radial-gradient(circle at 20% 20%, var(--primary-400) 1px, transparent 1px),
    radial-gradient(circle at 80% 80%, var(--primary-400) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
}

.auth-content {
  @apply relative z-10 min-h-screen flex;
}

.auth-branding {
  @apply hidden lg:flex lg:w-1/2 items-center justify-center p-12;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
}

.dark .auth-branding {
  background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%);
}

.brand-content {
  @apply max-w-lg text-white;
}

.brand-header {
  @apply flex items-center gap-4 mb-8;
}

.brand-logo {
  @apply w-12 h-12;
  filter: brightness(0) invert(1);
}

.brand-title {
  @apply text-3xl font-bold;
}

.brand-description {
  @apply mb-12;
}

.welcome-title {
  @apply text-2xl font-semibold mb-4;
}

.welcome-text {
  @apply text-lg leading-relaxed opacity-90;
}

.feature-highlights {
  @apply space-y-4;
}

.feature-item {
  @apply flex items-center gap-3 text-lg;
}

.feature-item i {
  @apply text-primary-200;
}

.auth-form-panel {
  @apply w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12;
  background: var(--surface-0);
}

.dark .auth-form-panel {
  background: var(--surface-900);
}

.auth-form-container {
  @apply w-full max-w-md relative;
}

.auth-theme-toggle {
  @apply absolute top-0 right-0 -mt-2;
}

.auth-form-content {
  @apply mb-8;
}

.auth-footer {
  @apply text-center space-y-4;
}

.footer-links {
  @apply flex items-center justify-center gap-2 text-sm text-surface-600 dark:text-surface-400;
}

.footer-link {
  @apply hover:text-primary-600 dark:hover:text-primary-400 transition-colors;
  text-decoration: none;
}

.footer-separator {
  @apply mx-1;
}

.footer-copyright {
  @apply text-xs text-surface-500 dark:text-surface-500;
}

.auth-loading-overlay {
  @apply absolute inset-0 z-50 flex items-center justify-center;
  background: rgba(255, 255, 255, 0.9);
}

.dark .auth-loading-overlay {
  background: rgba(0, 0, 0, 0.9);
}

.auth-loading-content {
  @apply flex flex-col items-center gap-4 text-center;
}

.loading-text {
  @apply text-surface-700 dark:text-surface-300;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .auth-content {
    @apply flex-col;
  }
  
  .auth-branding {
    @apply flex w-full py-8 px-6;
  }
  
  .brand-content {
    @apply text-center;
  }
  
  .brand-header {
    @apply justify-center;
  }
  
  .welcome-title {
    @apply text-xl;
  }
  
  .welcome-text {
    @apply text-base;
  }
  
  .feature-highlights {
    @apply hidden;
  }
}

@media (max-width: 640px) {
  .auth-form-panel {
    @apply p-6;
  }
  
  .auth-branding {
    @apply py-6 px-4;
  }
  
  .brand-title {
    @apply text-2xl;
  }
  
  .welcome-title {
    @apply text-lg mb-3;
  }
  
  .welcome-text {
    @apply text-sm;
  }
}

/* Animation for smooth transitions */
.auth-layout * {
  transition: color 0.3s, background-color 0.3s, border-color 0.3s;
}

/* Focus styles for accessibility */
.footer-link:focus {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 rounded;
}
</style>