import { Widget } from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NBDiff } from './NbDiff';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { diffPanelIconStyle } from '../../componentsStyle/DiffStyle';

export class NBDiffWidget extends Widget {
  private readonly _renderMime: IRenderMimeRegistry;
  private readonly _path: string;

  constructor(renderMime: IRenderMimeRegistry, path: string) {
    super();
    this._renderMime = renderMime;
    this._path = path;
    // TODO: Add Diff Icon;
    this.title.label = path;
    this.title.iconClass = diffPanelIconStyle;
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
