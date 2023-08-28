<script setup lang="ts">
import { useGame } from "@/stores/game";
import { ref } from "vue";

const savefile = ref("advent1.sav");

const game = useGame();

const state = ref("select");

const fn = ref(null);

function save() {
  localStorage.setItem(savefile.value, JSON.stringify({player: game.player.$state, world: game.world.$state}));
}

function load() {
  let data = JSON.parse(localStorage.getItem(savefile.value));
  game.player.$patch(data?.player ?? game.player.$state);
  game.world.$patch(data?.world ?? game.world.$state);
}

function delet() {
  localStorage.removeItem(savefile.value);
}
</script>
<template class="input">
  <div class="input">
    <h2>Salvar/Carregar</h2>
    <template class="input" v-if="state == 'select'">
      <fieldset>
        <legend>Selecione save</legend>
        <div>
          <input type="radio" v-model="savefile" value="advent1_sav" /><label
            >Save 1</label
          >
        </div>
        <div>
          <input type="radio" v-model="savefile" value="advent2_sav" /><label
            >Save 2</label
          >
        </div>
        <div>
          <input type="radio" v-model="savefile" value="advent3_sav" /><label
            >Save 3</label
          >
        </div>
      </fieldset>
      <div>
        <button
          @click.prevent="
            fn = save;
            state = 'confirm';
          "
        >
          Salvar</button
        ><button
          @click.prevent="
            fn = load;
            state = 'confirm';
          "
        >
          Carregar
        </button><button @click.prevent="fn = delet; state = 'confirm'">Deletar</button>
      </div>
    </template>
    <template class="input" v-else-if="state == 'confirm'">
      <p>Tem certeza?</p>
      <button
        @click.prevent="
          fn();
          game.state = 'game';
        "
      >
        Sim</button
      ><button @click.prevent="game.state = 'game'">Não</button>
    </template>
  </div>
</template>
<style scoped>
.input {
  pointer-events: auto;
}
</style>
