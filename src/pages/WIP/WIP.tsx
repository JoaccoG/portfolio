import CodeComment from '../../shared/CodeComment/CodeComment';
import { MainContainer, WIPContainer } from './WIP.styled';

const WIP = () => {
  return (
    <MainContainer>
      <WIPContainer>
        <section className="wip__content">
          <div className="wip-content__title">
            <span>Hello world! I am</span>
            <h1>Joaquín Godoy</h1>
            <h2>&gt; Full Stack Developer</h2>
          </div>
          <div className="wip-content__text">
            <CodeComment text="My portfolio is currently like a WIP painting: messy, with some bright spots and some rough edges, but slowly taking shape into a masterpiece. I'm adding brushstrokes and refining the details to make it truly reflect my style. Stay tuned for the big reveal! I promise it will be worth the wait and, who knows, maybe one day it will hang in a museum like paintings! Or, at least, on a manager's hired wall. " />
            <p className="wip-content__text--github">
              <span className="snippet__declaration">const</span>{' '}
              <span className="snippet__name">githubProfile</span> ={' '}
              <span className="snippet__code">
                '
                <a
                  href="https://github.com/JoaccoG"
                  target="_blank"
                  rel="noreferrer"
                  className="snippet__code--link"
                >
                  https://github.com/JoaccoG
                </a>
                '
              </span>
            </p>
          </div>
        </section>
        <section className="wip__img">
          <img
            src="https://media.giphy.com/media/3iyKHMIKg5VWG6qHUm/giphy.gif"
            alt=""
          />
        </section>
      </WIPContainer>
    </MainContainer>
  );
};

export default WIP;
