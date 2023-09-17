import { defineStore } from "pinia";
import { usePlayer } from "./player";
import { useWorld } from "./world";
import { useDialog } from "./dialog";
import { Howl } from "howler";

import { doAction, checkCondition } from "@/utils/jsonfunc";

export const useGame = defineStore("game", {
  state: () => ({
    player: usePlayer(),
    world: useWorld(),
    dialog: useDialog(),
    howl: null,
    state: "game"
  }),
  getters: {
    room: (state) => state.world.room(state.player.room),
    roomDesc(): string {
      return this.room.description;
    },
    roomImg() {
      return this.room.image;
    }
  },
  actions: {
    objectName(obj: GameObject) {
      return this.world.objectName(obj);
    },
    itemName(obj: GameObject | null, fallback = "Slot vazio.") {
      if (obj) {
        return this.world.objects[obj.id].name;
      }
      return fallback;
    },
    itemIcon(obj: GameObject | null, fallback = "images/vazio.png") {
      let url = fallback;
      if (obj) {
        url = this.world.objects[obj!.id].icon!;
      }

      return url;
    },
    doMove(newRoom: string) {
      this.player.room = newRoom;
      if (this.room.action) {
        doAction(this, this.room.action);
      }
      
      if (this.howl) this.howl.stop();
      
      if (this.room.music != null) {
        this.howl = new Howl(this.room.music);
        this.howl.play("a");
        
        this.howl.once("end", () => this.howl.play("b"));
      }
    },
    doLook(id: string) {
      return this.world.objects[id].desc;
    },
    doPick(id: string) {
      const objType = this.world.objects[id];

      if (!objType?.canPick) {
        return `Você não pode pegar ${objType?.plural ?? "isso"}.`;
      }

      if (this.player.pick(id)) {
        let i = this.room.objects!.findIndex((x) => x!.id == id);
        this.room.objects![i].quantity!--;
        if (this.room.objects![i].quantity! == 0) {
          this.room.objects!.splice(i, 1);
        }
        return `Você pegou ${objType.pronoun} ${objType.name}.`;
      } else {
        return "O seu inventário está cheio.";
      }
    },
    doDrop(id: string) {
      if (this.player.drop(id)) {
        const i = this.room.objects!.findIndex((x) => x!.id == id);
        if (i != -1) {
          this.room.objects![i]!.quantity!++;
        } else {
          this.room.objects!.push({ id: id, quantity: 1 });
        }
        return "Largado!";
      }
      return "Não foi possivel largar item.";
    },
    doTalk(who: string) {
      let obj = this.world.objects![who];

      let dialogUrl = obj.dialogUrl;

      if (!dialogUrl) {
        return `${obj.name} não quer falar com você.`;
      }

      if (!this.dialog.hasDialog(who)) {
        this.dialog.load(who, dialogUrl!, true);
      } else {
        this.dialog.start(who);
      }
      this.state = "dialog";
      return null;
    },
    doChoose(option: DialogOption) {
      if (!this.dialog.option(this, option)) {
        this.dialog.end();
        this.state = "game";
      }
    },
    action(act: string, id: string) {
      switch (act) {
        case "olhar":
          return this.doLook(id);
        case "pegar":
          return this.doPick(id);
        case "largar":
          return this.doDrop(id);
        case "falar":
          return this.doTalk(id);
        default:
          return `Não sei ${act}.`;
      }
    },
    checkCondition(cond: Condition) {
      return checkCondition(this, cond);
    },
    filteredOptions() {
      return this.dialog.options.filter((t) => !t.condition || this.checkCondition(t.condition));
    }
  }
});
