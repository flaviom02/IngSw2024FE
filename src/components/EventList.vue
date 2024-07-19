// src/components/EventList.vue

<script>
import axios from 'axios'; // Importa l'istanza configurata di Axios

export default {
  data() {
    return {
      eventi: [],
      newEvento: {
        nome: '',
        descrizione: '',
        data: ''
      },
      editingEvento: null
    };
  },
  methods: {
    getEventi() {
      axios.get('/api/events')
          .then(response => {
            this.eventi = response.data;
          })
          .catch(error => {
            console.error('Errore nel recupero degli eventi:', error);
          });
    },
    createEvento() {
      console.log('Dati del nuovo evento:', this.newEvento);

      axios.post('/api/events', this.newEvento)
          .then(response => {
            console.log('Evento creato:', response.data);
            this.eventi.push(response.data);
            this.newEvento = { nome: '', descrizione: '', data: '' };
          })
          .catch(error => {
            console.error('Errore nella creazione dell\'evento:', error);
          });
    },
    editEvento(evento) {
      this.editingEvento = { ...evento };
    },
    updateEvento() {
      axios.put(`/api/events/${this.editingEvento.id}`, this.editingEvento)
          .then(response => {
            const index = this.eventi.findIndex(e => e.id === response.data.id);
            this.$set(this.eventi, index, response.data);
            this.editingEvento = null;
          })
          .catch(error => {
            console.error('Errore nell\'aggiornamento dell\'evento:', error);
          });
    },
    deleteEvento(id) {
      axios.delete(`/api/events/${id}`)
          .then(() => {
            this.eventi = this.eventi.filter(e => e.id !== id);
          })
          .catch(error => {
            console.error('Errore nell\'eliminazione dell\'evento:', error);
          });
    },
    cancelEdit() {
      this.editingEvento = null;
    }
  },
  created() {
    this.getEventi();
  }
};
</script>

<template>
  <div>
    <h1>Gestione Eventi</h1>
    <form @submit.prevent="createEvento">
      <input v-model="newEvento.nome" placeholder="Nome" required />
      <input v-model="newEvento.descrizione" placeholder="Descrizione" required />
      <input v-model="newEvento.data" placeholder="Data" required />
      <button type="submit">Aggiungi Evento</button>
    </form>

    <ul>
      <li v-for="evento in eventi" :key="evento.id">
        {{ evento.nome }} - {{ evento.descrizione }} - {{ evento.data }}
        <button @click="editEvento(evento)">Modifica</button>
        <button @click="deleteEvento(evento.id)">Elimina</button>
      </li>
    </ul>

    <div v-if="editingEvento">
      <h2>Modifica Evento</h2>
      <form @submit.prevent="updateEvento">
        <input v-model="editingEvento.nome" placeholder="Nome" required />
        <input v-model="editingEvento.descrizione" placeholder="Descrizione" required />
        <input v-model="editingEvento.data" placeholder="Data" required />
        <button type="submit">Salva Modifiche</button>
        <button @click="cancelEdit">Annulla</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Aggiungi eventuali stili personalizzati qui */
</style>