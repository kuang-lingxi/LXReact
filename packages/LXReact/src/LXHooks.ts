import { share } from "lx-react-share";
import { HooksName, PhaseEnum, StateHook, EffectHook } from "../../type/Component";

function isArrayEqual(arr1, arr2) {
  if(!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }

  if(arr1.length !== arr2.length) {
    return false;
  }

  arr1.forEach((item1, index) => {
    const item2 = arr2[index];

    return Object.is(item1, item2);
  })
}

function setHook(hook) {
  const { hooksIndex, hooksList } = share.getState();

  const newList = [ ...hooksList ];

  newList.push(hook);

  share.setState({
    hooksList: newList,
    hooksIndex: hooksIndex+1,
  });
}

const initHooks = {
  useLXState: (initState: any) => {
    let state = null;
    if(typeof initState === 'function') {
      state = initState();
    }else {
      state = initState
    }

    const hook = {
      name: HooksName.STATE,
      state,
      setState: null,
    };

    const setState = (newState: any) => {
      hook.state = newState;
    }

    hook.setState = setState;

    setHook(hook);

    return [ state, setState ];
  },
  useLXEffect: (func: () => Function | void, deps = []) => {
    const destroy = func();

    const hook = {
      name: HooksName.STATE,
      func,
      deps,
      destroy: destroy || (() => {}),
    };

    setHook(hook);
  }
}


const updateHooks = {
  // eslint-disable-next-line no-unused-vars
  useLXState: (_unused: any) => {
    const { hooksIndex, hooksList } = share.getState();

    const hook = hooksList[hooksIndex] as StateHook;

    if(hook.name !== HooksName.STATE) {
      throw Error('hooks must be used in top function');
    }

    share.setState({
      hooksIndex: hooksIndex+1,
    });

    return [
      hook.state,
      hook.setState 
    ];
  },
  useLXEffect: (func: () => Function | void, deps = []) => {
    const { hooksIndex, hooksList } = share.getState();

    const oldHook = hooksList[hooksIndex] as EffectHook;

    const { deps: oldDeps } = oldHook;

    if(!isArrayEqual(oldDeps, deps)) {
      oldHook.destroy();
      const destroy = func();
      const hook = {
        name: HooksName.STATE,
        func,
        deps,
        destroy: destroy || (() => {}),
      };
      hooksList.splice(hooksIndex, 1, hook);
    }
  }
}
// function useEffect() {}
// function useContext() {}

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
    if(phase === PhaseEnum.INIT) {
      return initHooks[name].apply(null, rest);
    }

    return updateHooks[name].apply(null, rest);
  }
}

export const hooks =  {
  useLXState: useHook('useLXState')
}