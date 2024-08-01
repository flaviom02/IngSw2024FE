import { createRouter, createWebHistory } from 'vue-router'

import EventList from '../components/EventList.vue'
import OrganizerSubscription from '../components/OrganizerSubscription.vue'

const routes = [
  {
    path: '/',
    name: '/',
    component: EventList
  },  
  {
    path: '/iscrizione-categorie',
    name: 'iscrizione-categorie',
    component: OrganizerSubscription
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
  
  export default router
