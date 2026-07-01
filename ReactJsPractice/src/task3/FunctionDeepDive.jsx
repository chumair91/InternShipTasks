import { useState } from "react";
import { Link } from "react-router-dom"


const FunctionDeepDive = () => {
    const [inputVal, setInputVal] = useState("");
    const [operations, setOperations] = useState("");
    const [result, setResult] = useState(null);
    const isPalindrome = () => {
        let num1 = Number(inputVal);
        let reserve = 0;
        while (num1 != 0) {
            const offset = num1 % 10;
            reserve = (reserve * 10) + offset;
            num1 = Math.floor(num1 / 10);

        }
        if (reserve === Number(inputVal)) {
            setResult("Palindrome")
        } else {
            setResult("Not a palindrome")
        }
    }

    const isFactorial = () => {
        let result = 1;
        for (let i = 1; i < Number(inputVal); i++) {
            result = result * (i + 1);

        }

        setResult(result)

    }

    const reverseString = () => {
        let reversed = "";
        for (let i = inputVal.length - 1; i >= 0; i--) {
            reversed += inputVal[i];

        }
        return reversed;
    }

    function submitHandler(e) {
        e.preventDefault()
        if (operations === "isPalindrome") {
            isPalindrome();
        } else if (operations === "factorial") {
            isFactorial()
        } else if (operations === "reverseString") {
            setResult(reverseString())
        } else if (operations === "primeFinder") {
            if (primeFinder()) {
                setResult("Prime Number")
            } else {
                setResult("Not a prime Number")
            }
        }else if (operations==="sumOfDigit") {
            setResult(sumOfDigits())
        }
    }

    function primeFinder() {
        let num = Number(inputVal);
        if (num <= 1) {
            return false;
        }
        for (let i = 2; i < num; i++) {
            if (num % i === 0) {
                return false;
            }


        }
        return true;
    }

    function sumOfDigits(){
        let num=Number(inputVal);
        let result=0;
        while (num!=0) {
            result+=num%10;
             num = Math.floor(num / 10);
        }
        return result;
    }
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <form onSubmit={submitHandler} className="flex justify-center items-center flex-col gap-2">
                <Link to="/task3"> <button className="bg-amber-300 px-5 py-2  rounded-2xl text-black text-base">Go Back</button></Link>
                <h1 className='text-4xl font-bold '>lets Start</h1>
                <label htmlFor="finp">Write your Value</label>
                <input className="border px-3 py-2" type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} id="finp" />
                {/* operations  */}
                <label htmlFor="isPalindrome">  <input type="radio" name="operation" id="isPalindrome" value="isPalindrome" onChange={(e) => setOperations(e.target.value)} /> palindrome Finder</label>
                <label htmlFor="factorial">  <input type="radio" name="operation" id="factorial" value="factorial" onChange={(e) => setOperations(e.target.value)} /> Factorial Finder</label>
                <label htmlFor="reverseString">  <input type="radio" name="operation" id="reverseString" value="reverseString" onChange={(e) => setOperations(e.target.value)} /> Reverse String</label>
                <label htmlFor="primeFinder">  <input type="radio" name="operation" id="primeFinder" value="primeFinder" onChange={(e) => setOperations(e.target.value)} /> Prime Finder</label>
                <label htmlFor="sumOfDigit">  <input type="radio" name="operation" id="sumOfDigit" value="sumOfDigit" onChange={(e) => setOperations(e.target.value)} /> sum of digits</label>
                <button disabled={operations === ""} className="bg-black px-8 py-3  rounded-2xl text-white text-base">{
                    operations === "isPalindrome" ? "Check Palindrome" : operations === "factorial" ? "Calculate Factorial" : operations === "reverseString" ? "reverse String" : operations === "primeFinder" ? "Find Prime" : operations==="sumOfDigit"? "Find SumOfDigits":"Select Operations"
                }</button>

                {result !== null && <p>{result}</p>}
            </form>
        </div>
    )
}

export default FunctionDeepDive