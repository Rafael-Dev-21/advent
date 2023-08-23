(function() {
  const output = document.querySelector("#console-out");
  const input = document.querySelector("#console-in");

  const objects = [
    { tag: 'campo', desc: 'um campo', loc: '', weight: 9999 },
    { tag: 'guarda', desc: 'um guarda', loc: 'campo', weight: 80 },
    { tag: 'adaga', desc: 'uma adaga', loc: 'guarda', weight: 2 },
    { tag: 'prata', desc: 'uma moeda de prata', loc: 'campo', weight: 1 },
    { tag: 'você', desc: 'você', loc: 'campo', weight: 80, maxWeight: 30 },
  ];

  input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      processCommand(input.value);
      input.value = '';
    }
  });

  function processCommand(line) {
    logToConsole('>' + line, 'para-cmd')

    let toks = line.toLowerCase().trim().split(' ');
    let cmd = toks[0];
    let args = toks.slice(1, toks.length);

    let [code, result] = gameEval(cmd, args);
    
    result.map(n => logToConsole(n, code ? 'para-res' : 'para-err'));
  }

  function gameEval(cmd, args) {
    switch (cmd) {
      case 'olhar':
        return [true, look()];
      case 'pegar':
        return pickup(args[0]);
      default:
        return [false, [`Eu não sei "${cmd}".`]]
    }
  }

  function look() {
    let player = getObject('você');

    return [`Você está em ${ getObject(player.loc).desc }.`].concat(descObjectsAt(player.loc));
  }
  
  function pickup(itemTag) {
    if (!itemTag) {
      return [false, [`Pegar o quê?`]];
    }
    
    let player = getObject('você');
    let item = getObject(itemTag);
    
    if (!item || item.loc !== player.loc) {
      return [false, [`Não há ${itemTag} aqui.`]];
    }
    
    if (item.weight > player.maxWeight) {
      return [false, [`${item.desc} é muito pesado para ${player.desc} carregar.`]];
    }
    
    item.loc = player.tag;
    return [true, [`Você pegou "${item.desc}".`]];
  }

  function logToConsole(msg, cls) {
    const newLine = document.createElement('p');
    newLine.textContent = msg;
    newLine.classList.add(cls);
    output.appendChild(newLine);
    output.scrollTop = output.scrollHeight;
  }

  function getObject(tag) {
    return objects.filter(v => v.tag === tag)[0];
  }

  function getObjectsAt(loc) {
    return objects.filter(v => v.loc === loc && v.tag !== 'você');
  }

  function descObjectsAt(loc) {
    return getObjectsAt(loc).map(v => `Tem ${v.desc} aqui.`);
  }
})();