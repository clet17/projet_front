import { useContext, useState } from 'react'
import { CartContext } from '../context/cartContext'
import { ModifierContext } from '../context/modifierContext'
import '../styles/components/ProductModal.scss'

function ProductModal({ product, onClose }) {
  const { addItem } = useContext(CartContext)
  const { modifiers } = useContext(ModifierContext)

  const productModifiers = modifiers.filter(m => product.modifiers.includes(m._id))

  const [quantity, setQuantity] = useState(1)
  const [selectedMods, setSelectedMods] = useState([])
  const [comment, setComment] = useState('')

  const getSelectedByType = (type) => {
    return productModifiers.filter(m => m.type === type && selectedMods.includes(m._id))
  }

  const toggleModifier = (id) => {
    const modifier = productModifiers.find(m => m._id === id)
    if (!modifier) return

    const isSelected = selectedMods.includes(id)
    const selectedOfType = getSelectedByType(modifier.type)

    if (isSelected) {
      setSelectedMods(prev => prev.filter(mid => mid !== id))
    } else {
      if (modifier.type === 'option' && selectedOfType.length >= 1) return
      if (modifier.type === 'sauce' && selectedOfType.length >= 2) return
      setSelectedMods(prev => [...prev, id])
    }
  }

  const unitPrice = product.price + selectedMods.reduce((total, id) => {
    const mod = modifiers.find(m => m._id === id)
    return total + (mod ? mod.price : 0)
  }, 0)

  const totalPrice = (unitPrice * quantity).toFixed(2)

  const handleAdd = () => {
    addItem(product, quantity, selectedMods, comment)
    onClose()
  }

  const groupedMods = { option: [], sauce: [], supplément: [] }
  productModifiers.forEach(m => groupedMods[m.type].push(m))

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <button className='close' onClick={onClose}>✕</button>
        <img className='big-img' src={`${import.meta.env.VITE_API_URL}/${product.image}`} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p><strong>Allergènes :</strong> {product.allergens || '—'}</p>

        <div className='modifiers-block'>
          {['option', 'sauce', 'supplément'].map(type => (
            groupedMods[type].length > 0 && (
              <div key={type}>
                <strong>{type.charAt(0).toUpperCase() + type.slice(1)}s</strong>
                {groupedMods[type].map(m => {
                  const selectedOfType = getSelectedByType(type)
                  const isDisabled =
                    (type === 'option' && selectedOfType.length >= 1 && !selectedMods.includes(m._id)) ||
                    (type === 'sauce' && selectedOfType.length >= 2 && !selectedMods.includes(m._id))

                  return (
                    <label key={m._id}>
                      <input
                        type='checkbox'
                        checked={selectedMods.includes(m._id)}
                        onChange={() => toggleModifier(m._id)}
                        disabled={isDisabled}
                      />
                      {m.name} (+{m.price.toFixed(2)}€)
                    </label>
                  )
                })}
              </div>
            )
          ))}
        </div>

        <label>
          Quantité
          <input type='number' min='1' value={quantity} onChange={e => setQuantity(Number(e.target.value) || 1)} />
        </label>

        <label>
          Commentaire
          <textarea value={comment} onChange={e => setComment(e.target.value)} />
        </label>

        <p className='total'>Prix : {totalPrice} €</p>

        {product.available ? (
          <button onClick={handleAdd}>Ajouter au panier</button>
        ) : (
          <p className='unavailable'>Produit indisponible</p>
        )}
      </div>
    </div>
  )
}

export default ProductModal