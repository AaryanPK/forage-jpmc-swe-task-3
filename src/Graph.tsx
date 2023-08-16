import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {

      //Timestamp to plot data with respect to time.
      timestamp: 'date',

      //Prices of both stocks in order to calculate their ratio.
      abcPrice: 'float',
      defPrice: 'float',
      ratio: 'float',

      //A lower and upper bound for the ratio.
      lowerBound: 'float',
      upperBound: 'float',

      //An alert which appears whenever the ratio goes below its lower bound or above its upper bound.
      alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.

      //Sets up a table with time on the horizontal axis and graphs for the ratio, upper and lower bounds, and the alert.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lowerBound", "upperBound", "alert"]');

      //Averages some of the duplicate data such that data points are differentiated by their timestamp only.
      elem.setAttribute('aggregates', JSON.stringify({
        timestamp: 'distinct count',
        abcPrice: 'avg',
        defPrice: 'avg',
        ratio: 'avg',
        lowerBound: 'avg',
        upperBound: 'avg',
        alert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
