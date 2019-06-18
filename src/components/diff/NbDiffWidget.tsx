import { Widget } from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NBDiff } from './NbDiff';

export class NBDiffWidget extends Widget {
  constructor() {
    super();
    this.id = 'nbdiff';
    this.title.label = 'nbdiff';
    this.title.closable = true;
    ReactDOM.render(<NBDiff />, this.node);
  }

  onUpdateRequest(): void {
    ReactDOM.unmountComponentAtNode(this.node);
    ReactDOM.render(<NBDiff />, this.node);
  }
}
