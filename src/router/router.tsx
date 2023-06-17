import { createBrowserRouter } from 'react-router-dom';
import WIP from '../pages/WIP/WIP';
import Home from '../pages/Home/Home';
import Layout from '../pages/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/wip',
    element: <WIP />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
    ],
  },
]);

export default router;
