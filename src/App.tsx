import { Routes, Route } from 'react-router';
import { Header } from '@components/Header/Header';
import { Footer } from '@components/Footer/Footer';

export const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route index element={<h1>Home</h1>} />
          <Route path="about" element={<h1>About</h1>} />
          <Route path="work" element={<h1>Work</h1>} />
          <Route path="blog">
            <Route index element={<h1>Blog</h1>} />
            <Route path=":entry" element={<h1>Blog Entry</h1>} />
          </Route>
          <Route path="contact" element={<h1>Contact</h1>} />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};
