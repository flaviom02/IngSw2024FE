// src/components/EventList.vue

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
      <li v-for="evento in eventi" :key="evento.event_id">
        Nome Evento: {{ evento.name }} |Descrizione: {{ evento.description }} |Data: {{ evento.date }}
        <button @click="editEvento(evento)">Modifica</button>
        <button @click="deleteEvento(evento.event_id)">Elimina</button>
      </li>
    </ul>

    <div v-if="editingEvento">
      <h2>Modifica Evento</h2>
      <form @submit.prevent="updateEvento">
        <input v-model="editingEvento.name" placeholder="Nome" required />
        <input v-model="editingEvento.description" placeholder="Descrizione" required />
        <input v-model="editingEvento.date" placeholder="Data" required />
        <button type="submit">Salva Modifiche</button>
        <button @click="cancelEdit">Annulla</button>
      </form>
    </div>
  </div>
</template>
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
            console.log("eventi ricevuti: ", response.data);
            this.eventi = response.data;
            console.log("valore dell'Array eventi:", this.eventi);
          })
          .catch(error => {
            console.error('Errore nel recupero degli eventi:', error);
          });
    },
    createEvento() {
      console.log('Dati del nuovo evento:', this.newEvento);

      axios.post('/api/events',{
        name: this.newEvento.nome,
        description: this.newEvento.descrizione,
        date: this.newEvento.data
      })
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
      console.log("Dati dell'evento che sto aggiornando: ",this.editingEvento, this.editingEvento.name)

      axios.put(`/api/events/${this.editingEvento.event_id}`, {
        name: this.editingEvento.name,
        description: this.editingEvento.description,
        date: this.editingEvento.date
      } )
          .then(response => {
            const index = this.eventi.findIndex(e => e.event_id === response.data.event_id);
            this.$set(this.eventi, index, response.data);
            this.editingEvento = null;
          })
          .catch(error => {
            console.error('Errore nell\'aggiornamento dell\'evento:', error);
          });
    },

    deleteEvento(id) {
      console.log("Id dell'evento da eliminare : ",id)
      axios.delete(`/api/events/${id}`)
          .then(() => {
            this.eventi = this.eventi.filter(e => e.id !== id);
          })
          .catch(error => {
            console.error('Errore nell\'eliminazione dell\'evento:', error);
          });
          this.getEventi();
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


<style scoped>
/* Aggiungi eventuali stili personalizzati qui */
</style>