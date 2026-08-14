<template>
  <div class="mimo-container">
    <iframe 
      :src="iframeSrc" 
      class="mimo-iframe" 
      frameborder="0"
      allow="camera; microphone; geolocation"
    ></iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const iframeSrc = computed(() => {
  // If running locally in Vite (port 3000), load the local docker-compose port 30081
  if (window.location.port === '3000') {
    return 'http://localhost:30081/';
  }
  // Otherwise, use relative reverse-proxy path
  return '/i-mimo/';
});
</script>

<style scoped>
.mimo-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #08080c;
}

.mimo-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
