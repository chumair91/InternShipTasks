import { Link, Route, Routes } from 'react-router-dom'
import UnitConvertor from './task1/UnitConvertor'
import Task2Home from './task2/Task2Home'
import FizzBuzz from './task2/FizzBuzz'
import GradeCalculator from './task2/GradeCalculator'
import NumberGuessing from './task2/NumberGuessing'
import Task3Home from './task3/task3home'
import FunctionDeepDive from './task3/FunctionDeepDive'
import ArrayMethods from './task3/ArrayMethods'
import Destructuring from './task3/Destructuring'
import Task5Home from './task5/Task5Home'
import AsyncAwait from './task5/AsyncAwait'
import Task4Home from './task4/Task4Home'

import Task6Home from './task6/Task6Home'
import ProfileList from './components/ProfileList'
import Cart from './components/Cart'

const Home = () => {
  return (
    <div className='h-screen w-screen flex  justify-center items-center'>
      <div className='bg-amber-300 flex flex-col gap-4 items-center px-7 py-16 rounded-lg'>
        <h1 className='text-6xl font-bold '>Welcome</h1>
        <p className='text-lg text-gray-600'>Please choose a task:</p>


        <ul className='flex flex-col gap-3'>
          <li className='bg-black px-6 py-2 text-lg text-white'><Link to="/task1">Task 1</Link></li>
          <li className='bg-black px-6 py-2 text-lg  text-white'><Link to="/task2">Task 2</Link></li>
          <li className='bg-black px-6 py-2 text-lg  text-white'><Link to="/task3">Task 3</Link></li>
          <li className='bg-black px-6 py-2 text-lg  text-white'><Link to="/task4">Task 4</Link></li>
          <li className='bg-black px-6 py-2 text-lg  text-white'><Link to="/task5">Task 5</Link></li>
          <li className='bg-black px-6 py-2 text-lg  text-white'><Link to="/task6">Task 6</Link></li>

        </ul>

      </div>

    </div>
  )
}

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task1" element={<UnitConvertor />} />
        <Route path="/task2" element={<Task2Home />} />
        <Route path="/task3" element={<Task3Home />} />
        <Route path="/task2/fizzbuzz" element={<FizzBuzz />} />
        <Route path="/task2/gradecalculator" element={<GradeCalculator />} />
        <Route path="/task2/numberguessing" element={<NumberGuessing />} />
        <Route path="/task3/functiondeepdive" element={<FunctionDeepDive />} />
        <Route path="/task3/arraymethods" element={<ArrayMethods />} />
        <Route path="/task3/destructuring" element={<Destructuring />} />
        <Route path="/task4" element={<Task4Home />} />
        <Route path="/task5" element={<Task5Home />} />
        <Route path="/task5/asyncawait" element={<AsyncAwait />} />
        <Route path="/task6" element={<Task6Home />} />
        <Route path="/task6/profilelist" element={<ProfileList />} />
        <Route path="/task6/shoppingcart" element={<Cart />} />

      </Routes>
    </div>
  )
}

export default App