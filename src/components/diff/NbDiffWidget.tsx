import { Widget } from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NBDiff } from './NbDiff';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

export class NBDiffWidget extends Widget {
  private _renderMime: IRenderMimeRegistry;
  constructor(renderMime: IRenderMimeRegistry) {
    super();
    this._renderMime = renderMime;
    this.id = 'nbdiff';
    this.title.label = 'nbdiff';
    this.title.closable = true;
    ReactDOM.render(<NBDiff renderMime={this._renderMime} />, this.node);
  }

  onUpdateRequest(): void {
    ReactDOM.unmountComponentAtNode(this.node);
    ReactDOM.render(<NBDiff renderMime={this._renderMime} />, this.node);
  }
}
