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
