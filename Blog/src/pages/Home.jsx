import PostCard from "../components/PostCard";
import { posts } from "../data/posts";

const Home = () => {


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {posts.map((p) => {
       return  <PostCard  key={p.id} {...p} />
      })}

    </div>
  )
}

export default Home
