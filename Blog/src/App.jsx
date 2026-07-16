import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import PostDetails from "./pages/PostDetails"
import NotFound from "./pages/NotFound"
import AboutUs from "./pages/AboutUs"
import { useContext } from "react"
import { themeContext } from "./context/ThemeContext"
import Proxy from "./pages/Proxy"
import Login from "./pages/Login"
import { authContext } from "./context/AuthContext"



const App = () => {
  const { theme } = useContext(themeContext);
  const { user } = useContext(authContext);
 console.log("user",user);
 

  return (
    <div className={`min-h-screen  ${theme === "light" ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <header className="p-4">
        <Navbar />
        <p>{theme}</p>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/post/:id" element={<Proxy>
          <PostDetails />
        </Proxy>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
