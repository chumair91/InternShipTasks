import { useContext } from "react";
import { Link } from "react-router-dom"
import { themeContext } from "../context/ThemeContext";


const PostCard = ({ title, date, excerpt, id }) => {
  const { theme } = useContext(themeContext);
  return (
    <Link to={`/post/${id}`}>
      <div className={`border p-4 h-58 w-60 rounded shadow-sm hover:cursor-pointer ${theme==="light"?'hover:bg-cyan-100':'hover:bg-gray-800' }  hover:scale-105 transition-all duration-150`}>
        <h2 className="font-bold text-lg">{title}</h2>
        <p className={`text-sm  ${theme === "light" ? 'text-gray-500' : 'text-white'}`}>{date}</p>
        <p className={` mt-2  ${theme === "light" ? 'text-gray-700' : 'text-white'}`}>{excerpt}</p>
      </div>
    </Link>

  )
}

export default PostCard
