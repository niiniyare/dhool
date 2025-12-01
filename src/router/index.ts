import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/showcase',
      name: 'showcase',
      component: () => import('@/views/showcase/index.vue')
    }
  ],
})

export default router
