import { NavLink, useNavigate } from "react-router-dom"
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";
import { useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import { authContext } from "../context/AuthContext";


const Navbar = () => {
  const { theme, toggleTheme } = useContext(themeContext);
  const { user, logout } = useContext(authContext);

    const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-amber-600">Blogify</h1>
      <div className="flex gap-5 mr-3">
        <NavLink className={({ isActive }) => `${isActive ? 'border-b-8 border-b-blue-500 ' : "text-gray-400 hover:bg-gray-700 hover:text-white "} text-base px-2 py-1`} to="/">Home</NavLink>
        <NavLink className={({ isActive }) => `${isActive ? 'border-b-8 border-b-blue-500 ' : "text-gray-400 hover:bg-gray-700 hover:text-white"} text-base px-2 py-1`} to="/about">About</NavLink>
      </div>
      <div>
        {user ? <div className="flex gap-1"><p className="border p-1 rounded-md">{user}</p> <button className="border p-1 rounded-md" onClick={logout}>logout</button></div> : <button onClick={handleLoginClick}>login</button>}
      </div>
      <div>
        {theme === "light" ? <FaToggleOff onClick={toggleTheme} size={30} /> : <FaToggleOn onClick={toggleTheme} size={30} />}

      </div>
    </div>
  )
}

export default Navbar
