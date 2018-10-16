import {Dialog, showErrorMessage, ToolbarButton} from "@jupyterlab/apputils";
import {Widget} from "@phosphor/widgets";


export class GitClone extends Widget {
    constructor() {
        super();
        this.id = 'git-clone'

        let toolbar = document.getElementsByClassName('p-Widget jp-Toolbar jp-FileBrowser-toolbar')[0];
        toolbar.appendChild(makeGitButton().node)
        let gitCloneButton: HTMLElement = document.createElement('div')
        gitCloneButton.id = 'git-clone-button';
        toolbar.appendChild(gitCloneButton);
    }

    makeGitButton(): ToolbarButton {
        let newFolder = new ToolbarButton({
            iconClassName: 'jp-NewFolderIcon jp-Icon jp-Icon-16',
            onClick: () => {
                doGitClone()
            },
            tooltip: 'New Folder'
        });
        return newFolder
    }

    makeApiCall(cloneUrl: string) {
        return Promise.reject()
    }
}

export function addGitCloneToFileBrowser(): void {
    let toolbar = document.getElementsByClassName('p-Widget jp-Toolbar jp-FileBrowser-toolbar')[0];
    toolbar.appendChild(makeGitButton().node)
    let gitCloneButton: HTMLElement = document.createElement('div')
    gitCloneButton.id = 'git-clone-button';
    toolbar.appendChild(gitCloneButton);

    // const element = <ToolbarButtonComponent iconClassName = {'jp-NewFolderIcon jp-Icon jp-Icon-16'} />;
    // tooltip = {'Clone Git Repo'}
    // onClick = {this.doGitClone}
    // ReactDOM.render(element, document.getElementById('git-clone-button'));
};

async function doGitClone(): Promise<void> {
    const dialog = new Dialog({
        title: 'Clone a repo',
        body: createRedirectForm(),
        focusNodeSelector: 'input',
        buttons: [
            Dialog.cancelButton(),
            Dialog.okButton({label: 'CLONE'})
        ]
    });

    const result = await dialog.launch();
    dialog.dispose();

    console.log('RESULT: ', result);

    if (typeof result.value != 'undefined' && result.value) {
        const cloneUrl = result.value;
        makeApiCall(cloneUrl).then(result => console.log('Clone succeeded')).catch(err => showErrorMessage('Clone failed', ''))
    } else {
        console.log('No action required')
    }

}


export function makeGitButton(): ToolbarButton {
    let newFolder = new ToolbarButton({
        iconClassName: 'jp-NewFolderIcon jp-Icon jp-Icon-16',
        onClick: () => {
            doGitClone()
        },
        tooltip: 'New Folder'
    });
    return newFolder
}

async function makeApiCall(cloneUrl: string) {
    return Promise.reject()
}

/**
 * Return a new redirect form, populated with default language.
 */
export function createRedirectForm(): RedirectForm {
    const form = new RedirectForm();

    form.label = 'Enter the Clone URI of the repository';
    form.placeholder = 'https://github.com/jupyterlab/';

    return form;
}

/**
 * A namespace for private module data.
 */
namespace Private {
    /**
     * Create the redirect form's content.
     */
    export function createNode(): HTMLElement {
        const node = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const text = document.createElement('span');
        const warning = document.createElement('div');

        node.className = 'jp-RedirectForm';
        warning.className = 'jp-RedirectForm-warning';

        label.appendChild(text);
        label.appendChild(input);
        node.appendChild(label);
        node.appendChild(warning);

        return node;
    }
}

/**
 * The UI for the recovery option to redirect to a different workspace.
 */
export class RedirectForm extends Widget {


    /**
     * Create a redirect form.
     */
    constructor() {
        super({node: Private.createNode()});
    }

    /**
     * The text label of the form.
     */
    get label(): string {
        return this.node.querySelector('label span').textContent;
    }

    set label(label: string) {
        this.node.querySelector('label span').textContent = label;
    }

    /**
     * The input placeholder.
     */
    get placeholder(): string {
        return this.node.querySelector('input').placeholder;
    }

    set placeholder(placeholder: string) {
        this.node.querySelector('input').placeholder = placeholder;
    }

    /**
     * The warning message.
     */
    get warning(): string {
        return this.node.querySelector('.jp-RedirectForm-warning').textContent;
    }

    set warning(warning: string) {
        this.node.querySelector('.jp-RedirectForm-warning').textContent = warning;
    }

    /**
     * Returns the input value.
     */
    getValue(): string {
        return encodeURIComponent(this.node.querySelector('input').value);
    }
}
