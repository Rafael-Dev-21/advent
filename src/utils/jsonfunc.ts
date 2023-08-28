const doAction = (ctx: any, action: Action) => {
  const caller = handleVariable(ctx, action.caller);

  caller[action.method](...action.args.map(handleValue));
};
const checkCondition = (ctx: any, cond: Condition) => {
  if (cond.call) {
    const call = cond.call;
    const caller = handleVariable(ctx, call.caller);
    return caller[call.method](...call.args.map(handleValue));
  }
  return false;
};
const handleVariable = (ctx: any, cal: string | Array<string>) => {
  let caller = ctx;
  if (Array.isArray(cal)) {
    caller = cal[0] == "this" ? caller : caller[cal[0]];
    cal.shift();
    while (cal.length > 0) {
      caller = caller[cal[0]];
      cal.shift();
    }
  } else {
    caller = cal == "this" ? caller : caller[cal];
  }

  return caller;
};

const handleValue = (value: any) => {
  if (<Action>value) {
    return value as Action;
  } else if (value!.var) {
    return handleVariable(value.var);
  } else {
    return value;
  }
};

export { doAction, checkCondition, handleVariable, handleValue };
