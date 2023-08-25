import { reactive } from 'https://unpkg.com/petite-vue?module';

let playerProto = {
  grid() {
    return [...Array(4)].map((_, i) => [...Array(4)].map((_, j) => this.inventory[i * 4 + j]));
  },
  pick(item) {
    let i = this.inventory.indexOf(null);
    if (i == -1) return false;
    this.inventory[i] = item;
    return true;
  },
  drop(item) {
    if (!this.hasItem(item)) return false;
    let i = this.inventory.indexOf(item);
    if (i == -1) return false;
    this.inventory[i] = null;
    return true;
  },
  hasItem(item) {
    return this.inventory.includes(item);
  },
  fullHeal() {
    this.health = this.maxHealth;
  }
};

export default reactive({
  inventory: Array(16).fill(null),
  maxHealth: 12,
  health: 12,
  ...playerProto,
});

export { playerProto };