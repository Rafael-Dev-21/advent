import { defineStore } from "pinia";
import rooms from "@/assets/data/rooms.json";
import objects from "@/assets/data/objects.json";

export const useWorld = defineStore("world", {
  state: (): World => ({
    rooms: rooms,
    objects: objects
  }),
  getters: {},
  actions: {
    room(id: string) {
      return this.rooms[id];
    },
    object(id: string) {
      return this.objects[id];
    },
    roomDesc(id: string) {
      return this.rooms[id].description;
    },
    roomImg(id: string) {
      return new URL("../" + this.rooms[id].image, import.meta.url).href;
    },
    objectName(obj: GameObject) {
      const objType = this.objects[obj.id];
      if (obj.quantity && obj.quantity > 1) {
        return `${obj.quantity} ${objType.plural}`;
      } else {
        return `${objType.pronoun} ${objType.name}`;
      }
    }
  }
});
