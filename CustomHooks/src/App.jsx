
import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import FetchGitUser from './pages/FetchGitUser'
import UseMemo from './pages/UseMemo'
import Parent from './pages/Parent'

const App = () => {
  return (

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/fetchgituser' element={<FetchGitUser />} />
      <Route path='/usememo' element={<UseMemo />} />
      <Route path='/parent' element={<Parent />} />
    </Routes>
  )
}

export default App
