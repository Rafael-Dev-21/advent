<script setup lang="ts">
  import PlainButton from "./PlainButton.vue";
  import { useGame } from "@/stores/game";

  const game = useGame();
</script>
<template>
  <article aria-labelledby="pageTitle">
    <h2 id="pageTitle">Diálogo</h2>
    <p v-if="game.dialog.state">{{ game.dialog.state.text }}</p>
    <template v-if="game.dialog.options">
      <h3>Opções</h3>
      <ol>
        <li v-for="option: DialogOption in game.filteredOptions()" :key="option.text">
          <PlainButton class="option" @click="game.doChoose(option)">{{ option.text }}</PlainButton>
        </li>
      </ol>
</template>
</article>
</template>
<style scoped>
  .clickable.option {
    color: darkorange;
  }
</style>