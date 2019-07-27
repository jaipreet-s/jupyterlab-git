import { mount, shallow } from 'enzyme';
import 'jest';
import * as React from 'react';
import { Diff, IDiffProps } from '../../src/components/diff/Diff';
import { NBDiff } from '../../src/components/diff/NbDiff';
import {
  isMonacoSupported,
  PlainTextDiff
} from '../../src/components/diff/PlainTextDiff';

jest.mock('../../src/components/diff/PlainTextDiff');

describe('Diff', () => {
  it('should render nbdiff provider component when supported', function() {
    // Given
    const props: IDiffProps = {
      path: '/path/to/File.ipynb',
      topRepoPath: '/top/repo/path',
      diffContext: {
        currentRef: { specialRef: 'WORKING' },
        previousRef: { gitRef: '83baee' }
      }
    };

    (isMonacoSupported as jest.Mock).mockReturnValueOnce(true);

    // When
    const node = shallow(<Diff {...props} />);

    // Then
    expect(node.find(NBDiff)).toHaveLength(1);
  });

  it('should render plaintextdiff provider component when supported', function() {
    // Given
    const props: IDiffProps = {
      path: '/path/to/File.py',
      topRepoPath: '/top/repo/path',
      diffContext: {
        currentRef: { specialRef: 'WORKING' },
        previousRef: { gitRef: '83baee' }
      }
    };

    (isMonacoSupported as jest.Mock).mockReturnValueOnce(true);

    // When
    const node = mount(<Diff {...props} />);

    // Then
    expect(node.find(PlainTextDiff)).toHaveLength(1);
  });

  it('should not render anything when not supported', function() {
    // Given
    const props: IDiffProps = {
      path: '/path/to/.DS_Store',
      topRepoPath: '/top/repo/path',
      diffContext: {
        currentRef: { specialRef: 'WORKING' },
        previousRef: { gitRef: '83baee' }
      }
    };

    (isMonacoSupported as jest.Mock).mockReturnValueOnce(false);

    // When
    const node = shallow(<Diff {...props} />);

    // Then
    expect(node.html()).toBe('');
  });
});
