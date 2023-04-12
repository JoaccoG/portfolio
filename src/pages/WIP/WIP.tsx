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
            <p>
              &#47;&#47; My portfolio is currently like a <br />
              &#47;&#47; work-in-progress painting: messy <br />
              &#47;&#47; with some bright spots and some <br />
              &#47;&#47; rough edges, but slowly taking <br />
              &#47;&#47; shape into a masterpiece. <br />
              &#47;&#47; I'm adding brushstrokes and <br />
              &#47;&#47; refining the details to make it <br />
              &#47;&#47; truly reflect my style.
            </p>
            <p>
              &#47;&#47; Stay tuned for the big reveal! <br />
              &#47;&#47; I promise it will be worth the <br />
              &#47;&#47; wait and, who knows, maybe one <br />
              &#47;&#47; day it will hang in a museum! <br />
              &#47;&#47; Or, at least, on a manager's "hired" wall.
            </p>
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
