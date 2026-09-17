
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Product from './pages/Product'
import ProtectedRoute from './middleware/ProtectedRoute'
import PublicRoute from './middleware/PublicRoute'
import Home from './pages/Home'
import Subscribe from './pages/subscribe'


import Plan from './pages/Plan'
import Checkout from './pages/Checkout'
import SuccessPayment from './pages/SuccessPayment'
import { Toaster } from 'sonner';
import ProductDetails from './pages/ProductDetails'
import TimeTest from './pages/TimeTest'
import Cart from './pages/Cart'
import { OrderPaymentSuccess } from './pages/OrderPaymentSuccess'


import AdminNewLayout from './admin/AdminNewLayout'
import AdminNewHome from './admin/AdminNewHome'
import AdminCustomerSupport from './admin/AdminCustomerSupport'
import UserLayout from './user/UserLayout'
import AdminRoute from './middleware/AdminRoute'


const App = () => {


  return (
    <>

      <Routes>
        <Route element={<UserLayout />} >
          <Route path='/' element={<Home />} />
          <Route path='/timetest' element={<TimeTest />} />
          <Route path='subscribe' element={<Subscribe />} />
          <Route path='/login' element={<PublicRoute>
            <Login />
          </PublicRoute>} />
          <Route path='/products' element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          } />
          <Route path='/product/:id' element={
            <ProtectedRoute>
              <ProductDetails />
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
          <Route path='/cart' element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />

          <Route path='/payment-success' element={<SuccessPayment />} />
          <Route path='/order-payment-success' element={<OrderPaymentSuccess />} />
         
        </Route >

        <Route path='/admin' element={<AdminRoute> <AdminNewLayout /></AdminRoute> }>
          <Route index element={<AdminNewHome />} />
          <Route path='support' element={<AdminCustomerSupport />} />
        </Route>
      </Routes>




      <Toaster richColors position="top-right" />
    </>
  )
}

export default App