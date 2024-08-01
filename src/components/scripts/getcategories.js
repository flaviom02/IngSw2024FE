import axios from "axios";
export default {
  getCategories: function () {
    axios.get('/api/categories/getall')
        .then(response => {
          console.log("Categorie ricevute: ", response.data);
          return response.data;
        })
        .catch(error => {
          console.error('Errore nel recupero delle categorie:', error);
        });
  }
}



