import { useContext } from 'react'
import { CartContext } from '../context/cartContext'
import { ModifierContext } from '../context/modifierContext'
import axios from 'axios'
import '../styles/pages/Cart.scss'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const { cart, removeItem, cartTotal, clearCart } = useContext(CartContext)
  const { modifiers } = useContext(ModifierContext)
  const navigate = useNavigate()

  const handleConfirm = async () => {
    if (cart.length === 0) return alert("Votre panier est vide")

    const product_orders = cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      unit_price: item.unit_price,
      comment: item.comment,
      modifiers: item.modifiers
    }))

    navigate('/paiement')
  }

  const renderModifiers = (modifierIds) => {
    const mods = modifierIds.map(id => modifiers.find(m => m._id === id)).filter(Boolean)
    const grouped = { option: [], sauce: [], supplément: [] }
    mods.forEach(m => grouped[m.type].push(m.name))

    return (
      <div className='cart-modifiers'>
        {grouped.option.length > 0 && <p><strong>Option :</strong> {grouped.option.join(', ')}</p>}
        {grouped.sauce.length > 0 && <p><strong>Sauces :</strong> {grouped.sauce.join(', ')}</p>}
        {grouped.supplément.length > 0 && <p><strong>Suppléments :</strong> {grouped.supplément.join(', ')}</p>}
      </div>
    )
  }

  return (
    <div className='cart-page'>
      <h1>Mon Panier</h1>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul className='cart-list'>
          {cart.map(item => (
            <li key={item.tempId} className='cart-item'>
              <div>
                <strong>{item.quantity}×</strong> {item.productName}
                {renderModifiers(item.modifiers)}
                {item.comment && <p>Commentaire : {item.comment}</p>}
              </div>
              <div className='price'>
                {(item.unit_price * item.quantity).toFixed(2)} €
                <button onClick={() => removeItem(item.tempId)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <>
          <h2>Total : {cartTotal.toFixed(2)} €</h2>
          <button className='btn-confirm' onClick={handleConfirm}>Valider la commande</button>
        </>
      )}
    </div>
  )
}

export default Cart