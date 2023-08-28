<script setup lang="ts">
import PlainButton from "./PlainButton.vue";
import { useGame } from "@/stores/game";

const game = useGame();
</script>
<template>
  <h2>Diálogo</h2>
  <p v-if="game.dialog.state">{{ game.dialog.state.text }}</p>
  <template v-if="game.dialog.options">
    <h3>Opções</h3>
    <p v-for="option: DialogOption in game.filteredOptions()" :key="option.text">
      <PlainButton class="option" @click="game.doChoose(option)">{{ option.text }}</PlainButton>
    </p>
  </template>
</template>
<style scoped>
.clickable.option {
  color: orange;
}
</style>
