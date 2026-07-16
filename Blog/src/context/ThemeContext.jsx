import { createContext, useEffect, useState } from "react"


// eslint-disable-next-line react-refresh/only-export-components
export const themeContext = createContext();
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(()=>localStorage.getItem("theme") || "dark");
    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light")
    }

    useEffect(() => {
        localStorage.setItem("theme",theme);
    }, [theme])
    return (
        <themeContext.Provider value={{ theme,  toggleTheme }}>
            {children}
        </themeContext.Provider>
    )
}

export default ThemeProvider
