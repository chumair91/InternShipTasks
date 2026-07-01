import { useState } from "react";
import { Link } from "react-router-dom";


const employees = [
    { name: "Ali", age: 28, dept: "Engineering", salary: 75000 },
    { name: "Sara", age: 34, dept: "Marketing", salary: 65000 },
    { name: "Bilal", age: 25, dept: "Engineering", salary: 60000 },
    { name: "Hira", age: 30, dept: "Design", salary: 70000 },
    { name: "Usman", age: 40, dept: "Engineering", salary: 95000 }
];



const ArrayMethods = () => {
    const [result, setResult] = useState([])

    const getNames = () => {
        const names = employees.map(e => e.name)
        console.log(names);
        setResult(names)

    }

    const getOnlyEngDeptEmp = () => {
        const emp = employees.filter(e => e.dept === "Engineering");
        console.log(emp);
        const names = emp.map(e => e.name)
        setResult(names)
    }

    const getTotalSalary = () => {
        const salary = employees.reduce((sum, e) => sum + e.salary, 0);
        setResult("Total Saalry: " + salary)
    }
    const FindHira = () => {
        const name = employees.find(e => e.name.includes("Hira"));
        console.log(name);
        setResult("Check console")
    }

    const sortEmpByAge = () => {
        const emp = [...employees].sort((a, b) => a.age - b.age);
        console.log(emp);

    }
    const Earning90k = () => {
        const res = employees.some(e => e.salary >= 90000);
        setResult("Does anyone earn 90k or more: "+ res)
    }
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="flex justify-center items-center flex-col gap-2">
                 <Link to="/task3"> <button className="bg-amber-300 px-5 py-2  rounded-2xl text-black text-base">Go Back</button></Link>
                <button onClick={getNames} className="bg-black px-8 py-3  rounded-2xl text-white text-base">GetNames</button>
                <button onClick={getOnlyEngDeptEmp} className="bg-black px-8 py-3  rounded-2xl text-white text-base">Get Engineers</button>
                <button onClick={getTotalSalary} className="bg-black px-8 py-3  rounded-2xl text-white text-base">Get Total Salary</button>
                <button onClick={FindHira} className="bg-black px-8 py-3  rounded-2xl text-white text-base">Find Hira</button>
                <button onClick={sortEmpByAge} className="bg-black px-8 py-3  rounded-2xl text-white text-base">Sort By Age</button>
                <button onClick={Earning90k} className="bg-black px-8 py-3  rounded-2xl text-white text-base">Earning90k</button>
                {result.length !== 0 && <p>{result}</p>}
            </div>
        </div>
    )
}

export default ArrayMethods