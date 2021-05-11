import { phase } from "../../LXReactDOM/src/LXRender";
import { LXReactElementType, LXVirtualDOMType, PhaseEnum } from "../../type/Component";

export let nowElement: LXReactElementType = null;

export let nowVirtualDOM: LXVirtualDOMType = null;

export let hookIndex = 0;

export const HooksName = {
  STATE: 'state',
}

const initHooks = {
  useLXState: (initState: any) => {
    let state = null;
    if(typeof initState === 'function') {
      state = initState();
    }else {
      state = initState
    }

    if(!Object.prototype.hasOwnProperty.call(nowElement, 'hooksList')) {
      nowElement.hooksList = [];
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

    nowElement.hooksList.push(hook)

    return [ state, setState ];
  }
}


const updateHooks = {
  // eslint-disable-next-line no-unused-vars
  useLXState: (_unused: any) => {
    const hook = nowVirtualDOM.hooksList[hookIndex];
    if(hook.name !== HooksName.STATE) {
      throw Error('hooks must be used in top function');
    }

    return [
      hook.state,
      hook.setState 
    ];
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
    if(phase === PhaseEnum.INIT) {
      return initHooks[name](rest);
    }

    return updateHooks[name](rest);
  }
}

export const hooks =  {
  useLXState: useHook('useLXState')
}