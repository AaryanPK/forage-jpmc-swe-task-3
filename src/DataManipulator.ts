import { ServerRespond } from './DataStreamer';

export interface Row {
  timestamp: Date,
  abcPrice: number,
  defPrice: number,
  ratio: number,
  lowerBound: number,
  upperBound: number,
  alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    let timestamp = serverResponds[0].timestamp;
    if (serverResponds[1].timestamp > serverResponds[0].timestamp) {
      timestamp = serverResponds[1].timestamp;
    }
    const abc = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const def = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = abc / def;
    const lb = 1 - 0.1 * ratio;
    const ub = 1 + 0.1 * ratio;
    let alert;
    if ((ratio < lb) || (ratio > ub)) {
      alert = ratio;
    }
    return {
      timestamp,
      abcPrice: abc,
      defPrice: def,
      ratio,
      lowerBound: lb,
      upperBound: ub,
      alert,
    }
  }
}
