import { share } from "lx-react-share";
import { HooksName, PhaseEnum } from "../../type/Component";

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

    const { hooksIndex, hooksList } = share.getState();

    const newList = [ ...hooksList ];

    newList.push(hook);

    share.setState({
      hooksList: newList,
      hooksIndex: hooksIndex+1,
    });
    return [ state, setState ];
  }
}


const updateHooks = {
  // eslint-disable-next-line no-unused-vars
  useLXState: (_unused: any) => {
    const { hooksIndex, hooksList } = share.getState();

    const hook = hooksList[hooksIndex];

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