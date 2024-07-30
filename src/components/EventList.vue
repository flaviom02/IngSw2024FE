<template>
  <div class="container">
    <div class="form-aggiungi">
      <h1>Gestione Eventi</h1><br>
      <h2>Aggiungi/Modifica il tuo evento</h2><br>
      <form @submit.prevent="submitHandler()">
        <div class="formElement">
          <label v-if="newEvento.event_id > 0">Id Evento: {{ newEvento.event_id }}</label>
        </div>
        <fieldset>
        <legend>Dati Generali</legend>
        <div class="formElement">
          <label>Immagine</label>
          <input v-model="newEvento.url_img" type="text" placeholder="Immagine:" required />
        </div>
        <div class="formElement">
          <label>Nome</label>
          <input v-model="newEvento.nome" type="text" placeholder="Nome:" required />
        </div>
        <div class="formElement">
          <label>Descrizione</label>
          <input v-model="newEvento.descrizione" type="text" placeholder="Descrizione:" required />
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
            <input type="checkbox" v-model="newEvento.selectedCategories" :value="category.category_id" />
            <label>{{ category.name }}</label>
          </div>
        </fieldset>
      <fieldset>
        <legend>Gestione Biglietti</legend>
        <!-- Inserimento dei biglietti -->
        <button @click="addTicket">Aggiungi Biglietto</button><br>
        <div v-for="(ticket, index) in newEvento.tickets" :key="index">
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
    <!--
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

        <!-- Selezione delle categorie --><!--
        <select v-model="editingEvento.selectedCategories" multiple>
          <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
            {{ category.name }}
          </option>
        </select><br>

        <!-- Inserimento dei biglietti --><!--
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
    -->
    
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
      this.editingEvento = {
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
    getEvento(event_id) {
      axios.get(`/api/events/${event_id}`)
        .then(response => {
          console.log("Evento ricevuto: ", response.data);
          const evento = response.data
          
          this.newEvento.event_id = evento.event_id
          this.newEvento.url_img = evento.url_img;
          this.newEvento.nome = evento.name;  
          this.newEvento.descrizione = evento.description;
          this.newEvento.data = evento.date;
          this.newEvento.orario = evento.time;
          this.newEvento.indirizzo = evento.address;
          this.newEvento.stato = evento.status;
          this.newEvento.selectedCategorie = evento.categories; // Passa gli ID delle categori
          this.newEvento.tickets = evento.tickets; // Passa i bigliett

        })
        .catch(error => {
          console.error('Errore nel recupero dell\'evento:', error);
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
    submitHandler() {
      const id = this.newEvento.event_id;
      console.log(id);
      console.log(this.newEvento)
      if (this.newEvento.event_id) {
        console.log(this.editEvento)
        this.updateEvento(id);
      } else {
        console.log("creo evento");
        this.createEvento();
      }
    },
    createEvento() {
      console.log('Dati del nuovo evento:', this.newEvento);
      
      axios.post('/api/events/create', {
        url_img: this.newEvento.url_img,
        name: this.newEvento.nome,
        description: this.newEvento.descrizione,
        date: this.newEvento.data,
        time: this.newEvento.orario.substring(0,5) + ":00",
        address: this.newEvento.indirizzo,
        status: this.newEvento.stato,
        categories: this.newEvento.selectedCategories, // Passa gli ID delle categorie
        tickets: this.newEvento.tickets // Passa i biglietti
      })
          .then(response => {
            console.log('Evento creato:', response.data);
            window.alert("Evento creato");
            this.eventi.push(response.data);
            /*this.newEvento = {
              url_img: '',
              nome: '',
              descrizione: '',
              data: '',
              indirizzo: '',
              stato: '',
              orario: '',
              selectedCategories: [],
              tickets: [{type: '', price: ''}]
            };*/
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
    },
    updateEvento(id) {
      console.log("Dati dell'evento che sto aggiornando: ", this.newEvento);

      axios.put(`/api/events/${id}`, {
        url_img: this.newEvento.url_img,
        name: this.newEvento.nome,
        description: this.newEvento.descrizione,
        date: this.newEvento.data,
        time: this.newEvento.orario.substring(0,5) + ":00",
        address: this.newEvento.indirizzo,
        status: this.newEvento.stato,
        categories: this.newEvento.selectedCategories, // Passa gli ID delle categorie
        tickets: this.newEvento.tickets // Passa  i biglietti
      })
          .then(response => {
            console.log('Dati ricevuti: ', response)
            window.alert("Evento aggiornato");
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
      axios.delete(`/api/events/${id}`)
          .then(() => {
            this.eventi = this.eventi.filter(e => e.event_id !== id);
          })
          .catch(error => {
            console.error('Errore nell\'eliminazione dell\'evento:', error);
          });
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
    /*addNewTicket() {
      this.newEvento.tickets.push({
        type: '',
        price: 0,
      });
    },
    removeNewTicket(index) {
      this.newEvento.tickets.splice(index, 1);
    }*/
  },
  created() {
    this.getEventi();
    this.getCategories(); // Carica le categorie all'avvio
  }
};
</script>
<style>
  .formElement {
    display: flex;
    justify-content: space-between;
  }
  .formElement input {
    width: 70%;
  }

  .formButtons button {
    margin: 10px 3px;
  }

  .categoryList {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 10px;
  }

  .categoryList div {
    display: flex;
    align-items: center;
  }

  .categoryList input[type="checkbox"] {
    margin-right: 5px;
  }
</style>