import { defineStore } from "pinia";

import { doAction } from "@/utils/jsonfunc";

export const useDialog = defineStore("dialog", {
  state: (): Dialog => ({
    all: {},
    current: null,
    state: null,
    data: null,
  }),
  getters: {
    options: (state) => state.state?.options ?? [],
  },
  actions: {
    load(key: string, path: string, shouldStart: boolean) {
      import(`../assets/data/dialogs/${path}.json`)
        .then(mod => mod.default)
        .then(mod => mod as DialogTree)
        .then((res) => {
          this.all[key] = res;
          if (shouldStart) this.start(key);
        });
    },
    start(key: string) {
      this.current = this.all[key];
      this.state = this.current.start;
      this.data = {};
    },
    option(ctx: any, option: DialogOption) {
      let next = option.next;

      if (next) {
        this.state = this.current![next];
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
    hasDialog(key: string) {
      return !!this.all[key];
    },
  },
});
