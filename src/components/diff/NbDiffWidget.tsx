import { Widget } from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NBDiff } from './NbDiff';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { diffPanelIconStyle } from '../../componentsStyle/DiffStyle';
import { IDiffContext } from '../../diff';

export class NBDiffWidget extends Widget {
  private readonly _renderMime: IRenderMimeRegistry;
  private readonly _path: string;
  private _gitContext: IDiffContext;

  constructor(
    renderMime: IRenderMimeRegistry,
    path: string,
    gitContext: IDiffContext
  ) {
    super();
    this._renderMime = renderMime;
    this._path = path;
    this._gitContext = gitContext;
    this.title.label = path;
    this.title.iconClass = diffPanelIconStyle;
    this.title.closable = true;
    this.addClass('parent-diff-widget');
    ReactDOM.render(
      <NBDiff
        renderMime={this._renderMime}
        path={this._path}
        diffContext={this._gitContext}
      />,
      this.node
    );
  }

  onUpdateRequest(): void {
    ReactDOM.unmountComponentAtNode(this.node);
    ReactDOM.render(
      <NBDiff
        renderMime={this._renderMime}
        path={this._path}
        diffContext={this._gitContext}
      />,
      this.node
    );
  }
}
