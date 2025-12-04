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
    },
    {
      path: '/demo/schemas',
      name: 'demo-schemas',
      component: () => import('@/views/demo/schemas.vue')
    },
    {
      path: '/showcase/molecules',
      name: 'showcase-molecules',
      component: () => import('@/views/showcase/molecules.vue')
    },
    {
      path: '/showcase/organisms',
      name: 'showcase-organisms',
      component: () => import('@/views/showcase/organisms.vue')
    }
  ],
})

export default router
