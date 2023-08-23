window.app = {
  input: '',
  output: [],
  objects: [
    { tag: 'campo', desc: 'um campo', loc: '', weight: 9999 },
    { tag: 'guarda', desc: 'um guarda', loc: 'campo', weight: 80 },
    { tag: 'adaga', desc: 'uma adaga', loc: 'guarda', weight: 2 },
    { tag: 'prata', desc: 'uma moeda de prata', loc: 'campo', weight: 1 },
    { tag: 'você', desc: 'você', loc: 'campo', weight: 80, maxWeight: 30 },
  ],
  processCommand(line) {
    this.logToConsole('>' + line, 'para-cmd')

    let toks = line.toLowerCase().trim().split(' ');
    let cmd = toks[0];
    let args = toks.slice(1, toks.length);

    let [code, result] = this.gameEval(cmd, args);

    result.map(n => this.logToConsole(n, code ? 'para-res' : 'para-err'));

    this.input = '';
  },
  gameEval(cmd, args) {
    switch (cmd) {
      case 'olhar':
        return this.look(args[0]);
      case 'pegar':
        return this.pickup(args[0]);
      default:
        return [false, [`Eu não sei "${cmd}".`]]
    }
  },
  look(where) {
    let player = this.getObject('você');

    if (!where || where === 'arredores') {
      return [true, [`Você está em ${ this.getObject(player.loc).desc }.`].concat(this.descObjectsAt(player.loc))];
    }

    if (where === 'eu') where = 'você';

    let target = this.getObject(where);
    if (!target) {
      return [false, ['Olhar para onde?']];
    }

    let descs = this.descObjectsAt(where);

    return [true, descs.length ? this.descObjectsAt(where) : ['Não tem nada ai.']];
  },
  pickup(itemTag) {
    if (!itemTag) {
      return [false, [`Pegar o quê?`]];
    }

    let player = this.getObject('você');
    let item = this.getObject(itemTag);

    if (!item || item.loc !== player.loc) {
      return [false, [`Não há ${itemTag} aqui.`]];
    }

    if (item.weight > player.maxWeight) {
      return [false, [`${item.desc} é muito pesado para ${player.desc} carregar.`]];
    }

    item.loc = player.tag;
    return [true, [`Você pegou "${item.desc}".`]];
  },
  logToConsole(msg, cls) {
    this.output.push({ text: msg, class: cls });
  },
  getObject(tag) {
    return this.objects.filter(v => v.tag === tag)[0];
  },
  getObjectsAt(loc) {
    return this.objects.filter(v => v.loc === loc && v.tag !== 'você');
  },
  descObjectsAt(loc) {
    return this.getObjectsAt(loc).map(v => `Tem ${v.desc} aqui.`);
  }
};

PetiteVue.createApp(app).mount();