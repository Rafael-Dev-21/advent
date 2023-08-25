import { reactive } from 'https://unpkg.com/petite-vue?module'
import { doAction } from './jsonfunc.js';

// dialog.js

export default reactive({
  all: {},
  current: null,
  state: null,
  data: null,
  load(key, path, shouldStart) {
    fetch(path)
      .then(res => res.json())
      .then(res => {
        this.all[key] = res;
        if (shouldStart) this.start(key);
      });
  },
  start(key) {
    this.current = this.all[key];
    this.state = this.current.start;
    this.data = {};
  },
  option(ctx, option) {
    let next = option.next;

    if (next) {
      this.state = this.current[next];
    }

    let action = option.action;

    if (action) {
      doAction(ctx, action);
    }

    return next;
  },
  end() {
    this.current = null;
    this.state = null;
    this.data = null;
  },
  hasDialog(key) {
    return !!this.all[key];
  },
  options() {
    return this.state?.options ?? [];
  }
});