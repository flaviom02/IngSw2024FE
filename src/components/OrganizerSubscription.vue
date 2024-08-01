<template>
    <div class="container">
        <div class="form-aggiungi">
            <h1>Iscrizione a categorie organizzatori</h1>
            <h2>Fai l'organizzatore di professione? <br> Iscriviti alla categoria a cui appartieni</h2>
            <form @submit.prevent="submitHandler()">
                <fieldset>
                    <legend>Email</legend>
                    <div class="formElement">
                        <input v-model="newOrganizer.email" placeholder="Email" type="email" :disabled="newOrganizer.organizer_id > 0"/>
                    </div>
                </fieldset>
                <fieldset class="categoryList">
                    <legend>Selezione Categorie</legend>

                    <div v-for="categories in categories" :key="categories.category_id">
                        <input type="checkbox" v-model="newOrganizer.categories" :value="categories.category_id" />
                        <p><span class="categoryLabel">{{ categories.name }}</span></p>
                    </div>
                </fieldset>
                <div class="formButtons">
                    <button type="submit">Conferma</button>
                    <button type="reset" @click="clearSubscription">Annulla</button>
                </div>
            </form>
        </div>
        <div>
            <h1>Lista iscrizioni</h1>
            <table width="100%">
                <thead style="text-align: left;">
                    <tr>
                        <th style="width: 40%;">Email</th>
                        <th style="width: 45%;">Categorie</th>
                        <th style="width: 15%; text-align: center;">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="organizer in organizers" :key="organizer.organizer_id">
                        <td>{{ organizer.email }}</td>
                        <td>
                            <span class="categoryTag" v-for="category in organizer.categories" :key="category.category_id">{{ category.name }}</span>
                        </td>
                        <td class="actionButtons" style="display:flex; justify-content: center;">
                            <button @click="editOrganizer(organizer.organizer_id)">Modifica</button>
                            <button @click="deleteOrganizer(organizer.organizer_id)">Elimina</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            categories: [],
            organizers: [],
            newOrganizer: {
                email: '',
                categories: []
            },
        }
    },
    methods: {
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
            const id = this.newOrganizer.organizer_id;
            console.log(id);
            console.log(this.newOrganizer)
            if (this.newOrganizer.organizer_id) {
                console.log(this.newOrganizer)
                this.updateOrganizer(id);
            } else {
                console.log("creo nuova iscrizione");
                this.createIscrizione();
            }
        },
        createIscrizione() {
            console.log('Categorie selezionate per l\'iscrizione:', this.category);

            axios.post('/api/organizers/create', {
                email: this.newOrganizer.email,
                categories: this.newOrganizer.categories
            })
                .then(response => {
                    console.log('Iscrizione completata:', response.data);
                    window.alert("Iscrizione completata!");
                    this.organizers.push(response.data);
                    this.clearSubscription(); // Pulisci le selezioni
                })
                .catch(error => {
                    console.error('Errore nell\'iscrizione:', error);
                    window.alert("Errore nell'iscrizione.");
                });
        },
        deleteOrganizer(id) {
            console.log("Organizzatore da eliminare: ", id)
            if (window.confirm("Vuoi eliminare questo elemento?")) {
                axios.delete(`api/organizers/${id}`)
                    .then(() => {
                        window.alert('Iscrizione eliminata!')
                        this.organizers = this.organizers.filter(e => e.organizer_id !== id);
                    })
                    .catch(error => {
                        window.alert('Errore nell\'eliminaizone dell\'iscrizione')
                        console.error('Errore nell\'eliminazione dell\'organizzatore:', error);
                    });
            }
        },
        clearSubscription() {
            this.newOrganizer = {
                organizer_id: '',
                email: '',
                categories: [], // Pulisci le categorie selezionate
            }
        },
        getOrganizers() {
            axios.get('/api/organizers')
                .then(response => {
                    console.log("Organizers ricevuti: ", response.data);
                    this.organizers = response.data;
                })
                .catch(error => {
                    console.error('Errore nel recupero degli organizzatori:', error);
                });
        },
        getOrganizer(id) {
            axios.get(`/api/organizers/${id}`)
                .then(response => {
                    console.log("Organizers ricevuti: ", response.data);
                    const organizer = response.data;
                    this.newOrganizer.organizer_id = organizer.organizer_id;
                    this.newOrganizer.email = organizer.email;
                    this.newOrganizer.categories = organizer.categories.map(function (item) {
                        return item.category_id
                    });
                })
                .catch(error => {
                    console.error('Errore nel recupero delle iscrizioni:', error);
                });
        },
        editOrganizer(id) {
            this.getOrganizer(id);
            window.scrollTo(0,0);
        },
        updateOrganizer(id) {
            axios.put(`/api/organizers/${id}`, {
                email: this.newOrganizer.email,
                categories: this.newOrganizer.categories
            })
                .then(response => {
                    console.log('Modifica dell\'iscrizione completata:', response.data);
                    window.alert("Modifica dell'iscrizione completata!");
                    // Aggiorno la lista degli iscritti
                    const index = this.organizers.findIndex(e => e.organizer_id === response.data.organizer_id);
                    if (index !== -1) {
                        this.organizers.splice(index, 1, response.data);
                    }
                    this.clearSubscription(); // Pulisci il form
                    
                })
                .catch(error => {
                    console.error('Errore nella modifica dell\'iscrizione:', error);
                    window.alert("Errore nella modifica dell'iscrizione.");
                });
        }
    },
    created() {
        this.getCategories(); // Carica le categorie all'avvio
        this.getOrganizers(); // Carica la lista delle iscrizioni
    }
}
</script>
<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        background-color: #007BFF;
        color: #f2f2f2;
    }

    th, td {
        padding: 1%;
    }

    tbody tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tbody tr:nth-child(odd) {
        background-color: white;
    }

    .actionButtons button {
        margin-left: 5px;
        padding: 5px 10px;
        color: white;
        border: none;
        cursor: pointer;
        
        box-sizing: border-box;
    }
</style>