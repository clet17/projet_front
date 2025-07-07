import { Link } from 'react-router-dom'
import '../styles/components/AdminBackButton.scss'

function AdminBackButton() {
  return (
    <div className="admin-back-button">
      <Link to="/admin">← Retour au dashboard</Link>
    </div>
  )
}

export default AdminBackButton