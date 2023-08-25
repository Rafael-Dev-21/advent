import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'
import player from './player.js'
import { playerProto } from './player.js'

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
    room: null,
    roomDesc: '',
    roomImg: '',
    rooms: null,
    initialRoom: initialRoom,
    objects: null,
    message: null,
    dialogs: {},
    dialog: null,
    dialogState: null,
    dialogData: {},
    action: {},
    mounted() {
      if (this.rooms == null || this.objects == null) {
        Promise.all([fetch(roomsPath)
        .then(res => res.json()), fetch(objsPath).then(res => res.json()), fetch('data/dialogs/save.json').then(res => res.json())])
          .then(res => {
            this.rooms = res[0];
            this.objects = res[1];
            this.dialogs['save'] = res[2];
            this.room = this.rooms[this.initialRoom];
            this.roomDesc = this.room.description;
            this.roomImg = this.room.image || '';

            this.setupActions();
            this.state = 'game';
          });
      } else if (this.state == 'load') {
        this.setupActions();
        this.state = 'game';
      }
    },
    setupActions() {
      this.action.olhar = this.doLook;
      this.action.pegar = this.doPick;
      this.action.largar = this.doDrop;
      this.action.falar = this.doTalk;
    },
    doMovement(dir) {
      let exit = this.room.exits.find(t => t.dir === dir);
      this.room = this.rooms[exit.room];
      this.roomDesc = this.room.description;
      this.roomImg = this.room.image || '';
      this.message = null;
      if (exit.room == 'lago') this.player.fullHeal();
    },
    doLook(what) {
      this.message = this.objects[what].desc;
    },
    doPick(what) {
      if (!this.room.objects.includes(what)) {
        this.message = `Não há ${this.objects[what].pronoun} ${this.objects[what].name} na sala.`;
        return;
      }
      
      let obj = this.objects[what];

      if (!obj?.canPick) {
        this.message = `Você não pode pegar ${obj?.pronoun + ' ' ?? ''}${ obj?.name ?? 'isso'}.`;
        return;
      }

      if (this.player.pick(what)) {
        this.room.objects.splice(this.room.objects.indexOf(what), 1);
        this.message = `Você pegou ${obj.pronoun} ${obj.name}.`;
      } else {
        this.message = `Seu inventário está cheio!`;
      }
    },
    doDrop(what) {
      let obj = this.objects[what];

      if (this.player.drop(what)) {
        if (!this.room.objects) this.room.objects = [];
        this.room.objects.push(what);
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

      if (!this.dialogs[who]) {
        fetch(dialogUrl)
          .then(res => res.json())
          .then(res => {
            this.dialogs[who] = res;
            this.startDialog(who);
          });
      } else {
        this.startDialog(who);
      }
    },
    startDialog(who) {
      this.dialog = this.dialogs[who];
      this.dialogState = this.dialog.start;
      this.dialogData = {};
      this.message = this.dialogState.text;
      this.state = 'dialog';
    },
    doChoose(option) {
      let next = option.next;

      if (next) {
        this.dialogState = this.dialog[next];
        this.message = this.dialogState.text;
      } else {
        this.dialog = null;
        this.dialogState = null;
        this.message = null;
        this.state = 'game';
      }

      let action = option.action;

      if (action) {
        eval(action);
      }
    },
    doSave(file) {
      localStorage.setItem(file, JSON.stringify(this));
    },
    doLoad(file) {
      let obj = JSON.parse(localStorage.getItem(file));
      obj.player = reactive({ ...obj.player, ...playerProto });
      Object.assign(this, obj);
      this.setupActions();
    }
  };
}

createApp({ Game }).mount();