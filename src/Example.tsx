import { useEffect } from 'react';
import { track } from '@lib/analytics';

export const Example = () => {
  useEffect(() => {
    track('view-example-component');
  }, []);

  return <div>Example</div>;
};
