import { JupyterLab } from '@jupyterlab/application';

import { FileList } from './FileList';

import { pastCommitsContainerStyle } from '../componentsStyle/PastCommitsStyle';

import { IDiffCallback } from '../git';

import * as React from 'react';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

/** Interface for PastCommits component props */
export interface IPastCommitsProps {
  currentFileBrowserPath: string;
  topRepoPath: string;
  inNewRepo: boolean;
  showList: boolean;
  stagedFiles: any;
  unstagedFiles: any;
  untrackedFiles: any;
  app: JupyterLab;
  refresh: any;
  diff: IDiffCallback;
  sideBarExpanded: boolean;
  renderMime: IRenderMimeRegistry;
}

export class PastCommits extends React.Component<IPastCommitsProps, {}> {
  render() {
    if (this.props.sideBarExpanded) {
      return null;
    }
    return (
      <div className={pastCommitsContainerStyle}>
        <FileList
          currentFileBrowserPath={this.props.currentFileBrowserPath}
          topRepoPath={this.props.topRepoPath}
          stagedFiles={this.props.stagedFiles}
          unstagedFiles={this.props.unstagedFiles}
          untrackedFiles={this.props.untrackedFiles}
          app={this.props.app}
          refresh={this.props.refresh}
          sideBarExpanded={this.props.sideBarExpanded}
          display={this.props.showList}
          renderMime={this.props.renderMime}
        />
      </div>
    );
  }
}
