window.app = {
  input: '',
  output: [],
  directions: ['norte', 'sul', 'leste', 'oeste'],
  objects: [
    { tag: 'campo', desc: 'um campo', loc: '', weight: 9999 },
    { tag: 'caverna', desc: 'uma caverna', loc: '', weight: 9999 },
    { tag: 'leste', desc: 'uma entrada', loc: 'campo', weight: 9999, leadsTo: 'caverna' },
    { tag: 'oeste', desc: 'uma saida', loc: 'caverna', weight: 9999, leadsTo: 'campo' },
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
      case 'ir':
        return this.go(args[0]);
      case 'norte':
      case 'sul':
      case 'leste':
      case 'oeste':
        return this.go(cmd);
      default:
        return [false, [`Eu não sei "${cmd}".`]]
    }
  },
  look(where) {
    let player = this.getObject('você');

    if (!where || where === 'arredores') {
      return [true, [`Você está em ${ this.getObject(player.loc).desc }.`].concat(this.descObjectsAt(player.loc).concat(this.descExitsAt(player.loc)))];
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
  go(dir) {
    if (!dir) {
      return [false, ['Ir para onde?']];
    }

    if (!this.directions.includes(dir)) {
      return [false, [`${dir} não é uma direção.`]];
    }

    let player = this.getObject('você');
    let exits = this.getExitsAt(player.loc);

    let exit = exits.filter(v => v.tag === dir)[0];

    if (!exit) {
      return [false, [`Não tem nada a ${dir} daqui.`]];
    }

    player.loc = exit.leadsTo;
    return this.look();
  },
  logToConsole(msg, cls) {
    this.output.push({ text: msg, class: cls });
  },
  getObject(tag) {
    return this.objects.filter(v => v.tag === tag && !this.directions.includes(v.tag))[0];
  },
  getObjectsAt(loc) {
    return this.objects.filter(v => v.loc === loc && v.tag !== 'você' && !this.directions.includes(v.tag));
  },
  descObjectsAt(loc) {
    return this.getObjectsAt(loc).map(v => `Tem ${v.desc} aqui.`);
  },
  getExitsAt(loc) {
    return this.objects.filter(v => v.loc === loc).filter(v => v.leadsTo && this.directions.includes(v.tag));
  },
  descExitsAt(loc) {
    return this.getExitsAt(loc).map(v => `Tem ${v.desc} para o ${v.tag} daqui.`);
  }
};

PetiteVue.createApp(app).mount();