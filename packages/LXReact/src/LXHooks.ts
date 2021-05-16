import { share } from "lx-react-share";
import { updateFunctionComponent } from "../../LXReactDOM/src/LXRender";
import { HooksName, PhaseEnum, StateHook, EffectHook, ContextHook } from "../../type/Component";
import { getContextId } from "./LXContext";

function isArrayEqual(arr1, arr2) {
  if(!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }

  if(arr1.length !== arr2.length) {
    return false;
  }

  let res = true;

  arr1.forEach((item1, index) => {
    const item2 = arr2[index];

    res &&= Object.is(item1, item2);
  });

  return res;
}

function judgeHookName(actualName: string, name: string) {
  if(actualName !== name) {
    throw Error(`get hook ${actualName}, but need hook ${name}`);
  }
}

const initHooks = {
  useLXState: (initState: any) => {
    let state = null;
    if(typeof initState === 'function') {
      state = initState();
    }else {
      state = initState
    }
    const { virtualDOM } = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = {
      name: HooksName.STATE,
      state,
      setState: null,
    };

    const setState = (newState: any) => {
      hook.state = newState;
      updateFunctionComponent(nowVirtualDOM);
    }

    hook.setState = setState;

    // setHook(hook);
    if(!nowVirtualDOM.hooksList) {
      nowVirtualDOM.hooksList = [];
    }
    nowVirtualDOM.hooksList.push(hook);

    return [ state, setState ];
  },
  useLXEffect: (func: () => Function | void, deps = []) => {
    const destroy = func();
    const { virtualDOM } = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = {
      name: HooksName.EFFECT,
      func,
      deps,
      destroy: destroy || (() => {}),
      virtualDOM: null,
    };
    if(!nowVirtualDOM.hooksList) {
      nowVirtualDOM.hooksList = [];
    }
    nowVirtualDOM.hooksList.push(hook);
    // setHook(hook);
  },
  useLXContext: (context) => {
    const { virtualDOM } = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = {
      name: HooksName.CONTEXT,
      context,
    }
    nowVirtualDOM.hooksList.push(hook);

    const id = getContextId(context);

    return nowVirtualDOM.context[id].value;
  }
}


const updateHooks = {
  // eslint-disable-next-line no-unused-vars
  useLXState: (_unused: any) => {
    const { virtualDOM, hooksIndex } = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = nowVirtualDOM.hooksList[hooksIndex] as StateHook;

    judgeHookName(hook.name, HooksName.STATE);

    return [
      hook.state,
      hook.setState 
    ];
  },
  useLXEffect: (func: () => Function | void, deps = []) => {
    const { virtualDOM, hooksIndex } = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const oldHook = nowVirtualDOM.hooksList[hooksIndex] as EffectHook;

    judgeHookName(oldHook.name, HooksName.EFFECT);

    const { deps: oldDeps } = oldHook;

    if(!isArrayEqual(oldDeps, deps)) {
      oldHook.destroy();
      const destroy = func();
      const hook = {
        name: HooksName.EFFECT,
        func,
        deps,
        destroy: destroy || (() => {}),
        virtualDOM: null,
      };
      nowVirtualDOM.hooksList.splice(hooksIndex, 1, hook);
    }
  },
  useLXContext: (context) => {
    const { virtualDOM, hooksIndex } = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = nowVirtualDOM.hooksList[hooksIndex] as ContextHook;

    judgeHookName(hook.name, HooksName.CONTEXT);
    
    const id = getContextId(context);
    return nowVirtualDOM.context[id].value;
  }
}

// function useReducer() {}
// function useCallback() {}
// function useMemo() {}
// function useRef() {}
// function useImperativeHandle() {}
// function useLayoutEffect() {}
// function useDebugValue() {}

function useHook(name: keyof typeof initHooks) {
  return (...rest) => {
    const { phase } = share.getState();
    let res = null;
    if(phase[0] === PhaseEnum.INIT) {
      res = initHooks[name].apply(null, rest);
    }else {
      res = updateHooks[name].apply(null, rest);
    }

    share.addHooksIndex();

    return res;
  }
}

export const hooks =  {
  useLXState: useHook('useLXState'),
  useLXEffect: useHook('useLXEffect'),
  useLXContext: useHook('useLXContext')
}