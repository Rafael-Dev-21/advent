<script setup lang="ts">
import GamePage from "./components/GamePage.vue";
import InventoryPage from "./components/InventoryPage.vue";
import DialogPage from "./components/DialogPage.vue";
import SaveLoadPage from "./components/SaveLoadPage.vue";
import { ref } from "vue";

import { useGame } from "./stores/game";

const game = useGame();

let states = ref(["game", "inv", "save/load"]);
</script>

<template>
  <header>
    <h1 id="title"># Adventure</h1>
  </header>
  <main id="page">
    <div>
      <p class="health">{{ game.player.health }}/{{ game.player.maxHealth }}</p>
    </div>
    <button
      v-for="state: string in states"
      :class="['clickable', state == game.state ? 'selected' : 'unselected']"
      @click="game.state = state"
      :key="state"
    >
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
  color: hsl(300, 50%, 50%);
  margin: 1rem auto;
}

#page {
  color: hsl(180, 50%, 50%);
  border: 1px solid white;
  margin: 5px auto;
  padding: 5px;
  overflow: hidden;
  width: calc(90vw - 2rem);
  min-height: 480px;
  max-height: 4096px;
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
  background: radial-gradient(white 1px, black 120%);
  display: inline-block;
  margin-inline: auto;
}

.health:before {
  content: "♥";
}
</style>
