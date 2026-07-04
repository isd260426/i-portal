<template>
  <router-view />
</template>

<script setup>
// Root Component
</script>

<style>
/* Global resets & scrollbar overrides */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #000;
  margin: 0;
  overflow: hidden;
}

/* Custom scrollbars for dashboard views */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
