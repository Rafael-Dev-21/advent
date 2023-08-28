import { defineStore } from "pinia";

export const usePlayer = defineStore("player", {
    state: (): Player => ({
        /** @type {{id: String, quantity: Number | undefined}?[] } */
        inventory: Array(16).fill(null),
        /** @type { Number } */
        maxHealth: 12,
        /** @type { Number } */
        health: 12,
        /** @type { String } */
        room: "campo"
    }),

    getters: {
        grid(state: Player): Array<Array<GameObject | null>> {
            return [...Array(4)].map((_, i) => {
                return [...Array(4)].map((_, j) => {
                    return state.inventory[i * 4 + j];
                });
            });
        }
    },
    actions: {
        hasItem(item: string, min = 1): boolean {
            const i = this.inventory.findIndex((x: GameObject | null) => x?.id == item);
            if (i == -1) return false;
            return this.inventory[i]!.quantity! >= min;
        },
        pick(item: string): boolean {
            let i = this.inventory.findIndex((x: GameObject | null) => x?.id == item);
            if (i != -1) {
                this.inventory[i]!.quantity!++;
                return true;
            }
            i = this.inventory.indexOf(null);
            if (i == -1) return false;
            this.inventory[i] = { id: item, quantity: 1 };
            return true;
        },
        drop(item: string): boolean {
            if (!this.hasItem(item)) return false;
            let i = this.inventory.findIndex((x: GameObject | null) => x?.id == item);
            this.inventory[i]!.quantity!--;
            if (this.inventory[i]!.quantity! == 0) {
                this.inventory[i] = null;
            }
            return true;
        },
        fullHeal(): void {
            this.health = this.maxHealth;
        }
    }
});
