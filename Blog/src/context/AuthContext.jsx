import { createContext, useState } from "react"

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem("user") || null);

    const login = (username) => {
        setUser(username);
        localStorage.setItem("user", username);
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    }
    return (
        <authContext.Provider value={{ user, login, logout }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider
