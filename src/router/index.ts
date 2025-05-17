import { createRouter, createWebHistory } from 'vue-router'
import JokesView from '../views/JokesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: JokesView,
    },
  ],
})

export default router
