import { nbformat } from '@jupyterlab/coreutils';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ServerConnection } from '@jupyterlab/services/lib/serverconnection';
import { IDiffEntry } from 'nbdime/lib/diff/diffentries';
import { CellDiffModel, NotebookDiffModel } from 'nbdime/lib/diff/model';
import { CellDiffWidget, NotebookDiffWidget } from 'nbdime/lib/diff/widget';
import * as React from 'react';
import { RefObject } from 'react';
import { httpGitRequest } from '../../git';
import { Panel } from '@phosphor/widgets';
import { IDiffContext } from '../../diff';
import { NBDiffHeader } from './NBDiffHeader';
import { IDiffProps } from './Diff';

export interface ICellDiffProps {
  renderMime: IRenderMimeRegistry;
  cellChunk: CellDiffModel[];
  mimeType: string;
}

export class CellDiff extends React.Component<ICellDiffProps, {}> {
  private widgetRef: RefObject<HTMLDivElement> = React.createRef<
    HTMLDivElement
  >();

  constructor(props: ICellDiffProps) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    const chunk = this.props.cellChunk;

    let widget;
    if (chunk.length === 1 && !(chunk[0].added || chunk[0].deleted)) {
      widget = new CellDiffWidget(
        chunk[0],
        this.props.renderMime,
        this.props.mimeType
      );
    } else {
      // This is the case for Added/removed/modified.
      widget = new Panel();
      widget.addClass('jp-Diff-addremchunk');
      let addedPanel = new Panel();
      addedPanel.addClass('jp-Diff-addedchunk');
      let removedPanel = new Panel();
      removedPanel.addClass('jp-Diff-removedchunk');
      for (let j = 0; j < chunk.length; j++) {
        let cell = chunk[j];
        let target = cell.deleted ? removedPanel : addedPanel;
        target.addWidget(
          new CellDiffWidget(cell, this.props.renderMime, this.props.mimeType)
        );
      }
      widget.addWidget(addedPanel);
      widget.addWidget(removedPanel);
    }

    this.widgetRef.current.appendChild(widget.node);
  }

  render() {
    return <div ref={this.widgetRef} />;
  }
}

export interface INBDiffState {
  nbdModel: NotebookDiffModel;
  errorMessage: string;
}

export class NBDiff extends React.Component<IDiffProps, INBDiffState> {
  constructor(props: IDiffProps) {
    super(props);
    this.state = {
      nbdModel: undefined,
      errorMessage: undefined
    };
    this.performDiff(props.diffContext);
  }

  render() {
    if (this.state.errorMessage !== undefined) {
      return (
        <div>
          <span className="jp-git-diff-error">
            Failed to fetch diff with error:
            <span className="jp-git-diff-error-message">
              {this.state.errorMessage}
            </span>
          </span>
        </div>
      );
    } else if (this.state.nbdModel !== undefined) {
      const cellComponents = this.state.nbdModel.chunkedCells.map(cellChunk => (
        <CellDiff
          cellChunk={cellChunk}
          renderMime={this.props.renderMime}
          mimeType={this.state.nbdModel.mimetype}
        />
      ));
      return (
        <div className="jp-git-diff-Widget">
          <div className="jp-git-diff-root jp-mod-hideunchanged">
            <div className="jp-git-Notebook-diff">
              <NBDiffHeader {...this.props} />
              {cellComponents}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  /**
   * Based on the Diff Context , calls the server API with the revant paremeters
   * to
   * @param diffContext the context in which to perform the diff
   */
  private performDiff(diffContext: IDiffContext): void {
    try {
      // Resolve what API parameter to call.
      let currentRefValue;
      if ('specialRef' in diffContext.currentRef) {
        currentRefValue = {
          special: diffContext.currentRef.specialRef
        };
      } else {
        currentRefValue = {
          git: diffContext.currentRef.gitRef
        };
      }

      console.log(`Performing diff for ${this.props.path}`);

      httpGitRequest('/nbdime/api/gitdiff', 'POST', {
        file_path: this.props.path,
        ref_prev: { git: diffContext.previousRef.gitRef },
        ref_curr: currentRefValue
      }).then((response: Response) => {
        response
          .json()
          .then((data: any) => {
            if (response.status !== 200) {
              // Handle error
              this.setState({
                errorMessage: data.message
              });
            } else {
              // Handle response
              let base = data['base'] as nbformat.INotebookContent;
              let diff = (data['diff'] as any) as IDiffEntry[];
              let nbdModel = new NotebookDiffModel(base, diff);
              this.setState({
                nbdModel: nbdModel
              });
            }
          })
          .catch(reason => {
            // Handle error
            this.setState({
              errorMessage: reason.message || ''
            });
          });
      });
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }
}
