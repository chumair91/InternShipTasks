import { useParams } from "react-router-dom"
import { posts } from "../data/posts";


const PostDetails = () => {
    const {id}=useParams();
     
    const post=posts.find(p=>p.id==id);
    return (
        <div>
            <div className="border p-4 rounded shadow-sm ">
                <h2 className="font-bold text-lg">{post.title}</h2>
                <p className="text-sm text-gray-500">{post.date}</p>
                <p className="text-gray-700 mt-2">{post.excerpt}</p>
                <p className="text-gray-700 mt-2">{post.content}</p>
                
            </div>
        </div>
    )
}

export default PostDetails
