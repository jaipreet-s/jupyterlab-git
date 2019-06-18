import { nbformat } from '@jupyterlab/coreutils';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ServerConnection } from '@jupyterlab/services/lib/serverconnection';
import { IDiffEntry } from 'nbdime/lib/diff/diffentries';
import { NotebookDiffModel } from 'nbdime/lib/diff/model';
import { NotebookDiffWidget } from 'nbdime/lib/diff/widget';
import * as React from 'react';
import { httpGitRequest } from '../../git';

export interface INBDiffState {}

export interface INBDiffProps {
  renderMime: IRenderMimeRegistry;
}

export class NBDiff extends React.Component<INBDiffProps, INBDiffState> {
  constructor(props: INBDiffProps) {
    super(props);
  }

  render() {
    this.performDiff();
    return (
      <div>
        <ul>'Hello World 1' </ul>
        <ul> 'Hello World 2</ul>
      </div>
    );
  }

  private async performDiff(): Promise<void> {
    try {
      let response = await httpGitRequest('/nbdime/api/gitdiff', 'POST', {
        file_name: 'Untitled1.ipynb',
        ref_prev: 'HEAD',
        ref_curr: 'WORKING'
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new ServerConnection.ResponseError(response, data.message);
      }
      let base = data['base'] as nbformat.INotebookContent;
      let diff = (data['diff'] as any) as IDiffEntry[];
      let nbdModel = new NotebookDiffModel(base, diff);
      let nbdWidget = new NotebookDiffWidget(nbdModel, this.props.renderMime);
      console.log(`nbdiff widget ${nbdWidget}`);
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }
}
