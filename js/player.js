import { reactive } from 'https://unpkg.com/petite-vue?module';

export default reactive({
  inventory: Array(16).fill(null),
  maxHealth: 12,
  health: 10,
  grid() {
    return [...Array(4)].map((_, i) => [...Array(4)].map((_, j) => this.inventory[i * 4 + j]));
  },
  pick(item) {
    let i = this.inventory.findIndex(x => x?.id == item);
    if (i != -1) {
      this.inventory[i].quantity++;
      return true;
    }
    i = this.inventory.indexOf(null);
    if (i == -1) return false;
    this.inventory[i] = { id: item, quantity: 1 };
    return true;
  },
  drop(item) {
    if (!this.hasItem(item)) return false;
    let i = this.inventory.findIndex(x => x?.id == item);
    if (i == -1) return false;
    this.inventory[i].quantity--;
    if (this.inventory[i].quantity == 0) {
      this.inventory[i] = null;
    }
    return true;
  },
  hasItem(item, min = 1) {
    const i = this.inventory.findIndex(x => x?.id == item);
    if (i == -1) return false;
    return this.inventory[i].quantity >= min;
  },
  fullHeal() {
    this.health = this.maxHealth;
  }
});