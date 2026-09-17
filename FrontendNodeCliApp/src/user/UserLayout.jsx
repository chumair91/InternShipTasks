import { useContext } from "react"
import { Outlet } from "react-router-dom"
import ChatSupportButton from "../services/ChatSupportButton"
import { userContext } from "../context/UserAuthContext"
import Navbar from "../components/Navbar"



const UserLayout = () => {
    const { user } = useContext(userContext);

    return (
        <>
            <Navbar username={user?.name} />
            <Outlet />
            {user && <ChatSupportButton />}
        </>
    )
}

export default UserLayout