import * as React from 'react';

export interface INBDiffState {}

export interface INBDiffProps {}

export class NBDiff extends React.Component<INBDiffProps, INBDiffState> {
  constructor(props: INBDiffProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>'Hello World 1' </ul>
        <ul> 'Hello World 2</ul>
      </div>
    );
  }
}
