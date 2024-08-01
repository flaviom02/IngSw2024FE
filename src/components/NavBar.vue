<template>
    <header class="navbar">
        <h1>Gestione Eventi</h1>
        <nav class="navbar-buttons">
            <router-link to="/">Gestione Eventi</router-link>
            <router-link to="/iscrizione-categorie">Iscrizione a categorie organizzatore</router-link>
    </nav>
    </header>
</template>

<style>

.navbar {

    width: 100%;
    height: 60px;
    margin: 0;
    
    background-color: #0058b6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    
}

.navbar h1 {
    color: #f0f0f0;
    display: flex;
    align-items: stretch;
    width: fit-content;
    margin-left: 2%;
    font-size: 20px;
    font-weight: bold;
}

.navbar nav {
    display: flex;
    align-items: stretch;
    padding-right: 2%;
}


.navbar a{
    color: #f0f0f0;;
    display: block;
    float: right;
    text-align: center;
    padding: 15px;
    margin: 0;
    text-decoration: none;
}

.navbar a:visited {
    color: #f0f0f0;;
}

.navbar a:hover {
    background-color: #aaaaaa;
    border-bottom: 4px solid #aaaaaa;  
}

.navbar-buttons {
    display: flex;
    justify-content: space-between;
    width: max-content;
    align-items: right;
}

.navbar-buttons li {
    display: inline-block;
    width: fit-content;
    margin-right: 20%;
}

.router-link-active {
    border-bottom: 4px solid #f0f0f0;;  
}

</style>
