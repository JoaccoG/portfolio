import { Outlet } from 'react-router-dom';
import Header from '../../features/Header/Header';
import { MainContainer } from './Layout.styled';

const Layout = () => {
  return (
    <>
      <Header />
      <MainContainer>
        <Outlet />
      </MainContainer>
    </>
  );
};

export default Layout;
