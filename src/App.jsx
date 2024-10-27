import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Home from './pages/home/Home'
import Order from './pages/order/Order'
import Cart from './pages/cart/Cart'
import Dashboard from './pages/admin/dashboard/Dashboard'
import Nopage from './pages/nopage/Nopage'
import MyStates from './context/data/myStates'
import Login from './pages/registration/Login'
import Signup from './pages/registration/Signup'
import ProductInfo from './pages/productInfo/ProductInfo'
import AddProduct from './pages/admin/pages/AddProduct'
import UpdateProduct from './pages/admin/pages/UpdateProduct'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Allproducts from './pages/allproduct/Allproduct'
import Player from './components/player/Player'
import { AnimatedGridDemo } from './pages/cart/AnimatedGridPattern'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MyStates>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/allproducts" element={<Allproducts />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/productinfo/:id" element={<ProductInfo />} />
            <Route path="/addproduct" element={

              <ProtectedRoute>
                <AddProduct />

              </ProtectedRoute>
            } />
            <Route path="/updateproduct" element={
              <ProtectedRoute>
                <UpdateProduct />
              </ProtectedRoute>
            } />
            <Route path="/*" element={<Nopage />} />
          </Routes>
          <ToastContainer />
        </Router>
      </MyStates>
    </>
  )
}

export default App


export const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (user) {
    return children
  } else {
    return <Navigate to={'/login'} />
  }
}

export const ProtecteRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('user'))

  if (admin.user.email === 'admin@gmail.com') {
    return children
  } else {
    return <Navigate to={'/login'} />
  }
}