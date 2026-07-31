import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Product from './pages/Product'
import ProtectedRoute from './middleware/ProtectedRoute'
import PublicRoute from './middleware/PublicRoute'
import Home from './pages/Home'
import Subscribe from './pages/subscribe'
import Navbar from './components/Navbar'
import { userContext } from './context/UserAuthContext'
import Plan from './pages/Plan'
import Checkout from './pages/Checkout'
import SuccessPayment from './pages/SuccessPayment'
import { Toaster } from 'sonner';


const App = () => {
  const { user } = useContext(userContext);

  return (
    <>
      <Navbar username={user?.name} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='subscribe' element={<Subscribe />} />
        <Route path='/login' element={<PublicRoute>
          <Login />
        </PublicRoute>} />
        <Route path='/products' element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        } />
        <Route path='/plan' element={
          <ProtectedRoute>
            <Plan />
          </ProtectedRoute>
        } />
        <Route path='/plan/checkout' element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        <Route path='/payment-success' element={<SuccessPayment />} />
      </Routes>
       <Toaster richColors position="top-right" />
    </>
  )
}

export default App