import { useState } from "react";
import { Link } from "react-router-dom";


const FizzBuzz = () => {
    const [result, setResult] = useState(null);
    const fizzBuzzRunner = () => {
        let fizzCount = 0;
        let buzzCount = 0;
        let fizzBuzzCount = 0;
        for (let i = 1; i <= 100; i++) {
            if (i % 3 === 0 && i % 5 === 0) {
                console.log('fizzBuzz');
                fizzBuzzCount++;
            } else if (i % 3 === 0) {
                console.log('fizz');
                fizzCount++;
            } else if (i % 5 === 0) {
                console.log('buzz');
                buzzCount++;
            }

        }
        setResult({
            fizz: fizzCount,
            buzz: buzzCount,
            fizzBuzz: fizzBuzzCount
        })
    }
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center gap-3">
            <Link to="/task2"> <button className="bg-amber-300 px-5 py-2  rounded-2xl text-black text-base">Go Back</button></Link>

            <p>Number range is 1 to 100</p>
            <button className="bg-black px-8 py-3  rounded-2xl text-white text-base " onClick={fizzBuzzRunner}>Run Game</button>
            {result && <p>Open Terminal to see result</p>}
            {result && <p className="text-lg">fizz:{result.fizz} | buzz:{result.buzz} | fizzBuzz:{result.fizzBuzz} </p>}
        </div>
    )
}

export default FizzBuzz