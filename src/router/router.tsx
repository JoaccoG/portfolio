import { createBrowserRouter } from 'react-router-dom';
import WIP from '../pages/WIP/WIP';

const router = createBrowserRouter([
  {
    path: '/',
    element: <WIP />,
  },
]);

export default router;
