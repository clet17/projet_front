import { useEffect, useState } from 'react' 
import axios from 'axios'
import '../styles/pages/UserOrders.scss'

function UserOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Récupère les commandes de l’utilisateur connecté
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`, {
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

  // Appelle la récupération des commandes au chargement + toutes les 10 secondes
  useEffect(() => {
    fetchOrders()

    const interval = setInterval(() => {
      fetchOrders()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Sépare les commandes en cours et les commandes terminées
  const ongoing = orders.filter(o => o.status !== 'Récupérée')
  const completed = orders.filter(o => o.status === 'Récupérée')

  // Affiche un produit d’une commande
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
      <p><strong>Statut :</strong> {order.status}</p>
      <ul>{order.product_orders.map((po, index) => renderProductOrder(po, index))}</ul>
      <p className='total'>Total : {order.total_price.toFixed(2)} €</p>
    </div>
  )

  // Affiche un message pendant le chargement
  if (loading) return <p>Chargement...</p>

  return (
    <div className='user-orders-page'>
      <h1>Mes Commandes</h1>

      {/* Bloc pour les commandes non récupérées */}
      {ongoing.length > 0 && (
        <section>
          <h2>Commandes en cours</h2>
          {ongoing.map(o => renderOrder(o, true))}
        </section>
      )}

      {/* Bloc pour les commandes terminées */}
      {completed.length > 0 && (
        <section>
          <h2>Historique</h2>
          {completed.map(o => renderOrder(o))}
        </section>
      )}

      {/* Message si aucune commande */}
      {orders.length === 0 && <p>Aucune commande trouvée.</p>}
    </div>
  )
}

export default UserOrders
