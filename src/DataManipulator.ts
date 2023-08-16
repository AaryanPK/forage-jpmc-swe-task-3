/**
 * See Graph.tsx for explanation of thought process.
 */

import { ServerRespond } from './DataStreamer';

//Added each of the graph's attributes.
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

    //Gets the timestamp of the two stocks and chooses the larger one.
    let timestamp = serverResponds[0].timestamp;
    if (serverResponds[1].timestamp > serverResponds[0].timestamp) {
      timestamp = serverResponds[1].timestamp;
    }

    //Calculates the prices of the two stocks using their top ask and top bid prices.
    const abc = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const def = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;

    //Calculates the ratio of the two stocks.
    const ratio = abc / def;

    //Calculates the upper and lower bounds (used +/- 5% instead of 10% to show the alert works).
    const lb = 1 - 0.05 * ratio;
    const ub = 1 + 0.05 * ratio;

    //An alert appears (with the value of the ratio) if the ratio goes below the lower bound or above the upper bound, and is undefined 
    //otherwise. 
    let alert;
    if ((ratio < lb) || (ratio > ub)) {
      alert = ratio;
    }

    //Returns each of the data items.
    return {
      timestamp,
      abcPrice: abc,
      defPrice: def,
      ratio,
      lowerBound: lb,
      upperBound: ub,
      alert
    }
  }
}
