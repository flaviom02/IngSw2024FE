// src/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api', // URL del backend Spring Boot
    withCredentials: true // Se vuoi inviare cookie insieme alle richieste
});

export default instance;
