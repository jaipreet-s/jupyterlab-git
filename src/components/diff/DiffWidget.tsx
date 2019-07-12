import { Widget } from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { diffPanelIconStyle } from '../../componentsStyle/DiffStyle';
import { IDiffContext } from '../../diff';
import { Diff } from './Diff';

export class DiffWidget extends Widget {
  private readonly _renderMime: IRenderMimeRegistry;
  private readonly _path: string;
  private readonly _gitContext: IDiffContext;

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
      <Diff
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
      <Diff
        renderMime={this._renderMime}
        path={this._path}
        diffContext={this._gitContext}
      />,
      this.node
    );
  }
}
