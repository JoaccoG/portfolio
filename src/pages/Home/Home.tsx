import CodeComment from '../../shared/CodeComment/CodeComment';
import { HomeContainer } from './Home.styled';

const Home = () => {
  return (
    <HomeContainer>
      <CodeComment
        text={
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, quam, reiciendis beatae expedita exercitationem optio reprehenderit quo, ab dolores aspernatur libero eos commodi harum est? Et perferendis ut nihil explicabo!'
        }
      />
      <br />
      <CodeComment
        text={
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis vero facere dolores placeat esse asperiores, ad eligendi minus ea optio. Dolorem placeat porro eaque necessitatibus illo sit voluptatem dolor in.'
        }
      />
      <CodeComment
        text={
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut nemo, hic quisquam reiciendis inventore laudantium similique fuga deserunt accusantium dolore soluta reprehenderit aspernatur porro eligendi aut ipsum pariatur deleniti, quaerat sequi praesentium voluptate. Commodi ipsam amet laudantium adipisci doloribus iste ut itaque modi. Adipisci quasi molestias doloribus? Velit odio ipsum id reiciendis obcaecati perferendis placeat repellat, saepe possimus repudiandae aut voluptatum vero ipsam esse unde deleniti voluptatibus dolorem iste fuga! Optio, quos praesentium. Vero rem architecto dignissimos facere inventore qui perferendis, aliquid earum repellat aperiam voluptate labore velit provident error ut voluptatibus recusandae consequatur, dicta quisquam iusto nisi, sit maiores.Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut nemo, hic quisquam reiciendis inventore laudantium similique fuga deserunt accusantium dolore soluta reprehenderit aspernatur porro eligendi aut ipsum pariatur deleniti, quaerat sequi praesentium voluptate. Commodi ipsam amet laudantium adipisci doloribus iste ut itaque modi. Adipisci quasi molestias doloribus? Velit odio ipsum id reiciendis obcaecati perferendis placeat repellat, saepe possimus repudiandae aut voluptatum vero ipsam esse unde deleniti voluptatibus dolorem iste fuga! Optio, quos praesentium. Vero rem architecto dignissimos facere inventore qui perferendis, aliquid earum repellat aperiam voluptate labore velit provident error ut voluptatibus recusandae consequatur, dicta quisquam iusto nisi, sit maiores.'
        }
      />
    </HomeContainer>
  );
};

export default Home;
