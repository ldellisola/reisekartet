import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@pages/Home.vue'
import Destination from '@/pages/Destination.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/destination/:id?',
      name: 'destination',
      component: Destination
    }
  ]
})

export default router
