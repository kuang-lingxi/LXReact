import { HooksListType, PhaseEnum } from "../type/Component";

class LXShare {
  public state = {
    phase: PhaseEnum.FREE,
    hooksList: [],
    hooksIndex: 0,
  } as {
    phase: PhaseEnum,
    hooksList: HooksListType,
    hooksIndex: number
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
}

const share = new LXShare();

export {
  share
}

