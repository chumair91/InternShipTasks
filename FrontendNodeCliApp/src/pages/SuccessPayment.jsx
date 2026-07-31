import { useContext } from "react"
import { userContext } from "../context/UserAuthContext"
import { Link } from "react-router-dom";


const SuccessPayment = () => {
    const { user } = useContext(userContext);
    return (
        <div className='h-screen w-full flex justify-center items-center flex-col'>

            <h1 className="text-green-400 text-xl font-bold">You have Successfully Subscribed to {user?.plan} plan </h1>
            <Link to='/products'>Back to <span className="underline">homepage </span> </Link>
        </div>
    )
}

export default SuccessPayment
