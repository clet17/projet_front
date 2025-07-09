function ProductCard({ product, onSelect }) {
  return (
    // Conteneur de la carte produit — si le produit n’est pas disponible, on ajoute une classe "disabled"
    <div className={`product-card ${!product.available ? 'disabled' : ''}`}>
      
      <img src={`${import.meta.env.VITE_API_URL}/${product.image}`} alt={product.name} />
      <h4>{product.name}</h4>
      <p>{product.ingredients}</p>
      <p className='price'>{product.price.toFixed(2)} €</p>

      {product.available ? (
        <button onClick={() => onSelect(product)}>Commander</button>
      ) : (
        <p className='unavailable'>Produit indisponible</p>
      )}
    </div>
  )
}

export default ProductCard