import React, { useCallback, useState } from "react"
import ExpensiveChild from "../components/ExpensiveChild";


const Parent = () => {
    const [count, setCount] = useState(0);
   
    const handleClick =  useCallback(() => {
        console.log("Child Button Clicked");
    },[]);

    return (
        <div>
            <h1>Count : {count}</h1>
            <button
                onClick={() => setCount(c => c + 1)}
                className="bg-black text-white px-4 py-2"
            >
                Increase Count
            </button>
           
            <ExpensiveChild handleClick={handleClick} />

        </div>
    )
}

export default Parent