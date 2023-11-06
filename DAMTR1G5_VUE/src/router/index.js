// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/pantallaprincipal.vue')   
  },
  {
    path: '/gestiocomandes',
    component: () => import('@/components/gestiocomandes.vue')   
  },
  {
    path: '/gestioproductes',
    component: () => import('@/components/gestioproductes.vue')   
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
