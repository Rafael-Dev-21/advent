<script setup lang="ts">
import PlainButton from "./PlainButton.vue";

import { useGame } from "../stores/game";

const game = useGame();
</script>
<template>
  <h2>Inventário</h2>
  <table class="inventory" border="1 solid">
    <tr v-for="row: (GameObject | null)[] in game.player.grid">
      <td v-for="item: GameObject | null in row">
        <PlainButton @click="game.action('largar', item!.id)" :key="item?.quantity">
          <img
            class="icon"
            width="16"
            height="16"
            :src="game.itemIcon(item)"
            :alt="game.itemName(item)"
          />
          <span v-if="item" class="count">{{ item?.quantity }}</span>
        </PlainButton>
      </td>
    </tr>
  </table>
  <div><PlainButton class="largar">largar</PlainButton></div>
</template>
<style scoped>
.clickable.largar {
  color: darkmagenta;
}

.inventory {
  width: 90%;
  height: auto;
  margin-inline: auto;
}

.inventory td {
  position: relative;
  width: 3rem;
  height: 3rem;
}

.inventory img {
  width: 3rem;
  height: 3rem;
  z-index: 2;
  image-rendering: pixelated;
}

.inventory .count {
  color: darkgreen;
  position: absolute;
  font-size: 1.5rem;
  font-style: bold;
  text-shadow: 0px 0px 1px black;
  left: 2px;
  bottom: 2px;
  z-index: 1;
}
</style>
