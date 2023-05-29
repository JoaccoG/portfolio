import { Outlet } from 'react-router-dom';
import Header from '../../shared/Header/Header';
import { MainContainer } from './Layout.styled';
import Footer from '../../shared/Footer/Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <MainContainer>
        <Outlet />
      </MainContainer>
      <Footer />
    </>
  );
};

export default Layout;
