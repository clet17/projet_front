import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Register from './pages/Register'
import Login from './pages/Login'
import ProtectedRoute from './utils/ProtectedRoute'
import Profile from './pages/Profile'
import ProtectedAdminRoute from './utils/ProtectedAdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductCategories from './pages/admin/ProductCategory'
import AdminModifiers from './pages/admin/Modifiers'
import AdminProduct from './pages/admin/Product'
import Cart from './pages/Cart'
import Order from './pages/Order'
import UserOrders from './pages/UserOrders'
import AdminOrders from './pages/admin/Orders'
import Payment from './pages/Payment'
import Menu from './pages/Menu'

function App() {
  return (
    <>
    <NavBar />
    <Routes>
      <Route path='/' element={ <Home /> } />
      <Route path='/menu' element={ <Menu /> } />

      <Route path='/profile' element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path='/commander' element={
        <ProtectedRoute>
          <Order />
        </ProtectedRoute>
      } />
      <Route path='/panier' element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path='/paiement' element={
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      } />
      <Route path='/commandes' element={
        <ProtectedRoute>
          <UserOrders />
        </ProtectedRoute>
      } />

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='/admin' element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/categories" element={
        <ProtectedAdminRoute>
          <AdminProductCategories />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/modifiers" element={
        <ProtectedAdminRoute>
          <AdminModifiers />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedAdminRoute>
          <AdminProduct />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedAdminRoute>
          <AdminOrders />
        </ProtectedAdminRoute>
      } />
      <Route path='*' element={<p>404 - Page non trouvée</p>} />
    </Routes>
    <Footer />
    </>
  )
}

export default App
