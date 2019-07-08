import { Widget } from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NBDiff } from './NbDiff';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

export class NBDiffWidget extends Widget {
  private _renderMime: IRenderMimeRegistry;
  private _path: string;
  constructor(renderMime: IRenderMimeRegistry, path: string) {
    super();
    this._renderMime = renderMime;
    this._path = path;
    this.id = 'nbdiff';
    this.title.label = 'nbdiff';
    this.title.closable = true;
    this.addClass('parent-diff-widget');
    ReactDOM.render(
      <NBDiff renderMime={this._renderMime} path={this._path} />,
      this.node
    );
  }

  onUpdateRequest(): void {
    ReactDOM.unmountComponentAtNode(this.node);
    ReactDOM.render(
      <NBDiff renderMime={this._renderMime} path={this._path} />,
      this.node
    );
  }
}
