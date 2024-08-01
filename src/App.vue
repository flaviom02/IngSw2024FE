<script setup>
import NavBar from './components/NavBar.vue';
import EventList from './components/EventList.vue';
import OrganizerSubscription from './components/OrganizerSubscription.vue';
</script>


<template>
  <div id="app">
    <NavBar class="sticky" />
    <router-view class="content"/>
  </div>
</template>

<style>
  .sticky {
    position: fixed;
    top: 0;
    z-index: 1;
  }
  .content {
    position: relative;
    top: 60px;
  }
  
</style>