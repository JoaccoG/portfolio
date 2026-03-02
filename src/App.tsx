import { useSmoothScroll } from '@hooks/useSmoothScroll';
import { Overlay } from '@components/Overlay/Overlay';
import { Header } from '@components/Header/Header';
import { Hero } from '@pages/Hero/Hero';
import { About } from '@pages/About/About';

export const App = () => {
  const { scrollTo } = useSmoothScroll();

  return (
    <>
      <Overlay />
      <Header scrollTo={scrollTo} />
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
};
