<script setup lang="ts">
  import GamePage from "./components/GamePage.vue";
  import InventoryPage from "./components/InventoryPage.vue";
  import DialogPage from "./components/DialogPage.vue";
  import SaveLoadPage from "./components/SaveLoadPage.vue";
  import { ref, Ref } from "vue";

  import { useGame } from "./stores/game";

  const game = useGame();

  const states = ref(["game", "inv", "save/load"]);
</script>

<template>

  <main id="page" aria-labelledby="title">
    <header>
      <h1 id="title"># Adventure</h1>
    </header>
    <div>
      <p class="health">Saúde: {{ game.player.health }}/{{ game.player.maxHealth }}</p>
    </div>
    <button v-for="state: string in states" :class="['clickable', state == game.state ? 'selected' : 'unselected']" @click="game.state = state" :key="state">
      {{ state }}
    </button>
    <GamePage v-if="game.state == 'game'"></GamePage>
    <InventoryPage v-else-if="game.state == 'inv'"></InventoryPage>
    <DialogPage v-else-if="game.state == 'dialog'"></DialogPage>
    <SaveLoadPage v-else-if="game.state == 'save/load'"></SaveLoadPage>
  </main>
</template>

<style scoped>
  #title {
    color: darkblue;
    margin: 0 auto;
  }

  .clickable {
    pointer-events: auto;
  }

  button.clickable.selected {
    background: transparent;
    color: green;
  }

  button.clickable.unselected {
    background: green;
    color: white;
  }

  .health {
    color: darkred;
    display: inline-block;
    margin-inline: auto;
  }
</style>