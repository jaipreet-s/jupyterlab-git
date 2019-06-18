import * as React from 'react';
import { IDiffContext, IGitRef, ISpecialRef } from './model';

export interface INBDiffHeaderProps {
  path: string;
  diffContext: IDiffContext;
}

/**
 * A React component to render the header which shows metadata around the diff
 * being rendered. Shows the path to the file and the previous and current ref
 * being used for the diff.
 */
export class NBDiffHeader extends React.Component<INBDiffHeaderProps, {}> {
  constructor(props: INBDiffHeaderProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="jp-git-diff-header-path">{this.props.path}</div>
        <div className="jp-Diff-addremchunk jp-git-diff-header">
          <div className="jp-Diff-addedchunk">
            Current:{' '}
            {this.getRefDisplayValue(this.props.diffContext.currentRef)}
          </div>
          <div className="jp-Diff-removedchunk">
            Previous:{' '}
            {this.getRefDisplayValue(this.props.diffContext.previousRef)}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Utility method to get a user-friendly display text for a given ref.
   */
  private getRefDisplayValue = (ref: ISpecialRef | IGitRef): string => {
    const SPECIAL_REFS = {
      WORKING: {
        displayName: 'Changed'
      },
      INDEX: {
        displayName: 'Staged'
      }
    };

    if ('specialRef' in ref) {
      return SPECIAL_REFS[ref.specialRef].displayName;
    } else {
      return ref.gitRef;
    }
  };
}
