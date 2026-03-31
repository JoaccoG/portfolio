import { useSmoothScroll } from '@hooks/useSmoothScroll';
import { Overlay } from '@components/Overlay/Overlay';
import { Header } from '@components/Header/Header';
import { Footer } from '@components/Footer/Footer';
import { Hero } from '@pages/Hero/Hero';
import { About } from '@pages/About/About';
import { Projects } from '@pages/Projects/Projects';

export const App = () => {
  const { scrollTo } = useSmoothScroll();

  return (
    <>
      <Overlay />
      <Header scrollTo={scrollTo} />
      <main>
        <Hero />
        <About />
        <Projects />
      </main>
      <Footer />
    </>
  );
};
