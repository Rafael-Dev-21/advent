const doAction = (ctx, action) => {
  const caller = handleVariable(ctx, action.caller);

  caller[action.method](...action.args);
}
const checkCondition = (ctx, cond) => {
  if (cond.call) {
    const call = cond.call;
    const caller = handleVariable(ctx, call.caller);
    console.log(caller);
    console.log(call.args);
    const r = caller[call.method](...call.args);
    console.log(r);
    return r;
  }
  return false;
}
const handleVariable = (ctx, cal) => {
  let caller = ctx;
  if (Array.isArray(cal)) {
    caller = cal[0] == 'this' ? caller : caller[cal[0]];
    cal.shift();
    while (cal.length > 0) {
      caller = caller[cal[0]];
      cal.shift();
    }
  } else {
    caller = cal == 'this' ? caller : caller[cal];
  }

  return caller;
}

export {
  doAction,
  checkCondition,
  handleVariable
};