import { useState } from "react"
import { Link } from "react-router-dom";


const UnitConvertor = () => {
    const [input1, setInput1] = useState(0);
    const [input2, setInput2] = useState("");
    let [showResult, setShowResult] = useState(false)
    let [result, setResult] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!input2) {
            setResult("Please select a conversion type");
            return;
        }

        const intInput = Number(input1);

        if (isNaN(intInput)) {
            setResult("Please enter a valid number");
            return;

        }
        if (intInput < 0) {
            setResult("Value cannot be negative");
            return;

        }
        console.log(input1);
        console.log(input2);

        if (input2 === "kmtomiles") {
            const res = kmToMiles(intInput);
            setResult(res);
        } else if (input2 === "celciustofar") {
            const res = celciusToFahrenhiet(intInput)
            setResult(res)
        } else if (input2 === "sectohms") {
            const res = secToHMSFormat(intInput)
            setResult(res)
        } else {
            setResult("plz select one option");
            return;
        }
        console.log(result);

    }

    const kmToMiles = (km) => {
        return km * 0.621371;
    }
    const celciusToFahrenhiet = (c) => {
        return (c * 1.8) + 32;
    }
    const secToHMSFormat = (sec) => {
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const seconds = sec % 60;
        let tempResult = hours + " Hrs" + " " + minutes + " Mins" + " " + seconds + " Sec";
        return tempResult;

    }
    return (
        <div className="h-screen w-screen   flex justify-center items-center">
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center items-center flex-col p-5 gap-3">
                    <Link to="/"> <button className="bg-amber-300 px-5 py-2  rounded-2xl text-black text-base">Go Back</button></Link>
                    <h1 className="font-bold text-2xl text-blue-400 mb-3">Unit Convertor</h1>
                    <div className="relative flex flex-col">
                        <label className="text-gray-400 text-sm" htmlFor="inp1">Write Your Value</label>
                        <input type="number" value={input1} onChange={(e) => setInput1(e.target.value)} required name="inp1" className="border px-3 py-2" />

                    </div>

                    <div className=" flex flex-col ">
                        <label className="text-gray-400 text-sm " htmlFor="inp2">Select An Option</label>
                        <label htmlFor="kmtomiles"> <input type="radio" name="inp2" id="kmtomiles" value="kmtomiles" className="border px-3 py-2" onChange={(e) => setInput2(e.target.value)} checked={input2 === "kmtomiles"} />Km To Miles</label>
                        <label htmlFor="celciustofar"><input type="radio" name="inp2" id="celciustofar" value="celciustofar" onChange={(e) => setInput2(e.target.value)} className="border px-3 py-2" checked={input2 === "celciustofar"} />Celcius To Fahrenhiet</label>
                        <label htmlFor="sectohms"><input type="radio" name="inp2" id="sectohms" value="sectohms" onChange={(e) => setInput2(e.target.value)} className="border px-3 py-2" checked={input2 === "sectohms"} />Seconds to H:M:S Format</label>
                    </div>
                    <button type="submit" onClick={() => setShowResult(true)} className="bg-black px-8 py-3 w-full rounded-2xl text-white text-base ">Convert</button>
                    <p className={`p-3 ${showResult ? 'block' : 'hidden'}`}>{result}</p>
                </div>
            </form >

        </div >
    )
}

export default UnitConvertor