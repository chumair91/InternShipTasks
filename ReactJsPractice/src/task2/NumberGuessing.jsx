import { useEffect, useState } from "react";
import { Link } from "react-router-dom"


const NumberGuessing = () => {
  const [guess, setGuess] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [randomNum, setRandomNum] = useState(null);
  const [result, setResult] = useState(null)

  const guessHandler = (e) => {
    e.preventDefault()
    if (guess === "") {
      alert("Enter a number");
      return;
    }
    if (guesses.length === 5) {
      alert('Only 5 guesses Are allowed')
      return;
    }
    if (randomNum === null) {
      alert("No random num Generated")
      return;
    }

    if (Number(guess) < randomNum) {
      setResult("Too low")
    } else if (Number(guess) > randomNum) {
      setResult("Too high")
    } else if (Number(guess) === randomNum) {
      setResult("Correct");
      return;
    }
    const updateGuess = ([...guesses, guess]);
    setGuesses(updateGuess)

  }




  useEffect(() => {
    const RandomNumGenerator = () => {
      const randomNum = Math.floor(Math.random() * 50 + 1);
      setRandomNum(randomNum);

    }
    RandomNumGenerator();

  }, [])
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-3">
      <form className="flex flex-col justify-center items-center gap-3" onSubmit={guessHandler} >
        <Link to="/task2"> <button className="bg-amber-300 px-5 py-2  rounded-2xl text-black text-base">Go Back</button></Link>
        <p>We generated a random number for you </p>
        <p>Range: 1 to 50</p>
        <label >Guess a number</label>
        <input className="border px-3 py-2" type="number" id="marksInput" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="write here" required />

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i,index) => (
            <div key={i} className={`h-5 w-10 border rounded-md ${index < guesses.length? 'bg-red-600' : 'bg-gray-400'}`}></div>
          ))}


        </div>

        <div className="flex gap-2">
          <button className="bg-black px-8 py-3  rounded-2xl text-white text-base " type="submit">Guess</button>
          <button className="bg-red-500 px-8 py-3  rounded-2xl text-white text-base " onClick={() => setGuesses([])}>Reset</button>
        </div>

        {result && <p>{result}</p>}

      </form >

    </div >
  )
}

export default NumberGuessing