import { useState } from "react";

const students = [
  {
    id: 1,
    name: "Ali",
    age: 20,
    course: "React"
  },
  {
    id: 2,
    name: "Sara",
    age: 21,
    course: "Node"
  }
];



const Destructuring = () => {
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [course, setCourse] = useState("")
  const [option, setOption] = useState("")

  const addStudent = (newStudent) => {
    const updated = [...students, newStudent]
    console.log(updated);

    return updated
  }
  const getStudentById = (id) => {
    const studentf = students.find((f) => f.id == id);
    return studentf;
  }

  const updateStudent = (id, updates) => {

    return students.map(s => {
      if (s.id === id) {
        return { ...students, ...updates }

      }
      return s;
    })

  }

  const deleteStudent = (id) => {
    const delStudent = students.filter(s => s.id !== id);
    return delStudent;
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (option === "addStudent") {
      const { id } = students[students.length - 1];

      const newStudent = {
        id: id + 1,
        name: name,
        age: age,
        course: course
      }

      console.log(addStudent(newStudent));

    } else if (option === "getStudentById") {

      console.log(getStudentById(id));

    } else if (option === "updateStudent") {
      const updates = {
        name: name,
        age: age,
        course: course
      }

      const updatedStudent = updateStudent(Number(id), updates);
      console.log(updatedStudent);

    }else if (option==="deleteStudent") {
      console.log(deleteStudent(Number(id)));
      
    }

  }
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <form onSubmit={submitHandler} className="flex justify-center items-center flex-col gap-2">

        {(option === "getStudentById" || option === "updateStudent" || option==="deleteStudent") && <>
          <label  >Write student Id</label>
          <input className="border px-3 py-2" type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </>}


        {(option == + "addStudent" || option === "updateStudent") && <>
          <label >Write student name</label>
          <input className="border px-3 py-2" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <label >Write student age</label>
          <input className="border px-3 py-2" type="text" value={age} onChange={(e) => setAge(e.target.value)} />
          <label >Write student course</label>
          <input className="border px-3 py-2" type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
        </>}

        <label htmlFor="addStudent"> <input type="radio" name="option" value="addStudent" id="addStudent" onChange={(e) => setOption(e.target.value)} />Add Student</label>
        <label htmlFor="getStudentById"> <input type="radio" name="option" value="getStudentById" id="getStudentById" onChange={(e) => setOption(e.target.value)} />Get Student By id</label>
        <label htmlFor="updateStudent"> <input type="radio" name="option" value="updateStudent" id="updateStudent" onChange={(e) => setOption(e.target.value)} />Update Student</label>
        <label htmlFor="deleteStudent"> <input type="radio" name="option" value="deleteStudent" id="deleteStudent" onChange={(e) => setOption(e.target.value)} />Delete Student</label>


        <button type="submit" className="bg-black px-8 py-3  rounded-2xl text-white text-base" >Add Student</button>
      </form>
    </div>
  )
}

export default Destructuring