<script setup></script>
<template>
  <button class="clickable">
    <slot />
  </button>
</template>
<style scoped>
.clickable {
  pointer-events: auto;
  display: inline-block;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
}
</style>
