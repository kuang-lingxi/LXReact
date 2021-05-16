import { LXVirtualDOMType, PhaseEnum } from "../type/Component";

class LXShare {
  public state = {
    phase: [ PhaseEnum.FREE ],
    virtualDOM: [ null ],
    hooksIndex: 0,
  } as {
    phase: PhaseEnum[],
    hooksIndex: number,
    virtualDOM: LXVirtualDOMType[],
  };

  setState(data) {
    if(Object.prototype.toString.call(data) !== '[object Object]') {
      throw Error('data must be a object');
    }

    this.state = {
      ...this.state,
      ...data,
    };
  }

  getState() {
    return this.state;
  }

  setPhase({ phase, virtualDOM }) {
   this.state.phase.unshift(phase);
   this.state.virtualDOM.unshift(virtualDOM)
  }

  deletePhase() {
    this.state.phase.shift();
    this.state.virtualDOM.shift();
    this.state.hooksIndex = 0;
  }

  addHooksIndex() {
    this.state.hooksIndex = this.state.hooksIndex + 1;
  }
}

const share = new LXShare();

export {
  share
}

