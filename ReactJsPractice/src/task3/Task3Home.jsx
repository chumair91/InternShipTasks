import { Link } from "react-router-dom"


const Task3Home = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className='bg-amber-300 flex flex-col gap-4 items-center px-7 py-16 rounded-lg'>
                <Link to="/"><button className="bg-black px-5 py-2  rounded-2xl text-white text-base">Go Back</button></Link>
                <h1 className='text-6xl font-bold '>Welcome</h1>
                <p className='text-lg text-gray-600'>Please choose a task:</p>

                <ul className='flex flex-col gap-3'>
                    <li className='bg-black px-6 py-2 text-lg text-white hover:bg-gray-700 transition-all duration-200'><Link to="/task3/functiondeepdive">1. Function DeepDive</Link></li>
                    <li className='bg-black px-6 py-2 text-lg  text-white hover:bg-gray-700 transition-all duration-200'><Link to="/task3/arraymethods">2. Array Methods</Link></li>
                    <li className='bg-black px-6 py-2 text-lg  text-white hover:bg-gray-700 transition-all duration-200'><Link to="/task3/destructuring">3. Destructuring</Link></li>

                </ul>
            </div>
        </div>
    )
}

export default Task3Home