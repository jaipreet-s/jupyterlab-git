import * as React from 'react';
import { getRefDisplayValue, IDiffContext } from '../../diff';

export interface INBDiffHeaderProps {
  path: string;
  diffContext: IDiffContext;
}

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
            Current: {getRefDisplayValue(this.props.diffContext.currentRef)}
          </div>
          <div className="jp-Diff-removedchunk">
            Previous: {getRefDisplayValue(this.props.diffContext.previousRef)}
          </div>
        </div>
      </div>
    );
  }
}
