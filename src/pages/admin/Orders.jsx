import { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/pages/AdminOrders.scss'
import AdminBackButton from '../../components/AdminBackButton'

function AdminOrders() {
  // État pour stocker les commandes et gérer le chargement
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Récupère toutes les commandes depuis l'API
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setOrders(res.data)
    } catch (err) {
      console.error(err)
      alert("Erreur lors du chargement des commandes")
    } finally {
      setLoading(false)
    }
  }

  // Met à jour le statut d’une commande
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/order/${id}`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      fetchOrders()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la mise à jour du statut")
    }
  }

  // Chargement initial et mise à jour auto toutes les 10s
  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  // Séparation des commandes selon leur statut
  const ongoing = orders.filter(o => o.status !== 'Récupérée')
  const completed = orders.filter(o => o.status === 'Récupérée')

  // Affiche les détails d’un produit dans la commande
  const renderProductOrder = (po, index) => {
    const mods = po.modifiers.map(m => m.name).join(', ')
    return (
      <li key={po._id || index} className='product-line'>
        <span>{po.quantity}× {po.product?.name || 'Produit'}</span>
        <span>{mods && `Avec : ${mods}`}</span>
        {po.comment && <em>Commentaire : {po.comment}</em>}
        <span>{po.unit_price.toFixed(2)} €</span>
      </li>
    )
  }

  // Affiche une commande complète
  const renderOrder = (order, isHighlighted = false) => (
    <div key={order._id} className={`order-card ${isHighlighted ? 'highlight' : ''}`}>
      <h3>Commande du {new Date(order.order_date).toLocaleString()}</h3>
      <p><strong>Client :</strong> {order.user?.first_name} {order.user?.last_name} ({order.user?.phone})</p>
      <label>
        Statut :
        <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
          <option>En attente</option>
          <option>En préparation</option>
          <option>Prête</option>
          <option>Récupérée</option>
        </select>
      </label>
      <ul>{order.product_orders.map((po, i) => renderProductOrder(po, i))}</ul>
      <p className='total'>Total : {order.total_price.toFixed(2)} €</p>
    </div>
  )

  if (loading) return <p>Chargement...</p>

  return (
    <div className='admin-orders-page'>
      <AdminBackButton />
      <h1>Commandes clients</h1>

      {/* Bloc des commandes en cours */}
      {ongoing.length > 0 && (
        <section>
          <h2>Commandes en cours</h2>
          {ongoing.map(o => renderOrder(o, true))}
        </section>
      )}

      {/* Bloc historique */}
      {completed.length > 0 && (
        <section>
          <h2>Historique</h2>
          {completed.map(o => renderOrder(o))}
        </section>
      )}

      {orders.length === 0 && <p>Aucune commande enregistrée.</p>}
    </div>
  )
}

export default AdminOrders
