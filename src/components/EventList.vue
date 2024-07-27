<template>
  <div class="container">
    <div class="form-aggiungi">
      <h1>Gestione Eventi</h1><br>
      <h2>Aggiungi il tuo nuovo evento</h2><br>
      <form @submit.prevent="createEvento">
        <input v-model="newEvento.url_img" placeholder="Immagine" required /><br>
        <input v-model="newEvento.nome" placeholder="Nome" required /><br>
        <input v-model="newEvento.descrizione" placeholder="Descrizione" required /><br>
        <input v-model="newEvento.data" placeholder="Data" type="date" /><br>
        <input v-model="newEvento.indirizzo" placeholder="Indirizzo" required /><br>
        <input v-model="newEvento.stato" placeholder="Stato" required /><br>
        <input v-model="newEvento.orario" placeholder="Orario" required /><br>

        <!-- Selezione delle categorie -->
        <select v-model="newEvento.selectedCategories" multiple>
          <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
            {{ category.name }}
          </option>
        </select><br>

        <!-- Inserimento dei biglietti -->
        <div v-for="(ticket, index) in newEvento.tickets" :key="index">
          <input v-model="ticket.type" placeholder="Tipo Biglietto" required />
          <input v-model="ticket.price" type="number" placeholder="Prezzo Biglietto" required />
          <button @click="removeTicket(index)">Rimuovi Biglietto</button>
        </div>
        <button @click="addNewTicket">Aggiungi Biglietto</button><br>

        <button type="submit">Aggiungi Evento</button><br><br>
      </form>
    </div>

    <h1 style="text-align: center; padding-bottom: 20px">Lista eventi inseriti</h1>
    <ul style="display: flex; flex-wrap: wrap;">
      <li v-for="evento in eventi" :key="evento.event_id" style="padding-right: 30px; list-style-type: none; border: 1px solid #ccc; padding: 10px; margin: 10px;">
        <img :src="evento.url_img" alt="Immagine evento"><br>
        Nome Evento: {{ evento.name }} <br> Descrizione: {{ evento.description }}
        <br> Data: {{ evento.date }} <br> Indirizzo: {{ evento.address }}
        <br> Stato: {{ evento.status }} <br> Orario: {{ evento.time }} <br>
        Categoria: <span v-for="category in evento.categories" :key="category.category_id">{{ category.name }} </span><br>
        Biglietti: <span v-for="ticket in evento.tickets" :key="ticket.ticket_id">{{ ticket.type }} - {{ ticket.price }} </span><br>
        <button @click="editEvento(evento)">Modifica</button>
        <button @click="deleteEvento(evento.event_id)">Elimina</button>
      </li>
    </ul>

    <div v-if="editingEvento">
      <h2>Modifica Evento</h2>
      <form @submit.prevent="updateEvento(editingEvento.event_id)">
        <input v-model="editingEvento.url_img" placeholder="Immagine" required/><br>
        <input v-model="editingEvento.name" placeholder="Nome" required/><br>
        <input v-model="editingEvento.description" placeholder="Descrizione" required/><br>
        <input v-model="editingEvento.date" placeholder="Data" type="date" required/><br>
        <input v-model="editingEvento.address" placeholder="Indirizzo" required/><br>
        <input v-model="editingEvento.status" placeholder="Stato" required/><br>
        <input v-model="editingEvento.time" placeholder="Orario" required/><br>

        <!-- Selezione delle categorie -->
        <select v-model="editingEvento.selectedCategories" multiple>
          <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
            {{ category.name }}
          </option>
        </select><br>

        <!-- Inserimento dei biglietti -->
        <div v-for="(ticket, index) in editingEvento.tickets" :key="index">
          <input v-model="ticket.type" placeholder="Tipo Biglietto" required/>
          <input v-model="ticket.price" type="number" placeholder="Prezzo Biglietto" required/>
          <button @click="removeTicket(index)">Rimuovi Biglietto</button>
        </div>
        <button @click="addTicket">Aggiungi Biglietto</button>
        <br>

        <button type="submit">Salva Modifiche</button>
        <button @click="cancelEdit">Annulla</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      eventi: [],
      categories: [],  // Per memorizzare le categorie disponibili
      newEvento: {
        url_img: '',
        nome: '',
        descrizione: '',
        data: '',
        indirizzo: '',
        stato: '',
        orario: '',
        selectedCategories: [], // ID delle categorie selezionate
        tickets: [{type: '', price: ''}]
      },
      editingEvento: null,
    };
  },
  methods: {
    getEventi() {
      axios.get('/api/events')  //Viene dato un errore per via dell'url di un immagine che ho preso da google, togliento il passaggio per google dovrebbe risolversi
          .then(response => {
            console.log("Eventi ricevuti: ", response.data);
            this.eventi = response.data;
          })
          .catch(error => {
            console.error('Errore nel recupero degli eventi:', error);
          });
    },
    getCategories() {
      axios.get('/api/categories/getall')
          .then(response => {
            console.log("Categorie ricevute: ", response.data);
            this.categories = response.data;
          })
          .catch(error => {
            console.error('Errore nel recupero delle categorie:', error);
          });
    },
    createEvento() {
      console.log('Dati del nuovo evento:', this.newEvento);

      axios.post('/api/events', {
        url_img: this.newEvento.url_img,
        name: this.newEvento.nome,
        description: this.newEvento.descrizione,
        date: this.newEvento.data,
        time: this.newEvento.orario,
        address: this.newEvento.indirizzo,
        status: this.newEvento.stato,
        categories: this.newEvento.selectedCategories, // Passa gli ID delle categorie
        tickets: this.newEvento.tickets // Passa i biglietti
      })
          .then(response => {
            console.log('Evento creato:', response.data);
            this.eventi.push(response.data);
            this.newEvento = {
              url_img: '',
              nome: '',
              descrizione: '',
              data: '',
              indirizzo: '',
              stato: '',
              orario: '',
              selectedCategories: [],
              tickets: [{type: '', price: ''}]
            };
          })
          .catch(error => {
            console.error('Errore nella creazione dell\'evento:', error);
          });
      this.getEventi();

    },
    editEvento(evento) {
      this.editingEvento = {...evento};
    },
    updateEvento(id) {
      console.log("Dati dell'evento che sto aggiornando: ", this.editingEvento);

      axios.put(`/api/events/${id}`, {
        url_img: this.editingEvento.url_img,
        name: this.editingEvento.name,
        description: this.editingEvento.description,
        date: this.editingEvento.date,
        time: this.editingEvento.time,
        address: this.editingEvento.address,
        status: this.editingEvento.status,
        categories: this.editingEvento.selectedCategories, // Passa gli ID delle categorie
        tickets: this.editingEvento.tickets // Passa i biglietti
      })
          .then(response => {
            console.log('Dati ricevuti: ', response)
            const index = this.eventi.findIndex(e => e.event_id === response.data.event_id);
            if (index !== -1) {
              // Usa Vue's reattività per aggiornare l'array
              this.eventi.splice(index, 1, response.data);
            }
            this.editingEvento = null;
          })
          .catch(error => {
            console.error('Errore nell\'aggiornamento dell\'evento:', error);
          });
    },
    deleteEvento(id) {
      console.log("Id dell'evento da eliminare: ", id);
      axios.delete(`/api/events/${id}`)
          .then(() => {
            this.eventi = this.eventi.filter(e => e.event_id !== id);
          })
          .catch(error => {
            console.error('Errore nell\'eliminazione dell\'evento:', error);
          });
    },
    cancelEdit() {
      this.editingEvento = null;
    },
    addTicket() {
      this.editingEvento.tickets.push({
        type: '',
        price: 0,
      });
    },
    removeTicket(index) {
      this.editingEvento.tickets.splice(index, 1);
    },
    addNewTicket() {
      this.newEvento.tickets.push({
        type: '',
        price: 0,
      });
    },
    removeNewTicket(index) {
      this.newEvento.tickets.splice(index, 1);
    }
  },
  created() {
    this.getEventi();
    this.getCategories(); // Carica le categorie all'avvio
  }
};
</script>
