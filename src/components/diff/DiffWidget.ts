import { nbformat, Private } from '@jupyterlab/coreutils';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ServerConnection } from '@jupyterlab/services/lib/serverconnection';
import { Widget, Panel } from '@phosphor/widgets';
import { IDiffEntry } from 'nbdime/lib/diff/diffentries';
import { NotebookDiffModel } from 'nbdime/lib/diff/model';
import { NotebookDiffWidget, CellDiffWidget } from 'nbdime/lib/diff/widget';
import { httpGitRequest } from '../../git';
import { ModelDB } from '@jupyterlab/observables';

export interface INBDiffState {
  nbdModel: NotebookDiffModel | undefined;
  nbdWidget: NotebookDiffWidget | undefined;
}

export interface INBDiffProps {
  renderMime: IRenderMimeRegistry;
}

export class DiffWidget extends Widget {
  private props: INBDiffProps;
  constructor(props: INBDiffProps) {
    super();
    this.id = 'phospor-nbdiff';
    // Needed for basic lay-outing
    this.addClass('nbdime-root');

    this.addClass('nbdime-Widget');

    // Needed for Collapsing unchanged cells
    this.addClass('jp-mod-hideUnchanged');

    // this.title = 'Diff via Phosphor!'
    this.props = props;
    this.performDiff();
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
          let nbdWidget = new Panel();
          nbdWidget.addClass('jp-Notebook-diff');

          for (let i = 0; i < nbdModel.chunkedCells.length; i++) {
            const chunk = nbdModel.chunkedCells[i];
            if (chunk.length === 1 && !(chunk[0].added || chunk[0].deleted)) {
              nbdWidget.addWidget(
                new CellDiffWidget(
                  chunk[0],
                  this.props.renderMime,
                  nbdModel.mimetype
                )
              );
            } else {
              // This is the case for Added/removed/modified.
              let chunkPanel = new Panel();
              chunkPanel.addClass('jp-Diff-addremchunk');
              let addedPanel = new Panel();
              addedPanel.addClass('jp-Diff-addedchunk');
              let removedPanel = new Panel();
              removedPanel.addClass('jp-Diff-removedchunk');
              for (let j = 0; j < chunk.length; j++) {
                let cell = chunk[j];
                let target = cell.deleted ? removedPanel : addedPanel;
                target.addWidget(
                  new CellDiffWidget(
                    cell,
                    this.props.renderMime,
                    nbdModel.mimetype
                  )
                );
              }
              chunkPanel.addWidget(addedPanel);
              chunkPanel.addWidget(removedPanel);
              nbdWidget.addWidget(chunkPanel);
            }
          }

          this.node.appendChild(nbdWidget.node);
          this.markUnchangedRanges(this.node);
          console.log('unchanged ranges marked');
        });
      });
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }

  // BEGIN SECTION IMPORTED FROM NBDIME
  //

  private CHUNK_PANEL_CLASS = 'jp-Notebook-diff';
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
