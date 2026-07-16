import { createContext } from "react"
import useLocalStorage from "../hooks/useLocalStorage";


// eslint-disable-next-line react-refresh/only-export-components
export const themeContext = createContext();
const ThemeProvider = ({ children }) => {
    // const [theme, setTheme] = useState(()=>localStorage.getItem("theme") || "dark");
   const [theme, setTheme] = useLocalStorage("theme", "light");
    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light")
    }


    return (
        <themeContext.Provider value={{ theme,  toggleTheme }}>
            {children}
        </themeContext.Provider>
    )
}

export default ThemeProvider
