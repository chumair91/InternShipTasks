import { Link } from "react-router-dom"


const Task4Home = () => {
    return (
        <div className="h-screen w-screen  justify-center items-center flex flex-col">
             <Link to="/"><button className="bg-black px-5 py-2  rounded-2xl text-white text-base">Go Back</button></Link>
            <p>these are console based tasks</p>
        </div>

    )
}

export default Task4Home