<template>
  <div>
    <h1>Event List</h1>
    <form @submit.prevent="addEvent">
      <input v-model="newEvent.name" placeholder="Event Name" required>
      <input v-model="newEvent.location" placeholder="Event Location" required>
      <input v-model="newEvent.date" placeholder="Event Date" required>
      <button type="submit">Add Event</button>
    </form>
    <ul>
      <li v-for="event in events" :key="event.id">
        {{ event.name }} - {{ event.location }} - {{ event.date }}
        <button @click="deleteEvent(event.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: [],
      newEvent: {
        name: '',
        location: '',
        date: ''
      }
    }
  },
  created() {
    this.fetchEvents();
  },
  methods: {
    fetchEvents() {
      axios.get('/api/events')
          .then(response => {
            this.events = response.data;
          });
    },
    addEvent() {
      axios.post('/api/events', this.newEvent)
          .then(response => {
            this.events.push(response.data);
            this.newEvent = { name: '', location: '', date: '' };
          });
    },
    deleteEvent(id) {
      axios.delete(`/api/events/${id}`)
          .then(() => {
            this.events = this.events.filter(event => event.id !== id);
          });
    }
  }
}
</script>
