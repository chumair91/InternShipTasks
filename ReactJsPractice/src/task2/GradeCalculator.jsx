import { useState } from "react"
import { Link } from "react-router-dom"


const GradeCalculator = () => {
  const [marks, setMarks] = useState(null)
  const [grade, setGrade] = useState(null);
  const gradeCalculatorMethod = () => {
    let intMarks;
    if (marks) {
      intMarks = Number(marks);
    }
    if (intMarks > 100) {
      alert('Marks cant be greater than 100')
      return;
    }
    if (intMarks >= 90 && intMarks <= 100) {
      setGrade('A')
    } else if (intMarks >= 80 && intMarks < 90) {
      setGrade('B')
    } else if (intMarks >= 70 && intMarks < 79) {
      setGrade('C')
    } else if (intMarks >= 60 && intMarks < 69) {
      setGrade('D')
    } else {
      setGrade('F')
    }

  }
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-3">
      <Link to="/task2"> <button className="bg-amber-300 px-5 py-2  rounded-2xl text-black text-base">Go Back</button></Link>
      <label htmlFor="marksInput">Write Your marks out of 100</label>
      <input className="border px-3 py-2" type="number" id="marksInput" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="write here" name="" id="" />
      <button className="bg-black px-8 py-3  rounded-2xl text-white text-base " onClick={gradeCalculatorMethod}>Calculate Grade</button>
      {grade && (<p>
        your grade is :  {grade}
      </p>)}
    </div>
  )
}

export default GradeCalculator