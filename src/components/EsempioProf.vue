<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

/* Inseriamo in una variabile reattiva chiamata data */
const dataDB = ref(0);
const dataREST = ref(0);


/* Recupero da DB - Inseriamo nella variabile data il risultato della chiamata al backend */
axios.get("/api/testMysql").then(response => {
 console.log(response.data)
 dataDB.value = response.data
 })
 class MyTable{
  "id": number;
  "description": string;
 }


/* Chiamata a REST - Inseriamo nella variabile data il risultato della chiamata al backend */
axios.get("/api/callREST").then(response => {
 console.log(response.data)
 dataREST.value = response.data
 })
 class MyREST{
  "id": number;
  "description": string;
 }

</script>

<template>
  <div>
    <table class="backendTable">
      <th span="2">Recupero dati da DB</th>
      <tr v-for="items in dataDB" >
        <td>{{ items.id }}</td>
        <td>{{ items.description }}</td>
      </tr>
    </table>
  </div>
  <div class="backendTable">
    <table>
      <th span="2">Recupero dati da REST</th>
      <tr v-for="items in dataREST" >
        <td>{{ items.id }}</td>
        <td>{{ items.description }}</td>
      </tr>
    </table>
  </div>
</template>


