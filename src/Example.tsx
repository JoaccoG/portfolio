import { useEffect } from 'react';

export const Example = () => {
  useEffect(() => {
    umami.track('view-example-component');
  }, []);

  return <div>Example</div>;
};
