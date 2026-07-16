import { useContext, useState } from "react"
import { authContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [username, setusername] = useState("");
    const { login } = useContext(authContext)
    const navigate = useNavigate();
    return (
        <div className="max-h-screen flex justify-center items-center flex-col gap-3 ">
            <label htmlFor="">Type your username</label>
            <input type="text" value={username} onChange={(e) => setusername(e.target.value)} className="p-2 border" />
            <button onClick={() => { login(username); navigate("/") }} className="p-2 bg-black border text-white rounded-md">login</button>
        </div>
    )
}

export default Login
