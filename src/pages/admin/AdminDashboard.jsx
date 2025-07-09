import { Link } from 'react-router-dom'
import '../../styles/pages/AdminDashboard.scss'

//Dashboard de l'admin permenant de naviguer vers ses pages
function AdminDashboard() {
  return (
    <main className='admin-dashboard'>
      <h1>Dashboard Admin</h1>
      <ul>
        <li><Link to='/admin/categories'>Gérer les catégories</Link></li>
        <li><Link to='/admin/products'>Gérer les produits</Link></li>
        <li><Link to='/admin/modifiers'>Gérer les modificateurs</Link></li>
        <li><Link to='/admin/orders'>Gérer les commandes</Link></li>
      </ul>
    </main>
  )
}

export default AdminDashboard
