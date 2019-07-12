import { JupyterLab } from '@jupyterlab/application';
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

const SPECIAL_REFS = {
  WORKING: {
    displayName: 'Changed'
  },
  INDEX: {
    displayName: 'Staged'
  }
};

/**
 * Utility method to get the string value of any type of ref.
 */
export function getRefValue(ref: ISpecialRef | IGitRef): string {
  if ('specialRef' in ref) {
    return ref.specialRef;
  } else {
    return ref.gitRef;
  }
}

/**
 * Utility method to get a user-friendly display text for a given ref.
 */
export function getRefDisplayValue(ref: ISpecialRef | IGitRef): string {
  if ('specialRef' in ref) {
    return SPECIAL_REFS[ref.specialRef].displayName;
  } else {
    return ref.gitRef;
  }
}

/**
 * Method to open a main menu panel to show the diff of a given Notebook file.
 * If one already exists, just activates the existing one.
 *
 * @param path the path relative to the Jupyter server root.
 * @param app The JupyterLab application instance
 * @param diffContext the context in which the diff is being requested
 * @param renderMime
 */
export function openDiffView(
  path: string,
  app: JupyterLab,
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
    app.shell.addToMainArea(nbDiffWidget);
    app.shell.activateById(nbDiffWidget.id);
  }
}
