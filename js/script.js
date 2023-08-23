class Room {
  constructor(desc) {
    this.desc = desc;
    this.exits = {};
    this.objects = [];
  }

  addExit(key, loc) {
    this.exits[key] = loc;
  }

  addObject(obj) {
    this.objects.push(obj);
  }

  removeObject(obj) {
    this.objects.splice(this.objects.indexOf(obj), 1);
  }

  getObject(tag) {
    return this.objects.filter((v) => v.tag === tag)[0];
  }
}

class MyObject {
  constructor(tag, desc, loc, weight) {
    this.tag = tag;
    this.desc = desc;
    this.loc = loc;
    this.weight = weight;
  }

  setLocation(newLoc) {
    this.loc = newLoc;
    this.loc.addObject(this);
  }

  move(newLoc) {
    this.loc.removeObject(this);
    this.setLocation(newLoc);
  }
}

class Entity extends MyObject {
  constructor(name, health, loc) {
    super(name, name, loc, 80);

    this.name = name;
    this.health = health;
    this.inventory = [];
    this.actions = {};
  }

  addItem(item) {
    this.inventory.push(item);
  }

  removeItem(item) {
    this.inventory.splice(this.inventory.indexOf(item), 1);
  }

  addAction(key, func) {
    this.actions[key] = func;
  }

  doAction(key, ...args) {
    if (this.actions[key]) {
      return this.actions[key](args);
    } else {
      return [false, [`${this.name} não pode ${key}.`]];
    }
  }
}

let rooms = [new Room("limbo"), new Room("um campo"), new Room("uma caverna")];

let items = [
  new MyObject("prata", "uma moeda de prata", rooms[1], 1),
  new MyObject("adaga", "uma adaga", rooms[0], 2),
];

let entities = [
  new Entity("guarda", 12, rooms[1]),
  new Entity("você", 12, rooms[1]),
];

rooms[1].addExit("leste", rooms[2]);
rooms[2].addExit("oeste", rooms[1]);

entities[0].addItem(items[1]);

items.forEach((item) => item.setLocation(item.loc));

entities.forEach((e) => e.setLocation(e.loc));

window.app = {
  input: "",
  output: [],
  player: entities[1],
  processCommand(line) {
    this.logToConsole(">" + line, "para-cmd");

    let toks = line.toLowerCase().trim().split(" ");
    let cmd = toks[0];
    let args = toks.slice(1, toks.length);

    let [code, result] = this.gameEval(cmd, args);

    result.map((n) => this.logToConsole(n, code ? "para-res" : "para-err"));

    this.input = "";
  },
  gameEval(cmd, args) {
    switch (cmd) {
      case "olhar":
        return this.look();
      case "pegar":
        return this.pickup(args[0]);
      case "ir":
        return this.go(args[0]);
      case "norte":
      case "sul":
      case "leste":
      case "oeste":
        return this.go(cmd);
      default:
        return [false, [`Eu não sei "${cmd}".`]];
    }
  },
  look() {
    let loc = this.player.loc;
    return [
      true,
      [`Você está em ${loc.desc}.`].concat(
        loc.objects
          .map((t) => `Tem ${t.desc} aqui.`)
          .concat(
            Object.keys(loc.exits).map(
              (k) => `Tem ${loc.exits[k]} para o ${k} daqui.`
            )
          )
      ),
    ];
  },
  pickup(itemTag) {
    if (!itemTag) {
      return [false, [`Pegar o quê?`]];
    }

    let item = this.player.loc.getObject(itemTag);

    if (!item) {
      return [false, [`Não há ${itemTag} aqui.`]];
    }

    if (item.weight > 30) {
      return [
        false,
        [`${item.desc} é muito pesado para ${player.desc} carregar.`],
      ];
    }

    item.move(rooms[0]);
    this.player.addItem(item);
    return [true, [`Você pegou "${item.desc}".`]];
  },
  go(dir) {
    if (!dir) {
      return [false, ["Ir para onde?"]];
    }

    let exit = this.player.loc.exits[dir];

    if (!exit) {
      return [false, [`Não tem nada a ${dir} daqui.`]];
    }

    this.player.move(exit);
    return this.look();
  },
  logToConsole(msg, cls) {
    this.output.push({ text: msg, class: cls });
  },
};

PetiteVue.createApp(app).mount();
