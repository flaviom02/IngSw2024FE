import { createMemoryHistory, createRouter } from 'vue-router'

import EventList from '../components/EventList.vue'
import OrganizerSubscription from '../components/OrganizerSubscription.vue'

const routes = [
  {
    path: '/',
    component: EventList
  },  
  {
    path: '/iscrizione-categorie',
    component: OrganizerSubscription
  }
]

const router = createRouter({
  history: createMemoryHistory(),    
  routes,
  })
  
  export default router
