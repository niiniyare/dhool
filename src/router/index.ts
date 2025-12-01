import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/showcase'
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: () => import('@/views/showcase/index.vue')
    },
    {
      path: '/demo/access',
      name: 'demo-access',
      component: () => import('@/views/demo/access.vue')
    }
  ],
})

export default router
