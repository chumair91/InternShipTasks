import React from "react";



const ExpensiveChild = ({ handleClick }) => {
    console.log("child rendered");

    return (
        <div>
            <button onClick={handleClick}>Click me</button>
        </div>
    )
}

export default React.memo(ExpensiveChild);