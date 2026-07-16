import { useContext } from "react";
import { Navigate} from "react-router-dom"
import { authContext } from "../context/AuthContext";
Navigate

const Proxy = ({ children }) => {
    

    const { user } = useContext(authContext);
    console.log("user",user);
    
    if (!user) {
        return <Navigate to='/login'/>
    } 
        return children;
    

}

export default Proxy
