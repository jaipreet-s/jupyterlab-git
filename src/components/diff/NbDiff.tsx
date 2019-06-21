import { nbformat } from '@jupyterlab/coreutils';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ServerConnection } from '@jupyterlab/services/lib/serverconnection';
import { IDiffEntry } from 'nbdime/lib/diff/diffentries';
import { NotebookDiffModel } from 'nbdime/lib/diff/model';
import { NotebookDiffWidget } from 'nbdime/lib/diff/widget';
import * as React from 'react';
import { httpGitRequest } from '../../git';

export interface INBDiffState {
  nbdModel: NotebookDiffModel | undefined;
  nbdWidget: NotebookDiffWidget | undefined;
}

export interface INBDiffProps {
  renderMime: IRenderMimeRegistry;
}

export class NBDiff extends React.Component<INBDiffProps, INBDiffState> {
  constructor(props: INBDiffProps) {
    super(props);
    this.state = {
      nbdModel: undefined,
      nbdWidget: undefined
    };
    this.performDiff();
  }

  makeDiff() {
    const listItems = this.state.nbdModel.chunkedCells.map(() => {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: this.state.nbdWidget.node.innerHTML
          }}
        />
      );
    });
    return listItems;
  }
  render() {
    const nbdModel = this.state.nbdModel;
    return (
      <div id="root-diff">
        {nbdModel != undefined && (
          <div className="nbdime-Widget">
            <div className="nbdime-root jp-mod-hideUnchanged">
              <div
                dangerouslySetInnerHTML={{
                  __html: this.state.nbdWidget.node.innerHTML
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  private performDiff(): void {
    try {
      httpGitRequest('/nbdime/api/gitdiff', 'POST', {
        file_name: 'Untitled1.ipynb',
        ref_prev: 'HEAD',
        ref_curr: 'WORKING'
      }).then((response: Response) => {
        response.json().then((data: any) => {
          if (response.status !== 200) {
            throw new ServerConnection.ResponseError(response, data.message);
          }
          let base = data['base'] as nbformat.INotebookContent;
          let diff = (data['diff'] as any) as IDiffEntry[];
          let nbdModel = new NotebookDiffModel(base, diff);
          let nbdWidget = new NotebookDiffWidget(
            nbdModel,
            this.props.renderMime
          );
          nbdWidget.init().then(() => {
            console.log(`nbdiff widget ${nbdWidget}`);
            this.markUnchangedRanges(document.getElementById('root-diff'));
            this.setState({
              nbdModel: nbdModel,
              nbdWidget: nbdWidget
            });
          });
        });
      });
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }

  // BEGIN SECTION IMPORTED FROM NBDIME
  //

  private CHUNK_PANEL_CLASS = 'jp-Diff-addremchunk';
  private CELLDIFF_CLASS = 'jp-Cell-diff';
  private UNCHANGED_DIFF_CLASS = 'jp-Diff-unchanged';

  /**
   * Gets the chunk element of an added/removed cell, or the cell element for others
   * @param cellElement
   */
  private getChunkElement(cellElement: Element): Element {
    if (
      !cellElement.parentElement ||
      !cellElement.parentElement.parentElement
    ) {
      return cellElement;
    }
    let chunkCandidate = cellElement.parentElement.parentElement;
    if (chunkCandidate.classList.contains(this.CHUNK_PANEL_CLASS)) {
      return chunkCandidate;
    }
    return cellElement;
  }
  private markUnchangedRanges(root: HTMLElement) {
    let children = root.querySelectorAll(`.${this.CELLDIFF_CLASS}`);
    let rangeStart = -1;
    for (let i = 0; i < children.length; ++i) {
      let child = children[i];
      if (!child.classList.contains(this.UNCHANGED_DIFF_CLASS)) {
        // Visible
        if (rangeStart !== -1) {
          // Previous was hidden
          let N = i - rangeStart;
          this.getChunkElement(child).setAttribute(
            'data-nbdime-NCellsHiddenBefore',
            N.toString()
          );
          rangeStart = -1;
        }
      } else if (rangeStart === -1) {
        rangeStart = i;
      }
    }
    if (rangeStart !== -1) {
      // Last element was part of a hidden range, need to mark
      // the last cell that will be visible.
      let N = children.length - rangeStart;
      if (rangeStart === 0) {
        // All elements were hidden, nothing to mark
        // Add info on root instead
        let tag = root.querySelector('.jp-Notebook-diff') || root;
        tag.setAttribute('data-nbdime-AllCellsHidden', N.toString());
        return;
      }
      let lastVisible = children[rangeStart - 1];
      this.getChunkElement(lastVisible).setAttribute(
        'data-nbdime-NCellsHiddenAfter',
        N.toString()
      );
    }
  }
}
