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
    <h2 id="roomName">{{ game.player.room }}</h2>
    <figure id="room">
        <img id="roomImage" width="160" height="144" :src="game.roomImg" />
        <figcaption>
            <p id="roomDesc">
                {{ game.roomDesc }}
            </p>
        </figcaption>
    </figure>
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
        <PlainButton
            v-for="m: string in modes"
            :key="m"
            :class="[{ selected: m == mode }, m, 'mode']"
            @click.prevent="mode = m"
            >{{ m }}</PlainButton
        >
    </div>
    <div v-if="game.room.exits" class="directions">
        <PlainButton
            v-for="exit: Exit in game.room.exits"
            :class="['exit', exit.dir]"
            :key="exit.dir"
            @click.prevent="message = game.doMove(exit.room)"
            >{{ exit.dir }}</PlainButton
        >
    </div>
</template>
<style scoped>
#roomName {
    text-transform: capitalize;
}

#roomImage {
    width: 90%;
    height: auto;
    image-rendering: pixelated;
    transition-property: all;
    transition-delay: 16ms;
    transition-duration: 100ms;
    transition-timing-function: ease-in-out;
}

@media (min-width: 600px) {
    #roomImage {
        width: 60%;
        float: left;
    }
}

.mode.selected:before {
    content: "*";
}

.exit {
    color: hsl(300, 60%, 60%);
    font-size: 2rem;
}

.directions {
    display: inline-block;
    position: relative;
    width: 12rem;
    height: 6rem;
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
    color: green;
}

.pegar {
    color: darkmagenta;
}

.falar {
    color: blue;
}

p,
div {
    margin: 1rem 0;
}
</style>
