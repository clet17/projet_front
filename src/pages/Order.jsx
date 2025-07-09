import { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../context/productContext'
import { ProductCategoryContext } from '../context/productCategoryContext'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import '../styles/pages/Order.scss'

function Order() {
  // Récupération des produits et catégories via les contextes
  const { products, fetchProducts } = useContext(ProductContext)
  const { categories, fetchCategories } = useContext(ProductCategoryContext)

  // État pour savoir quel produit est sélectionné (pour ouvrir la modale)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Chargement des données au montage
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Ouvre la modale avec le produit sélectionné
  const openModal = (product) => setSelectedProduct(product)

  // Ferme la modale
  const closeModal = () => setSelectedProduct(null)

  return (
    <div className='order-page'>
      <h1>Passer commande</h1>

      {/* Affichage des produits regroupés par catégorie */}
      {categories.map(cat => (
        <section key={cat._id}>
          <h2>{cat.name}</h2>
          <div className='grid-products'>
            {products
              .filter(p => p.category?._id === cat._id)
              .map(p => (
                <ProductCard key={p._id} product={p} onSelect={openModal} />
              ))
            }
          </div>
        </section>
      ))}

      {/* Affichage de la modale si un produit est sélectionné */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
    </div>
  )
}

export default Order
