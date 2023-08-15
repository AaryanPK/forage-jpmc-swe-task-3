import React, { Component } from 'react';
import { Table } from '@finos/perspective';
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
      timestamp: 'date',
      abcPrice: 'float',
      defPrice: 'float',
      ratio: 'float',
      lowerBound: 'float',
      upperBound: 'float',
      alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lowerBound", "upperBound", "alert"]');
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
      this.table.update(
        DataManipulator.generateRow(this.props.data),
      );
    }
  }
}

export default Graph;
