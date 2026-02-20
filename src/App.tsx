import { Title } from '@shared/Title/Title';
import { Overlay } from '@components/Overlay/Overlay';

export const App = () => {
  return (
    <>
      <Overlay />
      <main>
        <Title as="h1">Joaquin Godoy</Title>
      </main>
    </>
  );
};
