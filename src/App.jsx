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
import ProductInfo from './pages/productInfo/SongDetails'
import AddProduct from './pages/admin/pages/AddProduct'
import UpdateProduct from './pages/admin/pages/UpdateProduct'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Allproducts from './pages/allproduct/Allproduct'
import Player from './components/player/Player'
import ContactUs from './components/contact/Contact'
import FullPageProfile from './components/profile/Profile'
import Onboarding from './components/profile/newProfile'
import SongDetails from './pages/productInfo/SongDetails'

function App() {


  return (
    <>
      <MyStates>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            } />
            <Route path="/order/:id" element={
              <ProtectedRoute>
                <SongDetails />
              </ProtectedRoute>
            } />


            <Route path="/profile" element={
              <ProtectedRoute>
                {/* <FullPageProfile /> */}
                <Onboarding></Onboarding>
              </ProtectedRoute>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Home />} />
            <Route path="/contact" element={<ContactUs />} />
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

  if (admin.user.email === 'durshbeats@gmail.com') {
    return children
  } else {
    return <Navigate to={'/login'} />
  }
}