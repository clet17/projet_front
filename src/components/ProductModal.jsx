function ProductModal({ product, onClose }) {
  const { addItem } = useContext(CartContext)
  const { modifiers } = useContext(ModifierContext)

  // On récupère uniquement les modificateurs liés au produit actuel
  const productModifiers = modifiers.filter(m => product.modifiers.includes(m._id))

  const [quantity, setQuantity] = useState(1)
  const [selectedMods, setSelectedMods] = useState([])
  const [comment, setComment] = useState('')

  // Récupère les modificateurs sélectionnés d'un certain type (option, sauce, supplément)
  const getSelectedByType = (type) => {
    return productModifiers.filter(m => m.type === type && selectedMods.includes(m._id))
  }

  // Permet de cocher/décocher un modificateur avec des règles selon le type
  const toggleModifier = (id) => {
    const modifier = productModifiers.find(m => m._id === id)
    if (!modifier) return

    const isSelected = selectedMods.includes(id)
    const selectedOfType = getSelectedByType(modifier.type)

    if (isSelected) {
      // Si déjà sélectionné → on le retire
      setSelectedMods(prev => prev.filter(mid => mid !== id))
    } else {
      // Limite : 1 option max, 2 sauces max
      if (modifier.type === 'option' && selectedOfType.length >= 1) return
      if (modifier.type === 'sauce' && selectedOfType.length >= 2) return
      setSelectedMods(prev => [...prev, id])
    }
  }

  // Calcule le prix unitaire en fonction des modificateurs choisis
  const unitPrice = product.price + selectedMods.reduce((total, id) => {
    const mod = modifiers.find(m => m._id === id)
    return total + (mod ? mod.price : 0)
  }, 0)

  const totalPrice = (unitPrice * quantity).toFixed(2)

  // Quand on valide, on ajoute le produit au panier avec les options choisies
  const handleAdd = () => {
    addItem(product, quantity, selectedMods, comment)
    onClose()
  }

  // On groupe les modificateurs par type pour l'affichage
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

        {/* Affichage des modificateurs disponibles */}
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

        {/* Champ pour la quantité */}
        <label>
          Quantité
          <input type='number' min='1' value={quantity} onChange={e => setQuantity(Number(e.target.value) || 1)} />
        </label>

        {/* Champ pour commentaire libre */}
        <label>
          Commentaire
          <textarea value={comment} onChange={e => setComment(e.target.value)} />
        </label>

        {/* Affichage du prix total */}
        <p className='total'>Prix : {totalPrice} €</p>

        {/* Si dispo → bouton commander */}
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
