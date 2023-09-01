<script setup lang="ts">
  import PlainButton from "./PlainButton.vue";

  import { ref, computed } from "vue";

  import { useGame } from "@/stores/game";

  const game = useGame();

  const message = ref(null);
  const mode = ref("olhar");

  const modes = ref(["olhar", "pegar", "falar"]);
</script>
<template>
  <article aria-labelledby="roomName">
    <h2 id="roomName">{{ game.player.room }}</h2>
    <div class="content">
      <img id="roomImage" width="160" height="144" :alt="game.roomDesc" :src="game.roomImg" />
      <div class="info">
        <p id="roomDesc">
          {{ game.roomDesc }}
        </p>
        <p v-if="message">{{ message }}</p>
        <p v-if="game.room.objects">
          <template v-for="obj: GameObject in game.room.objects" :key="obj.id">
            Tem
            <PlainButton :class="mode" @click.prevent="message = game.action(mode, obj.id)">{{
        game.objectName(obj)
      }}</PlainButton>
            aqui.
          </template>
        </p>
        <div>
          <PlainButton v-for="m: string in modes" :key="m" :class="[{ selected: m == mode }, m, 'mode']" @click.prevent="mode = m">{{ m }}</PlainButton>
        </div>
      </div>
      <div v-if="game.room.exits" class="directions">
        <PlainButton v-for="exit: Exit in game.room.exits" :class="['exit', exit.dir]" :key="exit.dir" @click.prevent="message = game.doMove(exit.room)">{{ exit.dir }}</PlainButton>
      </div>
    </div>
  </article>
</template>
<style scoped>
  #roomName {
    text-transform: capitalize;
  }

  #roomImage {
    width: auto;
    height: auto;
    image-rendering: pixelated;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 600px) {
    #roomImage {
      flex-grow: 1;
    }
    
    .content {
      flex-direction: row;
    }

    .info {
      flex-grow: 1;
    }
    
    .directions {
      flex-grow: 1;
    }
  }

  .mode.selected:before {
    content: "*";
  }

  .exit {
    color: darkmagenta;
    font-size: 1.6rem;
  }

  .directions {
    display: inline-block;
    position: relative;
    width: 10.6rem;
    height: 4.8rem;
    margin-inline: auto;
  }

  .norte {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .leste {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .oeste {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .sul {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .olhar {
    color: darkgreen;
  }

  .pegar {
    color: darkmagenta;
  }

  .falar {
    color: darkblue;
  }
</style>