import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/vote',
    name: 'vote',
    component: () => import('@/views/Vote.vue')
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/views/FAQ.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('@/views/Create.vue')
  },
  {
    path: '/',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
