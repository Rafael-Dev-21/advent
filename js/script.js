import { createApp, reactive } from 'https://unpkg.com/petite-vue?module';
import player from './player.js';
import dialog from './dialog.js';
import { doAction, checkCondition } from './jsonfunc.js';

function Game({ initialRoom, roomsPath, objsPath }) {
  return {
    state: 'load',
    states: ['game', 'inv', 'dialog'],
    mode: 'olhar',
    modes: {
      game: ['olhar', 'pegar', 'falar'],
      inv: ['olhar', 'largar']
    },
    player,
    dialog,
    room: null,
    roomDesc: '',
    roomImg: '',
    rooms: null,
    initialRoom: initialRoom,
    objects: null,
    message: null,
    mounted() {
      Promise.all([fetch(roomsPath)
        .then(res => res.json()), fetch(objsPath).then(res => res.json())])
        .then(res => {
          this.rooms = res[0];
          this.objects = res[1];
          this.dialog.load('save', 'data/dialogs/save.json', false);
          this.room = this.rooms[this.initialRoom];
          this.roomDesc = this.room.description;
          this.roomImg = this.room.image || '';

          this.state = 'game';
        });

    },
    doCommand(arg) {
      switch (this.mode) {
        case 'olhar':
          this.doLook(arg);
          break;
        case 'pegar':
          this.doPick(arg);
          break;
        case 'largar':
          this.doDrop(arg);
          break;
        case 'falar':
          this.doTalk(arg);
          break;
      }
    },
    doMovement(dir) {
      let exit = this.room.exits.find(t => t.dir === dir);
      this.room = this.rooms[exit.room];
      this.roomDesc = this.room.description;
      this.roomImg = this.room.image || '';
      this.message = null;
      if (this.room.action) doAction(this, this.room.action);
    },
    doLook(what) {
      this.message = this.objects[what].desc;
    },
    doPick(what) {
      if (!this.room.objects.find(x => x?.id == what)) {
        this.message = `Não há ${this.objects[what].pronoun} ${this.objects[what].name} na sala.`;
        return;
      }

      let obj = this.objects[what];

      if (!obj?.canPick) {
        this.message = `Você não pode pegar ${obj?.pronoun + ' ' ?? ''}${ obj?.name ?? 'isso'}.`;
        return;
      }

      if (this.player.pick(what)) {
        let i = this.room.objects.findIndex(x => x?.id == what);
        this.room.objects[i].quantity--;
        if (this.room.objects[i].quantity == 0) {
          this.room.objects.splice(i, 1);
        }
        this.message = `Você pegou ${obj.pronoun} ${obj.name}.`;
      } else {
        this.message = `Seu inventário está cheio!`;
      }
    },
    doDrop(what) {
      let obj = this.objects[what];

      if (this.player.drop(what)) {
        let i = this.room.objects.findIndex(x => x?.id == what);
        if (i != -1) {
          this.room.objects[i].quantity++;
        } else {
          this.room.objects.push({ id: what, quantity: 1 });
        }
        this.message = `${obj.name} largado(a).`;
      } else {
        this.message = `Você não pode largar ${obj.name}`;
      }
    },
    doTalk(who) {
      let obj = this.objects[who];

      let dialogUrl = obj.dialogUrl;

      if (!dialogUrl) {
        this.message = `${obj.name} não quer falar com você.`;
        return;
      }

      if (!this.dialog.hasDialog(who)) {
        this.dialog.load(who, dialogUrl, true);
      } else {
        this.dialog.start(who);
      }
      this.state = 'dialog';
    },
    doChoose(option) {
      if (!this.dialog.option(this, option)) {
        this.dialog.end();
        this.state = 'game';
      }
    },
    doSave(file) {
      localStorage.setItem(file, JSON.stringify(this));
    },
    doLoad(file) {
      let obj = JSON.parse(localStorage.getItem(file));
      obj.player = reactive({ ...player, ...obj.player });
      obj.dialog = reactive({ ...dialog, ...obj.dialog });
      Object.assign(this, obj);
    },
    checkCondition(c) {
      return checkCondition(this, c)
    },
  };
}

createApp({ Game }).mount();