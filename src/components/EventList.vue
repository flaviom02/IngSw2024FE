<template>
  <div class="container">
    <div class="form-aggiungi">
      <h1>Gestione Eventi</h1><br>
      <h2>Aggiungi/Modifica il tuo evento</h2><br>
      <form @submit.prevent="submitHandler()">
        <div class="formElement">
          <label v-if="newEvento.event_id > 0">Modifica evento Id: {{ newEvento.event_id }}</label>
          <label v-else>Inserimento nuovo evento</label>
        </div>
        <!--Dati generali-->
        <fieldset>
        <legend>Dati Generali</legend>
        <div class="formElement">
          <label>Url Immagine</label>
          <input v-model="newEvento.url_img" type="text" placeholder="Immagine" required />
        </div>
        <div class="formElement">
          <label>Nome</label>
          <input v-model="newEvento.nome" type="text" placeholder="Nome" required />
        </div>
        <div class="formElement">
          <label>Descrizione</label>
          <input v-model="newEvento.descrizione" type="text" placeholder="Descrizione" required />
        </div>
        <div class="formElement">
          <label>Data</label>
          <input v-model="newEvento.data" placeholder="Data" type="date" />
        </div>
        <div class="formElement">
          <label>Orario</label>
          <input v-model="newEvento.orario" type="time" placeholder="Orario" required />
        </div>
        <div class="formElement">
          <label>Indirizzo</label>
          <input v-model="newEvento.indirizzo" type="text" placeholder="Indirizzo" required />
        </div>
        <div class="formElement">
          <label>Stato</label>
          <input v-model="newEvento.stato" type="text" placeholder="Stato" required />
        </div>
        </fieldset>
        <fieldset class="categoryList">
          <legend>Selezione Categorie</legend>
          <!-- Selezione delle categorie -->
          <div v-for="category in categories" :key="category.category_id">
            <input type="checkbox" v-model="newEvento.selectedCategories" :value="category.category_id" :checked="newEvento.selectedCategories.includes(category)" />
            <label>{{ category.name }}</label>
          </div>
        </fieldset>
      <fieldset class="ticketInput">
        <legend>Gestione Biglietti</legend>
        <!-- Inserimento dei biglietti -->
        <button @click="addTicket">Aggiungi Biglietto</button><br>
        <div class="ticketElement" v-for="(ticket, index) in newEvento.tickets" :key="index">
          <input v-model="ticket.type" placeholder="Tipo Biglietto" required />
          <input v-model="ticket.price" type="number" placeholder="Prezzo Biglietto" required />
          <button @click="removeTicket(index)">Rimuovi Biglietto</button>
        </div>

        </fieldset>
        <div class="formButtons">
          <button type="submit">Aggiungi/Modifica Evento</button>
          <button type="reset" @click="cancelEdit()">Annulla</button>
        </div>
      </form>
    </div>
    <div>
    <!--Lista con schede degli eventi inseriti-->
    <h1 style="text-align: center; padding-bottom: 20px">Lista eventi inseriti</h1>
    <ul class="event-list" style="display: flex; flex-wrap: wrap;">
      <li class="eventCard" v-for="evento in eventi" :key="evento.event_id" >
          <img :src="evento.url_img" alt="Immagine evento" style="font-size: 0;">
          <div>
            <p class="eventCardTitle eventCardLabel">{{ evento.name }}</p>
          </div>
          <div>
            <p class="eventCardLabel">Descrizione:</p>
            <p>{{ evento.description }}</p>
          </div>
          <div>
            <p class="eventCardLabel">Data:</p>
            <p>{{ getFormattedDate(evento.date) }}</p>
          </div>
          <div>
            <p class="eventCardLabel">Orario:</p>
            <p>{{ evento.time.substring(0, 5) }}</p>
          </div>
          <div>
            <p class="eventCardLabel">Indirizzo:</p>
            <p>{{ evento.address }}</p>
          </div>
          <div>
            <p class="eventCardLabel">Stato:</p>
            <p>{{ evento.status }}</p>
          </div>
          <div>
            <p class="eventCardLabel">Categoria:</p>
            <p><span class="categoryTag" v-for="category in evento.categories" :key="category.category_id">{{ category.name }} </span></p>
          </div>
          <div style="margin-top: 20px;">
            <p class="eventCardLabel">Biglietti:</p>
            <ul class="ticketList">
              <li v-for="ticket in evento.tickets" :key="ticket.ticket_id">{{ ticket.type }} - € {{ ticket.price }}<br> </li>
            </ul>
          </div>
          <div style="text-align: center;">
            <button @click="editEvento(evento)">Modifica</button>
            <button @click="deleteEvento(evento.event_id)">Elimina</button>
          </div>  

      </li>
    </ul>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      eventi: [],
      categories: [],  // Per memorizzare le categorie disponibili
      selectedCategories: [],
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
    };
  },
  methods: {
    clearEvento() {
      this.newEvento = {
        event_id: '',
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
    },
    // Recupera la lista completa degli eventi
    getEventi() {
      axios.get('/api/events')
          .then(response => {
            console.log("Eventi ricevuti: ", response.data);
            this.eventi = response.data;
          })
          .catch(error => {
            console.error('Errore nel recupero degli eventi:', error);
          });
    },
    // Recupera il singolo evento dato l'id e lo salva in newEvento
    getEvento(event_id) {
      axios.get(`/api/events/${event_id}`)
          .then(response => {
            console.log("Evento ricevuto: ", response.data);
            const evento = response.data

            this.newEvento.event_id = evento.event_id;
            this.newEvento.url_img = evento.url_img;
            this.newEvento.nome = evento.name;
            this.newEvento.descrizione = evento.description;
            this.newEvento.data = evento.date;
            this.newEvento.orario = evento.time;
            this.newEvento.indirizzo = evento.address;
            this.newEvento.stato = evento.status;
            // Trasformo l'oggetto categoria ricevuto in un array di id
            this.newEvento.selectedCategories = evento.categories.map(function(item) {
              return item.category_id
            });
            this.newEvento.tickets = evento.tickets; // Passa i bigliett
            this.selectedCategories = evento.categories.category_id;
            
          })
          .catch(error => {
            console.error('Errore nel recupero dell\'evento:', error);
          });
    },
    // Recupera l'elenco delle categorie
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
    // Gestisce la distinzione tra nuovo evento e modifica di evento esistenze
    submitHandler() {
      const id = this.newEvento.event_id;
      console.log(id);
      console.log(this.newEvento)
      //Se l'evento ha un id allora lo aggiorno, senno è nuovo
      if (this.newEvento.event_id) {
        console.log(this.editEvento)
        this.updateEvento(id);
      } else {
        console.log("creo evento");
        this.createEvento();
      }
    },
    // Crea nuovo evento nel backend
    createEvento() {
      console.log('Dati del nuovo evento:', this.newEvento);

      axios.post('/api/events/create', {
        url_img: this.newEvento.url_img,
        name: this.newEvento.nome,
        description: this.newEvento.descrizione,
        date: this.newEvento.data,
        time: this.newEvento.orario.substring(0, 5) + ":00",
        address: this.newEvento.indirizzo,
        status: this.newEvento.stato,
        categories: this.newEvento.selectedCategories, // Passa gli ID delle categorie
        tickets: this.newEvento.tickets // Passa i biglietti
      })
          .then(response => {
            console.log('Evento creato:', response.data);
            window.alert("Evento creato!");
            this.eventi.push(response.data);
            this.clearEvento();
          })
          .catch(error => {
            console.error('Errore nella creazione dell\'evento:', error);
            window.alert("Errore nella creazione dell\'evento");
          });
      this.getEventi();

    },
    editEvento(evento) {
      this.getEvento(evento.event_id);
      window.scrollTo(0,0);
    },
    // Aggiorna un evento esistente nel backend
    updateEvento(id) {
      console.log("Dati dell'evento che sto aggiornando: ", this.newEvento);

      axios.put(`/api/events/${id}`, {
        url_img: this.newEvento.url_img,
        name: this.newEvento.nome,
        description: this.newEvento.descrizione,
        date: this.newEvento.data,
        time: this.newEvento.orario.substring(0, 5) + ":00",
        address: this.newEvento.indirizzo,
        status: this.newEvento.stato,
        categories: this.newEvento.selectedCategories, // Passa gli ID delle categorie
        tickets: this.newEvento.tickets // Passa  i biglietti
      })
          .then(response => {
            console.log('Dati ricevuti: ', response)
            window.alert("Evento aggiornato!");
            const index = this.eventi.findIndex(e => e.event_id === response.data.event_id);
            if (index !== -1) {
              // Usa Vue's reattività per aggiornare l'array
              this.eventi.splice(index, 1, response.data);
            }
            this.clearEvento;
          })
          .catch(error => {
            console.error('Errore nell\'aggiornamento dell\'evento:', error);
            window.alert("Errore nell'aggiornamento dell'evento");
          });
    },
    deleteEvento(id) {
      console.log("Id dell'evento da eliminare: ", id);
      if (window.confirm("Vuoi eliminare questo elemento?")) {
        axios.delete(`/api/events/${id}`)
            .then(() => {
              window.alert('Evento eliminato!')
              this.eventi = this.eventi.filter(e => e.event_id !== id);
            })
            .catch(error => {
              window.alert('Errore nell\'eliminazione dell\'evento:');
              console.error('Errore nell\'eliminazione dell\'evento:', error);
            });
      }
    },
    cancelEdit() {
      this.clearEvento();
    },
    addTicket() {
      this.newEvento.tickets.push({
        type: '',
        price: 0,
      });
    },
    removeTicket(index) {
      this.newEvento.tickets.splice(index, 1);
    },
    getFormattedDate(date) {
      return moment(date).format("MM/DD/YYYY")
    },
  },
  created() {
    this.getEventi();
    this.getCategories(); // Carica le categorie all'avvio
  }
  };
</script>