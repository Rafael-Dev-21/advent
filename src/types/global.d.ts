interface TypeObject {
  name: string;
  pronoun: string;
  plural: string;
  desc: string;
  canPick?: boolean;
  icon?: string;
  dialogUrl?: string;
}

interface GameObject {
  id: string;
  quantity?: number;
}

interface Exit {
  dir: string;
  room: string;
}

interface Action {
  caller: string;
  method: string;
  args: any[];
}

interface Condition {
  call?: Action;
}

interface Room {
  description: string;
  image: string;
  exits?: Exit[];
  objects?: GameObject[];
  action?: Action;
}

interface World {
  rooms: {
    [key: string]: Room;
  };
  objects: {
    [key: string]: TypeObject;
  };
}

interface Player {
  inventory: (GameObject | null)[];
  maxHealth: number;
  health: number;
  room: string;
}

interface DialogOption {
  text: string;
  next: string | null;
  condition?: Condition;
  action?: Action;
}

interface DialogNode {
  text: string;
  options: DialogOption[];
}

interface DialogTree {
  [key: string]: DialogNode;
}

interface DialogMap {
  [key: string]: DialogTree;
}

interface Dialog {
  all: DialogMap;
  current: DialogTree | null;
  state: DialogNode | null;
  data: object | null;
}
