import { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../context/productContext'
import { ProductCategoryContext } from '../context/productCategoryContext'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import '../styles/pages/Order.scss'


function Order() {
  const { products, fetchProducts } = useContext(ProductContext)
  const { categories, fetchCategories } = useContext(ProductCategoryContext)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const openModal = (product) => setSelectedProduct(product)
  const closeModal = () => setSelectedProduct(null)

  return (
    <div className='order-page'>
      <h1>Passer commande</h1>
      {categories.map(cat => (
        <section key={cat._id}>
          <h2>{cat.name}</h2>
          <div className='grid-products'>
            {products.filter(p => p.category?._id === cat._id).map(p => (
              <ProductCard key={p._id} product={p} onSelect={openModal} />
            ))}
          </div>
        </section>
      ))}

      {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
    </div>
  )
}

export default Order