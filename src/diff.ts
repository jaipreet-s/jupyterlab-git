import { JupyterLab, JupyterFrontEnd } from '@jupyterlab/application';
import { NBDiffWidget } from './components/diff/NbDiffWidget';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

/**
 * Model which indicates the context in which a Git diff is being performed.
 */

export interface IDiffContext {
  currentRef: IGitRef | ISpecialRef;
  previousRef: IGitRef;
}

export interface IGitRef {
  gitRef: string;
}

export interface ISpecialRef {
  specialRef: 'WORKING' | 'INDEX';
}

export function getRefValue(ref: ISpecialRef | IGitRef): string {
  if ('specialRef' in ref) {
    return ref.specialRef;
  } else {
    return ref.gitRef;
  }
}

/**
 *
 * @param path TODO: Relative or Absolute?
 * @param app The JupyterLab application instance
 * @param diffContext the context in which the diff is being requested
 * @param renderMime
 */
export function openDiffView(
  path: string,
  app: JupyterFrontEnd,
  diffContext: IDiffContext,
  renderMime: IRenderMimeRegistry
) {
  const id = `nbdiff-${path}-${getRefValue(diffContext.currentRef)}`;

  let mainAreaItems = app.shell.widgets('main');
  let mainAreaItem = mainAreaItems.next();
  while (mainAreaItem) {
    if (mainAreaItem.id === id) {
      app.shell.activateById(id);
      break;
    }
    mainAreaItem = mainAreaItems.next();
  }
  if (!mainAreaItem) {
    const nbDiffWidget = new NBDiffWidget(renderMime, path, diffContext);
    nbDiffWidget.id = id;
    app.shell.add(nbDiffWidget, 'main');
    app.shell.activateById(nbDiffWidget.id);
  }
}
